<template>
    <div class="page">
        <!--标题-->
        <page-header title="Demo"></page-header>
        <!--面包屑-->
        <!--<page-header :back="1"-->
        <!--:slotNav="1"-->
        <!--:backRoute="{name:'appDemoPIndex'}">-->
        <!--<template slot="nav">-->
        <!--<el-breadcrumb separator-class="el-icon-arrow-right">-->
        <!--<el-breadcrumb-item :to="{name:'appDemoPIndex'}">-->
        <!--Demo的老父亲-->
        <!--</el-breadcrumb-item>-->
        <!--<el-breadcrumb-item>-->
        <!--Demo管理-->
        <!--</el-breadcrumb-item>-->
        <!--</el-breadcrumb>-->
        <!--</template>-->
        <!--</page-header>-->

        <div class="page-content">
            <!--清除浮动-->
            <div class="clean-float">
                <router-link
                        :to="{
                        name:'appDemoNew',
                        query:{
                            demo_id:$route.query.demo_id,
                            demo_name:$route.query.demo_name
                        }}">
                    <el-button type="primary">新增Demo</el-button>
                </router-link>

                <!--输入框搜索-->
                <search-input
                        :options="views.searchSelects"
                        :label-width="'110px'"
                        style="width: 400px"
                        class="pull-right">
                </search-input>

            </div>
            <div class="mt1rem">
                <page-list :pageListApi="pageListApi" :ignore="[]" ref="pageList">
                    <template slot-scope="slotScope">
                        <el-table :data="slotScope.list"
                                  height="820"
                                  border
                                  size="mini"
                                  style="width: 100%">
                            <el-table-column
                                    prop="id"
                                    width="50"
                                    label="ID">
                            </el-table-column>
                            <el-table-column
                                    prop="name"
                                    label="名称">
                            </el-table-column>

                            <el-table-column
                                    fixed="right"
                                    width="250"
                                    label="操作">
                                <template slot-scope="slotScope">
                                    <router-link
                                            :to="{
                                                name:'appProjectTextEdit',
                                                params:{id:slotScope.row.id},
                                                query:{
                                                    project_id:$route.query.project_id,
                                                    project_name:$route.query.project_name
                                                }}">
                                        <el-button
                                                type="primary"
                                                plain
                                                size="mini">
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
    import demoApi from 'api/demoApi';
    export default {
        name: "appDemoIndex",
        data() {
            return {
                pageListApi: demoApi,
                views: {
                    searchSelects: [
                        {label: '名称', value: 'name'},
                    ]
                },
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

        }
    };
</script>
<style lang="less" scoped>

</style>