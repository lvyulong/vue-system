<template>
    <div class="page">
        <!--title-->
        <page-header back="1" slotNav="1">
            <template slot="nav">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item
                            :to="{
                            name:'appDemo1Demo11Index'
                            }">
                        报名
                    </el-breadcrumb-item>
                    <el-breadcrumb-item>
                        编辑项目
                        <span v-if="views.desc">（{{views.desc}}）</span>
                    </el-breadcrumb-item>
                </el-breadcrumb>
            </template>
        </page-header>
        <!--表单-->
        <div class="page-content" style="height: 90%">
            <el-form :model="model"
                     :rules="rules"
                     ref="form"
                     label-width="150px"
                     style="width: 800px"
                     class="mt2rem">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="model.name"></el-input>
                </el-form-item>

                <el-form-item label="类型" prop="type">
                    <el-select v-model="model.type"
                               style="width: 100%"
                               filterable
                               placeholder="请选择类型">
                        <el-option
                                v-for="item in views.types"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="日期" prop="date">
                    <el-date-picker
                            style="width: 100%"
                            type="date"
                            value-format="yyyy-MM-dd"
                            v-model="model.date"
                            placeholder="请选择日期">
                    </el-date-picker>
                </el-form-item>

                <el-form-item label="描述" prop="desc">
                    <el-input type="textarea" rows="5" v-model="model.desc"></el-input>
                </el-form-item>

                <el-form-item label="是否开启" prop="is_enable">
                    <el-switch v-model="model.is_enable"
                               :active-value=1
                               :inactive-value=0
                               class="pull-left"
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
    import demo1Api from 'api/demo1Api';
    import demo11Api from 'api/demo11Api';
    import axios from 'axios';
    export default {
        name: "appDemo1Demo11New",
        data() {
            return {
                pageApi: demo11Api,
                model: {
                    name: '',
                    type:'',
                    date: '',
                    desc:'',
                    is_enable: 0,
                },

                views:{
                    types:[],
                    desc:'demo1'
                },
                formRules:[
                    {key:'name',label:'名称'},
                    {key:'type',label:'类型'},
                    {key:'date',label:'日期'},
                ],
            }
        },
        computed:{
            rules:function () {
                var rules = myTool.rule(this.formRules);
                return rules;
            }
        },
        methods: {
            submit(form) {
                var that = this;
                var data = Object.assign({}, that.model);
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        this.pageApi.update({data: data}).then(function (res) {
                            that.$message.success('提交成功');
                            history.back();
                        })
                    } else {
                        that.$message.error('填写有误');
                        return false;
                    }
                });
            },
        },
        created:function(){
            var that = this;
            axios.all([
                demo1Api.simple(),
                demo11Api.get({
                    params:{
                        id:that.$route.params.id
                    }
                }),
            ]).then(function (res) {
                that.views.types = myTool.getProp(res[0],'data.items');
                that.model = myTool.getProp(res[1],'data');
            })
        }
    };
</script>
<style lang="less" scoped>

</style>
