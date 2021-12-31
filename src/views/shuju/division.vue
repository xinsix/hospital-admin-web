<template>
    <div class="container">
        <el-form :inline="true"  class="demo-form-inline">
            <el-form-item label="根据部门查询：">
                <el-select v-model="value" placeholder="请选择">
                    <el-option  v-for="item in department" :key="item.departmentName" :label="item.departmentName" :value="item.departmentId" @click="selDep()">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div style="width: 100%;margin-bottom: 10px;">
            <el-button type="primary" plain  @click="openDiaoAdd()"><i class="el-icon-plus"></i><span>添加</span></el-button>
        </div>

        <el-table
                v-loading="loading"
                :data="tableData"
                border
                style="width: 100%;">
            <el-table-column type="expand" v-slot="scope" label="详细" width="49">
                <el-form label-position="left" inline class="demo-table-expand">
                    <el-form-item label="科室介绍：">
                        <span>{{ scope.row.divisionDescribe }}</span>
                    </el-form-item>
                </el-form>
            </el-table-column>
            <el-table-column
                    type="index"
                    :index-1="indexMethod"
                    align="center"
                    height="10"
                    width="130"
                    label="编号">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="divisionName"
                    label="科室名称">
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
        <el-dialog :title="'添加数据'" v-model="diaoAddDiv" :close-on-click-modal="true" :show-close="false"
                   width="800px">
            <el-tooltip  content="点击灰色区域暂时关闭"  placement="top">
                <el-form  :model="addDivForm" :rules="rulesDiv" ref="addDivForm" label-width="110px" class="demo-ruleForm">
                    <el-form-item label="科室名字" prop="divisionName">
                        <el-input v-model="addDivForm.divisionName"></el-input>
                    </el-form-item>
                    <el-form-item label="所在部门：" prop="divisionDepartmentid">
                        <el-select v-model="addDivForm.divisionDepartmentid" placeholder="请选择">
                            <el-option  v-for="item in department" :key="item.departmentName" :label="item.departmentName" :value="item.departmentId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="科室介绍" prop="divisionDescribe">
                        <el-input v-model="addDivForm.divisionDescribe"></el-input>
                    </el-form-item>
                    <el-form-item class="lll">
                        <el-button type="primary" @click="addDiv('addDivForm')">立即创建</el-button>
                        <el-button @click="resetForm('addDivForm')">重置</el-button>
                        <el-button type="danger" round style="float: right"
                                   @click="diaoAddDiv = false;resetForm('addDivForm')">关闭</el-button>
                    </el-form-item>
                </el-form>
            </el-tooltip>
        </el-dialog>
        <!--修改模态框-->
        <el-dialog :title="'修改数据'" v-model="diaoUpdateDiv" :close-on-click-modal="false">
            <el-form :model="UpDivFrom"  label-width="100px" class="demo-ruleForm">
                <el-form-item label="科室名字" prop="divisionName">
                    <el-input v-model="UpDivFrom.divisionName"></el-input>
                </el-form-item>
                <el-form-item label="所在部门" prop="divisionDepartmentid">
                    <el-select v-model="UpDivFrom.divisionDepartmentid" placeholder="请选择">
                        <el-option  v-for="item in department" :key="item.departmentName" :label="item.departmentName" :value="item.departmentId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="科室介绍" prop="divisionDescribe">
                    <el-input v-model="UpDivFrom.divisionDescribe"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="UpdateData('UpDivFrom')">修改</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    import axios from 'axios'
    export default {
        name: "division",
        data(){
            return{
                //加载
                loading:false,
                //添加模态框
                diaoAddDiv: false,
                //修改模态框
                diaoUpdateDiv:false,
                tableData:[],
                value:'',
                department:[{
                    departmentId:'',//部门id
                    departmentName:'',//部门名字
                }],
                //添加表单
                addDivForm:{
                    divisionName:'', //科室名称
                    divisionDepartmentid:'', //科室所在部门
                    divisionDescribe:'',//科室介绍
                },
                //修改模态框表单
                UpDivFrom:{
                    divisionId:'',//科室id
                    divisionName:'', //科室名称
                    divisionDepartmentid:'', //科室所在部门
                    divisionDescribe:'',//科室介绍
                },
                //非空验证
                rulesDiv: {
                    divisionName: [
                        { required: true, message: '请输入科室名称', trigger: 'blur' },
                        // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],
                    divisionDepartmentid: [
                        { required: true, message: '请输入科室所在部门', trigger: 'blur' }
                    ],
                    divisionDescribe: [
                        { required: true, message: '请输入科室介绍', trigger: 'blur' }
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
            //打开添加模态框
            openDiaoAdd(){
                this.diaoAddDiv=true;
            },
            //增加部门信息
            addDiv(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        axios.post('/client/division/saveOrUpdateDivision',this.addDivForm)
                        const loading = this.$loading({
                            lock: true,
                            text: 'Loading',
                            spinner: 'el-icon-loading',
                            background: 'rgba(0, 0, 0, 0.7)'
                        });
                        setTimeout(() => {
                            loading.close();
                            this.diaoAddDiv=false;
                            this.selDivs();
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
            ///删除科室
            delDepart(row){
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.loading=true;
                    axios.post('/client/division/removeDivisionById?id='+row.divisionId)
                    setTimeout(() => {
                        this.loading=false;
                        this.selDivs();
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
                this.diaoUpdateDiv=true;
                this.UpDivFrom.divisionId=row.divisionId
                this.UpDivFrom.divisionName=row.divisionName
                this.UpDivFrom.divisionDepartmentid=row.divisionDepartmentid
                this.UpDivFrom.divisionDescribe=row.divisionDescribe
            },
            //修改数据
            UpdateData(){
                axios.post('/client/division/saveOrUpdateDivision',this.UpDivFrom)
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                setTimeout(() => {
                    loading.close();
                    this.loading=true;
                    this.diaoUpdateDiv=false
                }, 500);
                setTimeout(()=>{
                    this.loading=false;
                    this.selDivs()
                    this.$message({
                        type: 'success',
                        message: '修改成功!'
                    });
                },850)
            },

            //查询科室表
            selDivs(){
                axios.post("/client/division/search").then(resp=>{
                    this.tableData=resp.data.list
                })
            },
            //查询部门下拉框
            selDepartment(){
                axios.get('/client/department/search').then(resp=>{
                    this.department=resp.data.list
                })
            },
            //根据部门下拉框查询
            selDep(){
                axios.get('/client/division/search?divisionDepartmentid='+this.value).then(resp=>{
                    this.tableData=resp.data.list
                })
            }
        },

        mounted(){
            this.selDivs();
            this.selDepartment()
        }
    }
</script>

<style scoped>

</style>
