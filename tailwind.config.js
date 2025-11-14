/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                firs: {
                    blue: "#00A859",
                    dark: "#005F5A",
                },
            },
        },
        plugins: [],
    }
}