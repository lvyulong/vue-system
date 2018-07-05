

const LvlPlugin = {};
LvlPlugin.install = function (Vue, options) {
    // 1. 添加全局方法或属性
    Vue.tip = function () {
      alert('Eallon is good')
    }
    
    // 2. 添加全局资源：指令、组件
    // Vue.component('back',Back);

    // 3. 混入组件
    Vue.mixin({
            
    })
  
    // 4. 添加实例方法：每个Vue实例上都能使用
    Vue.prototype.tip = function (msg) {
      // alert(msg)
    }
  }

  export default LvlPlugin;