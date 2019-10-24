<template>
    <div class="page">
        <page-header back="1" slotNav="1">
            <template slot="nav">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :to="{name:'appUserIndex'}">
                        用户管理
                    </el-breadcrumb-item>
                    <el-breadcrumb-item>
                        绑定资源
                    </el-breadcrumb-item>
                </el-breadcrumb>
            </template>
        </page-header>
        <div class="page-content">
            <div class="clean-float">
                <el-button type="primary" @click="selectAll">全选</el-button>
                <el-button type="default" @click="cancelAll">全不选</el-button>
                <!--输入框搜索-->
                <search-input
                        class="pull-right"
                        :options="views.searchSelects"
                        :label-width="'110px'"
                        style="width: 400px">
                </search-input>
            </div>
            <div class="mt1rem">
                <el-table
                        :data="list"
                        @row-click="onRowClick"
                        style="width: 100%">
                    <el-table-column
                            label=""
                            width="180">
                        <template slot-scope="slotScope">
                            <i class="fa pointer bold font18"
                               :class="{'fa-check-square-o green':slotScope.row.checked,'fa-square-o':!slotScope.row.checked}"
                               aria-hidden="true">
                            </i>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="id"
                            label="ID">
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            label="客户名称">
                    </el-table-column>
                    <el-table-column
                            prop="key"
                            label="关键名称"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="full_name"
                            label="全称">
                    </el-table-column>
                    <el-table-column
                            prop="en_name"
                            label="英文名称">
                    </el-table-column>
                    <el-table-column
                            prop="en_short_name"
                            label="英文简称">
                    </el-table-column>
                </el-table>
            </div>

        </div>
    </div>
</template>
<script>
    import clientApi from 'api/clientApi';
    import userApi from 'api/userApi';
    import enumConfig from 'config/enum';

    export default {
        name: 'appUserResource',
        data() {
            return {
                search: {},
                list: [],
                views: {
                    searchSelects: [
                        {label: '名称', value: 'name'},
                    ],
                },
            }
        },
        methods: {
            selectAll() {
                var that = this;
                that.list.forEach(function (v) {
                    that.$set(v, 'checked', true);
                });
                that.changeData();
            },
            cancelAll() {
                var that = this;
                that.list.forEach(function (v) {
                    that.$set(v, 'checked', false);
                });
                that.changeData();
            },
            onRowClick(row) {
                var that = this;
                that.$set(row, 'checked', row.checked ? false : true);
                that.changeData();
            },
            changeData() {
                var that = this;
                var resourceItems = _.where(that.list, {checked: true});
                var resource = _.pluck(resourceItems, 'id');
                userApi.setResource({
                    data: {
                        type: enumConfig['ADMIN_RESOURCE_CLIENT'],
                        user_id: that.$route.query.user_id,
                        resource: resource
                    }
                }).then(function (res) {
                    that.$message.success("更新成功");
                })
            }
        },
        created: function () {
            var that = this;
            clientApi.query({
                params: {
                    _page_size: -1
                }
            }).then(function (resClient) {
                that.list = resClient.data.items;
                userApi.getResource({
                    params:{
                        type: enumConfig['ADMIN_RESOURCE_CLIENT'],
                        user_id: that.$route.query.user_id,
                    }
                }).then(function (resResource) {
                    var resource = resResource.data.resource;
                    if(Array.isArray(resource)){
                        that.list.forEach(function (v) {
                            if(resource.indexOf(v.id) >= 0){
                                that.$set(v, 'checked', true);
                            }
                        });
                    }

                })
            })
        }

    }
</script>