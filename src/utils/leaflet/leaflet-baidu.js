/** 
 * 百度地图底图调用插件
 * @author 火星科技
 */
//请引入 proj4.js 和 proj4leaflet.js
L.CRS.Baidu = new L.Proj.CRS('EPSG:900913', '+proj=merc +a=6378206 +b=6356584.314245179 +lat_ts=0.0 +lon_0=0.0 +x_0=0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs', {
    resolutions: function () {
        level = 19
        var res = [];
        res[0] = Math.pow(2, 18);
        for (var i = 1; i < level; i++) {
            res[i] = Math.pow(2, (18 - i))
        }
        return res;
    }(),
    origin: [0, 0],
    bounds: L.bounds([20037508.342789244, 0], [0, 20037508.342789244])
});

L.tileLayer.baidu = function (option) {
    option = option || {};

    var layer;
    var subdomains = '0123456789';
    switch (option.layer) {
        //单图层
        case "vec":
        default:
            //'http://online{s}.map.bdimg.com/tile/?qt=tile&x={x}&y={y}&z={z}&styles=pl&b=0&limit=60&scaler=1&udt=20170525'
            layer = L.tileLayer('http://online{s}.map.bdimg.com/onlinelabel/?qt=tile&x={x}&y={y}&z={z}&styles=' + (option.bigfont ? 'ph' : 'pl') + '&scaler=1&p=1', {
                name:option.name,subdomains: subdomains, tms: true
            });
            break;
        case "img_d": 
            layer = L.tileLayer('http://shangetu{s}.map.bdimg.com/it/u=x={x};y={y};z={z};v=009;type=sate&fm=46', {
                name: option.name, subdomains: subdomains, tms: true
            });
            break;
        case "img_z":
            layer = L.tileLayer('http://online{s}.map.bdimg.com/tile/?qt=tile&x={x}&y={y}&z={z}&styles=' + (option.bigfont ? 'sh' : 'sl') + '&v=020', {
                name: option.name, subdomains: subdomains, tms: true
            });
            break;

        case "custom"://Custom 各种自定义样式
            //可选值：dark,midnight,grayscale,hardedge,light,redalert,googlelite,grassgreen,pink,darkgreen,bluish
            option.customid = option.customid || 'midnight';
            layer = L.tileLayer('http://api{s}.map.bdimg.com/customimage/tile?&x={x}&y={y}&z={z}&scale=1&customid=' + option.customid, {
                name: option.name, subdomains: "012", tms: true
            });
            break;

        case "time"://实时路况
            var time = new Date().getTime();
            layer = L.tileLayer('http://its.map.baidu.com:8002/traffic/TrafficTileService?x={x}&y={y}&level={z}&time=' + time + '&label=web2D&v=017', {
                name: option.name, subdomains: subdomains, tms: true
            });
            break;

            //合并
        case "img":
            layer = L.layerGroup([
				L.tileLayer.baidu({ name: "底图", layer: 'img_d', bigfont: option.bigfont }),
				L.tileLayer.baidu({ name: "注记", layer: 'img_z', bigfont: option.bigfont })
            ]);
            break;
    }
    return layer;
};

function readyMap() {

    var map = L.map('map', {
        attributionControl: false,
        center: [31.834912, 117.220102],
        zoom: 12
    });

    //控制地图底图
    var baseLayers = {
        "高德地图": L.tileLayer('http://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}', { subdomains: "1234" }).addTo(map),
        "高德影像": L.layerGroup(
            [
                L.tileLayer('http://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}', { subdomains: "1234" }),
                L.tileLayer('http://webst0{s}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8', { subdomains: "1234" })
            ]
        ),
        //天地图tk可以换成自己申请的key
        "天地图": L.layerGroup([
            L.tileLayer('http://t{s}.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=56b81006f361f6406d0e940d2f89a39c', { subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'] }),
            L.tileLayer('http://t{s}.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=56b81006f361f6406d0e940d2f89a39c', { subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'] })
        ]),
        "天地图影像": L.layerGroup([
            L.tileLayer('http://t{s}.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=56b81006f361f6406d0e940d2f89a39c', { subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'] }),
            L.tileLayer('http://t{s}.tianditu.gov.cn/cia_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=56b81006f361f6406d0e940d2f89a39c', { subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'] })
        ]),
        "天地图地形": L.layerGroup([
            L.tileLayer('http://t{s}.tianditu.gov.cn/ter_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ter&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=56b81006f361f6406d0e940d2f89a39c', { subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'] }),
            L.tileLayer('http://t{s}.tianditu.gov.cn/cta_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cta&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=56b81006f361f6406d0e940d2f89a39c', { subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'] })
        ]),

        "Google地图": L.tileLayer('http://mt1.google.cn/vt/lyrs=m@207000000&hl=zh-CN&gl=CN&src=app&x={x}&y={y}&z={z}&s=Galile'),
        "Google影像": L.layerGroup([
            L.tileLayer('http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&gl=CN&x={x}&y={y}&z={z}&s=Gali'),
            L.tileLayer('http://mt1.google.cn/vt/imgtp=png32&lyrs=h@207000000&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}&s=Galil')
        ]),

        "GeoQ ": L.tileLayer('http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer/tile/{z}/{y}/{x}'),
        "GeoQ 藏蓝": L.tileLayer('http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}'),
        "GeoQ 灰": L.tileLayer('http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetGray/MapServer/tile/{z}/{y}/{x}')
    };

    L.control.layers(baseLayers, {}, { position: "topright" }).addTo(map);

}