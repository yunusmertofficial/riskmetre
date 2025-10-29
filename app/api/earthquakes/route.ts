// app/api/earthquakes/route.ts
import { NextRequest, NextResponse } from "next/server";

// AFAD'ın istediği 'YYYY-MM-DD HH:MM:SS' formatı için yardımcı fonksiyon
function formatAfadDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "Europe/Istanbul", // En önemli kısım: UTC+3'e zorla
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23", // 24 saat formatı (00-23)
  };

  // 'en-CA' (Kanada) lokasyonu 'YYYY-MM-DD' formatını sağlar.
  const formatter = new Intl.DateTimeFormat("en-CA", options);

  // Bu işlem "2025-10-30, 15:30:45" gibi bir çıktı üretir
  const formattedString = formatter.format(date);

  // Çıktıyı AFAD'ın URL formatına çevir:
  // "2025-10-30, 15:30:45" -> "2025-10-30%2015%3A30%3A45"
  return formattedString
    .replace(", ", "%20") // Virgül ve boşluğu %20 (boşluk) ile değiştir
    .replace(/:/g, "%3A"); // Tüm : (iki nokta) karakterlerini %3A ile değiştir
}
/**
 * AFAD deprem verilerini proxy'leyen API route
 * CORS sorununu çözer ve sunucu tarafında veri çeker
 *
 * @param request - Next.js request objesi
 * @returns AFAD deprem verileri JSON formatında
 *
 * @example
 * GET /api/earthquakes
 * Response: [{ eventID: "...", location: "...", ... }]
 */
export async function GET(request: NextRequest) {
  try {
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 24 * 60 * 60 * 1000); // 24 saat önce

    const start = formatAfadDate(startDate);
    const end = formatAfadDate(endDate);
    const url = `https://deprem.afad.gov.tr/apiv2/event/filter?start=${start}&end=${end}&orderby=timedesc`;
    console.log("Fetching AFAD data from URL:", url);
    // Sunucu tarafında fetch (CORS sorunu yok)
    const response = await fetch(url, {
      headers: {
        "User-Agent": "RiskMetre/1.0",
        Accept: "application/json",
      },
      // 30 saniye timeout
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      throw new Error(
        `AFAD API Hatası: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    // Cache kontrolü - 60 saniye cache
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Deprem verileri alınamadı",
        details: error instanceof Error ? error.message : "Bilinmeyen hata",
      },
      { status: 500 }
    );
  }
}
