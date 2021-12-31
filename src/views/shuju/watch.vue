<template>
    <div class="container">
        <div style="width: 100%;margin-bottom: 10px;">
            <el-button type="primary" plain  @click="openDiaoAdd()"><i class="el-icon-plus"></i><span>添加</span></el-button>
        </div>
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
                    prop="doctorName"
                    label="值班医生信息">
            </el-table-column>
            <el-table-column
                    prop="watchDate"
                    label="值班时间">
            </el-table-column>
            <!--            <el-table-column-->
            <!--                    label="操作"-->
            <!--                    align="center"-->
            <!--                    width="160"-->
            <!--                    v-slot="scope">-->
            <!--                <el-button type="text" icon="el-icon-edit" @click="openDiaoUpdate(scope.row)">编辑</el-button>-->
            <!--                <el-button type="text" icon="el-icon-delete" class="red" @click="delPatient(scope.row)">删除</el-button>-->
            <!--            </el-table-column>-->
        </el-table>
    </div>
</template>

<script>
    import axios from 'axios'
    export default {
        name: "watch",
        data(){
            return{
                tableData:[],
            }
        },
        methods:{
            //自定义索引
            indexMethod(index) {
                return index * 1;
            },
            //查询医生值班表
            selWatch(){
                axios.get('/client/watch/search').then(resp=>{
                    this.tableData=resp.data.list
                })
            },
        },
        mounted(){
            this.selWatch();
        }
    }
</script>

<style scoped>

</style>
