export default {
  name: 'ComponentsMainHeader',
  data() {
    return {}
  },
  props: {
    logOut: Function,
    goHome: Function,
    goAccount: Function,
    studioLogo: {
      type: String,
      default: ''
    },
    userName: {
      type: String,
      default: ''
    },
    studioName: {
    	type: String,
      default: ''
    }
  },
  methods: {},
  created() {},
  mounted() {}
}
