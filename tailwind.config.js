/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: '#000000',
        backgroundAlt: '#121212',
        surface: '#1C1C1E',
        surfaceSubtle: '#2C2C2E',
        surfaceHighlight: '#3A3A3C',
        primary: {
          DEFAULT: '#EBB338',
          hover: '#D49D2F',
          light: 'rgba(235, 179, 56, 0.15)',
        },
        textPrimary: '#FFFFFF',
        textSecondary: '#8E8E93',
        textMuted: '#636366',
        border: '#2C2C2E',
        borderFocus: '#EBB338',
        divider: '#1C1C1E',
        danger: {
          DEFAULT: '#FF453A',
          light: 'rgba(255, 69, 58, 0.18)',
        },
        success: '#30D158',
        toolbar: '#121212',
      },
    },
  },
  plugins: [],
};
