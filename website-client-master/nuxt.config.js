const title = '360 Suítes - Aluguel por temporada em São Paulo'
const shortTitle = '360 Suítes - Aluguel por temporada em São Paulo'
const description = ''

export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s | 360 Suítes - Aluguel por temporada em São Paulo',
    title,
    meta: [
      { charset: 'utf-8' },
      { 'http-equiv': 'Cache-Control', content: 'no-cache, no-store, must-revalidate' },
      { 'http-equiv': 'Pragma', content: 'no-cache' },
      { 'http-equiv': 'Expires', content: '0' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@/assets/main.scss',
    '@/assets/mixins.scss',
    '@fortawesome/fontawesome-pro/css/all.css',
    '@fortawesome/fontawesome-pro/css/fontawesome.css',
    '@fortawesome/fontawesome-pro/css/light.css',
    '@fortawesome/fontawesome-pro/css/thin.css',
    '@fortawesome/fontawesome-pro/css/duotone.css',
    '@fortawesome/fontawesome-pro/css/brands.css',
    '@fortawesome/fontawesome-pro/css/solid.css',
    '@fortawesome/fontawesome-pro/css/regular.css',
    '@fortawesome/fontawesome-pro/css/sharp-light.css',
    '@fortawesome/fontawesome-pro/css/sharp-solid.css',
    '@fortawesome/fontawesome-pro/css/sharp-regular.css',
    '@fortawesome/fontawesome-pro/css/sharp-light.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/vue-the-mask.js',
    '@/plugins/amplify.js',
    { src: '@/plugins/v-currency-field.js', ssr: false },
    { src: '@/plugins/vue-html2pdf', mode: 'client' },
    { src: '@/plugins/vuetify-google-autocomplete.js', ssr: false }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    ['@nuxtjs/vuetify', { treeShake: true }],
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    '@nuxtjs/composition-api/module',
    '@pinia/nuxt',
    [
      'nuxt-compress',
      {
        gzip: {
          threshold: 8192
        },
        brotli: {
          threshold: 8192
        }
      }
    ]
  ],
  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    ['v-currency-field/nuxt-treeshaking', {
      locale: 'pt-BR',
      decimalLength: 2,
      autoDecimalMode: true,
      min: null,
      max: null,
      defaultValue: 0,
      valueAsInteger: false,
      allowNegative: true
    }],
    'vue-scrollto/nuxt',
    '@nuxtjs/redirect-module'
  ],
  redirect: [
    {
      // eslint-disable-next-line
      from: '(?!^\/$|^\/[?].*$)(.*\/[?](.*)$|.*\/$)',
      to: (from, req) => {
        const base = req._parsedUrl.pathname.replace(/\/$/, '')
        const search = req._parsedUrl.search
        return base + (search != null ? search : '')
      }
    }
  ],
  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: '/'
  },
  router: {
    trailingSlash: false,
    options: {
      strict: true,
      trailingSlash: false
    },
    extendRoutes (routes, resolve) {
      routes.push(
        {
          name: 'home',
          path: '/',
          component: resolve(__dirname, 'pages/index')
        },
        {
          name: 'entrar',
          path: '/entrar',
          component: resolve(__dirname, 'pages/login')
        },
        {
          name: 'registrar',
          path: '/registrar',
          component: resolve(__dirname, 'pages/register')
        },
        {
          name: 'politica-de-privacidade',
          path: '/politica-de-privacidade',
          component: resolve(__dirname, 'pages/privacy-policies')
        },
        {
          name: 'termos-de-uso',
          path: '/termos-de-uso',
          component: resolve(__dirname, 'pages/terms-of-use')
        },
        {
          name: 'politicas-cancelamento',
          path: '/politicas-cancelamento',
          component: resolve(__dirname, 'pages/cancellation-policy')
        },
        {
          name: 'reserva',
          path: '/reserva',
          component: resolve(__dirname, 'pages/property')
        },
        {
          name: 'perfil',
          path: '/minha-conta/perfil',
          component: resolve(__dirname, 'pages/profile')
        },
        {
          name: 'recuperar-senha',
          path: '/recuperar-senha',
          component: resolve(__dirname, 'pages/password-recovery')
        },
        {
          name: 'minhas-reservas',
          path: '/minha-conta/reservas',
          component: resolve(__dirname, 'pages/my-bookings')
        },
        {
          name: 'servicos',
          path: '/minha-conta/servicos',
          component: resolve(__dirname, 'pages/services')
        },
        {
          name: 'proprietarios',
          path: '/proprietarios',
          component: resolve(__dirname, 'pages/owners'),
          chunkNames: 'pages/owners'
        },
        {
          name: 'pagamento',
          path: '/pagamento',
          component: resolve(__dirname, 'pages/payment')
        },
        {
          name: 'avaliacao-finalizada',
          path: '/avaliacao-finalizada',
          component: resolve(__dirname, 'pages/done-booking-rate')
        },
        {
          name: 'avaliacao',
          path: '/avaliacao/:id?',
          component: resolve(__dirname, 'pages/booking-rate')
        },
        {
          name: 'checkin-digital',
          path: '/checkin-digital',
          component: resolve(__dirname, 'pages/checkin')
        }
      )
    }
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    meta: {
      name: shortTitle,
      author: '360 Suítes Engineering',
      theme_color: '#333333',
      description
    },
    icon: {
      src: 'https://assets.360suites.com.br/logos/logo.svg'
    },
    manifest: {
      name: shortTitle,
      short_name: shortTitle,
      theme_color: '#333333',
      description,
      background_color: '#F6F6F6',
      display: 'standalone',
      icons: [
        {
          src: 'https://assets.360suites.com.br/logos/logo.svg',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'maskable'
        },
        {
          src: 'https://assets.360suites.com.br/logos/logo.svg',
          sizes: '384x384',
          type: 'image/png',
          purpose: 'maskable'
        }
      ]
    }
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    defaultAssets: { icons: 'fa' },
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      options: {
        customProperties: true
      },
      themes: {
        dark: {
          background: '#F6F6F6',
          surface: '#F6F6F6',
          primary: '#C31C4A',
          secondary: '#F6CF0A',
          error: '#DC3545',
          info: '#17A2B8',
          success: '#22c55e',
          warning: '#FFC107',
          lightBlack: '#333333',
          greyBackground: '#E1E1E1',
          primaryOwner: '#333333'
        },
        light: {
          background: '#F6F6F6',
          surface: '#F6F6F6',
          primary: '#C31C4A',
          secondary: '#F6CF0A',
          error: '#DC3545',
          info: '#17A2B8',
          success: '#22c55e',
          warning: '#FFC107',
          lightBlack: '#333333',
          greyBackground: '#E1E1E1',
          primaryOwner: '#333333'
        }
      }
    }
  },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    loaders: {
      vue: {
        compiler: require('vue-template-babel-compiler')
      }
    },
    babel: {
      plugins: [
        '@babel/plugin-proposal-optional-chaining'
      ]
    }
  }
}
