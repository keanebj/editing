
export default {
  name: 'ComponentsUploadAudio',
  data(){
     return {
          uploadAudio:false,
          source:'local',
          linkForm:{
            url:'',
            name:''
          },
          linkFormRule:{
              url: [
                        { required: true, message: 'url地址不能为空', trigger: 'blur' },
                        { type: 'url', message: 'url地址格式不正确', trigger: 'blur'}
                    ],
              name: [
                        { required: true, message: '音频名称不能为空', trigger: 'blur' }
                    ]
          }
         
    }
  },
  props:{
   
  },
  watch:{

  },
  methods: {
      showModal(){
        this.uploadAudio=true;   
      },
      submitLinkAudio (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$Message.success('提交成功!');
                    } else {
                        this.$Message.error('表单验证失败!');
                    }
                })
            },
    submitLinkAudio (name) {
        this.$refs[name].resetFields();
    }                   
  },
  created() {
        
       
  },
  mounted() {
      
    
  },
  destroy(){
     
  }

}