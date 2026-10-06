/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Deep automotive black palette
        carbon: {
          50: '#1a1a1a',
          100: '#141414',
          200: '#0f0f0f',
          300: '#0a0a0a',
          400: '#060606',
          500: '#030303',
          900: '#000000',
          950: '#000000',
        },
        // Premium automotive red
        crimson: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        },
        // Warm metallic accents
        copper: {
          300: '#cd7f32',
          400: '#b87333',
          500: '#a0652e',
          600: '#8b562a',
        },
        // Subtle warm greys for depth
        ash: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        // Layered automotive shadows
        'panel': '0 4px 24px -4px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03)',
        'panel-hover': '0 12px 48px -8px rgba(0,0,0,0.6), 0 0 0 1px rgba(239,68,68,0.15)',
        'glow-red': '0 0 0 1px rgba(239,68,68,0.2), 0 8px 32px -8px rgba(239,68,68,0.25)',
        'glow-red-hover': '0 0 0 1px rgba(239,68,68,0.3), 0 16px 48px -12px rgba(239,68,68,0.35)',
        'inner-glow': 'inset 0 1px 0 rgba(255,255,255,0.05), inset 0 -1px 0 rgba(0,0,0,0.3)',
        'card': '0 20px 60px -20px rgba(0,0,0,0.7)',
        'elevated': '0 32px 80px -24px rgba(0,0,0,0.8)',
      },
      backgroundImage: {
        'carbon-fiber': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M0 0h4v4H0V0zm4 4h4v4H4V4z' fill='%23ef4444' fill-opacity='0.03'/%3E%3C/svg%3E\")",
        'mesh-gradient': 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(239,68,68,0.15), transparent 60%), radial-gradient(ellipse 60% 40% at 100% 100%, rgba(185,28,28,0.1), transparent 50%)',
        'vignette': 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)',
        'hero-gradient': 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 60%, #000 100%)',
      },
      keyframes: {
        // Buttery entrance animations
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)', filter: 'blur(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)', filter: 'blur(0)' },
        },
        'fade-down': {
          '0%': { opacity: '0', transform: 'translateY(-24px)', filter: 'blur(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)', filter: 'blur(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'reveal': {
          '0%': { clipPath: 'inset(0 100% 0 0)' },
          '100%': { clipPath: 'inset(0 0 0 0)' },
        },
        'text-reveal': {
          '0%': { transform: 'translateY(1.2em)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        // Continuous ambient animations
        'float': {
          '0%, 100%': { transform: 'translateY(0) rotate(-1deg)' },
          '50%': { transform: 'translateY(-8px) rotate(1deg)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(239,68,68,0.3)' },
          '50%': { boxShadow: '0 0 24px 4px rgba(239,68,68,0.2)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'orbit': {
          '0%': { transform: 'rotate(0deg) translateX(60px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(60px) rotate(-360deg)' },
        },
        'breathing': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        // Entrance
        'fade-up': 'fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-down': 'fade-down 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fade-in 0.4s ease-out forwards',
        'scale-in': 'scale-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-in-right': 'slide-in-right 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-in-left': 'slide-in-left 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'reveal': 'reveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'text-reveal': 'text-reveal 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        // Ambient
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'orbit': 'orbit 20s linear infinite',
        'breathing': 'breathing 4s ease-in-out infinite',
        marquee: 'marquee 30s linear infinite',
      },
      transitionTimingFunction: {
        'butter': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'expo-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'expo-in': 'cubic-bezier(0.7, 0, 0.84, 0)',
      },
      transitionDuration: {
        '0': '0ms',
        '75': '75ms',
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
        '400': '400ms',
        '500': '500ms',
        '700': '700ms',
        '1000': '1000ms',
      },
      scale: {
        '98': '0.98',
        '102': '1.02',
        '103': '1.03',
      },
      blur: {
        'xs': '2px',
        '4xl': '72px',
      },
    },
  },
  plugins: [],
};