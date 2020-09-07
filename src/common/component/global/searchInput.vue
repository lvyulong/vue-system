<!--usage：-->
<!--一、属性：-->
<!--1、options：必传，下拉的选项；-->
<!--2、filter：选传，通过filter对象渲染组件；如果没有，默认按options第一个选项渲染；-->
<!--二、查询按钮-->
<!--1、点击查询，触发submit事件，并把值组成一个对象抛出-->
<!--2、父组件中响应submit事件，触发刷新列表即可-->
<template>
    <div class="search-input-wrap">
        <div style="display: flex;align-items: center">
            <el-select v-model="selected"
                       class="search-select"
                       size="small"
                       placeholder="请选择"
                       :style="{width: labelWidth || dynamicWidth}">
                <el-option
                        v-for="item in options"
                        :key="item.key"
                        :label="item.label"
                        :value="item.key">
                </el-option>
            </el-select>
            <!--下拉选择（多选、单选）-->
            <el-autocomplete
                    v-if="activeItem.option"
                    class="search-input"
                    size="small"
                    :readonly="readonly"
                    :style="{width:searchWidth || '500px'}"
                    v-model="inputValue"
                    :debounce="0"
                    :fetch-suggestions="getSuggestions"
                    :placeholder="activeItem.desc || ''"
                    @select="handleSelect">
                <template slot-scope="{ item }">
                    <div v-if="item">{{ item.label }}</div>
                </template>
                <el-button
                        slot="append"
                        icon="el-icon-search"
                        @click="submit">
                </el-button>
            </el-autocomplete>
            <!--文本输入-->
            <el-input
                    v-if="!activeItem.option"
                    class="search-input"
                    size="small"
                    :readonly="readonly"
                    @keyup.enter.native="submit"
                    :style="{width:searchWidth || '500px'}"
                    v-model="inputValue"
                    :placeholder="activeItem.desc || ''">
                <el-button
                        slot="append"
                        icon="el-icon-search"
                        @click="submit">
                </el-button>
            </el-input>
        </div>
        <div>
            <slot></slot>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'searchInput',
        data() {
            return {
                readonly: false,
                selected: '',
                inputValue: '',
                dynamicWidth: '100px',   // 优先使用父组件传的labelWidth，如果没传则根据label的字符串长度动态计算
            }
        },
        props: {
            searchWidth:String,
            // options必须为数组，并且长度大于0
            options: {
                validator: function (value) {
                    return Array.isArray(value) && value.length > 0;
                }
            },
            labelWidth: String,
            useData: String, //使用该参数，则该组件不会将参数放到url中，而是发布一个submit事件，并将参数抛出去，让父组件去处理
        },
        computed: {
            activeItem: function () {
                let item = _.findWhere(this.options, {key: this.selected}) || {};
                return item;
            }
        },
        methods: {
            handleSelect() {
                this.$emit('submit', {
                    key: this.selected,
                    value: this.inputValue
                });
                this.inputValue = '';
            },
            getSuggestions(queryString, cb) {
                let options = [];
                if(this.activeItem && this.activeItem.option){
                    options = JSON.parse(JSON.stringify(this.activeItem.option));
                    options = _.filter(options,function (item) {
                        return !item.selected;
                    });
                }
                let result = queryString?options.filter(this.createFilter(queryString)):options;
                cb(result);
            },
            createFilter(queryString) {
                return (option) => {
                    return (option.label.toLowerCase().indexOf(queryString.toLowerCase()) >= 0);
                };
            },
            submit() {
                if (!this.useData) {
                    let params = Object.assign({}, this.$route.query);
                    // 1、删除params中所有包含在options中的参数
                    for (let i = 0; i < this.options.length; i++) {
                        let item = this.options[i];
                        if (params.hasOwnProperty(item.key)) {
                            delete params[item.key];
                        }
                    }
                    // 2、将当前的值赋到params中
                    params[this.selected] = this.inputValue;
                    params = myTool.clearInvalidProp(params);
                    // 每次筛选都删掉_page参数，默认显示第一页
                    delete params._page;
                    this.$router.push({
                        name: this.$route.name,
                        query: params
                    })
                } else {
                    this.$emit('submit', {
                        key: this.selected,
                        value: this.inputValue
                    });
                    this.inputValue = '';
                }
            },

            // 填充参数
            fillComponent(params) {
                if (!params) {
                    let params = this.$route.query;
                }
                // 所有的值
                let values = _.pluck(this.options, "key");
                let hasProp = 0;
                for (let i = 0; i < values.length; i++) {
                    // 如果filter对象中有options中对应的属性值，则渲染到组件中;找到一个就终止
                    if (params.hasOwnProperty(values[i])) {
                        this.selected = values[i];
                        this.inputValue = params[values[i]];
                        hasProp = 1;
                        break;
                    }
                }
                // 如果filter中没有对应的属性，默认渲染第一个option
                if (!hasProp) {
                    this.selected = this.options[0].key;
                    this.inputValue = '';
                }
            }
        },
        created: function () {
            // this.fillComponent();
            // 默认渲染第一个
            if(Array.isArray(this.options) && this.options.length > 0){
                this.selected = this.options[0].key;
            }
        },
        watch: {
            'selected': function (n, o) {
                let item = _.findWhere(this.options, {key: n});
                if(!item){
                    return;
                }
                // 动态计算label宽度
                if(item.width){
                    this.dynamicWidth = item.width + 'px';
                }else if (item.label) {
                    this.dynamicWidth = (item.label.length * 20 + 35) + 'px';
                } else {
                    this.dynamicWidth = '100px';
                }
                this.readonly = item.readonly?true:false;
            }
        }
    }
</script>
<style scoped lang="less">
    .search-input-wrap{
        width: 100%;
        display: flex;
        align-items: center;
    }
    .search-input{
        margin-left: -5px;
    }
    /deep/ .search-input .el-input__inner{
        border-radius: 0!important;
    }
    /deep/ .search-input .el-input__inner:focus{
        border-color: #DCDFE6;
    }
    /deep/ .search-input .el-input__inner:hover{
        border-color: #DCDFE6;
    }

    /deep/ .search-select .el-input__inner{
        border-radius: 4px 0 0 4px;
    }
    /deep/ .search-select .el-input__inner:focus{
        border-color: #DCDFE6;
    }
    /deep/ .search-select .el-input__inner:hover{
        border-color: #DCDFE6;
    }
</style>


