const menuList = [
    {
        title: '首页',
        key: '/home',
        icon: 'home',
        public: true,
    },
    {
        title: '数据平台',
        key: '/platform',
        icon: 'desktop'
    },
    {
        title: '信号控制',
        key: '/signal',
        icon: 'fork',
        children: [{
            title: '单点控制',
            key: '/node-signal',
            icon: 'deployment-unit'
        },
        {
            title: '干线控制',
            key: '/line',
            icon: 'line'
        }]
    },
    {
        title: '数据检索',
        key: '/search',
        icon: 'search'
    },
    {
        title: '事故分析',
        key: '/accidents',
        icon: 'bell'
    },
    {
        title: '安全策略',
        key: '/strategy',
        icon: 'book'
    },
    {
        title: '车辆轨迹',
        key: '/trajectory',
        icon: 'car',
    },
    {
        title: '数据管理',
        key: '/config',
        icon: 'database',
        children: [{
            title: '设备管理',
            key: '/device',
            icon: 'video-camera'
        },
        {
            title: '点位管理',
            key: '/node',
            icon: 'plus'
        },
        {
            title: '路段管理',
            key: '/link',
            icon: 'pause'
        },
        {
            title: '区域管理',
            key: '/area',
            icon: 'border'
        }]
    },
    {
        title: '用户管理',
        key: '/user',
        icon: 'user'
    },
    {
        title: '角色管理',
        key: '/role',
        icon: 'team'
    },
]

export default menuList