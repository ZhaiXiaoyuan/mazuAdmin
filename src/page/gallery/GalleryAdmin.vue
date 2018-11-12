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
                   <!-- <el-button type="primary" icon="el-icon-plus" @click="openFormModal()">
                        新增
                    </el-button>-->
              <!--      <el-button type="primary" icon="el-icon-upload2">
                        批量上架
                    </el-button>
                    <el-button type="primary" icon="el-icon-download">
                        批量下架
                    </el-button>-->
                </el-col>
            </el-row>
            <el-table :data="entryList" border style="width: 50%;" ref="multipleTable" v-loading="pager.loading">
                <el-table-column label="序号" align="center" width="50">
                    <template slot-scope="scope">
                        {{scope.$index+1}}
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="相册名称"  align="center"></el-table-column>
             <!--   <el-table-column prop="imageList.length" label="图片数量"  align="center"></el-table-column>-->
                <el-table-column label="操作"  align="center">
                    <template slot-scope="scope">
                        <span @click="showDetail(scope.row)" class="cm-btn cm-link-btn">详情</span>
                     <!--   <span @click="remove(scope.$index)" class="cm-btn cm-link-btn">删除</span>-->
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


        <el-dialog :title="curEntry?'编辑相册':'新增相册'" class="edit-dialog" :visible.sync="formModalFlag" v-if="formModalFlag" width="400px">
            <div class="dialog-body">
                <div>
                    <el-form ref="form" :model="form" label-width="100px">
                        <el-form-item label="相册名称：" prop="name">
                            <el-input v-model="form.name" placeholder="请输入相册名称"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeFormModal()">取 消</el-button>
                <el-button type="primary" @click="save()">提交</el-button>
            </div>
        </el-dialog>

        <el-dialog :title="curEntry?curEntry.name:'相册详情'" class="gallery-dialog" :visible.sync="detailModalFlag" v-if="detailModalFlag" width="60%" :close-on-click-modal="false">
            <div class="dialog-body">
                <div class="handle-btn" style="text-align: center;">
                    <el-button type="primary" class="upload-gallery-btn" icon="el-icon-upload2">
                        上传图片
                        <input  type="file" id="file-input" accept="image/*" @change="selectFile()">
                    </el-button>
                </div>
                <div class="view-win">
                    <ul class="img-list">
                        <li v-for="(entry,index) in imgList" :key="index">
                            <img :src="entry.isNew?entry.filePath:basicConfig.coverBasicUrl+entry.filePath" alt="">
                            <span class="del-btn el-icon-error" @click="delPic(index)"></span>
                        </li>
                    </ul>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="detailModalFlag=false">关闭</el-button>
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

    .gallery-dialog{

    }
    .gallery-dialog .view-win{
        max-height: 400px;
        overflow: auto;
    }
    .img-list{
        list-style: none;
    }
    .img-list li{
        position: relative;
        margin: 10px;
        display: inline-block;
        width: 150px;
        height: 150px;
        border: 1px solid #eee;
    }
    .img-list li img{
        width: 100%;
        height: 100%;
    }
    .img-list li .del-btn{
        position: absolute;
        top:5px;
        right: 5px;
        font-size: 24px;
        color: #F56C6C;
        cursor: pointer;

    }
    .upload-gallery-btn{
        position: relative;
    }
    .upload-gallery-btn input{
        position: absolute;
        top:0px;
        left: 0px;
        opacity: 0;
        width: 100%;
        height: 100%;
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
                    name:null,
                },

                detailModalFlag:false,
                imgList:[],
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
                Vue.api.getPhotoAlbumList(params).then((resp)=>{
                    if(resp.respCode=='2000'){
                        let data=JSON.parse(resp.respMsg);
                        let list=data.photoAlbumList;
                        list.forEach((item,i)=>{
                            item.imageList=JSON.parse(item.imageList)
                        })
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
                    this.form={...this.curEntry}
                }
                this.formModalFlag=true;
            },
            closeFormModal:function () {
                this.formModalFlag=false;
                this.form={
                    cover:null,
                };
                this.$refs['form'].resetFields();
            },
            save:function () {
                if(!this.form.name){
                    Vue.operationFeedback({type:'warn',text:'请输入相册名称'});
                    return;
                }
                let fb=Vue.operationFeedback({text:'保存中...'});
                let params={
                    name:this.form.name,
                }
                if(this.curEntry){

                }else{
                    Vue.api.addPhotoAlbum(Vue.tools.toFormData(params)).then((resp)=>{
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
                Vue.api.removePhotoAlbum({id:this.entryList[index].id}).then((resp)=>{
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
                let fb=Vue.operationFeedback({text:'上传中...',mask:true});
                Vue.tools.fileToBlob(file,(data)=>{
                    let params={
                        id:this.curEntry.id,
                        coverPicFile:file,
                    }
                    Vue.api.insertPhotoIntoAlbum(Vue.tools.toFormData(params)).then((resp)=>{
                        if(resp.respCode=='2000'){
                            this.getImgList();
                            fb.setOptions({type:'complete',text:'上传成功'});
                         /*   this.getList(this.pager.pageIndex);*/
                        }else{
                            fb.setOptions({type:'warn',text:'上传失败，'+resp.respMsg});
                        }
                    });
                });
            },
            showDetail:function (entry) {
                this.curEntry=entry;
                this.detailModalFlag=true;
                this.getImgList();
            },
            getImgList:function () {
                this.imgList=[];
                Vue.api.getPhotoAlbumInfo({name:this.curEntry.name}).then((resp)=>{
                    if(resp.respCode=='2000'){
                        let detail=JSON.parse(resp.respMsg);
                        let list=JSON.parse(detail.imageList);
                        list.forEach((item,i)=>{
                            this.imgList.push({
                                name:item,
                                filePath:item,
                                isNew:false
                            })
                        })
                    }else{

                    }
                });
            },
            delPic:function (index) {
                let item=this.imgList[index];
                let fb=Vue.operationFeedback({text:'删除中...',delayForDelete:1000});
                Vue.api.removePhotoFromAlbum({id:this.curEntry.id,picName:item.name}).then((resp)=>{
                    if(resp.respCode=='2000'){
                        this.imgList.splice(index,1);
                        fb.setOptions({type:'complete',text:'删除成功'});
                    }else{
                        fb.setOptions({type:'warn',text:'删除失败，'+resp.respMsg});
                    }
                });
            },
            closDetailModal:function () {
                this.formModalFlag=false;
                this.form={
                    cover:null,
                };
                this.$refs['form'].resetFields();
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
