<template>
    <el-dialog :center="center"
               :width="width"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               :show-close="false"
               :destroy-on-close="true"
               :visible.sync="visible">
        <!--title-->
        <div slot="title" v-if="title">
            {{title}}
        </div>
        <slot></slot>
        <div slot="footer"
             class="dialog-footer">
            <el-button @click="cancel" size="mini" v-if="showCancel">{{cancelText}}</el-button>
            <el-button type="primary" size="mini" style="margin-left: 20px" @click="ok">{{confirmText}}</el-button>
        </div>
    </el-dialog>
</template>
<script>
    export default {
        name: "customDialog",
        props: {
            title: {
                type: String,
            },
            cancelText: {
                type: String,
                default: '取 消'
            },
            confirmText: {
                type: String,
                default: '确 定'
            },
            showCancel: {
                type: Boolean,
                default: true
            },
            center: {
                type: Boolean
            },
            width:{
                type: String,
                default:'50%'
            }
        },
        data() {
            return {
                visible: true
            }
        },
        methods: {
            cancel() {
                this.$emit('cancel');
            },
            ok() {
                this.$emit('confirm');
            }
        },
        created() {
        }
    }
</script>

<style scoped>

</style>