"use client";

import { useState, useEffect } from "react";

export interface UserLocation {
  latitude: number;
  longitude: number;
  city?: string;
  isManual: boolean; // GPS'ten mi yoksa manuel girişten mi geldiği
}

interface LocationManagerProps {
  onLocationChange: (location: UserLocation | null) => void;
}

/**
 * Kullanıcı konumunu yöneten bileşen
 * GPS konumu alır, başarısız olursa manuel giriş seçeneği sunar
 *
 * @param onLocationChange - Konum değiştiğinde çağrılan callback fonksiyonu
 * @returns Konum yönetimi UI'ı
 *
 * @example
 * <LocationManager onLocationChange={(loc) => setUserLocation(loc)} />
 */
export default function LocationManager({
  onLocationChange,
}: LocationManagerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualLocation, setManualLocation] = useState({
    latitude: "",
    longitude: "",
    city: "",
  });

  // GPS konumu alma fonksiyonu
  const getCurrentLocation = () => {
    setIsLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Tarayıcınız konum servisini desteklemiyor.");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location: UserLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          isManual: false,
        };
        onLocationChange(location);
        try {
          localStorage.setItem(
            "riskmetre_user_location",
            JSON.stringify(location)
          );
        } catch {}
        setIsLoading(false);
      },
      (error) => {
        let errorMessage = "Konum alınamadı. ";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += "Konum izni reddedildi.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += "Konum bilgisi mevcut değil.";
            break;
          case error.TIMEOUT:
            errorMessage += "Konum alma zaman aşımına uğradı.";
            break;
          default:
            errorMessage += "Bilinmeyen hata.";
        }
        setError(errorMessage);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 dakika cache
      }
    );
  };

  // Manuel konum girişi
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(manualLocation.latitude);
    const lng = parseFloat(manualLocation.longitude);

    if (isNaN(lat) || isNaN(lng)) {
      setError("Geçerli koordinat giriniz.");
      return;
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      setError("Koordinatlar geçerli aralıkta değil.");
      return;
    }

    const location: UserLocation = {
      latitude: lat,
      longitude: lng,
      city: manualLocation.city || undefined,
      isManual: true,
    };

    onLocationChange(location);
    try {
      localStorage.setItem("riskmetre_user_location", JSON.stringify(location));
    } catch {}
    setShowManualInput(false);
    setError(null);
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-md mx-auto">
      <h3 className="text-xl font-semibold mb-4 text-center">
        Konumunuzu Belirleyin
      </h3>

      {!showManualInput ? (
        <div className="space-y-4">
          <button
            onClick={getCurrentLocation}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            {isLoading ? "Konum alınıyor..." : "📍 GPS ile Konumumu Al"}
          </button>

          <button
            onClick={() => setShowManualInput(true)}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            📝 Manuel Giriş
          </button>
        </div>
      ) : (
        <form onSubmit={handleManualSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Enlem (Latitude)
            </label>
            <input
              type="number"
              step="any"
              placeholder="Örn: 39.9208"
              value={manualLocation.latitude}
              onChange={(e) =>
                setManualLocation((prev) => ({
                  ...prev,
                  latitude: e.target.value,
                }))
              }
              className="w-full px-3 py-2 rounded border border-gray-300 text-gray-900"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Boylam (Longitude)
            </label>
            <input
              type="number"
              step="any"
              placeholder="Örn: 32.8541"
              value={manualLocation.longitude}
              onChange={(e) =>
                setManualLocation((prev) => ({
                  ...prev,
                  longitude: e.target.value,
                }))
              }
              className="w-full px-3 py-2 rounded border border-gray-300 text-gray-900"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Şehir (İsteğe bağlı)
            </label>
            <input
              type="text"
              placeholder="Örn: Ankara"
              value={manualLocation.city}
              onChange={(e) =>
                setManualLocation((prev) => ({ ...prev, city: e.target.value }))
              }
              className="w-full px-3 py-2 rounded border border-gray-300 text-gray-900"
            />
          </div>

          <div className="flex space-x-2">
            <button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              Konumu Kaydet
            </button>
            <button
              type="button"
              onClick={() => setShowManualInput(false)}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              İptal
            </button>
          </div>
        </form>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded text-red-200 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
