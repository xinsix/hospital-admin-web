<template>
    <div>
        <div class="container">
            <div style="width: 100%;margin-bottom: 10px;">
                <el-button type="primary" plain  @click="tjuser()"><i class="el-icon-plus"></i><span>添加</span></el-button>
            </div>
            <el-table
                    v-loading="loading"
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
                        prop="userPhone"
                        label="手机号">
                </el-table-column>
                <el-table-column
                        prop="userPassword"
                        label="密码">
                </el-table-column>
                <el-table-column
                        prop="userDate"
                        label="注册时间">
                </el-table-column>
                <el-table-column
                        prop="userRole"
                        :formatter="judgeAdmin"
                        label="角色">
                </el-table-column>
                <el-table-column
                        label="操作"
                        align="center"
                        width="160"
                        v-slot="scope">
                    <el-button type="text" icon="el-icon-edit" @click="upduser(scope.row)">编辑</el-button>
                    <el-button type="text" icon="el-icon-delete" class="red" @click="deluser(scope.row)">删除</el-button>
                </el-table-column>
            </el-table>
            <!--修改模态框-->
            <el-dialog :title="'修改数据'" v-model="diaUpuser" :close-on-click-modal="false">
                <el-form :model="xgForm"  label-width="100px" class="demo-ruleForm">
                    <!--                    <el-form-item label="编号" prop="id">-->
                    <!--                        <el-input v-model="xgForm.id" readonly></el-input>-->
                    <!--                    </el-form-item>-->
                    <el-form-item label="手机号" prop="userPhone">
                        <el-input v-model="xgForm.userPhone"></el-input>
                    </el-form-item>
<!--                    <el-form-item label="密码" prop="userPassword">-->
<!--                        <el-input v-model="xgForm.userPassword"></el-input>-->
<!--                    </el-form-item>-->
<!--                    <el-form-item label="注册时间" prop="userDate">-->
<!--                        <el-input v-model="xgForm.userDate"></el-input>-->
<!--                    </el-form-item>-->
<!--                    <el-form-item label="角色" prop="userRole">-->
<!--                        <el-input v-model="xgForm.userRole"></el-input>-->
<!--                    </el-form-item>-->
<!--                    <el-form-item label="角色名称">-->
<!--                        <el-select v-model="xgForm.userRole" placeholder="角色名称">-->
<!--                            <el-option v-for="item in index" v-bind:value="item.name">{{item.name}}</el-option>-->
<!--                        </el-select>-->
<!--                    </el-form-item>-->
                    <el-form-item>
                        <el-button type="primary" @click="Okuser('xgForm')">修改</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
            <!-- 添加模态框-->
            <el-dialog :title="'添加数据'" v-model="diaAdduser" :close-on-click-modal="true" :show-close="false"
                       width="750px">
                <el-tooltip  content="点击灰色区域暂时关闭"  placement="top">
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
                        <el-form-item label="电话" prop="userPhone">
                            <el-input v-model="ruleForm.userPhone"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="userPassword">
                            <el-input v-model="ruleForm.userPassword"></el-input>
                        </el-form-item>
<!--                        <el-form-item label="创建时间" prop="userDate">-->
<!--                            <el-input v-model="ruleForm.userDate"></el-input>-->
<!--                        </el-form-item>-->
<!--                        <el-form-item label="角色名称" prop="userRole">-->
<!--                            <el-select v-model="ruleForm.userRole"  placeholder="角色名称">-->
<!--                                <el-option v-for="item in index" v-bind:value="item.name">{{item.name}}</el-option>-->
<!--                            </el-select>-->
<!--                        </el-form-item>-->
                        <el-form-item class="lll">
                            <el-button type="primary" @click="subUser('ruleForm')">立即创建</el-button>
                            <el-button @click="resetForm('ruleForm')">重置</el-button>
                            <el-button type="danger" round style="float: right"
                                       @click="diaAdduser = false;resetForm('ruleForm')">关闭</el-button>
                        </el-form-item>
                    </el-form>
                </el-tooltip>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import axios from "axios"
    export default {
        name: "user",
        data(){
            return{
                index:[
                    {
                        "indexId":1,
                        "name":"管理员",
                    },
                    {
                        "indexId":2,
                        "name":"超级管理员",
                    },
                    {
                        "indexId":3,
                        "name":"用户",
                    },
                ],
                loading:false,//加载样式
                tableData: [],//表格
                diaUpuser: false,//修改模态框
                diaAdduser: false, //添加模态框
                rules: {        //非空验证
                    userPhone: [
                        { required: true, message: '请输入电话', trigger: 'blur' },
                        // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],
                    userPassword: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ],
                    userDate: [
                        { required: true, message: '请输入注册时间', trigger: 'blur' }
                    ],
                    userRole: [
                        { required: true, message: '请输入角色类型', trigger: 'blur' }
                    ]
                },
                xgForm: {       //修改模态框里面的表单
                    userId:'',
                    userPhone: '',
                    userPassword: '',
                    userDate: '',
                    userRole: '',
                },
                ruleForm: {  //添加模态框里面的表单
                    userPhone: '',
                    userPassword: '',
                    userDate: null,
                    userRole: null,
                },
            }
        },
        methods:{
            //自定义索引
            indexMethod(index) {
                return index * 1;
            },

            //判断管理员
            judgeAdmin (row) {
                if(row.userRole==0)
                {
                    return this.userRole='管理员'
                }else if (row.userRole==1) {
                    return this.userRole='超级管理员'
                }else if (row.userRole==2){
                    return this.userRole='用户'
                }
            },

            //添加表单清空
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },

            //打开添加模态框
            tjuser(){
                this.diaAdduser=true;
            },

            //确定添加按钮
            subUser(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.ruleForm.userRole=='管理员'){
                            this.ruleForm.userRole=0;
                        }else if(this.ruleForm.userRole=='超级管理员'){
                            this.ruleForm.userRole=1;
                        }else if(this.ruleForm.userRole=='用户'){
                            this.ruleForm.userRole=2;
                        }
                        axios.post('/client/user/saveOrUpdateUser',this.ruleForm)
                        const loading = this.$loading({
                            lock: true,
                            text: 'Loading',
                            spinner: 'el-icon-loading',
                            background: 'rgba(0, 0, 0, 0.7)'
                        });
                        setTimeout(() => {
                            loading.close();
                            this.diaAdduser=false;
                            this.seluser();
                        }, 600);
                        setTimeout(()=>{
                            this.$refs[formName].resetFields();
                            this.$message({
                                type: 'success',
                                message: '添加成功!',
                            });
                        },700)
                    }else {
                        console.log('提交失败!!');
                        return false;
                    }
                });
            },

            //删除方法
            deluser(row){
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.loading=true
                    axios.post('/client/user/removeUserById?id='+row.userId)
                    setTimeout(() => {
                        this.loading=false
                        this.seluser()
                    }, 400);
                    setTimeout(() => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!',
                        });
                    }, 550);
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },

            //打开模态框，并赋值给文本框
            upduser(row){
                this.xgForm.userId=row.userId
                this.xgForm.userPhone=row.userPhone
                this.xgForm.userPassword=row.userPassword
                this.xgForm.userDate=row.userDate
                this.xgForm.userRole=row.userRole
                this.diaUpuser=true
                if (this.xgForm.userRole==0){
                    this.xgForm.userRole='管理员';
                }else if(this.xgForm.userRole==1){
                    this.xgForm.userRole='超级管理员';
                }else if(this.xgForm.userRole==2){
                    this.xgForm.userRole='用户';
                }
            },

            //确定修改按钮
            Okuser() {
                if (this.xgForm.userRole=='管理员'){
                    this.xgForm.userRole=0;
                }else if(this.xgForm.userRole=='超级管理员'){
                    this.xgForm.userRole=1;
                }else if(this.xgForm.userRole=='用户'){
                    this.xgForm.userRole=2;
                }
                const _this=this
                axios.post('/client/user/saveOrUpdateUser',this.xgForm)
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                setTimeout(() => {
                    loading.close();
                    this.loading=true
                    this.diaUpuser=false
                }, 500);
                setTimeout(()=>{
                    this.seluser()
                    this.loading=false
                    this.$message({
                        type: 'success',
                        message: '修改成功!'
                    });
                },850)
            },

            //查询方法
            seluser(){
                axios.post("/client/user/search",{}).then(resp=>{
                    this.tableData=resp.data.list
                })
            },

        },
        mounted(){
            this.seluser();
        }
    }
</script>

<style scoped>

</style>
