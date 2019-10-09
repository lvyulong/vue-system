<template>
    <div class="page">
        <page-header title="用户管理"></page-header>

        <div class="page-content">
            <div class="clean-float">
                <!--输入框搜索-->
                <search-input
                        :options="views.searchSelects"
                        :label-width="'110px'"
                        style="width: 400px"
                        class="pull-right">
                </search-input>
            </div>
            <!--清除浮动-->
            <div class="mt1rem">
                <page-list :pageListApi="pageListApi">
                    <template slot-scope="slotScope">
                        <el-table :data="slotScope.list"
                                  height="820"
                                  border
                                  size="mini"
                                  style="width: 100%">
                            <el-table-column
                                    prop="id"
                                    label="ID">
                            </el-table-column>
                            <el-table-column label="头像">
                                <template slot-scope="scope">
                                    <img :src="avatar" class="avatar">
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="name"
                                    label="姓名">
                            </el-table-column>
                            <el-table-column
                                    prop="user_id"
                                    label="账号">
                            </el-table-column>
                            <el-table-column
                                    prop="en_name"
                                    label="英文名">
                            </el-table-column>
                            <el-table-column
                                    label="性别">
                                <template slot-scope="scope">
                                    {{scope.row.gender | gender}}
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="phone"
                                    label="手机号">
                            </el-table-column>
                            <el-table-column
                                    prop="email"
                                    label="邮箱">
                            </el-table-column>
                            <el-table-column
                                    prop="position"
                                    label="职位">
                            </el-table-column>
                            <el-table-column
                                    prop="created_at"
                                    label="创建时间">
                            </el-table-column>
                            <el-table-column
                                    prop="updated_at"
                                    label="最后登录时间">
                            </el-table-column>
                            <el-table-column
                                    prop="login_count"
                                    label="登录次数">
                            </el-table-column>
                        </el-table>
                    </template>
                </page-list>
            </div>
        </div>
    </div>
</template>
<script>
    import userApi from 'api/userApi';
    import avatar from 'image/avatar.jpg';

    export default {
        name: "appUserIndex",
        data() {
            return {
                pageListApi: userApi,
                search: {},
                test:{
                    name:'test'
                },
                avatar: avatar,
                views: {
                    searchSelects: [
                        {label: '名称', value: 'name'},
                    ],
                },

            }
        },
        computed: {},

        mounted: function () {
        }
    };
</script>
<style lang="less" scoped>
    .avatar {
        width: 50px;
        height: 50px;
    }
</style>
