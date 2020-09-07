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
<!--        <el-card class="box-card mt10"-->
<!--                 v-if="showPreview && previewText">-->
<!--            <div v-html="previewText"></div>-->
<!--        </el-card>-->
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
                result: '',
                previewText: ''
            }
        },
        watch: {
            'model.content': {
                handler: function (n, o) {
                    this.previewText = n || '';
                    let result = n || '';
                    let keyStrReg = /\[.*?\]/g;
                    // 匹配到所有的keys
                    let keyStrs = this.previewText.match(keyStrReg);
                    // keyStrs = _.uniq(keyStrs);
                    // 遍历所有用到的key
                    if(keyStrs){
                        keyStrs.forEach(keyStr => {
                            let item = _.findWhere(this.option, {key: keyStr});
                            if (item) {
                                this.previewText = this.previewText.replace(keyStr, item.example);
                                result = result.replace(keyStr, `${item.key}`);
                            }
                            let fillItem = _.findWhere(this.fillOption, {key: keyStr});
                            if (fillItem) {
                                this.previewText = this.previewText.replace(keyStr, `${fillItem.key}`);
                                result = result.replace(keyStr, `${fillItem.key}`);
                            }
                        });
                    }
                    this.$emit('contentChange', result);
                    this.$emit('showText', this.previewText);
                },
                deep: true
            },
        },
        computed: {
            // previewText() {
            //     let text = this.model.content || '';
            //     let result = this.model.content || '';
            //     let keyStrReg = /\[.*?\]/g;
            //     // 匹配到所有的keys
            //     let keyStrs = text.match(keyStrReg);
            //     keyStrs = _.uniq(keyStrs);
            //     // 遍历所有用到的key
            //     keyStrs.forEach(keyStr => {
            //         let item = _.findWhere(this.option, {key: keyStr});
            //         if (item) {
            //             text = text.replace(keyStr, item.example);
            //             result = result.replace(keyStr, `${item.key}`);
            //         }
            //         let fillItem = _.findWhere(this.fillOption, {key: keyStr});
            //         if (fillItem) {
            //             text = text.replace(keyStr, `${fillItem.key}`);
            //             result = result.replace(keyStr, `${fillItem.key}`);
            //         }
            //     });
            //     // 更新result数据（v-model）
            //     // this.$emit('contentChange', result);
            //     // this.$emit('showText', text);
            // }
        },
        methods: {
            handleCommand(command) {
                this.$refs['rich'].insertContent(command.key);
            },
            getResult() {
                return this.result;
            },
            render() {
                let text = this.content || '';
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