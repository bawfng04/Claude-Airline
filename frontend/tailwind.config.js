/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'primary-color': '#8B0000',
        'primary-light': '#a40000',
        'primary-dark': '#700000',
        'primary-color-dark': '#014da4',
        'secondary-color': '#6c757d',
        'background-color': '#f8fafc',
        'success-color': '#28a745',
        'danger-color': '#dc3545',
        'border-color': '#e8e8e8',
        'danger-color-dark': '#8e0e1b',
        'warning-color': '#ffc107',
        'info-color': '#17a2b8',
        'light-color': '#f8f9fa',
        'dark-color': '#343a40',
        'error-color': '#e74c3c',
        'text-muted': '#7f8c8d',
        'text-color': '#34495e',
      },
      screens: {
        sm: { max: '576px'},
        md: { max: '768px'},
        lg: { max: '992px'},
      },
      backgroundImage: {
        'homepage-airplane': "url('/src/assets/homepage-airplane-image.png')",
        'plane-bg': "url('/src/assets/plane_bg.jpg')",
      },
      maxWidth: {
        'half-minus-3rem': 'calc(50% - 3rem)',
        'half-minus-2rem': 'calc(50% - 2rem)',
        'full-minus-120px': 'calc(100% - 120px)',
      },
    },
  },
  plugins: [],
};
