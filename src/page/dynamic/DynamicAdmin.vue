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
                <el-table-column label="类型" align="center" width="60">
                    <template slot-scope="scope">
                       {{scope.row.newsType|newsType}}
                    </template>
                </el-table-column>
                <el-table-column label="封面" align="center" width="60">
                    <template slot-scope="scope">
                        <img :src="basicConfig.coverBasicUrl+scope.row.cover" style="width: 40px;height: 40px;" alt="">
                    </template>
                </el-table-column>
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        {{scope.row.state|targetStatus}}
                    </template>
                </el-table-column>
                <el-table-column label="发布时间" align="center">
                    <template slot-scope="scope">
                        {{scope.row.submitTime|formatDate('yyyy-MM-dd hh:mm')}}
                    </template>
                </el-table-column>
                <el-table-column label="操作"  align="center">
                    <template slot-scope="scope">
                        <span @click="openFormModal(scope.row)" class="cm-btn cm-link-btn">编辑</span>
                        <span @click="setStatus(scope.$index,'published')" v-if="scope.row.state=='removed'" class="cm-btn cm-link-btn">发布</span>
                        <span @click="setStatus(scope.$index,'removed')"  v-if="scope.row.state=='published'"  class="cm-btn cm-link-btn">下架</span>
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


        <el-dialog :title="curEntry?'编辑动态':'新增动态'" class="edit-dialog" :visible.sync="formModalFlag" v-if="formModalFlag" width="80%"  :close-on-click-modal="false">
            <div class="dialog-body">
                <div>
                    <el-form ref="form" :model="form" label-width="100px">
                        <div style="width: 60%;">
                            <el-form-item label="标题：" prop="headline">
                                <el-input v-model="form.headline" placeholder="请输入标题"></el-input>
                            </el-form-item>
                            <el-form-item label="类型：">
                                <el-select v-model="form.newsType" placeholder="请选择类型">
                                    <el-option label="协会" value="associationNews"></el-option>
                                    <el-option label="天后宫" value="goddessPalace"></el-option>
                                    <el-option label="妈祖世界" value="mazuWorld"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="简介：" prop="summary">
                                <el-input type="textarea" rows="5" v-model="form.summary" placeholder="请输入简介"></el-input>
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
                        <el-form-item label="内容：" prop="reason">
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
                    newsType:'associationNews',//associationNews、goddessPalace、mazuWorld
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
                    state:'',//removed、published
                }
                this.pager.loading=true;
                Vue.api.getNewsList(params).then((resp)=>{
                    if(resp.respCode=='2000'){
                        let data=JSON.parse(resp.respMsg);
                        let list=data.associationNewsList;
                        this.entryList=list;
                        this.pager.total=data.count;
                    }
                    let timeout=setTimeout(()=>{
                        this.pager.loading=false;
                        clearTimeout(timeout);
                    },500)
                });
            },
            getNewsDetail:function (entry) {
                Vue.api.getNewsDetail({id:entry.id}).then((resp)=>{
                    if(resp.respCode=='2000'){
                        let detail=JSON.parse(resp.respMsg);
                        this.editor.txt.html(detail.content)
                    }else{

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
                    this.editor.customConfig.uploadImgMaxSize = 5* 1024 * 1024;
                    this.editor.customConfig.uploadImgMaxLength = 1;
                    this.editor.customConfig.uploadImgTimeout = 3000;
                    //this.editor.customConfig.uploadImgShowBase64 = true   // 使用 base64 保存图片
                    this.editor.customConfig.uploadImgServer = 'http://api.globalmazu.org:8801/mazu-webConsole/associationNews/addContentPicture';
                    this.editor.customConfig.uploadFileName = 'coverPicFile';
                    let fb=null;
                    this.editor.customConfig.uploadImgHooks = {
                        before: function (xhr, editor, files) {
                            // 图片上传之前触发
                            // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，files 是选择的图片文件

                            fb=Vue.operationFeedback({text:'上传中...',delayForDelete:1500});

                            // 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
                            // return {
                            //     prevent: true,
                            //     msg: '放弃上传'
                            // }
                        },
                        success: function (xhr, editor, result) {
                            // 图片上传并返回结果，图片插入成功之后触发
                            // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
                        },
                        fail: function (xhr, editor, result) {
                            // 图片上传并返回结果，但图片插入错误时触发
                            // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
                            console.error('图片上传失败:',result);
                            fb.setOptions({type:'warn',text:'图片上传失败'});
                        },
                        error: function (xhr, editor) {
                            // 图片上传出错时触发
                            // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
                            console.error('图片上传失败');
                            fb.setOptions({type:'warn',text:'图片上传失败'});
                        },
                        timeout: function (xhr, editor) {
                            // 图片上传超时时触发
                            // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
                            console.error('图片上传超时');
                            fb.setOptions({type:'warn',text:'图片上传失败'});
                        },

                        // 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
                        // （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）
                        customInsert: function (insertImg, result, editor) {
                            if(result.respCode=='2000'){
                                insertImg(Vue.basicConfig.coverBasicUrl+result.respMsg);
                                fb.setOptions({type:'complete',text:'上传成功',});
                            }else{
                                console.error('图片上传失败:',result);
                                fb.setOptions({type:'warn',text:'图片上传失败'});
                            }
                        }
                    }
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
                    newsType:'associationNews',//associationNews、goddessPalace、mazuWorld
                };
            },
            save:function () {
                if(!this.form.headline){
                    Vue.operationFeedback({type:'warn',text:'请输入标题'});
                    return;
                }
                if(!this.form.newsType){
                    Vue.operationFeedback({type:'warn',text:'请选择类型'});
                    return;
                }
                if(!this.form.summary){
                    Vue.operationFeedback({type:'warn',text:'请选择简介'});
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
                let fb=Vue.operationFeedback({text:'保存中...',mask:true});
                let params={
                    adminId:this.account.id,
                    headline:this.form.headline,
                    newsType:this.form.newsType,
                    summary:this.form.summary,
                    content:this.form.content,
                    coverPicFile:this.form.file&&this.form.file!='undefined'?this.form.file:null,
                    state:'published',//
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
                    Vue.api.addNews(Vue.tools.toFormData(params)).then((resp)=>{
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
            setStatus:function (index,type) {
                let entry=this.entryList[index];
                let params={
                    ...entry,
                    state:type
                }
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
                Vue.api.updateAssociationNewsState({id:entry.id,state:type}).then((resp)=>{
                    if(resp.respCode=='2000'){
                        fb.setOptions({type:'complete',text:tips+'成功'});
                        entry.state=type;
                    }else{
                        fb.setOptions({type:'warn',text:tips+'失败，'+resp.respMsg});
                    }
                });
            },
            remove:function (index) {
                let fb=Vue.operationFeedback({text:'删除中...'});
                Vue.api.removeAssociationNews({id:this.entryList[index].id}).then((resp)=>{
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
        },
        mounted () {
            //
            this.account=this.getAccountInfo();
            console.log('this.account:',this.account);
            //
            this.getList();
           /* this.openFormModal();*/


        },
    }
</script>
