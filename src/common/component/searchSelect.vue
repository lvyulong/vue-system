<template>
    <div>
        <el-select v-model="value"
                   clearable
                   :placeholder="placeholder">
            <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id + ''">
            </el-option>
        </el-select>
    </div>
</template>

<script>
    export default {
        name: "seachSelect",
        props: [
            'options',
            'placeholder',
            'keyName',
            'useData'
        ],
        data() {
            return {
                value: ''
            }
        },
        watch: {
            'value': function (n) {
                if (!this.useData) {
                    let query = _.extend({}, this.$route.query, {[this.keyName]: n});
                    query = myTool.clearInvalidProp(query);
                    this.$router.replace({
                        name: this.$route.name,
                        query: query
                    })
                } else {
                    this.$emit('change',{
                        [this.keyName]: n
                    })
                }
            },
            '$route': {
                handler: function (n, o) {
                    if (n) {
                        this.value = n.query[this.keyName];
                    }
                },
                deep: true
            }
        },
        mounted: function () {
            this.value = this.$route.query[this.keyName];
        }
    }
</script>
<style scoped lang="less">
</style>