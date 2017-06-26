module.exports = {
  template: {
    from: 'src/template/*/index.vue',
    to: 'template/*',
    ignore: ['.*']
  },
  modules: {
    from: 'src/modules/*/index.vue',
    to: 'modules/*',
    ignore: ['.*']
  },
  pages: {
    from: 'src/modules/*/pages/*/index.vue',
    to: 'modules/*/pages/*',
    ignore: ['.*']
  },
  listeners: {
    from: 'src/listeners/*.js',
    to: 'listeners/*',
    ignore: ['.*']
  },
  listenersVue: {
    from: 'src/listeners/*/index.vue',
    to: 'listeners/*',
    ignore: ['.*']
  },
  listenersFolder: {
    from: 'src/listeners/*/index.js',
    to: 'listeners/*',
    ignore: ['.*']
  },
  configModule: {
    from: 'src/modules/*/config.json',
    to: 'modules/*/config.json',
    type: 'json'
  },
  config: {
    from: 'src/*.json',
    to: '*.json',
    type: 'json'
  }
}
