import { mapState } from 'vuex'
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
  computed: {   
    ...mapState([
      'aaaa'
    ])    
  },
  created () {

  }
}
