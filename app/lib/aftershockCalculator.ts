// app/lib/aftershockCalculator.ts
import {
  calculateDistance,
  calculateDistanceRiskFactor,
} from "./distanceCalculator";

export interface Mainshock {
  magnitude: number; // Örn: 7.4
  date: string; // Örn: "2025-10-29T14:14:31"
  latitude: number;
  longitude: number;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
  city?: string;
  isManual: boolean;
}

export type RiskLevel = "🟢" | "🟡" | "🟠" | "🔴";

export interface ProbabilityResult {
  probabilityPercent: number;
  expectedCount: number;
  riskLevel: RiskLevel;
  distanceKm?: number;
  distanceRiskFactor?: number;
  userLocation?: UserLocation;
}

/**
 * Reasenberg-Jones (1989) modeline dayalı 24 saatlik artçı olasılık hesaplayıcısı.
 * Konum bazlı risk hesaplaması ile kullanıcının bulunduğu yere göre kişiselleştirilmiş risk analizi.
 *
 * @param mainshock - Ana şok bilgileri (büyüklük, tarih, konum)
 * @param targetMagnitude - Hesaplanacak artçı şok büyüklük eşiği (varsayılan: 5.0)
 * @param timeWindowHours - Zaman penceresi (varsayılan: 24 saat)
 * @param userLocation - Kullanıcının konumu (opsiyonel, verilmezse genel risk hesaplanır)
 * @returns Artçı şok olasılığı ve risk seviyesi bilgileri (konum bazlı)
 *
 * @example
 * const mainshock = { magnitude: 7.4, date: "2025-10-29T14:14:31", latitude: 39.1, longitude: 28.0 };
 * const userLoc = { latitude: 39.9208, longitude: 32.8541, city: "Ankara", isManual: false };
 * const result = calculateAftershockProbability(mainshock, 5.0, 24, userLoc);
 * console.log(`Risk seviyesi: ${result.riskLevel}, Olasılık: %${result.probabilityPercent.toFixed(1)}`);
 */
export function calculateAftershockProbability(
  mainshock: Mainshock,
  targetMagnitude: number = 5.0,
  timeWindowHours: number = 24,
  userLocation?: UserLocation
): ProbabilityResult {
  // Model Parametreleri (Genel ortalama değerler)
  const b_value = 1.0;
  const a_value = -1.67; // Bölgesel üretkenlik sabiti
  const p_value = 1.08; // Azalma hızı
  const c_value = 0.05; // Gecikme faktörü (gün)

  // Zaman aralığını güne çevir
  const T1_days = 0; // Başlangıç (ana şoktan hemen sonra)
  const T2_days = timeWindowHours / 24; // Bitiş (örn: 1 gün)

  // Lambda (Beklenen artçı sayısı, M >= targetMagnitude için)
  // N(t) = 10^(a + b*(M_main - M_target)) * (t + c)^(-p)
  // Lambda = Integral(T1'den T2'ye) N(t) dt

  const productivity_term = Math.pow(
    10,
    a_value + b_value * (mainshock.magnitude - targetMagnitude)
  );
  const time_term =
    (Math.pow(T1_days + c_value, 1 - p_value) -
      Math.pow(T2_days + c_value, 1 - p_value)) /
    (p_value - 1);

  let lambda = productivity_term * time_term;

  // Konum bazlı risk hesaplaması
  let distanceKm: number | undefined;
  let distanceRiskFactor: number | undefined;

  if (userLocation) {
    // Kullanıcı konumu ile deprem merkezi arasındaki mesafeyi hesapla
    distanceKm = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      mainshock.latitude,
      mainshock.longitude
    );

    // Mesafeye göre risk faktörünü hesapla
    distanceRiskFactor = calculateDistanceRiskFactor(
      distanceKm,
      mainshock.magnitude
    );

    // Lambda'yı mesafe faktörü ile çarp (yakın mesafelerde risk artar)
    lambda *= distanceRiskFactor;
  }

  // Poisson Dağılımı:
  // P(N >= 1) = 1 - P(N = 0) = 1 - e^(-lambda)
  const probability_at_least_one_event = 1 - Math.exp(-lambda);
  const probabilityPercent = probability_at_least_one_event * 100;

  // Risk Seviyesini Belirleme (Senin belirlediğin eşiklere göre ayarlanabilir)
  let riskLevel: RiskLevel;
  if (probabilityPercent > 75) {
    riskLevel = "🔴";
  } else if (probabilityPercent > 40) {
    riskLevel = "🟠";
  } else if (probabilityPercent > 10) {
    riskLevel = "🟡";
  } else {
    riskLevel = "🟢";
  }

  return {
    probabilityPercent: probabilityPercent,
    expectedCount: lambda,
    riskLevel: riskLevel,
    distanceKm: distanceKm,
    distanceRiskFactor: distanceRiskFactor,
    userLocation: userLocation,
  };
}
