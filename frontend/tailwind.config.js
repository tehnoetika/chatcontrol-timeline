/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#002F6C",
          50: "#F0F4FA",
          100: "#D5E0EF",
          200: "#A6BDDB",
          300: "#7099C6",
          400: "#3D6FA8",
          500: "#1A4D89",
          600: "#002F6C",
          700: "#00255A",
          800: "#001A40",
          900: "#000F26",
        },
        flag: {
          red: "#FF0000",
          white: "#FFFFFF",
          navy: "#002F6C",
        },
        // Deep editorial dark canvas (premium, high-contrast)
        ink: {
          DEFAULT: "#0B1220",
          800: "#111B2E",
          700: "#18243B",
          600: "#22304C",
          500: "#33425F",
        },
        muted: "#8A97A8",
        surface: "#F5F7F9",
        border: "#E1E5EA",
        // Event-type palette — each stream of the story gets a stable hue
        type: {
          eu: "#4C8DFF",        // EU_sluzbeno — institutional blue
          vote: "#FF3B3B",      // glasovanje — flag-red pivot points
          media: "#22C7B8",     // hr_mediji — teal
          politician: "#F5A524",// izjava_politicara — amber
          roundtable: "#A78BFA",// okrugli_stol — violet
          civil: "#34D399",     // civilno_drustvo — green
          intl: "#94A3B8",      // medjunarodni_kontekst — slate
          social: "#F472B6",    // drustvene_mreze — rose
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "Helvetica", "Arial", "sans-serif"],
        display: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "12px",
        sm: "8px",
        lg: "16px",
        xl: "20px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.20), 0 8px 24px rgba(0,0,0,0.28)",
        elevated: "0 4px 8px rgba(0,0,0,0.24), 0 20px 48px rgba(0,0,0,0.40)",
        glow: "0 0 0 1px rgba(76,141,255,0.25), 0 0 32px rgba(76,141,255,0.15)",
      },
      letterSpacing: {
        brand: "0.15em",
      },
      keyframes: {
        pulseDot: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.4", transform: "scale(0.85)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        pulseDot: "pulseDot 1.8s ease-in-out infinite",
        fadeUp: "fadeUp 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};
