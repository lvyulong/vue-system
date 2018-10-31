<!--

{
                        data:[
                            {data:res[2].data.items,link:'train_plan_id',label:'name',value:'id'},
                            {data:res[1].data.items,label:'name',value:'id'},
                        ]
                    }

-->

<template>
    <div>
        <div v-if="selectData.length>0">
            <el-cascader
                    style="width: 100%"
                    :popper-class="popperClass"
                    expand-trigger="hover"
                    :options="selectData"
                    v-model="selected"
                    @change="handleChange">
            </el-cascader>
        </div>
    </div>
</template>

<script>
    export default {
        name: "selectLink",
        props: ['data','model','popperClass'],
        data() {
            return {
                selectData: [],
            }
        },
        computed:{
            selected:{
                get:function () {
                    var arr = [];
                    _.each(this.model,function (v,k) {
                        arr.push(v);
                    });
                    return arr;
                },
                set: function (newValue) {}
            }
        },
        methods: {
            buildData(obj) {
                var newObj = _.extend({}, obj);
                // 数组
                var data = newObj.data;

                for (var i = 0; i < data.length; i++) {
                    var child = data[i];
                    if (child.link) {
                        var parent = data[i + 1];
                        _.each(parent.data, function (v, k) {

                            v.children = [];
                            _.each(child.data, function (val, key) {
                                if (val[child.link] == v.id) {
                                    v.children.push({
                                        label: val[child.label],
                                        value: val[child.value],
                                        pid: val[child.link]
                                    })
                                }
                            });
                            v.label = v[parent.label];
                            v.value = v[parent.value];
                        })
                    }
                }
                return newObj;
            },
            handleChange(val){
                var obj = {};
                var keys = _.keys(this.model);
                for(var i=0;i<val.length;i++){
                    obj[keys[i]] = val[i];
                };
                this.$emit('update:model', obj)
            }
        },
        watch: {
            data: {
                handler: function (n, o) {
                    if (n) {
                        var data = this.buildData(n).data;
                        this.selectData = data[data.length - 1] && data[data.length - 1].data;
                        // console.log(this.selectData)
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>
