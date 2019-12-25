<template>
    <div class="page">
        <page-header title="用户管理"></page-header>
        <div class="page-content">
            <div class="page-search">
                <div>
                    <el-button type="primary"
                               @click="addUserDialogOpen"
                               size="small">
                        新增
                    </el-button>
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
            <div class="mt1rem">
                <page-list :pageListApi="pageListApi" ref="pageList">
                    <template slot-scope="slotScope">
                        <el-table :data="slotScope.list"
                                  border
                                  size="mini"
                                  style="width: 100%">
                            <el-table-column
                                    width="50"
                                    prop="id"
                                    align="center"
                                    label="ID">
                            </el-table-column>
                            <el-table-column
                                    align="center"
                                    prop="user_no"
                                    label="账号">
                            </el-table-column>
                            <el-table-column
                                    align="center"
                                    prop="name"
                                    label="姓名">
                            </el-table-column>
                            <el-table-column
                                    width="80"
                                    align="center"
                                    label="账号类型">
                                <template slot-scope="slotScope">
                                    {{slotScope.row.type | propMap(configStatic.userType,'type','name')}}
                                </template>
                            </el-table-column>
                            <el-table-column
                                    align="center"
                                    label="角色">
                                <template slot-scope="slotScope">
                                    <!--管理员-->
                                    <div v-if="slotScope.row.type == configEnum['USER_TYPE_ADMIN']">-</div>
                                    <!--实施员-->
                                    <ul v-if="slotScope.row.type == configEnum['USER_TYPE_IMPLEMENTER']">
                                        <li v-for="(item,index) in slotScope.row.role_ids" :key="index">
                                            {{item | propMap(views.roles,'id','name')}}
                                        </li>
                                    </ul>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    align="center"
                                    width="110"
                                    label="创建时间">
                                <template slot-scope="slotScope">
                                    {{slotScope.row.created_at | formatTime()}}
                                </template>
                            </el-table-column>
                            <el-table-column
                                    align="center"
                                    width="110"
                                    label="最后登录时间">
                                <template slot-scope="slotScope">
                                    {{slotScope.row.updated_at | formatTime()}}
                                </template>
                            </el-table-column>
                            <el-table-column
                                    width="80"
                                    align="center"
                                    prop="login_count"
                                    label="登录次数">
                            </el-table-column>
                            <el-table-column prop="is_enable"
                                             width="50"
                                             align="center"
                                             label="启用">
                                <template slot-scope="slotScope">
                                    <i style="font-size: 1.5rem"
                                       :class="slotScope.row.is_enable | isEnable"></i>
                                </template>
                            </el-table-column>
                            <!--v-if="checkPms(['ADMIN_PM_USER_EDIT','ADMIN_PM_USER_RESOURCE'],userPms)"-->
                            <el-table-column
                                    width="200"
                                    align="center"
                                    label="操作">
                                <template slot-scope="slotScope"
                                          v-if="slotScope.row.id !== local.user.id">
                                    <el-button
                                            @click="openBindRoleModal(slotScope.row)"
                                            type="primary"
                                            size="mini">
                                        角色
                                    </el-button>
                                    <el-button
                                            @click="toResource(slotScope.row.id)"
                                            :disabled="slotScope.row.type == configEnum['USER_TYPE_ADMIN']"
                                            type="primary"
                                            size="mini">
                                        资源
                                    </el-button>
                                    <el-button size="mini"
                                               type="danger"
                                               plain
                                               v-if="slotScope.row.is_enable"
                                               @click="enableItem(slotScope.row)">
                                        禁用
                                    </el-button>
                                    <el-button size="mini"
                                               type="success"
                                               plain
                                               v-if="!slotScope.row.is_enable"
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
        <!--添加新用户-->
        <el-dialog title="新增用户"
                   @close="onAddModalClose"
                   width="60%"
                   :visible.sync="addUserDialogVisible">
            <div class="mb10 clean-float">
                <div class="pull-left">
                    <el-select v-model="newUserRoleIds"
                               style="width: 300px"
                               class="ml10"
                               multiple
                               filterable
                               placeholder="请选择需要绑定的角色">
                        <el-option
                                v-for="item in views.roles"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </div>
                <div class="pull-right">
                    <el-input placeholder="请输入姓名搜索"
                              v-model="searchName"
                              style="width: 200px">
                    </el-input>
                    <el-button icon="el-icon-search" @click="searchUsers"></el-button>
                </div>
            </div>
            <el-table
                    ref="multipleTable"
                    :data="userList"
                    tooltip-effect="dark"
                    style="width: 100%"
                    @selection-change="handleSelectionChange">
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column
                        prop="user_no"
                        label="用户编号">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="姓名">
                </el-table-column>
            </el-table>

            <div slot="footer" class="dialog-footer">
                <el-button @click="addUserDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </div>
        </el-dialog>
        <!--绑定角色-->
        <!--用户中心列表-->
        <el-dialog title="绑定角色"
                   @close="onCloseBindRoleModal"
                   width="30%"
                   :visible.sync="bindRoleDialogVisible">
            <div v-if="curBindRoleItem">
                <el-select v-model="curBindRoleItem.role_ids"
                           style="width: 300px"
                           class="ml10"
                           multiple
                           filterable
                           placeholder="请选择需要绑定的角色">
                    <el-option
                            v-for="item in views.roles"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="bindRoleDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="bindRole">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import userApi from 'api/userApi';
    import authRoleApi from 'api/authRoleApi';
    import configStatic from 'config/static';
    import configEnum from 'config/enum';
    import {mapState} from 'vuex';

    export default {
        name: "appAuthUserIndex",
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
                userPms: null,
                userList: [],
                userSrcList:[],
                addUserDialogVisible: false,
                userNewRole:'',
                newUserRoleIds:[],
                newUsers:[],
                searchName:'',
                bindRoleDialogVisible:false,
                curBindRoleItem:null,
            }
        },
        computed: {
            ...mapState(['local'])
        },
        methods: {
            // 绑定角色
            bindRole(){
                let that = this;
                let data = {
                    id:that.curBindRoleItem.id,
                    role_ids:that.curBindRoleItem.role_ids
                };
                userApi.update({
                    data:data
                }).then(function (res) {
                    that.bindRoleDialogVisible = false;
                })
            },
            // 当关闭绑定角色的modal，清空数据
            onCloseBindRoleModal(){
                this.curBindRoleItem = null;
            },
            // 绑定角色
            openBindRoleModal(item){
                this.curBindRoleItem = item;
                this.bindRoleDialogVisible = true;
            },
            // 添加用户时搜索
            searchUsers(){
                let that = this;
                let emptyReg = /\S/;
                if(emptyReg.test(that.searchName)){
                    that.userList = _.filter(that.userSrcList,function (item) {
                        console.log(item.name.indexOf(that.searchName));
                        return item.name.indexOf(that.searchName) >= 0;
                    });
                }else{
                    that.userList = that.userList = JSON.parse(JSON.stringify(that.userSrcList));
                }
            },
            // 关闭modal时清空数据
            onAddModalClose(){
                this.newUserRoleIds = [];
                this.newUsers = [];
                this.searchName = '';
            },
            // 添加用户
            addUser() {
                let that = this;
                if(that.newUsers.length == 0){
                   that.$message.error("未选中任何项");
                   return;
                }
                let data = {
                    users:that.newUsers,
                    role_ids:that.newUserRoleIds
                };
                userApi.createBatch({
                    data:data
                }).then(function (res) {
                    that.$message.success("添加成功");
                    that.$refs['pageList'].getList();
                    that.addUserDialogVisible = false;
                    that.newUserRoleIds = [];
                    that.newUsers = [];

                })
            },
            // 选中用户时
            handleSelectionChange(val) {
                this.newUsers = val;
            },
            // 新增用户modal打开
            addUserDialogOpen() {
                let that = this;
                that.getUsers({}, function () {
                    that.addUserDialogVisible = true;
                });
            },
            toResource(id) {
                this.$router.push({
                    name: 'appAuthResourceClient',
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
            getUsers(params, cb) {
                let that = this;
                params = params ? params : {};
                userApi.getUsers({
                    params: params
                }).then(function (res) {
                    that.userSrcList = res.data.items;
                    that.userList = JSON.parse(JSON.stringify(that.userSrcList));
                    cb && cb();
                })
            }
        },
        created: function () {
            var that = this;
            authRoleApi.simple().then(function (res) {
                that.views.roles = res.data.items;
            });
        }
    };
</script>
<style lang="less" scoped>
    .avatar {
        width: 50px;
        height: 50px;
    }
</style>
