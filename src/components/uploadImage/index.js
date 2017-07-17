export default {
  name: 'ComponentsUploadImage',
  props: {
    onSuccess: Function,
    onError: Function,
    action: {
      default: 'http://mp.dev.hubpd.com/api/image/upload'
    },
    accept: {
      default: ''
    }
  },
  data () {
    return {
      headers: {
        token: ''
      }
    }
  },
  created () {
    this.headers = {
      token: this.$store.state.token
    }
  }
}
