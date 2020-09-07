<template>
    <div class="page" v-if="userPms">
        <div class="page-content">
            <!--按钮操作区-->
            <div class="page-btns">
                <el-button size="mini" type="primary" v-if="userPms['PM_USER_ADD']" @click="addUserDialogOpen">新增</el-button>
            </div>
            <!--搜索区-->
            <div>
                <search-group :option="searchGroupOptions" @submit="search" search-width="300px"></search-group>
            </div>
            <div class="mt10">
                <el-table :data="list"
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
                            prop="name"
                            label="姓名">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="user_id"
                            label="账号">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="type"
                            label="账号类型">
                        <template slot-scope="slotScope">
                            {{slotScope.row.type | propMap(configStatic.userType, 'type', 'name')}}
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
                            width="100"
                            label="创建时间">
                        <template slot-scope="slotScope">
                            {{slotScope.row.created_at}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            align="center"
                            width="100"
                            label="最后登录时间">
                        <template slot-scope="slotScope">
                            {{slotScope.row.login_at}}
                        </template>
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="login_count"
                            label="登录次数">
                    </el-table-column>
                    <el-table-column
                                     width="80"
                                     align="center"
                                     label="启用">
                        <template slot-scope="slotScope">
                            <el-switch
                                    :value="slotScope.row.is_enable"
                                    :disabled="slotScope.row.id == local.user.id"
                                    :active-value=1
                                    :inactive-value=0
                                    @change="switchItem(slotScope.row,'is_enable')">
                            </el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column
                            width="100"
                            align="center"
                            label="操作">
                        <template slot-scope="slotScope">
                            <div v-if="slotScope.row.id !== local.user.id && slotScope.row.type !== configEnum['USER_TYPE_ADMIN']">
                                <el-button
                                        v-if="userPms['PM_USER_EDIT']"
                                        type="text"
                                        @click="handleEdit(slotScope.row)"
                                >
                                    编辑
                                </el-button>
                                <el-button
                                        type="text"
                                        v-if="userPms['PM_USER_EDIT']"
                                        :disabled="slotScope.row.type == configEnum['USER_TYPE_ADMIN']"
                                        @click="goResourcePage(slotScope.row)"
                                >
                                    资源
                                </el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="mt10 clean-float">
                    <pagination class="pull-right" @pageChange="handlePageChange" :meta="meta" v-if="meta"></pagination>
                </div>
            </div>
        </div>
        <!--新增/编辑客户-->
        <el-drawer
                :withHeader="false"
                :visible.sync="isEditing"
                size="60%"
                :before-close="handleEditClose"
                :wrapperClosable="false"
                direction="rtl">
            <client-edit :client="curModel"
                         @editClose="handleEditClose"
                         @editSuccess="handleEditSuccess"
                         v-if="isEditing">
            </client-edit>
        </el-drawer>
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
                    height="500px"
                    @selection-change="handleSelectionChange">
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column
                        prop="user_id"
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
    </div>
</template>
<script>
    import userApi from 'api/userApi';
    import configStatic from 'config/static';
    import configEnum from 'config/enum';
    import {mapState} from 'vuex';
    import clientEdit from './edit';
    import authRoleApi from 'api/authRoleApi';
    import listMixIn from 'mixin/list';

    export default {
        mixins: [listMixIn],
        data() {
            return {
                list: [],
                meta: {},
                listApi: userApi,
                configStatic: configStatic,
                configEnum: configEnum,
                curModel: null,
                isEditing: false,
                clientEditTitle: '',
                addUserDialogVisible: false,
                userNewRole: '',
                newUserRoleIds: [],
                newUsers: [],
                searchName: '',
                bindRoleDialogVisible: false,
                curBindRoleItem: null,
                views: {
                    roles: []
                },
                userPms: null,
                userList: [],
                userSrcList: [],
                searchGroupOptions: [
                    {key: 'name-like', label: '名称', desc: '请输入名称'},
                    {key: 'id', label: '编号', desc: '请输入编号'},
                    {
                        key: 'is_enable',
                        label: '状态',
                        option: [
                            {value: 0, label: '禁用'},
                            {value: 1, label: '启用'},
                        ]
                    },
                ],
                pageParam: {},
                searchParams:{}
            }
        },
        watch:{
            '$route':{
                handler(){
                    this.getList();
                },
                deep:true
            }
        },
        methods: {
            goResourcePage(row){
                this.$router.push({
                    name: 'appUserResource',
                    query: {
                        user_id: row.id
                    }
                });
            },
            // 添加用户时搜索
            searchUsers() {
                let that = this;
                let emptyReg = /\S/;
                if (emptyReg.test(that.searchName)) {
                    that.userList = _.filter(that.userSrcList, function (item) {
                        return item.name.indexOf(that.searchName) >= 0;
                    });
                } else {
                    that.userList = that.userList = JSON.parse(JSON.stringify(that.userSrcList));
                }
            },
            // 关闭modal时清空数据
            onAddModalClose() {
                this.newUserRoleIds = [];
                this.newUsers = [];
                this.searchName = '';
            },
            // 添加用户
            addUser() {
                let that = this;
                if (that.newUsers.length == 0) {
                    that.$notify.error({
                        title: '提示',
                        message: '未选中任何项'
                    });
                    return;
                }
                let data = {
                    users: that.newUsers,
                    role_ids: that.newUserRoleIds
                };
                userApi.createBatch({
                    data: data
                }).then(function (res) {
                    that.$notify.success({
                        title: '提示',
                        message: '添加成功'
                    });
                    that.getList();
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
            enableItem(item) {
                var that = this;
                var data = {
                    id: item.id,
                    is_enable: item.is_enable
                };
                that.listApi.update({data: data}).then(function (res) {
                    item.is_enable = res.data.is_enable;
                    that.$notify.success({
                        title: '提示',
                        message: '修改成功'
                    });
                })
            },
            handlePageChange(pageParam) {
                this.pageParam = Object.assign({},pageParam);
                this.refreshPage();
            },
            search(search) {
                this.searchParams = Object.assign({},search);
                this.refreshPage();
            },
            refreshPage(){
                let params = this.$route.params || {};
                let query = Object.assign({},this.pageParam,this.searchParams);
                this.$router.replace({params, query});
            },
            getList() {
                let that = this;
                let params = Object.assign({}, that.$route.query);
                userApi.query({
                    params: params
                }).then(function (res) {
                    that.list = res.data.items;
                    that.meta = res.data._meta;
                });
            },

            // 处理新增、编辑客户相关逻辑
            handleEdit(model) {
                if (model) {
                    this.curModel = _.extend({}, model);
                }
                this.isEditing = true;
            },
            handleEditClose() {
                // 关闭modal之前触发，关闭动作被暂时拦截，处理完之后需要再次把isEditing设置为false
                this.curModel = null;
                this.isEditing = false;
            },
            handleEditSuccess() {
                this.getList();
                this.isEditing = false;
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
        computed: {
            ...mapState([
                'local'
            ])
        },
        components: {
            clientEdit
        },
        created: function () {
            let that = this;
            setTimeout(function () {
                that.userPms = that.$store.state.userPms;
            });
            authRoleApi.simple().then(function (res) {
                that.views.roles = res.data.items;
            });
            that.getList();
            that.$store.commit('setProp', {
                key: 'nav',
                val: {
                    items: [
                        {title: '用户管理'}
                    ]
                }
            })
        }
    }
</script>
<style scoped>

</style>