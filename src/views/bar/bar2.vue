<template>
  <div>
    <h2> {{title}}</h2>
    <div class="padding">
      <router-view/>
    </div>
  </div>
</template>
<script>

export default {
  name:'barBar2',
  data(){
    return {
      title:'Bar2 Component'
    }
  }
}
</script>
