<template>
    <div>
        <div class="searchBox"
             v-if="groupData">
            <search-input :options="groupData"
                          :search-width="searchWidth"
                          use-data="true"
                          @submit="submit">
                <slot></slot>
            </search-input>
            <div class="mt10">
                <span v-for="(item,itemIndex) in checkedList" :key="item.key">
                    <span v-if="itemIndex==0" style="font-size: 14px;color: #999">
                        <i class="fa fa-filter"></i>
                        <span class="ml5">检索项：</span>
                    </span>
                    <el-tag size="medium"
                            type="primary"
                            class="mr5 mb5"
                            @close="deleteItem(itemIndex,valueIndex)"
                            closable
                            :key="valueItem"
                            v-for="(valueItem,valueIndex) in item.value">
                        {{item.label}}: {{valueItem | getValue(item,groupData)}}
                    </el-tag>
                    <el-button type="text"
                               style="color: #999999;padding: 0"
                               @click="clear" v-if="(checkedList.length > 0) && (itemIndex == checkedList.length - 1)">
                        清除
                    </el-button>
                </span>
            </div>
        </div>
    </div>
</template>
<script>
    /**
     option:{
        key:String,                  参数名
        label:String,                显示的文本
        desc:String,                 描述，placeholder
        multi:Boolean,               可多选，默认单选
        readonly:Boolean,            只读，下拉选择默认就是只读
        width:Number,                左边select的宽度，如果不传默认根据字符数动态计算（label为英文字符时很有用）
        option:Array[value,label]    下拉选项，数组中对象的属性：label/value
    }
    * */
    export default {
        name: "searchGroup",
        props: ['option', 'searchWidth'],
        data() {
            return {
                checkedList: [],    // 已被选中的参数
                groupData:null
            }
        },
        filters: {
            getValue(value, item, option) {
                let srcItem = _.findWhere(option, {key: item.key});
                if (srcItem.option) {
                    let srcValue = _.find(srcItem.option,(item)=>{
                        return item.value == value;
                    });
                    return srcValue && srcValue.label;
                } else {
                    return value;
                }
            }
        },
        methods: {
            // 将参数设置到checkedList中
            handleCheckedList(output,cb){
                let isRepeat = false;
                let reg = /\S/;
                // 有值并且有非空字符时
                if (reg.test(output.value)) {
                    let targetItem = _.findWhere(this.checkedList, {key: output.key});
                    let srcItem = _.findWhere(this.groupData, {key: output.key});
                    if (targetItem) {
                        _.each(this.checkedList, function (item) {
                            if (item.key == output.key) {
                                if (srcItem.multi) {
                                    // 一个属性可以有多个值时
                                    let hasExist = item.value.indexOf(output.value);
                                    // 如果该值还未添加，则添加
                                    if (hasExist == -1) {
                                        item.value.push(output.value);
                                    }
                                } else {
                                    // 一个属性只能有一个值时，替换
                                    if(item.value && item.value[0] && item.value[0] == output.value){
                                        // 如果output的值已经在checkList中，则不重复设置并且不触发查询
                                        isRepeat = true;
                                    }else{
                                        item.value = [output.value];
                                    }
                                }
                            }
                        })
                    } else {
                        // 还未添加过该属性，则新增该属性
                        this.checkedList.push({
                            key: output.key,
                            label: srcItem.label,
                            value: [output.value]
                        })
                    }
                    // 选项类型的项，把已经选中的选项打标记
                    cb && cb({isRepeat:isRepeat});
                }
            },
            submit(output) {
                this.handleCheckedList(output,(option)=>{
                    // 新设置进checkList中的值不是重复的值时再触发回调，如果已经存在checkList中则不必做任何事
                    let isRepeat = option && option.isRepeat;
                    if(!isRepeat){
                        this.markSelected();
                        this.emitSubmit();
                    }
                });
            },

            deleteItem(itemIndex, valueIndex) {
                this.checkedList[itemIndex].value.splice(valueIndex, 1);
                // 删除value为空数组的项
                if (this.checkedList[itemIndex].value.length == 0) {
                    this.checkedList.splice(itemIndex, 1);
                }
                this.markSelected();
                this.emitSubmit();
            },

            markSelected() {
                // 将已经选过的项标记为selected，不再在选项中出现
                let that = this;
                for (let i = 0; i < this.groupData.length; i++) {
                    let itemOption = that.groupData[i];
                    if (itemOption.hasOwnProperty('option')) {
                        let curItem = _.find(that.checkedList, (item)=>{
                            return item.key == itemOption.key;
                        });
                        _.each(itemOption.option, function (option) {
                            let selected = false;
                            if(curItem && curItem.hasOwnProperty('value')){
                                let hasExist = _.find(curItem.value,(item)=>{
                                    return item == option.value;
                                });
                                if(hasExist){
                                    selected = true;
                                }
                            }
                            that.$set(option, 'selected', selected);
                        })
                    }
                }
            },

            clear() {
                this.checkedList = [];
                this.markSelected();
                this.emitSubmit();
            },
            emitSubmit() {
                let params = {};
                _.each(this.checkedList, function (item) {
                    params[item.key] = JSON.parse(JSON.stringify(item.value));
                });
                let newParams = {};
                _.each(params, function (item, key) {
                    if (Array.isArray(item)) {
                        // 如果数组中只有一个数据，则直接取第一个（为了保证数字类型不变成字符串）
                        if(item.length == 1){
                            newParams[key] = item[0];
                        }else{
                            newParams[key] = item.join(',');
                        }
                    }
                });
                newParams = myTool.clearInvalidProp(newParams);
                this.$emit('submit', newParams);
            },
            clearCheckedItemFromQuery(matchSearch){
                matchSearch = matchSearch || {};
                _.each(this.checkedList, function (item,index) {
                    if(!matchSearch.hasOwnProperty(item.key)){
                        item.isDelete = true;
                    }
                });
                this.checkedList = _.filter(this.checkedList,item => {
                    return !item.isDelete;
                });
            },
            fillByQuery(){
                let keys = _.pluck(this.groupData,'key');
                let matchSearch = myTool.trimObj(this.$route.query,keys);
                // 将相关的路由参数渲染的到组件中
                _.each(matchSearch,(value,key)=>{
                    this.handleCheckedList({
                        key:key,
                        value:value
                    })
                });
                // 将路由中没有的参数，从checkList中清除掉
                this.clearCheckedItemFromQuery(matchSearch);
                // 标识已经选中的项
                this.markSelected();
            }
        },
        created(){
            let option = myTool.copyArray(this.option);
            option.forEach((optItem,optIndex) => {
                if(optItem.option){
                    let newOption = myTool.trimArray(optItem.option,{value:'value',label:'label',id:'value',name:'label'});
                    option[optIndex].option = newOption;
                }
            });
            this.groupData = option;
            this.fillByQuery();
        },
        watch:{
            '$route.query':{
                handler(){
                    this.fillByQuery();
                },
                deep:true
            }
        }
    }
</script>