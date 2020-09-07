<template>
    <div class="page">
        <!--按钮操作区-->
        <div class="page-btns">
            <el-button size="mini" type="primary" @click="toAddDimensionType">新增</el-button>
        </div>
        <!--搜索区-->
        <div>
            <el-input
                    placeholder="IP地址"
                    v-model="searchVal"
                    @keyup.enter.native="onEnterSearch">
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
        </div>
        <div class="mt10">
            <el-table :data="filterList"
                      border
                      ref="elTable"
                      size="mini"
                      style="width: 100%">
                <el-table-column
                        align="center"
                        prop="name"
                        label="IP地址">
                    <template slot-scope="scope">
                        <el-input placeholder="请输入内容" v-show="scope.row.show" v-model="scope.row.name"></el-input>
                        <span v-show="!scope.row.show">{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作"
                                 width="150px"
                                 align="center">
                    <template slot-scope="scope">
                        <el-button @click="editType(scope.row)"
                                   size="mini"
                                   v-show="!scope.row.show"
                                   type="primary"
                                   plain>编辑
                        </el-button>
                        <el-button @click="submitType(scope.row)"
                                   v-show="scope.row.show"
                                   size="mini"
                                   type="primary"
                        >保存
                        </el-button>
                        <el-button @click="deleteType(scope.$index)"
                                   size="mini"
                                   type="danger"
                        >删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
    import configStatic from 'config/static';
    import configEnum from 'config/enum';
    import msgConfig from 'config/msg';
    import {mapState} from 'vuex';

    export default {
        props: [
            'list',
        ],
        data() {
            return {
                meta: {},
                name: '',
                configStatic: configStatic,
                configEnum: configEnum,
                searchGroupOptions: [
                    {key: 'name', label: 'IP', desc: '请输入IP'},
                ],
                selection: [],
                isEditTable: false,
                searchVal: '',
                filterList: [],
            }
        },
        methods: {
            onEnterSearch (e, searchVal) {
                if(this.searchVal) {
                    this.filterList = this.list.filter(array => array.name.match(this.searchVal));
                } else {
                    this.filterList = this.list;
                }
            },
            deleteType(index) {
                this.list.splice(index, 1);
            },
            editType(row) {
                this.$set(row, 'show', true);
            },
            toAddDimensionType() {
                this.filterList.unshift({
                    name: '',
                    show: true,
                });
            },
            submitType(row) {
                if (!row.name) {
                    this.$notify.error({
                        title: '提示',
                        message:msgConfig['formError']
                    });
                    return false;
                }
                this.$set(row, 'show', false);
                this.list = this.filterList;
            },
        },
        computed: {
            ...mapState([
                'local'
            ])
        },
        created: function () {
           this.filterList = this.list;
        }
    }
</script>
<style scoped>

</style>