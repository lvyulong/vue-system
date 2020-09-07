<template>
    <div>
        <el-menu style="text-align: left"
                 :collapse="true"
                 ref="slideNav"
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
                <el-submenu :index="config.path"
                            v-if="config.children&&pmsCheckPass(config)">
                    <template slot="title">
                       <a class="nav-item"
                            :class="{'router-active':isActiveState(config.active)}">
                          <div>
                              <div><i :class="config.icon" v-if="config.icon"></i></div>
                              <div class="mt5">{{config.label}}</div>
                          </div>
                       </a>
                    </template>
                    <!-- 二级菜单 -->
                    <template v-for="(child,childIndex) in config.children">
                        <!-- 分组 -->
                        <el-menu-item-group v-if="child.name&&pmsCheckPass(child)" >
                            <template slot="title">{{child.name}}</template>
                            <template v-for="(item,itemIndex) in child.items">
                                <el-menu-item
                                        v-if="pmsCheckPass(item)"
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
                                v-if="!child.name&&pmsCheckPass(child)"
                                style="padding-left: 52px">

                            <a class="nav-item-right"
                               :class="{'router-active-right':isActiveState(child.active)}">
                                {{child.label}}
                            </a>
                        </el-menu-item>
                    </template>
                </el-submenu>
                <!-- 无二级菜单 -->
                <el-menu-item :index="config.path"
                              v-if="!config.children&&pmsCheckPass(config)">
                    <div class="nav-item"
                         :class="{'router-active':isActiveState(config.active)}">
                        <div>
                            <div>
                                <i :class="config.icon" v-if="config.icon"></i>
                            </div>
                            <div class="mt5">{{config.label}}</div>
                        </div>
                    </div>
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
            pmsCheckPass(config){
                var that = this;
                var isPass = false;
                if(config.checkPms && config.checkPms.length > 0){
                    for(let i=0;i<config.checkPms.length;i++){
                        if(that.$store.state.userPms[config.checkPms[i]]){
                            isPass = true;
                            break;
                        }
                    }
                }else{
                    isPass = true;
                }
                return isPass;
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
            let that = this;
            that.currentPath = that.$route.path;
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
    @media screen and (max-height: 760px) {
        .nav-item{
            height: 53px !important;
        }
    }
    .nav-item{
        display: block;
        text-align: center;
        width: 100%;
        height: 70px;
        display: flex;
        align-items: center;
        justify-content: center;
        text-decoration: none;
    }
    .nav-item:hover{
        background-color: lighten(#333333, 10%) !important;
        cursor: pointer;
    }
    .nav-item-right{
        display: block;
        width: calc(100% - 40px);
        padding: 10px 10px 10px 30px!important;
        background: #ffffff!important;
        color: #000000!important;
        text-decoration: none;
    }
    .nav-item-right:hover{
        background-color: #F2F2F2 !important;
        color: #000000!important;
    }
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
        background-color: lighten(#333333, 20%) !important;
    }
    .router-active-right{
        background-color: lighten(#333333, 60%) !important;
        color: white!important;
    }
</style>

