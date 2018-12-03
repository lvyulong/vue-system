<template>
    <div class="top-nav">
        <!-- 线型 -->
        <template v-if="isLine">
            <el-menu
                    :default-active="defaultActive"
                    class="el-menu-demo"
                    mode="horizontal"
                    @select="handleSelect">
                <!-- 主菜单 -->
                <template v-for="(config,confIndex) in data">
                    <!-- 有子菜单 -->
                    <el-submenu :index="config.name"
                                v-if="config.children">
                        <template slot="title">
                            <span>{{config.label}}</span>
                        </template>
                        <!-- 二级菜单 -->
                        <template v-for="(child,childIndex) in config.children">
                            <el-menu-item :index="child.name" @click="select(child)">{{child.label}}</el-menu-item>
                        </template>
                    </el-submenu>
                    <!-- 无二级菜单 -->
                    <el-menu-item :index="config.name"
                                  :class="{'is-active':config.name == currentName}"
                                  v-if="!config.children"
                                  @click="select(config)">
                        {{config.label}}
                    </el-menu-item>
                </template>
            </el-menu>
            <div class="line"></div>
        </template>

        <!-- 有背景色 -->
        <template v-if="!isLine">
            <el-menu
                    :default-active="defaultActive"
                    class="el-menu-demo"
                    mode="horizontal"
                    @select="handleSelect"
                    :background-color="backgroundColor"
                    :text-color="textColor"
                    :active-text-color="activeTextColor">
                <!-- 主菜单 -->
                <template v-for="(config,confIndex) in data">
                    <!-- 有子菜单 -->
                    <el-submenu :index="config.name" v-if="config.children">
                        <template slot="title">
                            <span>{{config.label}}</span>
                        </template>
                        <!-- 二级菜单 -->
                        <template v-for="(child,childIndex) in config.children">
                            <el-menu-item :index="child.name" @click="select(child)">{{child.label}}</el-menu-item>
                        </template>
                    </el-submenu>
                    <!-- 无二级菜单 -->
                    <el-menu-item :index="config.name"
                                  v-if="!config.children"
                                  @click="select(config)"
                                  :style="config.style"
                                  :class="{'is-active':currentName == config.name}">
                        {{config.label}}
                    </el-menu-item>
                </template>
            </el-menu>
        </template>
        <!-- 返回插槽 -->
        <div class="extra">
            <slot name="back"></slot>
        </div>
    </div>
</template>
<script>
    export default {
        name: "TopNav",
        data() {
            return {
                currentName:''
            };
        },
        props: [
            "data",
            "isLine", //线型
            "defaultActive",
            "backgroundColor", //非线型时，背景色
            "textColor", //非线型时，文本的颜色
            "activeTextColor" //非线型时，激活字体的颜色
        ],
        methods: {
            handleSelect: function (index, path) {
            },
            select: function (config) {
                // 支持query和params
                this.$router.push({
                    name: config.name,
                    query: config.query,
                    params: config.params
                });
            }
        },
        created: function () {
            // this.$router.push(this.defaultActive);
            this.currentName = this.$route.name;
        },
        watch: {
            '$route':{
                handler: function (val, oldVal) {
                    this.currentName = val.name;
                },
                // 深度观察监听
                deep: true
            }
        }
    };
</script>
<style scoped>
    .el-menu-item {
        border-radius: 0 !important;
    }
    .is-active{
        border-bottom: 2px solid #409EFF!important;
        color: #303133;
    }

    .top-nav {
        position: relative;
    }

    .extra {
        position: absolute;
        top: 50%;
        margin-top: -10px;
        right: 0;
    }
</style>

