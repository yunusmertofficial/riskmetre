"use client";

import { useState, useEffect } from "react";
import { getLatestEarthquakes, AfadEarthquake } from "@/app/lib/afadApi";
import {
  calculateAftershockProbability,
  Mainshock,
  UserLocation,
} from "@/app/lib/aftershockCalculator";
import RiskScreen from "./RiskScreen";
import LocationManager from "./LocationManager";

// --- AYARLAR ---
const ANALYSIS_THRESHOLD_MAGNITUDE = 4.0;
const TARGET_AFTERSHOCK_MAGNITUDE = 5.0;
// ----------------

/**
 * Konum bazlı risk hesaplama uygulaması
 * Kullanıcının konumunu alır ve ona göre kişiselleştirilmiş artçı riski hesaplar
 */
export default function LocationBasedRiskApp() {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [earthquakes, setEarthquakes] = useState<AfadEarthquake[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadedFromStorage, setLoadedFromStorage] =
    useState<null | UserLocation>(null);

  // AFAD verilerini yükle
  useEffect(() => {
    const loadEarthquakes = async () => {
      try {
        setIsLoading(true);
        setError(null); // Hata state'ini temizle
        const data = await getLatestEarthquakes();
        setEarthquakes(data);
      } catch (err) {
        console.error("Deprem verisi yükleme hatası:", err);
        setError(
          err instanceof Error ? err.message : "Deprem verileri yüklenemedi"
        );
        setEarthquakes([]); // Hata durumunda boş array
      } finally {
        setIsLoading(false);
      }
    };

    loadEarthquakes();
  }, []);

  // LocalStorage'dan kayıtlı konumu yükle
  useEffect(() => {
    try {
      const raw = localStorage.getItem("riskmetre_user_location");
      console.log("localStorage'dan konum:", raw);
      if (raw) {
        const saved: UserLocation = JSON.parse(raw);
        console.log("Kaydedilen konum yüklendi:", saved);
        setUserLocation(saved);
        setLoadedFromStorage(saved);
      }
    } catch (error) {
      console.error("localStorage okuma hatası:", error);
    }
  }, []);

  // Konum değiştiğinde çağrılır
  const handleLocationChange = (location: UserLocation | null) => {
    setUserLocation(location);
    // Yeni konum seçildiğinde banner'ı güncelle (kaldırma)
    if (location) {
      setLoadedFromStorage(location);
    } else {
      setLoadedFromStorage(null);
    }
  };

  // Konum yoksa konum yöneticisini göster
  if (!userLocation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center p-4">
        <LocationManager onLocationChange={handleLocationChange} />
      </div>
    );
  }

  // Yükleniyor durumu
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Deprem verileri yükleniyor...</p>
        </div>
      </div>
    );
  }
  console.log("error", error);
  // Hata durumu
  if (error) {
    return (
      <>
        {loadedFromStorage && (
          <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 bg-white/10 text-white border border-white/20 px-4 py-2 rounded shadow">
            {loadedFromStorage.isManual
              ? "Yeni konum kaydedildi"
              : "Konum güncellendi"}
            :{" "}
            <strong>
              {loadedFromStorage.city ||
                `${loadedFromStorage.latitude.toFixed(
                  2
                )}, ${loadedFromStorage.longitude.toFixed(2)}`}
            </strong>
            . Değiştirmek ister misin?
            <button
              className="ml-3 underline hover:opacity-80"
              onClick={() => {
                setUserLocation(null);
                setLoadedFromStorage(null);
              }}
            >
              Konumu Değiştir
            </button>
          </div>
        )}
        <div className="min-h-screen bg-gradient-to-br from-red-900 to-orange-900 flex items-center justify-center p-4">
          <div className="text-white text-center">
            <h1 className="text-3xl font-bold mb-4">⚠️ Veri Hatası</h1>
            <p className="text-xl mb-6">Deprem verileri yüklenemedi</p>
            <p className="text-sm mb-6 opacity-75">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-white text-red-900 font-medium py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Tekrar Dene
            </button>
          </div>
        </div>
      </>
    );
  }

  // Durum 1: AFAD'dan veri gelmedi veya son 24 saatte deprem yok
  if (earthquakes.length === 0) {
    return (
      <>
        {loadedFromStorage && (
          <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 bg-white/10 text-white border border-white/20 px-4 py-2 rounded shadow">
            {loadedFromStorage.isManual
              ? "Yeni konum kaydedildi"
              : "Konum güncellendi"}
            :{" "}
            <strong>
              {loadedFromStorage.city ||
                `${loadedFromStorage.latitude.toFixed(
                  2
                )}, ${loadedFromStorage.longitude.toFixed(2)}`}
            </strong>
            . Değiştirmek ister misin?
            <button
              className="ml-3 underline hover:opacity-80"
              onClick={() => {
                setUserLocation(null);
                setLoadedFromStorage(null);
              }}
            >
              Konumu Değiştir
            </button>
          </div>
        )}
        <RiskScreen level="🟢" mainshock={null} userLocation={userLocation} />
      </>
    );
  }

  // Tüm M>=4 depremleri değerlendir ve kişisel riskte en yükseğini seç
  const candidates = earthquakes.filter(
    (eq) => parseFloat(eq.magnitude) >= ANALYSIS_THRESHOLD_MAGNITUDE
  );

  if (candidates.length === 0) {
    return (
      <>
        {loadedFromStorage && (
          <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 bg-white/10 text-white border border-white/20 px-4 py-2 rounded shadow">
            {loadedFromStorage.isManual
              ? "Yeni konum kaydedildi"
              : "Konum güncellendi"}
            :{" "}
            <strong>
              {loadedFromStorage.city ||
                `${loadedFromStorage.latitude.toFixed(
                  2
                )}, ${loadedFromStorage.longitude.toFixed(2)}`}
            </strong>
            . Değiştirmek ister misin?
            <button
              className="ml-3 underline hover:opacity-80"
              onClick={() => {
                setUserLocation(null);
                setLoadedFromStorage(null);
              }}
            >
              Konumu Değiştir
            </button>
          </div>
        )}
        <RiskScreen level="🟢" mainshock={null} userLocation={userLocation} />
      </>
    );
  }

  // Hesaplama hatası durumu için state
  const [calculationError, setCalculationError] = useState<string | null>(null);

  let best = {
    eq: candidates[0],
    result: null as ReturnType<typeof calculateAftershockProbability> | null,
  };

  let bestProb = -1;

  try {
    for (const eq of candidates) {
      try {
        const mainshock: Mainshock = {
          magnitude: parseFloat(eq.magnitude),
          date: eq.date,
          latitude: parseFloat(eq.latitude),
          longitude: parseFloat(eq.longitude),
        };

        // Koordinat validasyonu
        if (
          isNaN(mainshock.latitude) ||
          isNaN(mainshock.longitude) ||
          isNaN(mainshock.magnitude)
        ) {
          console.warn(`Geçersiz deprem verisi: ${eq.eventID}`, eq);
          continue;
        }

        const r = calculateAftershockProbability(
          mainshock,
          TARGET_AFTERSHOCK_MAGNITUDE,
          24,
          userLocation
        );

        if (r.probabilityPercent > bestProb) {
          best = { eq, result: r };
          bestProb = r.probabilityPercent;
        }
      } catch (eqError) {
        console.error(`Deprem hesaplama hatası (${eq.eventID}):`, eqError);
        // Tek deprem hatası tüm sistemi durdurmasın
        continue;
      }
    }

    if (!best.result) {
      throw new Error("Hiçbir deprem için geçerli hesaplama yapılamadı");
    }
  } catch (error) {
    console.error("Risk hesaplama hatası:", error);
    setCalculationError(
      error instanceof Error ? error.message : "Bilinmeyen hesaplama hatası"
    );
  }

  // Hesaplama hatası varsa hata ekranını göster
  if (calculationError) {
    return (
      <>
        {loadedFromStorage && (
          <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 bg-white/10 text-white border border-white/20 px-4 py-2 rounded shadow">
            {loadedFromStorage.isManual
              ? "Yeni konum kaydedildi"
              : "Konum güncellendi"}
            :{" "}
            <strong>
              {loadedFromStorage.city ||
                `${loadedFromStorage.latitude.toFixed(
                  2
                )}, ${loadedFromStorage.longitude.toFixed(2)}`}
            </strong>
            . Değiştirmek ister misin?
            <button
              className="ml-3 underline hover:opacity-80"
              onClick={() => {
                setUserLocation(null);
                setLoadedFromStorage(null);
              }}
            >
              Konumu Değiştir
            </button>
          </div>
        )}
        <div className="min-h-screen bg-gradient-to-br from-red-900 to-orange-900 flex items-center justify-center p-4">
          <div className="text-white text-center">
            <h1 className="text-3xl font-bold mb-4">⚠️ Hesaplama Hatası</h1>
            <p className="text-xl mb-6">
              Risk hesaplaması yapılırken hata oluştu
            </p>
            <p className="text-sm mb-6 opacity-75">{calculationError}</p>
            <button
              onClick={() => {
                setCalculationError(null);
                window.location.reload();
              }}
              className="bg-white text-red-900 font-medium py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Tekrar Dene
            </button>
          </div>
        </div>
      </>
    );
  }

  const chosen = best.result!;
  const chosenEq = best.eq;

  console.log("Render - loadedFromStorage:", loadedFromStorage);
  console.log("Render - userLocation:", userLocation);

  return (
    <>
      {loadedFromStorage && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 bg-white/10 text-white border border-white/20 px-4 py-2 rounded shadow">
          Kaydedilen konum:{" "}
          <strong>
            {loadedFromStorage.city ||
              `${loadedFromStorage.latitude.toFixed(
                2
              )}, ${loadedFromStorage.longitude.toFixed(2)}`}
          </strong>
          . Değiştirmek ister misin?
          <button
            className="ml-3 underline hover:opacity-80"
            onClick={() => {
              setUserLocation(null);
              setLoadedFromStorage(null);
            }}
          >
            Konumu Değiştir
          </button>
        </div>
      )}
      <RiskScreen
        level={chosen.riskLevel}
        mainshock={{
          location: chosenEq.location,
          magnitude: parseFloat(chosenEq.magnitude),
        }}
        probability={chosen.probabilityPercent}
        distanceKm={chosen.distanceKm}
        userLocation={chosen.userLocation}
      />
    </>
  );
}
