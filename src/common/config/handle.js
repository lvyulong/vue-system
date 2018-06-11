import Vue from 'vue';
export default {
  hande1 :(to,from,next)=>{
    Vue.http.get('/api/user').then(function(res){
      next();
    })
  }

}