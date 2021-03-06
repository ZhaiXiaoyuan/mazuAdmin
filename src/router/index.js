import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            children:[
                {
                    path: '/customerAdmin',
                    name:'customerAdmin',
                    component: resolve => require(['../page/customer/CustomerAdmin.vue'], resolve)
                },
                {
                    path: '/bannerAdmin',
                    name:'bannerAdmin',
                    component: resolve => require(['../page/banner/BannerAdmin.vue'], resolve)
                },
                {
                    path: '/dynamicAdmin',
                    name:'dynamicAdmin',
                    component: resolve => require(['../page/dynamic/DynamicAdmin.vue'], resolve)
                },
                {
                    path: '/videoAdmin',
                    name:'videoAdmin',
                    component: resolve => require(['../page/video/VideoAdmin.vue'], resolve)
                },
                {
                    path: '/memberAdmin',
                    name:'memberAdmin',
                    component: resolve => require(['../page/member/MemberAdmin.vue'], resolve)
                },
                {
                    path: '/galleryAdmin',
                    name:'galleryAdmin',
                    component: resolve => require(['../page/gallery/GalleryAdmin.vue'], resolve)
                },
                {
                    path: '/setPassword',
                    name:'setPassword',
                    component: resolve => require(['../page/account/SetPassword.vue'], resolve)
                },
            ]
        },
        {
            path: '/login',
            name:'login',
            component: resolve => require(['../page/account/Login.vue'], resolve)
        },
        {
            path: '/adminLogin',
            name:'adminLogin',
            component: resolve => require(['../page/account/Login.vue'], resolve)
        },
        {
            path: '/shopLogin',
            name:'shopLogin',
            component: resolve => require(['../page/account/Login.vue'], resolve)
        },
        {
            path: '/userLogin',
            name:'userLogin',
            component: resolve => require(['../page/account/Login.vue'], resolve)
        },
    ]
})
