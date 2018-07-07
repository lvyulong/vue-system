<template>
  <div class="app">
      <el-container>

    <!-- 侧边导航栏 -->
          <el-aside>
            <div class="padding">
               <div><img src="./assets/image/logo.jpg" class="logo"></div>
               <div class="mt10 white f18 title">
                   <transition name="fade">
                     <div class="title-words" v-show="!collapse">Demo</div>
                   </transition>
               </div>
            </div>
            <slide-nav
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
            <el-header>
                <span>
                  欢迎，
                  <router-link :to="{name:'appUserIndex'}">
                    <strong>{{user}}</strong>
                  </router-link>
                  </span>
                <a href="#" class="pull-right" @click="logout()">退出</a>
            </el-header>
            <!-- 主内容区 -->
            <el-main id="main">
              <router-view></router-view>
            </el-main>
            <!-- 底部 -->
            <el-footer>
              <p class="font12">备案号：</p>
            </el-footer>
          </el-container>
      </el-container>
  </div>
</template>

<script>
import SlideNav from "app/common/component/SlideNav.vue";
import navs from "app/common/config/nav";
export default {
  name: "App",
  data() {
    return {
      collapse: false,
      navConfigs: navs,
      user:'Eallon'
    };
  },
  methods: {
    logout: function() {
      var that = this;
      auth.logout().then(function() {
        this.$router.push({ name: "Login" });
      });
    },
    collapse_switch: function() {
      this.collapse = this.collapse ? false : true;
    }
  },
  components: {
    SlideNav
  },
  beforeRouteEnter: (to, from, next) => {
    next();
  }
};
</script>
<style lang="less" scoped>

.title{
 min-height: 2rem;
 padding: 1rem 0;
}
.title-words {
  max-width: 172px;
  white-space: pre-wrap;
}
.logo {
  width: 50px;
  height: 50px;
  margin-top: 5px;
  border-radius: 50%;
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
  background-color:#353D55;
  color: #333;
  text-align: center;
  min-width: 64px;
  position: relative;
  height: 100vh;
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

