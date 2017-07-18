export default {
  name: 'ComponentsMainHeader',
  data() {
    return {
      userName:$store.state.userinfo.username
    }
  },
  props: {
     logOut: Function
  },
  methods: {    
  },
  created() {},
  mounted() {}
}
