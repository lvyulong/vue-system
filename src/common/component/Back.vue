<template>
  <div>
      <el-button :type="myType" :plain="myPlain" @click="back" size="mini">{{myLabel}}</el-button>
  </div>
</template>
<script>
export default {
  name:'Back',
  props:[
      'type',               //按钮的样式
      'noPlain',            //朴素
      'label',              //文案
      'route'               //指定跳转路由，默认是跳转到前一个页面
  ],
  computed:{
     myPlain: function(){
         return !this.noPlain;
     },
     myType:function(){
         return this.type||'primary'
     },
     myLabel:function(){
         return this.label||'返回'
     }
  },
  methods:{
      back:function(){
          if(this.route){
              this.$router.push(this.route)
          }else{
              history.back();
          }
      }
  }
  
}
</script>
<style scoped>

</style>


