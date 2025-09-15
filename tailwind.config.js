/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      maxWidth: {
        'screen-2xl': '1400px', 
        'custom-1200': '1200px', 
        'custom-900': '900px', 
      },
      colors: {
        'primary': 'var(--primary-color, #ed3849)',
        'primary-dark': 'var(--primary-color-dark, #d23141)',
        'primary-light': 'var(--primary-color-light, #f4e5ec)',
        'secondary': 'var(--secondary-color, #292929)',
        'text-dark': '#0f172a',
        'text-light': '#64748b',
        'extra-light': '#f8fafc'
      },
      keyframes: {
        'fade-in-out': {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '10%': { opacity: '1', transform: 'translateY(0)' },
          '90%': { opacity: '1' },
          '100%': { opacity: '0' }
        }
      },
      animation: {
        'fade-in-out': 'fade-in-out 2s ease-in-out'
      }
    },
  },
  plugins: [],
}

