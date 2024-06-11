import { defineStore } from 'pinia'

export const useSnackbar = defineStore('snackbar', {
  // state
  state: () => {
    return {
      show: false,
      text: '',
      timeout: -1,
      color: 'primary'
    }
  },

  // actions
  actions: {
    showSnackbar (value) {
      this.show = true
      this.text = value.text ? value.text : ''
      this.timeout = value.timeout ? value.timeout : -1
      this.color = value.color ? value.color : 'primary'
    },
    closeSnackbar () {
      this.show = false
    }
  },

  // getters
  getters: {
    snackbar: (state) => {
      return { show: state.show, text: state.text, timeout: state.timeout, color: state.color }
    }
  }

})
