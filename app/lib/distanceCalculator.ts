// app/lib/distanceCalculator.ts

/**
 * Haversine formülü ile iki nokta arasındaki mesafeyi hesaplar
 *
 * @param lat1 - İlk noktanın enlemi (derece)
 * @param lng1 - İlk noktanın boylamı (derece)
 * @param lat2 - İkinci noktanın enlemi (derece)
 * @param lng2 - İkinci noktanın boylamı (derece)
 * @returns İki nokta arasındaki mesafe (kilometre)
 *
 * @example
 * const distance = calculateDistance(39.9208, 32.8541, 40.7128, -74.0060);
 * console.log(`Mesafe: ${distance.toFixed(2)} km`);
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Dünya'nın yarıçapı (km)

  // Dereceyi radyana çevir
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Dereceyi radyana çevirir
 *
 * @param degrees - Derece cinsinden açı
 * @returns Radyan cinsinden açı
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Mesafeye göre risk faktörü hesaplar
 * Yakın mesafelerde risk artar, uzak mesafelerde azalır
 *
 * @param distanceKm - Mesafe (kilometre)
 * @param mainshockMagnitude - Ana şok büyüklüğü
 * @returns Risk faktörü (0-1 arası, 1 = maksimum risk)
 *
 * @example
 * const riskFactor = calculateDistanceRiskFactor(50, 7.4);
 * console.log(`Risk faktörü: ${riskFactor.toFixed(3)}`);
 */
export function calculateDistanceRiskFactor(
  distanceKm: number,
  mainshockMagnitude: number
): number {
  // Ana şok büyüklüğüne göre etki alanı hesapla
  // Büyük depremler daha geniş alanda etkili olur
  const effectiveRadius = Math.pow(10, (mainshockMagnitude - 4.0) / 2) * 10; // km

  // Mesafe faktörü: yakın mesafelerde yüksek, uzak mesafelerde düşük
  if (distanceKm <= effectiveRadius * 0.1) {
    return 1.0; // Çok yakın - maksimum risk
  } else if (distanceKm <= effectiveRadius * 0.3) {
    return 0.8; // Yakın - yüksek risk
  } else if (distanceKm <= effectiveRadius * 0.6) {
    return 0.5; // Orta mesafe - orta risk
  } else if (distanceKm <= effectiveRadius) {
    return 0.2; // Uzak - düşük risk
  } else {
    return 0.05; // Çok uzak - minimal risk
  }
}

/**
 * Konum bilgilerini formatlar ve kullanıcı dostu hale getirir
 *
 * @param distanceKm - Mesafe (kilometre)
 * @param userCity - Kullanıcının şehri (varsa)
 * @param earthquakeLocation - Depremin konumu
 * @returns Formatlanmış mesafe bilgisi
 *
 * @example
 * const info = formatDistanceInfo(45.2, "Ankara", "Elazığ");
 * console.log(info); // "Ankara'dan 45.2 km uzaklıkta (Elazığ)"
 */
export function formatDistanceInfo(
  distanceKm: number,
  userCity?: string,
  earthquakeLocation?: string
): string {
  const distance =
    distanceKm < 1
      ? `${(distanceKm * 1000).toFixed(0)} metre`
      : `${distanceKm.toFixed(1)} km`;

  if (userCity && earthquakeLocation) {
    return `${userCity}'dan ${distance} uzaklıkta (${earthquakeLocation})`;
  } else if (userCity) {
    return `${userCity}'dan ${distance} uzaklıkta`;
  } else if (earthquakeLocation) {
    return `${earthquakeLocation}'a ${distance} uzaklıkta`;
  } else {
    return `Deprem merkezine ${distance} uzaklıkta`;
  }
}
