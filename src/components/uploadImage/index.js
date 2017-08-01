import conf from '@/config'
export default {
  name: 'ComponentsUploadImage',
  props: {
    onSuccess: Function,
    onError: Function,
    action: {
      default: `${conf.host}api/image/upload`
    },
    accept: {
      default: ''
    },
    data: {
      default: null
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
  },
  methods: {
    handleSuccess (response, file, fileList) {
      this.onSuccess(this.data, response, file, fileList)
    },
    handleError (error, file, fileList) {
      this.onSuccess(this.data, error, file, fileList)
    }
  }
}
