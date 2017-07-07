export default {
  name: 'ViewSettingsAccount',
  data () {
      return {
          roleType: 1,
          account: '运营人员1',
          studioName: '一秒世界',
          URL: 'yimiaoshijie.hubpd.com',
          imgSrc: '',
          catalog: '一秒世界',
          defaultList: [
            {
                'name': 'a42bdcc1178e62b4694c830f028db5c0',
                'url': 'https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar'
            }
            ],
            imgName: '',
            visible: false,
            uploadList: [],
          formValidateM: {
              name: '',
              tel: ''
          },
          ruleValidateM: {
              name: [
                  { required: true, message: '姓名不能为空', trigger: 'blur' }
              ],
              tel: [
                  { required: true, message: '电话不能为空', trigger: 'blur' },
                  { type: 'string', min: 7, max: 11, pattern: /^[0-9]+$/, message: '电话格式不正确', trigger: 'blur'}
              ]
          },
          formValidate: {
              name: '',
              mail: '',
              tel: ''
          },
          ruleValidate: {
              name: [
                  { required: true, message: '姓名不能为空', trigger: 'blur' }
              ],
              mail: [
                  { required: true, message: '邮箱不能为空', trigger: 'blur' },
                  { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
              ],
              tel: [
                  { required: true, message: '电话不能为空', trigger: 'blur' },
                  { type: 'string', min: 7, max: 11, pattern: /^[0-9]+$/, message: '电话格式不正确', trigger: 'blur'}
              ]
          }
      }
  },
  methods: {
      handleView (name) {
            this.imgName = name;
            this.visible = true;
        },
        handleRemove (file) {
            // 从 upload 实例删除数据
            const fileList = this.$refs.upload.fileList;    
            this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
        },
        handleSuccess (res, file) {
            // 因为上传过程为实例，这里模拟添加 url
            file.url = 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar';
            file.name = '7eb99afb9d5f317c912f08b5212fd69a';
        },
        handleFormatError (file) {
            this.$Notice.warning({
                title: '文件格式不正确',
                desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
            });
        },
        handleMaxSize (file) {
            this.$Notice.warning({
                title: '超出文件大小限制',
                desc: '文件 ' + file.name + ' 太大，不能超过 2M。'
            });
        },
        handleBeforeUpload () {
            const check = this.uploadList.length < 5;
            if (!check) {
                this.$Notice.warning({
                    title: '最多只能上传 5 张图片。'
                });
            }
            return check;
        },
      handleSubmit (name) {
          this.$refs[name].validate((valid) => {
              if (valid) {
                  this.$Message.success('提交成功!');
              } else {
                  this.$Message.error('表单验证失败!');
              }
          })
      },
      handleReset (name) {
          this.$refs[name].resetFields();
      },
      
  },
  created () {},
  mounted () {
      this.uploadList = this.$refs.upload.fileList;
  }
}
