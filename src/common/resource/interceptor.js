
export default {
  request: {
    success: function (config) {
      // console.log(config)
      return config;
    },
    error: function (error) {
      // console.log(error.response);
      return Promise.reject(error);
    }
  },
  response: {
    success: function (response) {
      // console.log(response)
      return response;
    },
    error: function (error) {
      let errRes = error.response || {};
      if(errRes.status == 401){
        vm.$router.push({name:'login'})
      }
      if(errRes.data){
        if(errRes.data.msg){
          vm.$message.error(errRes.data.msg)
        }else{
          vm.$message.error(errRes.data)
        }
      }
      return Promise.reject(error);
    }
  }
};
