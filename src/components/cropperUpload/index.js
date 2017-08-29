import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'
import conf from '@/config'
export default {
  name: 'ComponentsCropperUpload',
  props: {
    // 域，上传文件name，触发事件会带上（如果一个页面多个图片上传控件，可以做区分
    field: {
      type: String,
      'default': 'file'
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
    //裁剪的最小宽度
    minwidth: {
    	type: Number,
      default: 200
    },
    //裁剪最小高度
    minheight: {
      type: Number,
      default: 200
    },
    // 单文件大小限制
    maxSize: {
      type: Number,
      'default': 10240
    },
    // 图片上传格式
    imgFormat: {
      type: String,
      'default': 'png'
    },
    // 图片地址
    // 直接提供图片地址预览裁剪
    image: {
      'default': null
    },
    cropSuccess: Function,
    cropUploadSuccess: Function,
    cropUploadFail: Function,
    noSel:{
      type: Boolean,
      'default':false
    }
  },
  data() {
    let {
      imgFormat,
      width,
      height,
      minwidth,
      minheight
      } = this
    let allowImgFormat = [
      'jpg',
      'png'
    ]
    let tempImgFormat = allowImgFormat.indexOf(imgFormat) === -1 ? 'jpg' : imgFormat
    this.imgFormat = tempImgFormat
    return {
      linkimg:'',
      visible: false,
      cropper: null,
      headers: {
        token: this.$store.state.token
      },
      // 浏览器是否支持触屏事件
      isSupportTouch: document.hasOwnProperty("ontouchstart"),
      isLoading: true, // 正在加载图片
      uploading: false, // 是否上传中
      progress: 0, // 上传状态及进度
      // 需求图宽高比
      ratio: width / height,
      // 原图地址、生成图片地址
      sourceImg: null,
      sourceImgUrl: '',
      scaleX: 1,
      scaleY: 1
    }
  },
  methods: {
    preventDefault(e) {
      e.preventDefault();
      return false;
    },
    handleClick(e,resel,linkimg) {
      if(linkimg == 'linkimg'){
        this.linkimg=linkimg;
      }
      if(this.linkimg == 'linkimg' && resel =='resel'){
           //正文重新选择
          this.visible=false;
          //调用父组件方法
          this.$emit('fromContent');
          return;
       }
      if(linkimg == 'linkimg'){
        this.sourceImgUrl = this.image;
        setTimeout(() => {
          this.startCrop()
        }, 1000)
        return;
      }else{
        if(this.noSel){
          return;
        }
        if (this.image && resel!='resel') {
          this.sourceImgUrl = this.image
          setTimeout(() => {
            this.startCrop()
          }, 1000)
          return;
        }
        if (e.target !== this.$refs.fileinput) {
          e.preventDefault();
          if (document.activeElement !== this.$els) {
            this.$refs.fileinput.value = ''
            this.$refs.fileinput.click();
          }
        }
       }
    },
    handleChange(e) {
      e.preventDefault();
      let files = e.target.files || e.dataTransfer.files;
      if (this.checkFile(files[0])) {
        this.setSourceImg(files[0]);
      }
    },
    // 检测选择的文件是否合适
    checkFile(file) {
      let { maxSize } = this
      // 仅限图片
      if (file.type.indexOf('image') === -1) {
        this.$Notice.error({
          title: '错误',
          desc: '仅限图片格式'
        })
        return false
      }
      // 超出大小
      if (file.size / 1024 > maxSize) {
        this.$Notice.error({
          title: '错误',
          desc: '单文件大小不能超过 ' + maxSize + 'kb'
        })
        return false
      }
      return true
    },
    // 设置图片源
    setSourceImg(file) {
      this.visible = true
      this.isLoading = true
      let fr = new FileReader();
      fr.onload = (e) => {
        this.sourceImgUrl = fr.result
        this.startCrop()
      }
      fr.readAsDataURL(file)
    },
    // 剪裁前准备工作
    startCrop() {
      let { width, height, minwidth, minheight, sourceImgUrl } = this
      let img = new Image()
      img.src = sourceImgUrl
      img.onload = () => {
        let nWidth = img.naturalWidth
        let nHeight = img.naturalHeight
        // 图片像素不达标
        if (nWidth < minwidth || nHeight < minheight) {
          this.$Notice.error({
            title: '错误',
            desc: '图片最低像素为（宽*高）：' + minwidth + '*' + minheight
          })
          this.visible = false
          return false
        }
        this.sourceImg = img
        this.uploading = false
        this.progress = 0
        if (this.cropper) this.cropper.destroy()
        var image = this.$refs.image
        this.cropper = new Cropper(image, {
          aspectRatio: this.width / this.height,
          viewMode: 1,
          dragMode: 'move',
          autoCropArea: 1,
          minContainerWidth: 760,
          minContainerHeight: 400,
        })
        this.visible = true;
        this.isLoading = false
      }
    },
    // 生成需求图片
    createImg(e) {
      if (this.uploading) return
      // Upload cropped image to server if the browser supports `HTMLCanvasElement.toBlob`
      this.uploading = true
      var canvas = this.cropper.getCroppedCanvas({
        width: this.width,
        height: this.height
      })
      canvas.toBlob((blob) => {
        var formData = new FormData()
        formData.append(this.field, blob, this.field + '.' + this.imgFormat)
        this.cropSuccess && this.visible && this.cropSuccess(blob, this.field, this.ki)
        new Promise((resolve, reject) => {
          let client = new XMLHttpRequest()
          client.open('POST', this.url, true)
          client.onreadystatechange = function () {
            if (this.readyState !== 4) {
              return
            }
            if (this.status === 200 || this.status === 201) {
              resolve(JSON.parse(this.responseText))
            } else {
              reject(this.status)
            }
          }
          client.upload.addEventListener("progress", this.uploadProgress, false)
          // 设置header
          if (typeof this.headers == 'object' && this.headers) {
            Object.keys(this.headers).forEach((k) => {
              client.setRequestHeader(k, this.headers[k])
            })
          }
          // 添加其他参数
          if (typeof this.params == 'object' && this.params) {
            Object.keys(this.params).forEach((k) => {
              formData.append(k, this.params[k])
            })
          }
          client.send(formData)
        }).then((resData) => {
          if (resData.status && resData.status === 100) {
            this.$router.push('/login')
            return false
          }
          this.cropUploadSuccess && this.visible && this.cropUploadSuccess(resData, this.field, this.ki)
          this.visible = false
          this.uploading = false
        }, (sts) => {
          this.$Notice.error({
            title: '错误',
            desc: '图片上传失败'
          })
          this.cropUploadFail && this.visible && this.cropUploadFail(sts, this.field, this.ki)
          this.uploading = false
        });
      })
    },
    uploadProgress(event) {
      if (event.lengthComputable) {
        this.progress = Math.round(100 * event.loaded / event.total)
      }
    },
    move(direction) {
      var x = 0, y = 0
      if (direction === 'left') x = -2
      if (direction === 'right') x = 2
      if (direction === 'up') y = -2
      if (direction === 'down') y = 2
      this.cropper.move(x, y)
    },
    zoom(type) {
      if (type === 'in') this.cropper.zoom(0.1)
      if (type === 'out') this.cropper.zoom(-0.1)
    },
    scale(type) {
      if (type === 'h') this.cropper.scaleX(this.scaleX = -this.scaleX)
      if (type === 'v') this.cropper.scaleY(this.scaleY = -this.scaleY)
    },
    rotate() {
      this.cropper.rotate(90)
    }
  },
  mounted() {
    if (this.image) {
      this.sourceImgUrl = this.image
      setTimeout(() => {
        this.startCrop()
      }, 1000)
    }
  }
}
