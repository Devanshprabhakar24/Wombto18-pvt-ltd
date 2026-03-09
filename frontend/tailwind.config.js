/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#134E1A',
                    50: '#F0FFF0',
                    100: '#D4F5D4',
                    200: '#A8E6A8',
                    300: '#6FCF6F',
                    400: '#3CA745',
                    500: '#1E7A28',
                    600: '#134E1A',
                    700: '#0F3D14',
                    800: '#0B2E10',
                    900: '#071F0A',
                    dark: '#256029',
                    bright: '#3CA745',
                },
                accent: {
                    DEFAULT: '#3CA745',
                    50: '#F0FFF0',
                    100: '#D4F5D4',
                    200: '#A8E6A8',
                    300: '#6FCF6F',
                    400: '#3CA745',
                    500: '#1E7A28',
                    600: '#134E1A',
                    700: '#0F3D14',
                    blue: '#EAF3FB',
                    blueLight: '#F5FAFF',
                    blueCard: '#E6F0FF',
                    green: '#EAF8EC',
                    greenLight: '#F5FFF7',
                    yellow: '#FFF9E6',
                    red: '#FFE9E6',
                    purple: '#F6F0FF',
                    gray: '#F5F5F5',
                    grayBorder: '#E9E9E9',
                },
                text: {
                    heading: '#111827',
                    body: '#374151',
                    muted: '#6B7280',
                },
                white: '#FFFFFF',
                background: {
                    DEFAULT: '#FFFFFF',
                    light: '#F5FCFF',
                },
            },
            animation: {
                fadeIn: 'fadeIn 0.35s ease-in-out',
            },
            keyframes: {
                fadeIn: { from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
            },
        },
    },
    plugins: [],
};
