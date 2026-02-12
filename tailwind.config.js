/** @type {import('tailwindcss').Config} */
export default {
  // 掃描所有 Vue 組件和入口文件，確保 Tailwind 不會清除用到的樣式
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // 主色調：靛藍紫，與設計稿保持一致
      colors: {
        primary: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        },
      },
    },
  },
  plugins: [],
}
