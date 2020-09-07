<template>
    <ul class="menu-list">
        <li v-for="item in list">
            <a class="menu-item">
                <div>
                    <i :class="item.icon"></i>
                </div>
                <div class="mt5">
                    {{item.name}}
                </div>
                <div class="menu-item-child">
                    1111
                </div>
            </a>

        </li>
    </ul>
</template>

<script>
    export default {
        name: "sideMenu",
        data() {
            return {
                list: [
                    {
                        icon: 'fa fa-eye',
                        name: '用户'
                    }
                ]
            }
        }
    }
</script>

<style scoped lang="less">
    @import "~style/variable.less";

    .menu-list {
        color: white;
    }

    .menu-item {
        display: block;
        padding: 10px 0;
        cursor: pointer;
        &:hover {
            background: darken(@side-bg, 50%);
        }
        position: relative;
        width: 60px;
    }

    .menu-item-child {
        position: absolute;
        top: 0;
        right: 0;
        transform: translateX(100%);
        background: white;
        width: 100px;
        height: 100px;
        z-index: 10000;
    }

</style>