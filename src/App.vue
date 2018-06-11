<template>
  <div class="app">
    <h2>{{title}}</h2>
    <div class="padding">
      <button @click="clickMe">Click Me!</button>
    </div>
    <div>
      <router-link :to="{name:'fooFoo1'}" class="padding">
        Go To Foo1!
      </router-link>
      <router-link :to="{name:'fooFoo1Foo11',params:{id:2},query:{user_name:'Eallon',user_id:14}}" class="padding">
        Go To Foo11!
      </router-link>
      <router-link :to="{name:'fooFoo1Foo12'}" class="padding">
        Go To Foo12!
      </router-link>
    </div>
     
    <div class="padding content">
      <router-view/>
    </div>
  </div>
</template>

<script>
export default {
  name:'App',
  data () {
    return {
      title:'Vue Demo'
    }
  },
  methods:{
    clickMe(){
      // this.$http.get('/api/user').then(function(res){
      //   console.log(res)
      // })
    }
    
  }

}
</script>
<style lang="less" scoped>
  .app{
    min-height: 100vh;
    background: url(assets/image/bg.jpg) no-repeat left top;
    background-size: cover;
    h2{
      text-align: center;
      color: red;
      padding: 50px;
      font-family: 'SummaryNum'
    }
  }
  .padding{
    padding: 1rem
  }
  .content{
    font-family: 'SummaryNum';
    font-size: 1.5rem;
    background: white;
    width: 90vw;
    margin: 2rem auto;
    min-height: 70vh;

  }
</style>

