<template>
    <div class="page">
        <!--title-->
        <page-header back="1" slotNav="1">
            <template slot="nav">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :to="{name:'appUserIndex'}">
                        用户管理
                    </el-breadcrumb-item>
                    <el-breadcrumb-item>
                        编辑用户
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
                <el-form-item label="账号" prop="user_no">
                    <el-input v-model="model.user_no" disabled></el-input>
                </el-form-item>

                <el-form-item label="角色" prop="role_ids">
                    <el-select v-model="model.role_ids"
                               multiple
                               style="width: 100%"
                               filterable
                               placeholder="请选择角色">
                        <el-option
                                v-for="item in views.roles"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="启用" prop="is_enable">
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
    import userApi from 'api/userApi';
    import authRoleApi from 'api/authRoleApi';
    import axios from 'axios';
    export default {
        name: "appUserNew",
        data() {
            return {
                pageApi: userApi,
                model: {
                    user_no: '',
                    is_enable:1,
                    role_ids:[]

                },
                views: {
                    roles:[],
                },
                formRules: [
                    {key: 'user_no', label: '账号'}
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
        created: function () {
            var that = this;
            axios.all([
                authRoleApi.simple(),
                userApi.get({params:{id:that.$route.params.id}})
            ]).then(function (res) {
                that.views.roles = res[0].data.items;
                that.model = res[1].data;
            })
        }
    };
</script>
<style lang="less" scoped>

</style>
