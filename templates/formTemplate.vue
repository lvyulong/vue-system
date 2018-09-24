<template>
    <div>
        <!--title-->
        <div class="page-title" style="position: relative">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{name:'appPreExamIndex'}">上一级页面</el-breadcrumb-item>
                <el-breadcrumb-item>当前页面</el-breadcrumb-item>
            </el-breadcrumb>
            <back style="position: absolute;top: 0;right: 0"></back>
        </div>
        <!--表单-->
        <div class="mt2rem">
            <el-form :model="model"
                     :rules="rules"
                     ref="form"
                     label-width="100px"
                     style="width: 600px"
                     class="demo-ruleForm">

                <el-form-item label="名称" prop="name">
                    <el-input v-model="model.name"></el-input>
                </el-form-item>

                <el-form-item label="类型">
                    <el-select v-model="model.type"
                               filterable
                               style="width: 100%"
                               placeholder="请选择">
                        <el-option
                                v-for="item in view.types"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>


                <el-form-item label="描述" prop="desc">
                    <el-input type="textarea" :rows="4" placeholder="描述" v-model="model.desc"></el-input>
                </el-form-item>


                <el-form-item label="是否启用" prop="is_enable">
                    <el-switch v-model="model.is_enable"
                               :active-value=1
                               :inactive-value=0
                               style="margin-top: 10px"></el-switch>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary"
                               size="mini"
                               @click="submit('form')">
                        确定
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    // import demoApi from 'api/demoApi';
    // import secondApi from 'api/secondApi';
    import axios from 'axios';
    export default {
        name: "appPreExamNew",
        data() {
            return {
                // pageApi:demoApi,
                model: {
                    name: '',
                    desc: '',
                    is_enable: 1,
                },
                rules: {
                    name: [
                        {required: true, message: '请输入名称', trigger: 'blur'},
                    ],
                },
                views:{
                    types:[
                        {label:'类型1',value:1},
                        {label:'类型2',value:2},
                    ]
                }

            }
        },
        methods: {
            // submit(form) {
            //     var that = this;
            //     var data = Object.assign({}, that.model);
            //
            //     this.$refs[form].validate((valid) => {
            //         if (valid) {
            //             this.pageApi.save({data: data}).then(function (res) {
            //                 that.$message.success('提交成功');
            //                 // that.$router.push({name: 'appPreExamIndex'});
            //             })
            //         } else {
            //             that.$message.error('填写有误');
            //             return false;
            //         }
            //     });
            // },

        },
        // beforeRouteEnter(to, from, next) {
        //     axios.all([
        //         secondApi.simple()
        //     ]).then(function (res) {
        //         // 数据渲染到页面
        //     });
        // },
    };
</script>
<style lang="less" scoped>

</style>
