<template>
    <div>
        <el-dialog
                title="自定义列表项"
                :close-on-click-modal="false"
                :show-close="false"
                :visible.sync="show"
                width="50%">
            <div>
                <div style="column-count: 3">
                    <div v-for="col in cols" :key="col.label" v-if="col.dynamic">
                        <el-checkbox v-model="col.check" :true-label="1" :false-label="0">{{col.label}}</el-checkbox>
                    </div>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button size="mini" type="default" @click="cancel">取 消</el-button>
                <el-button size="mini" type="primary" @click="ok">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        name: "customCol",
        props:['visible','colData'],
        data(){
            return {
                cols:[]
            }
        },
        methods:{
            ok(){
                this.$emit('submit',this.cols);
            },
            cancel(){
                this.$emit('cancel',false);
            }
        },
        created(){
            this.show = true;
            this.cols = myTool.copyArray(this.colData);
        }
    }
</script>

<style scoped lang="less">

</style>