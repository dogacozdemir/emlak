export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          KKTC Emlak Platform
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Kuzey Kıbrıs Türk Cumhuriyeti emlak ilanları ve rezervasyon platformu
        </p>
        <div className="space-x-4">
          <a
            href="/properties"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            İlanları Görüntüle
          </a>
          <a
            href="/login"
            className="bg-white text-blue-600 px-6 py-3 rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors"
          >
            Giriş Yap
          </a>
        </div>
      </div>
    </main>
  );
}
