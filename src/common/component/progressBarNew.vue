
<template>
    <div>
        <div class="mb5 gray">
            {{progress.msg}}
        </div>
        <el-progress :text-inside="true"
                     :stroke-width="26"
                     :status="progress.status === progressStatus['COMPLETE'] ? 'success' : progress.status === progressStatus['FAIL'] ? 'exception' : null"
                     :percentage="progress.status === progressStatus['FAIL'] ? 100 : percent">
        </el-progress>
    </div>
</template>
<script>
    import staticConfig from 'config/static';
    export default {
        name: 'ProgressBar',
        data(){
          return {
              progressStatus:staticConfig['progressStatusNew']
          }
        },
        props: [
            'progress', // 一个对象
        ],
        computed: {
            percent:function () {
                if(!this.progress.cur){
                    return 0;
                }
                var temp = this.progress.cur * 100 / this.progress.count;
                return temp.toFixed(1)*1;
            }
        },
        methods: {

        }
    }
</script>
<style scoped>

</style>


