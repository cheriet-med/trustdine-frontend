import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: "var(--font-montserrat), sans-serif",
        playfair: "var(--font-playfair), serif",
      },
      animation: {
        flickerHover: "flickerHover 350ms ease-in-out forwards",
        contentFlickerHover: "contentFlickerHover 350ms ease-in-out forwards",
        scroll: 'scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite',
      },
      colors: {
  			primary: "#000000",
  			secondary:"#785964",
  			a: '#000000',
		    neutral:"#2D628C",
			  yel:"#2D628C",
			  bl:"#7EB8E0",
        accent:"#82A7A6",
        background:"#9ED0E6",
        highlights:"#B796AC",
		}, 
keyframes: {
        scroll: {
          to: {
            transform: 'translate(calc(-50% - 0.5rem))',
          },
        },
      },
    
    },
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      'custom': '1300px', // Add a custom breakpoint
    },
  
  },
  plugins: [],
} satisfies Config;
