// 必要属性：label、path、active；如果有children，与父级格式一致
// active：定义路由为何值时菜单栏显示激活状态
// 只支持两级
export default [
    {
        label: '授权管理',
        icon: 'fa fa-users font20',
        path: '/app/auth',
        checkPms:[],
        children:[
            {
                label: '用户管理',
                path: '/app/auth/user/index',
                checkPms:[],
                active: '/app/auth/user',
            },
            {
                label: '角色管理',
                path: '/app/auth/role/index',
                checkPms:[],
                active: '/app/auth/role',
            }
        ]
    },

]