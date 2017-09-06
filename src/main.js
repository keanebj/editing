// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import 'blueimp-canvas-to-blob'
import Vue from 'vue'
import router from './router'
import store from './store'
import iView from 'iview'
import './assets/iviewTheme/index.less'
import './assets/style.css'

Vue.use(iView)
Vue.config.productionTip = false
import http from './http'
Vue.prototype.$http = http
import './directive'
import './filtres'
import config from './config'
Vue.prototype.$conf = config
/* eslint-disable no-new */
import app from './app'
var vueEle=new Vue({
  el: '#app',
  router,
  store,
  template: '<app/>',
  components: { app },
  methods:{
   //时间显示模式
  _time(time) {
    var minute = this.changeNum(Math.floor(time / 60));
    var second = this.changeNum(Math.floor(time % 60));
    var time = minute + ':' + second;
    return time;
  },
  changeNum(num, n = 2) {
    var len = num.toString().length;
    while (len < n) {
      num = '0' + num;
      len++;
    }
    return num
  },
  playAudio (audio,playimg,totleTimeDiv,timer,currentTimeDiv,progress) {
  	var totleTime = audio.duration;
	    setTimeout(function () {
	      if(isNaN(totleTime)){
	        totleTime = audio.duration;
	      }
	      else{
	        totleTimeDiv.innerHTML=vueEle._time(totleTime);
	      }
	    }, 100);
	    if(audio.paused){
	      audio.play();
	      //img 的图片
	      playimg.src=playimg.getAttribute("src").replace('loading.gif','playing.gif');

	      //刷新时间
	      clearInterval(timer);
	        timer=setInterval(function(){
	            var currentTime = audio.currentTime;
	            currentTimeDiv.innerHTML=vueEle._time(currentTime);

	            var currentTime = audio.currentTime;
	            var totleTime = audio.duration;
	            var percent = (currentTime / totleTime) * 100;
	            progress.value=percent;

	            if(currentTime ==  audio.duration){
	                playimg.src=playimg.getAttribute("src").replace('playing.gif','play.svg');
	                clearInterval(timer);
	            }
	      },100)
	    }else{
	        playimg.src=playimg.getAttribute("src").replace('playing.gif','play.svg');
	        audio.pause();
	        clearInterval(timer);
	    }
  }
  }
})

//自定义指令--音频播放
Vue.directive('my-directive-audio', {
  bind: function (el,binding,vnode) {
    // 做绑定的准备工作
    // 比如添加事件监听器，或是其他只需要执行一次的复杂操作
    if(binding.value){
      el.innerHTML=binding.value;
      //看是否有音乐播放器
      let audioArr=el.getElementsByClassName('audioWrap');
      if(audioArr && audioArr.length > 0 ){
          //添加播放事件
          for (var i = 0;i<audioArr.length;i++) {
            let timer=null;
            //获得audio
            var item = audioArr[i];
            let audio=item.getElementsByTagName('audio')[0];
            let playimg=item.getElementsByTagName('img')[0];
            let progress=item.getElementsByTagName('progress')[0];
            let totleTimeDiv=item.getElementsByClassName('totleTime')[0];
            let currentTimeDiv=item.getElementsByClassName('currentTime')[0];

            //添加点击事件
            playimg.onclick=function(){
              //获得时长
              playimg.src=playimg.getAttribute("src").replace('play.svg','loading.gif');
              audio.onloadedmetadata = vueEle.playAudio(audio,playimg,totleTimeDiv,timer,currentTimeDiv,progress)
							audio.onended =function(){
		            playimg.src=playimg.getAttribute("src").replace('playing.gif','play.svg');
		            clearInterval(timer);
		          }
          }
        }
      }
    }

  },
  inserted:function(el,binding){
  },
  update: function (el,binding) {
    // 根据获得的新值执行对应的更新
    // 对于初始值也会被调用一次

  },
  componentUpdated:function(el,binding){
    //被绑定元素所在模板完成一次更新周期时调用
    el.innerHTML=binding.value;
    //看是否有音乐播放器
    
    let audioArr=el.getElementsByClassName('audioWrap');
    
    if(audioArr && audioArr.length > 0 ){
        //添加播放事件
        for (var i = 0;i<audioArr.length;i++) {
          let timer=null;
          //获得audio
          var item = audioArr[i];
          let audio=item.getElementsByTagName('audio')[0];
          let playimg=item.getElementsByTagName('img')[0];
          let progress=item.getElementsByTagName('progress')[0];
          let totleTimeDiv=item.getElementsByClassName('totleTime')[0];
          let currentTimeDiv=item.getElementsByClassName('currentTime')[0];

          //添加点击事件
          playimg.onclick=function(){
              //获得时长
            playimg.src=playimg.getAttribute("src").replace('play.svg','loading.gif');
            audio.onloadedmetadata = vueEle.playAudio(audio,playimg,totleTimeDiv,timer,currentTimeDiv,progress)
						audio.onended =function(){
	            playimg.src=playimg.getAttribute("src").replace('playing.gif','play.svg');
	            clearInterval(timer);
	          }
//            var totleTime = audio.duration;
//            setTimeout(function () {
//              if(isNaN(totleTime)){
//                totleTime = audio.duration;
//              }
//              else{
//                totleTimeDiv.innerHTML=vueEle._time(totleTime);
//              }
//            }, 100);
//            if(audio.paused){
//               audio.play();
//               //img 的图片
//               playimg.src=playimg.getAttribute("src").replace('play.svg','playing.gif');
//
//               //刷新时间
//               clearInterval(timer);
//                timer=setInterval(function(){
//                    var currentTime = audio.currentTime;
//                    currentTimeDiv.innerHTML=vueEle._time(currentTime);
//
//                    var currentTime = audio.currentTime;
//                    var totleTime = audio.duration;
//                    var percent = (currentTime / totleTime) * 100;
//                    progress.value=percent;
//
//                    if(currentTime ==  audio.duration){
//                        playimg.src=playimg.getAttribute("src").replace('playing.gif','play.svg');
//                        clearInterval(timer);
//                    }
//              },100)
//            }else{
//                playimg.src=playimg.getAttribute("src").replace('playing.gif','play.svg');
//                audio.pause();
//                clearInterval(timer);
//            }

        }
      }
    }
  },
  unbind: function () {
    // 做清理工作
    // 比如移除在 bind() 中添加的事件监听器
  }
})

