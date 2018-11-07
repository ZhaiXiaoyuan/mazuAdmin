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
                <el-table-column prop="name" label="名称"  align="center"></el-table-column>
                <el-table-column label="logo" align="center" width="60">
                    <template slot-scope="scope">
                        <img :src="basicConfig.coverBasicUrl+scope.row.logo" style="width: 40px;height: 40px;" alt="">
                    </template>
                </el-table-column>
                <el-table-column prop="regionName" label="地区"  align="center"></el-table-column>
                <el-table-column label="操作"  align="center">
                    <template slot-scope="scope">
                        <span @click="openFormModal(scope.row)" class="cm-btn cm-link-btn">编辑</span>
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


        <el-dialog :title="curEntry?'编辑成员':'新增成员'" class="edit-dialog" :visible.sync="formModalFlag" v-if="formModalFlag" width="80%">
            <div class="dialog-body">
                <div>
                    <el-form ref="form" :model="form" label-width="100px">
                        <div style="width: 60%;">
                            <el-form-item label="名称：" prop="headline">
                                <el-input v-model="form.name" placeholder="请输入名称"></el-input>
                            </el-form-item>
                            <el-form-item label="地区：">
                                <el-select v-model="form.regionCode" filterable>
                                    <el-option
                                        v-for="item in regionList"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="logo：" prop="logo">
                                <div class="cm-pic-uploader" :class="{'anew':form.logo}">
                                    <div class="wrapper">
                                        <img :src="curEntry?basicConfig.coverBasicUrl+form.logo:form.logo" alt="">
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
                    regionCode:null,
                    regionName:null,
                },
                editor:null,

                regionList:[
                    {
                        label:'新加坡',
                        value:'0001',
                    },
                    {
                        label:'中国',
                        value:'0002',
                    },
                   /* {
                        label:'中国台湾',
                        value:'0003',
                    },*/
                    {
                        label:'马来西亚',
                        value:'0004',
                    },
                    {
                        label:'印度尼西亚',
                        value:'0005',
                    },
                ],
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
                    regionCode:'',
                    pageIndex:this.pager.pageIndex,
                    pageSize:this.pager.pageSize,
                }
                this.pager.loading=true;
                Vue.api.getMemberList(params).then((resp)=>{
                    if(resp.respCode=='2000'){
                        let data=JSON.parse(resp.respMsg);
                        console.log('data:',data);
                        let list=data.memberOrganizationList;
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
                setTimeout(()=>{
                    let E = window.wangEditor;
                    this.editor = new E('#editor');
                    this.editor.customConfig.colors =Vue.tools.basicConfig.colors;
                    this.editor.customConfig.uploadImgShowBase64 = true   // 使用 base64 保存图片
                    this.editor.create();
                    this.editor.txt.clear();
                    /* editor.txt.html('<p>用 JS 设置的内容</p>')*/
                },500);
            },
            closeFormModal:function () {
                this.formModalFlag=false;
                this.$refs['form'].resetFields();
            },
            save:function () {
                if(!this.form.name){
                    Vue.operationFeedback({type:'warn',text:'请输入名称'});
                    return;
                }
                if(!this.form.regionCode){
                    Vue.operationFeedback({type:'warn',text:'请选择地区'});
                    return;
                }else{
                    this.form.regionName=this.regionList.find((item,i)=>{
                        return item.value==this.form.regionCode;
                    }).label;
                }
                console.log('form:',this.form);
                if(!this.form.logo){
                    Vue.operationFeedback({type:'warn',text:'请上传logo'});
                    return;
                }
                this.form.content=this.editor.txt.html();
                this.form.content=this.form.content=='<p><br></p>'?'':this.form.content;
            /*    if(!this.form.content){
                    Vue.operationFeedback({type:'warn',text:'请输入介绍'});
                    return;
                }*/
                let fb=Vue.operationFeedback({text:'保存中...'});
                let params={
                    adminId:this.account.id,
                    name:this.form.name,
                    regionCode:this.form.regionCode,
                    regionName:this.form.regionName,
                    content:this.form.content,
                    coverPicFile:this.form.file,
                }
                if(this.curEntry){
                    params.id=this.curEntry.id;
                    Vue.api.updateMember(Vue.tools.toFormData(params)).then((resp)=>{
                        if(resp.respCode=='2000'){
                            this.getList(this.pager.pageIndex);
                            fb.setOptions({type:'complete',text:'保存成功'});
                            this.closeFormModal();
                        }else{
                            fb.setOptions({type:'warn',text:'保存失败，'+resp.respMsg});
                        }
                    });
                }else{
                    Vue.api.addMember(Vue.tools.toFormData(params)).then((resp)=>{
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
                Vue.api.removeMember({id:this.entryList[index].id}).then((resp)=>{
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
                            this.form.logo=data.base64;
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
