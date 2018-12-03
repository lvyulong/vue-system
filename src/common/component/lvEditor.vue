<template>
  <div class="editor">
        <div id="div1" class="toolbar"></div>
        <div class="middle" v-if="separate"></div>
        <div id="div2" class="text" > 
        </div>
  </div>
</template>
<script>
import WangEditor from "wangEditor";
export default {
  name: "LvEditor",
  props: [
    "content",
    "separate",     //菜单和编辑区分开    
    "width",
    "minHeight",    //使用minHeight可实现自动增高，；不和height一起使用
    "maxHeight",    //自增，增到maxHeight则进行滚动，和minHeight配合使用；
    "height",       //设置height，则超过height自动滚动；不要和minHeight/maxHeight一起使用
    "menus",        //菜单,数组,优先使用传进来的菜单项
    "upload",       //上传图片到服务器，不能与base64一起使用
    "base64",       //上传的图片转成base64字符串，属于content的一部分，不与upload一起使用
  ],
  data() {
    return {
      editor:{}
    };
  },
  methods: {},
  mounted: function() {
    let that = this;
    const editor = new WangEditor("#div1", "#div2");
    this.editor = editor;
    //当编辑器中内容改变时，触发更新父级属性content
    editor.customConfig.onchange = function(html) {
      // console.log(html)
      that.$emit("update:content", html);
    };

    // 菜单配置
    if (this.menus) {
      editor.customConfig.menus = this.menus;
    } else {
      editor.customConfig.menus = [
        "head", // 标题
        "bold", // 粗体
        "fontSize", // 字号
        "fontName", // 字体
        "italic", // 斜体
        "underline", // 下划线
        "strikeThrough", // 删除线
        "foreColor", // 文字颜色
        "backColor", // 背景颜色
        "link", // 插入链接
        "list", // 列表
        "justify", // 对齐方式
        "quote", // 引用
        "emoticon", // 表情
        "image", // 插入图片
        "table", // 表格
        // 'video',  // 插入视频
        "code", // 插入代码
        "undo", // 撤销
        "redo" // 重复
      ];
    }

    // 配置颜色
    editor.customConfig.colors = [
      "#000000",
      "#eeece0",
      "#1c487f",
      "#4d80bf",
      "#c24f4a",
      "#8baa4a",
      "#7b5ba1",
      "#46acc8",
      "#f9963b",
      "#ffffff"
    ];

    // 表情面板可以有多个 tab ，因此要配置成一个数组。数组每个元素代表一个 tab 的配置
    editor.customConfig.emotions = [
      {
        title: "默认",
        type: "image",
        content: [
          {
            alt: "[坏笑]",
            src:
              "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/50/pcmoren_huaixiao_org.png"
          },
          {
            alt: "[舔屏]",
            src:
              "http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/40/pcmoren_tian_org.png"
          }
        ]
      },
      {
        title: "emoji",
        type: "emoji",
        content: ["😀", "😃", "😄", "😁", "😆"]
      }
    ];

    // 自定义字体
    // editor.customConfig.fontNames = [
    //     '宋体',
    //     '微软雅黑',
    //     'Arial',
    //     'Tahoma',
    //     'Verdana'
    // ]

    //配置z-index，默认是10000
    // editor.customConfig.zIndex = 100

    //粘贴样式的过滤，默认开启
    // editor.customConfig.pasteFilterStyle = false

    //忽略粘贴内容中的图片，默认关闭的
    // editor.customConfig.pasteIgnoreImg = true

    // 自定义处理粘贴的文本内容
    // editor.customConfig.pasteTextHandle = function (content) {
    //     // content 即粘贴过来的内容（html 或 纯文本），可进行自定义处理然后返回
    //     return content + '<p>在粘贴内容后面追加一行</p>'
    // }

    //插入网络图片回调
    // editor.customConfig.linkImgCallback = function (url) {
    //     console.log(url) // url 即插入图片的地址
    // }

    //插入网络图片的校验
    // editor.customConfig.linkImgCheck = function (src) {
    //     console.log(src) // 图片的链接
    //     return true // 返回 true 表示校验成功
    //     // return '验证失败' // 返回字符串，即校验失败的提示信息
    // }

    // 隐藏“网络图片”tab
    // editor.customConfig.showLinkImg = false

    // 上传图片到服务器
    if(this.upload){
        editor.customConfig.uploadImgServer = this.upload; //上传到服务器
    }
    if(this.base64){
        editor.customConfig.uploadImgShowBase64 = true;     // 使用 base64 保存图片
    }
    
    //插入链接的校验
    // editor.customConfig.linkCheck = function (text, link) {
    //     console.log(text) // 插入的文字
    //     console.log(link) // 插入的链接

    //     return true // 返回 true 表示校验成功
    //     // return '验证失败' // 返回字符串，即校验失败的提示信息
    // }

    //onfocus、onblur触发
    // editor.customConfig.onfocus = function () {
    //     console.log("onfocus")
    // }
    // editor.customConfig.onblur = function (html) {
    //     // html 即编辑器中的内容
    //     console.log('onblur', html)
    // }

    // 创建编辑器
    editor.create();

    // 从父级拿到初始化内容
    editor.txt.html(this.content);
    
    //编辑器editor区样式
    let editorStyle = document.querySelector(".editor").style;
    editorStyle.width = this.width || "100%";

    // 编辑区text区的样式
    let textStyle = document.querySelector(".text").style;
    textStyle.minHeight = this.minHeight || "100px";
    textStyle.height = this.height;
    textStyle.maxHeight = this.maxHeight || "500px";
    // 去掉默认的滚动
    document.querySelector(".w-e-text").style.overflowY = "auto";
  },
  watch:{
    content:function(val){
      this.editor.txt.html(val);
    }
  }
};
</script>

<style scoped>
.toolbar {
  border: 1px solid #ccc;
}
.text {
  width: 100%;
  border: 1px solid #ccc;
  overflow-y: scroll;
  text-align: left;
}
.middle {
  padding: 5px 0;
}
</style>
