
<!--usage：-->
<!--一、属性：-->
<!--1、options：必传，下拉的选项；-->
<!--2、filter：选传，通过filter对象渲染组件；如果没有，默认按options第一个选项渲染；-->
<!--二、查询按钮-->
<!--1、点击查询，触发submit事件，并把值组成一个对象抛出-->
<!--2、父组件中响应submit事件，触发刷新列表即可-->

<template>
    <div>
        <el-input placeholder="请输入内容"
                  v-model="inputValue"
                  class="input-with-select">
            <el-select v-model="selected"
                       slot="prepend"
                       placeholder="请选择"
                       :style="{width: labelWidth||'80px'}">
                <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
            <el-button
                    slot="append"
                    icon="el-icon-search"
                    @click="goSearch">
            </el-button>
        </el-input>
    </div>
</template>
<script>
    export default {
        name: 'searchInput',
        data() {
            return {
                selected:'',
                inputValue:'',
            }
        },
        props: {
            // options必须为数组，并且长度大于0
            options:{
                validator: function (value) {
                    return Array.isArray(value)&&value.length>0;
                }
            },
            // filter必须为对象
            filter:Object,
            labelWidth:String
        },
        computed: {},
        methods: {
            goSearch(){
               this.$emit("submit",{[this.selected]:this.inputValue});
            }
        },
        created:function () {
            this.selected = this.options[0].value;
        },
        destroyed:function () {

        },
        watch:{
            filter:{
                handler:function (n,o) {
                    var that = this;
                    if (n){
                        // 所有的值
                        var values = _.pluck(that.options, "value");
                        var hasProp = 0;
                        for (let i=0;i<values.length;i++){
                            // 如果filter对象中有options中对应的属性值，则渲染到组件中;找到一个就终止
                            if (that.filter.hasOwnProperty(values[i])){
                                let selectedObject = _.findWhere(that.options,{value:values[i]});
                                that.selected = selectedObject.value;
                                that.inputValue = that.filter[values[i]];
                                hasProp = 1;
                                break;
                            }
                        }
                        // 如果filter中没有对应的属性，默认渲染第一个option
                        if (!hasProp){
                            that.selected = that.options[0].value;
                            that.inputValue = '';
                        }
                    }
                },
                deep:true
            }
        }
    }
</script>
<style scoped>

</style>


