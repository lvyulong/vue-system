<template>
    <el-form-item :label="label">
        <!--日期区间-->
        <template v-if="type=='datetime'">
            <el-date-picker
                    v-model="model[field]"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间">
            </el-date-picker>
        </template>

        <!--数字区间-->
        <template v-else-if="type=='number'">
           <div class="range-item">
               <el-input type="number" v-model="model[field][0]"></el-input>
               <span style="margin: 0 10px"> 至 </span>
               <el-input type="number" v-model="model[field][1]"></el-input>
           </div>
        </template>


    </el-form-item>
</template>

<script>
    export default {
        name: "range",
        props:{
            label:{
                type:String,
                required:true
            },
            type:{
                type:String,
                required:true
            },
            model:{
                type:Object,
                default(){
                    return {}
                },
                required:true
            },
            field:{
                type:String,
                required:true
            }
        }
    }
</script>

<style scoped lang="less">
    .range-item{

    }

</style>