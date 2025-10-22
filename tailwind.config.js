/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                firs: {
                    blue: "#00529A",
                    dark: "#1C2E4A",
                },
            },
        },
        plugins: [],
    }
}