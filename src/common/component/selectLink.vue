<template>
    <div>
        <div v-if="selectData.length>0">
            <el-cascader
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
        props: ['data'],
        data() {
            return {
                selectData: [],
                selected:[]
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
                console.log(val);

            }
        },
        watch: {
            data: {
                handler: function (n, o) {
                    if (n) {
                        var data = this.buildData(n).data;
                        this.selectData = data[data.length - 1] && data[data.length - 1].data;
                        console.log(this.selectData)
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>
