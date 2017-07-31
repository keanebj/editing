export default {
  name: 'scrollBar',
  props: [
    'previewCon',
    'tempi',
    'iIndex'
  ],
  created () {

  },
  data () {
    return {
      i:-1,
      contentCoverSrc: '',
    }
  },
  watch:{
    iIndex:function(){
      this.i=this.iIndex[0];
    }
  },

  computed: {
//  previewCon: function () {
////  	return this.previewCon
//  }
  },
  mounted () {
    this.$emit('element', [this.$refs.onscroll, this.$refs.scrollCon, this.$refs.scroll, this.$refs.setCon]);
  },
  updated () {
    this.$emit('iIndex', [this.i, this.contentCoverSrc]);
  },
  methods: {
    selectCover:function(index){
      this.i=index;
      this.contentCoverSrc=this.previewCon[index].src;
    },
    scrollBar: function (e) {
      if (this.$refs.setCon.clientHeight >= this.$refs.onscroll.clientHeight) {
        return;
      }else{
        if (e.wheelDelta) {
          if (e.wheelDelta < 0) {
            let t = this.$refs.onscroll.offsetTop;
            t -= 20;
            if ( t <= -(this.$refs.onscroll.clientHeight - this.$refs.setCon.clientHeight)){
              t = this.$refs.setCon.clientHeight - this.$refs.onscroll.clientHeight;
            }
            let scale = t/(this.$refs.onscroll.clientHeight - this.$refs.setCon.clientHeight);
            let scTop = scale*(this.$refs.scroll.clientHeight - this.$refs.scrollCon.clientHeight)
            this.$refs.scrollCon.style.top = -scTop + 'px';
            this.$refs.onscroll.style.top = t + 'px';
          }else if (e.wheelDelta > 0) {
            let t = this.$refs.onscroll.offsetTop;
            t += 20;
            if ( t >= 0) {
              t = 0
            }
            let scale = t/(this.$refs.onscroll.clientHeight - this.$refs.setCon.clientHeight);
            let scTop = scale*(this.$refs.scroll.clientHeight - this.$refs.scrollCon.clientHeight)
            this.$refs.scrollCon.style.top = -scTop + 'px';
            this.$refs.onscroll.style.top = t + 'px';
          }
        }else if (e.detail) {
          if (e.detail > 0) {
            let t = this.$refs.onscroll.offsetTop;
            t -= 20;
            if ( t <= -(this.$refs.onscroll.clientHeight - this.$refs.setCon.clientHeight)){
              t = this.$refs.setCon.clientHeight - this.$refs.onscroll.clientHeight;
            }
            let scale = t/(this.$refs.onscroll.clientHeight - this.$refs.setCon.clientHeight);
            let scTop = scale*(this.$refs.scroll.clientHeight - this.$refs.scrollCon.clientHeight)
            this.$refs.scrollCon.style.top = -scTop + 'px';
            this.$refs.onscroll.style.top = t + 'px';
          }else if (e.detail < 0) {
            let t = this.$refs.onscroll.offsetTop;
            t += 20;
            if ( t <= -(this.$refs.onscroll.clientHeight - this.$refs.setCon.clientHeight)){
              t = this.$refs.setCon.clientHeight - this.$refs.onscroll.clientHeight;
            }
            let scale = t/(this.$refs.onscroll.clientHeight - this.$refs.setCon.clientHeight);
            let scTop = scale*(this.$refs.scroll.clientHeight - this.$refs.scrollCon.clientHeight)
            this.$refs.scrollCon.style.top = -scTop + 'px';
            this.$refs.onscroll.style.top = t + 'px';
          }
        }
      }

    },
    mouseScroll: function (ev) {
      let cY = ev.clientY;
      let onscroll = this.$refs.onscroll;
      let setCon = this.$refs.setCon;
      let scroll = this.$refs.scroll;
      let scrollCon = this.$refs.scrollCon;
      document.onmousemove = function (e) {
        if (setCon.clientHeight >= onscroll.clientHeight) {
          return;
        }else{
          let ch = cY - e.clientY;
          let Top = ch + onscroll.offsetTop;
          if (Top>=0) {
            Top = 0;
          }
          if(Top<= (setCon.clientHeight - onscroll.clientHeight)) {
            Top = setCon.clientHeight - onscroll.clientHeight
          }
          let scale = Top/(onscroll.clientHeight - setCon.clientHeight);
          let scTop = scale*(scroll.clientHeight - scrollCon.clientHeight)
          onscroll.style.top = Top + 'px';
          scrollCon.style.top = -scTop + 'px';
        }
      }
      document.onmouseup = function () {
        document.onmousemove = null;
      }
    },
    barScroll: function (ev) {
      let cY = ev.clientY - this.$refs.scrollCon.offsetTop;
      let onscroll = this.$refs.onscroll;
      let setCon = this.$refs.setCon;
      let scroll = this.$refs.scroll;
      let scrollCon = this.$refs.scrollCon;
      document.onmousemove = function (e) {
        if (setCon.clientHeight >= onscroll.clientHeight) {
          return;
        }else{
          let Top = e.clientY - cY;
          //				let Top = ch + scrollCon.offsetTop;
          if (Top<=0) {
            Top = 0;
          }
          if(Top>= (scroll.clientHeight - scrollCon.clientHeight)) {
            Top = scroll.clientHeight - scrollCon.clientHeight
          }
          let scale = Top/(scroll.clientHeight - scrollCon.clientHeight);
          let scTop = scale*(onscroll.clientHeight - setCon.clientHeight)
          scrollCon.style.top = Top + 'px';
          onscroll.style.top = -scTop + 'px';
        }
      }
      document.onmouseup = function () {
        document.onmousemove = null;
      }
    }
  }
}
