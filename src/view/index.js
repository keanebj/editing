import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState(['menu', 'breadcrumb'])
  },
  data () {
    return {
    }
  },
  created () {
    
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