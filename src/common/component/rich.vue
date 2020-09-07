<template>
    <div >
        <textarea :id="comId" v-if="comId"></textarea>

    </div>
</template>
<script>
    import enumConfig from 'config/enum';
    export default {
        name: "rich",
        props: {
            model: {
                type: Object,
                default() {
                    return {};
                }
            },
            rich: {
                type: String,
            },
            text: {
                type: String,
            },
            id: {
                type: String
            },
            size: {
                type: String,
                default: 'common'
            },
            height:{
                type: Number,
                default: 200
            },
            placeholder:{
                type: String,
                default: ''
            },
            cos:{
                type: Object
            }
        },
        data() {
            return {
                comId: '',
                editor:null
            }
        },
        methods: {
            // 改变model的值
            changeModel(editor) {
                let rich = editor.getContent();
                let text = editor.getContent({format: 'text'});
                if(this.rich){
                    this.$set(this.model, this.rich, rich);
                }else{
                    this.$notify.error({
                        title: '提示',
                        message:"请指定一个有效的key"
                    });
                }
                if(this.text){
                    this.$set(this.model, this.text, text);
                }
                this.$emit('update:model', this.model);
            },
            insertContent(content){
                // console.log('rich组件',content);
                this.editor.insertContent(content);

            }
        },
        created() {
            let latestId = this.$store.state.tinymceMaxId || 0;
            let comId = 'tiny' + (latestId + 1);
            if (this.id) {
                comId = this.id;
            }
            this.comId = comId;
            this.$store.commit('setProp', {
                key: 'tinymceMaxId',
                val: latestId + 1
            });
        },
        mounted() {
            let that = this;
            let plugins = {
                mini: 'image link',
                large: 'preview searchreplace autolink directionality ' +
                    'visualblocks visualchars fullscreen image link media template ' +
                    'code codesample table charmap hr pagebreak nonbreaking anchor insertdatetime' +
                    ' advlist lists wordcount imagetools textpattern help emoticons autosave' +
                    ' autoresize',
                common: 'preview searchreplace autolink directionality paste ' +
                    'visualblocks visualchars fullscreen image link media template ' +
                    'code codesample table charmap hr pagebreak nonbreaking anchor insertdatetime' +
                    ' advlist lists wordcount imagetools textpattern help emoticons autosave' +
                    ' autoresize lineheight',
                full:'' // 有时间再去设计
            };
            let toolbar = {
                mini:'undo redo forecolor backcolor formatting alignment | link image',
                large:'fullscreen preview code undo redo forecolor backcolor formatting  list alignment |' +
                    '  image media charmap link hr pagebreak table',
                common:'fullscreen preview code undo paste redo forecolor backcolor formatting  list alignment | removeformat' +
                    '  image charmap link',
                full:'' // 有时间再去设计
            };
            let toolbar_groups =  {
                mini:{
                    alignment: {
                        icon: 'align-left',
                        tooltip: 'alignment',
                        items: 'alignleft aligncenter alignright alignjustify',
                    },
                    formatting:{
                        icon:'format',
                        items:'fontselect fontsizeselect bold italic underline'
                    }
                },
                large:{
                    formatting: {
                        icon:'format',
                        tooltip: 'Formatting',
                        items: 'fontselect fontsizeselect bold italic underline strikethrough | blockquote subscript superscript | removeformat',
                    },
                    alignment: {
                        icon: 'align-left',
                        tooltip: 'alignment',
                        items: 'alignleft aligncenter alignright alignjustify outdent indent',
                    },
                    font:{
                        icon:'edit-block',
                        items:''
                    },
                    list:{
                        icon:'ordered-list',
                        items:'bullist numlist'
                    },
                },
                common:{
                    formatting: {
                        icon:'format',
                        tooltip: 'Formatting',
                        items: 'fontsizeselect bold italic underline strikethrough | blockquote subscript superscript',
                    },
                    alignment: {
                        icon: 'align-left',
                        tooltip: 'alignment',
                        items: 'alignleft aligncenter alignright alignjustify outdent indent lineheight',
                    },
                    font:{
                        icon:'edit-block',
                        items:''
                    },
                    list:{
                        icon:'ordered-list',
                        items:'bullist numlist'
                    },
                },
                full:'' // 有时间再去设计
            };
            let fontsize_formats = '12px 13px 14px 15px 16px 17px 18px 19px 20px 21px 22px 23px 24px 25px 26px 27px 28px 30px 32px 34px 36px 38px 40px 48px 56px 72px';
            // let font_formats = '微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;' +
            //     '苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;' +
            //     '宋体=simsun,serif;' +
            //     '仿宋体=FangSong,serif;' +
            //     '黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;' +
            //     'Arial Black=arial black,avant garde;' +
            //     'Book Antiqua=book antiqua,palatino;';
            tinymce.init({
                selector: `#${this.comId}`,
                language: 'zh_CN',
                branding:false,
                menubar: false,
                placeholder:this.placeholder,
                plugins:plugins[this.size],
                toolbar:toolbar[this.size],
                paste_remove_styles_if_webkit: true, //TinyMCE认针对webkit生成样式的过滤器。
                paste_as_text: true, //设置粘贴为纯文本
                toolbar_groups:toolbar_groups[this.size],
                images_upload_url: '',
                images_upload_handler(blobInfo, succFun, failFun){
                    let file = blobInfo.blob();
                    that.$store.state.cos.send({
                        files:[{name:file.name,file:file}],
                        type:enumConfig['COS_TYPE_PUBLIC'],
                        onSuccess(res){
                            let url = res.urls[0];
                            succFun(url);
                        },
                        onFailed(err){
                            console.log(err);
                        }
                    })
                },
                fontsize_formats,
                // font_formats,
                height: this.height, //编辑器高度
                min_height: 200,
            }).then(editors => {
                // 初始化设置编辑区内容
                // let curEditor = tinymce.get(this.comId);
                let curEditor = editors[0];

                this.editor = curEditor;

                // 输入和执行工具栏命令时触发
                curEditor && curEditor.on('input', e => {
                    that.changeModel(curEditor);
                });
                curEditor && curEditor.on('change', e => {
                    that.changeModel(curEditor);
                });
                curEditor && curEditor.on('ExecCommand', e => {
                    that.changeModel(curEditor);
                });
                // 如果有初始值，则渲染初始值
                let rich = that.model[that.rich];
                if(rich){
                    curEditor && curEditor.setContent(rich,{format: 'html'});
                }
            });

        }
    }
</script>

<style scoped lang="less">

</style>