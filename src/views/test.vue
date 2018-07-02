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
 
        foo.test({params:{id:1}}).then(function(res){
            console.log(res)
        })
    }
}
</script>
