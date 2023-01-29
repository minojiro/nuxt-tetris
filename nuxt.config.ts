// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss"],
  app: {
    head: {
      title: "nuxt tetris",
      bodyAttrs: {
        class: "bg-gray-800",
      },
    },
  },
});
