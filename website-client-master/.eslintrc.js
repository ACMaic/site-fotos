module.exports = {
  root: true,
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false
  },
  env: {
    browser: true,
    node: true
  },
  globals: {
    google: true,
    window: true,
    dataLayer: true
  },
  extends: ['@nuxtjs', 'plugin:nuxt/recommended'],
  rules: {
    'nuxt/no-cjs-in-config': 'off',
    'vue/no-v-html': 'off',
    'vue/no-v-text-v-html-on-component': 'off',
    'no-v-text-v-html-on-component': 'off',
    'vue/no-use-v-if-with-v-for': 'off',
    'declaration-block-no-duplicate-properties': 'off',
    'selector-anb-no-unmatchable': 'off',
    'vue/singleline-html-element-content-newline': [
      'warn',
      {
        ignoreWhenNoAttributes: true,
        ignoreWhenEmpty: true,
        ignores: ['nuxt-link', 'label', 'span', 'a', 'b', 'i', 'small']
      }
    ]
  }
}
