<template>
    <div class="app">
        <el-container>
            <!-- 侧边导航栏 -->
            <el-aside>
                <div style="padding-top: 3rem">
                    <div>
                        <transition name="fade">
                            <img :src="sys.sysLogo1" class="logo1" v-show="!collapse">
                        </transition>
                    </div>
                    <div class="mt10 white font18 title">
                        <transition name="fade">
                            <div class="title-words" v-show="!collapse">{{sys.sysName}}</div>
                        </transition>
                    </div>
                </div>
                <slide-nav
                        class="mt3rem"
                        :data="navConfigs"
                        :collapse="collapse"
                        :unique-opened="true"
                        text-color="#ccc"
                        active-text-color="#fff"
                        background-color="#353D55">
                </slide-nav>
                <div class="swich" @click="collapse_switch()">
                    <span class="el-icon-arrow-right" v-if="collapse"></span>
                    <span class="el-icon-arrow-left" v-if="!collapse"></span>
                </div>
            </el-aside>
            <!-- 中间内容区 -->
            <el-container class="container">
                <!-- 顶部工具栏 -->
                <el-header style="border: none">
                <span>
                  欢迎，
                    <router-link :to="{name:'appMyPwd'}">
                         <strong>{{(local.user&&(local.user.name || local.user.UserId)) || '管理员'}}</strong>
                    </router-link>
                </span>
                    <a href="#" class="pull-right" @click="logout()">退出</a>
                </el-header>
                <!-- 主内容区 -->
                <el-main id="main">
                    <router-view></router-view>
                </el-main>
                <!-- 底部 -->
                <!--<el-footer>-->
                <!--<p class="font12">备案号：</p>-->
                <!--</el-footer>-->
            </el-container>
        </el-container>
    </div>
</template>
<script>
    import SlideNav from "component/SlideNav";
    import navs from "config/nav";
    import sys from 'config/sys';
    import {mapState} from 'vuex';
    import authApi from 'api/authApi';
    import enumConfig  from 'config/enum';
    export default {
        name: "App",
        data() {
            return {
                collapse: false,
                navConfigs: navs,
                user: {},
                sys: sys
            };
        },
        computed: {
            ...mapState([
                'local'
            ])
        },
        methods: {
            logout: function () {
                var that = this;
                authApi.logout().then(function () {
                    that.$router.push({name: "login"});
                });
            },
            collapse_switch: function () {
                this.collapse = this.collapse ? false : true;
            }
        },
        components: {
            SlideNav
        },
        // 进入主应用之前访问current接口
        beforeRouteEnter: (to, from, next) => {
            authApi.current().then(function (res) {
                next((vm) => {
                    // 所有权限的枚举表
                    // var pmsObj = res.data.data.static.mgr_permission;
                    // var pmsEnum = {};
                    // _.each(pmsObj, function (p) {
                    //     _.each(p.items, function (c) {
                    //         pmsEnum[c.key] = c.id;
                    //         pmsEnum[c.id] = c.key;
                    //     })
                    // });
                    // // 该用户的权限
                    // var userPms = {};
                    // if (res.data.data.user.type == enumConfig['USER_TYPE_ADMIN']) {
                    //     // 管理员账户，则把所有权限都绑过去
                    //     _.each(pmsEnum,function (v,k) {
                    //         if(typeof v == 'number'){
                    //             userPms[k] = v;
                    //         }
                    //     })
                    // } else {
                    //     // 其他类型的账号，则根据permissions来绑定
                    //     var permissions = res.data.data.user.permissions;
                    //     for (let i = 0; i < permissions.length; i++) {
                    //         userPms[pmsEnum[permissions[i]]] = permissions[i];
                    //     }
                    // }

                    vm.$store.commit('setProp', [
                        {key: 'local', val: res.data && res.data.data},
                        // {key: 'pmsEnum', val: pmsEnum},
                        // {key: 'userPms', val: userPms},
                    ]);
                });
            });
        }
    };
</script>
<style lang="less" scoped>
    .title {
        min-height: 2rem;
        padding: 1rem 0;
    }

    .title-words {
        white-space: pre-wrap;
        text-align: center;
    }

    .logo1 {
        width: 130px;
        margin-top: 5px;

    }

    .logo2 {
        width: 40px;
        margin-top: 5px;
        margin-right: 5px;
    }

    .el-header {
        width: 100%;
        color: #333;
        border-bottom: 1px solid #ccc;
        box-shadow: 0 0 5px #ccc;
        line-height: 60px;
        text-align: left;
        z-index: 1000;
    }

    .el-aside {
        width: auto !important;
        background-color: #353D55;
        color: #333;
        text-align: center;
        min-width: 64px;
        position: relative;
        height: 100vh;
    }

    .el-main {
        height: 80vh;
        overflow-y: scroll;
    }

    .swich {
        position: absolute;
        width: 100%;
        text-align: center;
        padding: 1rem 0;
        bottom: 0;
        color: white;
        background-color: lighten(#353D55, 10%);
    }
</style>
