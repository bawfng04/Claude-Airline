/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#8B0000",
        "primary-dark": "#014da4",
        secondary: "#6c757d",
        success: "#28a745",
        danger: "#dc3545",
        "danger-dark": "#8e0e1b",
        warning: "#ffc107",
        info: "#17a2b8",
        light: "#f8f9fa",
        dark: "#343a40",
      },
      screens: {
        sm: '480px',
        md: '768px',
        lg: '976px',
        xl: '1440px',
      },

    },
  },
  plugins: [],
};
