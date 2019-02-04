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

      let basicUrl=Vue.appConfig.domain+'/mazu-webConsole/';

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
        //动态上下架
        updateAssociationNewsState:function (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'associationNews/updateAssociationNewsState',
                params: params
            });
        },
        //删除协会动态
        removeAssociationNews:function (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'associationNews/removeAssociationNews',
                params: params
            });
        },
        //移除banner
        removeBanner:function (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'banner/removeBanner',
                params: params
            });
        },
        //上移下移banner
        swapBannerSort:function (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'banner/swapBannerSort',
                params: params
            });
        },
        //顶置banner
        stickBanner:function (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'banner/stickBanner',
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
        //根据id获取成员单位详情
        getMemberDetail:function (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'associationNews/getMemberOrganizationInfo',
                params: params
            });
        },
        //更改管理员账号信息
        updateAdmin:function (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'admin/updateAdmin',
                params: params
            });
        },
        //更改密码
        updateAdminPassword:function (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'admin/updateAdminPassword',
                params: params
            });
        },
        //获取课程视频的分页列表
        getCourseVideoList:function (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'courseVideo/getCourseVideoList',
                params: params
            });
        },
        //提交课程视频
        addCourseVideo:function (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'courseVideo/addCourseVideo',
                params: params
            });
        },
        //删除课程视频
        removeCourseVideo:function (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'courseVideo/removeCourseVideo',
                params: params
            });
        },
        //获取课程视频详情
        getCourseVideoInfo:function (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'courseVideo/getCourseVideoInfo',
                params: params
            });
        },
        //课程上下架
        updateCourseVideoState:function (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'courseVideo/updateCourseVideoState',
                params: params
            });
        },
        //课程上下移
        swapCourseVideoSort:function (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'courseVideo/swapCourseVideoSort',
                params: params
            });
        },
        //课程顶置
        stickCourseVideo:function (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'courseVideo/stickCourseVideo',
                params: params
            });
        },
        //获取相册的分页
        getPhotoAlbumList:function (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'associationNews/getPhotoAlbumList',
                params: params
            });
        },
        //新建相册
        addPhotoAlbum:function (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'associationNews/addPhotoAlbum',
                params: params
            });
        },
        //移除相册
        removePhotoAlbum:function (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'associationNews/removePhotoAlbum',
                params: params
            });
        },
        //获取单个相册的信息
        getPhotoAlbumInfo:function (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'associationNews/getPhotoAlbumInfo',
                params: params
            });
        },
        //上传照片
        insertPhotoIntoAlbum:function (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'associationNews/insertPhotoIntoAlbum',
                params: params
            });
        },
        //移除照片
        removePhotoFromAlbum:function (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'associationNews/removePhotoFromAlbum',
                params: params
            });
        },
        //上传富文本图片
        uploadPic:function (params) {
            return Vue.http.ajax({
                method: 'post',
                url: basicUrl+'associationNews/addContentPicture',
                params: params
            });
        },
    }
  },

}
