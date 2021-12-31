<template>
    <div class="container">
        <div style="width: 100%;margin-bottom: 10px;">
            <el-button type="primary" plain  @click="openDiaoAdd()"><i class="el-icon-plus"></i><span>添加</span></el-button>
        </div>
<!--        v-loading="loading"-->
        <el-table

                :data="tableData"
                border
                style="width: 100%;">
            <el-table-column
                    type="index"
                    :index-1="indexMethod"
                    align="center"
                    height="10"
                    width="80"
                    label="编号">
            </el-table-column>
            <el-table-column
                    prop="newsTitle"
                    label="新闻标题">
            </el-table-column>
            <el-table-column
                    prop="newsContent"
                    label="新闻内容">
            </el-table-column>
            <el-table-column
                    prop="newsUserid"
                    label="发布人信息">
            </el-table-column>
            <el-table-column
                    prop="newsDate"
                    label="新闻发布时间">
            </el-table-column>
            <el-table-column
                    prop="newsCount"
                    label="新闻阅读次数">
            </el-table-column>

<!--            <el-table-column-->
<!--                    label="操作"-->
<!--                    align="center"-->
<!--                    width="160"-->
<!--                    v-slot="scope">-->
<!--                <el-button type="text" icon="el-icon-edit" @click="openDiaoUpdate(scope.row)">编辑</el-button>-->
<!--                <el-button type="text" icon="el-icon-delete" class="red" @click="delDepart(scope.row)">删除</el-button>-->
<!--            </el-table-column>-->
        </el-table>
        <!-- 添加模态框-->
        <el-dialog :title="'添加数据'" v-model="diaoAddNews" :close-on-click-modal="true" :show-close="false"
                   width="800px">
            <el-tooltip  content="点击灰色区域暂时关闭"  placement="top">
                <el-form  :model="addNewsForm" :rules="rulesNews" ref="addNewsForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="新闻标题" prop="newsTitle">
                        <el-input v-model="addNewsForm.newsTitle"></el-input>
                    </el-form-item>
                    <el-form-item label="新闻内容" prop="newsContent">
                        <el-input v-model="addNewsForm.newsContent"></el-input>
                    </el-form-item>
                    <el-form-item label="新闻发布人" prop="newsUserid">
                        <el-input v-model="addNewsForm.newsUserid"></el-input>
                    </el-form-item>
<!--                    <el-form-item label="发布时间" prop="newsDate">-->
<!--                        <el-input v-model="addNewsForm.newsDate"></el-input>-->
<!--                    </el-form-item>-->
                    <el-form-item class="lll">
                        <el-button type="primary" @click="addNews('addNewsForm')">立即创建</el-button>
                        <el-button @click="resetForm('addNewsForm')">重置</el-button>
                        <el-button type="danger" round style="float: right"
                                   @click="diaoAddNews = false;resetForm('addNewsForm')">关闭</el-button>
                    </el-form-item>
                </el-form>
            </el-tooltip>
        </el-dialog>
    </div>
</template>

<script>
    import axios from 'axios'
    export default {
        name: "news",
        data(){
          return{
              tableData:[],//表格
              //新闻添加模态框
              diaoAddNews:false,
              //添加表单
              addNewsForm:{
                  newsTitle:'',
                  newsContent:'',
                  newsUserid:'',
              },
              //非空
              rulesNews: {
                  newsTitle: [
                      { required: true, message: '新闻标题不能为空', trigger: 'blur' },
                      // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                  ],
                  newsContent: [
                      { required: true, message: '新闻内容不能为空', trigger: 'blur' }
                  ],
                  newsUserid: [
                      { required: true, message: '新闻发布人信息不能为空', trigger: 'blur' }
                  ],
              },
          }
        },
        methods:{
            //添加清空
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            //自定义索引
            indexMethod(index) {
                return index * 1;
            },
            //打开添加模态框
            openDiaoAdd(){
                this.diaoAddNews=true;
            },
            //添加新闻数据
            addNews(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        axios.post('/client/news/saveOrUpdateNews',this.addNewsForm)
                        const loading = this.$loading({
                            lock: true,
                            text: 'Loading',
                            spinner: 'el-icon-loading',
                            background: 'rgba(0, 0, 0, 0.7)'
                        });
                        setTimeout(() => {
                            loading.close();
                            this.diaoAddNews=false;
                            this.selNews();
                        }, 600);
                        setTimeout(()=>{
                            this.$refs[formName].resetFields();
                            this.$message({
                                type: 'success',
                                message: '测试添加成功!',
                            });
                        },700);
                    }else {
                        console.log('提交失败!!');
                        return false;
                    }
                });
            },
            //查询新闻
            selNews(){
                axios.get('/client/news/search').then(resp=>{
                    this.tableData=resp.data.list
                })
            }

        },
        mounted(){
            this.selNews();
        }
    }
</script>

<style scoped>

</style>
