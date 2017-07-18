export default {
  name: 'ComponentsMainMenu',
  props: {
    data: Array,
    onSelect: Function,
    menuKey: {
      type: String,
      default: ''
    },
    roleType: {
      type: String,
      default: 'Manage'
    }
  },
  methods: {
  },
  created() { },
  mounted() { }
}
