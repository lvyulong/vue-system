<template>
    <div class="page">
        <!--title-->
        <page-header back="1" slotNav="1">
            <template slot="nav">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :to="{name:'appUserRoleIndex'}">
                        角色管理
                    </el-breadcrumb-item>
                    <el-breadcrumb-item>
                        新增角色
                    </el-breadcrumb-item>
                </el-breadcrumb>
            </template>
        </page-header>
        <!--表单-->
        <div class="page-content" style="height: 90%">
            <el-form :model="model"
                     :rules="rules"
                     ref="form"
                     label-width="80"
                     class="mt2rem">

                <el-row>
                    <el-col :span="10">
                        <el-card class="box-card" style="height: 70vh">
                            <div slot="header" class="clearfix">
                                <span>基本信息</span>
                            </div>
                            <el-form-item label="名称" prop="name">
                                <el-input v-model="model.name"></el-input>
                            </el-form-item>
                            <el-form-item label="描述" prop="desc">
                                <el-input v-model="model.desc" type="textarea" rows="5"></el-input>
                            </el-form-item>
                            <el-form-item label="是否启用" prop="is_enable">
                                <el-switch v-model="model.is_enable"
                                           :active-value=1
                                           :inactive-value=0
                                           class="pull-left"
                                           style="margin-top: 10px"></el-switch>
                            </el-form-item>
                        </el-card>
                    </el-col>
                    <el-col :span="13" class="ml2rem">
                        <bindPms :pmsList="pmsList" ref="bindPms" height="70vh"></bindPms>
                    </el-col>
                </el-row>
                <el-form-item class="text-center mt2rem"
                              label-width="0">
                    <el-button type="primary"
                               style="width: 10rem"
                               @click="submit('form')">
                        提交
                    </el-button>
                </el-form-item>

            </el-form>
        </div>
    </div>
</template>
<script>
    import authRoleApi from 'api/authRoleApi';
    import bindPms from 'component/bindPms';

    export default {
        name: "appUserRoleNew",
        data() {
            return {
                pageApi: authRoleApi,
                model: {
                    name: '',
                    desc: '',
                    permission: [],
                    is_enable: 1,
                },
                views: {},
                formRules: [
                    {key: 'name', label: '名称'}
                ],
                pmsList:[]
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
                var pms = that.$refs['bindPms'].getResult();
                var data = Object.assign({}, that.model);
                data.permission = pms;
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
        components: {
            bindPms
        },
        mounted: function () {
            var that = this;
            setTimeout(function () {
                that.$refs['bindPms'].initList(JSON.parse(JSON.stringify(that.$store.state.local.static.admin_permission)));
            })
        }
    };
</script>
<style lang="less" scoped>
</style>