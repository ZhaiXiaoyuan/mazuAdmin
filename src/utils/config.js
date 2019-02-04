
/*基础配置*/
export default {
    install: function (Vue, options) {
        let isDev=false&&process.env.NODE_ENV=='development';
        Vue.appConfig={
            domain:isDev?'http://zyu-server.wicp.net:12412':'http://api.globalmazu.org:8801',
            fileDomain:isDev?'http://zyu-server.wicp.net:13081/':'http://www.globalmazu.org/',
        }
    },
}
