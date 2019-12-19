<template>
    <div class="page">
        <!--title-->
        <page-header :back="true" title="新增客户"></page-header>
        <!--表单-->
        <div class="page-content">
            <el-form :model="model"
                     :rules="rules"
                     ref="form"
                     label-width="150px"
                     style="width: 800px"
                     class="mt2rem">
                <el-form-item label="key" prop="key">
                    <el-input v-model="model.key"></el-input>
                    <div class="red">* key：关键名称，一经创建，无法修改。 </div>
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input v-model="model.name"></el-input>
                </el-form-item>
                <el-form-item label="全称" prop="full_name">
                    <el-input v-model="model.full_name"></el-input>
                </el-form-item>
                <el-form-item label="英文名称" prop="en_name">
                    <el-input v-model="model.en_name"></el-input>
                </el-form-item>
                <el-form-item label="启用" prop="is_enable">
                    <el-switch v-model="model.is_enable"
                               :active-value=1
                               :inactive-value=0
                               class="mt10"></el-switch>
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
    import clientApi from 'api/clientApi';
    export default {
        name: "appClientNew",
        data() {
            return {
                pageApi: clientApi,
                model: {
                    key:'',
                    name:'',
                    full_name:'',
                    en_name:'',
                    is_enable:1
                },
                formRules: [
                    {key: 'key', label: 'key'},
                    {key: 'name', label: '名称'},
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
        }
    };
</script>
<style lang="less" scoped>
</style>
