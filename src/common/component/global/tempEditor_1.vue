<template>
    <div>
        <el-dropdown trigger="click" @command="handleCommand" v-if="option">
            <el-button type="primary"
                       size="mini">
                变量<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                        v-for="item in option"
                        :key="item.key"
                        :command="item">
                    {{item.label}}
                </el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown trigger="click" @command="handleCommand" v-if="fillOption">
            <el-button type="primary"
                       size="mini">
                填充内容<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                        v-for="item in fillOption"
                        :key="item.key"
                        :command="item">
                    {{item.label}}
                </el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>

        <rich :placeholder="placeholder"
              v-if="model"
              ref="rich"
              rich="content"
              :model.sync="model">
        </rich>
        <!--预览-->
        <el-card class="box-card mt10"
                 v-if="showPreview && previewText">
            <div v-html="previewText"></div>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "tempEditor",
        props: {
            option: {
                type: Array,
                default() {
                    return []
                }
            },
            fillOption: {
                type: Array,
                default() {
                    return []
                }
            },
            placeholder: {
                type: String,
                default: '请编写模板...'
            },
            showPreview: {
                type: Boolean,
                default: true
            },
            content: {
                type: String,
            }
        },
        model: {
            prop: 'content',
            event: 'contentChange'
        },
        data() {
            return {
                model: null,
                result: ''
            }
        },
        computed: {
            previewText() {
                let text = this.model.content || '';
                let result = this.model.content || '';
                let imgReg = /<img.*?>/g;
                let rpReg = /rp-param/;
                let idReg = /id="(\S+)"/;
                // 匹配到img元素
                let imgs = text.match(imgReg);
                if (imgs && imgs.length > 0) {
                    imgs.forEach(img => {
                        if (rpReg.test(img)) {
                            let idMatchArray = idReg.exec(img);
                            if (idMatchArray) {
                                let id = idMatchArray[1];
                                let item = _.findWhere(this.option, {key: id});
                                if (item) {
                                    text = text.replace(img, item.example);
                                    result = result.replace(img, `[${item.key}]`);
                                }
                                let fillItem = _.findWhere(this.fillOption, {key: id});
                                if (fillItem) {
                                    text = text.replace(img, `[${fillItem.label}]`);
                                    result = result.replace(img, `[${fillItem.key}]`);
                                }
                            }
                        }
                    });
                }
                // 更新result数据（v-model）
                this.$emit('contentChange', result);
                return text;
            }
        },
        methods: {
            handleCommand(command) {
                let tag = this.createTag(command);
                this.$refs['rich'].insertContent(tag);
            },
            createTag(command) {
                let word = command.label;
                let color = '#409EFF';
                let width = command.width || word.length * 16;
                let height = 22;
                let canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                let ctx = canvas.getContext('2d');
                ctx.save();
                ctx.strokeStyle = color;
                ctx.strokeRect(0, 0, width, height);
                ctx.restore();
                ctx.font = "20px";
                ctx.fillStyle = color;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(word, width / 2, height / 2);
                let url = canvas.toDataURL("image/png");
                let img = `<img class="rp-param" id="${command.key}" src="${url}" style="border-radius: 5px;border: 1px solid ${color};transform: translateY(5px)">`;
                return img;
            },
            getResult() {
                return this.result;
            },
            render() {
                let text = this.content || '';
                let keyStrReg = /\[.*?\]/g;
                // 匹配到所有的keys
                let keyStrs = text.match(keyStrReg);
                keyStrs = _.uniq(keyStrs);
                let keyReg = /\[(.*)\]/;
                let options = this.fillOption.concat(this.option);
                // 遍历所有用到的key
                keyStrs.forEach(keyStr => {
                    let key = keyReg.exec(keyStr)[1];
                    let option = _.findWhere(options, {key: key});
                    let img = this.createTag(option);
                    let rpReg = new RegExp(`\\[${key}\\]`,'g');
                    text = text.replace(rpReg, img);
                });
                this.model = {
                    content: text
                }
            }
        },
        created() {
            this.render();
        }
    }
</script>

<style scoped>

</style>