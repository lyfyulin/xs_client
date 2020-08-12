
import L from 'leaflet'

/*
	参考：https://github.com/mourner/simpleheat/blob/gh-pages/simpleheat.js
*/
function simpleheat(canvas) {
    if (!(this instanceof simpleheat)) return new simpleheat(canvas);

    this._canvas = canvas = typeof canvas === 'string' ? document.getElementById(canvas) : canvas;

    this._ctx = canvas.getContext('2d');
    this._width = canvas.width + 1;
    this._height = canvas.height + 1;

    this._max = 1;
    this._data = [];
}

simpleheat.prototype = {

    defaultRadius: 25,

    defaultGradient: {
        0.4: 'blue',
        0.6: 'cyan',
        0.7: 'lime',
        0.8: 'yellow',
        1.0: 'red'
    },

    data: function (data) {
        this._data = data;
        return this;
    },

    max: function (max) {
        this._max = max;
        return this;
    },

    add: function (point) {
        this._data.push(point);
        return this;
    },

    clear: function () {
        this._data = [];
        return this;
    },

    radius: function (r, blur) {
        blur = blur === undefined ? 15 : blur;

        // create a grayscale blurred circle image that we'll use for drawing points
        var circle = this._circle = this._createCanvas(),
            ctx = circle.getContext('2d'),
            r2 = this._r = r + blur;

        circle.width = circle.height = r2 * 2;

        ctx.shadowOffsetX = ctx.shadowOffsetY = r2 * 2;
        ctx.shadowBlur = blur;
        ctx.shadowColor = 'black';

        ctx.beginPath();
        ctx.arc(-r2, -r2, r, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();

        return this;
    },

    resize: function () {
        this._width = this._canvas.width;
        this._height = this._canvas.height;
    },

    gradient: function (grad) {
        // create a 256x1 gradient that we'll use to turn a grayscale heatmap into a colored one
        var canvas = this._createCanvas(),
            ctx = canvas.getContext('2d'),
            gradient = ctx.createLinearGradient(0, 0, 0, 256);

        canvas.width = 1;
        canvas.height = 256;

        for (var i in grad) {
            gradient.addColorStop(+i, grad[i]);
        }

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1, 256);

        this._grad = ctx.getImageData(0, 0, 1, 256).data;

        return this;
    },

    draw: function (minOpacity) {
        if (!this._circle) this.radius(this.defaultRadius);
        if (!this._grad) this.gradient(this.defaultGradient);

        var ctx = this._ctx;

        ctx.clearRect(0, 0, this._width, this._height);

        // draw a grayscale heatmap by putting a blurred circle at each data point
        for (var i = 0, len = this._data.length, p; i < len; i++) {
            p = this._data[i];
            ctx.globalAlpha = Math.min(Math.max(p[2] / this._max, minOpacity === undefined ? 0.05 : minOpacity), 1);
            ctx.drawImage(this._circle, p[0] - this._r, p[1] - this._r);
        }

        // colorize the heatmap, using opacity value of each pixel to get the right color from our gradient
        if(this._width !== 0){// 画布宽度不为0时执行
            var colored = ctx.getImageData(0.1, 0.1, this._width!==0?this._width:0.1, this._height!==0?this._height:0.1);
            this._colorize(colored.data, this._grad);
            ctx.putImageData(colored, 0, 0);
        }

        return this;
    },

    _colorize: function (pixels, gradient) {
        for (var i = 0, len = pixels.length, j; i < len; i += 4) {
            j = pixels[i + 3] * 4; // 获取 gradient 颜色和透明度

            if (j) {
                pixels[i] = gradient[j];
                pixels[i + 1] = gradient[j + 1];
                pixels[i + 2] = gradient[j + 2];
            }
        }
    },

    _createCanvas: function () {
        if (typeof document !== 'undefined') {
            return document.createElement('canvas');
        } else {
            // 创建一个 canvas 实例
            // canvas 需要一个默认的无参构造器
            return new this._canvas.constructor();
        }
    }
}

/*
 	https://github.com/Leaflet/Leaflet.heat
*/
L.HeatLayer = (L.Layer?L.Layer:L.Class).extend({
	// 构造函数
	initialize: function(t,i)  {
		this._latlngs=t
		L.setOptions(this,i)
    },
    // 设置经纬度
	setLatLngs: function(t){
		return this._latlngs = t, this.redraw()
    },
    // 添加经纬度
	addLatLng:function(t){
		return this._latlngs.push(t),this.redraw()
	},
	// 设置热力图 options 并且 redraw
	setOptions:function(t){
		return L.setOptions(this,t),this._heat&&this._updateOptions(),this.redraw()
	},
	// 重画
	redraw:function(){return!this._heat||this._frame||this._map._animating||(this._frame=L.Util.requestAnimFrame(this._redraw,this)),this},
	onAdd:function(t){
		this._map=t
		this._canvas||this._initCanvas()
		t._panes.overlayPane.appendChild(this._canvas)
		t.on("moveend",this._reset,this)
		t.options.zoomAnimation&&L.Browser.any3d&&t.on("zoomanim",this._animateZoom,this)
		this._reset()
	},
	onRemove:function(t){
		t.getPanes().overlayPane.removeChild(this._canvas)
		t.off("moveend",this._reset,this)
		t.options.zoomAnimation&&t.off("zoomanim",this._animateZoom,this)
	},
	addTo:function(t){
		return t.addLayer(this),this
	},
	_initCanvas:function(){
		var t=this._canvas=L.DomUtil.create("canvas","leaflet-heatmap-layer leaflet-layer"),i=L.DomUtil.testProp(["transformOrigin","WebkitTransformOrigin","msTransformOrigin"]);
		t.style[i]="50% 50%";var a=this._map.getSize();
		t.width=a.x
		t.height=a.y;
		var s=this._map.options.zoomAnimation&&L.Browser.any3d;
		L.DomUtil.addClass(t,"leaflet-zoom-"+(s?"animated":"hide"))
		this._heat=simpleheat(t)
		this._updateOptions()
	},
	_updateOptions:function(){
		this._heat.radius(this.options.radius||this._heat.defaultRadius,this.options.blur)
		this.options.gradient&&this._heat.gradient(this.options.gradient)
		this.options.max&&this._heat.max(this.options.max)
	},
	_reset:function(){
		var t=this._map.containerPointToLayerPoint([0,0]);
		L.DomUtil.setPosition(this._canvas,t);
		var i=this._map.getSize();
		this._heat._width!==i.x&&(this._canvas.width=this._heat._width=i.x)
		this._heat._height!==i.y&&(this._canvas.height=this._heat._height=i.y)
		this._redraw()
	},
	_redraw:function(){
		var t,i,a,s,e,n,h,o,r,d=[],_=this._heat._r,l=this._map.getSize(),m=new L.Bounds(L.point([-_,-_]),l.add([_,_])),c=void 0===this.options.max?1:this.options.max,u=void 0===this.options.maxZoom?this._map.getMaxZoom():this.options.maxZoom,f=1/Math.pow(2,Math.max(0,Math.min(u-this._map.getZoom(),12))),g=_/2,p=[],v=this._map._getMapPanePos(),w=v.x%g,y=v.y%g;
		for(t=0,i=this._latlngs.length;i>t;t++)
			if(a=this._map.latLngToContainerPoint(this._latlngs[t]),m.contains(a)){
				e=Math.floor((a.x-w)/g)+2
				n=Math.floor((a.y-y)/g)+2;
				var x=void 0!==this._latlngs[t].alt?this._latlngs[t].alt:void 0!==this._latlngs[t][2]?+this._latlngs[t][2]:1
				r=x*f
				p[n]=p[n]||[]
				s=p[n][e]
				if(s){
					s[0]=(s[0]*s[2]+a.x*r)/(s[2]+r)
					s[1]=(s[1]*s[2]+a.y*r)/(s[2]+r)
					s[2]+=r
				}else{
					p[n][e]=[a.x,a.y,r]
				}
			}
		for(t=0,i=p.length;i>t;t++)
			if(p[t])
				for(h=0,o=p[t].length;o>h;h++){
					s=p[t][h]
					s&&d.push([Math.round(s[0]),Math.round(s[1]),Math.min(s[2],c)])
				}
		this._heat.data(d).draw(this.options.minOpacity)
		this._frame=null
	},
	_animateZoom:function(t){
		var i=this._map.getZoomScale(t.zoom),a=this._map._getCenterOffset(t.center)._multiplyBy(-i).subtract(this._map._getMapPanePos());
		L.DomUtil.setTransform?L.DomUtil.setTransform(this._canvas,a,i):this._canvas.style[L.DomUtil.TRANSFORM]=L.DomUtil.getTranslateString(a)+" scale("+i+")"
	}
});

export default function heatlayer (t, i){
	return new L.HeatLayer(t, i)
}
