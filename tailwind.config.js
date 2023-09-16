import colors from "tailwindcss/colors"

/** @type {import("tailwindcss").Config} */
export default {
    content: ["./src/**/*.{html,js}"],
    theme: {
        extend: {
            gray: colors.zinc,
        },
    },
    plugins: [],
}
