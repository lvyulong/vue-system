<template>
    <div>
        <el-pagination
                @size-change="sizeChange"
                @current-change="pageChange"
                :current-page="meta.currentPage"
                :page-sizes="pageSizes || defaultPageSizes"
                :page-size="meta.perPage"
                layout="total, sizes, prev, pager, next, jumper"
                :total="meta.totalCount">
        </el-pagination>
    </div>
</template>
<script>
    export default {
        name: "pagination",
        props: ['meta','pageSizes'],
        data() {
            return {
                currentPage: 1,
                defaultPageSizes: [10, 20, 50, 100, 200]
            }
        },
        methods: {
            sizeChange(val) {
                this.$set(this.meta, 'currentPage', 1);
                this.$set(this.meta, 'perPage', val);
                let param = {
                    _page_size: this.meta.perPage,
                    _page: this.meta.currentPage
                };
                this.$emit('pageChange', param);
            },
            pageChange(val) {
                this.$set(this.meta, 'currentPage', val);
                let param = {
                    _page_size: this.meta.perPage,
                    _page: this.meta.currentPage
                };
                this.$emit('pageChange', param);
            },
        }
    }
</script>
<style scoped>

</style>