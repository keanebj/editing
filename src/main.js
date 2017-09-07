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
  playAudio(audio,playimg,totleTimeDiv,currentTimeDiv,progress,audioBtn,prefix){
    if(audio.paused){
        audio.play();
        //img 的图片
        playimg.style.display="block";
        playimg.src=playimg.getAttribute("src").replace('play.svg','playing.gif');
        audioBtn.style.backgroundImage='';
        //刷新时间
        clearInterval(audio.timer);
          audio.timer=setInterval(function(){
              var currentTime = audio.currentTime;
              currentTimeDiv.innerHTML=vueEle._time(currentTime);
              var currentTime = audio.currentTime;
              var totleTime = audio.duration;
              if (isNaN(totleTime)) {
                totleTimeDiv.innerHTML = "加载...";
              }else{
                totleTimeDiv.innerHTML=vueEle._time(totleTime);
              }
              var percent = (currentTime / totleTime) * 100;
              progress.value=percent;

              if(currentTime ==  audio.duration){
                  audioBtn.style.backgroundImage = 'url("'+prefix+'static/ueditor/audioimages/play.svg")';
                  playimg.style.display = 'none';
                  clearInterval(audio.timer);
              }
        },100)
    }else{
        audioBtn.style.backgroundImage = 'url("'+prefix+'static/ueditor/audioimages/play.svg")';
        playimg.style.display = 'none';
        audio.pause();
        clearInterval(audio.timer);
    }
  },
  getDuration (audio,playimg,totleTimeDiv,currentTimeDiv,progress,audioBtn,prefix) {
    var totleTime =audio.duration;
      //判断是否获得了时长(因为手机端会获得不到时间)
      var ua = navigator.userAgent.toLowerCase();
      if(ua.match(/MicroMessenger/i)=="micromessenger") {
          totleTime =audio.duration;
          vueEle.playAudio(audio,playimg,totleTimeDiv,currentTimeDiv,progress,audioBtn,prefix);
       } else {
        if(totleTime == 0 || totleTime == Infinity || isNaN(totleTime)){
          clearInterval(checkDurTimer);
          var checkDurTimer=setInterval(function(){
              totleTime = audio.duration;
              if(totleTime == 0 || totleTime == Infinity || isNaN(totleTime)){
                  // 没有获得到时间,一直是loading的状态
              }else{
                  //获得到了时长
                  clearInterval(checkDurTimer);
                  totleTimeDiv.innerHTML=vueEle._time(totleTime);
                  vueEle.playAudio(audio,playimg,totleTimeDiv,currentTimeDiv,progress,audioBtn,prefix);
              }
          },1000)
        }else{
            //获得到了时长
                totleTimeDiv.innerHTML=vueEle._time(totleTime);
                vueEle.playAudio(audio,playimg,totleTimeDiv,currentTimeDiv,progress,audioBtn,prefix);
        }
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
            //获得audio
            var item = audioArr[i];
            let prefix=item.getAttribute("audio-prefix");
            let audio=item.getElementsByTagName('audio')[0];
            audio.timer=null;
            let playimg=item.getElementsByTagName('img')[0];
            let progress=item.getElementsByTagName('progress')[0];
            let totleTimeDiv=item.getElementsByClassName('totleTime')[0];
            let currentTimeDiv=item.getElementsByClassName('currentTime')[0];
            let audioBtn = item.getElementsByClassName('audioBtn')[0];
					  audioBtn.style.backgroundImage = 'url("'+prefix+'static/ueditor/audioimages/play.svg")';
            audioBtn.style.backgroundRepeat='no-repeat';
            audioBtn.style.backgroundSize = '42px 42px';
					  playimg.style.display = 'none';
            audio.onended =function(){
	            audioBtn.style.backgroundImage = 'url("'+prefix+'static/ueditor/audioimages/play.svg")';
              playimg.style.display = 'none';
	            clearInterval(audio.timer);
	          }
            //添加点击事件
            audioBtn.onclick=function(){
              if(audio.duration == 0 || audio.duration == Infinity || isNaN(audio.duration)){
                //获得到时长
                audioBtn.style.backgroundImage = 'url("'+prefix+'static/ueditor/audioimages/loading.gif")';
              }
              audio.canplaythrough = vueEle.getDuration(audio,playimg,totleTimeDiv,currentTimeDiv,progress,audioBtn,prefix);
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
        for (var i = 0;i < audioArr.length;i++) {
          //获得audio
          let item = audioArr[i];
          let prefix=item.getAttribute("audio-prefix");
          let audio=item.getElementsByTagName('audio')[0];
          audio.timer=null;
          let playimg=item.getElementsByTagName('img')[0];
          let progress=item.getElementsByTagName('progress')[0];
          let totleTimeDiv=item.getElementsByClassName('totleTime')[0];
          let currentTimeDiv=item.getElementsByClassName('currentTime')[0];
          let audioBtn = item.getElementsByClassName('audioBtn')[0];
					audioBtn.style.backgroundImage = 'url("'+prefix+'static/ueditor/audioimages/play.svg")';
          audioBtn.style.backgroundRepeat='no-repeat';
					audioBtn.style.backgroundSize = '42px 42px';
					playimg.style.display = 'none';
          audio.onended =function(){
	            audioBtn.style.backgroundImage= 'url("'+prefix+'static/ueditor/audioimages/play.svg")';
              playimg.style.display = 'none';
	            clearInterval(audio.timer);
	          }
          //添加点击事件
          audioBtn.onclick=function(){

            if(audio.duration == 0 || audio.duration == Infinity || isNaN(audio.duration)){
              //获得到时长
              audioBtn.style.backgroundImage = 'url("'+prefix+'static/ueditor/audioimages/loading.gif")';
            }
            audio.onloadedmetadata = vueEle.getDuration(audio,playimg,totleTimeDiv,currentTimeDiv,progress,audioBtn,prefix)

        }
      }
    }
  },
  unbind: function () {
    // 做清理工作
    // 比如移除在 bind() 中添加的事件监听器
  }
})

