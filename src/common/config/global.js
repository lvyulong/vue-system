import Vue from 'vue';

// -----------------------------------------------------
import Back from 'component/Back';
import pageList from 'component/pageList';
import searchInput from 'component/searchInput.vue';
import fileUpload from 'component/fileUpload.vue';
import tags from 'component/tags.vue';
import pageHeader from 'component/pageHeader.vue';
import selectLink from 'component/selectLink.vue';
import vueQr from 'vue-qr';
import gender from 'filter/gender';
import isEnable from 'filter/isEnable';
import propMap from 'filter/propMap';
import keyToVal from 'filter/keyToVal';
import timestampTotime from 'filter/timestampTotime';
// -----------------------------------------------------

// 组件
const config = {
    component: [
        {name: 'back', component: Back},
        {name: 'pageList', component: pageList},
        {name: 'searchInput', component: searchInput},
        {name: 'fileUpload', component: fileUpload},
        {name: 'tags', component: tags},
        {name: 'pageHeader', component: pageHeader},
        {name: 'selectLink', component: selectLink},
        {name: 'vueQr', component: vueQr},
    ],

    directive: [],

    filter: [
        {name: 'gender', filter: gender},
        {name: 'isEnable', filter: isEnable},
        {name: 'propMap', filter: propMap},
        {name: 'timestampTotime', filter: timestampTotime},
        {name: 'keyToVal', filter: keyToVal},
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
