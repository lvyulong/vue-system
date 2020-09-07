<template>
    <div>
        <div>
            <!--按钮操作区-->
            <div class="page-btns">
                <el-button size="mini"
                           type="primary"
                           v-if="!disableOpt['new'] && formFields"
                           @click="handleEdit()">
                    新增
                </el-button>
                <slot name="pageBtns"></slot>
            </div>
            <!--搜索区-->
            <search-group search-width="300px" :option="searchOpt" @submit="searchSubmit" v-if="searchOpt">
                <div class="pl5">
                    <el-tooltip effect="dark" content="自定义导出" placement="top-start" v-if="!disableOpt['exportData']">
                        <el-button type="default"
                                   @click="handleCustomExport"
                                   size="small"
                                   icon="el-icon-download">
                        </el-button>
                    </el-tooltip>
                    <el-tooltip effect="dark" content="自定义列表项" placement="top-start" v-if="!disableOpt['customCol']">
                        <el-button type="default"
                                   size="small"
                                   @click="customColShow = true"
                                   icon="el-icon-setting"></el-button>
                    </el-tooltip>
                    <slot name="pageSearch"></slot>
                </div>
            </search-group>
            <!--显示已选中项-->
            <div>
                <checked-area :checkedItems="checkedItems"
                              :list="list"
                              :fields="checkedAreaFields"
                              @clear="clearSelection"
                              @selectAll="selectAll"
                              v-if="selectOpt"/>
            </div>
            <!--表格-->
            <div class="mt10">
                <el-table :data="list"
                          ref="table"
                          :border="border"
                          @select="select"
                          @select-all="select"
                          size="mini"
                          :row-key="getRowKey"
                          :default-sort = "defaultSort"
                          @sort-change="sort"
                          sortable="custom"
                          style="width: 100%">
                    <el-table-column type="expand" v-if="useExpand">
                        <template slot-scope="slotScope">
                            <!--自定义展开行的内容-->
                            <slot v-if="customExpand" name="expand" :row="slotScope.row"
                                  :expandCols="expandCols"></slot>
                            <!--使用默认的样式展开行-->
                            <div v-else>
                                <div class="expand-item"
                                     v-for="expandItem in expandCols"
                                     :key="expandItem.key">
                                    <div class="expand-label">{{expandItem.label}}：</div>
                                    <div>{{ slotScope.row[expandItem.key] || '-' }}</div>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <!--选择框-->
                    <el-table-column
                            v-if="selectOpt"
                            :reserve-selection="true"
                            type="selection"
                            align="center"
                            width="50">
                    </el-table-column>
                    <!--自定义列-->
                    <el-table-column
                            v-for="col in colData"
                            :key="col.label"
                            :fixed="col.fixed"
                            v-if="col.check"
                            :prop="col.key"
                            :sortable="col.sortable"
                            :width="col.width"
                            :align="col.align || 'center'"
                            :label="col.label">
                        <template slot-scope="slotScope">
                           <div style="word-break: break-word">
                               <slot name="customCols"
                                     :col="col"
                                     :list="list"
                                     :row="slotScope.row"></slot>
                           </div>
                        </template>
                    </el-table-column>
                    <!--操作列-->
                    <el-table-column
                            fixed="right"
                            :width="operateWidth"
                            align="center"
                            label="操作">
                        <template slot-scope="slotScope">
                            <el-button
                                    v-if="!disableOpt['edit'] && formFields"
                                    type="text"
                                    @click="handleEdit(slotScope.row)">
                                编辑
                            </el-button>
                            <slot name="operateCol"
                                  :row="slotScope.row">
                            </slot>
                        </template>
                    </el-table-column>
                </el-table>
                <!--分页器-->
                <div class="mt10 clean-float" v-if="!disableOpt['pagination']">
                    <pagination class="pull-right" @pageChange="handlePageChange" :meta="meta" v-if="meta"></pagination>
                </div>
            </div>
        </div>
        <!--自定义列弹窗-->
        <custom-col v-if="customColShow"
                    :col-data="colData"
                    @submit="onCustomColConfirm"
                    @cancel="onCustomColCancel">
        </custom-col>

        <!--新增/编辑-->
        <el-drawer
                v-if="formFields"
                :withHeader="false"
                :visible.sync="isEditing"
                size="60%"
                :wrapperClosable="false"
                direction="rtl">
            <div class="title">
                <i class="el-icon-back font20 bold pointer" @click="handleEditClose"></i>
                <span class="ml5">{{editTitle}}</span>
            </div>
            <el-form :model="curModel"
                     :status-icon="true"
                     ref="form"
                     :rules="rules"
                     label-width="150px"
                     style="width: 80%">
                <form-field :model="curModel" :fields="fields" v-if="curModel&&fields" :cos="cos"></form-field>
                <el-form-item>
                    <el-button type="primary"
                               size="mini"
                               @click="handleEditConfirm()">
                        确定
                    </el-button>
                </el-form-item>
            </el-form>
        </el-drawer>
    </div>
</template>
<script>
    /**
     一、功能模块：
     1、按钮区：新增；
     2、搜索区：自定义列、导出数据；
     3、列表区：已选择项、列表、翻页器；
     二、可选择项
     disables：new(新增)、customCol(自定义列)、exportData(导出数据)
     三、插槽
     pageBtns
     cols
     */
    import msgConfig from 'config/msg';
    export default {
        name: "pageMgr",
        props: {
            cos: {
                type: Object
            },
            /**
             *curd操作时的后端控制器
             */
            listApi: {
                type: Object,
                require: true
            },
            /**
             * 定义listApi方法( query / update / save )的别名
             */
            action: {
                type: Object
            },
            reverse: {
                type: Boolean
            },
            /**
             * 禁用某些功能( new / edit / exportData /customCol )
             */
            disables: {
                type: Array
            },
            /**
             * 可用来搜索的字段，[key,label,desc,multi,readonly,width,option[value,label]]
             */
            searchOpt: {
                type: Array
            },
            /**
             * 要展示的列，[label,key,fixed,check,width,align,dynamic,isArray,subKey,expand,map[list,src,target]]
             */
            cols: {
                type: Array
            },
            /**
             * 新增或者编辑时需要的字段，[label,key,type,required,detail,desc,editReadonly]
             */
            formFields: {
                type: Array
            },
            /**
             * 新增或者编辑时需要从query中取的查询字段
             */
            queryFields: {
                type: Array
            },
            /**
             * 新增或者编辑时额外的参数，写在body中
             */
            extraParams: {
                type: Object
            },
            /**
             * 使用展开行
             */
            useExpand: {
                type: Boolean
            },
            /**
             * 自定义展开行，需要前置useExpand开启
             */
            customExpand: {
                type: Boolean
            },
            /**
             * 使用选择框[ids[],isAll]
             */
            selectOpt: {
                type: Object
            },
            /**
             * 表格使用border
             */
            border: {
                type: Boolean
            },
            /**
             * 操作列宽度
             */
            operateWidth: {
                type: Number,
                default: 200
            },
            /**
             * 被选中的项展示区要展示的字段
             */
            checkedAreaFields: {
                type: Array,
                default() {
                    return ['name'];
                }
            },
            expandField: {
                type: Array
            }
        },
        data() {
            return {
                disableOpt: {},
                isEditing: false,
                curModel: null,
                list: [],
                meta: null,
                customColShow: false,
                editTitle: '',
                fields: null,
                colData: [],
                checkedItems: [],
                sortMap: {
                    descending: 'desc',
                    ascending: 'asc',
                    desc: 'descending',
                    asc: 'ascending'
                },
                pageParam:{}, // 翻页的相关查询参数
                orderBy:'',
                defaultSort:{},
            }
        },
        computed: {
            rules() {
                let rules = [];
                if (this.formFields) {
                    rules = myTool.rule(this.formFields);
                }
                return rules;
            },
            expandCols() {
                let cols = _.where(this.cols, {expand: true});
                cols = myTool.trimArray(cols, {label: 'label', key: 'key'});
                return cols;
            }
        },
        methods: {
            sort(column) {
                let item = _.findWhere(this.colData, {key: column.prop});
                let keyArray = item.sortable.split('.');
                let key = keyArray.join('-');
                switch (column.order) {
                    case 'ascending':
                        key = `${key}-asc`;
                        break;
                    case 'descending':
                        key = `${key}-desc`;
                        break;
                    default:
                        key = '';
                }
                let query = Object.assign({},this.$route.query,{orderBy:key});
                query = myTool.clearInvalidProp(query);
                delete query._page_size;
                delete query._page;
                this.refreshPage(query);
            },
            searchSubmit(search) {
                search = search || {};
                let newSearch = {};
                this.searchOpt.forEach(item => {
                   if(search.hasOwnProperty(item.key)){
                       newSearch[item.key] = search[item.key];
                   }else{
                       newSearch[item.key] = '';
                   }
                });
                let query = Object.assign({},this.$route.query,newSearch);
                // 清除无效的字段
                query = myTool.clearInvalidProp(query);
                // 重置排序和翻页
                delete query._page;
                delete query._page_size;
                this.refreshPage(query);
            },
            handlePageChange(pageParam) {
                let query = Object.assign({},this.$route.query,pageParam);

                this.refreshPage(query);
            },
            // 用传入的参数重新查询该页面
            refreshPage(query){
                let isSame = myTool.objIsSame(query, this.$route.query);
                if (!isSame) {
                    let name = this.$route.name;
                    let params = this.$route.params || {};
                    this.$router.replace({name:name,params:params,query:query});
                }
            },
            getList() {
                let loading = vm.$loading();
                let params = Object.assign({}, this.$route.query);
                // 指定后端需返回的扩展字段
                if (this.expandField && Array.isArray(this.expandField) && this.expandField.length > 0) {
                    params.expand = this.expandField.join(',');
                }
                let action = 'query';
                if (this.action && this.action.query) {
                    action = this.action.query;
                }
                this.listApi[action]({
                    params: params,
                }).then(res => {
                    let list = res.data.items;
                    if (this.reverse) {
                        list = list.reverse();
                    }
                    this.list = list;
                    if (res.data._meta) {
                        this.meta = res.data._meta;
                    }
                    loading.close();
                });
            },
            // 自定义导出
            handleCustomExport() {
                this.$notify.error({
                    title: '提示',
                    message:msgConfig.notOpen
                });
            },
            select(selection) {
                this.checkedItems = selection;
                // id的数组
                let prop = 'id';
                if (this.selectOpt.prop) {
                    prop = this.selectOpt.prop;
                }
                let checkedIds = _.pluck(selection, prop);
                this.$emit('update:selectOpt', {ids: checkedIds, isAll: false});
            },

            selectAll() {
                this.$refs['table'].clearSelection();
                // 选中当前页所有的项
                this.list.forEach(row => {
                    this.$refs['table'].toggleRowSelection(row, true);
                });
                this.checkedItems = JSON.parse(JSON.stringify(this.list));
                let prop = 'id';
                if (this.selectOpt.prop) {
                    prop = this.selectOpt.prop;
                }
                let checkedIds = _.pluck(this.checkedItems, prop);
                this.$emit('update:selectOpt', {ids: checkedIds, isAll: true});
            },
            clearSelection() {
                // 清空选项
                this.$refs['table'].clearSelection();
                this.checkedItems = [];
                this.$emit('update:selectOpt', {ids: [], isAll: false});
            },
            getRowKey(row) {
                return row.id
            },
            // 弹出编辑窗口
            handleEdit(model) {
                if (model) {
                    let fields = myTool.copyArray(this.formFields);
                    fields.forEach((curVal, index) => {
                        if (curVal.editReadonly) {
                            fields[index].readonly = true;
                            delete fields[index].editReadonly;
                        }
                    });
                    this.fields = fields;
                    this.editType = 'edit';
                    this.curModel = Object.assign({}, model);
                    if (model.name) {
                        this.editTitle = `编辑 - ${model.name}`;
                    } else {
                        this.editTitle = '编辑';
                    }
                } else {
                    this.fields = myTool.copyArray(this.formFields);
                    this.editType = 'new';
                    let defaultFields = _.filter(this.formFields,item => {
                        return item.hasOwnProperty('default');
                    });
                    this.curModel = {};
                    if(defaultFields && defaultFields.length > 0){
                        defaultFields.forEach(field => {
                           this.curModel[field.key] = field.default;
                       })
                    }
                    this.editTitle = `新增`;
                }
                this.isEditing = true;
            },
            // 关闭编辑窗口
            handleEditClose() {
                this.isEditing = false;
                this.curModel = null;
            },
            // 编辑窗口确认提交
            handleEditConfirm() {
                this.$refs['form'].validate(valid => {
                    if (valid) {
                        let data = Object.assign({}, this.curModel);
                        let action = '';
                        let sucMsg = '';
                        if (this.editType == 'edit') {
                            // 编辑
                            if (this.action && this.action.update) {
                                // 自定义方法名
                                action = this.action.update;
                            } else {
                                // 默认的update
                                action = 'update';
                            }
                            sucMsg = msgConfig['updateOk'];
                        } else {
                            // 新增
                            if (this.action && this.action.save) {
                                // 自定义方法名
                                action = this.action.save;
                            } else {
                                // 默认的新增
                                action = 'save';
                            }
                            sucMsg = msgConfig['createOk'];
                        }

                        let params = {};
                        // 如果需要额外的查询参数，则从路由的query中取
                        if (this.queryFields && Array.isArray(this.queryFields) && this.queryFields.length > 0) {
                            let query = this.$route.query;
                            params = myTool.trimObj(query, this.queryFields);
                        };
                        if (this.expandField && Array.isArray(this.expandField) && this.expandField.length > 0) {
                            params.expand = this.expandField.join(',');
                        };
                        if (this.extraParams) {
                            data = Object.assign({}, data, this.extraParams);
                        }
                        this.listApi[action]({
                            data: data,
                            params
                        }).then(res => {
                            this.$notify.success({
                                title: '提示',
                                message:sucMsg
                            });
                            this.isEditing = false;
                            if (this.editType == 'edit') {
                                this.updateData([res.data]);
                            } else {
                                this.getList();
                            }
                            this.curModel = null;
                        });
                    } else {
                        this.$notify.error({
                            title: '提示',
                            message:msgConfig['formError']
                        });
                    }
                });
            },
            onCustomColConfirm(res) {
                this.colData = JSON.parse(JSON.stringify(res));
                this.customColShow = false;
            },
            onCustomColCancel() {
                this.customColShow = false;
            },
            updateData(modifiedItems) {
                // 更新所有被修改的数据
                if (!Array.isArray(modifiedItems)) {
                    throw new TypeError("modifiedItems is not array");
                }
                // 通过id匹配，找到对应的项更新数据
                this.list.forEach((item, index) => {
                    let curInData = _.findWhere(modifiedItems, {id: item.id});
                    if (curInData) {
                        this.$set(this.list, index, curInData);
                    }
                });
            },
            handleDefaultSort(){
                // 从query中获取排序参数，渲染到页面中
                let query = this.$route.query;
                if(query.orderBy){
                    let sortArray = query.orderBy.split('-');
                    let queryRule = sortArray.splice(-1,1)[0];
                    let rule = '';
                    switch (queryRule) {
                        case 'asc':
                            rule = 'ascending';
                            break;
                        case 'desc':
                            rule = 'descending';
                            break;
                        default:
                            rule = '';
                    }
                    let prop = sortArray.join('.');
                    if(rule){
                        this.defaultSort = {
                            prop: prop,
                            order: rule
                        }
                    }
                }else{
                    this.defaultSort = {
                        order: "",
                        prop: ""
                    };
                }
            }
        },
        created() {
            // 禁用的项
            if (this.disables && Array.isArray(this.disables) && this.disables.length > 0) {
                this.disables.forEach((curVal) => {
                    this.disableOpt[curVal] = true;
                })
            }
            // 把cols从props中复制到data中（cosData），方便后续修改
            if (this.cols && Array.isArray(this.cols) && this.cols.length > 0) {
                this.colData = JSON.parse(JSON.stringify(this.cols));
            }
            // 从query中获取排序参数，渲染到页面中
            this.handleDefaultSort();
            this.getList();
        },
        watch:{
            '$route':{
                handler(){
                    // 从query中获取排序参数，渲染到页面中
                    this.handleDefaultSort();
                    this.getList();
                },
                deep:true
            }
        }
    }
</script>
<style scoped lang="less">
    .title {
        padding: 20px;
        font-weight: bold;
        font-size: 18px;
    }
    .expand-item {
        padding: 5px 0 0 30px;
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;
    }
    .expand-label {
        width: 100px;
    }
</style>