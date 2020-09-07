// 必要属性：label、path、active；如果有children，与父级格式一致
// active：定义路由为何值时菜单栏显示激活状态
// 只支持两级
export default [
    {
        label: '总览',
        icon: 'fa fa-home font20',
        path: '/app/overview/index',
        active: '/app/overview/index',
        checkPms:[],
    },
    {
        label: '用户',
        icon: 'fa fa-users font20',
        path: '/app/user',
        active: '/app/user',
        checkPms:['PM_USER_VIEW', 'PM_USER_APPLY'],
        children:[
            {
                label: '用户',
                path: '/app/user/index',
                checkPms:['PM_USER_VIEW'],
                active: '/app/user/index',
            },
            {
                label: '客户授权',
                path: '/app/user/apply',
                checkPms:['PM_USER_APPLY'],
                active: '/app/user/apply',
            }
        ]
    },

]