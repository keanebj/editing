exports.path = '/api/notices'
exports.type = 'get'
exports.export = function (req, res) {
  return {
    data: [
        {id:'001',title:'您的企业版已到期111，如需继续使用，请前往升级，平台仍保留您原有的配置。',dateTime:'2017-05-22 09:40',isReaded:false},
        {id:'002',title:'您的企业版已到期222，如需继续使用，请前往升级，平台仍保留您原有的配置。',dateTime:'2017-05-23 09:40',isReaded:false},
        {id:'003',title:'您的企业版已到期333，如需继续使用，请前往升级，平台仍保留您原有的配置。',dateTime:'2017-05-24 09:40',isReaded:true},
        {id:'004',title:'您的企业版已到期444，如需继续使用，请前往升级，平台仍保留您原有的配置。',dateTime:'2017-05-25 09:40',isReaded:true},
        {id:'005',title:'您的企业版已到期555，如需继续使用，请前往升级，平台仍保留您原有的配置。',dateTime:'2017-05-22 09:40',isReaded:false},
        {id:'006',title:'您的企业版已到期666，如需继续使用，请前往升级，平台仍保留您原有的配置。',dateTime:'2017-05-23 09:40',isReaded:false},
        {id:'007',title:'您的企业版已到期777，如需继续使用，请前往升级，平台仍保留您原有的配置。',dateTime:'2017-05-24 09:40',isReaded:true},
        {id:'008',title:'您的企业版已到期888，如需继续使用，请前往升级，平台仍保留您原有的配置。',dateTime:'2017-05-25 09:40',isReaded:true}
    
    ]
  }
}
