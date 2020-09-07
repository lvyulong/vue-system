<template>
    <div class="app" v-if="userPms">
        <el-container>
            <!-- 侧边导航栏 -->
            <el-aside>
                <div class="logo">
                    <img src="~image/logo2.png">
                </div>
                <slide-nav
                        class="mt5"
                        :data="navConfigs"
                        :unique-opened="true"
                        text-color="#ccc"
                        active-text-color="#fff"
                        background-color="#353D55">
                </slide-nav>
            </el-aside>
            <!-- 中间内容区 -->
            <el-container class="container">
                <!-- 顶部工具栏 -->
                <el-header>
                    <div style="display: flex;align-items: center;">
                        <div class="back mr10 font16"
                             style=" color: #409EFF"
                             @click="back($store.state.nav.back)"
                             v-if="$store.state.nav && $store.state.nav.back && $store.state.nav.back.show">
                            <i class="el-icon-back"></i>返回
                        </div>
                        <el-divider direction="vertical"
                                    v-if="$store.state.nav && $store.state.nav.items && $store.state.nav.items.length>0 && $store.state.nav.back && $store.state.nav.back.show ">
                        </el-divider>
                        <div v-if="$store.state.nav && $store.state.nav.items && $store.state.nav.items.length>0" class="ml10">
                            <el-breadcrumb separator="/"
                                           style="display: flex;align-items: center">
                                <template v-for="(nav,navIndex) in $store.state.nav.items">
                                    <el-breadcrumb-item :to="{ name:nav.name,params:nav.params,query:nav.query }"
                                                        v-if="nav.name">
                                        <span :class="{'font16':navIndex == ($store.state.nav.items.length - 1)}"> {{nav.title}}</span>
                                    </el-breadcrumb-item>
                                    <el-breadcrumb-item v-else>
                                        <span :class="{'font16':navIndex == ($store.state.nav.items.length - 1)}"> {{nav.title}}</span>
                                    </el-breadcrumb-item>
                                </template>
                            </el-breadcrumb>
                        </div>
                    </div>
                    <div style="display: flex;align-items: center"
                         v-if="local.user && local.user.name">
                        <el-avatar :src="local.user.avatar"
                                   :size="30">
                            <img src="~image/avatar.jpg"/>
                        </el-avatar>
                        <el-dropdown class="ml5"
                                     @command="handleUserDropDown">
                            <span class="el-dropdown-link">
                                {{local.user.name}}
                                <i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="userInfo">账号信息</el-dropdown-item>
                                <el-dropdown-item divided command="logout">退出</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </el-header>
                <!-- 主内容区 -->
                <el-main id="main">
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>
<script>
    import navs from "config/nav";
    import sys from 'config/sys';
    import {mapState} from 'vuex';
    import authApi from 'api/authApi';
    import enumConfig from 'config/enum';
    import cos from 'service/cos';
    export default {
        name: "App",
        data() {
            return {
                navConfigs: navs,
                user: {},
                sys: sys,
                userPms: null
            };
        },
        computed: {
            ...mapState([
                'local'
            ])
        },
        methods: {
            back(navBack) {
                // let localPreRoute = localStorage.getItem('preRoute');
                // 如果有指定返回的理由，则使用指定的
                if (navBack.route) {
                    this.$router.replace(navBack.route);
                }else{
                    this.$router.go(-1);
                }

            },
            handleUserDropDown(cmd){
                let that = this;
                switch (cmd) {
                    case 'logout':
                        authApi.logout().then(function () {
                            that.$router.replace({name: 'login'});
                        });
                    case 'userInfo':
                        that.$router.replace({name:'appMyPwd'});
                }

            }
        },
        // 进入主应用之前访问current接口
        beforeRouteEnter: (to, from, next) => {
            authApi.current().then(function (res) {
                next((vm) => {
                    // 所有权限的枚举表
                    var pmsObj = res.data.data.static.permission;
                    var pmsEnum = {};
                    _.each(pmsObj, function (p) {
                        _.each(p.items, function (c) {
                            pmsEnum[c.key] = c.id;
                            pmsEnum[c.id] = c.key;
                        })
                    });
                    // 该用户的权限
                    var userPms = {};
                    if (res.data.data.user.type == enumConfig['USER_TYPE_ADMIN']) {
                        // 管理员账户，则把所有权限都绑过去
                        _.each(pmsEnum,function (v,k) {
                            if(typeof v == 'number'){
                                userPms[k] = v;
                            }
                        })
                    } else {
                        // 其他类型的账号，则根据permissions来绑定
                        var permissions = myTool.getProp(res.data,'data.user.permissions');
                        for (let i = 0; i < permissions.length; i++) {
                            userPms[pmsEnum[permissions[i]]] = permissions[i];
                        }
                    }
                    vm.$store.commit('setProp', [
                        {key: 'local', val: res.data && res.data.data},
                        {key: 'pmsEnum', val: pmsEnum},
                        {key: 'userPms', val: userPms},
                        {key: 'cos', val: cos},
                    ]);
                });
            });
        },
        watch: {
            '$store.state':{
                handler:function (n,o) {
                    if(n && n.userPms){
                        this.userPms = n.userPms;
                    }
                },
                deep:true
            }
        }
    };
</script>
<style lang="less" scoped>
    .back {
        cursor: pointer;
    }

    .title {
        min-height: 2rem;
        padding: 1rem 0;
    }

    .title-words {
        white-space: pre-wrap;
        text-align: center;
    }

    .logo {
        text-align: center;
        padding: 15px 0;
        background: #002140;
        img {
            width: 30px;
        }
    }

    .el-header {
        height: 40px !important;
        box-shadow: 0 0 5px #333333 !important;
        border: none;
        border-bottom: 1px solid #e4e4e4 !important;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 10px !important;
    }

    .el-aside {
        width: 60px !important;
        background-color: #333333;
        color: white;
        text-align: center;
        position: relative;
        height: 100vh;
    }

    .el-main {
        height: calc(100vh - 40px);
        overflow-y: scroll;
        background: #F4F4F4;
        padding: 0;
    }
</style>
