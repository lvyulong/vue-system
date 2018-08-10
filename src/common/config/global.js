import Vue from 'vue';
import Back from 'app/common/component/Back';
import pageList from 'app/common/component/pageList';
import gender from 'app/common/filter/gender';
import isEnable from 'app/common/filter/isEnable';
import propMap from 'app/common/filter/propMap';
// 组件
const config = {
    component: [
        {name: 'back', component: Back},
        {name: 'pageList', component: pageList},
    ],

    directive: [],

    filter: [
        {name: 'gender', filter: gender},
        {name: 'isEnable', filter: isEnable},
        {name: 'propMap', filter: propMap},
    ]
};

// 自执行函数上面代码的分号不能省
((config) => {
    for (let k in config) {
        config[k].map((val, key) => {
            Vue[k](val.name, val[k])
        })
    }
})(config);
