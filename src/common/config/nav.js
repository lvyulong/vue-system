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
      {
        name: '技术',
        items:[
          {path: '/app/plan/forward/index', label: '前端'},
          {path: '/app/plan/backward/index', label: '后端'},
        ]
      },
      {
        name: '健康',
        items:[
          {path: '/app/plan/sport/index', label: '运动'},
          {path: '/app/plan/rest/index', label: '休息'},
        ]
      },
    ]
  },
]