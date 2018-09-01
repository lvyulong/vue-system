<template>
    <div>
        <!--标题-->
        <div class="page-title">
            <h3>此处为标题</h3>
        </div>


        <!--功能按钮、筛选-->
        <div class="mt10">
            <el-button
                    type="primary"
                    size="small"
                    plain
                    @click="handle1">
                按钮一
            </el-button>

            <!--输入框搜索-->
            <search-input
                    :options="views.searchSelects"
                    :filter="filter"
                    @submit="handleInputSearch"
                    style="width: 400px"
                    class="pull-right">
            </search-input>
        </div>

        <!--列表-->
        <div class="page-content mt2rem">
            <page-list :pageListApi="pageApi" ref="pageList">
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


    </div>
</template>

<script>
    import demoApi from 'api/demoApi';

    export default {
        name: "appDemoIndex",
        data() {
            return {
                routeName: 'appDemoIndex',
                // 列表api
                pageApi: demoApi,
                // 视图中需要的数据/选项
                views: {
                    searchSelects: [
                        {label: '姓名', value: 'name'},
                    ],
                },
                // 筛选条件
                filter: {},
            }
        },
        methods: {

            // -----------------------------筛选-----------------------------
            handleInputSearch(val) {
                // 处理inputSearch组件点击搜索按钮
                this.filter = Object.assign({}, this.$route.query, this.filter, {_page: 1}, val);
            },


            // ----------------------------功能按钮--------------------------
            handle1() {
                console.log("功能按钮");

            },

            // --------------------------表格中按钮功能-----------------------
            changeState(item) {
                // 禁用、启用
                this.$confirm("确认更改状态吗？").then(function () {
                    let data = {
                        id: item.id,
                        is_enable: item.is_enable ? 0 : 1
                    };
                    this.pageApi.update({data: data}).then(function (res) {
                        item.is_enable = res.data.is_enable
                    })
                });
            },
        },
        mounted: function () {
            // dom加载之后，从url中获取参数，渲染到filter
            this.filter = myTool.trimObj(this.$route.query, ['name']);
        },
        watch: {
            // 监听filter，刷新页面
            filter: {
                handler: function (n, o) {
                    if (n && n != o) {
                        let params = Object.assign({}, this.$route.query, {_page: 1}, this.filter);
                        // 清除无效属性
                        params = myTool.clearInvalidProp(params);
                        this.$router.push({name: this.routeName, query: params});
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
