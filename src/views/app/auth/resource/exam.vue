<template>
    <div class="page">
        <page-header back="1"
                     slotNav="1">
            <template slot="nav">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :to="{name:'appAuthUserIndex'}">
                        用户管理
                    </el-breadcrumb-item>
                    <el-breadcrumb-item>
                        绑定问卷
                        <span v-if="views.user">( {{views.user.name}} )</span>
                    </el-breadcrumb-item>
                </el-breadcrumb>
            </template>
        </page-header>
        <div class="page-content">
            <div class="clean-float">
                <el-button type="primary" @click="selectAll">全选</el-button>
                <el-button type="default" @click="cancelAll">全不选</el-button>
            </div>
            <div class="mt1rem">
                <el-table
                        :data="listRender"
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
                            label="问卷名称">
                    </el-table-column>
                </el-table>
            </div>

        </div>
    </div>
</template>
<script>
    import clientApi from 'api/clientApi';
    import clientExamApi from 'api/clientExamApi';
    import userApi from 'api/userApi';
    import enumConfig from 'config/enum';
    import axios from 'axios';
    export default {
        name: 'appAuthResourceExam',
        data() {
            return {
                search: {},
                listModel: [],
                listRender: [],
                views: {
                    user: null
                },
            }
        },
        methods: {
            selectAll() {
                var that = this;
                that.listModel.forEach(function (v) {
                    that.$set(v, 'checked', true);
                });
                that.changeData();
            },
            cancelAll() {
                var that = this;
                that.listModel.forEach(function (v) {
                    that.$set(v, 'checked', false);
                });
                that.changeData();
            },
            onRowClick(row) {
                var that = this;
                var itemModel = _.findWhere(that.listModel, {id: row.id});
                that.$set(itemModel, 'checked', itemModel.checked ? false : true);
                that.changeData();
            },
            changeData() {
                var that = this;
                var resourceItems = _.where(that.listModel, {checked: true});
                var resource = _.pluck(resourceItems, 'id');
                userApi.setResource({
                    data: {
                        type: enumConfig['RESOURCE_TYPE_EXAM'],
                        user_id: that.$route.query.user_id,
                        resource: resource
                    }
                }).then(function () {
                    that.listRender = myTool.copyArray(that.listModel);
                    that.$message.success("更新成功");
                })
            }
        },
        created: function () {
            var that = this;
            axios.all([
                clientExamApi.query({
                    params: {
                        _page_size: -1,
                        client_id:that.$route.query.client_id
                    }
                }),
                userApi.getResource({
                    params: {
                        type: enumConfig['RESOURCE_TYPE_EXAM'],
                        user_id: that.$route.query.user_id,
                    }
                }),
                userApi.get({
                    params:{
                        id:that.$route.query.user_id
                    }
                })
            ]).then(function (res) {
                that.views.user = res[2].data;
                that.listModel = res[0].data.items;
                var resource = res[1].data.resource;
                if (Array.isArray(resource)) {
                    that.listModel.forEach(function (v) {
                        if (resource.indexOf(v.id) >= 0) {
                            that.$set(v, 'checked', true);
                        }
                    });
                }
                that.listRender = myTool.copyArray(that.listModel);
            })
        }
    }
</script>