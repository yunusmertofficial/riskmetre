// app/lib/afadApi.ts

// AFAD'dan gelen veri tipi (senin örneğine göre)
export interface AfadEarthquake {
  eventID: string;
  location: string;
  latitude: string; // API string veriyor
  longitude: string; // API string veriyor
  depth: string;
  magnitude: string; // API string veriyor
  date: string; // Örn: "2025-10-29T14:14:31"
  province: string;
}

export async function getLatestEarthquakes(): Promise<AfadEarthquake[]> {
  try {
    // Next.js API route'unu kullan (CORS sorunu yok)
    const res = await fetch("/api/earthquakes", {
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        `API Hatası: ${res.status} - ${errorData.details || res.statusText}`
      );
    }

    const data = await res.json();

    // Hata response'u kontrol et
    if (data.error) {
      throw new Error(data.details || data.error);
    }

    return data as AfadEarthquake[];
  } catch (error) {
    console.error("Deprem verisi çekilemedi:", error);
    // Hata yukarıya fırlatılır ki UI doğru şekilde hata ekranı gösterebilsin
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Deprem verileri alınamadı");
  }
}
