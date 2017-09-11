export default {
  name: 'scrollBar',
  props: [
    'previewCon',
    'tempi',
    'iIndex',
    'selVideoid',
    'scrollHeight',
    'setConHeight'
  ],
  created () {

  },
  data () {
    return {
      i:-1,
      contentCoverSrc: '',
      author: '',
      currentvideoid:'',

    }
  },
  watch:{
    iIndex:function(){
      this.i=this.iIndex[0];
    },
    selVideoid:function(val){
      this.currentvideoid=val;
    },
    currentvideoid:function(val){
      this.$emit('changeSelVideo',val);
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
    changeRadios (id) {
      let $=qaVideo.get("$");
      let This = this;
      setTimeout(function () {
        for (var i=0;i<$('#resource-manage').find('label').length;i++) {
          if ($('#resource-manage').find('label').eq(i).hasClass('ivu-radio-wrapper-checked')) {
            This.$store.state.videourl = $('#resource-manage').find('label').eq(i).attr('url');
          }
        }
      },200)
    },
  	changeRadio (id,code,url) {
  		if (code == 2) {
        this.currentvideoid = id;
        this.$store.state.videourl = url;
        console.log(url)
  		}
  	},
  	previewConauthor: function (author) {
  		this.author = author;
  	},
  	selectDom: function () {
  		var setCon = this.$refs.setCon;
  		var onscroll = this.$refs.onscroll;
  		var scroll = this.$refs.scroll;
  		var scrollCon = this.$refs.scrollCon;
  		clearTimeout(time)

      var time=setTimeout(function () {
      	if (setCon.clientHeight < onscroll.clientHeight) {
	      	scrollCon.style.display = 'block';
	      	scroll.style.display = 'block';
	      	var scale = setCon.clientHeight / onscroll.clientHeight;
	      	scrollCon.style.height = scroll.clientHeight*scale + 'px'
	      }else{
	      	scrollCon.style.display = 'none';
	      	scroll.style.display = 'none';
	      }
      },10)
  	},
    selectCover:function(index){
      this.i=index;
      this.contentCoverSrc=this.previewCon[index].src;
    },
    closeCover: function () {
    	this.i = -1;
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
        }else if (e.detail == 0) {
          if (e.deltaY > 0) {
            let t = this.$refs.onscroll.offsetTop;
            t -= 20;
            if ( t <= -(this.$refs.onscroll.clientHeight - this.$refs.setCon.clientHeight)){
              t = this.$refs.setCon.clientHeight - this.$refs.onscroll.clientHeight;
            }
            let scale = t/(this.$refs.onscroll.clientHeight - this.$refs.setCon.clientHeight);
            let scTop = scale*(this.$refs.scroll.clientHeight - this.$refs.scrollCon.clientHeight)
            this.$refs.scrollCon.style.top = -scTop + 'px';
            this.$refs.onscroll.style.top = t + 'px';
          }else if (e.deltaY < 0) {
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
