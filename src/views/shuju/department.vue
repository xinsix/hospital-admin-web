<template>
    <div class="container">
        <div style="width: 100%;margin-bottom: 10px;">
            <el-button type="primary" plain  @click="openDiaoAdd()"><i class="el-icon-plus"></i><span>添加</span></el-button>
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
                    prop="departmentName"
                    label="部门名字">
            </el-table-column>
            <el-table-column
                    prop="departmentDescribe"
                    label="部门介绍">
            </el-table-column>
            <el-table-column
                    label="操作"
                    align="center"
                    width="160"
                    v-slot="scope">
                <el-button type="text" icon="el-icon-edit" @click="openDiaoUpdate(scope.row)">编辑</el-button>
                <el-button type="text" icon="el-icon-delete" class="red" @click="delDepart(scope.row)">删除</el-button>
            </el-table-column>
        </el-table>
        <!-- 添加模态框-->
        <el-dialog :title="'添加数据'" v-model="diaoAddDepart" :close-on-click-modal="true" :show-close="false"
                   width="800px">
            <el-tooltip  content="点击灰色区域暂时关闭"  placement="top">
                <el-form  :model="addDepartForm" :rules="rulesDepar" ref="addDepartForm" label-width="80px" class="demo-ruleForm">
                    <el-form-item label="部门名字" prop="departmentName">
                        <el-input v-model="addDepartForm.departmentName"></el-input>
                    </el-form-item>
                    <el-form-item label="部门介绍" prop="departmentDescribe">
                        <el-input v-model="addDepartForm.departmentDescribe"></el-input>
                    </el-form-item>
                    <el-form-item class="lll">
                        <el-button type="primary" @click="addDepart('addDepartForm')">立即创建</el-button>
                        <el-button @click="resetForm('addDepartForm')">重置</el-button>
                        <el-button type="danger" round style="float: right"
                                   @click="diaoAddDepart = false;resetForm('addDepartForm')">关闭</el-button>
                    </el-form-item>
                </el-form>
            </el-tooltip>
        </el-dialog>
        <!--修改模态框-->
        <el-dialog :title="'修改数据'" v-model="diaoUpdateDepart" :close-on-click-modal="false">
            <el-form :model="UpDepartFrom"  label-width="100px" class="demo-ruleForm">
                <el-form-item label="名字" prop="departmentName">
                    <el-input v-model="UpDepartFrom.departmentName"></el-input>
                </el-form-item>
                <el-form-item label="年龄" prop="departmentDescribe">
                    <el-input v-model="UpDepartFrom.departmentDescribe"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="UpdateData('UpDepartFrom')">修改</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    import axios from 'axios'
    export default {
        name: "department",
        data(){
          return{
              //加载
              loading:false,
              tableData:[],
              diaoAddDepart:false,//添加模态框
              diaoUpdateDepart:false,//修改模态框
              //添加表单
              addDepartForm:{
                  departmentName:'', //部门名字
                  departmentDescribe:'' //部门介绍
              },
              //修改表单
              UpDepartFrom:{
                  departmentId:null,//部门id
                  departmentName:'', //部门名字
                  departmentDescribe:'' //部门介绍
              },
              rulesDepar: {
                  departmentName: [
                      { required: true, message: '请输入部门名字', trigger: 'blur' },
                      // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                  ],
                  departmentDescribe: [
                      { required: true, message: '请输入部门介绍', trigger: 'blur' }
                  ],
              },
          }
        },
        methods:{
            //自定义索引
            indexMethod(index) {
                return index * 1;
            },
            //添加清空
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            //打开统计模态框
            openDiaoAdd(){
                this.diaoAddDepart=true;
            },
            //增加部门信息
            addDepart(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        axios.post('/client/department/saveOrUpdateDepartment',this.addDepartForm)
                        const loading = this.$loading({
                            lock: true,
                            text: 'Loading',
                            spinner: 'el-icon-loading',
                            background: 'rgba(0, 0, 0, 0.7)'
                        });
                        setTimeout(() => {
                            loading.close();
                            this.diaoAddDepart=false;
                            this.selDepartment();
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

            //删除部门信息
            delDepart(row){
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.loading=true;
                    axios.post('/client/department/removeDepartmentById?id='+row.departmentId)
                    setTimeout(() => {
                        this.loading=false;
                        this.selDepartment();
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
            openDiaoUpdate(row){
               this.diaoUpdateDepart=true;
               this.UpDepartFrom.departmentName=row.departmentName
               this.UpDepartFrom.departmentDescribe=row.departmentDescribe
               this.UpDepartFrom.departmentId=row.departmentId
            },
            //确定修改
            UpdateData(){
                axios.post('/client/department/saveOrUpdateDepartment',this.UpDepartFrom)
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                setTimeout(() => {
                    loading.close();
                    this.loading=true;
                    this.diaoUpdateDepart=false
                }, 500);
                setTimeout(()=>{
                    this.loading=false;
                    this.selDepartment()
                    this.$message({
                        type: 'success',
                        message: '修改成功!'
                    });
                },850)
            },

            //查询部门
            selDepartment(){
                axios.get('/client/department/search').then(resp=>{
                    this.tableData=resp.data.list
                })
            }
        },
        mounted(){
            this.selDepartment();
        }
    }
</script>

<style scoped>

</style>
