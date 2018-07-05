<template>
  <div>
      <el-dialog
        :title="title"
        :visible.sync="dialogVisible"
        :width="width"
        :before-close="handleClose">
        <span>这是一段信息</span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
  </div>
</template>
<script>
export default {
  name:'dialog',
  props:['title','dialogVisible','width'],
  data(){
      return {

      }
  },
  methods:{
      
  },
  created:function(){
      this.title = this.title?this.title:'提示';
      this.width = this.width?this.width:'30%';
  }
}
</script>
<style scoped>

</style>