
export default {
  name: 'SourceVideo',
  created () {
    this.fetch()
  },
  data () {
    return {
    }
  },
  methods: {
    fetch () {
      this.$http.get('/api/user').then((req) => {
        console.log(req)
      })
      this.$http.post('/api/post').then((req) => {
        console.log(req)
      })
    }
  }
}
