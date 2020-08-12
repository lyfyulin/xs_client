/**
 *      封装所有请求
 */
import ajax from './ajax'
import jsonp from 'jsonp'
import { message } from 'antd'
// const base = 'http://192.122.2.196:3005'        // 部署服务器ip
// const base = 'http://192.122.1.246:3005'     // 视频专网ip
const base = 'http://localhost:3005'         // 本地ip
export const reqLogin = (username, password) => ajax.post( base + "/login_verify", {username, password} )

// jsonp 只能解决 GET 类型的 ajax 请求跨域问题
// jsonp 请求不是 ajax 请求，而是一般的 get 请求 
export const reqWeather = (location) => {
    return new Promise((resolve, reject) => {
        const url = `http://api.map.baidu.com/telematics/v3/weather?location=${location}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
        jsonp(url, {}, (error, data) => {
            if( !error && data.error === 0 ){
                const { dayPictureUrl, weather } = data.results[0].weather_data[0]
                resolve( { dayPictureUrl, weather } )
            }else{
                message.error("获取天气信息失败！")
            }
        })
    })
}

export const reqCategories = () => ajax(base + "/product")
export const reqAddCategory = (name) => ajax.post( base + "/insert/product", { name } )
export const reqUpdateCategory = ({id, name}) => ajax.post( base + "/update/product", { id, name } )

export const reqGoods = (pageNum, pageSize) => ajax( base + `/good/${pageNum}`, {
    params: {       // 包含请求参数的对象
        pageSize
    }
} )

export const reqSearchGoods = ({ pageNum, pageSize, searchName, searchType}) => ajax( base + "/good/search", {
    params: {
        pageNum,
        pageSize,
        searchType,
        searchName,   // productName 或 productDescs
    }
})


export const reqUpdateStatus = ( goodsId, status ) => ajax.post( base + "/update/good", JSON.stringify({ id : goodsId, status: status,}), {
    headers: {
        "Content-Type": 'application/json'
    },
})

export const reqCategory = (categoryId) => ajax( base + "/product/info", {
    params: {
        id: categoryId
    }
} )

export const reqDeleteImage = ( image_name ) => ajax.post( base + '/delete/image', { image_name } )

export const reqAddUpdateProduct = (product) => ajax.post(
     base + (product.id?'/update/good':'/insert/good'),
     JSON.stringify(product),
     {
        headers: {
            "Content-Type": 'application/json'
        },
     }
)

export const reqProductById = ( goodId ) => ajax( base + "/good/info", {
    params: {
        id: goodId
    }
} )


// user
export const reqRoles = () => ajax( base + "/role/list" )

export const reqAddRole = ( role ) => ajax.post(
    base + '/insert/role',
    JSON.stringify( {...role} ),
    {
        headers: { "Content-Type": "application/json" }
    }
)

export const reqUpdateRole = ( role ) => ajax.post(
    base  + '/update/role',
    JSON.stringify( { ...role } ),
    {
        headers: { 'Content-Type' : 'application/json' }
    }
)

export const reqUsers = () => ajax( base + "/user/list" )

export const reqAddUser = ( user ) => ajax.post(
    base + '/insert/user',
    JSON.stringify( {...user} ),
    {
        headers: { "Content-Type": "application/json" }
    }
)

export const reqUpdateUser = ( user ) => ajax.post(
    base  + '/update/user',
    JSON.stringify( { ...user } ),
    {
        headers: { 'Content-Type' : 'application/json' }
    }
)

export const reqDeleteUser = (user_id) => ajax.post( base + '/delete/user', {user_id} )



// car
export const reqCurrentTongqinHotRoad = () => ajax( base + "/car/tongqin/current/hotroad")

export const reqCurrentTongqinHotNode = () => ajax( base + "/car/tongqin/current/hotnode")

export const reqCurrentTongqinRatio = () => ajax( base + "/car/tongqin/today/ratio")

export const reqTongqinRatioSearch = (start_date, end_date) => ajax( base + "/search/car/tongqin/ratio", {
    params: {
        start_date, end_date
    }
} )
	
export const reqTodayOnlineDist = () => ajax( base + "/car/online/today/dist")

export const reqOnlineDistSearch = (start_date, end_date) => ajax( base + "/search/car/online/dist", {
    params: {
        start_date, end_date
    }
} )

export const reqTodayTaxiDist = () => ajax( base + "/car/taxi/today/dist")

export const reqTaxiDistSearch = (start_date, end_date) => ajax( base + "/search/car/taxi/dist", {
    params: {
        start_date, end_date
    }
} )
	
export const reqTodayOnlineVn = () => ajax( base + "/car/online/today/vn")

export const reqLastOnlineVn = () => ajax( base + "/car/online/last/vn")

export const reqOnlineVnSearch = (start_date, end_date) => ajax( base + "/search/car/online/vn", {
    params: {
        start_date, end_date
    }
} )

export const reqTodayTaxiVn = () => ajax( base + "/car/taxi/today/vn")

export const reqLastTaxiVn = () => ajax( base + "/car/taxi/last/vn")

export const reqTaxiVnSearch = (start_date, end_date) => ajax( base + "/search/car/taxi/vn", {
    params: {
        start_date, end_date
    }
} )

export const reqCurrentNodeNonlocalRatio = () => ajax( base + "/car/nonlocal/current/node/ratio")
	
export const reqNodeNonlocalRatioSearch = (start_date, end_date, node_id) => ajax( base + "/search/car/nonlocal/node/ratio", {
    params: {
        start_date, end_date, node_id
    }
} )	

export const reqWeekNonlocalRatio = () => ajax( base + "/car/nonlocal/week/ratio")
	
export const reqCurrentNonlocalRatio = () => ajax( base + "/car/nonlocal/today/ratio")
	
export const reqNonlocalRatioSearch = (start_date, end_date) => ajax( base + "/search/car/nonlocal/ratio", {
    params: {
        start_date, end_date
    }
} )	

export const reqTodayNonlocalVn = () => ajax( base + "/car/nonlocal/today/vn")
	
export const reqNonlocalVnSearch = (start_date, end_date) => ajax( base + "/search/car/nonlocal/vn", {
    params: {
        start_date, end_date
    }
} )	
	
// device
export const reqDevices = () => ajax( base + "/device/list")
export const reqUrbanDevices = () => ajax( base + "/device/urban/list")
export const reqHighwayDevices = () => ajax( base + "/device/highway/list")
export const reqQuxianDevices = () => ajax( base + "/device/quxian/list")
export const reqDJDevices = () => ajax( base + "/device/dj/list")

export const reqDeviceById = (dev_id) => ajax( base + "/device/info", {
    params: {
        dev_id
    }
})

export const reqInsertDevice = (device) => ajax.post( base + "/insert/device",
    JSON.stringify(device),
    {
        headers: {
            "Content-Type": 'application/json'
        },
    }
)	

export const reqUpdateDevice = (device) => ajax.post( base + "/update/device",
    JSON.stringify(device),
    {
        headers: {
            "Content-Type": 'application/json'
        },
    }
)	

export const reqDeleteDevice = ( dev_id ) => ajax.post( base + "/delete/device", {dev_id})	


export const reqCurrentDevNotMiss = () => ajax( base + "/device/current/each/not_miss_rate")

export const reqDevNotMissSearch = (start_date, end_date, dev_id) => ajax( base + "/search/device/dev/not_miss_rate", {
    params: {
        start_date, end_date, dev_id
    }
} )	

export const reqTodayNotMiss = () => ajax( base + "/device/not_miss_rate")

export const reqNotMissSearch = (start_date, end_date, start_time, end_time) => ajax( base + "/search/device/not_miss_rate", {
    params: {
        start_date, end_date, start_time, end_time
    }
} )	

export const reqWeekRcgRate = () => ajax( base + "/device/week/rcg_rate")
	
export const reqTodayRcgRate = () => ajax( base + "/device/rcg_rate")

export const reqRcgRateSearch = (start_date, end_date) => ajax( base + "/search/device/rcg_rate", {
    params: {
        start_date, end_date
    }
} )	

export const reqCurrentDevRcgRate = () => ajax( base + "/device/current/each/rcg_rate")

export const reqTodayDevRcgRate = () => ajax( base + "/device/today/each/rcg_rate")

export const reqDevRcgRateSearch = (start_date, end_date, dev_id) => ajax( base + "/search/device/dev/rcg_rate", {
    params: {
        start_date, end_date, dev_id
    }
} )	


// highway
export const reqRampCarTypeFlow = (direction) => ajax( base + "/ramp/last/car_type/flow", {
    params: {
        direction
    }
} )	

export const reqEnterAwayFlow = (direction) => ajax( base + "/highway/last/enter_and_away/flow", {
    params: {
        direction
    }
} )	

export const reqCarTypeFlow = (direction) => ajax( base + "/highway/last/car_type/flow", {
    params: {
        direction
    }
} )	

export const reqEnterAwayFlowEachHour = (direction) => ajax( base + "/highway/last/enter_ad_away/hour_flow", {
    params: {
        direction
    }
} )	

export const reqCarTypeFlowEachHour = (direction) => ajax( base + "/highway/last/car_type/hour_flow", {
    params: {
        direction
    }
} )	
    
export const reqRampByDirection = (direction) => ajax( base + "/ramp/info", {
    params: {
        direction
    }
} )	

export const reqCountyDev = () => ajax( base + "/county/info")

export const reqCountyNodeName = () => ajax( base + "/county/node/info")
	
export const reqCountyFlow = (node_name, direction) => ajax( base + "/county/today/flow", {
    params: {
        node_name, direction
    }
} )	
	
export const reqPathByPlate = (start_date, end_date, plate) => ajax( base + "/search/path/plate", {
    params: {
        start_date, end_date, plate
    }
} )	

export const reqChangzhuCntsSearch = (start_date, end_date, location, numOfDay, dayOfMonth) => ajax( base + "/search/changzhu/cnts", {
    params: {
        start_date, end_date, location, numOfDay, dayOfMonth
    }
} )	

export const reqChangzhuVn = (start_date, end_date) => ajax( base + "/search/changzhu/vn", {
    params: {
        start_date, end_date
    }
} )	

export const reqUniquePlateCnt = (start_date, end_date) => ajax( base + "/search/unique/plate_num", {
    params: {
        start_date, end_date
    }
} )	


// od
export const reqLastOdTrip = () => ajax( base + "/od/last/trip")

export const reqOdTripSearch = (start_date, end_date) => ajax( base + "/search/od/trip", {
    params: {
        start_date, end_date
    }
} )	

export const reqLastOdTripCount = () => ajax( base + "/od/last/trip/count")

export const reqOdTripCountSearch = (start_date, end_date) => ajax( base + "/search/od/trip/count", {
    params: {
        start_date, end_date
    }
} )	
	
export const reqLastOCnts = () => ajax( base + "/od/last/o_cnts")

export const reqOCntsSearch = (start_date, end_date) => ajax( base + "/search/od/o_cnts", {
    params: {
        start_date, end_date
    }
} )	

export const reqLastDCnts = () => ajax( base + "/od/last/d_cnts")

export const reqDCntsSearch = (start_date, end_date) => ajax( base + "/search/od/d_cnts", {
    params: {
        start_date, end_date
    }
} )	

export const reqLastTripDist = () => ajax( base + "/od/last/trip_dist")

export const reqLastTripTime = () => ajax( base + "/od/last/trip_time")

export const reqLastTripFreq = () => ajax( base + "/od/last/trip_freq")

export const reqLastAvgTripDist = () => ajax( base + "/od/last/avg_trip_dist")

export const reqAvgTripDistSearch = (start_date, end_date) => ajax( base + "/search/od/avg_trip_dist", {
    params: {
        start_date, end_date
    }
} )	

export const reqLastAvgTripTime = () => ajax( base + "/od/last/avg_trip_time")

export const reqAvgTripTimeSearch = (start_date, end_date) => ajax( base + "/search/od/avg_trip_time", {
    params: {
        start_date, end_date
    }
} )	

export const reqLastAvgTripFreq = () => ajax( base + "/od/last/avg_trip_freq")

export const reqAvgTripFreqSearch = (start_date, end_date) => ajax( base + "/search/od/avg_trip_freq", {
    params: {
        start_date, end_date
    }
} )	



// accident
export const reqAccidents = () => ajax( base + "/accident/list")

export const reqAccidentById = (accident_id) => ajax( base + "/accident/info", {
    params: {
        accident_id
    }
} )	


export const reqAccidentsSearch = ( start_time, end_time, accident_type, road_condition, climate, accident_specific_location, car_damage, people_hurt,illegal_behavior ) => ajax( base + "/search/accident", {
    params: {
        start_time, end_time, accident_type, road_condition, climate, accident_specific_location, car_damage, people_hurt,illegal_behavior
    }
} )	

export const reqInsertAccident = (accident) => ajax.post( base + "/insert/accident",
    JSON.stringify( {...accident} ),
    {
        headers: { "Content-Type": "application/json" }
    }
)

export const reqUpdateAccident = (accident) => ajax.post( base + "/update/accident",
    JSON.stringify( {...accident} ),
    {
        headers: { "Content-Type": "application/json" }
    }
)

export const reqDeleteAccident = (accident_id) => ajax.post( base + "/delete/accident", {accident_id} )

export const reqAccidentParty = (accident_id) => ajax( base + "/accident/party/info", {accident_id} )

export const reqInsertAccidentParty = (accident_party) => ajax.post( base + "/insert/accident/party",
    JSON.stringify( {...accident_party} ),
    {
        headers: { "Content-Type": "application/json" }
    }
)

export const reqUpdateAccidentParty = (accident_party) => ajax.post( base + "/update/accident/party",
    JSON.stringify( {...accident_party} ),
    {
        headers: { "Content-Type": "application/json" }
    }
)

export const reqDeleteAccidentParty = (party_id) => ajax.post( base + "/delete/accident/party", {party_id} )

export const reqDeleteAllAccidentParty = (accident_id) => ajax.post( base + "/delete/accident/parties", {accident_id} )


export const reqStrategies = () => ajax( base + "/strategy/list" )	
export const reqStrategyById = ( strategy_id ) => ajax( base + "/strategy/info", {
    params: {
        strategy_id
    }
} )	
export const reqInsertStrategy = ( strategy ) => ajax.post( base + "/insert/strategy",
    JSON.stringify(strategy),
    {
        headers: {
            "Content-Type": 'application/json'
        },
    }
)
export const  reqUpdateStrategy = ( strategy ) => ajax.post( base + "/update/strategy",
    JSON.stringify(strategy),
    {
        headers: {
            "Content-Type": 'application/json'
        },
    }
)
export const reqDeleteStrategy = ( strategy_id ) => ajax.post( base + "/delete/strategy", { strategy_id } )

// state
export const reqTodayRdnetState = () => ajax( base + "/rdnet/today/avg_speed")

export const reqLastRdnetState = () => ajax( base + "/rdnet/last/avg_speed")

export const reqRdnetStateSearch = (start_date, end_date) => ajax( base + "/search/rdnet/avg_speed", {
    params: {
        start_date, end_date
    }
} )	

export const reqTodayVn = () => ajax( base + "/rdnet/today/vn")

export const reqLastVn = () => ajax( base + "/rdnet/last/vn")

export const reqVnSearch = (start_date, end_date) => ajax( base + "/search/vn", {
    params: {
        start_date, end_date
    }
} )	

export const reqCurrentLinkState = () => ajax( base + "/link/current/state")

export const reqLinkStateSearch = (start_date,  end_date,  link_id) => ajax( base + "/search/link/state", {
    params: {
        start_date, end_date, link_id
    }
} )	

export const reqCurrentAreaState = () => ajax( base + "/area/current/state")

export const reqAreaStateSearch = (start_date,  end_date, start_time, end_time,  area_id) => ajax( base + "/search/area/state", {
    params: {
        start_date,  end_date, start_time, end_time, area_id
    }
} )

export const reqCurrentRoadState = () => ajax( base + "/road/current/state")

export const reqRoadStateSearch = (start_date,  end_date, start_time, end_time, road_name) => ajax( base + "/search/road/state", {
    params: {
        start_date,  end_date, start_time, end_time, road_name
    }
} )	

export const reqWeekLinkSpeed = (link_id) => ajax( base + "/link/week/speed", {
    params: {
        link_id
    }
} )	

export const reqCurrentInterDelay = () => ajax( base + "/inter/current/delay")

export const reqInterDelaySearch = (start_date,  end_date, inter_id) => ajax( base + "/search/inter/delay", {
    params: {
        start_date, end_date, inter_id
    }
} )	

export const reqWeekInterDelay = (inter_id) => ajax( base + "/inter/delay/week", {
    params: {
        inter_id
    }
} )	





// rdnet

export const reqNodes = () => ajax( base + "/node/list" )	
export const reqUrbanNodes = () => ajax( base + "/node/urban/list" )	
export const reqHighwayNodes = () => ajax( base + "/node/highway/list" )	
export const reqQuxianNodes = () => ajax( base + "/node/quxian/list" )	
export const reqDJNodes = () => ajax( base + "/node/dj/list" )	

export const  reqNodeById = ( node_id ) => ajax( base + "/node/info", {
    params: {
        node_id
    }
}  )

export const reqInsertNode = (node) => ajax.post( base + "/insert/node",
    JSON.stringify(node),
    {
        headers: {
            "Content-Type": 'application/json'
        },
    }
)

export const reqUpdateNode = (node) => ajax.post( base + "/update/node",
    JSON.stringify(node),
    {
        headers: {
            "Content-Type": 'application/json'
        },
    }
)

export const reqDeleteNode = ( node_id ) => ajax.post( base + "/delete/node", {node_id})	

export const reqDirectionById = ( direction_id ) => ajax( base + "/node/direction/info", {
    params: {
        direction_id
    }
} )

export const reqNodeDirections = ( node_id ) => ajax( base + "/node/directions", {
    params: {
        node_id
    }
} )

export const reqInsertNodeDirection = (direction) => ajax.post( base + "/insert/node/direction",
    JSON.stringify(direction),
    {
        headers: {
            "Content-Type": 'application/json'
        },
    }
)

export const reqUpdateNodeDirection = (direction) => ajax.post( base + "/update/node/direction",
    JSON.stringify(direction),
    {
        headers: {
            "Content-Type": 'application/json'
        },
    }
)

export const reqDeleteNodeDirection = ( direction_id ) => ajax.post( base + "/delete/node/direction", { direction_id } )	

export const reqDeleteNodeDirections = ( node_id ) => ajax.post( base + "/delete/node/directions", { node_id } )	

export const reqLinks = () => ajax( base + "/link/list" )	

export const reqLinkById = ( link_id ) => ajax( base + "/link/info", {
    params: {
        link_id
    }
} )

export const reqInsertLink = ( link ) => ajax.post( base + "/insert/link",
    JSON.stringify(link),
    {
        headers: {
            "Content-Type": 'application/json'
        },
    }
)

export const reqUpdateLink = ( link ) => ajax.post( base + "/update/link",
    JSON.stringify(link),
    {
        headers: {
            "Content-Type": 'application/json'
        },
    }
)

export const reqDeleteLink = ( link_id ) => ajax.post( base + "/delete/link", { link_id } )

export const reqLines = () => ajax( base + "/line/list" )

export const reqLineById = ( line_id ) => ajax( base + "/line/info", {
    params: {
        line_id
    }
} )

export const reqLineControlData = ( start_date, end_date, start_time, end_time, line_id ) => ajax( base + "/line/control", {
    params: {
        start_date, end_date, start_time, end_time, line_id
    }
} )

export const reqInsertLine = ( line ) => ajax.post( base + "/insert/line",
    JSON.stringify(line),
    {
        headers: {
            "Content-Type": 'application/json'
        },
    }
)

export const reqUpdateLine = ( line ) => ajax.post( base + "/update/line",
    JSON.stringify(line),
    {
        headers: {
            "Content-Type": 'application/json'
        },
    }
)

export const reqDeleteLine = ( line_id ) => ajax.post( base + "/delete/line", { line_id } )

export const reqNodeFlowByNodeId = ( start_date, end_date, start_time, end_time, node_id ) => ajax( base + "/node/flow", {
    params: {
        start_date, end_date, start_time, end_time, node_id
    }
} )

export const reqNodeAvgFlowSearch = ( start_date, end_date, start_time, end_time, node_id ) => ajax( base + "/node/avg_flow", {
    params: {
        start_date, end_date, start_time, end_time, node_id
    }
} )

export const reqAreas = () => ajax( base + "/area/list" )

export const reqAreaById = ( area_id ) => ajax( base + "/area/info", {
    params: {
        area_id
    }
} )

export const reqInsertArea = ( area ) => ajax.post( base + "/insert/area",
    JSON.stringify(area),
    {
        headers: {
            "Content-Type": 'application/json'
        },
    }
)

export const  reqUpdateArea = ( area ) => ajax.post( base + "/update/area",
    JSON.stringify(area),
    {
        headers: {
            "Content-Type": 'application/json'
        },
    }
)

export const reqDeleteArea = ( area_id ) => ajax.post( base + "/delete/area", { area_id } )





// evaluation
export const reqCurrentNodesDelay = () => ajax( base + "/current/nodes/delay" )

export const reqNodesDelaySearch = ( start_time, end_time ) => ajax( base + "/search/nodes/delay", {
    params: {
        start_time, end_time
    }
} )

export const reqCurrentNodeDelay = ( node_id ) => ajax( base + "/current/node/delay", {
    params: {
        node_id
    }
} )

export const reqNodeDelaySearch = ( start_date, end_date, start_time, end_time, node_id ) => ajax( base + "/search/node/delay", {
    params: {
        start_date, end_date, start_time, end_time, node_id
    }
} )

export const reqCurrentLineSchemaDisorderRate = ( line_schema_id ) => ajax( base + "/current/line/schema/disorderrate", {
    params: {
        line_schema_id
    }
} )

export const reqLineSchemaDisorderRateSearch = ( start_time , end_time , line_schema_id ) => ajax( base + "/search/line/schema/disorderrate", {
    params: {
        start_time, end_time, line_schema_id
    }
} )


// schema
export const reqNodeSchemas = ( node_id ) => ajax( base + "/node/schema/list", {
    params: {
        node_id
    }
} )

export const reqNodeSchemaExec = ( node_id ) => ajax( base + "/node/schema/execution", {
    params: {
        node_id
    }
} )

export const reqNodeSchemaExecSearch = ( start_date, end_date, start_time, end_time, node_id ) => ajax( base + "/node/schema/execution/search", {
    params: {
        start_date, end_date, start_time, end_time, node_id
    }
} )

export const reqNodeSchemaById = ( node_schema_id ) => ajax( base + "/node/schema/info", {
    params: {
        node_schema_id
    }
} )

export const reqInsertNodeSchema = ( node_schema ) => ajax.post( base + "/insert/node/schema",
    JSON.stringify(node_schema),
    {
        headers: {
            "Content-Type": 'application/json'
        },
    }
)

export const reqUpdateNodeSchema = ( node_schema ) => ajax.post( base + "/update/node/schema",
    JSON.stringify(node_schema),
    {
        headers: {
            "Content-Type": 'application/json'
        },
    }
)

export const reqDeleteNodeSchemas = ( node_id ) => ajax.post( base + "/delete/node/schemas", { node_id } )

export const reqDeleteNodeSchema = ( node_schema_id ) => ajax.post( base + "/delete/node/schema", { node_schema_id } )

export const reqLineSchemas = ( line_id ) => ajax( base + "/line/schema/list", {
    params: {
        line_id
    }
} )

export const reqLineSchemaById = ( line_schema_id ) => ajax( base + "/line/schema/info", {
    params: {
        line_schema_id
    }
} )

export const reqLineSchemaExec = ( line_id ) => ajax( base + "/line/schema/execution", {
    params: {
        line_id
    }
} )

export const reqLineSchemaSearch = ( start_time, end_time, line_id ) => ajax( base + "/search/line/schema", {
    params: {
        start_time, end_time, line_id
    }
} )

export const reqInsertLineSchema = ( line_schema ) => ajax.post( base + "/insert/line/schema",
    JSON.stringify(line_schema),
    {
        headers: {
            "Content-Type": 'application/json'
        },
    }
)

export const reqUpdateLineSchema = ( line_schema ) => ajax.post( base + "/update/line/schema",
    JSON.stringify(line_schema),
    {
        headers: {
            "Content-Type": 'application/json'
        },
    }
)

export const reqDeleteLineSchemas = ( line_id ) => ajax.post( base + "/delete/line/schemas", { line_id } )

export const reqDeleteLineSchema = ( line_schema_id ) => ajax.post( base + "/delete/line/schema", { line_schema_id } )

export const reqAreaSchemas = ( area_id ) => ajax( base + "/area/schema/list", {
    params: {
        area_id
    }
} )

export const reqAreaSchemaById = ( area_schema_id ) => ajax( base + "/area/schema/info", {
    params: {
        area_schema_id
    }
} )

export const reqAreaSchemaExec = ( area_id ) => ajax( base + "/area/schema/execution", {
    params: {
        area_id
    }
} )

export const reqAreaSchemaSearch = ( start_time, end_time, area_id ) => ajax( base + "/search/area/schema", {
    params: {
        start_time, end_time, area_id
    }
} )

export const reqInsertAreaSchema = ( area_schema ) => ajax.post( base + "/insert/area/schema",
    JSON.stringify(area_schema),
    {
        headers: {
            "Content-Type": 'application/json'
        },
    }
)

export const reqUpdateAreaSchema = ( area_schema ) => ajax.post( base + "/update/area/schema",
    JSON.stringify(area_schema),
    {
        headers: {
            "Content-Type": 'application/json'
        },
    }
)

export const reqDeleteAreaSchemas = ( area_id ) => ajax.post( base + "/delete/area/schemas", { area_id } )

export const reqDeleteAreaSchema = ( area_schema_id ) => ajax.post( base + "/delete/area/schema", { area_schema_id } )


// 文件下载
export const reqSearchData = ( search_keys ) => ajax( base + "/search/data", {
    params: {
        ...search_keys
    }
} )


// warning
export const reqWarning = () => ajax( base + "/warning" )






