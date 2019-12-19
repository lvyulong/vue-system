<template>
    <div class="page">
        <page-header title="客户管理"></page-header>
        <div class="page-content">
            <div class="page-search">
                <!--左侧-->
                <div>
                    <router-link :to="{name:'appClientNew'}">
                        <el-button type="primary" size="small">
                            新增
                        </el-button>
                    </router-link>
                </div>
                <!--右侧-->
                <div>
                    <!--输入框搜索-->
                    <search-input
                            :options="views.searchSelects"
                            :label-width="'110px'"
                            style="width: 400px">
                    </search-input>
                </div>
            </div>
            <!--清除浮动-->
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
                                    width="100"
                                    prop="key"
                                    label="KEY">
                            </el-table-column>
                            <el-table-column
                                    align="center"
                                    prop="token"
                                    label="TOKEN">
                            </el-table-column>
                            <el-table-column
                                    align="center"
                                    prop="name"
                                    label="名称">
                            </el-table-column>
                            <el-table-column
                                    align="center"
                                    prop="full_name"
                                    label="全称">
                            </el-table-column>
                            <el-table-column
                                    align="center"
                                    prop="en_name"
                                    label="英文名">
                            </el-table-column>
                            <el-table-column
                                    align="center"
                                    width="100"
                                    prop="created_at"
                                    label="创建时间">
                            </el-table-column>
                            <el-table-column
                                    align="center"
                                    width="100"
                                    prop="created_by_name"
                                    label="创建人">
                            </el-table-column>
                            <el-table-column prop="is_enable"
                                             width="100"
                                             align="center"
                                             label="启用状态">
                                <template slot-scope="slotScope">
                                    <i style="font-size: 1.5rem"
                                       :class="slotScope.row.is_enable | isEnable"></i>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    width="150"
                                    align="center"
                                    label="管理">
                                <template slot-scope="slotScope">
                                    <ul>
                                        <li>
                                            <router-link
                                                    :to="{
                                            name:'appClientExamIndex',
                                            query:{client_id:slotScope.row.id},
                                            }">
                                                <el-button
                                                        type="primary"
                                                        size="mini">
                                                    问卷
                                                </el-button>
                                            </router-link>
                                            <router-link
                                                    :to="{
                                            name:'appClientCustomStyle',
                                            query:{client_id:slotScope.row.id},
                                            }">
                                                <el-button
                                                        type="primary"
                                                        size="mini">
                                                    定制
                                                </el-button>
                                            </router-link>
                                        </li>
                                        <li class="mt5">
                                            <router-link
                                                    :to="{
                                            name:'appClientConfig',
                                            query:{client_id:slotScope.row.id},
                                            }">
                                                <el-button
                                                        type="primary"
                                                        size="mini">
                                                    配置
                                                </el-button>
                                            </router-link>
                                            <router-link
                                                    :to="{
                                            name:'appClientConfig',
                                            query:{client_id:slotScope.row.id},
                                            }">
                                                <el-button
                                                        type="primary"
                                                        size="mini">
                                                    汇总
                                                </el-button>
                                            </router-link>
                                        </li>
                                    </ul>
                                </template>
                            </el-table-column>
                            <!--v-if="checkPms(['ADMIN_PM_USER_EDIT','ADMIN_PM_USER_RESOURCE'],userPms)"-->
                            <el-table-column
                                    width="80"
                                    align="center"
                                    label="操作">
                                <template slot-scope="slotScope">
                                    <ul>
                                        <li>
                                            <router-link
                                                    :to="{
                                            name:'appClientEdit',
                                            params:{id:slotScope.row.id},
                                            }">
                                                <el-button
                                                        type="primary"
                                                        size="mini"
                                                        plain>
                                                    编辑
                                                </el-button>
                                            </router-link>
                                        </li>
                                        <li class="mt5">
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
                                        </li>
                                    </ul>


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
    import clientApi from 'api/clientApi';
    export default {
        name: "appClientIndex",
        data() {
            return {
                pageListApi: clientApi,
                search: {},
                views: {
                    searchSelects: [
                        {label: '名称', value: 'like_name'},
                    ],
                    user:[]
                },
                userPms:null
            }
        },
        methods: {
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
            // setTimeout(function () {
            //     that.userPms = that.$store.state.userPms;
            // })
        }
    };
</script>
<style lang="less" scoped>

</style>
