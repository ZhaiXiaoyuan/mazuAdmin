/**
 * Created by Designer on 2017/12/21.
 */
import router from '../router'


export default {
  install: function (Vue, options) {


    Vue.http.options.emulateJSON = true;
    Vue.http.interceptors.push((request, next)  =>{

      next((response) => {
        //对于有作登录状态的接口你，未未登录时跳转到登录页
        if(response.status==401){
         /* router.push({name:''});*/
        }
        return response
      });

    });
    /*自定义ajax函数，自带的不好用*/
    Vue.http.ajax = async function (options) {
      if(options.method.toUpperCase() == 'GET'){
        let res = await Vue.http.get(options.url, {params: options.params});
        if(typeof res.body == 'string'){
          return JSON.parse(res.body);
        }else{
          return res.body;
        }
      }else if(options.method.toUpperCase() == 'POST'){
        let res = await Vue.http.post(options.url, options.params,);
        if(typeof res.body == 'string'){
          return JSON.parse(res.body);
        }else{
          return res.body;
        }
      }
    }

    /**/
    //临时测试
      let basicUrl=false&&process.env.NODE_ENV=='development'?'http://zyu-server.wicp.net:19356/yecai':'http://api.globalmazu.org:8801/mazu-webConsole/';
/*      let basicUrl=false&&process.env.NODE_ENV=='development'?'http://api.yeahcai.com/yecai':'https://api.linqi.tech:34631';*/

      function sessionInfo() {
          return{
              token:'',
              timeStamp:Date.parse(new Date())/1000,
              random:parseInt(Math.random()*1000000),
              signature:''
          }
      }
    Vue.api={
        //管理员登录
        login:function (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'admin/login',
                params: params
            });
        },
        //获取banner的分页列表
        getBannerList:function (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'banner/getBannerList',
                params: params
            });
        },
        //新增banner
        addBanner:function (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'banner/addBanner',
                params: params
            });
        },
        //编辑协会动态
        updateBanner:function (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'banner/updateBanner',
                params: params
            });
        },
        //获取动态的分页列表
        getNewsList:function (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'associationNews/getAssociationNewsList',
                params: params
            });
        },
        //添加动态
        addNews:function (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'associationNews/addAssociationNews',
                params: params
            });
        },
        //根据id获取动态详情
        getNewsDetail:function (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'associationNews/getAssociationNewsInfo',
                params: params
            });
        },
        //编辑动态
        updateNews:function (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'associationNews/updateAssociationNews',
                params: params
            });
        },
        //获取成员单位的分页列表
        getMemberList:function (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'associationNews/getMemberOrganizationList',
                params: params
            });
        },
        //增加成员单位
        addMember:function (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'associationNews/addMemberOrganization',
                params: params
            });
        },
        //删除成员单位
        removeMember:function (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'associationNews/removeMemberOrganization',
                params: params
            });
        },
        //编辑成员单位
        updateMember:function (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'associationNews/updateMemberOrganization',
                params: params
            });
        },
    }
  },

}
