/*

{
     key: '属性名',
     label: '用于报错的显示名称',
     trigger: '不传默认是blur',
     required: '除非传0，会取消必填的验证；否则默认进行必填验证',
     min: '最小值验证',
     max: '最大值验证'
}
*/


// 最小值验证函数
var min = (item) => {
    var validator = (rule, value, callback) => {
        if (value < item.min) {
            callback(new Error(`${item.label}不能小于${item.min}`));
        } else {
            callback();
        }
    };
    return validator;
};
// 最大值验证函数
var max = (item) => {
    var validator = (rule, value, callback) => {
        if (value > item.max) {
            callback(new Error(`${item.label}不能大于${item.max}`));
        } else {
            callback();
        }
    };
    return validator;
};


const rule = function (array) {
    var rules = {};
    for (var i = 0; i < array.length; i++) {
        var item = array[i];
        rules[item.key] = [];
        // 只要required不是0，都默认验证必填
        if (item.required !== 0) {
            rules[item.key].push({
                required: true,
                message: `${item.label}必填`,
                trigger: item.trigger || 'blur'
            })
        }
        // 验证其他
        if (item.min) {
            rules[item.key].push({
                validator: min(item),
                trigger: item.trigger || 'blur'
            })
        }
        if (item.max) {
            rules[item.key].push({
                validator: max(item),
                trigger: item.trigger || 'blur'
            })
        }

    }
    return rules;
};

export default rule;