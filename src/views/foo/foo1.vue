<template>
  <div>
    <h2> {{title}}</h2>
    <div>
      {{user}}
    </div>
    <div class="padding">
      <router-view/>
    </div>
  </div>
</template>
<script>
import Vue from 'vue';
import foo from '../../common/resource/api/foo';
export default {
  name:'fooFoo1',
  data(){
    return {
      title:'Foo1 Component',
      user:''
    }
  },
  beforeRouteEnter (to, from, next) {
     foo.query({}).then(function(res){
      next(vm => {
        // data的属性需要提前声明
        vm.$data.user = res.data;
      });
    })
  }
}
</script>
