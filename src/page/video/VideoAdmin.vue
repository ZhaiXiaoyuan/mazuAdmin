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
                <el-col :span="24" style="text-align: right;">
                    <el-button type="primary" icon="el-icon-plus" @click="openFormModal()">
                        新增
                    </el-button>
                </el-col>
            </el-row>
            <el-table :data="entryList" border style="width: 100%;" ref="multipleTable" v-loading="pager.loading">
                <el-table-column label="序号" align="center" width="50">
                    <template slot-scope="scope">
                        {{scope.$index+1}}
                    </template>
                </el-table-column>
                <el-table-column prop="headline" label="标题"  align="center"></el-table-column>
                <el-table-column label="简介" align="center" width="200">
                    <template slot-scope="scope">
                        {{scope.row.summary|ellipsis(20)}}
                    </template>
                </el-table-column>
                <el-table-column label="封面" align="center" width="60">
                    <template slot-scope="scope">
                        <img :src="basicConfig.coverBasicUrl+scope.row.cover" style="width: 40px;height: 40px;" alt="">
                    </template>
                </el-table-column>
                <el-table-column label="状态" align="center" width="60">
                    <template slot-scope="scope">
                        {{scope.row.state|targetStatus}}
                    </template>
                </el-table-column>
                <el-table-column label="发布时间" align="center" width="120">
                    <template slot-scope="scope">
                        {{scope.row.submitTime|formatDate('yyyy-MM-dd hh:mm')}}
                    </template>
                </el-table-column>
                <el-table-column label="操作"  align="center">
                    <template slot-scope="scope">
                        <span @click="swapSort(scope.$index,'up')" class="cm-btn cm-link-btn">上移</span>
                        <span @click="swapSort(scope.$index,'down')" class="cm-btn cm-link-btn">下移</span>
                        <span @click="stick(scope.$index)" class="cm-btn cm-link-btn">置顶</span>
                        <span @click="openFormModal(scope.row)" class="cm-btn cm-link-btn">编辑</span>
                        <span @click="setStatus(scope.$index,'published')" v-if="scope.row.state=='removed'" class="cm-btn cm-link-btn">发布</span>
                        <span @click="setStatus(scope.$index,'removed')"  v-if="scope.row.state=='published'"  class="cm-btn cm-link-btn">下架</span>
                        <span @click="remove(scope.$index)"  class="cm-btn cm-link-btn">删除</span>
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


        <el-dialog :title="curEntry?'编辑视频':'新增视频'" class="edit-dialog" :visible.sync="formModalFlag" v-if="formModalFlag" width="80%"  :close-on-click-modal="false">
            <div class="dialog-body">
                <div>
                    <el-form ref="form" :model="form" label-width="100px">
                        <div style="width: 60%;">
                            <el-form-item label="标题：" prop="headline">
                                <el-input v-model="form.headline" placeholder="请输入标题"></el-input>
                            </el-form-item>
                            <el-form-item label="讲师：" prop="lecturer">
                                <el-input v-model="form.lecturer" placeholder="请输入讲师"></el-input>
                            </el-form-item>
                            <el-form-item label="简介：" prop="summary">
                                <el-input type="textarea" rows="5" v-model="form.summary" placeholder="请输入简介"></el-input>
                            </el-form-item>
                            <el-form-item label="视频代码：" prop="video">
                                <el-input type="textarea" rows="5" v-model="form.video" placeholder="请输入视频代码"></el-input>
                            </el-form-item>
                            <el-form-item label="上传图片：" prop="cover">
                                <div class="cm-pic-uploader" :class="{'anew':form.cover}">
                                    <div class="wrapper">
                                        <img :src="form.file?form.cover:basicConfig.coverBasicUrl+form.cover" alt="">
                                        <div class="btn-wrap">
                                            <input  type="file" id="file-input" accept="image/*" @change="selectFile()">
                                            <div class="cm-btn upload-btn"><i class="icon el-icon-plus"></i></div>
                                            <span class="cm-btn cm-link-btn text-upload-btn">重新上传</span>
                                        </div>
                                    </div>
                                </div>
                            </el-form-item>
                        </div>
                        <el-form-item label="介绍：" prop="reason">
                            <div id="editor" style="max-width: 800px;"></div>
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
                editor:null,
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
                    newsType:'',//associationNews、goddessPalace、mazuWorld
                    //临时测试
                    state:'',//removed、published
                }
                this.pager.loading=true;
                Vue.api.getCourseVideoList(params).then((resp)=>{
                    if(resp.respCode=='2000'){
                    let data=JSON.parse(resp.respMsg);
                    let list=data.courseVideoList;
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
            getNewsDetail:function (entry) {
                Vue.api.getCourseVideoInfo({id:entry.id}).then((resp)=>{
                    if(resp.respCode=='2000'){
                    let detail=JSON.parse(resp.respMsg);
                    this.editor.txt.html(detail.content)
                }else{

                }
            });
            },
            setStatus:function (index,type) {
                let entry=this.entryList[index];
                let tips='';
                switch (type){
                    case 'published':
                        tips='上架';
                        break;
                    case 'removed':
                        tips='下架';
                        break
                }
                let fb=Vue.operationFeedback({text:tips+'中...'});
                Vue.api.updateCourseVideoState({id:entry.id,state:type}).then((resp)=>{
                    if(resp.respCode=='2000'){
                        fb.setOptions({type:'complete',text:tips+'成功'});
                        entry.state=type;
                    }else{
                        fb.setOptions({type:'warn',text:tips+'失败，'+resp.respMsg});
                    }
                });
            },
            openFormModal:function (entry) {
                this.resetForm();
                //
                this.curEntry=entry;
                console.log('this.curEntry:',this.curEntry);
                if(this.curEntry){
                    this.form={...this.curEntry}
                }
                this.formModalFlag=true;
                setTimeout(()=>{
                    let E = window.wangEditor;
                this.editor = new E('#editor');
                this.editor.customConfig.colors =Vue.tools.basicConfig.colors;
                this.editor.customConfig.uploadImgShowBase64 = true   // 使用 base64 保存图片
                this.editor.create();
                this.editor.txt.clear();
                if(this.curEntry){
                    this.getNewsDetail(entry);
                }
            },500);
            },
            closeFormModal:function () {
                this.formModalFlag=false;
            },
            resetForm:function () {
                this.form={
                    cover:null,
                };
            },
            save:function () {
                if(!this.form.headline){
                    Vue.operationFeedback({type:'warn',text:'请输入标题'});
                    return;
                }
                if(!this.form.lecturer){
                    Vue.operationFeedback({type:'warn',text:'请输入讲师'});
                    return;
                }
                if(!this.form.summary){
                    Vue.operationFeedback({type:'warn',text:'请选择简介'});
                    return;
                }
                if(!this.form.video){
                    Vue.operationFeedback({type:'warn',text:'请输入视频代码'});
                    return;
                }
                if(!this.form.cover){
                    Vue.operationFeedback({type:'warn',text:'请上传封面'});
                    return;
                }
                this.form.content=this.editor.txt.html();
                if(!this.form.content){
                    Vue.operationFeedback({type:'warn',text:'请输入内容'});
                    return;
                }
                let fb=Vue.operationFeedback({text:'保存中...'});
                let params={
                    adminId:this.account.id,
                    headline:this.form.headline,
                    summary:this.form.summary,
                    video:this.form.video,
                    lecturer:this.form.lecturer,
                    coverPicFile:this.form.file&&this.form.file!='undefined'?this.form.file:null,
                    state:'published',//
                    content:this.form.content,
                }
                if(this.curEntry){
                    params.id=this.curEntry.id;
                    params.state=this.curEntry.state;
                    Vue.api.updateNews(Vue.tools.toFormData(params)).then((resp)=>{
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
                    Vue.api.addCourseVideo(Vue.tools.toFormData(params)).then((resp)=>{
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
            selectFile:function () {
                let file=document.getElementById('file-input').files[0];
                /* this.form.file=file;*/
                Vue.tools.fileToBlob(file,(data)=>{
                    this.cropModal({
                        img:data,
                        fixedNumber:[180,124],
                        ok:(data)=>{
                        this.form.cover=data.base64;
                        this.form.file=data.blob;
                    }
                });
                });
            },
            remove:function (index) {
                let fb=Vue.operationFeedback({text:'删除中...'});
                Vue.api.removeCourseVideo({id:this.entryList[index].id}).then((resp)=>{
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
            swapSort:function (index,type) {
                let id1=this.entryList[index].id;
                let id2=null;
                let index2=null;
                if(type=='up'&&index>0){
                    index2=index-1;
                }else if(type=='down'&&index<this.entryList.length-1){
                    index2=index+1;
                }else{
                    return;
                }
                id2=this.entryList[index2].id;
                let fb=Vue.operationFeedback({text:'操作中...'});
                Vue.api.swapCourseVideoSort({id1:id1,id2:id2,}).then((resp)=>{
                    if(resp.respCode=='2000'){
                        fb.setOptions({type:'complete',text:'操作成功'});
                        this.getList(this.pager.pageIndex);
                    }else{
                        fb.setOptions({type:'warn',text:'操作失败，'+resp.respMsg});
                    }
                });
            },
            stick:function (index) {
                let fb=Vue.operationFeedback({text:'操作中...'});
                Vue.api.stickCourseVideo({id:this.entryList[index].id}).then((resp)=>{
                    if(resp.respCode=='2000'){
                        fb.setOptions({type:'complete',text:'操作成功'});
                        this.getList(this.pager.pageIndex);
                    }else{
                        fb.setOptions({type:'warn',text:'操作失败，'+resp.respMsg});
                    }
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
           /*   this.openFormModal();*/


        },
    }
</script>
