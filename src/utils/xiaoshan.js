

// map
export const MAP_CENTER = [30.12, 120.175]
export const TMS = "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}"
export const FIX_TMS = "http://192.122.2.196:8080/fix_map/bg.png"
//"http://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}"
// "http://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}"
// "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer/tile/{z}/{y}/{x}"
// "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}"
// "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetGray/MapServer/tile/{z}/{y}/{x}"

// state
// 地图 实体元素 属性
export const LINK_COLOR = ['#35843e', '#87cc26', '#edee20', '#f58522', '#eb222c'];
export const DEVICE_CONFIG = {
    radius: 10,
    color: '#1DA57A',
    fillOpacity: 1,
    blink: '#0ff',      // 特显颜色
}
export const AREA_CONFIG = {
    color: '#1DA57A',
    strokeColor: '#1DA57A',
    fillOpacity: 0.5,
    strokeOpacity: 1,
    opacity: 0.5,
}
export const AREA_BLINK_CONFIG = {
    color: '#0f0',
    strokeColor: '#0f0',
    fillOpacity: 1,
    strokeOpacity: 1,
    opacity: 1,
}

export const NODE_CONFIG = {
    color: '#1DA57A', fillOpacity: 1, radius: 30
}

export const LINK_CONFIG = {
    color:'#1DA57A'
}

export const LINK_RANK = ['快速路', '主干道', '次干道', '支路']

// accident
export const ACCIDENT_CLIMATE = ['晴','阴','雨','雪','雾','大风','沙尘','冰雹','其它']
export const ACCIDENT_SPECIFIC_LOCATION = ['路口中央','路口进口处','路口出口处','右转弯处','机动车道处','非机动车道处','人行道处','单位小区或小支路开口处','道路渐变段（100米内车道增加或较少）','中央分隔带','机非隔离带','单位小区内部道路','停车场内部','村道乡道']
export const ROAD_CONDITION = ['普通道路','高架','桥梁','隧道','匝道','长下坡','陡坡','急转弯','施工路段','结冰路面','湿滑路面','其他描述']
export const ACCIDENT_PATTERN = ['碰撞运动车辆','碰撞静止车辆','其他车辆事故','刮撞行人','碾压行人','碰撞碾压行人','侧翻','滚翻','坠车','失火','撞固定物','撞非固定物','乘员跌落或抛出']
export const ACCIDENT_TYPE = ['机动车追尾机动车','机动车追尾停驶车辆','机动车同向刮擦','机动车对向刮擦','机动车违反车道行驶发生碰撞','机动车正面碰撞','机动车直角碰撞','机动车撞非机动车','机动车撞行人','机动车撞固定物','机动车侧翻','多车事故','非机动车撞固定物','非机动车撞非机动车','非机动车撞行人','非机动车撞停驶车辆','非机动车单车事故']
export const LIGHT_CONDITION = ['灯光无影响','灯光干扰','灯光过暗']
export const SIGN_MARKING_CONDITION = ['标志标线完整清晰','标志标线不一致', '标线残缺模糊', '标志提醒缺失']

// accident-party
export const TRIP_MODE = ['小客车', '非机动车', '自行车', '行人', '大货车', '大客车', '小货车']
export const IS_BREAKDOWN = ['无故障', '故障']
export const ILLEGAL_BEHAVIOR = ['无', '闯红灯', '酒驾醉驾', '无证驾驶', '超速行驶', '违停', '占用非机动车道', '占用对向车道', '占用人行道', '占用机动车道', '逆行', '随意横穿马路']
export const CAR_DAMAGE = ['无', '轻微车损', '严重车损']

// search data
export const SEARCH_TYPE_TITLE = [{
    value: 'safety',
    label: '交通安全',
    children: [{
        value: 'location',
        label: '事故点位',
    }],
},{
    value: 'control',
    label: '交通控制',
    children: [{
        value: 'flow',
        label: '流量',
    },{
        value: 'schema',
        label: '信号方案',
        children: [{
            value: 'node',
            label: '点位',
        }],
    },{
        value: 'evaluation',
        label: '信号评价',
        children: [{
            value: 'node',
            label: '点位',
        }],
    }],
},{
    value: 'od',
    label: '机动车出行',
    children: [{
        value: 'trips',
        label: '出行矩阵',
    },{
        value: 'cnts',
        label: '出行量',
    },{
        value: 'o_cnts',
        label: '发生量',
    },{
        value: 'd_cnts',
        label: '吸引量',
    },{
        value: 'trip_time',
        label: '出行时间',
    },{
        value: 'trip_dist',
        label: '出行距离',
    },{
        value: 'trip_freq',
        label: '出行次数',
    }],
},{
    value: 'car',
    label: '主题车辆',
    children: [{
        value: 'changzhu',
        label: '常驻车',
    },{
        value: 'nonlocal',
        label: '外地车',
    },{
        value: 'tongqin',
        label: '通勤车',
    },{
        value: 'taxi',
        label: '出租车',
    },{
        value: 'online',
        label: '网约车',
    },{
        value: 'yellow',
        label: '黄牌车',
    },{
        value: 'yellow_flow',
        label: '黄牌车流量',
    },{
        value: 'province',
        label: '各省车牌',
    },{
        value: 'province_flow',
        label: '各省车牌流量',
    },{
        value: 'tongqin_carnum',
        label: '通勤车车牌',
    }]
},{
    value: 'state',
    label: '交通态势',
    children: [{
        value: 'rdnet',
        label: '路网速度',
    },{
        value: 'vn',
        label: '在途量',
    },{
        value: 'link',
        label: '路段状态',
    },{
        value: 'road',
        label: '道路状态',
    },{
        value: 'area',
        label: '区域状态',
    },{
        value: 'intersection',
        label: '路口状态',
    }]

},{
    value: 'device',
    label: '设备状态',
    children: [{
        value: 'rcg_rate',
        label: '识别率',
    },{
        value: 'not_miss_rate',
        label: '传输率',
    }]
},{
    value: 'highway',
    label: '高速公路',
    children: [{
        value: 'cnts',
        label: '车辆数',
    },{
        value: 'ramp_cnts',
        label: '匝道车辆数',
    },{
        value: 'quxian_cnts',
        label: '区县界道路',
    },{
        value: 'nonlocal_carnum',
        label: '外地车车牌',
    }]
}]


export const SEARCH_TYPE = {
    'safety/location': [],
    'control/flow': [{name:"node_id", title:"路口名称"}],
    'control/schema/node': [{name:"node_id", title:"路口名称"}],
    'control/evaluation/node': [{name:"node_id", title:"路口名称"}],
    'od/trips': [],
    'od/cnts': [],
    'od/o_cnts': [],
    'od/d_cnts': [],
    'od/trip_time': [],
    'od/trip_dist': [],
    'od/trip_freq': [],
    'car/changzhu': [],
    'car/nonlocal': [{name:"dev_id", title:"设备名称"}],
    'car/yellow': [],
    'car/yellow_flow': [],
    'car/province': [],
    'car/province_flow': [{name:"province", title:"省份"}],
    'car/tongqin': [],
    'car/taxi': [],
    'car/online': [],
    'car/tongqin_carnum': [],
    'state/rdnet': [],
    'state/vn': [],
    'state/link': [{name:"link_id", title:"路段名称"}],
    'state/road': [{name:"road_name", title:"道路名称"}],
    'state/area': [{name:"area_id", title:"区域名称"}],
    'state/intersection': [{name:"node_id", title:"路口名称"}],
    'device/rcg_rate': [{name:"dev_id", title:"设备名称"}],
    'device/not_miss_rate': [{name:"dev_id", title:"设备名称"}],
    'highway/cnts': [],
    'highway/ramp_cnts': [],
    'highway/quxian_cnts': [],
    'highway/nonlocal_carnum': [],
}

export const SEARCH_TIPS = {
    'safety/location': "事故信息下载",
    'control/flow': "点位流量下载",
    'control/schema/node': "点位控制方案",
    'control/evaluation/node': "点位控制方案评价（5分钟）",
    'od/trips': "出行矩阵（1天）",
    'od/cnts': "出行总量（1天）",
    'od/o_cnts': "点位发生量（1天）\n选择一日数据",
    'od/d_cnts': "点位吸引量（1天）\n选择一日数据",
    'od/trip_time': "出行时长（1天）",
    'od/trip_dist': "出行距离（1天）",
    'od/trip_freq': "出行次数（1天）",
    'car/changzhu': "常驻车辆数（1天）\nloc_small:本地小车;\tloc_large:本地大车;\tfore_small:外地小车;\tfore_large:外地大车;",
    'car/nonlocal': "外地车在途车辆数（5分钟）",
    'car/yellow': "黄牌车辆\n选择一日数据,否则查询数据量过大容易造成死机",
    'car/yellow_flow': "黄牌车流量（1小时）",
    'car/province': "各省车牌流量\n选择一日数据,否则查询数据量过大容易造成死机",
    'car/province_flow': "各省车牌流量（1小时）",
    'car/tongqin': "通勤车在途车辆数（5分钟）",
    'car/taxi': "出租车在途车辆数（5分钟）",
    'car/online': "网约车在途车辆数（5分钟）",
    'car/tongqin': "通勤车车牌",
    'state/rdnet': "路网状态（5分钟）",
    'state/vn': "路网在途车辆数（5分钟）",
    'state/link': "路段状态（5分钟）",
    'state/road': "道路状态（5分钟）",
    'state/area': "区域状态（5分钟）",
    'state/intersection': "路口延误（5分钟）",
    'device/rcg_rate': "设备识别率（15分钟）",
    'device/not_miss_rate': "设备传输率（15分钟）",
    'highway/cnts': "高速公路车辆数（1小时）",
    'highway/ramp_cnts': "高速公路各匝道进保山车辆数（1小时）",
    'highway/quxian_cnts': "区县界道路进保山车辆数（1小时）",
    'highway/nonlocal_carnum': "高速公路外地车牌",
}

export const PROVINCE = ['京', '津', '沪', '渝', '蒙', '新', '藏', '宁', '桂', '港', '澳', '黑', '吉', '辽', '晋', '冀', '青', '鲁', '豫', '苏', '皖', '浙', '闽', '赣', '湘', '鄂', '粤', '琼', '甘', '陕', '贵', '川']

// strategy
export const STRATEGY_TYPE = [
    '人', '车', '路', '环境'
]

// device
export const DEVICE_CAP_DIR = [
    '东向西', '南向北', '西向东', '北向南', '东西方向', '南北方向'
]

// line
export const LINE_DIR = [
    '东向西', '南向北', '西向东', '北向南'
]
export const LINE_TYPE = [
    '双向', '正向'
]
// link
export const LINK_DIR = [
    '东向西', '南向北', '西向东', '北向南'
]