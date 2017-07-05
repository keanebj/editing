import { mapState } from 'vuex'
import RecursionMenuItem from '@/components/recursionMenuItem/index.vue'
import ComponentsBreadcrumb from '@/components/breadcrumb/index.vue'
export default {
  components: {RecursionMenuItem, ComponentsBreadcrumb},
  computed: {
    ...mapState(['menu'])
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