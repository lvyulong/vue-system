<template>
    <div>
        <div class="page-title">
            <h3>标题</h3>
        </div>
        <div class="mt10">
            <el-button type="primary" size="small" plain @click="showAddUser">新增用户</el-button>
            <search-input
                    :options="searchSelects"
                    :filter="filter"
                    @submit="handleInputSearch"
                    style="width: 400px"
                    class="pull-right">
            </search-input>
        </div>
        <div class="page-content mt2rem">
            <page-list :pageListApi="pageListApi" ref="pageList">
                <template slot-scope="slotScope">
                    <el-table :data="slotScope.list"
                              height="800"
                              border
                              size="mini"
                              style="width: 100%">
                        <el-table-column
                                width="50px"
                                fixed
                                prop="id"
                                label="ID">
                        </el-table-column>

                        <el-table-column
                                prop="name"
                                label="姓名">
                        </el-table-column>
                        <el-table-column
                                prop="code"
                                label="账号">
                        </el-table-column>
                        <el-table-column
                                prop="en_name"
                                label="英文名">
                        </el-table-column>
                        <el-table-column
                                label="状态">
                            <template slot-scope="slotScope">
                                <i style="font-size: 1.5rem" :class="slotScope.row.is_enable | isEnable"></i>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="create_at"
                                label="创建时间">
                        </el-table-column>
                        <el-table-column
                                fixed="right"
                                width="200px"
                                label="操作">
                            <template slot-scope="slotScope">
                                <el-button
                                        v-if="slotScope.row.is_enable"
                                        type="danger"
                                        size="mini"
                                        @click="changeState(slotScope.row)">
                                    禁用
                                </el-button>
                                <el-button
                                        v-if="!slotScope.row.is_enable"
                                        type="primary"
                                        size="mini"
                                        @click="changeState(slotScope.row)">
                                    启用
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </template>
            </page-list>
        </div>
        <!--新增用户-->
        <el-dialog title="选择用户"
                   :visible.sync="addUserVisible">
            <div class="text-right">
                <search-input
                        :options="searchSelects"
                        :filter="userFilter"
                        @submit="handleUsersInputSearch"
                        style="width: 400px">
                </search-input>
            </div>
            <el-table :data="corpUsers"
                      class="mt1rem"
                      height="500"
                      border
                      size="mini"
                      @selection-change="handleSelectionChange"
                      style="width: 100%">
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column
                        prop="id"
                        label="ID">
                </el-table-column>

                <el-table-column
                        prop="name"
                        label="姓名">
                </el-table-column>
                <el-table-column
                        prop="code"
                        label="账号">
                </el-table-column>
                <el-table-column
                        prop="en_name"
                        label="英文名">
                </el-table-column>
                <el-table-column
                        prop="mail"
                        label="邮箱">
                </el-table-column>
                <el-table-column
                        prop="created_at"
                        label="创建时间">
                </el-table-column>
            </el-table>
            <div class="mt1rem">
                <el-pagination
                        layout="prev, pager, next"
                        :page-size="corpUser_meta.perPage"
                        @current-change="changePage"
                        :total="corpUser_meta.totalCount">
                </el-pagination>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeAddUser">取 消</el-button>
                <el-button type="primary" @click="addUser()">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import corpAuthUserApi from 'api/corpAuthUserApi';
    import corpUserApi from 'api/corpUserApi';

    export default {
        name: "appCorpAuthUserIndex",
        data() {
            return {
                pageListApi: corpAuthUserApi,
                searchSelects: [
                    {label: '姓名', value: 'name'},
                    {label: '账号', value: 'code'},
                    {label: '英文名', value: 'en_name'}
                ],
                filter: {},
                userFilter: {},
                addUserVisible: false,
                corpUsers: [],
                corpUser_meta: {},
                selectUsers: []
            }
        },
        methods: {
            // 禁用、启用
            changeState(item) {
                this.$confirm("确认更改状态吗？").then(function () {
                    let data = {
                        id: item.id,
                        is_enable: item.is_enable ? 0 : 1
                    };
                    corpAuthUserApi.update({data: data}).then(function (res) {
                        item.is_enable = res.data.is_enable
                    })
                });
            },
            // 处理inputSearch组件点击搜索按钮
            handleInputSearch(val) {
                this.filter = Object.assign({}, this.filter, val);
            },
            // ---------------------------------弹窗内的方法---------------------------------------
            // 获取可选用户
            getUsers(search) {
                var that = this;
                var params = Object.assign({}, search);
                params = myTool.clearInvalidProp(params);
                corpUserApi.query({params: params}).then(function (res) {
                    that.corpUsers = res.data.items;
                    that.corpUser_meta = res.data._meta;
                })
            },
            // 打开新增用户
            showAddUser() {
                this.addUserVisible = true;
                this.getUsers();
            },
            // 新增用户模态框翻页
            changePage(val) {
                let params = Object.assign({}, this.userFilter, {_page: val});
                this.getUsers(params);
            },
            addUser() {
                var that = this;
                if (this.selectUsers.length == 0) {
                    this.$message.error("未选择任何用户");
                    return;
                }
                var ids = _.pluck(this.selectUsers, 'id');
                let data = {
                    id: ids
                };
                corpAuthUserApi.save({data: data}).then(function (res) {
                    that.$refs.pageList.getList();
                    that.closeAddUser();
                })
            },
            closeAddUser() {
                // 关闭弹出框，清空数据
                this.addUserVisible = false;
                this.corpUsers = [];
                this.corpUser_meta = {};
                this.selectUsers = [];
                this.userFilter = {};
            },

            // 选择表格数据
            handleSelectionChange(val) {
                this.selectUsers = val;
            },
            handleUsersInputSearch(val) {
                this.userFilter = Object.assign({}, val);
                this.getUsers(this.userFilter);
            }

        },
        mounted: function () {
            let search = Object.assign({}, this.$route.query);
            this.filter = myTool.trimObj(search, ['name', 'code', 'en_name']);
        },
        watch: {
            // 监听filter，刷新页面
            filter: {
                handler: function (n, o) {
                    if (n && n != o) {
                        let params = Object.assign({}, this.$route.query, this.filter);
                        // 清除无效属性
                        params = myTool.clearInvalidProp(params);
                        this.$router.push({name: 'appCorpAuthUserIndex', query: params});
                    }
                },
                deep: true
            }
        }
    };
</script>
<style lang="less" scoped>
    .avatar {
        width: 50px;
        height: 50px;
    }
</style>
