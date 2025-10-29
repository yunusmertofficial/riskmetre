// app/page.tsx
import LocationBasedRiskApp from "@/app/components/LocationBasedRiskApp";

/**
 * Ana sayfa - Konum bazlı risk hesaplama uygulaması
 * Kullanıcının konumunu alır ve ona göre kişiselleştirilmiş artçı riski hesaplar
 */
export default function HomePage() {
  return <LocationBasedRiskApp />;
}
