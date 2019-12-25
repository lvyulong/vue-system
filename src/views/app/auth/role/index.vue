<template>
    <div class="page">
        <page-header title="角色管理"></page-header>
        <div class="page-content">
            <div class="clean-float">
                <router-link :to="{name:'appAuthRoleEdit'}">
                    <el-button type="primary" size="small">新增</el-button>
                </router-link>
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
                                    width="50"
                                    align="center"
                                    prop="id"
                                    label="ID">
                            </el-table-column>

                            <el-table-column
                                    align="center"
                                    prop="name"
                                    label="名称">
                            </el-table-column>

                            <el-table-column
                                    prop="desc"
                                    label="描述">
                            </el-table-column>

                            <el-table-column
                                    align="center"
                                    width="150"
                                    label="创建时间">
                                <template slot-scope="slotScope">
                                    {{slotScope.row.created_at | formatTime()}}
                                </template>
                            </el-table-column>
                            <el-table-column align="center"
                                             width="50"
                                             label="启用">
                                <template slot-scope="slotScope">
                                    <i style="font-size: 1.5rem"
                                       :class="slotScope.row.is_enable | isEnable"></i>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    align="center"
                                    fixed="right"
                                    width="180"
                                    label="操作">
                                <template slot-scope="slotScope">
                                    <router-link
                                            :to="{
                                            name:'appAuthRoleEdit',
                                            query:{id:slotScope.row.id},
                                            }">
                                        <el-button
                                                type="primary"
                                                size="mini"
                                                plain>
                                            编辑
                                        </el-button>
                                    </router-link>
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
    </div>
</template>
<script>
    import authRoleApi from 'api/authRoleApi';
    export default {
        name: "appAuthRoleIndex",
        data() {
            return {
                pageListApi: authRoleApi,
                search: {},
                views: {
                    searchSelects: [
                        {label: '名称', value: 'name'},
                    ],
                },
            }
        },
        methods:{
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
    };
</script>
<style lang="less" scoped>

</style>
