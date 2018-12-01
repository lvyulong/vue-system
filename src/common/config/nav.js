// 必要属性：label、path、active；如果有children，与父级格式一致
// active：定义路由为何值时菜单栏显示激活状态
export default [
    {
        label: '用户管理',
        icon: 'fa fa-users font20',
        path: '/app/user/index',
        active: '/app/user'
    },
    {
        label: '模块一',
        icon: 'fa fa-file-text font20',
        // 有子菜单的话，此处设置的path似乎点击没有路由的跳转，只是一个容器；
        path: '/app/demo1/demo11/index',
        active: '/app/demo1',
        children: [
            {
                name: '模块1.1',
                items: [
                    {path: '/app/demo1/demo11/index', label: '列表', active: '/app/demo1/demo11/index'},
                ]
            },
            {
                name: '模块1.2',
                items: [
                    {path: '/app/demo1/demo12/index', label: '列表', active: '/app/demo1/demo12/index'},
                ]
            },
        ]
    }
]