<!--usage:-->
<!--一、属性-->
<!--1、tags:所显示的所有tag；-->
<!--2、active：被选中的tag，与父组件实现了双向绑定；没有active则不显示被选中；-->
<!--3、onlyShow：仅显示，不能进行增删改的操作；-->
<!--二、方法-->

<!--三、事件-->
<!--1、新增事件回调；-->
<!--2、删除事件回调-->
<template>
    <div>
        <div>
            <!--展示tags-->
            <span v-for="(tag,index) in tags"
                  :key="tag.id"
                  @click="select(tag)">
                 <el-tag type="success"
                         class="tag mb5"
                         :class="{'ml5':index>0,'tag-active':active == tag.id}"
                         :closable="!onlyShow"
                         :disable-transitions="false"
                         @close="deleteItem(tag)">
                     {{tag.name}}
                 </el-tag>
             </span>
            <span v-if="!onlyShow">
                           <!--新增tag，输入框-->
                <el-input class="input-new-tag"
                          style="width: 200px"
                          v-if="tagInputShow"
                          v-model="model.name"
                          size="small">
                </el-input>

                <el-button v-else
                           size="small"
                           @click="add">
                    新增
                </el-button>
                <el-button v-if="!tagInputShow"
                           size="small"
                           style="margin-left: 0px"
                           @click="edit">
                    编辑
                </el-button>
                <!--确定输入-->
                <el-button type="primary"
                           v-if="tagInputShow"
                           size="small"
                           @click="submit">
                    确定
                </el-button>
                <!--取消输入-->
                <el-button class="button-new-tag"
                           style="margin-left: 0"
                           v-if="tagInputShow"
                           size="small"
                           @click="cancel">
                    取消
                </el-button>
            </span>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'tags',
        props: ['tags','active','onlyShow'],
        data() {
            return {
                tagInputShow: '',
                editInputShow: false,
                model: {},
                currentState:''
            }
        },
        methods: {
            add() {
                this.tagInputShow = 'save';
            },
            edit() {
                if (this.active) {
                    var currentTag = _.findWhere(this.tags, {id: this.active});
                    this.model = Object.assign({},currentTag);
                    this.tagInputShow = 'edit';
                } else {
                    this.$message.error("未选中任何项");
                }


            },
            submit() {
                if (!this.model.name) {
                    this.$message.error("输入信息不能为空");
                    return;
                }
                this.$emit(this.tagInputShow, this.model);
                this.cancel();
            },
            cancel() {
                this.tagInputShow = '';
                this.model = {};
            },
            deleteItem(tag) {
                this.$emit('delete', tag);
            },
            // 选中
            select(tag) {
                // active属性与父组件实现双向绑定
                this.$emit('update:active', tag.id)
            },
        }
    }
</script>
<style scoped>
    .input-new-tag {
        width: 100px;
    }

    .tag {
        cursor: pointer;
    }

    .tag-active {
        background-color: #67c23a;
        color: white !important;
    }
</style>