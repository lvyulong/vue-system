<template>
  <div>
      我的账户首页
  </div>
</template>

<script>
import fooApi from 'app/common/resource/api/fooApi';
export default {
  name: "appUserIndex",
  data() {
    return {
      
    }
  },
  beforeRouteEnter (to, from, next) {
    fooApi.test({params:{id:1}}).then(function(res){
      next(vm => {
        vm.test = res.data;
      })
    })
  }
};
</script>
<style lang="less" scoped>
</style>
