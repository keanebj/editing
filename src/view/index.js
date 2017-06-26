  import { mapState } from 'vuex'
  export default {
    computed: {
      ...mapState(['menu', 'breadcrumb'])
    },
    mounted () {
      console.log(this.menu)
    },
    methods: {
      onSelect (e) {
        if (e.path) {
          this.$router.push({
            path: e.path
          })
        }
      }
    }
  }