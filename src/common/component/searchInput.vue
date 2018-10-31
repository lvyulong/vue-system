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
                    @click="submit">
            </el-button>
        </el-input>
    </div>
</template>
<script>
    export default {
        name: 'searchInput',
        data() {
            return {
                selected: '',
                inputValue: '',
            }
        },
        props: {
            // options必须为数组，并且长度大于0
            options: {
                validator: function (value) {
                    return Array.isArray(value) && value.length > 0;
                }
            },
            labelWidth: String,
            useData: String, //使用该参数，则该组件不会将参数放到url中，而是发布一个submit事件，并将参数抛出去，让父组件去处理
        },
        methods: {
            submit() {
                if (!this.useData) {
                    var params = Object.assign({}, this.$route.query);
                    // 1、删除params中所有包含在options中的参数
                    for (var i = 0; i < this.options.length; i++) {
                        var item = this.options[i];
                        if (params.hasOwnProperty(item.value)) {
                            delete params[item.value];
                        }
                    }
                    // 2、将当前的值赋到params中
                    params[this.selected] = this.inputValue;
                    params = myTool.clearInvalidProp(params);
                    this.$router.push({
                        name: this.$route.name,
                        query: params
                    })
                } else {
                    this.$emit('submit',{
                        [this.selected]:this.inputValue
                    })
                }
            },
            fillComponent(params) {
                if (!params) {
                    var params = this.$route.query;
                }
                // 所有的值
                var values = _.pluck(this.options, "value");
                var hasProp = 0;
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
                    this.selected = this.options[0].value;
                    this.inputValue = '';
                }
            }
        },
        created: function () {
            this.fillComponent();
        }
    }
</script>
<style scoped>

</style>


