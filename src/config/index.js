let env = process.env.NODE_ENV
const host = env === 'development' ? 'http://mp.dev.hubpd.com/' : env === 'production' ? 'http://mp.dev.hubpd.com/' : 'https://debug.url.com'
const root = env === 'development' ? '' : ''
let config = {
    env: env,
    host: host,
    root: root
}
export default config
