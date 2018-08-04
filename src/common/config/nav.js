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
        path: '/app/plan/forward',
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
]