window.onload=function(){


	alert(11111);
  var audio = document.getElementById('audio');
  getTotleTime();
  audio.play();
  setInterval(showCurrentTime,100); //当前播放时间更新
  setInterval(progressBar,100); //进度条

  //点击暂停播放
  $('.audioBtn').click(function() {
    event.stopPropagation();
    if(audio.paused){
      audio.play();
      return; 
    } else { 
      audio.pause();
    }
  });

  //当前时间显示
  function showCurrentTime() {
    var currentTime = audio.currentTime;
    $('.currentTime').html(_time(currentTime));
  }

  //总时长显示
  function getTotleTime() {
    var totleTime = audio.duration;
    setTimeout(function () {  
      if(isNaN(totleTime)){
        getTotleTime();
      }
      else{
        $('.totleTime').html(_time(totleTime)); 
      }
    }, 100);
    console.log(totleTime)
  }

   //时间显示模式
  function _time(time) {
    var minute = changeNum(Math.floor(time / 60));
    var second = changeNum(Math.floor(time % 60));
    var time = minute + ':' + second;
    return time;
  }

  //时间为个位数时在前面添0
  function changeNum(num, n = 2) {
    var len = num.toString().length;
    while (len < n) {
      num = '0' + num;
      len++;
    }
    return num
  }

  //进度条value值
  function progressBar() {
    var currentTime = audio.currentTime;
    var totleTime = audio.duration;
    var percent = (currentTime / totleTime) * 100;
    $('.progress').val(percent);
  }
}