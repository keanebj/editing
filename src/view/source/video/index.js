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
      this.$http.get('/api/user', (req) => {
        console.log(req)
      })
    }
  }
}
