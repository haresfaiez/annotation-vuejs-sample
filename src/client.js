var app = new Vue({
  el: '#app',
  methods: {
    source() {
      return { type: 'client', username: this.username }
    },
    title() {
      return this.login ? 'Contoso support' : 'Contoso clients'
    },
    logIn() {
      this.login = { username: this.username }
    },
    userIsLogged() {
      return this.login;
    }
  },
  data: {
    login: false,
    username: ''
  }
})
