import Vue from 'vue';
import Back from 'app/common/component/Back';
import pageList from 'app/common/component/pageList';
import gender from 'app/common/filter/gender';
import isEnable from 'app/common/filter/isEnable';
import propMap from 'app/common/filter/propMap';
import timestampTotime from 'app/common/filter/timestampTotime';
import QrcodeVue from 'qrcode.vue';
// 组件
const config = {
    component: [
        {name: 'back', component: Back},
        {name: 'pageList', component: pageList},
        {name: 'qrcode', component: QrcodeVue},
    ],

    directive: [],

    filter: [
        {name: 'gender', filter: gender},
        {name: 'isEnable', filter: isEnable},
        {name: 'propMap', filter: propMap},
        {name: 'timestampTotime', filter: timestampTotime},
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
