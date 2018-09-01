// 必要属性：label、path、active；如果有children，与父级格式一致
// active：url中只要有该值出现，则为激活状态
export default [
    {
        label: '我的账号',
        icon: 'fa fa-users font20',
        path: '/app/user/index',
        active: '/app/user'
    },
    {
        label: '我的计划',
        icon: 'fa fa-file-text font20',
        // 有子菜单的话，此处设置的path似乎点击没有路由的跳转，只是一个容器；
        path: '/app/plan/forward/index',
        active: '/app/plan',
        children: [
            {
                name: '技术',
                items: [
                    {path: '/app/plan/forward/index', label: '前端', active: '/app/plan/forward/index'},
                    {path: '/app/plan/backward/index', label: '后端', active: '/app/plan/backward/index'},
                ]
            },
            {
                name: '健康',
                items: [
                    {path: '/app/plan/sport/index', label: '运动', active: '/app/plan/sport/index'},
                    {path: '/app/plan/rest/index', label: '休息', active: '/app/plan/rest/index'},
                ]
            },
        ]
    },
    {
        label: '列表Demo',
        icon: 'fa fa-users font20',
        path: '/app/demo/index',
        active: '/app/demo'
    },
]