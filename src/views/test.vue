<template>
    <div>
        <div>
            {{test}}
        </div>
    </div>
</template>
<script>
import foo from 'app/common/resource/api/foo.js';
export default {
    name:'test',
    data(){
        return {
            test:'测试页面1'
        }
    },
    created: function(){
        foo.test({params:{id:2}})
        .then(function(res){
            console.log(res)
        })
        .catch(function(err){
            if(err.response && err.response.data && err.response.data.msg){
                console.log(err.response.data.msg)
            }
        })
        
        foo.err({
            params:{id:2},
            data:{
                name:'err',
                method:'post方法'
            }
        })
        .then(function(res){
            console.log(res)
        })
        .catch(function(err){
            if(err.response && err.response.data && err.response.data.msg){
                console.log(err.response.data.msg)
            }
        })
    }

}
</script>
