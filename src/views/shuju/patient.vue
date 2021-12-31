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
                    prop="patientName"
                    label="患者姓名">
            </el-table-column>
            <el-table-column
                    prop="patientAge"
                    label="患者年龄">
            </el-table-column>
            <el-table-column
                    prop="patientSex"
                    :formatter="userTypeList"
                    label="患者性别">
            </el-table-column>
            <el-table-column
                    prop="patientBirthdate"
                    label="患者出生日期">
            </el-table-column>
            <el-table-column
                    prop="patientCardid"
                    label="患者身份证">
            </el-table-column>
            <el-table-column
                    prop="patientAddress"
                    label="患者家庭住址">
            </el-table-column>
<!--            <el-table-column-->
<!--                    prop="patientUser"-->
<!--                    label="患者登录id">-->
<!--            </el-table-column>-->
            <el-table-column
                    label="操作"
                    align="center"
                    width="160"
                    v-slot="scope">
                <el-button type="text" icon="el-icon-edit" @click="openDiaoUpdate(scope.row)">编辑</el-button>
                <el-button type="text" icon="el-icon-delete" class="red" @click="delPatient(scope.row)">删除</el-button>
            </el-table-column>
        </el-table>
        <!-- 添加模态框-->
        <!--            label-position="left"-->
        <el-dialog :title="'添加数据'" v-model="diaoAddPatient" :close-on-click-modal="true" :show-close="false"
                   width="800px">
            <el-tooltip  content="点击灰色区域暂时关闭"  placement="top">
                <el-form  :model="addPatientForm" :rules="rulesPatient" ref="addPatientForm" label-width="80px" class="demo-ruleForm">
                    <el-form-item label="名字" prop="patientName">
                        <el-input v-model="addPatientForm.patientName"></el-input>
                    </el-form-item>
                    <el-form-item label="年龄" prop="patientAge">
                        <el-input v-model="addPatientForm.patientAge"></el-input>
                    </el-form-item>
                    <el-form-item label="性别" prop="patientSex">
                        <el-input v-model="addPatientForm.patientSex"></el-input>
                    </el-form-item>
                    <el-form-item label="出生日期" prop="patientBirthdate">
                        <el-input v-model="addPatientForm.patientBirthdate"></el-input>
                    </el-form-item>
                    <el-form-item label="身份证" prop="patientCardid">
                        <el-input v-model="addPatientForm.patientCardid"></el-input>
                    </el-form-item>
                    <el-form-item label="家庭住址" prop="patientAddress">
                        <el-input v-model="addPatientForm.patientAddress"></el-input>
                    </el-form-item>
                    <el-form-item label="登录id" prop="patientUser">
                        <el-input v-model="addPatientForm.patientUser"></el-input>
                    </el-form-item>
                    <el-form-item class="lll">
                        <el-button type="primary" @click="addPatient('addPatientForm')">立即创建</el-button>
                        <el-button @click="resetForm('addPatientForm')">重置</el-button>
                        <el-button type="danger" round style="float: right"
                                   @click="diaoAddPatient = false;resetForm('addPatientForm')">关闭</el-button>
                    </el-form-item>
                </el-form>
            </el-tooltip>
        </el-dialog>
        <!--修改模态框-->
        <el-dialog :title="'修改数据'" v-model="diaoUpdatePatient" :close-on-click-modal="false">
            <el-form :model="UpPatientFrom"  label-width="100px" class="demo-ruleForm">
                <el-form-item label="名字" prop="patientName">
                    <el-input v-model="UpPatientFrom.patientName"></el-input>
                </el-form-item>
                <el-form-item label="年龄" prop="patientAge">
                    <el-input v-model="UpPatientFrom.patientAge"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="patientSex">
                    <el-input v-model="UpPatientFrom.patientSex"></el-input>
                </el-form-item>
                <el-form-item label="出生日期" prop="patientBirthdate">
                    <el-input v-model="UpPatientFrom.patientBirthdate"></el-input>
                </el-form-item>
                <el-form-item label="身份证" prop="patientCardid">
                    <el-input v-model="UpPatientFrom.patientCardid"></el-input>
                </el-form-item>
                <el-form-item label="家庭住址" prop="patientAddress">
                    <el-input v-model="UpPatientFrom.patientAddress"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="UpdateData('UpPatientFrom')">修改</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    import axios from 'axios'
    export default {
        name: "patient",
        data(){
            return{
                //加载
                loading:false,
                //表格
                tableData: [],
                //添加模态框
                diaoAddPatient: false,
                //修改模态框
                diaoUpdatePatient:false,
                //非空验证
                rulesPatient: {
                    patientName: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],
                    patientAge: [
                        { required: true, message: '请输入年龄', trigger: 'blur' }
                    ],
                    patientSex: [
                        { required: true, message: '请输入性别', trigger: 'blur' }
                    ],
                    patientBirthdate: [
                        { required: true, message: '请输入出生日期', trigger: 'blur' }
                    ],
                    patientCardid: [
                        { required: true, message: '请输入身份证号', trigger: 'blur' }
                    ],
                    patientAddress: [
                        { required: true, message: '请输入家庭住址', trigger: 'blur' }
                    ],
                    patientUser: [
                        { required: true, message: '请输入家庭住址', trigger: 'blur' }
                    ]
                },
                //添加模态框里面的表单
                addPatientForm:{
                    patientName:'',
                    patientAge:null,
                    patientSex:null,
                    patientBirthdate:null,
                    patientCardid:'',
                    patientAddress:'',
                    patientUser:null,
                },
                //修改模态框里面的表单
                UpPatientFrom:{
                   patientId:'',
                   patientName:'',
                   patientAge:null,
                   patientSex:null,
                   patientBirthdate:null,
                   patientCardid:'',
                   patientAddress:'',
                   // patientUser:null,
               }
            }
        },
        methods:{
            //打开添加
            openDiaoAdd(){
                this.diaoAddPatient=true;
            },
            //添加清空
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            //确定添加患者
            addPatient(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        axios.post('/client/patient/saveOrUpdatePatient',this.addPatientForm)
                        const loading = this.$loading({
                            lock: true,
                            text: 'Loading',
                            spinner: 'el-icon-loading',
                            background: 'rgba(0, 0, 0, 0.7)'
                        });
                        setTimeout(() => {
                            loading.close();
                            this.diaoAddPatient=false;
                            this.selPatient();
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

            //删除患者信息
            delPatient(row) {
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.loading=true;
                    axios.post('/client/patient/removePatientById?id='+row.patientId)
                    setTimeout(() => {
                        this.loading=false;
                        this.selPatient();
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

            //打开修改模态框,并赋值
            openDiaoUpdate(row){
                this.diaoUpdatePatient=true;
                this.UpPatientFrom.patientId=row.patientId
                this.UpPatientFrom.patientName=row.patientName
                this.UpPatientFrom.patientAge=row.patientAge
                this.UpPatientFrom.patientSex=row.patientSex
                this.UpPatientFrom.patientBirthdate=row.patientBirthdate
                this.UpPatientFrom.patientCardid=row.patientCardid
                this.UpPatientFrom.patientAddress=row.patientAddress
            },

            //确定修改按钮
            UpdateData(){
                axios.post('/client/patient/saveOrUpdatePatient',this.UpPatientFrom)
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                setTimeout(() => {
                    loading.close();
                    this.loading=true;
                    this.diaoUpdatePatient=false
                }, 500);
                setTimeout(()=>{
                    this.loading=false;
                    this.selPatient()
                    this.$message({
                        type: 'success',
                        message: '修改成功!'
                    });
                },850)
            },


            //查询患者表
            selPatient(){
                axios.post("/client/patient/search",{}).then(resp=>{
                    this.tableData=resp.data.list
                })
            },
            //自定义索引
            indexMethod(index) {
                return index * 1;
            },
            //判断男和女
            userTypeList (row) {
                return row.patientSex==1?'男':'女'
            },
        },

        mounted(){
            this.selPatient()
        }
    }
</script>

<style scoped>

</style>
