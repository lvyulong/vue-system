<template>
  <div class="padding">
    <h3>{{title}}</h3>
    <div class="padding">
      {{user_name}}
    </div>
  </div>
</template>
<script>
export default {
  name:'fooFoo1Foo11',
  data(){
    return {
      title:'Foo11 Component',
      user_name: this.$route.query.user_name
    }
  },
  watch: {
    '$route' (to,from) {
      
    }
  }
}
</script>
