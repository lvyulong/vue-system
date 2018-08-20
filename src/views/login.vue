<template>
    <div class="user-bg">
        <div class="logo">
            <!--<img src="~image/login/logo.png" style="width: 200px">-->
        </div>
        <el-card class="user-panel">
            <!--二维码容器-->

            <div class="panel-body">
                登录页面
            </div>
            <div>
                <el-button type="primary" plain @click="login">进入系统</el-button>
            </div>
        </el-card>
    </div>
</template>
<script>
    import authApi from 'api/authApi';
    export default {
        name: "Login",
        data() {
            return {
                key: ''
            };
        },
        methods: {
            login(){
                let that = this;
                authApi.login().then(function () {
                    that.$router.push({name:'appUserIndex'})

                })
            }
        },
        mounted: function () {

        }
    };
</script>
<style lang="less" scoped>
    .user-bg{
        position: relative;
        width: 100%;
        min-height: 100vh;
        background-image: url(~image/login/bg.png);
        background-repeat: no-repeat;
        background-position: top left;
        background-size: cover;
        .logo{
            text-align: center;
            width: 100%;
            position: absolute;
            left: 0;
            top: 50%;
            margin-top: -360px;
        }
        .user-panel {
            background: rgba(255,255,255,.9);
            width: 388px;
            border: none;
            border-radius: 7px;
            box-shadow: 0 0 7px rgba(0, 0, 0, .15);
            position: absolute;
            left: 50%;
            top: 50%;
            margin: -240px 0 0 -194px;
            .panel-body {
                padding: 15px 25px;
            }
        }
    }
</style>