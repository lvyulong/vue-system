
<!--usage:-->
<!--一、属性：-->
    <!--1、url：后端api接口-->
    <!--2、max：最大上传文件数-->
    <!--3、multiple：可以一次多选文件-->
    <!--4、accept：接受的文件类型，数组，数组中的项为可以用来判断文件类型的关键字，如：image/png、text/plain、sheet..-->
<!--二、方法-->
    <!--1、upload(data):上传文件到服务器，data为需要传入的额外参数-->
<!--三、事件回调-->
    <!--1、success：上传成功的回调-->
    <!--2、error：上传失败的回调-->
<!--四、注意-->
    <!--1、success、error这两个回调每个文件上传都会触发，并不是所有文件都处理完才触发，此处要进一步修改-->
<template>
    <div>
        <div class="file-block">
            <el-button class="file-button" type="primary" size="small">选择文件</el-button>
            <vue-file-upload
                    class="file-upload"
                    :url="url"
                    :max="max"
                    :multiple="multiple"
                    :filters="filters()"
                    :events="cbEvents()"
                    :request-options="reqopts"
                    @onAdd="onAddItem"
                    ref="vueFileUploader">
            </vue-file-upload>
        </div>
        <!--<div v-if="files.length>1" class="mt10">-->
            <!--<el-button type="primary" plain size="mini" @click="clearAll">清空</el-button>-->
        <!--</div>-->
        <ul>
            <li v-for="file in files" class="mt10">
                <span>{{file.name}}</span>
                <i class="el-icon-error red" @click="deleteItem(file)"></i>
            </li>
        </ul>

    </div>
</template>
<script>
    import VueFileUpload from 'vue-file-upload';
    export default {
        name: 'fileUpload',
        props: {
            // 向后端提交的接口
            url: {
                type: String,
                required: true
            },
            max: {
                type: Number
            },
            multiple: Boolean,
            accept: Array,
            size:Number
        },
        data() {
            return {
                files: [],
                //xhr请求附带参数
                reqopts: {
                    // formData: {
                    //     // tokens: 'tttttttttttttt'
                    // },
                    // responseType: 'json',
                    // withCredentials: false
                },
                completeCount:0,
                errorFiles:[],
                loadObj:null
            }
        },
        methods: {
            // 回调函数
            cbEvents() {

                return {
                    //上传完成回调，不论成功或失败都调用
                    onCompleteUpload: (file, response, status, header) => {
                        // 将上传错误的文件，放到errorFiles，一并抛出
                        if(status!=200){
                            this.errorFiles.push(file)
                        }
                        this.completeCount ++;
                        if(this.completeCount == this.files.length){
                            this.$refs.vueFileUploader.clearAll();
                            this.files =  [];
                            this.$emit('complete',this.errorFiles);
                            if(this.loadObj){
                                this.loadObj.close();
                                this.loadObj = null;
                            }
                            this.errorFiles = [];
                            this.completeCount = 0;
                        }
                    },
                    //上传进度回调
                    // onProgressUpload:(file,progress) => {
                    //
                    //     console.log("进度");
                    //     console.log(progress);
                    //
                    // },
                    //上传失败回调，每个文件上传失败都会回调
                    // onErrorUpload:(file, response, status, header) => {
                    //     this.$emit('error',file);
                    // },
                    // 上传成功回调,每个文件上传成功都会回调
                    // onSuccessUpload: (file, response, status, header) => {
                    //
                    // },
                    onAddFileFail: (file,failFilter) => {
                        if (failFilter.name=="typeFilter"){
                            this.$message.error("文件类型不正确");
                        }
                        if (failFilter.name=="maxLimit"){
                            this.$message.error("超过最大文件数限制");
                        }
                        if (failFilter.name=="sizeFilter"){
                            console.log(file)
                            this.$message.error(`单个文件大小不能超过${this.size}`);
                        }
                    }
                }
            },

            // 文件过滤器
            filters() {
                var that = this;
                var current = [];
                // 所有的过滤器（后续再加）
                function filterFn(types) {
                    var fn = function (file) {
                        let pass = false;
                        for (var i=0;i<types.length;i++){
                            if (file.type.indexOf(types[i]) !== -1){
                                pass = true;
                                break;
                            }
                        }
                        return pass;
                    };
                    return fn;
                }
                function sizeFn(size) {
                    var fn = function (file) {
                        if(file.size>size){
                            return false;
                        }
                        return true;
                    };
                    return fn;
                }
                if (that.accept&&that.accept.length>0) {
                    current.push({
                        name:'typeFilter',
                        fn:filterFn(that.accept)
                    })
                }
                if (that.size) {
                    current.push({
                        name:'sizeFilter',
                        fn:sizeFn(that.size)
                    })
                }
                return current;
            },
            // 上传文件
            upload(data) {
                var that = this;
                // 开始上传文件，显示loading
                this.loadObj = this.$loading({
                    text:'正在上传,请耐心等待...'
                });
                if (data){
                    //设置formdata
                    _.each(data,function (v,k) {
                        that.$refs.vueFileUploader.setFormDataItem( k, v );
                    })
                }
                this.$refs.vueFileUploader.uploadAll();
            },
            // 添加新文件时触发
            onAddItem(files){
               this.files = files;
            },
            //移除单个文件
            deleteItem(file){
                file.remove();
            },
            // 清空文件
            clearAll(){
                this.$refs.vueFileUploader.clearAll()//清空队列文件
            }
        },
        components: {
            VueFileUpload
        }
    }
</script>
<style lang="less" scoped>
.file-block{
    position: relative;
    overflow: hidden;
    height: 32px;
    width: 80px;
    .file-button{
        position: absolute;
        top: 0;
        left: 0;
    }
    .file-upload{
        position: absolute;
        height: 100%;
        width: 80px;
        top: 0;
        left: 0;
        opacity: 0;
        z-index: 10;
        overflow: hidden;
    }
}
</style>
