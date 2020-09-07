
<template>
    <div>
        <!--进行中-->
        <div class="mb5 gray"
             v-if="progress.status == progressStatus['RUNING']">
          <span v-if="progress.step_count">
              <span>
                  共 {{ progress.step_count }} 步，
              </span>
          </span>
            <span v-if="progress.step_cur">
              正在进行第 {{progress.step_cur}} 步 ...
          </span>
        </div>
        <!--完成-->
        <div class="mb5 gray"
             v-if="progress.status == progressStatus['COMPLETE']">
            完成
        </div>
        <el-progress :text-inside="true"
                     :stroke-width="26"
                     :percentage="percent">
        </el-progress>
    </div>
</template>
<script>
    import staticConfig from 'config/static';
    export default {
        name: 'ProgressBar',
        data(){
          return {
              progressStatus:staticConfig['progressStatus']
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
                var temp = this.progress.cur * 100 / this.progress.total;
                return temp.toFixed(1)*1;
            }
        },
        methods: {

        }
    }
</script>
<style scoped>

</style>


