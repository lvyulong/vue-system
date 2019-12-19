<template>
    <div class="page" v-if="userPms">
        <page-header title="用户管理"></page-header>
        <div class="page-content">
            <div class="page-search">
                <div>
                    <router-link :to="{name:'appUserNew'}"
                                 v-if="userPms['ADMIN_PM_USER_ADD']">
                        <el-button type="primary" size="small">
                            新增
                        </el-button>
                    </router-link>
                </div>
                <div>
                    <!--输入框搜索-->
                    <search-input
                            :options="views.searchSelects"
                            :label-width="'110px'"
                            style="width: 400px"
                            class="pull-right">
                    </search-input>
                </div>
            </div>
            <!--清除浮动-->
            <div class="mt1rem">
                <page-list :pageListApi="pageListApi">
                    <template slot-scope="slotScope">
                        <el-table :data="slotScope.list"
                                  border
                                  size="mini"
                                  style="width: 100%">
                            <el-table-column
                                    width="50"
                                    prop="id"
                                    label="ID">
                            </el-table-column>
                            <el-table-column label="头像"
                                             width="80">
                                <template slot-scope="slotScope">
                                    <img :src="slotScope.row.extra.avatar"
                                         v-if="slotScope.row.extra && slotScope.row.extra.avatar"
                                         class="avatar">
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="user_no"
                                    label="账号">
                            </el-table-column>
                            <el-table-column
                                    prop="name"
                                    label="姓名">
                            </el-table-column>
                            <el-table-column
                                    label="账号类型">
                                <template slot-scope="slotScope">
                                    {{slotScope.row.type | propMap(configStatic.userType,'type','name')}}
                                </template>
                            </el-table-column>
                            <el-table-column
                                    label="角色">
                                <template slot-scope="slotScope">
                                    <span v-for="(item,index) in slotScope.row.role_ids"
                                          v-if="slotScope.row.type == configEnum['USER_TYPE_IMPLEMENTER']"
                                          :key="index">
                                            {{item | propMap(views.roles,'id','name')}}
                                        <span v-if="index < slotScope.row.role_ids.length - 1"> / </span>
                                    </span>
                                </template>
                            </el-table-column>

                            <el-table-column
                                    width="160"
                                    prop="created_at"
                                    label="创建时间">
                            </el-table-column>
                            <el-table-column
                                    width="160"
                                    prop="updated_at"
                                    label="最后登录时间">
                            </el-table-column>
                            <el-table-column
                                    prop="login_count"
                                    label="登录次数">
                            </el-table-column>
                            <el-table-column prop="is_enable"
                                             label="启用状态">
                                <template slot-scope="slotScope">
                                    <i style="font-size: 1.5rem"
                                       :class="slotScope.row.is_enable | isEnable"></i>
                                </template>
                            </el-table-column>

                            <el-table-column
                                    v-if="checkPms(['ADMIN_PM_USER_EDIT','ADMIN_PM_USER_RESOURCE'],userPms)"
                                    width="250"
                                    label="操作">
                                <template slot-scope="slotScope"
                                          v-if="slotScope.row.id !== local.user.id">
                                    <router-link
                                            v-if="userPms['ADMIN_PM_USER_EDIT']"
                                            :to="{
                                            name:'appUserEdit',
                                            params:{id:slotScope.row.id},
                                            }">
                                        <el-button
                                                type="primary"
                                                size="mini"
                                                plain>
                                            编辑
                                        </el-button>
                                    </router-link>
                                    <el-button
                                            v-if="userPms['ADMIN_PM_USER_RESOURCE']"
                                            @click="toResource(slotScope.row.id)"
                                            :disabled="slotScope.row.type == configEnum['USER_TYPE_ADMIN']"
                                            type="primary"
                                            size="mini">
                                        资源
                                    </el-button>
                                    <el-button size="mini"
                                               type="danger"
                                               plain
                                               v-if="slotScope.row.is_enable && userPms['ADMIN_PM_USER_EDIT']"
                                               @click="enableItem(slotScope.row)">
                                        禁用
                                    </el-button>
                                    <el-button size="mini"
                                               type="success"
                                               plain
                                               v-if="!slotScope.row.is_enable && userPms['ADMIN_PM_USER_EDIT']"
                                               @click="enableItem(slotScope.row)">
                                        启用
                                    </el-button>
                                </template>
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
    import authRoleApi from 'api/authRoleApi';
    import configStatic from 'config/static';
    import configEnum from 'config/enum';
    import {mapState} from 'vuex';

    export default {
        name: "appUserIndex",
        data() {
            return {
                pageListApi: userApi,
                configStatic: configStatic,
                configEnum: configEnum,
                search: {},
                views: {
                    searchSelects: [
                        {label: '账号', value: 'user_no'},
                        {label: '姓名', value: 'name'},
                    ],
                    roles: []
                },
                userPms: null
            }
        },
        computed: {
            ...mapState(['local'])
        },
        methods: {
            toResource(id) {
                this.$router.push({
                    name: 'appUserResource',
                    query: {
                        user_id: id
                    }
                })
            },
            enableItem(item) {
                var that = this;
                var data = {
                    id: item.id,
                    is_enable: item.is_enable ? 0 : 1
                };
                var tipStr = item.is_enable ? '确认禁用吗？' : '确认启用吗？';
                this.$confirm(tipStr).then(function () {
                    that.pageListApi.update({data: data}).then(function (res) {
                        item.is_enable = res.data.is_enable;
                        that.$message.success('修改成功！');
                    })
                }).catch(function () {
                })
            },
        },
        created: function () {
            var that = this;
            authRoleApi.simple().then(function (res) {
                that.views.roles = res.data.items;
            });
            setTimeout(function () {
                that.userPms = that.$store.state.userPms;
            })
        }
    };
</script>
<style lang="less" scoped>
    .avatar {
        width: 50px;
        height: 50px;
    }
</style>
