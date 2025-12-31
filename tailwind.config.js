/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            animation: {
                'marquee': 'marquee 25s linear infinite',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'bounce-in': 'bounceIn 0.3s ease-out',
                'fade-out': 'fadeOut 0.3s ease-in forwards',
            },
            keyframes: {
                marquee: {
                    '0%': { transform: 'translateX(100%)' },
                    '100%': { transform: 'translateX(-100%)' },
                },
                bounceIn: {
                    '0%': { transform: 'scale(0.9) translateY(-10px)', opacity: '0' },
                    '50%': { transform: 'scale(1.02) translateY(0)', opacity: '1' },
                    '100%': { transform: 'scale(1) translateY(0)', opacity: '1' },
                },
                fadeOut: {
                    '0%': { opacity: '1' },
                    '100%': { opacity: '0' },
                },
            },
        },
    },
    plugins: [],
}

