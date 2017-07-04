export default {
  data() {
    return {
      formItem: {
        input: '',
        select: '',
        radio: 'male',
        checkbox: [],
        switch: true,
        date: '',
        time: '',
        slider: [20, 50],
        textarea: ''
      }
    }
  },
  created () {
    this.$store.commit('set', {
      aaaa: 555
    })
    console.log(this.$store.state)
  }
}