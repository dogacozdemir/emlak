# KKTC Emlak Platform - Sayfa Dokümantasyonu

## 📄 Genel Sayfalar

### `/` - Ana Sayfa
- Platform tanıtımı
- İlanları görüntüle ve giriş yap butonları
- Herkese açık

### `/properties` - İlan Listesi
- Tüm emlak ilanlarını görüntüleme
- **Filtreler:** Bölge, fiyat, oda sayısı, emlak tipi
- **Görünüm:** Harita (Leaflet) veya Liste
- Harita üzerinde cluster'lı pin'ler
- Herkese açık

### `/properties/[id]` - İlan Detay
- Tek ilanın detaylı bilgileri
- Resim galerisi (lightbox)
- Konum haritası
- Benzer ilanlar önerisi
- WhatsApp iletişim butonu
- Rezervasyon/görüntüleme randevusu oluşturma
- SEO optimizasyonu (dinamik meta tags)
- Herkese açık

## 🔐 Kimlik Doğrulama

### `/login` - Giriş Yap
- E-posta ve şifre ile giriş
- JWT token yönetimi
- Test hesapları bilgisi gösterilir

### `/register` - Kayıt Ol
- Yeni kullanıcı kaydı
- Varsayılan rol: USER

## 👨‍💼 Admin Paneli

### `/admin` - Admin Dashboard
- Tüm ilanların listesi
- İlan ekleme/düzenleme/silme
- Sadece ADMIN rolü erişebilir

### `/admin/properties/new` - Yeni İlan Ekle
- Yeni emlak ilanı oluşturma
- Cloudinary ile resim yükleme (drag & drop)
- Form validasyonu
- Sadece ADMIN/AGENT rolü erişebilir

### `/admin/properties/[id]` - İlan Düzenle
- Mevcut ilanı düzenleme
- Resim ekleme/silme
- Sadece ADMIN/AGENT rolü erişebilir

### `/admin/bookings` - Rezervasyon Yönetimi
- Tüm rezervasyon taleplerini görüntüleme
- Rezervasyon onaylama/reddetme
- Durum filtreleme (Pending, Approved, Rejected)
- Sadece ADMIN rolü erişebilir

## 🔑 Rol Bazlı Erişim

- **USER:** İlan görüntüleme, rezervasyon oluşturma
- **AGENT:** İlan ekleme/düzenleme, kendi ilanlarını yönetme
- **ADMIN:** Tüm yetkiler + rezervasyon yönetimi + tüm ilanları yönetme

## 🛠️ Teknik Özellikler

- **Frontend:** Next.js 14 (App Router), React, TypeScript
- **Backend:** Express.js, Prisma ORM, PostgreSQL
- **Harita:** Leaflet + react-leaflet (cluster desteği)
- **Resim:** Cloudinary (optimizasyon, thumbnail)
- **Auth:** JWT + Refresh Token
- **State:** Zustand (client state), React Query (server state)

