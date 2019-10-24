<template>
    <div class="page">
        <!--title-->
        <page-header title="我的"></page-header>
        <!--表单-->
        <div class="page-content" style="height: 90%">
            <el-row>
                <el-col :span="12" class="padding5">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>修改密码</span>
                        </div>
                        <div>
                            <div>
                                <el-input v-model="newPwd"
                                          placeholder="新密码">
                                </el-input>
                            </div>
                            <div class="mt10">
                                <el-button type="warning"
                                           @click="createPwd"
                                           size="mini">
                                    生成随机密码
                                </el-button>
                                <el-button type="primary"
                                           class="pull-right"
                                           size="mini"
                                           @click="changePwd()">
                                    确定
                                </el-button>
                            </div>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="12" class="padding5">
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script>
    import userApi from 'api/userApi';
    import handle from 'config/handle';
    export default {
        name: "appMyPwd",
        data() {
            return {
                pageApi: userApi,
                newPwd:'',
                role_ids:[],
                views: {
                    roles:[],
                },
                formRules: [
                    {key: 'name', label: '用户名'},
                    {key: 'pwd', label: '密码'},
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
            createPwd(){
                this.newPwd = handle.createRandomPwd();
            },
            changePwd() {
                var that = this;
                if(that.newPwd){
                    var data = {
                        pwd: that.newPwd,
                        id: that.$store.state.local.user.id
                    };
                    that._updateModel(data);
                }
            },
            _updateModel(data){
                var that = this;
                this.pageApi.update({
                    data: data
                }).then(function (res) {
                    that.$message.success('提交成功');
                    that.newPwd = '';
                })
            }
        }
    };
</script>
<style lang="less" scoped>

</style>
