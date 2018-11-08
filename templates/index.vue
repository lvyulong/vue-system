<!--
检查项：
一、page-header
    1、是否显示标题
        title="1"
    2、是否显示面包屑：
        a.使用:nav="nav"，可以在data中定义nav数组，显示普通格式的面包屑
        b.使用slotNav="1",并在template元素中指定slot="nav",则可以自定义显示的面包屑内容
    3、是否显示返回按钮
        back="1"

二、筛选
    1、准备选项数据，放在views对象中；
    2、初始化filter对象，并且定义validFilters数组
    3、监听url参数变化，实时渲染到filter中；需立即执行一次
三、表格
    1、定义表格的pageListApi;
    2、定义本页面的路由名称routeName；
    3、定义表格列内容
-->
<template>
    <div class="page">
        <!--一、page-header部分-->
        <!--1、显示标题-->
        <page-header title="页面标题"></page-header>
        <!--2、显示面包屑-->
        <!--a.在data中定义nav数组-->
        <!--<page-header back="1" :nav="nav"></page-header>-->
        <!--b.使用slot，自定义面包屑-->
        <!--<page-header back="1" slotNav="1">-->
            <!--<template slot="nav">-->
                <!--<el-breadcrumb separator-class="el-icon-arrow-right">-->
                    <!--<el-breadcrumb-item-->
                            <!--:to="{-->
                            <!--name:'theLastRouteName',-->
                            <!--query:{last_id:$route.query.last_id}-->
                            <!--}">-->
                        <!--上一层页面-->
                    <!--</el-breadcrumb-item>-->
                    <!--<el-breadcrumb-item>-->
                        <!--当前页面-->
                        <!--<span v-if="views.something">（{{views.something}}）</span>-->
                    <!--</el-breadcrumb-item>-->
                <!--</el-breadcrumb>-->
            <!--</template>-->
        <!--</page-header>-->
        <div class="page-content">
            <!--二、筛选部分-->
            <div>
                <router-link :to="{name:'toNewPage',query:{current_id:$route.query.current_id}}">
                    <el-button type="primary" plain>创建新项</el-button>
                </router-link>
                <!--输入框搜索-->
                <search-input
                        :options="views.searchSelects"
                        :label-width="'110px'"
                        style="width: 400px"
                        class="pull-right">
                </search-input>
                <!--下拉筛选-->
                <el-select
                        value-key="id"
                        class="pull-right mr1rem"
                        v-model="filter.is_enable"
                        filterable
                        clearable
                        placeholder="请选择状态">
                    <el-option
                            v-for="item in views.status"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id+''">
                    </el-option>
                </el-select>
            </div>
            <!--清除浮动-->
            <div class="clear-both"></div>
            <!--三、表格部分-->
            <div class="mt1rem">
                <page-list :pageListApi="pageListApi" ref="pageList">
                    <template slot-scope="slotScope">
                        <el-table :data="slotScope.list"
                                  height="820"
                                  border
                                  size="mini"
                                  style="width: 100%">
                            <el-table-column
                                    width="50"
                                    prop="id"
                                    label="ID">
                            </el-table-column>

                            <el-table-column
                                    prop="name"
                                    label="名称">
                            </el-table-column>

                            <el-table-column
                                    label="自定义列">
                                <!--自定义template-->
                                <template slot-scope="slotScope">
                                    {{slotScope.row}}
                                </template>
                            </el-table-column>

                            <el-table-column prop="is_enable" label="启用状态">
                                <template slot-scope="scope">
                                    <i style="font-size: 1.5rem" :class="scope.row.is_enable | isEnable"></i>
                                </template>
                            </el-table-column>

                            <el-table-column
                                    width="350px"
                                    label="操作">
                                <template slot-scope="slotScope">
                                    <router-link
                                            :to="{
                                                name:'currentRouteEdit',
                                                params:{id:slotScope.row.id},
                                                query:{

                                                }}">
                                        <el-button type="primary" size="mini" plain>编辑</el-button>
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
    import demo1Api from 'api/demo1Api';
    import axios from 'axios';

    export default {
        name: "appTrainAssessIndex",
        data() {
            return {
                // 页面列表的api
                pageListApi: demoApi,
                // page-header中使用的nav数组
                // nav:[
                //     {to:{name:'routerName',params:{},query:{}},label:'问卷管理'},
                //     {label:'答卷管理'},
                // ],
                // 本组件的路由名称
                routeName: 'currentRouteName',
                // 视图中需要的数据、选项等
                views: {
                    searchSelects: [
                        {label: '姓名', value: 'name'},
                    ],
                    status: [
                        {id: 1, name: '启用'},
                        {id: 0, name: '禁用'},
                    ],
                    // something、demo1Options只是为了做演示，用时删除
                    something: '',
                    demo1Options:[],
                },
                // 筛选器参数初始化
                filter: {
                    name: '',
                    is_enable: '',
                },
                // 有效的filters，为了从url中获取filter的值，因为url中的参数并不都是filter可用的
                validFilters: ['name', 'is_enable']
            }
        },
        methods: {
            // 表格中的单项禁用/启用
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
                })
            },

            // 额外的一些方法
            // ....
        },
        created: function () {
            var that = this;
            axios.all([
                // 从接口中获取各种选项
                demo1Api.simple(),
            ]).then(function (res) {
                that.views.demo1Options = res[0].data.items;
            });
        },
        watch: {
            // 监听filter，刷新页面
            filter: {
                handler: function (n, o) {
                    if (n) {
                        let params = Object.assign({}, this.$route.query, n);
                        // 清除无效属性
                        params = myTool.clearInvalidProp(params);
                        this.$router.push({name: this.routeName, query: params});
                    }
                },
                deep: true
            },
            '$route.query': {
                // 监听地址栏参数变化，及时更新到页面的筛选器中
                handler: function (n, o) {
                    this.filter = myTool.trimObj(n, this.validFilters);
                },
                // 侦听开始之后被立即调用
                immediate: true
            }
        },
    };
</script>
<style lang="less" scoped>

</style>
