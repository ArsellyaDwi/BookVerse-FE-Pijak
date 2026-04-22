import { Link, useNavigate } from 'react-router';
import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login:', formData);
    // Handle login logic here
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh',
      fontFamily: 'Poppins',
      backgroundColor: '#FFFFFF'
    }}>
      {/* Left Side - Gradient Branding with Illustration */}
      <div 
        style={{
          flex: '1',
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '64px 48px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Back to Home Button - Gaya Minimalis "Lihat Semua" */}
        <button
          onClick={() => navigate('/')}
          className="group"
          style={{
            position: 'absolute',
            top: '32px',
            left: '32px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '10',
          }}
        >
          <ChevronLeft 
            className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" 
            style={{ color: '#000000' }}
          />
          <span
            style={{
              fontFamily: 'Poppins',
              fontSize: '14px',
              fontWeight: '500',
              color: '#000000',
              transition: 'color 0.3s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#000000';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#000000';
            }}
          >
            Kembali ke Home
          </span>
        </button>

        {/* Logo BookVerse */}
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <h1 
            style={{ 
              fontFamily: 'Poppins',
              fontSize: '36px',
              fontWeight: '700',
              color: '#FFFFFF',
              margin: '0',
              letterSpacing: '-0.02em'
            }}
          >
            BookVerse
          </h1>
          <p 
            style={{ 
              fontFamily: 'Poppins',
              fontSize: '14px',
              fontWeight: '400',
              color: 'rgba(255, 255, 255, 0.9)',
              margin: '8px 0 0 0'
            }}
          >
            Menjelajahi Dunia Pengetahuan
          </p>
        </div>

        {/* Ilustrasi */}
        <div 
          style={{ 
            width: '100%',
            maxWidth: '320px',
            aspectRatio: '1',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)'
          }}
        >
          <img 
            src="https://images.unsplash.com/photo-1762803842029-5e34663d98be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHJlYWRpbmclMjBib29rJTIwbW9kZXJuJTIwYWVzdGhldGljfGVufDF8fHx8MTc3NTc4NjY0NXww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Person reading book"
            style={{ 
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>

        {/* Tagline */}
        <p 
          style={{ 
            fontFamily: 'Poppins',
            fontSize: '16px',
            fontWeight: '500',
            color: '#FFFFFF',
            textAlign: 'center',
            marginTop: '32px',
            lineHeight: '1.6',
            maxWidth: '300px'
          }}
        >
          Temukan buku favorit Anda dan mulai petualangan membaca yang tak terlupakan
        </p>
      </div>

      {/* Right Side - Form Login */}
      <div 
        style={{ 
          flex: '1',
          padding: '64px 48px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h2 
            style={{ 
              fontFamily: 'Poppins',
              fontSize: '24px',
              fontWeight: '700',
              color: '#1E293B',
              margin: '0 0 8px 0'
            }}
          >
            Masuk ke BookVerse
          </h2>
          <p 
            style={{ 
              fontFamily: 'Poppins',
              fontSize: '14px',
              fontWeight: '400',
              color: '#64748B',
              margin: '0'
            }}
          >
            Selamat datang kembali! Silakan masuk ke akun Anda
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div style={{ marginBottom: '24px' }}>
            <label 
              style={{ 
                display: 'block',
                fontFamily: 'Poppins',
                fontSize: '14px',
                fontWeight: '500',
                color: '#334155',
                marginBottom: '8px'
              }}
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="nama@email.com"
              required
              style={{
                width: '100%',
                height: '48px',
                padding: '0 16px',
                fontFamily: 'Poppins',
                fontSize: '14px',
                color: '#1E293B',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                outline: 'none',
                transition: 'all 0.3s'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#2563EB';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#E2E8F0';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Password Input */}
          <div style={{ marginBottom: '16px' }}>
            <label 
              style={{ 
                display: 'block',
                fontFamily: 'Poppins',
                fontSize: '14px',
                fontWeight: '500',
                color: '#334155',
                marginBottom: '8px'
              }}
            >
              Kata Sandi
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Masukkan kata sandi"
              required
              style={{
                width: '100%',
                height: '48px',
                padding: '0 16px',
                fontFamily: 'Poppins',
                fontSize: '14px',
                color: '#1E293B',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                outline: 'none',
                transition: 'all 0.3s'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#2563EB';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#E2E8F0';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Remember Me Checkbox */}
          <div style={{ marginBottom: '24px' }}>
            <label 
              style={{ 
                display: 'flex',
                alignItems: 'center',
                fontFamily: 'Poppins',
                fontSize: '14px',
                fontWeight: '500',
                color: '#334155'
              }}
            >
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                style={{
                  marginRight: '8px',
                  width: '16px',
                  height: '16px',
                  accentColor: '#2563EB'
                }}
              />
              Ingat Saya
            </label>
          </div>

          {/* Lupa Kata Sandi */}
          <div style={{ textAlign: 'right', marginBottom: '24px' }}>
            <Link 
              to="/forgot-password"
              style={{ 
                fontFamily: 'Poppins',
                fontSize: '13px',
                fontWeight: '500',
                color: '#2563EB',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
              onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
            >
              Lupa Kata Sandi?
            </Link>
          </div>

          {/* Tombol Masuk */}
          <button
            type="submit"
            style={{
              width: '100%',
              height: '48px',
              fontFamily: 'Poppins',
              fontSize: '15px',
              fontWeight: '600',
              color: '#FFFFFF',
              backgroundColor: '#2563EB',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s',
              marginBottom: '32px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#1d4ed8';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#2563EB';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Masuk
          </button>
        </form>

        {/* Footer - Daftar */}
        <div style={{ textAlign: 'center' }}>
          <p 
            style={{ 
              fontFamily: 'Poppins',
              fontSize: '14px',
              fontWeight: '400',
              color: '#64748B',
              margin: '0'
            }}
          >
            Belum punya akun?{' '}
            <Link 
              to="/register"
              style={{ 
                fontFamily: 'Poppins',
                fontSize: '14px',
                fontWeight: '600',
                color: '#2563EB',
                textDecoration: 'none'
              }}
              onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
              onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
            >
              Daftar Sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}