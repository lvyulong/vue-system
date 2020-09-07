<template>
    <div>
        <el-form-item v-for="field in fields"
                      :key="field.key"
                      :prop="field.key">
            <!--label-->
            <template slot="label" v-if="!field.noLabel">
                <span>{{field.label}}</span>
                <el-tooltip class="pointer"
                            effect="light"
                            placement="top-start"
                            v-if="field.detail">
                    <div slot="content" v-html="field.detail"></div>
                    <i class="el-icon-question" style="color: orange"></i>
                </el-tooltip>
            </template>
            <!--文本-->
            <el-input v-model="model[field.key]"
                      v-if="field.type == 'text'"
                      type="text"
                      :readonly="field.readonly"
                      :disabled="field.disabled">
            </el-input>
            <!--数字-->
            <el-input v-model="model[field.key]"
                      v-if="field.type == 'number'"
                      type="number"
                      :readonly="field.readonly"
                      :disabled="field.disabled">
            </el-input>
            <!--文本域-->
            <el-input v-model="model[field.key]"
                      v-if="field.type == 'textarea'"
                      type="textarea"
                      rows="5"
                      :readonly="field.readonly"
                      :disabled="field.disabled">
            </el-input>
            <!--单选-->
            <el-radio-group v-model="model[field.key]"
                            v-if="field.type == 'radio'">
                <el-radio :label="option.id"
                          v-for="(option,optionIndex) in field.option"
                          :key="option.id">
                    {{option.name}}
                </el-radio>
            </el-radio-group>

            <!--多选-->
            <el-checkbox-group v-model="model[field.key]"
                               v-if="field.type == 'checkbox'">
                <el-checkbox :label="option.value" :name="field.key"
                             v-for="(option,optionIndex) in field.option" :key="option.value">
                    {{option.label}}
                </el-checkbox>
            </el-checkbox-group>
            <!--下拉选择-->
            <el-select v-model="model[field.key]"
                       v-if="field.type == 'select'"
                       :multiple="field.multiple || false"
                       :clearable="field.clearable || false"
                       :filterable="field.filterable || false"
                       :disabled="field.disabled || false"
                       style="width: 100%"
                       placeholder="请选择">
                <el-option
                        v-for="item in field.option"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                </el-option>
            </el-select>
            <!--switch-->
            <!--value使用布尔类型-->
            <el-switch v-model="model[field.key]"
                       v-if="field.type == 'switch' && field.valueType=='Boolean'">
            </el-switch>
            <el-switch v-model="model[field.key]"
                       v-if="field.type == 'switch' && field.valueType!='Boolean'"
                       :active-value=1
                       :inactive-value=0>
            </el-switch>
            <!--富文本编辑器-->
            <rich v-if="field.type == 'rich'"
                  size="large"
                  :text="field.subKey"
                  :placeholder="field.placeholder"
                  :rich="field.key"
                  :size="field.size"
                  :model.sync="model">
            </rich>
            <!--dateTimePicker-->
            <el-date-picker
                    v-if="field.type == 'dateTime'"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    style="width: 100%"
                    v-model="model[field.key]"
                    type="datetime"
                    placeholder="选择日期时间">
            </el-date-picker>
            <!--颜色-->
            <el-color-picker v-if="field.type == 'color'" v-model="model[field.key]"></el-color-picker>
            <!--上传-->
            <div v-if="field.type == 'upload'">
                <file-upload :hide-list="true"
                             style="transform: translateY(5px)"
                             @add="addFile"
                             :ref="'upload' + field.key"
                             :extra="{key:field.key,cosType:field.cosType}">
                </file-upload>
                <!--图片-->
                <div class="preview-image-wrap"
                     v-if="field.media == 'image' && model[field.key]">
                    <media-cos :cos-type="field.cosType" :cos-key="model[field.key]" :type="field.media"></media-cos>
                    <el-button icon="el-icon-delete"
                               type="danger"
                               class="trash"
                               style="position: absolute;top: -15px;right: -10px;"
                               size="mini"
                               @click="deleteMedia(field.key)"
                               circle>
                    </el-button>
                </div>
                <!--视频-->
                <div class="preview-video-wrap mt10"
                     v-if="field.media == 'video' && model[field.key]">
                    <media-cos :cos-type="field.cosType" :cos-key="model[field.key]" :type="field.media"></media-cos>
                    <el-button icon="el-icon-delete"
                               type="danger"
                               class="trash ml10"
                               size="mini"
                               @click="deleteMedia(field.key)"
                               circle>
                    </el-button>
                </div>
                <!--音频-->
                <div class="preview-audio-wrap mt10"
                     v-if="field.media == 'audio' && model[field.key]">
                    <media-cos :cos-type="field.cosType" :cos-key="model[field.key]" :type="field.media"></media-cos>
                    <el-button icon="el-icon-delete"
                               type="danger"
                               class="trash ml10"
                               size="mini"
                               @click="deleteMedia(field.key)"
                               circle>
                    </el-button>
                </div>
            </div>
            <!--插槽自定义-->
            <div v-if="field.type == 'slot'">
                <slot :name="field.key" :field="field"></slot>
            </div>
            <!--描述性文字-->
            <div v-if="field.desc" class="gray mt5">
                {{field.desc}}
            </div>
        </el-form-item>
    </div>
</template>
<script>
    /*
    *   label:标签
        key：属性名称
        type:支持的类型有text、number、radio、rich、color.datetime、upload等
        media:image/audio/video ，type为upload时有效
        size:文件限制大小 ，type为upload时有效
        required:true/false
        option:array(value/label)
        multiple,
        method 上传文件的接口
    * */
    import enumConfig from 'config/enum';
    export default {
        name: "formField",
        props: [
            'model', 'fields','cos',
        ],
        data() {
            return {
                enumConfig:enumConfig
            }
        },
        methods: {
            deleteMedia(key){
                this.$set(this.model,key,'');
            },
            addFile(files,extra){
                let that = this;
                let {key} = extra;
               // file添加成功上传到cos
                let type = extra.cosType || enumConfig['COS_TYPE_PUBLIC'];
                this.cos.send({
                    files:files,
                    type:type,
                    onSuccess(res){
                        // 非公开的，存key
                        if(type != enumConfig['COS_TYPE_PUBLIC']){
                            that.$set(that.model,key,res.keys[0]);
                        }else{
                            that.$set(that.model,key,res.urls[0]);
                        }
                        let refName = `upload${key}`;
                        that.$refs[refName][0].clearAll();
                    }
                })
            }
        },
        mounted() {},
    }
</script>
<style scoped lang="less">
    .preview-image-wrap{
        margin-top: 10px;
        border: 1px solid #e4e4e4;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .trash{
        width: 30px;
        height: 30px;
    }
    .preview-audio-wrap{
        display: flex;
        align-items: center;
    }
    .preview-video-wrap{
        display: flex;
        align-items: center;
    }
</style>