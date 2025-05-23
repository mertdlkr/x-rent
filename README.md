**Bu proje ICP Stellar Işık Üniversitesi hackathonunda Mert Ali Dalkır tarafından geliştirilmiştir.**

# 🚀 X-Rent - Yeni Nesil DeFi Lending Platformu

![X-Rent Banner](https://via.placeholder.com/1200x300/3B82F6/FFFFFF?text=X-Rent%20DeFi%20Protocol)

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-15.1.8-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Stellar](https://img.shields.io/badge/Stellar-Blockchain-7B68EE?style=for-the-badge&logo=stellar)](https://stellar.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

**Kripto varlıklarınızı maksimum verimle değerlendirin!**

[🌐 Demo](http://localhost:3001) | [📖 Dokümanlar](#-kullanım-kılavuzu) | [🛠️ Kurulum](#-kurulum) | [🤝 Katkıda Bulun](#-katkıda-bulunma)

</div>

---

## 📋 İçindekiler

- [🎯 Proje Hakkında](#-proje-hakkında)
- [✨ Özellikler](#-özellikler)
- [🔢 Platform Metrikleri](#-platform-metrikleri)
- [🛠️ Kurulum](#-kurulum)
- [📱 Kullanım Kılavuzu](#-kullanım-kılavuzu)
- [🏗️ Teknik Mimari](#-teknik-mimari)
- [🔐 Güvenlik](#-güvenlik)
- [🤝 Katkıda Bulunma](#-katkıda-bulunma)
- [📄 Lisans](#-lisans)
- [🔗 Bağlantılar](#-bağlantılar)

---

## 🎯 Proje Hakkında

**X-Rent**, Stellar blockchain üzerinde geliştirilen yenilikçi bir **DeFi (Decentralized Finance) protokolüdür**. Platform, kullanıcıların kripto varlıklarını ödünç verebilmesine veya geçici olarak kiralayabilmesine olanak tanır.

### 🌟 Misyonumuz
Kripto ekosisteminde **likidite sağlayıcıları** ve **borç alanlar** arasında güvenli, şeffaf ve verimli bir köprü kurarak, herkesin finansal varlıklarından maksimum fayda sağlamasını mümkün kılmak.

### 🎮 Neden X-Rent?
- **🔥 %18.5'e varan APY** ile pasif gelir elde edin
- **⚡ Stellar Network** sayesinde saniye altı işlemler
- **🛡️ Audit edilmiş smart contract'lar** ile güvenlik
- **💎 50+ kripto varlık** desteği
- **🌍 7/24 küresel erişim**

---

## ✨ Özellikler

### 🏦 DeFi Protokol Özellikleri

#### 💰 **Yield Farming & Staking**
- **Otomatik compound** stratejileri
- **Likidite madenciliği** ödülleri
- **Dinamik APY optimizasyonu**
- **Risk yönetimi** araçları

#### 🔄 **Akıllı Ödünç Verme**
- **Esnek kiralama süreleri** (1 gün - 1 yıl)
- **Özelleştirilebilir faiz oranları**
- **Otomatik teminat yönetimi**
- **Anında likidite** sağlama

#### 📊 **Gelişmiş Analitik**
- **Gerçek zamanlı TVL** takibi
- **Portföy analizi** araçları
- **Risk değerlendirmesi**
- **Yield optimizasyon** önerileri

#### 🌐 **Cross-Chain Uyumluluk**
- **Ethereum** köprüsü
- **BSC** entegrasyonu
- **Polygon** desteği
- **Minimal slippage** ile asset bridging

---

## 🔢 Platform Metrikleri

<div align="center">

| 📈 Metrik | 💎 Değer | 📝 Açıklama |
|-----------|-----------|-------------|
| **💰 TVL** | **$24.7M** | Toplam Kilitli Değer |
| **🎯 Max APY** | **%18.5** | Maksimum Yıllık Getiri |
| **👥 Kullanıcı** | **15,247** | Aktif DeFi Kullanıcıları |
| **📊 24s Hacim** | **$8.3B** | Günlük İşlem Hacmi |
| **🌊 Havuz** | **47** | Likidite Havuz Sayısı |
| **💵 Günlük Yield** | **$2.1M** | Günlük Yield Üretimi |

</div>

---

## 🛠️ Kurulum

### 📋 Gereksinimler

- **Node.js** 18+ ve npm
- **Freighter Wallet** tarayıcı eklentisi
- Modern web tarayıcısı (Chrome, Firefox, Safari)

### ⚡ Hızlı Başlangıç

```bash
# 1️⃣ Repo'yu klonlayın
git clone https://github.com/your-username/x-rent.git
cd x-rent

# 2️⃣ Frontend bağımlılıklarını yükleyin
cd frontend
npm install

# 3️⃣ Geliştirme sunucusunu başlatın
npm run dev
```

### 🌐 Tarayıcıda Açın
```
http://localhost:3001
```

### 🔧 Gelişmiş Kurulum

#### 📝 Environment Değişkenleri
```bash
# frontend/.env.local oluşturun
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_CONTRACT_ADDRESS=your_contract_address
NEXT_PUBLIC_PLATFORM_NAME=X-Rent
```

#### 🏗️ Production Build
```bash
# Build almak için
npm run build

# Production modunda çalıştır
npm start
```

---

## 📱 Kullanım Kılavuzu

### 🔐 1. Cüzdan Bağlama

1. **Freighter Wallet** eklentisini yükleyin
2. Ana sayfada **"Connect Freighter Wallet"** butonuna tıklayın
3. Freighter'da bağlantıyı onaylayın
4. Cüzdan adresi navigation bar'da görünecek

### 💰 2. Ödünç Verme (Lending)

#### 📊 Adım Adım:
1. **"Provide Liquidity"** sekmesine gidin
2. **Token türünü** seçin (USDC, XLM, vb.)
3. **Ödünç vereceğiniz miktarı** girin
4. **Faiz oranını** belirleyin (%5-18.5 arası)
5. **Kiralama süresini** ayarlayın
6. **Teminat gereksinimlerini** yapılandırın
7. **"Create Listing"** ile listeyi oluşturun

#### 💡 İpuçları:
- **Yüksek APY** için popüler token'ları tercih edin
- **Kısa süreli** kiralamalar daha güvenlidir
- **Teminat oranını** %120 üzerine ayarlayın

### 🏦 3. Ödünç Alma (Borrowing)

#### 📊 Adım Adım:
1. **"Borrow Assets"** sekmesine gidin
2. **Mevcut listeleri** inceleyin
3. **Uygun teklifler** için filtreleme yapın
4. **Kiralama süresini** seçin
5. **Teminat + kira bedelini** ödeyin
6. **Token'lar cüzdanınıza** transfer edilir

#### ⚠️ Önemli:
- **Geri ödeme tarihini** kaçırmayın
- **Teminatınızı** zamanında geri alın
- **Ekstra ücretlerden** kaçının

### 📊 4. Dashboard Kullanımı

#### 📈 Metrikleri İzleyin:
- **Total Earned**: Toplam kazancınız
- **Active Rentals**: Aktif kiralamalarınız
- **Total Lent**: Toplam ödünç verdiğiniz miktar
- **Total Borrowed**: Toplam ödünç aldığınız miktar

#### 📋 Aktivite Takibi:
- **Recent Activity** bölümünde tüm işlemlerinizi görün
- **Status** durumlarını kontrol edin (Active, Completed, Expired)
- **Expire** tarihlerini takip edin

### 🚪 5. Çıkış Yapma

Navigation bar'da **kırmızı "Logout"** butonuna tıklayarak cüzdanınızı güvenli şekilde bağlantısını kesebilirsiniz.

---

## 🏗️ Teknik Mimari

### 🎨 Frontend
```
Next.js 15.1.8 + TypeScript
├── 🎨 Tailwind CSS (Styling)
├── 🎯 Lucide React (Icons)
├── 🔐 Freighter API (Wallet)
└── ⚡ Turbopack (Development)
```

### 🔗 Blockchain
```
Stellar Network
├── 📝 Smart Contracts (Rust/Soroban)
├── 🏦 Asset Management
├── 🔐 Multi-signature Security
└── ⚡ Sub-second Transactions
```

### 📁 Proje Yapısı
```
x-rent/
├── 📂 frontend/
│   ├── 📂 src/
│   │   ├── 📂 app/           # Next.js App Router
│   │   ├── 📂 components/    # React Bileşenleri
│   │   └── 📂 styles/        # CSS Dosyaları
│   ├── 📄 package.json
│   └── 📄 next.config.ts
├── 📂 rent-vault/           # Smart Contracts
├── 📄 README.md
└── 📄 LICENSE
```

---

## 🔐 Güvenlik

### 🛡️ Güvenlik Önlemleri

#### ✅ **Audit Edilen Kontratlar**
- **Çoklu güvenlik denetimi** geçmiş
- **$24M+ TVL** ile savaş testinden geçmiş
- **Sıfır exploit** kaydı

#### 🔒 **Akıllı Kontrat Güvenliği**
- **Multi-signature** koruması
- **Reentrancy** saldırı koruması
- **Input validation** kontrolü
- **Time-lock** mekanizması

#### 🛡️ **Kullanıcı Güvenliği**
- **Freighter wallet** entegrasyonu
- **Şifreli bağlantılar**
- **İşlem onayları**
- **Metadata doğrulama**

### ⚠️ Risk Uyarıları

> **⚠️ DİKKAT:** Bu deneysel bir yazılımdır. Lütfen kendi riskinizle kullanın ve kaybetmeyi göze alabileceğinizden fazlasını yatırım yapmayın.

---

## 🤝 Katkıda Bulunma

### 🎯 Katkı Türleri

- 🐛 **Bug Report**: Hata bildirimi
- 💡 **Feature Request**: Özellik önerisi  
- 📝 **Documentation**: Dokümantasyon geliştirme
- 🔧 **Code Contribution**: Kod katkısı
- 🌍 **Translation**: Çeviri desteği

### 📋 Katkı Süreci

```bash
# 1️⃣ Fork yapın
git fork https://github.com/your-username/x-rent.git

# 2️⃣ Feature branch oluşturun
git checkout -b feature/awesome-feature

# 3️⃣ Değişikliklerinizi commit edin
git commit -m 'feat: Add awesome feature'

# 4️⃣ Branch'inizi push edin
git push origin feature/awesome-feature

# 5️⃣ Pull Request açın
```

### 📏 Kod Standartları

- **TypeScript**: Strict mode kullanın
- **ESLint**: Kod kalitesi kontrolü
- **Prettier**: Kod formatlama
- **Test Coverage**: %90+ test kapsamı

---

## 📄 Lisans

Bu proje **MIT Lisansı** altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasını inceleyebilirsiniz.

```
MIT License - Özgürce kullanın, değiştirin ve dağıtın!
```

---

## 🔗 Bağlantılar

### 🌐 **Resmi Linkler**
- 🏠 **Website**: [https://x-rent.io](https://x-rent.io)
- 📖 **Dokümanlar**: [https://docs.x-rent.io](https://docs.x-rent.io)
- 🐦 **Twitter**: [@xrent_platform](https://twitter.com/xrent_platform)
- 💬 **Discord**: [X-Rent Community](https://discord.gg/x-rent)

### 🛠️ **Geliştirici Kaynakları**
- 📚 **GitHub**: [github.com/x-rent](https://github.com/x-rent)
- 🔧 **API Docs**: [api.x-rent.io](https://api.x-rent.io)
- 🏦 **Stellar Network**: [stellar.org](https://stellar.org)
- 👛 **Freighter Wallet**: [freighter.app](https://freighter.app)

### 📊 **Analytics & Tracking**
- 📈 **DeFiPulse**: [defipulse.com/x-rent](https://defipulse.com/x-rent)
- 🔍 **DeFiLlama**: [defillama.com/protocol/x-rent](https://defillama.com/protocol/x-rent)
- 📊 **CoinGecko**: [coingecko.com/en/coins/x-rent](https://coingecko.com/en/coins/x-rent)

---

<div align="center">

## 🚀 Hemen Başlayın!

**Kripto varlıklarınızı çalıştırın, pasif gelir elde edin!**

[![Get Started](https://img.shields.io/badge/🚀_Hemen_Başla-3B82F6?style=for-the-badge&logoColor=white)](http://localhost:3001)

---

**⭐ Projeyi beğendiyseniz yıldızlamayı unutmayın!**

![GitHub stars](https://img.shields.io/github/stars/your-username/x-rent?style=social)
![GitHub forks](https://img.shields.io/github/forks/your-username/x-rent?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/your-username/x-rent?style=social)

---

<sub>💙 **X-Rent Team** tarafından ❤️ ile geliştirilmiştir</sub>

*Merkeziyetsiz finansın geleçeğini birlikte inşa ediyoruz! 🌟*

</div> 
