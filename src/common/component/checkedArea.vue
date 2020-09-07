<template>
    <div>
        <div class="checkedValueBox"
             v-if="(checkedItems && checkedItems.length > 0) || isAll">
            <div class="title">
                <div>
                    已选择
                    <span v-if="!isAll" style="color: #0a9dc7">{{checkedItems.length}}</span>
                    <span v-if="isAll" style="color: #0a9dc7">全部</span>
                    项
                </div>
                <div class="ml1rem">
                    <el-button type="text"
                               class="no-padding"
                               v-if="!isAll"
                               @click="selectAll">
                        勾选全部
                    </el-button>
                    <!--取消勾选-->
                    <el-button class="ml5 no-padding"
                               type="text"
                               v-if="checkedItems.length>0"
                               @click="clear">
                        清空
                    </el-button>
                </div>
            </div>
            <div v-if="checkedItems.length>0 && !isAll" class="mt10">
                <span :class="{'ml10':index>0}"
                      v-for="(item,index) in checkedItems"
                      :key="item.id">
                    {{item | showItem(fields)}}
                </span>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: "checkedArea",
        props: {
            checkedItems: {
                type: Array,
                default(){
                    return []
                }
            },
            list: {
                type: Array,
                default(){
                    return []
                }
            },
            fields: {
                type: Array
            },
            page:{
                type: Number,
                default:1
            }
        },
        computed:{
          curListIds(){
              let ids = _.pluck(this.list,'id');
              return ids;
          }
        },
        data() {
            return {
                isFull: false,
                isAll: false
            }
        },
        methods: {
            clear() {
                this.isFull = false;
                this.isAll = false;
                this.$emit('clear');
            },
            selectAll() {
                this.isAll = true;
                this.isFull = true;
                this.$emit('selectAll');
            },
            checkIsFull(){
                let isFull = true;
                for(let i=0;i<this.list.length;i++){
                    let curItem = this.list[i];
                    let inCheckeditems = _.findWhere(this.checkedItems,{id:curItem.id});
                    if(!inCheckeditems){
                        isFull = false;
                        break;
                    }
                }
                return isFull;
            }
        },
        filters: {
            showItem(item, fields) {
                let content = '';
                if (fields && fields.length > 0) {
                    fields.forEach((field, index) => {
                        if (index > 0) {
                            content = content + ' - ' + item[field];
                        } else {
                            content = item[field];
                        }
                    })
                } else {
                    content = item;
                }
                return content;
            }
        },
        watch: {
            'checkedItems.length': {
                handler() {
                    let isFull = this.checkIsFull();
                    if (isFull) {
                        this.isFull = true;
                    } else {
                        this.isFull = false;
                        this.isAll = false;
                    }
                }
            },
            'curListIds':{
                handler(){
                    if(this.isAll){
                        // 当翻页时触发一次selectAll事件，让父组件根据当前的isAll状态决定是否全选当前页
                        this.$emit('selectAll');
                    }
                },
                deep:true
            }
        }
    }
</script>

<style scoped>
    .checkedValueBox {
        border: 1px solid #91D5FF;
        padding: 10px;
        background-color: #E6F7FF;
        font-size: 14px;
    }
    .title {
        display: flex;
        align-items: center;
        justify-content: flex-start;
    }
    .no-padding{
        padding: 0;
    }
</style>