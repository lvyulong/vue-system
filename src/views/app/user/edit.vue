<template>
    <div v-if="isShowPage">
        <div class="title">
            <i class="el-icon-back font20 bold pointer" @click="close"></i>
            <span class="ml5">{{title}}</span>
        </div>
        <el-form :model="model"
                 :status-icon="true"
                 ref="form"
                 :rules="rules"
                 label-width="150px"
                 style="width: 80%">
            <form-field :model="model" :fields="fields" v-if="model"></form-field>
            <el-form-item>
                <el-button type="primary"
                           size="mini"
                           @click="submit()">
                    确定
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    import userApi from 'api/userApi';
    import msgConfig from 'config/msg';
    import authRoleApi from 'api/authRoleApi';
    import staticConfig from 'config/static';

    export default {
        props: ['client'],
        data() {
            return {
                title: '',
                isEdit: false,
                model: {
                    name: '',
                    user_id: '',
                    role_ids: '',
                    is_enable: 1,
                },
                staticConfig: staticConfig,
                fields: [
                    {label: '姓名', key: 'name', type: 'text', disabled: true, required: true},
                    {
                        label: '账号类型',
                        key: 'type',
                        disabled: true,
                        type: 'select',
                        filterable:true,
                        option:[],
                    },
                    {
                        label: '角色',
                        key: 'role_ids',
                        multiple: true,
                        option: [],
                        type: 'select',
                        filterable:true,
                    },
                    {label: '启用', key: 'is_enable', type: 'switch'},
                ],
                isShowPage: false,
                userType: []
        }
        },
        computed: {
            rules: function () {
                var rules = myTool.rule(this.fields);
                return rules;
            }
        },
        methods: {
            initData() {
                authRoleApi.simple({
                    params: {
                        company_id: this.$route.query.company_id
                    }
                }).then(res => {
                    this.isShowPage = true;
                    this.setOption(this.fields, 'key', 'role_ids', res.data.items);
                });
            },
            submit() {
                let that = this;
                that.$refs['form'].validate(valid => {
                    if (valid) {
                        let data = _.extend({}, that.model);
                        if (that.isEdit) {
                            userApi.update({
                                data: data
                            }).then(function (res) {
                                that.$notify.success({
                                    title: '提示',
                                    message: msgConfig['updateOk']
                                });
                                that.$emit('editSuccess');
                            })
                        } else {
                            userApi.save({
                                data: data
                            }).then(function (res) {
                                that.$notify.success({
                                    title: '提示',
                                    message: msgConfig['createOk']
                                });
                                that.$emit('editSuccess');
                            })
                        }
                    } else {
                        that.$notify.error({
                            title: '提示',
                            message: msgConfig['formError']
                        });
                    }
                })
            },
            close() {
                this.$emit('editClose');
            }
        },
        created: function () {
            let that = this;
            that.userType = JSON.parse(JSON.stringify(that.staticConfig.userType).replace(/type/g, 'id'));
            that.setOption(that.fields, 'key', 'type', that.userType);
            that.initData();
            if (that.client) {
                that.model = _.extend({}, that.client);
                that.isEdit = true;
                that.title = `编辑用户 - ${that.model.name}`;
                // key_name不能修改
                // that.$set(that.fields[1], 'disabled', true);
            } else {
                that.title = '新增用户';
            }
        },
    }
</script>
<style scoped lang="less">
    .title {
        padding: 20px;
        font-weight: bold;
        font-size: 18px;
    }
</style>