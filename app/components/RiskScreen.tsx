LyogYXBwL2NvbXBvbmVudHMvUmlza1NjcmVlbi50c3gKaW1wb3J0IHsgUmlza0xldmVsLCBVc2VyTG9jYXRpb24gfSBmcm9tICJAL2FwcC9saWIvYWZ0ZXJzaG9ja0NhbGN1bGF0b3IiOwppbXBvcnQgeyBmb3JtYXREaXN0YW5jZUluZm8gfSBmcm9tICJAL2FwcC9saWIvZGlzdGFuY2VDYWxjdWxhdG9yIjsKCy8vIFJpc2sgc2V2aXllbGVyaW5lIGfDtnJlIG1lc2FqbGFyxLEgdmUgcmVuZ2xlcmkgbWFwJ2xleWVsaW0KLy8gQnUsIHNlbmluIGJyaWVmJ2luZGVraSB0YWJsb3lsYSAlMTAwIGF5bsSxCgpjb25zdCByaXNrRGF0YSA9IHsKICAi4pmKIjogewogICAgYmdDb2xvcjogImJnLWdyZWVuLTYwMCIsIC8vIFRhaWx3aW5kIENTUyBzaW7xZnEsCiAgICB0aXRsZTogIlJpc2sgRMfDvcW8ayIsCiAgICBtZXNzYWdlOiAiU29uIDI0IHNhYXR0ZSBjaWRkaSBhcnTDuXRhw6fEsSBiZWtsZW5taXlvci4iLAogIH0sCiAgIsKZIjogewogICAgYmdDb2xvcjogImJnLXllbGxvdy01MDAiLAogICAgdGl0bGU6ICJEaWtrYXQiLAogICAgbWVzc2FnZTogIk5vcm1hbGRlbiBmYXJsYSBzaXNtaWsgc2VuIGhhcmVrZXQgdmFyLiBUZXRpa3RlIGthbC4iLAogIH0sCiAgIsOUIjogewogICAgYmdDb2xvcjogImJnLW9yYW5nZS01MDAiLAogICAgdGl0bGU6ICJZb2tzZWsgUmlzayIsCiAgICBtZXNzYWdlOiAiw5Zuw7xtw7x6ZGVraSAyNCBzYWF0dGUgemFyYXIgdmVyZWJpbGVjZWsgYXJTw6fEsSBpaHRpbWFsZSBhcnRtxLFzLiIsCiAgfSwKICAi4pqKIjogewogICAgYmdDb2xvcjogImJnLXJlZC02MDAiLAogICAgdGl0bGU6ICJLcml0aWsiLAogICAgbWVzc2FnZToKICAgICAgIlphcmFyIHZlcmljaSBhcnTDuXRhw6fEsSBvbGFzw7FsxLFrIGfDtnNla3MuIEFjw7FrIGFsYW5kYSBrYWxtYW4gw7ZcbiAgICAgICBuZXJpbGlyaXMuIiwKICB9LAp9OwovLyByaXNrRGF0YSBpYmFyZWxlcmluZ2EgZ8O2cmUgbWVzYWpsYXLEsSBoYXJpdGFsYW5EacSxxJ9pIGFzYWPEdGFza2FsaW1pCgpwcm92aWRlIGludGVyZmFjZSBSaXNrU2NyZWVuUHJvcHMgewogIGxldmVsOiBSaXNrTGV2ZWw7CiAgbWFpbnNob2NrOiB7IGxvY2F0aW9uOiBzdHJpbmc7IG1hZ25pdHVkZTogbnVtYmVyIH0gfCBudWxsOwogIHByb2JhYmlsaXR5PzogbnVtYmVyOwogIGRpc3RhbmNlS20/OiBudW1iZXI7CiAgdXNlckxvY2F0aW9uPzogVXNlckxvY2F0aW9uOwp9CgpleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBSaXNrU2NyZWVuKHsKICBsZXZlbCwKICBtYWluc2hvY2ssCiAgcHJvYmFiaWxpdHksCiAgZGlzdGFuY2VLbSwKICB1c2VyTG9jYXRpb24sCn06IFJpc2tTY3JlZW5Qcm9wcykgewogIGNvbnN0IGRhdGEgPSByaXNrRGF0YVtsZXZlbF07CgogIHJldHVybiAoCiAgICAvLyBCdSAnbWFpbicgZXRpa2V0aSB0w7xtIGVrcmFuxLEgS2FwbGFyIHZlIHJlbmdpIGJlbGlybGVyCiAgICA8bWFpbgoBICAgICAgY2xhc3NOYW1l={`ZmxleCBtaW4taC1zY3JlZW4gZmxleC1jb2wgZXRpa2V0aSBpYmFyZWxlcmluZ2EgZ8O2cmUgaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIHA4IHRleHQtN2xlIGVrcmFuxLEgS2FwbGFyIHZlIHJlbmdpIGJlbGlybGVyIHRleHQtY2VudGVyIHRyYW5zaXRpb24tY29sb3JzIGR1cmF0aW9uLTUwMCByeXNrRGF0YVtsZXZlbF0uYmdDb2xvcg==`}\n    >
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
                (Hesaplanan Olasılık: %{probability.toFixed(1)})\n              </p>
            )}
          </>
        ) : (
          <p>Son 24 saatte M4.0 üzeri deprem kaydedilmedi.</p>
        )}
      </div>
      {/* 4. Sorumluluk Reddi */}
      <p className="mt-12 max-w-2xl text-xs opacity-70">
        Bu bir deprem tahmini değildir. Bilimsel modellere dayalı istatistiksel\n        bir artçı olasılık hesabıdır. Lütfen her zaman AFAD'ın resmi uyarılarını\n        takip edin. Yunus Emre
      </p>
    </main>
  );
}
