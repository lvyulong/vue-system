<template>
    <div>
        <el-menu style="text-align: left"
                 :collapse="collapse"
                 :unique-opened="uniqueOpened"
                 class="el-menu-vertical-demo"
                 :background-color="backgroundColor"
                 :text-color="textColor"
                 :active-text-color="activeTextColor"
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
            handleOpen() {

            },
            handleClose() {

            },
            handleSelect(index, path) {
                // 如果已经是激活状态，则不跳转
                if (this.currentPath != index) {
                    this.$router.push({path: index});
                }
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

