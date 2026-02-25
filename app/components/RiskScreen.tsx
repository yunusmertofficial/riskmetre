// app/components/RiskScreen.tsx
import { RiskLevel, UserLocation } from "@/app/lib/aftershockCalculator";
import { formatDistanceInfo } from "@/app/lib/distanceCalculator";

// Risk seviyelerine göre mesajları ve renkleri map'leyelim
// Bu, senin brief'indeki tabloyla %100 aynı
const riskData = {
  "🟢": {
    bgColor: "bg-green-600", // Tailwind CSS sınıfı
    title: "Risk Düşük",
    message: "Son 24 saatte ciddi artçı beklenmiyor.",
  },
  "🟡": {
    bgColor: "bg-yellow-500",
    title: "Dikkat",
    message: "Normalden fazla sismik hareket var. Tetikte kal.",
  },
  "🟠": {
    bgColor: "bg-orange-500",
    title: "Yüksek Risk",
    message: "Önümüzdeki 24 saatte zarar verebilecek artçı ihtimali artmış.",
  },
  "🔴": {
    bgColor: "bg-red-600",
    title: "Kritik",
    message:
      "Zarar verici artçı olasılığı yüksek. Açık alanda kalman önerilir.",
  },
};

interface RiskScreenProps {
  level: RiskLevel;
  mainshock: { location: string; magnitude: number } | null;
  probability?: number;
  distanceKm?: number;
  userLocation?: UserLocation;
}

export default function RiskScreen({
  level,
  mainshock,
  probability,
  distanceKm,
  userLocation,
}: RiskScreenProps) {
  const data = riskData[level];

  return (
    // Bu 'main' etiketi tüm ekranı kaplar ve rengi belirler
    <main
      className={`flex min-h-screen flex-col items-center justify-center p-8 text-white text-center transition-colors duration-500 ${data.bgColor}`}
    >
      {/* 1. Ana Başlık (Risk Seviyesi) */}
      <h1 className="text-5xl md:text-7xl font-bold mb-4">{data.title}</h1>

      {/* 2. Kullanıcıya Mesaj (Senin istediğin net cümle) */}
      <p className="text-xl md:text-3xl max-w-lg">{data.message}</p>

      {/* 3. Ek Bilgi (Hangi depreme göre hesaplandı?) */}
      <div className="mt-16 opacity-80 text-lg">
        {mainshock ? (
          <>
            <p>
              Bu analiz, <strong>{mainshock.location}</strong> bölgesindeki
            </p>
            <p>
              <strong>M{mainshock.magnitude.toFixed(1)}</strong> büyüklüğündeki
              depreme göre hesaplanmıştır.
            </p>

            {/* Konum bazlı bilgi */}
            {userLocation && distanceKm && (
              <div className="mt-4 p-4 bg-white/10 rounded-lg">
                <p className="text-sm font-medium mb-2">📍 Konumunuz:</p>
                <p className="text-sm">
                  {formatDistanceInfo(
                    distanceKm,
                    userLocation.city,
                    mainshock.location
                  )}
                </p>
                {userLocation.isManual && (
                  <p className="text-xs mt-1 opacity-75">(Manuel giriş)</p>
                )}
              </div>
            )}

            {/* İsteğe bağlı: Hesaplanan yüzdesel olasılığı gösterme */}
            {probability && (
              <p className="text-sm mt-4">
                (Hesaplanan Olasılık: %{probability.toFixed(1)})
              </p>
            )}
          </>
        ) : (
          <p>Son 24 saatte M4.0 üzeri deprem kaydedilmedi.</p>
        )}
      </div>
      {/* 4. Sorumluluk Reddi */}
      <p className="mt-12 max-w-2xl text-xs opacity-70">
        Bu bir deprem tahmini değildir. Bilimsel modellere dayalı istatistiksel
        bir artçı olasılık hesabıdır. Lütfen her zaman AFAD'ın resmi uyarılarını
        takip edin.
      </p>
      <p className="mt-1 text-xs opacity-70">Yunus Emre</p>
    </main>
  );
}
