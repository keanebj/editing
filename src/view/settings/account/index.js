export default {
  name: 'ViewSettingsAccount',
  data () {
      return {
          account: '运营人员1',
          studioName: '一秒世界',
          URL: 'yimiaoshijie.hubpd.com',
          catalog: '一秒世界',
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
                  { required: true, message: '电话不能为空', trigger: 'blur' }
              ]
          }
      }
  },
  methods: {
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
      }
  },
  created () {},
  mounted () {}
}
