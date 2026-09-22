/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    fontFamily: {
      pt: ["PT Sans", "sans - serif"],
      cabinet: ["Cabinet Grotesk", "sans-serif"],
      inter: ["Inter", "sans-serif"],
      raleWay:"Raleway",
      roboto: ['Roboto', 'sans-serif'],
      agrandir: ['Agrandir', 'sans-serif'],
      jakarta: ['"Plus Jakarta Sans"', 'sans-serif'],
      poppins:['"Poppins"', 'sans-serif'],
      agrandir: ['Agrandir', 'sans-serif'],
      agrandirHeavy: ['Agrandir GrandHeavy', 'sans-serif'],
      agrandirWide: ['Agrandir WideBlack', 'sans-serif']
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        plum: "#9235E2",
        lightGrey: "#F5EDFC",
        policy:"#191919cc",
        txtcolor:"#202224",
        stepclr:"#39353C99",
        bgGray: "#FBF9FD",
        grayblu:"#475569",
        ftext:"#3E3E3E",
        blu:"#1E293B",
        grayhead:"#343434",
        graysublabel:"#707070",
        shipGrey: "#39353C",
        frenchPink: "#E5D2F1",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      screens: {
        small: "400px",
      },
      boxShadow:{
        cardshadow:"6px 6px 54px 0px #0000000D",
        spanshadow:"0px 0px 0px 4px #FFFFFF40",
        spanshadowside:"0px 0px 0px 3px #FFFFFF40",
      },
      backdropBlur: {
        navigation: '30.4px',
      },
      backgroundImage: {
        'fancy-radial': "radial-gradient(50% 50% at 50% 50%, rgba(255,255,255,0.34) 0%, rgba(248,167,255,0.34) 8.33%, rgba(136,9,168,0.34) 36.98%, rgba(30,30,30,0.34) 100%)",
        'fancy-radial-strong': "radial-gradient(50% 50% at 50% 50%, rgba(255,255,255,0.76) 0%, rgba(248,167,255,0.76) 8.33%, rgba(136,9,168,0.76) 36.98%, rgba(30,30,30,0.76) 100%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
