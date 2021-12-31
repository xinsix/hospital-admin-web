<template>
    <div class="container">
        <div>
            <el-form :inline="true" :model="selDoName" class="demo-form-inline" v-if="show">
                <el-form-item label="科室：">
                    <el-select v-model="value" placeholder="请选择">
                        <el-option  v-for="item in division" :key="item.divisionName" :label="item.divisionName" :value="item.divisionId" @click="ectDiva()">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="名字">
                    <el-input v-model="selDoName.doctorName" placeholder="请输入名字" ></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="subDiv()" >查询</el-button>
                    <el-button @click="cz()">重置</el-button>
                </el-form-item>
            </el-form>
            <div style="display: inline-flex; width: 100%;margin-bottom: 10px;">
                <div style="width: 100%">
                    <el-button type="primary" plain  @click="openDiaoAdd()"><i class="el-icon-plus"></i><span>添加</span></el-button>
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
                    <el-button type="success" icon="el-icon-refresh-right" circle @click="sxDoct()"></el-button>
                </el-tooltip>
            </div>
        </div>

        <el-table
                v-loading="loading"
                :data="tableData"
                border
                style="width: 100%;">
            <el-table-column type="expand" v-slot="scope" label="详细" width="49">
                <el-form label-position="left" inline class="demo-table-expand">
                    <el-form-item label="医生详细描述：">
                        <span>{{ scope.row.doctorDescribe }}</span>
                    </el-form-item>
                </el-form>
            </el-table-column>
            <el-table-column
                    type="index"
                    :index-1="indexMethod"
                    align="center"
                    height="10"
                    width="80"
                    label="编号">
            </el-table-column>
            <el-table-column
                    prop="doctorName"
                    label="医生姓名">
            </el-table-column>
            <el-table-column
                    prop="doctorSex"
                    :formatter="judgeAge"
                    label="性别">
            </el-table-column>
            <el-table-column
                    prop="doctorGood"
                    label="医生擅长">
            </el-table-column>
<!--            <el-table-column-->
<!--                    prop="doctorDescribe"-->
<!--                    label="医生简介">-->
<!--            </el-table-column>-->
            <el-table-column
                    prop="doctorImgurl"
                    label="医生照片">
            </el-table-column>
            <el-table-column
                    prop="doctorDivisionid"
                    :formatter="judgeDivs"
                    label="医生所属科室id">
            </el-table-column>
            <el-table-column
                    label="操作"
                    align="center"
                    width="160"
                    v-slot="scope">
                <el-button type="text" icon="el-icon-edit" @click="opUpDoctor(scope.row)">编辑</el-button>
                <el-button type="text" icon="el-icon-delete" class="red" @click="delDoctor(scope.row)">删除</el-button>
            </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <div class="block" style="margin-top:15px;">
            <el-pagination align='center' @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           background
                           :current-page="currentPage"
                           :page-sizes="[1,2,5,10,20]"
                           :page-size="pageSize"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="total">
            </el-pagination>
        </div>

        <!-- 添加模态框-->
        <el-dialog :title="'添加数据'" v-model="diaoAddDoctor" :close-on-click-modal="true" :show-close="false"
                   width="800px">
            <el-tooltip  content="点击灰色区域暂时关闭"  placement="top">
                <el-form  :model="addDoctorForm" :rules="rulesDoctor" ref="addDoctorForm" label-width="80px" class="demo-ruleForm">
                    <el-form-item label="医生名字" prop="doctorName">
                        <el-input v-model="addDoctorForm.doctorName"></el-input>
                    </el-form-item>
                    <el-form-item label="性别" prop="doctorSex">
                        <el-select v-model="addDoctorForm.doctorSex" placeholder="性别">
                            <el-option v-for="item in sex" :key="item.name" :label="item.name" :value="item.indexId"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="擅长" prop="doctorGood">
                        <el-input v-model="addDoctorForm.doctorGood"></el-input>
                    </el-form-item>
                    <el-form-item label="详细信息" prop="doctorDescribe">
                    <el-input v-model="addDoctorForm.doctorDescribe"></el-input>
                </el-form-item>
                    <el-form-item label="图片路径" prop="doctorImgurl">
                        <el-input v-model="addDoctorForm.doctorImgurl"></el-input>
                    </el-form-item>
                    <el-form-item label="所在科室"  prop="doctorDivisionid">
                        <el-select v-model="addDoctorForm.doctorDivisionid" placeholder="请选择">
                            <el-option  v-for="item in division" :key="item.divisionName" :label="item.divisionName" :value="item.divisionId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="lll">
                        <el-button type="primary" @click="addDoctor('addDoctorForm')">立即创建</el-button>
                        <el-button @click="resetForm('addDoctorForm')">重置</el-button>
                        <el-button type="danger" round style="float: right"
                                   @click="diaoAddDoctor = false;resetForm('addDoctorForm')">关闭</el-button>
                    </el-form-item>
                </el-form>
            </el-tooltip>
        </el-dialog>
        <!--修改模态框-->
        <el-dialog :title="'修改数据'" v-model="diaoUpdateDoctor" :close-on-click-modal="false">
            <el-form :model="UpdDoctorForm"  label-width="100px" class="demo-ruleForm">
                <el-form-item label="医生名字" prop="doctorName">
                    <el-input v-model="UpdDoctorForm.doctorName"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="doctorSex">
                    <el-select v-model="UpdDoctorForm.doctorSex" placeholder="性别">
                        <el-option v-for="item in sex" :key="item.name" :label="item.name" :value="item.indexId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="擅长" prop="doctorGood">
                    <el-input v-model="UpdDoctorForm.doctorGood"></el-input>
                </el-form-item>
                <el-form-item label="详细信息" prop="doctorDescribe">
                    <el-input v-model="UpdDoctorForm.doctorDescribe"></el-input>
                </el-form-item>
                <el-form-item label="图片路径" prop="doctorImgurl">
                    <el-input v-model="UpdDoctorForm.doctorImgurl"></el-input>
                </el-form-item>
                <el-form-item label="所在科室"  prop="doctorDivisionid">
                    <el-select v-model="UpdDoctorForm.doctorDivisionid" placeholder="请选择">
                        <el-option  v-for="item in division" :key="item.divisionName" :label="item.divisionName" :value="item.divisionId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="UpdateDoctor('UpdDoctorForm')">修改</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    import axios from 'axios'
    export default {
        name: "doctorinfo",
        data(){
          return{
              //显示与隐藏
              isEditing:true,
              //加载
              loading:false,
              //查询医生名字
              selDoName:{
                  doctorName:'',
              },
              //科室
              value: '',
              //显示隐藏
              show:true,
              division: [{
                  divisionId: '',//编号
                  divisionName:''//科室名
              }],
              //医生表格
              tableData:[],
              currentPage: 1, // 当前页码
              total: 20, // 总条数
              pageSize: 20, // 每页的数据条数

              //添加模态框
              diaoAddDoctor: false,
              //修改模态框
              diaoUpdateDoctor:false,
              //男和女
              sex:[
                  {
                      "indexId":0,
                      "name":"女",
                  },
                  {
                      "indexId":1,
                      "name":"男",
                  }
              ],
              //非空验证
              rulesDoctor: {
                  doctorName: [
                      { required: true, message: '请输入医生姓名', trigger: 'blur' },
                      // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                  ],
                  doctorSex:[
                      { required: true, message: '请输入医生性别', trigger: 'blur' }
                  ],
                  doctorGood: [
                      { required: true, message: '请输入医生擅长', trigger: 'blur' }
                  ],
                  doctorDescribe: [
                      { required: true, message: '请输入介绍', trigger: 'blur' }
                  ],
                  doctorImgurl: [
                      { required: true, message: '请输入照片', trigger: 'blur' }
                  ],
                  doctorDivisionid: [
                      { required: true, message: '请输入所在科室', trigger: 'blur' }
                  ]
              },
              //添加模态框里面的表单
              addDoctorForm:{
                  doctorName:'',
                  doctorSex:'',
                  doctorGood:'',
                  doctorDescribe:'',
                  doctorImgurl:'',
                  doctorDivisionid:'',
              },
              //修改模态框里面的表单
              UpdDoctorForm:{
                  doctorId:'',
                  doctorName:'',
                  doctorSex:'',
                  doctorGood:'',
                  doctorDescribe:'',
                  doctorImgurl:'',
                  doctorDivisionid:'',
              }
          }
        },
        methods:{
            //隐藏与显示
            toggle(){
                this.show=!this.show
            },

            //重置
            cz(){
                this.selDoName.doctorName=''
                this.division=''
            },
            //打开添加
            openDiaoAdd(){
                this.diaoAddDoctor=true;
            },
            //添加清空
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            //确定添加患者
            addDoctor(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        axios.post('/client/doctorinfo/saveOrUpdateDoctorinfo',this.addDoctorForm)
                        const loading = this.$loading({
                            lock: true,
                            text: 'Loading',
                            spinner: 'el-icon-loading',
                            background: 'rgba(0, 0, 0, 0.7)'
                        });
                        setTimeout(() => {
                            loading.close();
                            this.diaoAddDoctor=false;
                            this.selDoctorOR();
                        }, 600);
                        setTimeout(()=>{
                            this.$refs[formName].resetFields();
                            this.$message({
                                type: 'success',
                                message: '添加成功!',
                            });
                        },700);
                    }else {
                        console.log('提交失败!!');
                        return false;
                    }
                });
            },

            //刷新
            sxDoct(){
                this.loading=true
                setTimeout(() => {
                    this.loading=false
                    this.selDoctor();
                }, 300);
                setTimeout(() => {
                    this.selDoName.doctorName=''
                    this.$message({
                        type: 'success',
                        message: '刷新成功!'
                    });
                }, 450);
            },

            //删除患者信息
            delDoctor(row) {
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.loading=true;
                    axios.post('/client/doctorinfo/removeDoctorinfoById?id='+row.doctorId)
                    setTimeout(() => {
                        this.loading=false;
                        this.selDoctorOR();
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
            opUpDoctor(row){
                this.diaoUpdateDoctor=true;
                this.UpdDoctorForm.doctorId=row.doctorId
                this.UpdDoctorForm.doctorName=row.doctorName
                this.UpdDoctorForm.doctorSex=row.doctorSex
                this.UpdDoctorForm.doctorGood=row.doctorGood
                this.UpdDoctorForm.doctorDescribe=row.doctorDescribe
                this.UpdDoctorForm.doctorImgurl=row.doctorImgurl
                this.UpdDoctorForm.doctorDivisionid=row.doctorDivisionid
            },
            //修改医生数据
            UpdateDoctor(){
                axios.post('/client/doctorinfo/saveOrUpdateDoctorinfo',this.UpdDoctorForm)
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                setTimeout(() => {
                    loading.close();
                    this.loading=true;
                    this.diaoUpdateDoctor=false
                }, 500);
                setTimeout(()=>{
                    this.loading=false;
                    this.selDoctorOR()
                    this.$message({
                        type: 'success',
                        message: '修改成功!'
                    });
                },850)
            },


            //每页条数改变时触发 选择一页显示多少行
            handleSizeChange(val) {
                // console.log(`每页 ${val} 条`);
                this.currentPage = 1;
                this.pageSize = val;
                axios.get('/client/doctorinfo/search?pageSize='+val+'&pageNo='+this.currentPage).then(resp=>{
                    this.tableData=resp.data.list
                    console.log(resp)
                })
            },
            //当前页改变时触发 跳转其他页
            handleCurrentChange(val) {
                //console.log(`当前页: ${val}`);
                this.currentPage = val;
                axios.get('/client/doctorinfo/search?pageNo='+val+'&pageSize='+this.pageSize).then(resp=>{
                    this.tableData=resp.data.list
                })
            },




            //自定义索引
            indexMethod(index) {
                return index * 1;
            },
            //按科室查询医生
            ectDiva(){
                axios.get("/client/doctorinfo/search?doctorDivisionid="+this.value).then(resp=>{
                    this.tableData=resp.data.list
                })
            },
            //科室分类查询
            subDiv(){
                axios.get('/client/doctorinfo/search?doctorName='+this.selDoName.doctorName).then(resp=>{
                    this.tableData=resp.data.list
                    this.total=resp.data.total
                })
            },
            //查询科室表
            selDivision(){
                axios.get("/client/division/search?pageSize="+this.total).then(resp=>{
                    this.division=resp.data.list
                })
            },
            //查询医生表
            selDoctor(){
                axios.post('/client/doctorinfo/search',{}).then(resp=>{
                    this.tableData=resp.data.list
                    this.total=resp.data.total
                })
            },
            //判断是男是女
            judgeAge(row){
                return row.doctorSex==0?'女':'男'
            },
            //判断是那个科室
            judgeDivs(row){
                return row.doctorDivisionid==1?'麻醉科/痛科':'烧伤外科'
            },

            //分页查询医生表
            selDoctorOR(){
                axios.post('/client/doctorinfo/search?pageNo='+this.currentPage+'&pageSize='+this.pageSize).then(resp=>{
                    this.tableData=resp.data.list
                    this.total=resp.data.total
                })
            }
        },
        mounted(){
            this.selDoctor();
            this.selDivision();
        }
    }
</script>

<style scoped>

</style>
