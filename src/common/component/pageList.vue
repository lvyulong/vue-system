<!--created By Lvyl-->
<!--功能：
1、根据slot内容填充列表，即列表显示的列由调用该组件的父组件决定；
2、该组件处理了翻页功能，翻页相关的参数_page、_page_size在该组件内设置；
3、该组件根据地址栏参数来筛选列表，除了翻页相关的参数在该组件内设置，其余的筛选条件都应该在父组件中设置；
    父组件中可以随意设置url的查询参数，该组件都能做出响应刷新列表。
-->
<template>
    <div>
        <slot v-bind:list="list"></slot>
        <div class="mt10">
            <el-pagination
                    @size-change="sizeChange"
                    @current-change="pageChange"
                    :current-page="meta.currentPage"
                    :page-sizes="pageSizes"
                    :page-size="meta.perPage"
                    :layout="layout"
                    :total="meta.totalCount">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    export default {
        name: "pageList",
        props:['pageListApi','ignore'],
        data() {
            return {
                search: {},
                list: [],
                meta: {
                    _page_size: 20,
                    currentPage: 1
                },
                pageSizes: [10, 20, 50, 100],
                layout: 'total, sizes, prev, pager, next, jumper',
            }
        },
        methods: {
            // 每页显示条数更改触发
            sizeChange(size) {
                this.$router.push({
                    name: this.$route.name,
                    query: Object.assign({}, this.search, {_page_size: size, _page: 1})
                })
            },
            // 翻页
            pageChange(page) {
                this.$router.push({
                    name: this.$route.name,
                    query: Object.assign({}, this.search, {_page: page})
                })
            },
            // 获取列表数据
            getList() {
                var that = this;
                var data;
                // 如果有需要忽略的字段，则去掉查询参数里面的这些字段
                if(this.ignore&&this.ignore.length>0){
                    data = myTool.deleteProps(this.search,this.ignore)
                }else{
                    data = Object.assign({},this.search);
                }
                this.pageListApi.query({params: data}).then(function (res) {
                    that.list = res.data.items;
                    that.meta = res.data['_meta'];
                });
            }
        },
        created: function () {
            // 初始化页面
            this.search = Object.assign({},this.$route.query);
            this.getList();
        },
        watch: {
            // 监听路由，刷新列表
            $route: {
                handler(n, o) {
                    this.search = Object.assign({},this.$route.query);
                    this.getList();
                },
                deep: true
            }
        }
    }
</script>

<style lang="less" scoped>

</style>