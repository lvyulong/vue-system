<template>
    <div class="page">
        <!--title-->
        <page-header back="1" slotNav="1">
            <template slot="nav">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :to="{name:'appDemoIndex'}">
                        Demo管理
                    </el-breadcrumb-item>
                    <el-breadcrumb-item>
                        编辑Demo
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
                <el-form-item label="内容" prop="content">
                    <el-input v-model="model.content" type="textarea" rows="10"></el-input>
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
    import demoApi from 'api/demoApi';
    export default {
        name: "appDemoNew",
        data() {
            return {
                pageApi: demoApi,
                model: {
                    content:''
                },
                views: {

                },
                formRules: [
                    {key: 'content', label: '内容'},
                ],
            }
        },
        computed: {
            rules: function () {
                var rules = myTool.rule(this.formRules);
                return rules;
            }
        },
        methods: {
            submit(form) {
                var that = this;
                var data = Object.assign({}, that.model);
                data.project_id = that.$route.query.project_id;
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        this.pageApi.save({data: data}).then(function (res) {
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
        created:function () {
            var that = this;
            demoApi.get({
                params:{
                    id:that.$route.params.id
                }
            }).then(function (res) {
                that.model = res.data;
            })
        }
    };
</script>
<style lang="less" scoped>
</style>
