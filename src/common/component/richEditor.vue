<template>
    <div class="wangeditor" ref="wangEditor"></div>
</template>
<script>
    import WangEditor from "wangeditor";
    export default {
        name: "RichEditor",
        props: [
            "content",
        ],
        data() {
            return {
                editor: {},
            };
        },
        mounted: function () {
            let that = this;
            var containner = that.$refs['wangEditor'];
            that.editor = new WangEditor(containner);
            that.editor.customConfig.onchange = function (html) {
                // 内容变化，将最新的内容抛出去
                that.$emit('update:content', html);
            };
            that.editor.customConfig.menus = [
                'head',  // 标题
                'bold',  // 粗体
                'fontSize',  // 字号
                'fontName',  // 字体
                'italic',  // 斜体
                'underline',  // 下划线
                'strikeThrough',  // 删除线
                'foreColor',  // 文字颜色
                'backColor',  // 背景颜色
                'link',  // 插入链接
                'list',  // 列表
                'justify',  // 对齐方式
                // 'quote',  // 引用
                // 'emoticon',  // 表情
                // 'image',  // 插入图片
                // 'table',  // 表格
                // 'video',  // 插入视频
                // 'code',  // 插入代码
                'undo',  // 撤销
                // 'redo'  // 重复
            ];
            that.editor.customConfig.colors = [
                '#000000',
                '#cccccc',
                '#dddddd',
                '#e4e4e4',
                '#1c487f',
                '#4d80bf',
                '#c24f4a',
                '#8baa4a',
                '#7b5ba1',
                '#46acc8',
                '#f9963b',
                '#ffffff'
            ];
            that.editor.create();
            setTimeout(function () {
                // 初始化内容
                if (that.content) {
                    that.editor.txt.html(that.content);
                }
            }, 500)
        }
    };
</script>

<style scoped>

</style>
