<!--
usage:
一、属性：
    1、"data"：菜单数据，参见common/config/nav
    2、"collapse":是否折叠
    3、"uniqueOpened"：只打开一个
    4、"backgroundColor"：背景色
    5、"textColor"：文字颜色
    6、"activeTextColor"：激活的文字颜色
二、功能：
    1、把common/config/nav中的配置数据，渲染成一个侧边栏
    2、根据当前的路由，渲染激活项
-->


<template>
    <div>
        <el-menu style="text-align: left"
                 :collapse="collapse"
                 :unique-opened="uniqueOpened"
                 class="el-menu-vertical-demo"
                 :background-color="backgroundColor"
                 :text-color="textColor"
                 :active-text-color="activeTextColor"
                 :router="true"
                 @open="handleOpen"
                 @close="handleClose"
                 @select="handleSelect">
            <!-- 主菜单 -->
            <template v-for="(config,confIndex) in data">
                <!-- 有子菜单 -->
                <el-submenu :index="config.path" v-if="config.children">
                    <template slot="title">
                        <i :class="config.icon" v-if="config.icon"></i>
                        &nbsp;
                        <span>{{config.label}}</span>
                    </template>
                    <!-- 二级菜单 -->
                    <template v-for="(child,childIndex) in config.children">
                        <!-- 分组 -->
                        <el-menu-item-group v-if="child.name">
                            <template slot="title">{{child.name}}</template>
                            <template v-for="(item,itemIndex) in child.items">
                                <el-menu-item
                                        :index="item.path"
                                        :class="{'router-active':isActiveState(item.active)}"
                                        style="padding-left: 52px">
                                    {{item.label}}
                                </el-menu-item>
                            </template>
                        </el-menu-item-group>
                        <!-- 无分组 -->
                        <el-menu-item
                                :index="child.path"
                                v-if="!child.name"
                                :class="{'router-active':isActiveState(child.active)}"
                                style="padding-left: 52px">
                            {{currentPath}}
                            {{child.label}}
                        </el-menu-item>
                    </template>
                </el-submenu>
                <!-- 无二级菜单 -->
                <el-menu-item :index="config.path"
                              v-if="!config.children"
                              :class="{'router-active':isActiveState(config.active)}">
                    <i :class="config.icon" v-if="config.icon"></i>
                    &nbsp;
                    <span slot="title">{{config.label}}</span>
                </el-menu-item>
            </template>
        </el-menu>
    </div>
</template>
<script>
    export default {
        name: "SlideNav",
        data() {
            return {
                currentPath: ''
            };
        },
        props: [
            "data",
            // "defaultActive",
            "collapse",
            "uniqueOpened",
            "backgroundColor",
            "textColor",
            "activeTextColor"
        ],
        methods: {
            handleOpen: function () {
            },
            handleClose: function () {
            },
            handleSelect: function (index, path) {
            },
            // 是否为应该激活的路由
            isActiveState(activePath) {
                return activePath && (this.currentPath.indexOf(activePath) !== -1);
            }
        },
        mounted: function () {
            this.currentPath = this.$route.path;
        },
        watch: {
            // 监听路由变化
            $route: {
                handler: function (val, oldVal) {
                    this.currentPath = val.path;
                },
                // 深度观察监听
                deep: true
            }
        }
    };
</script>
<style lang="less" scoped>
    .el-menu {
        border-right: 0 !important;
    }

    .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 200px;
    }

    .el-submenu__icon-arrow,
    .el-icon-arrow-down {
        color: white !important;
    }

    .router-active {
        background-color: darken(#5699eb, 5%) !important;
    }

</style>

