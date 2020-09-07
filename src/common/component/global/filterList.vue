<template>
    <el-drawer
            :size="size"
            :visible.sync="visible"
            :direction="direction"
            :wrapperClosable="false"
            :withHeader="false">
        <div class="content">
            <div class="title">
                <i class="el-icon-back font20 bold pointer" @click="handleClose"></i>
                <span class="ml5">{{title}}</span>
            </div>
            <div class="filter-area">
                <!--防止drawer组件打开默认focus第一个表单组件-->
                <div style="opacity: 0;position: absolute;top: 0;right: 0">
                    <el-input></el-input>
                </div>
                <slot></slot>
            </div>
            <div class="footer">
                <el-button type="default" class="mr20" size="mini" @click="clear">重置</el-button>
                <el-button type="primary" size="mini" @click="submit">过滤</el-button>
            </div>
        </div>
    </el-drawer>
</template>
<script>
    export default {
        name: "filterList",
        props:{
            size:{
              type:String,
              default:'600px'
            },
            visible:{
                type:Boolean
            },
            direction:{
                type:String,
                default:'rtl'
            },
            title:{
                type:String,
                default:'过滤'
            }
        },
        methods:{
            clear(){
                this.$emit('clear');
            },
            submit(){
                this.$emit('submit');
            },
            handleClose(){
                this.$emit('update:visible',false);
            }
        },
    }
</script>

<style scoped lang="less">
    .content{
        position: relative;
        overflow: hidden;
        height: 100vh;
    }
    .title{
        position: absolute;
        width: 100%;
        height: 50px;
        display: flex;
        align-items: center;
        padding: 0 10px;
        font-weight: bold;
        font-size: 18px;
    }
    .filter-area{
        height: calc(100% - 140px);
        padding: 50px 10px 0 10px;
        overflow-y: scroll;
    }
    .footer{
        position: absolute;
        bottom: 0;
        left: 0;
        height: 60px;
        background: #f5f5f5;
        width: calc(100% - 40px);
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding: 0 20px;
    }
</style>