<template>
    <div class="comAside">
        <div class="fod-send clearfix">
            <div class="fl">
                <Tooltip placement="top" content="表情">
                    <a href="javascript:void(0)" @click="insertIcon">
                        <img src="../assets/live/feeling.svg" alt="" />
                    </a>
                </Tooltip>
            </div>
            <div class="fl">
                <Tooltip placement="top" content="图片">
                    <a href="javascript:void(0)">
                        <cropper-upload :width="200" :height="100" :cropUploadSuccess="onSuccessSend" :cropUploadFail="onError" :maxSize="2048">
                            <div class="headImgBox">
                                <img src="../assets/live/picture.svg" alt="" />
                            </div>
                        </cropper-upload>
                    </a>
                </Tooltip>
            </div>
            <div class="fr">
                <Button @click="onput">发送</Button>
            </div>
        </div>

        <div style="width:90%;margin:0 auto;">
            <div><img :src="formSend_path" alt=""></div>
            <div class="catalogAside">
                
                <div id="editDiv" class="edit-div"
                    :contenteditable="canEdit"
                    v-html="formSend_content"
                    @keyup="changeData($event)">
                </div>

            </div>
            <div class="limtNum"><i>{{contentCount}}</i><span>/{{maxlength}}</span></div>
        </div>
    </div>
    
</template>


<script>
import CropperUpload from '../components/cropperUpload/index.vue'
export default {
  name: 'ComponentsEditDiv',
  props: {
    value: {
        type: String,
        default: ''
    },
    canEdit: {
        type: Boolean,
        default: true
    },
    formSend_id: {
        type: Number,
        default: 0
    },
    formSend_path: {
        type: String,
        default: ''
    },
    formSend_content: {
        type: String,
        default: ''
    },
    maxlength: {
        type: Number,
        default: 600
    }
  },
  data(){
      return {
          contentCount: 0,
          innerText: this.value
        //   innerText: "<img src='http://mp.dev.hubpd.com/media/upload/image/2017/09/28/1506590328630019833.jpg />"
      }
  },
  components: {
		'cropper-upload': CropperUpload
  },
//   watch: {
//       'value'(){
//           console.log('this.value: '+this.value)
//           // if (!this.isLocked || !this.innerText) {
//               this.innerText = this.value;
//           // }
//       }
//   },
  methods: {
    changeData: function(event) {
        this.innerText = event.srcElement.innerHTML
        this.getLiveConLimit()
        // console.log('this.innerText: '+this.innerText)
        if(this.contentCount<=this.maxlength){
            this.$emit('oninput', this.innerText);
        }
    },
    insertIcon(){
        let _dom = document.getElementById("editDiv")
        let _img = '<img width=50 src="http://mp.dev.hubpd.com/media/upload/image/2017/09/28/1506590328630019833.jpg" />'
        this.insertAfterText(_dom,_img)
    },
    getLiveConLimit () {
        let _domHtml = document.getElementById("editDiv").innerHTML

        let count=this.gblen(_domHtml,this.maxlength,'live');
        this.contentCount=Math.ceil(count)>this.maxlength ? this.maxlength:Math.ceil(count);
    },

    onSuccessSend (response, fileid, ki) {
        this.formSend_path = response.path
        this.$emit('onimage', response.path);
    },
    // 头像上传失败
    onError (error, fileid, ki) {
        this.$Notice.error({
            title: '错误',
            desc: error.message || '图片上传错误！'
        })
    },
    onput(){
        console.log('onput')
        this.formSend_path = ''
        document.getElementById("editDiv").innerHTML=''

        this.$emit('onok', false);
    },
		
    /**
    * 在光标后插入文本
    * 参数：
    *  textDom [JavaScript DOM String] 当前对象
    *  value [String] 要插入的文本
    */
    insertAfterText(textDom, value) {

        var selectRange;
        if (document.selection) {
            // IE Support
            textDom.focus();
            selectRange = document.selection.createRange();
            selectRange.text = value;
            textDom.focus();
        }else if (textDom.selectionStart || textDom.selectionStart == '0') {
            // Firefox support
            var startPos = textDom.selectionStart;
            var endPos = textDom.selectionEnd;
            var scrollTop = textDom.scrollTop;
            textDom.value = textDom.value.substring(0, startPos) + value + textDom.value.substring(endPos, textDom.value.length);
            textDom.focus();
            textDom.selectionStart = startPos + value.length;
            textDom.selectionEnd = startPos + value.length;
            textDom.scrollTop = scrollTop;
        }
        else {
            textDom.innerHTML += value;
            textDom.focus();
        }
    },
    gblen: function (str,max,name) {
        var len = 0;
        if (name == 'title') {
        this.titleMaxCount=22;
        }else if (name == 'introduction') {
        this.introductionMaxCount = 500;
        }else if (name == 'live') {
        this.liveMaxCount = this.maxlength;
        }else{
        this.labelMaxCount = 5;
        }

        str = str.replace(new RegExp(/<\s?img[^>]*>/, 'gi'), '');
        
        for (let i=0; i<str.length; i++) {
        if (str.charCodeAt(i)>127 || str.charCodeAt(i)==94) {
            len ++;
        } else {
            if (name == "title") {
            this.titleMaxCount+=0.5;
            if(this.titleMaxCount > max){
                this.titleMaxCount=max;
            }
            } else if (name == 'introduction') {
            this.introductionMaxCount+=0.5;
            if(this.introductionMaxCount > max){
                this.introductionMaxCount=max;
            }
            } else if (name == 'live') {
            this.liveMaxCount+=0.5;
            if(this.liveMaxCount > max){
                this.liveMaxCount=max;
            }
            }else{
            this.labelMaxCount += 0.5;
            if (this.labelMaxCount > max) {
                this.labelMaxCount = max;
            }
            }
            len += 0.5;
        }
        }
        // return str.replace(new RegExp(/rtmp:\/\//, 'g'), '');
        return len
    }



  }
}

</script>
<style lang="less">
.fl{float: left;}
.fr{float: right;}
.edit-div {
    width: 90%;
    height: 90%;
    overflow: auto;
    word-break: break-all;
    outline: none;
    user-select: text;
    white-space: pre-wrap;
    background:white;
    padding: 5%;
    &[contenteditable=true]{
        user-modify: read-write-plaintext-only;
        &:empty:before {
            content: attr(placeholder);
            display: block;
            color: #ccc;
        }
    }
}
.comAside .fod-send{
	width:100%;
	height:30px;
	margin:10px auto;
	padding:0 10px;
}
.comAside .fod-send .fl{
	margin-left:10px;
}
.comAside .fod-send .fr Button{
	display:block;
	padding: 4px 10px;
	border:1px solid #E8657D;
	color:#E8657D;
	background-color: #fff;
}
.comAside .catalogAside{
    border:1px solid #dcdcdc;
}
.comAside .limtNum{
	margin-top:10px;
	text-align: right;
}
.comAside .limtNum i{
	color:#8297EF;
    font-style:normal;
}
.comAside .catalogAside .edit-div{
	width:100%;
	height:200px;
	background:white;
}
</style>
