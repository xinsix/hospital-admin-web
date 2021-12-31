<template>
    <div>
        <div class="container">
            <div style="margin-bottom: 10px">
                <el-button size="small" @click="seladmin(item)" v-for="(item) in list">{{item}}</el-button>
            </div>
            <el-form :inline="true" :model="selName" class="demo-form-inline" v-if="show">
                <el-form-item label="名字">
                    <el-input v-model="selName.name" placeholder="请输入名字" ></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="SubmitName">查询</el-button>
                    <el-button @click="cz()">重置</el-button>
                </el-form-item>
            </el-form>
            <div class="butn" style="display: inline-flex">
                <div style="width: 100%">
                    <el-button type="primary" plain  @click="tjuser()"><i class="el-icon-plus"></i><span>添加</span></el-button>
                </div>
                <div>
                    <transition name="fade">
                        <div v-if="isEditing" key="save" style="margin-right: 10px">
                            <el-tooltip content="隐藏搜索" placement="top">
                                <el-button icon="el-icon-search" circle @click="toggle();isEditing=!isEditing"></el-button>
                            </el-tooltip>
                        </div>
                        <div v-else key="edit"  style="margin-right: 10px">
                            <el-tooltip content="显示搜索" placement="top"  >
                                <el-button icon="el-icon-search" circle @click="toggle();isEditing=!isEditing"></el-button>
                            </el-tooltip>
                        </div>
                    </transition>
                </div>
                <el-tooltip content="刷新" placement="top">
                    <el-button type="success" icon="el-icon-refresh-right" circle @click="sx()"></el-button>
                </el-tooltip>
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
                        :formatter="userTypeList"
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
                    <el-form-item label="手机号" prop="name">
                        <el-input v-model="xgForm.userPhone"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="username">
                        <el-input v-model="xgForm.userPassword"></el-input>
                    </el-form-item>
                    <el-form-item label="注册时间" prop="password">
                        <el-input v-model="xgForm.userDate"></el-input>
                    </el-form-item>
                    <el-form-item label="角色" prop="type">
                        <el-input v-model="xgForm.userRole"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="Okuser('xgForm')">修改</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
            <!-- 添加模态框-->
            <el-dialog :title="'添加数据'" v-model="diaAdduser" :close-on-click-modal="true" :show-close="false"
                       width="750px">
                <el-tooltip  content="点击灰色区域暂时关闭"  placement="top">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="60px" class="demo-ruleForm">
                    <el-form-item label="名字" prop="name">
                        <el-input v-model="ruleForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="账号" prop="username">
                        <el-input v-model="ruleForm.username"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="ruleForm.password"></el-input>
                    </el-form-item>
                    <el-form-item label="类型" prop="type">
                        <el-input v-model="ruleForm.type"></el-input>
                    </el-form-item>
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
    // import filters from '../utils/filters';
    // import "../../utils/filters"
    // import "@/utils/filters";
    export default {
        inject:["reload"],
        name: "hospital",
        data() {
            return {
                activeName: 'first',
                isEditing:true,
                show:true,
                loading:false,
                tableData: [],
                diaUpuser: false,
                diaAdduser: false,
                list:[0,1],
                sb:{},
                xgForm: {
                    userId:'',
                    userPhone: '',
                    userPassword: '',
                    userDate: '',
                    userRole: '',
                },
                selName: {
                    name: '',
                    type:'',
                },
                ruleForm: {
                    name: '',
                    username: '',
                    password: '',
                    type: '',
                },
                rules: {
                    name: [
                        { required: true, message: '请输入活动名称', trigger: 'blur' },
                        // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ],
                    type: [
                        { required: true, message: '请输入类型', trigger: 'blur' }
                    ]
                }
            }
        },
        methods:{
            //自定义索引
            indexMethod(index) {
                return index * 1;
            },

            //判断男和女
            userTypeList (row) {
                return row.userRole==1?'管理员':'超级管理员'
            },

            //打开添加
            tjuser(){
                this.diaAdduser=true;
            },

            //添加清空
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },

            //确定添加按钮
            subUser(formName) {
                this.$refs[formName].validate((valid) => {
                       if (valid) {
                      axios.post('http://localhost:7600/api/contact/addUser',this.ruleForm)
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

            //打开修改模态框
            upduser(row){
                this.xgForm.userId=row.userId
                this.xgForm.userPhone=row.userPhone
                this.xgForm.userPassword=row.userPassword
                this.xgForm.userDate=row.userDate
                this.xgForm.userRole=row.userRole
                this.diaUpuser=true
            },


            //确定修改按钮
            Okuser() {
                const _this=this
                axios.post('http://192.168.1.23:8091/client/user/saveOrUpdateUser?userId='+this.xgForm.userId,this.xgForm)
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                setTimeout(() => {
                    loading.close();
                    this.diaUpuser=false
                    this.seluser()
                }, 500);
                setTimeout(()=>{
                    this.$message({
                        type: 'success',
                        message: '修改成功!'
                    });
                },800)
            },

            //查询方法
            seluser(){
                axios.post("/client/user/search",{}).then(resp=>{
                    this.tableData=resp.data.list
                    // console.log(resp)
                })
            },

            //模糊查询
            SubmitName(item) {
                this.loading=true
                setTimeout(() => {
                    axios.get("http://localhost:7600/api/contact/selUser?name="+this.selName.name+"&type="+this.selName.type).then(resp=>{
                        this.tableData=resp.data
                    })
                    this.loading=false
                }, 200);
            },

            //分类查询管理员
            // seladmin(item) {
            //     this.loading=true
            //     setTimeout(() => {
            //         axios.get("http://localhost:7600/api/contact/selUser?name=&type="+item).then(resp=>{
            //             this.tableData=resp.data
            //         })
            //         this.loading=false
            //     }, 200);
            // },

            //查询管理员和超级管理员
            seladmin(item){
                this.loading=true
                setTimeout(()=>{
                    axios.get("/client/user/search?userRole="+item).then(resp=>{
                        this.tableData=resp.data.list
                    })
                    this.loading=false
                },200)
            },

            //刷新
            sx(){
                this.loading=true
                setTimeout(() => {
                    this.loading=false
                    this.seluser()
                }, 300);
                setTimeout(() => {
                    this.selName.name=''
                    this.$message({
                        type: 'success',
                        message: '刷新成功!'
                    });
                }, 450);
            },

            //搜索清空
            cz(){
                this.selName.name=''
            },

            //隐藏表单
            toggle(){
                this.show=!this.show
            }
        },
        mounted() {
            //查询
            this.seluser();
        }
    }

</script>

<style scoped>
.size{
    color: #5d5d5d;
}
.red {
    color: #ff0000;
}
    .butn{
        width: 100%;
        margin-bottom: 10px;

    }
    .lll{
        position: relative;
        top: 15px;
        left: -3px;
    }
</style>
