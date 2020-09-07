<!--
usage：
一、属性：
    1、type：按钮的风格，primary、info、success...
    2、plain：是否用幽灵模式
    3、label：文案，默认显示返回
    4、route：指定跳转的路由，默认返回上一页
二、方法：
    没有父组件可调用的方法
三、事件
    没有触发父组件的事件
四、功能：
    1、页面的返回功能按钮
    2、可以指定route属性跳转指定的路由，文案也可以自定义
-->
<template>
    <div>
        <el-button
                :type="myType"
                :plain="myPlain"
                @click="back"
                size="mini">
            {{myLabel}}
        </el-button>
    </div>
</template>
<script>
    export default {
        props: [
            'type',               //按钮的样式
            'plain',            //朴素
            'label',              //文案
            'route'               //指定跳转路由，默认是跳转到前一个页面
        ],
        computed: {
            myPlain: function () {
                return !(!this.plain);
            },
            myType: function () {
                return this.type || 'primary'
            },
            myLabel: function () {
                return this.label || '返回'
            }
        },
        methods: {
            back: function () {
                if (this.route) {
                    // 优先从全局的路由缓存中取（该路由缓存在全局变量中，所以刷新之后就销毁了）
                    var query = this.route.query || {};
                    this.$router.push({
                        name: this.route.name,
                        query: query
                    })
                } else {
                    history.back();
                }
            }
        }
    }
</script>
<style scoped>
</style>
