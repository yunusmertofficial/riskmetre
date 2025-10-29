// app/api/earthquakes/route.ts
import { NextRequest, NextResponse } from "next/server";

// AFAD'ın istediği 'YYYY-MM-DD HH:MM:SS' formatı için yardımcı fonksiyon
function formatAfadDate(date: Date): string {
  const pad = (num: number) => num.toString().padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  // URL encoding için boşluğu %20, : karakterini %3A yap
  return `${year}-${month}-${day}%20${hours}%3A${minutes}%3A${seconds}`;
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
