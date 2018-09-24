
<!--
usage:
    1、标题：
        直接添加title属性
    2、数据驱动nav
        nav设置为一个数组对象；
        [
            {
                to:{
                    name:'',
                    query:{}
                },
                label:''
            }
        ]

    3、插槽自定义slotNav
         slotNav=1;
         <template slot="nav">面包屑内容</template>
    3、返回按钮
        back=1;
-->
<template>
    <div>
        <div class="page-header mt1rem">
            <!--标题 title-->
            <h3 class="page-title" v-if="title">{{title}}</h3>
            <!--数据驱动 nav-->
            <div class="page-title mt10" v-if="nav">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item v-for="item in nav" :key="item.label" :to="item.to">{{item.label}}</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <!--插槽 slotNav-->
            <div class="page-title mt10" v-if="slotNav">
                <slot name="nav"></slot>
            </div>
            <!--返回按钮 back-->
            <back style="position: absolute;bottom: 10px;right: 0" v-if="back"></back>
        </div>
    </div>
</template>

<script>
    import Back from 'component/Back';
    export default {
        name: "pageHeader",
        props:[
            "back",  //布尔值，true显示
            'title',    //title的内容，有则显示，没有不显示
            "nav",      //nav的数据
            "slotNav"   //布尔值，true显示；如果要显示，还需传入插槽的内容
        ],
        data(){
            return {

            }
        },
        components:{
            Back
        }
    }
</script>

<style scoped>

</style>