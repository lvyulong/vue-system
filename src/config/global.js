import register from 'app/common/register';
// -----------------------------------------------------
import back from 'component/Back';
import pageList from 'component/pageList';
import searchInput from 'component/searchInput.vue';
import searchSelect from 'component/searchSelect.vue';
import fileUpload from 'component/fileUpload.vue';
import tags from 'component/tags.vue';
import pageHeader from 'component/pageHeader.vue';
import selectLink from 'component/selectLink.vue';
// import vueQr from 'vue-qr';
import gender from 'filter/gender';
import isEnable from 'filter/isEnable';
import propMap from 'filter/propMap';
import keyToVal from 'filter/keyToVal';
import ellipsis from 'filter/ellipsis';
import timestampTotime from 'filter/timestampTotime';
import formatTime from 'filter/formatTime';
// -----------------------------------------------------

// 组件
const config = {
    component: [
        {name: 'back', component: back},
        {name: 'pageList', component: pageList},
        {name: 'searchInput', component: searchInput},
        {name: 'searchSelect', component: searchSelect},
        {name: 'fileUpload', component: fileUpload},
        {name: 'tags', component: tags},
        {name: 'pageHeader', component: pageHeader},
        {name: 'selectLink', component: selectLink},
        // {name: 'vueQr', component: vueQr},
    ],
    directive: [],
    filter: [
        {name: 'gender', filter: gender},
        {name: 'isEnable', filter: isEnable},
        {name: 'propMap', filter: propMap},
        {name: 'timestampTotime', filter: timestampTotime},
        {name: 'keyToVal', filter: keyToVal},
        {name: 'ellipsis', filter: ellipsis},
        {name: 'formatTime', filter: formatTime},
    ]
};
register(config);
