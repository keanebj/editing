const mimes = {
  'jpg': 'image/jpeg',
  'png': 'image/png',
  'gif': 'image/gif',
  'svg': 'image/svg+xml',
  'psd': 'image/photoshop'
},
  // 点击波纹效果
  effectRipple = function (e, arg_opts) {
    let opts = Object.assign({
      ele: e.target, // 波纹作用元素
      type: 'hit', // hit点击位置扩散　center中心点扩展
      bgc: 'rgba(0, 0, 0, 0.15)' // 波纹颜色
    }, arg_opts),
      target = opts.ele;
    if (target) {
      let rect = target.getBoundingClientRect(),
        ripple = target.querySelector('.e-ripple');
      if (!ripple) {
        ripple = document.createElement('span');
        ripple.className = 'e-ripple';
        ripple.style.height = ripple.style.width = Math.max(rect.width, rect.height) + 'px';
        target.appendChild(ripple);
      } else {
        ripple.className = 'e-ripple';
      }
      switch (opts.type) {
        case 'center':
          ripple.style.top = (rect.height / 2 - ripple.offsetHeight / 2) + 'px';
          ripple.style.left = (rect.width / 2 - ripple.offsetWidth / 2) + 'px';
          break;
        default:
          ripple.style.top = (e.pageY - rect.top - ripple.offsetHeight / 2 - document.body.scrollTop) + 'px';
          ripple.style.left = (e.pageX - rect.left - ripple.offsetWidth / 2 - document.body.scrollLeft) + 'px';
      }
      ripple.style.backgroundColor = opts.bgc;
      ripple.className = 'e-ripple z-active';
      return false;
    }
  },
  // database64文件格式转换为2进制
  data2blob = function (data, mime) {
    // dataURL 的格式为 “data:image/png;base64,****”,逗号之前都是一些说明性的文字，我们只需要逗号之后的就行了
    data = data.split(',')[1];
    data = window.atob(data);
    var ia = new Uint8Array(data.length);
    for (var i = 0; i < data.length; i++) {
      ia[i] = data.charCodeAt(i);
    };
    // canvas.toDataURL 返回的默认格式就是 image/png
    return new Blob([ia], { type: mime });
  };
import conf from '@/config'
export default {
  name: 'ComponentsImageCropUpload',
  props: {
    // 域，上传文件name，触发事件会带上（如果一个页面多个图片上传控件，可以做区分
    field: {
      type: String,
      'default': 'file'
    },
    data: {
      default: null
    },
    // 类似于id，触发事件会带上（如果一个页面多个图片上传控件，可以做区分
    ki: {
      'default': 0
    },
    // 上传地址
    url: {
      type: String,
      'default': `${conf.host}${conf.serverRoot}api/image/upload`
    },
    // 其他要上传文件附带的数据，对象格式
    params: {
      type: Object,
      'default': null
    },
    // 剪裁图片的宽
    width: {
      type: Number,
      default: 200
    },
    // 剪裁图片的高
    height: {
      type: Number,
      default: 200
    },
    // 不预览圆形图片
    noCircle: {
      type: Boolean,
      default: false
    },
    // 单文件大小限制
    maxSize: {
      type: Number,
      'default': 10240
    },
    // 语言类型
    langType: {
      type: String,
      'default': 'zh'
    },
    // 语言包
    langExt: {
      type: Object,
      'default': null
    },
    // 图片上传格式
    imgFormat: {
      type: String,
      'default': 'png'
    },
    cropSuccess: Function,
    cropUploadSuccess: Function,
    cropUploadFail: Function
  },
  data() {
    let that = this,
      {
        imgFormat,
        langType,
        langExt,
        width,
        height
      } = that,
      isSupported = true,
      allowImgFormat = [
        'jpg',
        'png'
      ],
      langBag = {
        zh: {
          hint: '点击，或拖动图片至此处',
          loading: '正在上传……',
          noSupported: '浏览器不支持该功能，请使用IE10以上或其他现在浏览器！',
          success: '上传成功',
          fail: '图片上传失败',
          preview: '头像预览',
          btn: {
            off: '取消',
            close: '关闭',
            back: '上一步',
            save: '保存'
          },
          error: {
            onlyImg: '仅限图片格式',
            outOfSize: '单文件大小不能超过 ',
            lowestPx: '图片最低像素为（宽*高）：'
          }
        }
      },
      tempImgFormat = allowImgFormat.indexOf(imgFormat) === -1 ? 'jpg' : imgFormat,
      lang = langBag[langType] ? langBag[langType] : lang['zh'],
      mime = mimes[tempImgFormat];
    // 规范图片格式
    that.imgFormat = tempImgFormat;

    if (langExt) {
      Object.assign(lang, langExt);
    }
    if (typeof FormData != 'function') {
      isSupported = false;
    }
    return {
      headers: {
        token: this.$store.state.token
      },
      // 图片的mime
      mime,

      // 语言包
      lang,

      // 浏览器是否支持该控件
      isSupported,
      // 浏览器是否支持触屏事件
      isSupportTouch: document.hasOwnProperty("ontouchstart"),

      // 步骤
      step: 1, //1选择文件 2剪裁 3上传

      // 上传状态及进度
      loading: 0, //0未开始 1正在 2成功 3错误
      progress: 0,

      // 是否有错误及错误信息
      hasError: false,
      errorMsg: '',

      // 需求图宽高比
      ratio: width / height,

      // 原图地址、生成图片地址
      sourceImg: null,
      sourceImgUrl: '',
      createImgUrl: '',

      // 原图片拖动事件初始值
      sourceImgMouseDown: {
        on: false,
        mX: 0, //鼠标按下的坐标
        mY: 0,
        x: 0, //scale原图坐标
        y: 0
      },

      // 生成图片预览的容器大小
      previewContainer: {
        width: 100,
        height: 100
      },

      // 原图容器宽高
      sourceImgContainer: { // sic
        width: 550,
        height: 230
      },

      // 原图展示属性
      scale: {
        zoomAddOn: false, //按钮缩放事件开启
        zoomSubOn: false, //按钮缩放事件开启
        range: 1, //最大100
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        maxWidth: 0,
        maxHeight: 0,
        minWidth: 0, //最宽
        minHeight: 0,
        naturalWidth: 0, //原宽
        naturalHeight: 0
      }
    }
  },
  computed: {
    // 进度条样式
    progressStyle() {
      let {
                progress
            } = this;
      return {
        width: progress + '%'
      }
    },
    // 原图样式
    sourceImgStyle() {
      let {
                scale,
        sourceImgMasking
            } = this;
      return {
        top: scale.y + sourceImgMasking.y + 'px',
        left: scale.x + sourceImgMasking.x + 'px',
        width: scale.width + 'px',
        height: scale.height + 'px'
      }
    },
    // 原图蒙版属性
    sourceImgMasking() {
      let {
                width,
        height,
        ratio,
        sourceImgContainer
            } = this,
        sic = sourceImgContainer,
        sicRatio = sic.width / sic.height, // 原图容器宽高比
        x = 0,
        y = 0,
        w = sic.width,
        h = sic.height,
        scale = 1;
      if (ratio < sicRatio) {
        scale = sic.height / height;
        w = sic.height * ratio;
        x = (sic.width - w) / 2;
      }
      if (ratio > sicRatio) {
        scale = sic.width / width;
        h = sic.width / ratio;
        y = (sic.height - h) / 2;
      }
      return {
        scale, // 蒙版相对需求宽高的缩放
        x,
        y,
        width: w,
        height: h
      };
    },
    // 原图遮罩样式
    sourceImgShadeStyle() {
      let {
                sourceImgMasking,
        sourceImgContainer
            } = this,
        sic = sourceImgContainer,
        sim = sourceImgMasking,
        w = sim.width == sic.width ? sim.width : (sic.width - sim.width) / 2,
        h = sim.height == sic.height ? sim.height : (sic.height - sim.height) / 2;
      return {
        width: w + 'px',
        height: h + 'px'
      };
    },
    previewStyle() {
      let {
                width,
        height,
        ratio,
        previewContainer
            } = this,
        pc = previewContainer,
        w = pc.width,
        h = pc.height,
        pcRatio = w / h;
      if (ratio < pcRatio) {
        w = pc.height * ratio;
      }
      if (ratio > pcRatio) {
        h = pc.width / ratio;
      }
      return {
        width: w + 'px',
        height: h + 'px'
      };
    }
  },
  methods: {
    // 点击波纹效果
    ripple(e) {
      effectRipple(e);
    },
    // 关闭控件
    off() {
      setTimeout(() => {
        this.reset()
      }, 200);
    },
    // 设置步骤
    setStep(no) {
      setTimeout(() => {
        this.step = no;
      }, 200);
    },

    /* 图片选择区域函数绑定
     ---------------------------------------------------------------*/
    preventDefault(e) {
      e.preventDefault();
      return false;
    },
    handleClick(e) {
      if (e.target !== this.$refs.fileinput) {
        e.preventDefault();
        if (document.activeElement !== this.$els) {
          this.$refs.fileinput.click();
        }
      }
    },
    handleChange(e) {
      e.preventDefault();
      let files = e.target.files || e.dataTransfer.files;
      this.reset();
      if (this.checkFile(files[0])) {
        this.setSourceImg(files[0]);
      }
    },
    /* ---------------------------------------------------------------*/

    // 检测选择的文件是否合适
    checkFile(file) {
      let that = this,
        {
                    lang,
          maxSize
                } = that;
      // 仅限图片
      if (file.type.indexOf('image') === -1) {
        that.hasError = true;
        that.errorMsg = lang.error.onlyImg;
        that.$Notice.error({
          title: '错误',
          desc: lang.error.onlyImg
        })
        return false;
      }

      // 超出大小
      if (file.size / 1024 > maxSize) {
        that.hasError = true;
        that.errorMsg = lang.error.outOfSize + maxSize + 'kb';
        this.$Notice.error({
          title: '错误',
          desc: lang.error.outOfSize + maxSize + 'kb'
        })
        return false;
      }
      return true;
    },
    // 重置控件
    reset() {
      this.loading = 0;
      this.progress = 0;
      this.step = 1;
      this.hasError = false;
      this.errorMsg = '';
    },
    // 设置图片源
    setSourceImg(file) {
      let that = this,
        fr = new FileReader();
      fr.onload = function (e) {
        that.sourceImgUrl = fr.result;
        that.startCrop();
      }
      fr.readAsDataURL(file);
    },
    // 剪裁前准备工作
    startCrop() {
      let that = this,
        {
                    width,
          height,
          ratio,
          scale,
          sourceImgUrl,
          sourceImgMasking,
          lang
                } = that,
        sim = sourceImgMasking,
        img = new Image();
      img.src = sourceImgUrl;
      img.onload = function () {
        let nWidth = img.naturalWidth,
          nHeight = img.naturalHeight,
          nRatio = nWidth / nHeight,
          w = sim.width,
          h = sim.height,
          x = 0,
          y = 0;
        // 图片像素不达标
        if (nWidth < width || nHeight < height) {
          that.hasError = true;
          that.errorMsg = lang.error.lowestPx + width + '*' + height;
          that.$Notice.error({
            title: '错误',
            desc: lang.error.lowestPx + width + '*' + height
          })
          return false;
        }
        if (ratio > nRatio) {
          h = w / nRatio;
          y = (sim.height - h) / 2;
        }
        if (ratio < nRatio) {
          w = h * nRatio;
          x = (sim.width - w) / 2;
        }
        scale.range = 0;
        scale.x = x;
        scale.y = y;
        scale.width = w;
        scale.height = h;
        scale.minWidth = w;
        scale.minHeight = h;
        scale.maxWidth = nWidth * sim.scale;
        scale.maxHeight = nHeight * sim.scale;
        scale.naturalWidth = nWidth;
        scale.naturalHeight = nHeight;
        that.sourceImg = img;
        that.createImg();
        that.setStep(2);
      };
    },
    // 鼠标按下图片准备移动
    imgStartMove(e) {
      e.preventDefault();
      // 支持触摸事件，则鼠标事件无效
      if (this.isSupportTouch && !e.targetTouches) {
        return false;
      }
      let et = e.targetTouches ? e.targetTouches[0] : e,
        {
                    sourceImgMouseDown,
          scale
                } = this,
        simd = sourceImgMouseDown;
      simd.mX = et.screenX;
      simd.mY = et.screenY;
      simd.x = scale.x;
      simd.y = scale.y;
      simd.on = true;
    },
    // 鼠标按下状态下移动，图片移动
    imgMove(e) {
      e.preventDefault();
      // 支持触摸事件，则鼠标事件无效
      if (this.isSupportTouch && !e.targetTouches) {
        return false;
      }
      let et = e.targetTouches ? e.targetTouches[0] : e,
        {
                    sourceImgMouseDown: {
                        on,
          mX,
          mY,
          x,
          y
                    },
          scale,
          sourceImgMasking
                } = this,
        sim = sourceImgMasking,
        nX = et.screenX,
        nY = et.screenY,
        dX = nX - mX,
        dY = nY - mY,
        rX = x + dX,
        rY = y + dY;
      if (!on) return;
      if (rX > 0) {
        rX = 0;
      }
      if (rY > 0) {
        rY = 0;
      }
      if (rX < sim.width - scale.width) {
        rX = sim.width - scale.width;
      }
      if (rY < sim.height - scale.height) {
        rY = sim.height - scale.height;
      }
      scale.x = rX;
      scale.y = rY;
    },
    // 按钮按下开始放大
    startZoomAdd(e) {
      let that = this,
        {
                    scale
                } = that;
      scale.zoomAddOn = true;

      function zoom() {
        if (scale.zoomAddOn) {
          let range = scale.range >= 100 ? 100 : ++scale.range;
          that.zoomImg(range);
          setTimeout(function () {
            zoom();
          }, 60);
        }
      }
      zoom();
    },
    // 按钮松开或移开取消放大
    endZoomAdd(e) {
      this.scale.zoomAddOn = false;
    },
    // 按钮按下开始缩小
    startZoomSub(e) {
      let that = this,
        {
                    scale
                } = that;
      scale.zoomSubOn = true;

      function zoom() {
        if (scale.zoomSubOn) {
          let range = scale.range <= 0 ? 0 : --scale.range;
          that.zoomImg(range);
          setTimeout(function () {
            zoom();
          }, 60);
        }
      }
      zoom();
    },
    // 按钮松开或移开取消缩小
    endZoomSub(e) {
      let {
                scale
            } = this;
      scale.zoomSubOn = false;
    },
    zoomChange(e) {
      this.zoomImg(e.target.value);
    },
    // 缩放原图
    zoomImg(newRange) {
      let that = this,
        {
                    sourceImgMasking,
          sourceImgMouseDown,
          scale
                } = this,
        {
                    maxWidth,
          maxHeight,
          minWidth,
          minHeight,
          width,
          height,
          x,
          y,
          range
                } = scale,
        sim = sourceImgMasking,
        // 蒙版宽高
        sWidth = sim.width,
        sHeight = sim.height,
        // 新宽高
        nWidth = minWidth + (maxWidth - minWidth) * newRange / 100,
        nHeight = minHeight + (maxHeight - minHeight) * newRange / 100,
        // 新坐标（根据蒙版中心点缩放）
        nX = sWidth / 2 - (nWidth / width) * (sWidth / 2 - x),
        nY = sHeight / 2 - (nHeight / height) * (sHeight / 2 - y);

      // 判断新坐标是否超过蒙版限制
      if (nX > 0) {
        nX = 0;
      }
      if (nY > 0) {
        nY = 0;
      }
      if (nX < sWidth - nWidth) {
        nX = sWidth - nWidth;
      }
      if (nY < sHeight - nHeight) {
        nY = sHeight - nHeight;
      }

      // 赋值处理
      scale.x = nX;
      scale.y = nY;
      scale.width = nWidth;
      scale.height = nHeight;
      scale.range = newRange;
      setTimeout(function () {
        if (scale.range == newRange) {
          that.createImg();
        }
      }, 300);
    },
    // 生成需求图片
    createImg(e) {
      let that = this,
        {
                    mime,
          sourceImg,
          scale: {
                        x,
            y,
            width,
            height
                    },
          sourceImgMasking: {
                        scale
                    }
                } = that,
        canvas = that.$refs.canvas,
        ctx = canvas.getContext('2d');
      if (e) {
        // 取消鼠标按下移动状态
        that.sourceImgMouseDown.on = false;
      }
      ctx.clearRect(0, 0, that.width, that.height);
      ctx.drawImage(sourceImg, x / scale, y / scale, width / scale, height / scale);
      that.createImgUrl = canvas.toDataURL(mime);
    },
    // 上传图片
    upload() {
      let that = this,
        {
                    lang,
          imgFormat,
          mime,
          url,
          params,
          field,
          ki,
          createImgUrl
                } = this,
        fmData = new FormData();
      fmData.append(field, data2blob(createImgUrl, mime), field + '.' + imgFormat);

      // 添加其他参数
      if (typeof params == 'object' && params) {
        Object.keys(params).forEach((k) => {
          fmData.append(k, params[k]);
        })
      }

      // 监听进度回调
      const uploadProgress = function (event) {
        if (event.lengthComputable) {
          that.progress = 100 * Math.round(event.loaded) / event.total;
        }
      };

      // 上传文件
      that.reset();
      that.loading = 1;
      that.setStep(3);
      that.cropSuccess && that.cropSuccess(createImgUrl, field, ki);
      new Promise(function (resolve, reject) {
        let client = new XMLHttpRequest();
        client.open('POST', url, true);
        client.onreadystatechange = function () {
          if (this.readyState !== 4) {
            return;
          }
          if (this.status === 200 || this.status === 201) {
            resolve(JSON.parse(this.responseText));
          } else {
            reject(this.status);
          }
        };
        client.upload.addEventListener("progress", uploadProgress, false); //监听进度\
        // 设置header
        if (typeof that.headers == 'object' && that.headers) {
          Object.keys(that.headers).forEach((k) => {
            client.setRequestHeader(k, that.headers[k]);
          })
        }
        client.send(fmData);
      }).then(
        // 上传成功
        function (resData) {
          if (that.loading === 1) {
            that.loading = 2;
            that.cropUploadSuccess && that.cropUploadSuccess(that.data, resData, field, ki);
          }
        },
        // 上传失败
        function (sts) {
          if (that.loading === 1) {
            that.loading = 3;
            that.hasError = true;
            that.errorMsg = lang.fail;
            that.$Notice.error({
              title: '错误',
              desc: lang.fail
            })
            that.cropUploadFail && that.cropUploadFail(that.data, sts, field, ki);
          }
        }
        );
    }
  }
}