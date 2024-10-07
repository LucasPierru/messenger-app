/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontSize: {
        sm: "clamp(0.7rem, 0.09vw + 0.68rem, 0.75rem)",
        base: "clamp(0.88rem, 0.23vw + 0.82rem, 1rem)",
        lg: "clamp(1.09rem, 0.43vw + 0.98rem, 1.33rem)",
        xl: "clamp(1.37rem, 0.74vw + 1.18rem, 1.78rem)",
        "2xl": "clamp(1.71rem, 1.2vw + 1.41rem, 2.37rem)",
        "3xl": "clamp(2.14rem, 1.86vw + 1.67rem, 3.16rem)",
        "4xl": "clamp(2.67rem, 2.8vw + 1.97rem, 4.21rem)",
        "5xl": "clamp(3.34rem, 4.13vw + 2.3rem, 5.61rem)",
        "6xl": "clamp(4.17rem, 6.01vw + 2.67rem, 7.48rem)",
      },
    },
  },
  plugins: [],
};
