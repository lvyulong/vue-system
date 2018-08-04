<template>
    <div class="user-bg">
        <div class="logo">
            <img src="~image/login/logo.png" style="width: 200px">
        </div>
        <el-card class="user-panel">
            <!--二维码容器-->

            <div class="panel-body">
                <div id="wx_reg" style="text-align: center" v-if="!key"></div>
                <div v-if="key" style="text-align: center">
                    正在登录...
                </div>
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
        methods: {},
        mounted: function () {
            var that = this;
            var origin = location.origin;
            var key = location.href.split('key=')[1];
            if (key) {
                this.key = key;
                authApi.login({data: {key: this.key}}).then(function (res) {
                    that.$router.push({name:'appUserIndex'});
                })
            } else {
                var domain = origin;
                // 如果是本地开发环境，换成开发服务器域名
                if (/localhost/.test(domain) || /10\.21\.109\.77/.test(domain)) {
                    domain = global_data.domain.dev;
                }
                getConfig();
                setInterval(getConfig,120000);
                function getConfig() {
                    authApi.wxConfig().then(function (res) {
                        var data = res.data.data;
                        var option = {
                            "id": "wx_reg",
                            "appid": data.appId,
                            "agentid": data.agentId,
                            "redirect_uri": encodeURIComponent(`${domain}/api/admin/auth/access-code`),
                            "state": encodeURIComponent(`${data.state}|${location.href}`),
                            "href": "",
                        };
                        window.WwLogin(option);
                    });
                }
            }
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

