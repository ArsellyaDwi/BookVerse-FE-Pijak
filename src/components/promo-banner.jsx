import { ArrowRight } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export default function PromoBanner() {
  return (
    <section style={{ maxWidth: '1440px', margin: '0 auto', padding: '32px 80px 64px 80px' }}>
      <div className="bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50 rounded-3xl p-16 flex items-center justify-between overflow-hidden relative soft-shadow-lg" style={{ borderRadius: '24px' }}>
        {/* Content */}
        <div className="relative z-10">
          <div className="inline-block px-6 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm text-[#2563EB] mb-6" style={{ fontFamily: 'Poppins', lineHeight: '1.5', fontWeight: '500', borderRadius: '24px' }}>
            Penawaran Terbatas
          </div>
          <h2 className="text-5xl mb-4 text-[#333333]" style={{ fontFamily: 'Poppins', lineHeight: '1.5', fontWeight: '700' }}>Diskon Buku Hingga 30%</h2>
          <p className="text-xl text-gray-700 mb-8" style={{ fontFamily: 'Poppins', lineHeight: '1.5' }}>
            Belanja sekarang dan dapatkan diskon untuk koleksi buku pilihan
          </p>
          <button 
            className="btn-primary flex items-center gap-2" 
            style={{ 
              fontFamily: 'Poppins',
              height: '48px',
              padding: '12px 32px',
              borderRadius: '50px',
              transition: 'all 0.3s'
            }}
          >
            Belanja Sekarang
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Illustration */}
        <div className="relative z-10 w-96 h-72 rounded-3xl overflow-hidden soft-shadow-lg" style={{ borderRadius: '24px' }}>
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1770515927761-979f248c64d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rc3RvcmUlMjBkaXNjb3VudCUyMHNhbGV8ZW58MXx8fHwxNzc1MTMzODA3fDA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Book Sale"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Decorative elements */}
        <div className="absolute top-10 right-1/4 w-32 h-32 bg-yellow-200 rounded-full opacity-20 blur-3xl" />
        <div className="absolute bottom-10 left-1/3 w-40 h-40 bg-purple-300 rounded-full opacity-20 blur-3xl" />
      </div>
    </section>
  );
}