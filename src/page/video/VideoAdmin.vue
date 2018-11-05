<template>
    <div class="table">
        <div class="crumbs">
          <!--  <el-breadcrumb separator="/">
                <el-breadcrumb-item></el-breadcrumb-item>
                <el-breadcrumb-item></el-breadcrumb-item>
            </el-breadcrumb>-->
        </div>
        <div class="container">
            <el-row class="handle-box">
             <!--   <el-col :span="10">
                    <el-input v-model="keyword" placeholder="输入搜索关键字" class="handle-input mr10"></el-input>
                    <el-button type="primary" icon="search" @click="getList()">搜索</el-button>
                </el-col>-->
                <el-col :span="24" style="text-align: right;">
                    <el-button type="primary" icon="el-icon-plus" @click="openFormModal()">
                        新增
                    </el-button>
              <!--      <el-button type="primary" icon="el-icon-upload2">
                        批量上架
                    </el-button>
                    <el-button type="primary" icon="el-icon-download">
                        批量下架
                    </el-button>-->
                </el-col>
            </el-row>
            <el-table :data="entryList" border style="width: 100%;" ref="multipleTable" v-loading="pager.loading">
                <el-table-column label="序号" align="center" width="50">
                    <template slot-scope="scope">
                        {{scope.$index+1}}
                    </template>
                </el-table-column>
                <el-table-column prop="headline" label="标题"  align="center"></el-table-column>
                <el-table-column label="封面" align="center" width="60">
                    <template slot-scope="scope">
                        <img :src="basicConfig.coverBasicUrl+scope.row.cover" style="width: 40px;height: 40px;" alt="">
                    </template>
                </el-table-column>
                <el-table-column prop="url" label="链接"  align="center"></el-table-column>
                <el-table-column label="操作"  align="center">
                    <template slot-scope="scope">
                        <span @click="openFormModal(scope.row)" class="cm-btn cm-link-btn">编辑</span>
                        <span @click="openFormModal(scope.row)" class="cm-btn cm-link-btn">上移</span>
                        <span @click="openFormModal(scope.row)" class="cm-btn cm-link-btn">下移</span>
                        <span @click="openFormModal(scope.row)" class="cm-btn cm-link-btn">置顶</span>
                        <span @click="remove(scope.$index)" class="cm-btn cm-link-btn">删除</span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    @current-change ="getList"
                    layout="prev, pager, next"
                    :page-size="pager.pageSize"
                    :total="pager.total">
                </el-pagination>
            </div>
        </div>


        <el-dialog :title="curEntry?'编辑banner':'新增banner'" class="edit-dialog" :visible.sync="formModalFlag" v-if="formModalFlag" width="60%">
            <div class="dialog-body">
                <div style="width: 60%;">
                    <el-form ref="form" :model="form" label-width="100px">
                        <el-form-item label="标题：" prop="headline">
                            <el-input v-model="form.headline" placeholder="请输入标题"></el-input>
                        </el-form-item>
                        <el-form-item label="链接：" prop="url">
                            <el-input v-model="form.url" placeholder="请输入链接"></el-input>
                        </el-form-item>
                        <el-form-item label="上传图片：" prop="cover">
                            <div class="cm-pic-uploader" :class="{'anew':form.cover}">
                                <div class="wrapper">
                                    <img :src="form.cover" alt="">
                                    <div class="btn-wrap">
                                        <input  type="file" id="file-input" accept="image/*" @change="selectFile()">
                                        <div class="cm-btn upload-btn"><i class="icon el-icon-plus"></i></div>
                                        <span class="cm-btn cm-link-btn text-upload-btn">重新上传</span>
                                    </div>
                                </div>
                            </div>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeFormModal()">取 消</el-button>
                <el-button type="primary" @click="save()">提交</el-button>
            </div>
        </el-dialog>

    </div>
</template>
<style scoped>
    .handle-box{
        margin-bottom: 20px;
    }
    .handle-select{
        width: 120px;
    }
    .handle-input{
        width: 300px;
        display: inline-block;
    }

</style>
<script>
    import Vue from 'vue'

    export default {
        data() {
            return {
                account:{},
                pager:{
                  pageIndex:1,
                  pageSize:20,
                  total:0,
                  loading:false
                },
                keyword:null,
                entryList:[],
                curEntry:null,



                formModalFlag:false,
                form:{
                    cover:null,
                },
            }
        },
        created(){
        },
        computed: {
        },
        methods: {
            getList:function (pageIndex) {
                this.pager.pageIndex=pageIndex?pageIndex:1;
                let params={
                    searchContent:'',
                    pageIndex:this.pager.pageIndex,
                    pageSize:this.pager.pageSize,
                }
                this.pager.loading=true;
                Vue.api.getBannerList(params).then((resp)=>{
                    if(resp.respCode=='2000'){
                        let data=JSON.parse(resp.respMsg);
                        let list=data.bannerList;
                        this.entryList=list;
                        this.pager.total=data.count;
                          console.log('this.entryList:',this.entryList);
                    }
                    let timeout=setTimeout(()=>{
                        this.pager.loading=false;
                        clearTimeout(timeout);
                    },500)
                });
            },
            openFormModal:function (entry) {
                this.curEntry=entry;
                console.log('this.curEntry:',this.curEntry);
                if(this.curEntry){
                    this.form={...this.curEntry.banner}
                }
                this.formModalFlag=true;
            },
            closeFormModal:function () {
                this.formModalFlag=false;
                this.$refs['form'].resetFields();
            },
            save:function () {
                if(!this.form.cover){
                    Vue.operationFeedback({type:'warn',text:'请上传封面'});
                    return;
                }
                if(!this.form.headline){
                    Vue.operationFeedback({type:'warn',text:'请输入标题'});
                    return;
                }
                if(!this.form.url){
                    Vue.operationFeedback({type:'warn',text:'请输入链接'});
                    return;
                }
                let fb=Vue.operationFeedback({text:'保存中...'});
                let params={
                    adminId:this.account.id,
                    headline:this.form.headline,
                    url:this.form.url,
                    coverPicFile:this.form.file,
                }
                if(this.curEntry){
                    params.id=this.curEntry.banner.id;
                    Vue.api.updateBanner(params).then((resp)=>{
                        if(resp.respCode=='2000'){
                            this.getList(this.pager.pageIndex);
                            fb.setOptions({type:'complete',text:'保存成功'});
                            this.closeFormModal();
                        }else{
                            fb.setOptions({type:'warn',text:'保存失败，'+resp.respMsg});
                        }
                    });
                }else{
                    console.log('this.form:',this.form);
                    Vue.api.addBanner(Vue.tools.toFormData(params)).then((resp)=>{
                        if(resp.respCode=='2000'){
                            this.getList();
                            fb.setOptions({type:'complete',text:'保存成功'});
                            this.closeFormModal();
                        }else{
                            fb.setOptions({type:'warn',text:'保存失败，'+resp.respMsg});
                        }
                    });
                }
            },
            remove:function (index) {
                let fb=Vue.operationFeedback({text:'删除中...'});
                Vue.api.remove({operationPlatformHandlerId:this.account.id,id:this.entryList[index].banner.id}).then((resp)=>{
                    if(resp.respCode=='2000'){
                        fb.setOptions({type:'complete',text:'删除成功'});
                        this.entryList.splice(index,1);
                        if(this.entryList.length==0){
                            this.getList();
                        }
                    }else{
                        fb.setOptions({type:'warn',text:'删除失败，'+resp.respMsg});
                    }
                });
            },
            selectFile:function () {
                let file=document.getElementById('file-input').files[0];
                this.form.file=file;
                Vue.tools.fileToBlob(file,(data)=>{
                    this.cropModal({
                        img:data,
                        ok:(data)=>{
                            this.form.cover=data.base64;
                           /* this.form.file=data.blob;*/
                        }
                    });
                });
            },
        },
        mounted () {
            //
            this.account=this.getAccountInfo();
            console.log('this.account:',this.account);
            //
            this.getList();
            //
          /*  this.openFormModal();*/


        },
    }
</script>
