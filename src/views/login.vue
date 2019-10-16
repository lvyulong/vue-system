<template>
    <div class="user-bg">
        <div class="logo">
            <img src="~image/logo1.png" style="width: 200px">
        </div>
        <el-card class="user-panel">
            <div class="panel-body">
                <div v-if="loginType == 'wx'">
                    <!--一、企业号登陆---------------------------------------------------->
                    <!--二维码容器，如果没有key时显示二维码-->
                    <div id="wx_reg" style="text-align: center" v-if="!key"></div>
                    <!--如果有key显示正在登陆的状态：有错误则显示错误，否则显示“正在登陆”-->
                    <div v-if="key" style="text-align: center;font-size: 1.5rem">
                        <span class="error" v-if="loginError">{{loginError}}</span>
                        <span v-else>正在登录...</span>
                    </div>
                </div>
                <div class="login-area" v-else>
                    <!--二、账号密码登陆-------------------------------------------------->
                    <h2 class="text-center">{{loginTitle}}</h2>
                    <div class="mt2rem">
                        <el-form :model="model"
                                 status-icon
                                 :rules="rules"
                                 ref="form">
                            <el-form-item prop="name">
                                <el-input placeholder="账号" v-model="model.name" autocomplete="off"></el-input>
                            </el-form-item>

                            <el-form-item prop="password">
                                <el-input type="password" placeholder="密码" v-model="model.password"></el-input>
                            </el-form-item>
                            <el-form-item class="text-center">
                                <el-button class="submit" type="primary" round @click="submit">登录</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>

            </div>
        </el-card>
    </div>
</template>
<script>
    import authApi from 'api/authApi';
    import sys from 'config/sys';

    export default {
        name: "Login",
        data() {
            return {
                loginType:sys.loginType,
                loginTitle:sys.loginTitle,
                model:{
                    name:'',
                    password:''
                },
                formRules:[
                    {key:'name',label:'账号'},
                    {key:'password',label:'密码'}
                ],
                key: '',
                loginError: '',
                appRouterEnter:{
                    name:'appUserIndex'
                }
            };
        },
        computed:{
            rules:function () {
                var rules = myTool.rule(this.formRules);
                return rules;
            },
        },
        methods: {
            submit(){
                var that = this;
                this.$refs.form.validate((valid)=>{
                    if(valid){
                        authApi.login({
                            data:that.model
                        }).then(function (res) {
                            that.$router.push(that.appRouterEnter);
                        })
                    }
                })
            }
        },
        mounted: function () {
            var that = this;
            if(sys.loginType == 'wx'){
                // 二维码登陆
                var key = this.$route.query && this.$route.query.key;
                if (key) {
                    this.key = key;
                    authApi.login({data: {key: this.key}}).then(function (res) {
                        that.$router.push(that.appRouterEnter);
                    }).catch(function (err) {
                        let errRes = err.response || {};
                        that.loginError = myTool.getProp(errRes, 'data.message');
                    })
                } else {
                    getConfig();
                    setInterval(getConfig, 30000);
                    function getConfig() {
                        authApi.pre({
                            data: {
                                url: location.href
                            }
                        }).then(function (res) {
                            var data = res.data.data;
                            var option = {
                                "id": "wx_reg",
                                "appid": data.appId,
                                "agentid": data.agentId,
                                "redirect_uri": encodeURIComponent(data.redirectUri),
                                "state": encodeURIComponent(data.state),
                                "href": "",
                            };
                            window.WwLogin(option);
                        });
                    }
                }
            }
        }
    };
</script>
<style lang="less" scoped>
    .user-bg {
        position: relative;
        width: 100%;
        min-height: 100vh;
        background-image: url(~image/login/bg.png);
        background-repeat: no-repeat;
        background-position: top left;
        background-size: cover;
        .logo {
            text-align: center;
            width: 100%;
            position: absolute;
            left: 0;
            top: 50%;
            margin-top: -360px;
        }
        .user-panel {
            background: rgba(255, 255, 255, .8);
            width: 500px;
            border: none;
            border-radius: 7px;
            box-shadow: 0 0 7px rgba(0, 0, 0, .15);
            position: absolute;
            left: 50%;
            top: 50%;
            margin: -200px 0 0 -250px;
            .panel-body {
                padding: 15px 25px;
            }
        }
    }
    .error{
        color: red;
    }
    .submit{
        padding: 1rem 190px;
    }
</style>

