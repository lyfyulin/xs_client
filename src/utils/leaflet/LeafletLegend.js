import L from 'leaflet'

import '../../assets/css/lyf-legend.css'

L.Control.RangeLegend = L.Control.extend({
    options: {
        position: 'topright' //初始位置
    },
    initialize: function (options) {
        L.Util.extend(this.options, options);

    },
    onAdd: function (map) {
        //创建一个class为info legend的div
        this._container = L.DomUtil.create('div', 'info');
        //创建一个图片要素
        let  grades = [0, 10, 20, 50, 100, 200, 500, 1000], labels = [], from, to

        for (var i = 0; i < grades.length; i++) {
            from = grades[i]
            to = grades[i + 1]
            labels.push('<div style="background:' + this._getColor(from + 1) + '">' + from + (to ? '&ndash;' + to : '+') + '</div>')
        }
        this._container.innerHTML = labels.join('');              
        return this._container;
    },
    _getColor: function(d) {
        return d > 1000 ? '#800026' :
            d > 500 ? '#BD0026' :
                d > 200 ? '#E31A1C' :
                    d > 100 ? '#FC4E2A' :
                        d > 50 ? '#FD8D3C' :
                            d > 20 ? '#FEB24C' :
                                d > 10 ? '#FED976' :
                                    '#FFEDA0';
    },
    onRemove: function (map) {
        // Nothing to do here
    }
});
L.control.rangeLegend = function (opts) {
    return new L.Control.RangeLegend(opts);
}








L.Control.LinkLegend = L.Control.extend({
    options: {
        position: 'topright' //初始位置
    },
    initialize: function (options) {
        L.Util.extend(this.options, options);

    },
    onAdd: function (map) {
        //创建一个class为info legend的div
        this._container = L.DomUtil.create('div', 'link-legend');
        //创建一个图片要素
        let  grades = ['畅通', '基本畅通', '轻度拥堵', '中度拥堵', '严重拥堵'], labels = [], colors = ['#35843e', '#87cc26', '#edee20', '#f58522', '#eb222c'];

        for (var i = 0; i < grades.length; i++) {
            labels.push(`<div class="link-legend-item"><div class="link-legend-color" style="background:${colors[i]}"></div><div class="link-legend-font">${grades[i]}</div></div>`)
        }
        this._container.innerHTML = labels.join('');              
        return this._container;
    },
    onRemove: function (map) {
        // Nothing to do here
    }
});
L.control.linkLegend = function (opts) {
    return new L.Control.LinkLegend(opts);
}