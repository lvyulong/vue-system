<template>
    <div class="page">
        <page-header title="demo11列表"></page-header>
        <div class="page-content">
            <div class="clean-float">
                <router-link :to="{name:'appDemo1Demo11New'}">
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
                                    prop="date"
                                    label="日期">
                            </el-table-column>

                            <el-table-column
                                    prop="type"
                                    label="类型">
                                <template slot-scope="slotScope">
                                    {{slotScope.row.type | propMap(views.types,'id','name')}}
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="desc"
                                    label="描述">
                            </el-table-column>

                            <el-table-column prop="is_enable" label="启用状态">
                                <template slot-scope="scope">
                                    <i style="font-size: 1.5rem" :class="scope.row.is_enable | isEnable"></i>
                                </template>
                            </el-table-column>

                            <el-table-column
                                    width="200px"
                                    label="操作">
                                <template slot-scope="slotScope">
                                    <router-link
                                            :to="{
                                                name:'appDemo1Demo11Edit',
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
    import demo1Api from 'api/demo1Api';
    import demo11Api from 'api/demo11Api';
    import axios from 'axios';

    export default {
        name: "appDemo1Demo11Index",
        data() {
            return {
                pageListApi: demo11Api,
                routeName: 'appDemo1Demo11Index',
                views: {
                    searchSelects: [
                        {label: '名称', value: 'name'},
                    ],
                    status: [
                        {id: 1, name: '启用'},
                        {id: 0, name: '禁用'},
                    ],
                    // 其他的下拉选项
                    types:[]
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
                that.views.types = res[0].data.items;
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
