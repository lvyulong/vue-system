<template>
  <div class="login">
      <h3>登录</h3>
      <div class="test"></div>
  </div>
</template>
<script>
export default {
  name: "login",
  data() {
    return {};
  }
};
</script>
<style lang="less">
@import '~style/color.less';
.rectangle(@width:100px,@height:100px,@bgColor:#000,@color:#fff) {
  width: @width;
  height: @height;
  background-color:@bgColor;
  color: @color; 
}

.login {
  .rectangle(100%, 500px,saturate(@bgGray,20%));
  color: mix(@red,@green);

}
</style>

