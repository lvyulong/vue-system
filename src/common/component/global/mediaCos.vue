<template>
   <div>
       <video v-if="type == 'video'" controls :src="url" style="width: 320px;height: 180px"></video>
       <audio v-else-if="type == 'audio'" controls :src="url"></audio>
       <el-image
               v-else-if="type == 'image'"
               class="image"
               :src="url"
               :preview-src-list="[url]"
               fit="scale-down">
       </el-image>
   </div>
</template>
<script>
    import enumConfig from 'config/enum';
    export default {
        name: "mediaCos",
        props: {
            cosKey: {
                type: String,
                required: true
            },
            type:{
                type: String,
                required: true
            },
            cosType: {
                type: Number,
                default:enumConfig['COS_TYPE_PUBLIC']
            }
        },
        data() {
            return {
                url: ''
            }
        },
        created() {
            if (this.cosType != enumConfig['COS_TYPE_PUBLIC']) {
                // 非公开的，需要去后端取url
                this.resourceApi.one({
                    params: {
                        key: this.cosKey,
                        type: this.cosType,
                    }
                }).then(res => {
                    this.url = res.data.url;
                })
            } else {
                // 公开的，可以直接用cosKey,cosKey就是可以访问的资源链接
                this.url = this.cosKey;
            }
        }
    }
</script>
<style lang="less" scoped>
    .image{
        max-width: 200px;
        max-height: 200px;
    }
</style>