export default [
  {
    label: '我的账号',
    icon: 'el-icon-document font20',
    path: '/app/user/index',
  },
  {
    label: '我的计划',
    icon: 'el-icon-goods font20',
    path: '/app/plan/forward',
    children: [
      {path: '/app/plan/forward/index', label: '前端'},
      {path: '/app/plan/backward/index', label: '后端'},
    ]
  },
]