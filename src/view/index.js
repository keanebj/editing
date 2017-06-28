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
    this.$store.commit('set', {
      aaaa: 1000
    })
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