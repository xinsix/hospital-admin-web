<template>
    <div>
<!--        <table  style="width: 100%">-->
<!--            <tr v-for="item in prece">-->
<!--                <td>{{item.perce_name}}</td>-->
<!--            </tr>-->
<!--        </table>-->
        <el-row :gutter="20">
            <el-col :span="8">
                <el-card shadow="hover" class="mgb20" style="height:252px;">
                    <div class="user-info">
                        <img src="../assets/img/img.jpg" class="user-avator" alt />
                        <div class="user-info-cont">
                            <div class="user-info-name">{{ name }}</div>
                            <div>{{ role }}</div>
                        </div>
                    </div>
                    <div class="user-info-list">
                        上次登录时间：
                        <span>
                           2021-12-13
                        </span>
                    </div>
                    <div class="user-info-list">
                        上次登录地点：
                        <span>东莞</span>
                    </div>
                </el-card>
                <el-card shadow="hover" style="height:252px;">
                    <template #header>
                        <div class="clearfix">
                            <span>药瓶详细</span>
                        </div>
                    </template>
                    <div>
                        <div v-for="item in perce">
                            <div>{{item.textValue}}</div>
                            <el-progress  :percentage="item.perce_name" :color="item.className">
                            </el-progress>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="16">
                <div v-if="show" class="cao" style="text-align: center;">
                    <el-form :inline="true" :model="addMatter" :rules="rules" ref="addMatter" class="demo-form-inline" v-if="show">
                        <el-form-item prop="matterName">
                            <div style="margin-top: -24px;width: 350px">
                                <el-input v-model="addMatter.matterName" placeholder="请输入名字"></el-input>
                            </div>
                        </el-form-item>
                        <el-button @click="addMat('addMatter');" class="bshab">添加</el-button>
                    </el-form>
                </div>
                <el-row :gutter="20" class="mgb20">
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{ padding: '0px' }">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-user-solid grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{total}}</div>
                                    <div>用户数量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{ padding: '0px' }">
                            <div class="grid-content grid-con-2">
                                <i class="el-icon-message-solid grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{total2}}</div>
                                    <div>在职医生数</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{ padding: '0px' }">
                            <div class="grid-content grid-con-3">
                                <i class="el-icon-s-goods grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{total3}}</div>
                                    <div>患者数量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
                <el-card shadow="hover" style="height:403px;overflow-y: scroll">
                    <template #header>
                        <div class="clearfix" >
                            <span>待办事项</span>
                            <el-button style="float: right; padding: 3px 0" type="text" @click="toggle()">添加</el-button>
                        </div>
                    </template>
                    <el-table :show-header="false" :data="todoList" style="width:100%;margin-top: -20px;">
                        <el-table-column
                                prop="matterName"
                                label="代办事项"
                                height="50">
                        </el-table-column>
                        <el-table-column
                                label="操作"
                                align="center"
                                width="50"
                                v-slot="scope">
                            <el-tooltip content="已完成" placement="top"  >
                                <el-button type="success" icon="el-icon-check"
                                           circle @click="delMatter(scope.row)" size="mini">
                                </el-button>
                            </el-tooltip>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="12">
                <el-card shadow="hover">
                    <schart ref="bar" class="schart" canvasId="bar" :options="options"></schart>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card shadow="hover">
                    <schart ref="line" class="schart" canvasId="line" :options="options2"></schart>
                </el-card>
            </el-col>
        </el-row>

    </div>
</template>

<script>
import Schart from "vue-schart";
import { reactive } from "vue";
import axios from "axios"
import Tr from "element-plus/packages/locale/lang/tr";
export default {
    name: "dashboard",
    components: {Tr, Schart },
    data(){
        return{
            show:false,
            todoList:[],
            addMatter: {
                matterName: null
            },
            rules: {
                matterName: [
                    {required: true, message: '不能为空！请输入', trigger: 'blur'},
                    // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
            },
            perce:[{
                perce_id:'',
                perce_name:'',
                className:'',
                textValue:''
            }],
            total:'',
            total2:'',
            total3:'',
        }
    },
    setup() {
        const name = localStorage.getItem("ms_username");
        const role = name === "admin" ? "超级管理员" : "普通用户";

        const data = reactive([
            {
                name: "2018/09/04",
                value: 1083,
            },
            {
                name: "2018/09/05",
                value: 941,
            },
            {
                name: "2018/09/06",
                value: 1139,
            },
            {
                name: "2018/09/07",
                value: 816,
            },
            {
                name: "2018/09/08",
                value: 327,
            },
            {
                name: "2018/09/09",
                value: 228,
            },
            {
                name: "2018/09/10",
                value: 1065,
            },
        ]);

        const options = {

            type: "bar",
            title: {
                text: "最近一周的高级药瓶销售",
            },
            xRorate: 25,
            labels: ["周一", "周二", "周三", "周四", "周五"],
            perce:[
                {
                    perce_name:''
                }
            ],
            datasets: [
                {
                    label: "南沙医院",
                    data: [120, 278, 270, 190, 230],
                },
                {
                    label: "锋佛医院",
                    data: [164, 178, 190, 135, 160],
                },
                {
                    label: "鸵鸟医院",
                    data: [144, 198, 150, 235, 120],
                },
            ],
        };
        const options2 = {
            type: "line",
            title: {
                text: "最近几个月各品类药瓶销售图",
            },

            labels: ["6月", "7月", "8月", "9月", "10月"],
            datasets: [
                {
                    label: "安眠药",
                    data: [120, 278, 270, 190, 230],
                },
                {
                    label: "脑瘫育苗",
                    data: [164, 178, 150, 135, 160],
                },
                {
                    label: "高级香薰",
                    data: [74, 118, 200, 235, 90],
                },
            ],
        };
        return {
            name,
            data,
            options,
            options2,
            role,
        };
    },
    methods:{
        //查询用户数量
        seluser(){
            axios.post("/client/user/search").then(resp=>{
                this.total=resp.data.total
            })
        },
        //查询医生
        selDoctor(){
            axios.post('/client/doctorinfo/search',{}).then(resp=>{
                this.total2=resp.data.total
            })
        },
        //查询患者表
        selPatient(){
            axios.post("/client/patient/search",{}).then(resp=>{
                this.total3=resp.data.total
            })
        },

        //查询进度表
        selPrece(){
            axios.get("http://localhost:7600/api/contact/selPerce").then(resp=>{
                this.perce=resp.data
            })
        },
        //查询要办事项
        selMatter(){
            axios.get("/client/matter/search").then(resp=>{
                this.todoList=resp.data.list
            })
        },
        //删除要办事项
        delMatter(row){
            axios.post("/client/matter/removeMatterById?id="+row.matterId)
            setTimeout(() => {
                this.selMatter();
            }, 50);
        },
        //添加事项表
        addMat(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    axios.post("/client/matter/saveOrUpdateMatter",this.addMatter)
                    setTimeout(() => {
                        this.selMatter();
                        this.qk();
                        this.toggle();
                    }, 50);
                }else {
                    console.log('提交失败!!');
                    return false;
                }
            });
        },
        //清空事项表
        qk(){
            this.addMatter.matterName=''
        },
        //隐藏表单
        toggle(){
            this.show=!this.show
        }
    },
    mounted(){
        this.selPrece();
        this.selMatter();
        this.seluser();
        this.selDoctor();
        this.selPatient();
    }
};
</script>

<style scoped>
.el-row {
    margin-bottom: 20px;
}

.grid-content {
    display: flex;
    align-items: center;
    height: 100px;
}

.grid-cont-right {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #999;
}

.grid-num {
    font-size: 30px;
    font-weight: bold;
}

.grid-con-icon {
    font-size: 50px;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    color: #fff;
}

.grid-con-1 .grid-con-icon {
    background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
    background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
    background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
    color: rgb(242, 94, 67);
}

.user-info {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 2px solid #ccc;
    margin-bottom: 20px;
}

.user-avator {
    width: 120px;
    height: 120px;
    border-radius: 50%;
}

.user-info-cont {
    padding-left: 50px;
    flex: 1;
    font-size: 14px;
    color: #999;
}

.user-info-cont div:first-child {
    font-size: 30px;
    color: #222;
}

.user-info-list {
    font-size: 14px;
    color: #999;
    line-height: 25px;
}

.user-info-list span {
    margin-left: 70px;
}

.mgb20 {
    margin-bottom: 20px;
}

.todo-item {
    font-size: 14px;
}

.todo-item-del {
    text-decoration: line-through;
    color: #999;
}

.schart {
    width: 100%;
    height: 300px;
}
    .buju{
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        /*justify-content: right;*/
        /*align-items: center;*/
    }
   .cao{
       background-color: #fffcf3;
       border: 1px solid #eaeaea;
       height: 74px;
       width: 450px;
       position: absolute;
       top: 105px;
       right: 80px;
       border-radius: 10px;
   }
    .bshab{
        margin-top: 16px;
    }

</style>
