<template>
    <div>
        <el-card class="box-card"
                 :style="{height:height?height:'auto'}">
            <div slot="header" class="clearfix">
                <span>权限</span>
            </div>
            <div class="border-bottom pb1rem">
                <el-button type="primary" size="mini" @click="selectAll">全选</el-button>
                <el-button type="default" size="mini" @click="cancelAll">全不选</el-button>
            </div>
            <div>
                <el-row>
                    <el-col :span="12"
                            style="height: 80%;overflow-y: scroll"
                            class="border-right hide-scrollbar">
                        <ul class="padding10">
                            <li v-for="(pms,index) in pmsList"
                                @click="selectChild(pms)">
                                <a class="item"
                                   :class="{'border-top':index>0,'active':pms.id == curPms.id}">{{pms.name}}</a>
                            </li>
                        </ul>
                    </el-col>
                    <el-col :span="12" style="height: 80%;overflow-y: scroll" class="hide-scrollbar">
                        <ul class="padding10">
                            <li v-for="child in curPms.items" class="child-item" :key="child.id">
                                <el-checkbox v-model="child.checked">{{child.name}}</el-checkbox>
                            </li>
                        </ul>
                    </el-col>
                </el-row>
            </div>
        </el-card>
    </div>
</template>
<script>
    export default {
        name: "BindPms",
        props: [
            'height',
        ],
        data() {
            return {
                curPms: {},
                pmsList:[],

            }
        },
        methods: {
            // 权限全选
            selectAll() {
                var that = this;
                for(let i=0;i<this.pmsList.length;i++){
                    for(let j=0;j<that.pmsList[i].items.length;j++){
                        that.$set(that.pmsList[i].items[j],'checked',true);
                    }
                }
            },
            // 权限全不选
            cancelAll() {
                var that = this;
                for(let i=0;i<this.pmsList.length;i++){
                    for(let j=0;j<that.pmsList[i].items.length;j++){
                        that.$set(that.pmsList[i].items[j],'checked',false);
                    }
                }
            },
            selectChild(pms) {
                this.curPms = pms;
            },
            getResult() {
                var that = this;
                var pms = [];
                _.each(that.pmsList, function (parent) {
                    _.each(parent.items, function (child) {
                        if (child.checked) {
                            pms.push(child.id);
                        }
                    })
                });
                return pms;
            },
            initData(pms){
                var that = this;
               _.each(that.pmsList,function (parent) {
                   _.each(parent.items, function (child) {
                      if(pms.indexOf(child.id)>=0){
                          that.$set(child,'checked',true);
                      }
                   })
               })
            },
            initList(data){
                this.$set(this,'pmsList',data);
                this.curPms = this.pmsList[0];
            }
        }
    }
</script>

<style scoped lang="less">

    .item {
        display: block;
        width: 100%;
        height: 100%;
        padding: 5px;
        cursor: pointer;
        height: 2rem;
        line-height: 2rem;
        text-decoration: none;
    }

    .item:hover {
        background: #e4e4e4;
        font-style: normal;

    }

    .border-top {
        border-top: 1px solid lighten(#e4e4e4, 10%);
    }

    .child-item {
        height: 2rem;
        line-height: 2rem;
    }

    .active {
        background: #e4e4e4;
    }

</style>