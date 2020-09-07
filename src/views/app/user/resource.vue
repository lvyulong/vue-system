<template>
    <div class="page">
        <div class="page-content mb3rem" >
            <div class="clean-float mt20">
                <el-button type="primary" size="mini" @click="selectAll">全选</el-button>
                <el-button type="default" size="mini" @click="cancelAll">全不选</el-button>
            </div>
            <div class="mt20">
                <search-group :option="searchGroupOptions" @submit="search" search-width="300px"></search-group>
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
                            label="编号">
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            label="客户名称">
                    </el-table-column>
                    <el-table-column
                            prop="full_name"
                            label="全称">
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>
<script>
    import userApi from 'api/userApi';
    import companyApi from 'api/companyApi';
    import enumConfig from 'config/enum';
    import msgConfig from 'config/msg';
    import axios from 'axios';
    export default {
        data() {
            return {
                listModel: [],
                listRender: [],
                views: {
                    user: null
                },
                searchGroupOptions: [
                    {key: 'name-like', label: '名称', desc: '请输入名称'},
                    {key: 'id', label: '编号', desc: '请输入编号'},
                ],
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
                        type: enumConfig['RESOURCE_TYPE_CLIENT'],
                        user_id: that.$route.query.user_id,
                        resource: resource
                    }
                }).then(function (res) {
                    that.listRender = myTool.copyArray(that.listModel);
                    that.$notify.success({
                        title: '提示',
                        message: msgConfig['updateOk']
                    });
                })
            },
            search(search) {
                this.searchParams = Object.assign({},search);
                this.refreshPage();
            },
            refreshPage(){
                let params = this.$route.params || {};
                let query = Object.assign({user_id: this.$route.query.user_id}, this.searchParams);
                this.$router.replace({params, query});
            },
            getList() {
                var that = this;
                axios.all([
                    companyApi.query({
                        params: {
                            _page_size: -1,
                            ...this.$route.query,
                        }
                    }),
                    userApi.getResource({
                        params: {
                            type: enumConfig['RESOURCE_TYPE_CLIENT'],
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
                });
            },
        },
        created: function () {
            this.getList();
            this.$store.commit('setProp', {
                key: 'nav',
                val: {
                    items: [
                        {title: '用户管理', name:'appUserIndex'},
                        {title: '资源绑定'}
                    ],
                    back: {
                        show: true,
                    },
                },
            })
        }
    }
</script>