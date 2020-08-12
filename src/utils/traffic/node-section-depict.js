import $ from 'jquery'
import {d3} from 'd3-node'
import {reqDirection} from '../../../../assets/api'

/*
	let node_id = this.state.node_id;
	let odiv2 = $("#section")[0];
	let width2 = odiv2.offsetWidth;
	let height2 = odiv2.offsetHeight;
	let section = new NodeSection("#section", width2, height2, "#777");
	section.draw_by_id(node_id, 0); 
	// 根据参数绘制横断面
	draw_by_params(direction);

*/

export class NodeSectionDepict {
    constructor(divID, width, height, background, img_lists) {
		this.divID = divID;
		this.width = width;
		this.height = height;
		this.background = background;
        this.svg = null;
        this.lines = [];
        this.paths = [];
        this.texts = [];
		this.images = [];
        this.lines_arrow = [];
        this.change_objs_index = -1;
        this.change_objs_img = "";

        this.initSvg();
        this.initOption(img_lists);
    }

	initSvg = (divID = this.divID, width = this.width, height = this.height, background = this.height) => {
        this.svg = d3.select(divID).append("svg").attr('width', width).attr('height', height).attr("background", background);
	}

	initOption = () => {
		let option = {
            // 从左到右车道顺序 物体
			lane_type : ["pedestrian1", "tree2", "bike1", "tree1", "car1", "grass1", "car1", "grass2", "car2", "grass1", "car2", "tree1", "bike2", "tree2", "pedestrian2"],
            // 物体对应路基的高度(即路基高度)
            roadbed_height: [3,3,1,3,1,3,1,1,1,1,1,3,1,3,3],
            annotion_lineWidth: 2,
            annotion_height: 10,
            annotion_text_fontSize: 10,
            arrow_width: 4.5,
            img: {
				"bike1": "bike1.png",
				"bike2": "bike2.png",
				"car1": "car1.png",
				"car2": "car2.png",
				"pedestrian1": "pedestrian1.png",
				"pedestrian2": "pedestrian2.png",
				"tree1": "tree1.png",
				"tree2": "tree2.png",
				"grass1": "grass1.png",
				"grass2": "grass2.png"
			},
			img_wh: {
				"bike1": [6, 8],
				"bike2": [6, 8],
				"car1": [8, 8],
				"car2": [8, 8],
				"pedestrian1": [5, 7],
				"pedestrian2": [6, 7],
				"tree1": [8, 15],
				"tree2": [8, 15],
				"grass1": [6, 4],
				"grass2": [6, 4]
			},
			colors: ["#ddd", "#000", "#333", "#00f", "#00f", "#00f", "#0f0"],
			scale: 3,
		}
		let direction = {
			entry_main_num : 3,					// 进口主道数
			entry_expand_num : 2,					// 进口展宽车道数
			exit_main_num : 3,					// 出口主道数
			lane_dir : 'L,L,T,T,T,R',				// 进口车道行驶方向
			// 进口区划
			median : 0, 							// 是否存在中央分隔带
			// 辅道
			entry_sub : 0,						// 进口是否存在辅道
			entry_main_sub_sep : 0,		// 进口主辅隔离方式
			entry_sub_num : 2,					// 进口辅道数
			exit_sub : 0,						// 出口是否存在辅道
			exit_main_sub_sep : 0,		// 出口主辅隔离方式
			exit_sub_num : 2,					// 出口辅道数
			// 非机动车道
			entry_car_bike_sep : 1,		// 进口机非隔离方式
			exit_car_bike_sep : 1,		// 出口机非隔离方式
			// 行人道
			entry_pedestrian : 1,				// 是否存在行人道
			entry_bike_pedestrian_sep : 1,
			entry_pedestrian_width : 3,
			exit_pedestrian : 1,				// 是否存在行人道
			exit_bike_pedestrian_sep : 1,
			exit_pedestrian_width : 3,
			// 车道宽
			entry_main_width : 3,					// 进口主道宽度
			entry_sub_width : 3,					// 进口辅道宽度
			exit_main_width : 3,					// 出口主道宽度
			exit_sub_width : 3,					// 出口辅道宽度
			entry_bike_width : 2,					// 进口非机动车道宽度
			exit_bike_width : 2,					// 出口非机动车道宽度
			// 展宽情况
			median_width : 3,							// 中央分隔带宽度
			// 第四级
			entry_car_bike_sep_width : 2,		// 进口机非隔离宽度
			entry_main_sub_sep_width : 2,		// 进口主辅隔离宽度
			exit_main_sub_sep_width : 2,		// 出口主辅隔离宽度
			exit_car_bike_sep_width : 2,		// 出口机非隔离宽度
		};
		this.option = option;
		this.direction = direction;
		this.svg.append("g").attr("id", "aarrow");
	}

    // 标注箭头  annotion_arrow
    create_section_icon = () => {
		let annotion_arrow = this.svg.append("defs").attr("id", "annotion_arrow").selectAll("marker")
		.append("marker").attr("id", "arrow_right").attr("viewBox","0 0 4.5 3")
		.attr("markerWidth","4.5").attr("markerHeight","3").attr("orient", "auto").attr("markerUnits", "strokeWidth")
		.attr("refX", "0").attr("refY", "1.5").append("path").attr("d", "M0,0 L0,3 L4.5,1.5 z")
		.attr("fill", "#fff");
		annotion_arrow.append("marker").attr("id", "arrow_left").attr("viewBox","0 0 4.5 3")
		.attr("markerWidth","4.5").attr("markerHeight","3").attr("orient", "auto").attr("markerUnits", "strokeWidth")
		.attr("refX", "4.5").attr("refY", "1.5").append("path").attr("d", "M0,1.5 L4.5,0 L4.5,3 z").attr("fill", "#fff");
	}
	
    getBase64Image = (url, width = 200, height = 200) => {
        let img = new Image(width, height);
		// 图片加载目录
		let src = require("../../../../public/images/" + url);
        img.src = src;
        let canvas = document.createElement("canvas");
        canvas.width = width ? width : img.width;
        canvas.height = height ? height : img.height;
        let ctx = canvas.getContext("2d");
        return new Promise((resolve, reject) => {
            img.onload = () => {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                let dataURL = canvas.toDataURL();
                return resolve(dataURL);
            }
            img.onerror = () => {
                console.log("图片" + url + "读取错误！");
            }
        })
    }

	set_section_param = (direction) => {
		let lane_num = [];
		let lane_length = [];
		// 进口行人道
		lane_num.push(direction.entry_pedestrian);
		lane_length.push(direction.entry_pedestrian_width);
		// 进口人非隔离
		lane_num.push(direction.entry_bike_pedestrian_sep>0?1:0);
		lane_length.push(direction.entry_bike_pedestrian_sep);
		// 进口非机动车道
		lane_num.push(direction.entry_bike_width>0?1:0);
		lane_length.push(direction.entry_bike_width);
		// 进口机非隔离
		lane_num.push(direction.entry_car_bike_sep);
		lane_length.push(direction.entry_car_bike_sep_width);
		// 进口辅道
		lane_num.push(direction.entry_sub * direction.entry_sub_num);
		lane_length.push(direction.entry_sub * direction.entry_sub_width);
		// 进口主辅隔离
		lane_num.push(direction.entry_main_sub_sep>0?1:0);
		lane_length.push(direction.entry_main_sub_sep_width);
		// 进口主道
		lane_num.push(direction.entry_main_num + direction.entry_expand_num);
		lane_length.push(direction.entry_main_width);
		// 中央分隔带
		lane_num.push(direction.median);
		lane_length.push(direction.median_width);

		// 出口主道
		lane_num.push(direction.exit_main_num);
		lane_length.push(direction.exit_main_width);
		// 出口主辅隔离
		lane_num.push(direction.exit_main_sub_sep>0?1:0);
		lane_length.push(direction.exit_main_sub_sep_width);
		// 出口辅道
		lane_num.push(direction.exit_sub * direction.exit_sub_num);
		lane_length.push(direction.exit_sub * direction.exit_sub_width);
		// 出口机非隔离
		lane_num.push(direction.exit_car_bike_sep);
		lane_length.push(direction.exit_car_bike_sep_width);
		// 出口非机动车道
		lane_num.push(direction.exit_bike_width>0?1:0);
		lane_length.push(direction.exit_bike_width);
		// 出口人非隔离
		lane_num.push(direction.exit_bike_pedestrian_sep>0?1:0);
		lane_length.push(direction.exit_bike_pedestrian_sep);
		// 出口行人道
		lane_num.push(direction.exit_pedestrian);
		lane_length.push(direction.exit_pedestrian_width);

		this.lane_num = lane_num;
		this.lane_length = lane_length;
	}
    
	// 参数计算
    set_section_option = (direction) => {
		this.set_section_param(direction);
		let option = this.option;
        let annotion_lineWidth = option.annotion_lineWidth;
        let annotion_height = option.annotion_height;
        // let annotion_text_fontSize = option.annotion_text_fontSize;
        let arrow_width = option.arrow_width;

		let lane_width = [];
        let objs_h = [];
        let objs_w = [];
        let objs_url = [];
        let objs_bed_h = [];
		let objs_x = [];
        let objs = [];

		this.lane_num.forEach((e,i) => {
			if(e !== 0){
				if(i === 4 || i === 6 || i === 8 || i === 10){
					for(let j = 0; j < e; j++){
						lane_width.push(this.lane_length[i]);
						objs.push(option.lane_type[i]);
                        objs_w.push(option.img_wh[option.lane_type[i]][0]);
                        objs_h.push(option.img_wh[option.lane_type[i]][1]);
                        objs_url.push(option.img[option.lane_type[i]]);
                        objs_bed_h.push(option.roadbed_height[i]);
					}
				}else{
					lane_width.push(this.lane_length[i]);
					objs.push(option.lane_type[i]);
                    objs_w.push(option.img_wh[option.lane_type[i]][0]);
                    objs_h.push(option.img_wh[option.lane_type[i]][1]);
                    objs_url.push(option.img[option.lane_type[i]]);
                    objs_bed_h.push(option.roadbed_height[i]);
				}
			}
		});

		lane_width.forEach((e) => objs_x.length===0?objs_x.push([0 + e/2, 0, 0 + e]):objs_x.push([objs_x[objs_x.length - 1][2] + e/2, objs_x[objs_x.length - 1][2], objs_x[objs_x.length - 1][2] + e]));
        
        let objs_h_max = Math.max.apply(null, objs_h);
        let objs_bed_h_max = Math.max.apply(null, option.roadbed_height);

        let paint_w = objs_x[objs_x.length-1][2];
        let paint_h = option.annotion_height + objs_h_max + objs_bed_h_max;
        let scale_x = this.width / paint_w / 1.2;
        let scale_y = 5;
        let scale = Math.min(scale_x, scale_y);
        let offset_x = this.width / scale_x / 2 - paint_w / 2;
        let offset_y = this.height / scale_y / 2 - paint_h / 2;

        let rects = objs_x.map((e,i) => {
            return [(offset_x + e[1])*scale_x, (offset_y+objs_h_max+objs_bed_h_max-objs_bed_h[i])*scale_y, (e[2]-e[1]) * scale_x, objs_bed_h[i] * scale_y, option.colors[0], option.colors[2]];
        })
        let annotions = objs_x.map((e,i)=>{
            return [(offset_x + e[1])*scale_x + arrow_width * annotion_lineWidth, (offset_y+objs_h_max+objs_bed_h_max+annotion_height/2)*scale_y, (offset_x + e[2])*scale_x - arrow_width * annotion_lineWidth, (offset_y+objs_h_max+objs_bed_h_max+annotion_height/2)*scale_y, option.colors[3], option.annotion_lineWidth];
        })
        let sub_line1 = objs_x.map((e,i)=>{
            return [(offset_x + e[1])*scale_x, (offset_y+objs_h_max+objs_bed_h_max)*scale_y, (offset_x + e[1])*scale_x, (offset_y+objs_h_max+objs_bed_h_max+annotion_height)*scale_y, option.colors[4], 0.5];
        })
        let sub_line2 = objs_x.map((e,i)=>{
            return [(offset_x + e[2])*scale_x, (offset_y+objs_h_max+objs_bed_h_max)*scale_y, (offset_x + e[2])*scale_x, (offset_y+objs_h_max+objs_bed_h_max+annotion_height)*scale_y, option.colors[4], 0.5];
        })
        let annotion_texts = objs_x.map((e,i)=>{
            return [(offset_x + e[0])*scale_x, (offset_y+objs_h_max+objs_bed_h_max+annotion_height/2 - 1)*scale_y, option.colors[5], option.annotion_text_fontSize, lane_width[i] + "m"];
        })
        let objs_lane = objs_x.map((e,i) => {
            return [(offset_x + e[0])*scale_x - objs_w[i] * scale / 2, (offset_y + objs_bed_h_max - objs_bed_h[i])*scale_y + (objs_h_max - objs_h[i]) * scale, objs_w[i]*scale, objs_h[i]*scale]
        })
        
        this.rects = rects;
        this.annotions = annotions;
        this.sub_line1 = sub_line1;
        this.sub_line2 = sub_line2;
        this.annotion_texts = annotion_texts;
        this.objs_lane = objs_lane;
        this.objs_url = objs_url;
        this.objs_w = objs_w;
        this.objs_h = objs_h;
        this.objs = objs;
        option.scale = scale;
    }

    edit_img = (index, url) => {
        let option = this.option;
        this.getBase64Image(url, this.objs_w[index] * option.scale, this.objs_h[index] * option.scale).then(base64_obj => {
            this.svg.select("#img" + index)
            .attr("xlink:href", base64_obj)
            .on("click", () => {
                this.change_objs_img = this.objs[index];
                this.change_objs_index = index;
                let img_lists = document.getElementById(this.objs[index] + "_lists");
                img_lists.style.display="block";
                $("#" + this.objs[index] + "_lists .close_all").on("click", () => {
                    img_lists.style.display = "none";
                })
            })
        })
    }
	
    draw_section = () => {
        this.clearSvg();
        let option = this.option;
        // let objs_lane = this.objs_lane;
        this.svg.append("g").attr("id", "roadbed").selectAll("rect").data(this.rects).enter().append("rect")
			.attr("x", (d, i) => d[0] ).attr("y", (d, i) => d[1]).attr("width", (d, i) => d[2]).attr("height", (d, i) => d[3])
			.attr("stroke", (d, i) => d[4])
			.attr("fill", (d, i) => d[5]);
        
        this.svg.append("g").attr("id", "annotion_line").selectAll("line").data(this.annotions).enter().append("line")
		.attr("x1", (d, i) => d[0] ).attr("y1",  (d, i) => d[1] )
		.attr("x2", (d, i) => d[2] ).attr( "y2",  (d, i) => d[3] )
		.attr("stroke", (d, i) => d[4] ).attr("stroke-width", (d, i) => d[5] )
		.attr( "marker-end", "url(#arrow_right)" ).attr( "marker-start", "url(#arrow_left)" );
		
		this.svg.append("g").attr("id", "annotion_subline1").selectAll("line").data(this.sub_line1).enter()
        .append("line")
		.attr("x1", (d, i) => d[0]).attr("y1", (d, i) => d[1]).attr("x2", (d, i) => d[2]).attr("y2", (d, i) => d[3])
		.attr("stroke", (d, i) => d[4]).attr("stroke-width", (d, i) => d[5]);
		
		this.svg.append("g").attr("id", "annotion_subline2").selectAll("line").data(this.sub_line2).enter()
        .append("line")
		.attr("x1", (d, i) => d[0]).attr("y1", (d, i) => d[1] ).attr("x2", (d, i) => d[2] ).attr("y2",(d, i) => d[3])
		.attr("stroke", (d, i) => d[4]).attr("stroke-width", (d, i) => d[5]);

		// 标柱文字
		this.svg.append("g").attr("id", "annotion_text").selectAll("text").data(this.annotion_texts).enter().append("text")
			.attr("x", (d,i) => d[0]).attr("y", (d,i) => d[1]).attr("fill", (d,i)=> d[2])
			.attr("font-size", (d,i) => d[3]).text((d,i) => d[4])
			.attr("text-anchor", "middle");

        let travel_image = this.svg.append("g").attr("id", "travelimage");
        for(let j = 0; j < this.objs_url.length; j++) {
            this.getBase64Image(this.objs_url[j], this.objs_w[j] * option.scale, this.objs_h[j] * option.scale).then(base64_obj => {
                travel_image.append("image").attr("id", "img"+j).attr("x", this.objs_lane[j][0])
                .attr("y", this.objs_lane[j][1])
                .attr("width", this.objs_lane[j][2])
                .attr("height", this.objs_lane[j][3])
				.attr("xlink:href", base64_obj)
				/*
                .on("click", () => {
                    this.change_objs_img = this.objs[j];
                    this.change_objs_index = j;
                    let img_lists = document.getElementById(this.objs[j] + "_lists");
                    img_lists.style.display="block";
                    $("#" + this.objs[j] + "_lists .close_all").on("click", () => {
                        img_lists.style.display = "none";
                    })
				})
				*/
            })
        }
    }
	// 清理svg
	clearSvg = () => {
		this.svg.selectAll("*").remove();
	}
	// 设置新的布局属性
	setOption = (direction = this.direction) => {
		this.set_section_option(direction);
		this.draw_section();
	}
	
	// 根据数据库中node_id及方向绘制
	draw_by_id = (node_id, orientation = 0) => {
		this.clearSvg();
		let dir = ["east", "south", "west", "north"];
		reqDirection(node_id).then((res) => {
			if(res.data.code === 1){
				let result = res.data.data;
				if(result[dir[orientation]]){
					let direction = result[dir[orientation]];
					this.setOption(direction);
				}
			}else{
				alert("为获取到流量数据！")
			}
		});
	}
	// 根据输入参数绘制方向数据
	draw_by_params = (direction = this.direction) => {
		this.clearSvg();
		this.setOption(direction);
	}

	// svg转图像
    svg2png = () => {

        let serializer = new XMLSerializer();  
        let source = serializer.serializeToString(this.svg.node());
        source = '<?xml version="1.0" standalone="no"?>\r\n' + source;  
        let url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
        document.write('<img src="' + url + '"/>');

        let canvas = document.createElement("canvas");  
        canvas.width = this.width;
        canvas.height = this.height;

        let context = canvas.getContext("2d");  
        let image = new Image();  
        image.src = document.getElementsByTagName('img')[0].src;

        let saveLink = document.createElement("a");  
        saveLink.download = this.name+"横断面图.png";
        saveLink.target = "_blank";
        saveLink.style.display = "none";
        document.body.appendChild(saveLink);

        image.onload = function() {  
            // 画入canvas
            context.drawImage(image, 0, 0);
            // 创建链接
            saveLink.href = canvas.toDataURL("image/png");
            saveLink.click();
            document.body.removeChild(saveLink);
        };
    }
    // 绑定下载按钮
	bindButton = (btnId) => {
        $(btnId).click('on', () => {
            this.svg2png();
        });
    }
}

