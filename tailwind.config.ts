import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],

  theme: {
    borderRadius: {
      DEFAULT: "1rem",
    },
    colors: {
      red: "rgb(var(--red))",
      black: "rgb(var(--black))",
      gold: "rgb(var(--gold))",
      silver: "rgb(var(--silver))",
      white: "rgb(var(--white))",
      green: "rgb(var(--green))",
      gray: "rgb(var(--gray))",
      blacker: "rgb(var(--blacker))",
    },
    dropShadow: {
      DEFAULT: "0 2pt 3pt rgb(var(--blacker) / 30%)",
    },
    extend: {
      transitionProperty: {
        'flex': 'flex',
      },
    },
  },

  plugins: [],
} satisfies Config;
