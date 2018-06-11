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
  name:'barBar1',
  data(){
    return {
      title:'Bar1 Component'
    }
  }
}
</script>
