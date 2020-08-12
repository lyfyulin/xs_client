import {d3} from 'd3-node'
import $ from 'jquery'

class link_node {

    constructor(svg, offsetwidth, offsetheight, opt = {}) {
        this.svg = svg;
		this.offsetheight = offsetheight;
		this.offsetwidth = offsetwidth;
        this.lines = [];
        this.paths = [];
        this.texts = [];
		this.lines_arrow = [];
		this.option = {};
		this.initOption(opt);
		this.link_pts = {entry_edge:[], exit_edge: [], median1:[], median2:[], entry_lane:[], exit_lane:[]};
    }
	
	initOption = (opt) => {

		let init_option = {
			offsetwidth: this.offsetwidth,
			offsetheight: this.offsetheight,
			background: "#777",
			scale: 2,
			extend_length: 0,

			COLOR_WHITE : "#fff",
			COLOR_RED : "#f00",
			COLOR_BLUE : "#00f",
			COLOR_GREEN : "#0f0",
			COLOR_YELLOW : "#ff0",
			COLOR_CYAN : "#0ff",
			COLOR_BLACK : "#000",

			lineWidth : 1,
			dashArray : "5,5",
			dashArraySolid : "",
			dashArraySidwWalk : "3,3",
			dashOffset : 3,
			dashOffsetNone : 0,
			doubleYellowGap : 1,
			layoutFontSize: 6,

			lastDir : [3, 0, 1, 2],
			nextDir : [1, 2, 3, 0],
			
			// 第一级
			roadName : ["新华西路", "建设南路", "新华西路", "建设南路"],

			// 自动计算
			entry_total_width: [],
			entry_road_total_width: [],
			exit_total_width: [],
			exit_road_total_width: [],
			sidewalk_center_to_center: [],
			stopline_to_center: []
		};

		let option = {...init_option, ...opt};

		// 特殊情况判断
		option.entry_main_num.forEach((e,i) =>{
			if(e === 0){
				option.median[i] = 0;
				option.entry_sub[i] = 0;
				option.median_shrink_flag[i] = 0;
				option.median_line_offset[i] = 0;
			}
		});
		option.exit_main_num.forEach((e,i) =>{
			if(e === 0){
				option.median[i] = 0;
				option.exit_sub[i] = 0;
				option.median_shrink_flag[i] = 0;
				option.median_line_offset[i] = 0;
			}
		});
		option.median.forEach((e,i)=>{
			if(e === 1){
				option.median_line_offset[i] = 0;
			}
		});
		
		option.entry_total_width = option.angle.map((e,i) => {
			return option.entry_main_num[i] * option.entry_main_width[i] + 
					option.entry_main_sub_sep[i] * (option.entry_sub_num[i] * option.entry_sub_width[i] + option.entry_main_sub_sep_width[i]) + 
					option.entry_car_bike_sep[i] * (option.entry_car_bike_sep_width[i] + option.entry_bike_width[i]) + 
					option.median_shrink_flag[i] * option.median_shrink_width[i] + 
					option.entry_expand[i] * option.entry_expand_width[i] + 
					option.median_line_offset[i] * option.median_line_offset_width[i];
			
		})
		option.entry_road_total_width = option.angle.map((e,i) => {
			return option.entry_main_num[i] * option.entry_main_width[i] + 
					option.entry_main_sub_sep[i] * (option.entry_sub_num[i] * option.entry_sub_width[i] + option.entry_main_sub_sep_width[i]) + 
					option.entry_car_bike_sep[i] * (option.entry_car_bike_sep_width[i] + option.entry_bike_width[i]);
		});
		option.exit_total_width = option.angle.map((e,i) => {
			return option.exit_main_num[i] * option.exit_main_width[i] + 
				option.exit_main_sub_sep[i] * (option.entry_sub_num[i] * option.entry_sub_width[i] + option.exit_main_sub_sep_width[i]) + 
				option.exit_car_bike_sep[i] * (option.exit_car_bike_sep_width[i] + option.exit_bike_width[i]) -
				option.median_line_offset[i] * option.median_line_offset_width[i];
		});
		option.exit_road_total_width = option.angle.map((e,i) => {
			return option.exit_main_num[i] * option.exit_main_width[i] + 
				option.exit_main_sub_sep[i] * (option.entry_sub_num[i] * option.entry_sub_width[i] + option.exit_main_sub_sep_width[i]) + 
				option.exit_car_bike_sep[i] * (option.exit_car_bike_sep_width[i] + option.exit_bike_width[i]);
		});
		option.sidewalk_center_to_center = option.angle.map((e,i) => {
			return option.median[option.lastDir[i]] * option.median_width[option.lastDir[i]]/2 + option.exit_total_width[option.lastDir[i]] + 
				option.safe_island[i] * (option.sidewalk2safeisland_length[i] + option.sidewalk_width[i]/2) + 
				(1-option.safe_island[i]) * (option.sidewalk2curve_length[i] + option.turning_radius[i] + option.sidewalk_width[i]*1.5)
				+ option.median_line_offset[i] * option.median_line_offset_width[i];
		});
		option.stopline_to_center = option.angle.map((e,i) => {
			return option.median[option.lastDir[i]] * option.median_width[option.lastDir[i]]/2 + option.exit_total_width[option.lastDir[i]] + 
				option.safe_island[i] * (option.sidewalk2safeisland_length[i] + option.sidewalk_width[i] * option.sidewalk_flag[i] + option.stopline2sidewalk[i]) + 
				(1-option.safe_island[i]) * (option.sidewalk2last_exit_length[i] + option.turning_radius[i] + option.sidewalk_width[i]*2 + option.stopline2sidewalk[i])
				+ option.median_line_offset[i] * option.median_line_offset_width[i]
				
		});
		this.svg.style("background", option.background);
		this.option = option;
	}

	// 创建导向箭头图标
	create_layout_icon = () => {

		let option = this.option;		
		
		// 直行导向箭头
		let th_arrow = this.svg.append("defs").attr("id", "arrow").append("marker").attr("id", "th_arrow")
		.attr("viewBox","0 0 30 4.5").attr("refX", "0").attr("refY", "2.25").attr("markerWidth", (5*option.scale)).attr("markerHeight", (0.75*option.scale)).attr("orient", "auto").attr("markerUnits", "strokeWidth");	
		th_arrow.append("path").attr("d", "M0,2.25 L12,4.5 L12,3 L30,3 L30,1.5 L12,1.5 L12,0 L0,2.25 z").attr("fill", "#fff");

		// 直左导向箭头
		let th_left_arrow = this.svg.select("#arrow").append("marker").attr("id", "th_left_arrow")
		.attr("viewBox","0 0 30 10").attr("refX", "0").attr("refY", "5").attr("markerWidth", (5*option.scale)).attr("markerHeight", (5/3*option.scale)).attr("orient", "auto").attr("markerUnits", "strokeWidth");	
		th_left_arrow.append("path").attr("d", "M0,2.25 L12,4.5 L12,3 L22,3 L15,7 L10,7 L18,10, L25.5,7 L21,7 L28,3 L30,3 L30,1.5 L12,1.5 L12,0 L0,2.25 z").attr("fill", "#fff");

		// 直右导向箭头
		let th_right_arrow = this.svg.select("#arrow").append("marker").attr("id", "th_right_arrow")
		.attr("viewBox","0 0 30 10").attr("refX", "0").attr("refY", "5").attr("markerWidth", (5*option.scale)).attr("markerHeight", (5/3*option.scale)).attr("orient", "auto").attr("markerUnits", "strokeWidth");	
		th_right_arrow.append("path").attr("d", "M0,7.75 L12,5.5 L12,7 L22,7 L15,4 L10,4 L18,0, L25.5,4 L21,4 L28,7 L30,7 L30,8.5 L12,8.5 L12,10 L0,7.75 z").attr("fill", "#fff");

		// 左转导向箭头
		let left_arrow = this.svg.select("#arrow").append("marker").attr("id", "left_arrow")
		.attr("viewBox","0 0 30 7.5").attr("refX", "0").attr("refY", "3.75").attr("markerWidth", (5*option.scale)).attr("markerHeight", (1.25*option.scale)).attr("orient", "auto").attr("markerUnits", "strokeWidth");	
		left_arrow.append("path").attr("d", "M0,4.5 L8,7.5 L15.5,4.5 L11,4.5 L16.5,1.5 L30,1.5 L30,0 L10.5,0 L5,4.5 L0,4.5 Z").attr("fill", "#fff");

		// 右转导向箭头
		let right_arrow = this.svg.select("#arrow").append("marker").attr("id", "right_arrow")
		.attr("viewBox","0 0 30 7.5").attr("refX", "0").attr("refY", "3.75").attr("markerWidth", (5*option.scale)).attr("markerHeight", (1.25*option.scale)).attr("orient", "auto").attr("markerUnits", "strokeWidth");	
		right_arrow.append("path").attr("d", "M0,3 L8,0 L15.5,3 L11,3 L16.5,6 L30,6 L30,7.5 L10.5,7.5 L5,3 L0,3 Z").attr("fill", "#fff");

		// 调头箭头
		let uturn_arrow = this.svg.select("#arrow").append("marker").attr("id", "uturn_arrow")
		.attr("viewBox","0 0 30 7.5").attr("refX", "0").attr("refY", "3.75").attr("markerWidth", (5*option.scale)).attr("markerHeight", (1.25*option.scale)).attr("orient", "auto").attr("markerUnits", "strokeWidth");	
		uturn_arrow.append("path").attr("d", "M0,3 L8,0 L15.5,3 L11,3 L16.5,6 L30,6 L30,7.5 L10.5,7.5 L5,3 L0,3 Z").attr("fill", "#fff");

	}
	
	// 人行道
	draw_cross_sidewalk = () => {
		let option = this.option;

		for(let dir = 0; dir < option.angle.length; dir++){
			if(option.sidewalk_flag[dir] !== 0){
				let pt1 = [option.sidewalk_center_to_center[dir], -option.safe_island[dir] * (option.median[dir] * option.median_width[dir] / 2 + option.entry_road_total_width[dir]) - (1 - option.safe_island[dir]) * (option.median[dir] * option.median_width[dir] / 2 + option.entry_road_total_width[dir] + option.entry_expand[dir] * option.entry_expand_width[dir])];
				let pt2 = [option.sidewalk_center_to_center[dir], option.median[dir] * option.median_width[dir] / 2 + option.exit_total_width[dir] + option.median_line_offset[dir] * option.median_line_offset_width[dir]];
				let sidewalk_path = [...pt1, ...pt2].map((e)=> e * option.scale);

				this.lines.push([...sidewalk_path, option.COLOR_WHITE, option.sidewalk_width[dir] * option.scale, option.dashArraySidwWalk, option.dashOffset, "translate(" + option.offsetwidth + "," + option.offsetheight + "),rotate(" + option.angle[dir] + ")"]);
			}
		}
	}

	// 中央分隔带
	draw_cross_median = () => {
		let option = this.option;
		for(let dir = 0; dir < option.angle.length; dir++){
			
			let pt1 = [option.stopline_to_center[dir], option.median[dir] * option.median_width[dir] / 2];
			let pt2 = [option.stopline_to_center[dir] + option.channelized_length[dir] * 2 + option.gradual_length[dir] * 2, option.median[dir] * option.median_width[dir] / 2];
			let pt3 = [option.stopline_to_center[dir] + option.channelized_length[dir] * 2 + option.gradual_length[dir] * 2, -option.median[dir] * option.median_width[dir] / 2];
			let pt4 = [option.stopline_to_center[dir] + option.channelized_length[dir] + option.gradual_length[dir], -option.median[dir] * option.median_width[dir] / 2];
			let pt5 = [option.stopline_to_center[dir] + option.channelized_length[dir], -option.median[dir] * (option.median_width[dir] / 2 - option.median_shrink_flag[dir] * option.median_shrink_width[dir])];
			let pt6 = [option.stopline_to_center[dir], -option.median[dir] * (option.median_width[dir] / 2 - option.median_shrink_flag[dir] * option.median_shrink_width[dir])];
			
			let median_path = [...pt1, ...pt2, ...pt3, ...pt4, ...pt5, ...pt6, ...pt1].map((e)=> e * option.scale);
			if(option.median[dir] === 1){
				let path = "M " + median_path[0] + " " + median_path[1] + " L " + median_path[2] + " " + median_path[3] + " L " + median_path[4] + " " + median_path[5] + " L " + median_path[6] + " " + median_path[7] + " L " + median_path[8] + " " + median_path[9] + " L " + median_path[10] + " " + median_path[11] + " L " + median_path[12] + " " + median_path[13] + " Z";
				this.paths.push([path, option.COLOR_WHITE, option.lineWidth, option.COLOR_GREEN, "translate(" + option.offsetwidth + "," + option.offsetheight + "),rotate(" + option.angle[dir] + ")"]);
				if(option.link_flag === dir){
					let link_tmp1 = [...pt2].map(e => e * option.scale);
					let link_tmp2 = [...pt3].map(e => e * option.scale);
					this.link_pts.median1 = link_tmp1;
					this.link_pts.median2 = link_tmp2;
				}

			}else {
				let point1 = [option.stopline_to_center[dir], option.median[dir] * option.median_width[dir] / 2 + option.median_line_offset[dir] * option.median_line_offset_width[dir]];
				let point2 = [option.stopline_to_center[dir] + option.channelized_length[dir], option.median[dir] * option.median_width[dir] / 2 + option.median_line_offset[dir] * option.median_line_offset_width[dir]];
				let point3 = [option.stopline_to_center[dir] + option.channelized_length[dir] + option.gradual_length[dir], option.median[dir] * option.median_width[dir] / 2];
				let point4 = [option.stopline_to_center[dir] + option.channelized_length[dir] * 2 + option.gradual_length[dir] * 2, option.median[dir] * option.median_width[dir] / 2];
				let path_data = [...point1, ...point2, ...point3, ...point4].map((e)=> e * option.scale);

				let path = "M " + path_data[0] + " " + (path_data[1] - option.doubleYellowGap) + " L " + path_data[2] + " " + (path_data[3] - option.doubleYellowGap) + " L " + path_data[4] + " " + (path_data[5] - option.doubleYellowGap) + " L " + path_data[6] + " " + (path_data[7] - option.doubleYellowGap) + " M " + path_data[0] + " " + (path_data[1] + option.doubleYellowGap) + " L " + path_data[2] + " " + (path_data[3] + option.doubleYellowGap) + " L " + path_data[4] + " " + (path_data[5] + option.doubleYellowGap) + " L " + path_data[6] + " " + (path_data[7] + option.doubleYellowGap);
				
				this.paths.push([path, option.COLOR_YELLOW, option.lineWidth, option.COLOR_YELLOW + "0", "translate(" + option.offsetwidth + "," + option.offsetheight + "),rotate(" + option.angle[dir] + ")"])
				if(dir === option.link_flag){
					let link_tmp1 = [path_data[6], path_data[7] - option.doubleYellowGap];
					let link_tmp2 = [path_data[6], path_data[7] + option.doubleYellowGap];
					this.link_pts.median1 = link_tmp1;
					this.link_pts.median2 = link_tmp2;
				}
			}
		}
	}

	// 进口主辅分隔带
	draw_import_main_sub_saparation = () => {
		let option = this.option;
		for(let dir = 0; dir < option.angle.length; dir++){
			
			let pt1 = [option.stopline_to_center[dir], -option.median[dir] * option.median_width[dir]/2 - option.entry_main_num[dir] * option.entry_main_width[dir]];
			let pt2 = [option.stopline_to_center[dir] + option.channelized_length[dir] * 2 + option.gradual_length[dir] * 2, -option.median[dir] * option.median_width[dir]/2 - option.entry_main_num[dir] * option.entry_main_width[dir]];
			let pt3 = [option.stopline_to_center[dir] + option.channelized_length[dir] * 2 + option.gradual_length[dir] * 2, -option.median[dir] * option.median_width[dir]/2 - option.entry_main_num[dir] * option.entry_main_width[dir] - option.entry_main_sub_sep[dir] * option.entry_main_sub_sep_width[dir]];
			let pt4 = [option.stopline_to_center[dir], -option.median[dir] * option.median_width[dir]/2 - option.entry_main_num[dir] * option.entry_main_width[dir] - option.entry_main_sub_sep[dir] * option.entry_main_sub_sep_width[dir]];
			
			let path_pts = [...pt1, ...pt2, ...pt3, ...pt4, ...pt1].map((e)=> e * option.scale);
			
			if(option.entry_main_sub_sep[dir] === 1){
				let path = "M " + path_pts[0] + " " + path_pts[1] + " L " + path_pts[2] + " " + path_pts[3] + " L " + path_pts[4] + " " + path_pts[5] + " L " + path_pts[6] + " " + path_pts[7] + " L " + path_pts[8] + " " + path_pts[9] + " Z";
				this.paths.push([path, option.COLOR_WHITE, option.lineWidth, option.COLOR_GREEN, "translate(" + option.offsetwidth + "," + option.offsetheight + "),rotate(" + option.angle[dir] + ")"]);
			}
		}
	}
	
	// 出口主辅分隔带
	draw_export_main_sub_saparation = () => {
		let option = this.option;
		for(let dir = 0; dir < option.angle.length; dir++){
			
			let pt1 = [option.stopline_to_center[dir], option.median[dir] * option.median_width[dir]/2 + option.exit_main_num[dir] * option.exit_main_width[dir]];
			let pt2 = [option.stopline_to_center[dir] + option.channelized_length[dir] * 2 + option.gradual_length[dir] * 2, option.median[dir] * option.median_width[dir]/2 + option.exit_main_num[dir] * option.exit_main_width[dir]];
			let pt3 = [option.stopline_to_center[dir] + option.channelized_length[dir] * 2 + option.gradual_length[dir] * 2, option.median[dir] * option.median_width[dir]/2 + option.exit_main_num[dir] * option.exit_main_width[dir] + option.exit_main_sub_sep[dir] * option.exit_main_sub_sep_width[dir]];
			let pt4 = [option.stopline_to_center[dir], option.median[dir] * option.median_width[dir]/2 + option.exit_main_num[dir] * option.exit_main_width[dir] + option.exit_main_sub_sep[dir] * option.exit_main_sub_sep_width[dir]];
			
			let path_data = [...pt1, ...pt2, ...pt3, ...pt4, ...pt1].map((e)=> e * option.scale);
			
			if(option.exit_main_sub_sep[dir] === 1){
				let path = "M " + path_data[0] + " " + path_data[1] + " L " + path_data[2] + " " + path_data[3] + " L " + path_data[4] + " " + path_data[5] + " L " + path_data[6] + " " + path_data[7] + " L " + path_data[8] + " " + path_data[9] + " Z";
				this.paths.push([path, option.COLOR_WHITE, option.lineWidth, option.COLOR_GREEN, "translate(" + option.offsetwidth + "," + option.offsetheight + "),rotate(" + option.angle[dir] + ")"]);
			}
		}
	}

	// 进口机非分隔带
	draw_import_car_bike_saparation = () => {
		let option = this.option;
		for(let dir = 0; dir < option.angle.length; dir++){
			
			let pt1 = [option.stopline_to_center[dir], -option.median[dir] * option.median_width[dir]/2 - option.entry_main_num[dir] * option.entry_main_width[dir] - option.entry_main_sub_sep[dir] * (option.entry_sub_num[dir]*option.entry_sub_width[dir]+option.entry_main_sub_sep_width[dir])];
			let pt2 = [option.stopline_to_center[dir] + option.channelized_length[dir] * 2 + option.gradual_length[dir] * 2, -option.median[dir] * option.median_width[dir]/2 - option.entry_main_num[dir] * option.entry_main_width[dir] - option.entry_main_sub_sep[dir] * (option.entry_sub_num[dir]*option.entry_sub_width[dir]+option.entry_main_sub_sep_width[dir])];
			let pt3 = [option.stopline_to_center[dir] + option.channelized_length[dir] * 2 + option.gradual_length[dir] * 2, -option.median[dir] * option.median_width[dir]/2 - option.entry_main_num[dir] * option.entry_main_width[dir] - option.entry_main_sub_sep[dir] * (option.entry_sub_num[dir]*option.entry_sub_width[dir]+option.entry_main_sub_sep_width[dir]) - option.entry_car_bike_sep[dir]*option.entry_car_bike_sep_width[dir]];
			let pt4 = [option.stopline_to_center[dir], -option.median[dir] * option.median_width[dir]/2 - option.entry_main_num[dir] * option.entry_main_width[dir] - option.entry_main_sub_sep[dir] * (option.entry_sub_num[dir]*option.entry_sub_width[dir]+option.entry_main_sub_sep_width[dir]) - option.entry_car_bike_sep[dir]*option.entry_car_bike_sep_width[dir]];
			
			let path_data = [...pt1, ...pt2, ...pt3, ...pt4, ...pt1].map((e)=> e * option.scale);

			if(option.entry_car_bike_sep[dir] === 1){
				let path = "M " + path_data[0] + " " + path_data[1] + " L " + path_data[2] + " " + path_data[3] + " L " + path_data[4] + " " + path_data[5] + " L " + path_data[6] + " " + path_data[7] + " L " + path_data[8] + " " + path_data[9] + " Z";
				this.paths.push([path, option.COLOR_WHITE, option.lineWidth, option.COLOR_GREEN, "translate(" + option.offsetwidth + "," + option.offsetheight + "),rotate(" + option.angle[dir] + ")"])
			}
		}
	}

	// 出口机非分隔带
	draw_export_car_bike_saparation = () => {
		let option = this.option;
		for(let dir = 0; dir < option.angle.length; dir++){
			let pt1 = [option.stopline_to_center[dir], option.median[dir] * option.median_width[dir]/2 + option.exit_main_num[dir] * option.exit_main_width[dir] + option.exit_main_sub_sep[dir] * (option.exit_sub_num[dir]*option.exit_sub_width[dir]+option.exit_main_sub_sep_width[dir])];
			let pt2 = [option.stopline_to_center[dir] + option.channelized_length[dir] * 2 + option.gradual_length[dir] * 2, option.median[dir] * option.median_width[dir]/2 + option.exit_main_num[dir] * option.exit_main_width[dir] + option.exit_main_sub_sep[dir] * (option.exit_sub_num[dir]*option.exit_sub_width[dir]+option.exit_main_sub_sep_width[dir])];
			let pt3 = [option.stopline_to_center[dir] + option.channelized_length[dir] * 2 + option.gradual_length[dir] * 2, option.median[dir] * option.median_width[dir]/2 + option.exit_main_num[dir] * option.exit_main_width[dir] + option.exit_main_sub_sep[dir] * (option.exit_sub_num[dir]*option.exit_sub_width[dir]+option.exit_main_sub_sep_width[dir]) + option.exit_car_bike_sep[dir]*option.exit_car_bike_sep_width[dir]];
			let pt4 = [option.stopline_to_center[dir], option.median[dir] * option.median_width[dir]/2 + option.exit_main_num[dir] * option.exit_main_width[dir] + option.exit_main_sub_sep[dir] * (option.exit_sub_num[dir]*option.exit_sub_width[dir]+option.exit_main_sub_sep_width[dir]) + option.exit_car_bike_sep[dir]*option.exit_car_bike_sep_width[dir]];
			let path_data = [...pt1, ...pt2, ...pt3, ...pt4, ...pt1].map((e)=> e * option.scale);

			if(option.exit_car_bike_sep[dir] === 1){
				let path = "M " + path_data[0] + " " + path_data[1] + " L " + path_data[2] + " " + path_data[3] + " L " + path_data[4] + " " + path_data[5] + " L " + path_data[6] + " " + path_data[7] + " L " + path_data[8] + " " + path_data[9] + " Z";
				this.paths.push([path, option.COLOR_WHITE, option.lineWidth, option.COLOR_GREEN, "translate(" + option.offsetwidth + "," + option.offsetheight + "),rotate(" + option.angle[dir] + ")"]);
			}
		}
	}

	// 绘制停车线
	draw_cross_stopline = () => {
		let option = this.option;
		// 停车线 
		for(let dir = 0; dir < option.angle.length; dir++){
			let pt1 = [option.stopline_to_center[dir], -option.median[dir] * option.median_width[dir]/2 - option.entry_road_total_width[dir] - (1-option.safe_island[dir])*option.entry_expand[dir] * option.entry_expand_width[dir]];
			let pt2 = [option.stopline_to_center[dir], -option.median[dir] * (option.median_width[dir]/2 - option.median_shrink_flag[dir] * option.median_shrink_width[dir]) + + option.median_line_offset[dir] * option.median_line_offset_width[dir]];
			let path_data = [...pt1, ...pt2].map((e)=> e * option.scale);
			this.lines.push([...path_data, option.COLOR_WHITE, option.lineWidth*2, option.dashArraySolid, option.dashOffsetNone, "translate(" + option.offsetwidth + "," + option.offsetheight + "),rotate(" + option.angle[dir] + ")"]);
		}
	}

	// 进口主道实线
	draw_cross_import_solid_line = () => {
		let option = this.option;
		// 进口主道渠化区车道线 
		for(let dir = 0; dir < option.angle.length; dir++){
			
			for(let lane_index = 1; lane_index < option.entry_main_num[dir]+option.entry_expand_num[dir]+1*option.entry_expand[dir]; lane_index++){

				let pt1 = [option.stopline_to_center[dir], 
				-option.median[dir] * (option.median_width[dir] / 2 - option.median_shrink_flag[dir] * option.median_shrink_width[dir]) + option.median_line_offset[dir] * option.median_line_offset_width[dir] - (option.median[dir] * option.median_shrink_flag[dir] * option.median_shrink_width[dir] + option.median_line_offset[dir] * option.median_line_offset_width[dir] + option.entry_main_num[dir] * option.entry_main_width[dir] + option.entry_expand[dir] * option.entry_expand_width[dir]) / (option.entry_main_num[dir] + option.entry_expand_num[dir]) * (lane_index)];
				let pt2 = [option.stopline_to_center[dir] + option.channelized_length[dir],
				-option.median[dir] * (option.median_width[dir] / 2 - option.median_shrink_flag[dir] * option.median_shrink_width[dir]) + option.median_line_offset[dir] * option.median_line_offset_width[dir] - (option.median[dir] * option.median_shrink_flag[dir] * option.median_shrink_width[dir] + option.median_line_offset[dir] * option.median_line_offset_width[dir] + option.entry_main_num[dir] * option.entry_main_width[dir] + option.entry_expand[dir] * option.entry_expand_width[dir]) / (option.entry_main_num[dir] + option.entry_expand_num[dir]) * (lane_index)];
				
				let path_data = [...pt1, ...pt2].map((e)=> e * option.scale);
				this.lines.push([...path_data, option.COLOR_WHITE, option.lineWidth, option.dashArraySolid, option.dashOffsetNone, "translate(" + option.offsetwidth + "," + option.offsetheight + "),rotate(" + option.angle[dir] + ")"]);
			}
		}
	}

	// 进口主道渠化区渐变段车道线
	draw_cross_import_channelized = () => {
		let option = this.option;
		for(let dir = 0; dir < option.angle.length; dir++){
			
			for(let lane_index = 1; lane_index < option.entry_main_num[dir]+option.entry_expand_num[dir]; lane_index++){
			
				let pt1 = [option.stopline_to_center[dir] + option.channelized_length[dir], 
				-option.median[dir]*(option.median_width[dir]/2-option.median_shrink_flag[dir]*option.median_shrink_width[dir])+option.median_line_offset[dir]*option.median_line_offset_width[dir]-(option.median[dir]*option.median_shrink_flag[dir]*option.median_shrink_width[dir]+option.median_line_offset[dir]*option.median_line_offset_width[dir]+option.entry_main_num[dir]*option.entry_main_width[dir] + option.entry_expand[dir] * option.entry_expand_width[dir])/(option.entry_main_num[dir]+option.entry_expand_num[dir])*(lane_index)];
				let pt2 = [option.stopline_to_center[dir] + option.channelized_length[dir] + option.gradual_length[dir]*0.66, 
				-option.median[dir]*(option.median_width[dir]/2-option.median_shrink_flag[dir]*option.median_shrink_width[dir])+option.median_line_offset[dir]*option.median_line_offset_width[dir]-(option.median[dir]*option.median_shrink_flag[dir]*option.median_shrink_width[dir]+option.median_line_offset[dir]*option.median_line_offset_width[dir]+option.entry_main_num[dir]*option.entry_main_width[dir] + option.entry_expand[dir] * option.entry_expand_width[dir])/(option.entry_main_num[dir]+option.entry_expand_num[dir])*(lane_index)];
				
				let path_data = [...pt1, ...pt2].map((e)=> e * option.scale);
				this.lines.push([...path_data, option.COLOR_WHITE, option.lineWidth, option.dashArray, option.dashOffset, "translate(" + option.offsetwidth + "," + option.offsetheight + "),rotate(" + option.angle[dir] + ")"])
			}
		}
	}

	// 进口主道路段车道线
	draw_cross_import_main_line = () => {
		let option = this.option;
		for(let dir = 0; dir < option.angle.length; dir++){
			for(let lane_index = 1; lane_index < option.entry_main_num[dir]; lane_index++){
				let pt1 = [option.stopline_to_center[dir] + option.channelized_length[dir] + option.gradual_length[dir], -option.median[dir]*option.median_width[dir]/2-option.entry_main_width[dir]*lane_index];
				let pt2 = [option.stopline_to_center[dir] + option.channelized_length[dir]*2 + option.gradual_length[dir]*2, -option.median[dir]*option.median_width[dir]/2-option.entry_main_width[dir]*lane_index];
				
				let path_data = [...pt1, ...pt2].map((e)=> e * option.scale);
				this.lines.push([...path_data, option.COLOR_WHITE, option.lineWidth, option.dashArray, option.dashOffsetNone, "translate(" + option.offsetwidth + "," + option.offsetheight + "),rotate(" + option.angle[dir] + ")"])
			
				if(dir === option.link_flag){
					this.link_pts.entry_lane.push([path_data[2], path_data[3]]);
				}
			
			}
		}
	}

	// 进口辅道路段车道线
	draw_cross_import_sub_line = () => {
		let option = this.option;
		for(let dir = 0; dir < option.angle.length; dir++){
			for(let lane_index = 1; lane_index < option.entry_sub[dir]*option.entry_sub_num[dir]; lane_index++){
				let pt1 = [option.stopline_to_center[dir], -option.median[dir]*option.median_width[dir]/2-option.entry_main_num[dir]*option.entry_main_width[dir]-option.entry_main_sub_sep[dir]*option.entry_main_sub_sep_width[dir]-option.entry_sub_width[dir]*lane_index];
				let pt2 = [option.stopline_to_center[dir] + option.channelized_length[dir]*2 + option.gradual_length[dir]*2, -option.median[dir]*option.median_width[dir]/2-option.entry_main_num[dir]*option.entry_main_width[dir]-option.entry_main_sub_sep[dir]*option.entry_main_sub_sep_width[dir]-option.entry_sub_width[dir]*lane_index];
				let path_data = [...pt1, ...pt2].map((e)=> e * option.scale);
				this.lines.push([...path_data, option.COLOR_WHITE, option.dashArray, option.dashOffsetNone, "translate(" + option.offsetwidth + "," + option.offsetheight + "),rotate(" + option.angle[dir] + ")"])
			}
		}
	}

	// 出口主道车道线
	draw_cross_export_main_line = () => {
		let option = this.option;
		for(let dir = 0; dir < option.angle.length; dir++){
			for(let lane_index = 1; lane_index < option.exit_main_num[dir]; lane_index++){
				let pt1 = [option.stopline_to_center[dir], option.median[dir]*option.median_width[dir]/2+ option.median_line_offset[dir] * option.median_line_offset_width[dir]+(option.exit_main_num[dir] * option.exit_main_width[dir] - option.median_line_offset[dir] * option.median_line_offset_width[dir])*lane_index/option.exit_main_num[dir]];
				let pt2 = [option.stopline_to_center[dir] + option.channelized_length[dir], option.median[dir]*option.median_width[dir]/2+option.median_line_offset[dir] * option.median_line_offset_width[dir]+(option.exit_main_num[dir] * option.exit_main_width[dir] - option.median_line_offset[dir] * option.median_line_offset_width[dir])*lane_index/option.exit_main_num[dir]];
				let pt3 = [option.stopline_to_center[dir] + option.channelized_length[dir] + option.gradual_length[dir], option.median[dir]*option.median_width[dir]/2 + option.exit_main_width[dir]*lane_index];
				let pt4 = [option.stopline_to_center[dir] + option.channelized_length[dir]*2 + option.gradual_length[dir]*2, option.median[dir]*option.median_width[dir]/2 + option.exit_main_width[dir]*lane_index];

				let path_data = [...pt1, ...pt2].map((e)=> e * option.scale);
				this.lines.push([...path_data, option.COLOR_WHITE, option.lineWidth, option.dashArray, option.dashOffsetNone, "translate(" + option.offsetwidth + "," + option.offsetheight + "),rotate(" + option.angle[dir] + ")"]);
				let path_data2 = [...pt2, ...pt3].map((e)=> e * option.scale);
				this.lines.push([...path_data2, option.COLOR_WHITE, option.lineWidth, option.dashArray, option.dashOffsetNone, "translate(" + option.offsetwidth + "," + option.offsetheight + "),rotate(" + option.angle[dir] + ")"]);
				let path_data3 = [...pt3, ...pt4].map((e)=> e * option.scale);
				this.lines.push([...path_data3, option.COLOR_WHITE, option.lineWidth, option.dashArray, option.dashOffsetNone, "translate(" + option.offsetwidth + "," + option.offsetheight + "),rotate(" + option.angle[dir] + ")"]);
			
				if(dir === option.link_flag){
					this.link_pts.exit_lane.push([path_data3[2], path_data3[3]]);
				}
			}
		}
	}

	// 出口辅道路段车道线
	draw_cross_export_sub_line = () => {
		let option = this.option;
		for(let dir = 0; dir < option.angle.length; dir++){
			for(let lane_index = 1; lane_index < option.exit_sub[dir]*option.exit_sub_num[dir]; lane_index++){
				let pt1 = [option.stopline_to_center[dir], option.median[dir]*option.median_width[dir]/2+option.exit_main_num[dir]*option.exit_main_width[dir]+option.exit_main_sub_sep[dir]*option.exit_main_sub_sep_width[dir]+option.exit_sub_width[dir]*lane_index];
				let pt2 = [option.stopline_to_center[dir] + option.channelized_length[dir]*2 + option.gradual_length[dir]*2, option.median[dir]*option.median_width[dir]/2+option.exit_main_num[dir]*option.exit_main_width[dir]+option.exit_main_sub_sep[dir]*option.exit_main_sub_sep_width[dir]+option.exit_sub_width[dir]*lane_index];
				let path_data = [...pt1, ...pt2].map((e)=> e * option.scale);
				this.lines.push([...path_data, option.COLOR_WHITE, option.lineWidth, option.dashArray, option.dashOffsetNone, "translate(" + option.offsetwidth + "," + option.offsetheight + "),rotate(" + option.angle[dir] + ")"]);
			}
		}
	}

	// 进口边缘线
	draw_cross_import_edge_line = () => {
		let option = this.option;
		for(let dir = 0; dir < option.angle.length; dir++){
			let pt1 = [option.stopline_to_center[dir] - option.sidewalk_width[dir] * option.sidewalk_flag[dir] + option.right_ahead[dir] * (option.ahead_right_dist[dir] + option.ahead_right_lane_width[dir]), -option.median[dir]*option.median_width[dir]/2-option.entry_road_total_width[dir]-option.entry_expand[dir]*option.entry_expand_width[dir]];
			let pt2 = [option.stopline_to_center[dir] + option.channelized_length[dir], -option.median[dir]*option.median_width[dir]/2-option.entry_road_total_width[dir]-option.entry_expand[dir]*option.entry_expand_width[dir]];
			let pt3 = [option.stopline_to_center[dir] + option.channelized_length[dir] + option.gradual_length[dir], -option.median[dir]*option.median_width[dir]/2-option.entry_road_total_width[dir]];
			let pt4 = [option.stopline_to_center[dir] + option.channelized_length[dir]*2 + option.gradual_length[dir]*2, -option.median[dir]*option.median_width[dir]/2-option.entry_road_total_width[dir]];
			let path_data = [...pt1, ...pt2, ...pt3, ...pt4].map((e)=> e * option.scale);
			let path = "M " + path_data[0] + " " + path_data[1] + " L " + path_data[2] + " " + path_data[3] + " L " + path_data[4] + " " + path_data[5] + " L " + path_data[6] + " " + path_data[7];
			this.paths.push([path, option.COLOR_BLACK, option.lineWidth*2, option.COLOR_BLACK + "0", "translate(" + option.offsetwidth + "," + option.offsetheight + "),rotate(" + option.angle[dir] + ")"]);
		
			if(dir === option.link_flag){
				this.link_pts.entry_edge = [path_data[6], path_data[7]];
			}

		}
	}

	// 出口边缘线
	draw_cross_export_edge_line = () => {
		let option = this.option;
		// 出口边缘线
		for(let dir = 0; dir < option.angle.length; dir++){

			let pt1 = [option.stopline_to_center[dir] - option.sidewalk_width[dir] * option.sidewalk_flag[dir] + option.right_ahead[option.nextDir[dir]] * (option.ahead_right_dist[option.nextDir[dir]] + option.ahead_right_lane_width[option.nextDir[dir]]), option.median[dir]*option.median_width[dir]/2 + option.exit_road_total_width[dir]];
			let pt2 = [option.stopline_to_center[dir] + option.channelized_length[dir]*2 + option.gradual_length[dir]*2, option.median[dir]*option.median_width[dir]/2+option.exit_road_total_width[dir]];
			
			let path_data = [...pt1, ...pt2].map((e)=> e * option.scale);
			let path = "M " + path_data[0] + " " + path_data[1] + " L " + path_data[2] + " " + path_data[3];
			this.paths.push([path, option.COLOR_BLACK, option.lineWidth*2, option.COLOR_BLACK, "translate(" + option.offsetwidth + "," + option.offsetheight + "),rotate(" + option.angle[dir] + ")"])
			
			if(dir === option.link_flag){
				this.link_pts.exit_edge = [path_data[2], path_data[3]];
			}

		}
	}

	// 转弯曲线
	draw_cross_import_curve = () => {
		let option = this.option;
		for(let dir = 0; dir < option.angle.length; dir++){
			let pt1 = [option.stopline_to_center[dir] - option.sidewalk_width[dir] * option.sidewalk_flag[dir] + option.right_ahead[dir] * (option.ahead_right_dist[dir] + option.ahead_right_lane_width[dir]), -option.median[dir]*option.median_width[dir]/2-option.entry_road_total_width[dir]-option.entry_expand[dir]*option.entry_expand_width[dir]];
			let pt2 = [(option.median[option.lastDir[dir]]*option.median_width[option.lastDir[dir]]/2 + option.exit_road_total_width[option.lastDir[dir]]), -option.stopline_to_center[option.lastDir[dir]] - option.right_ahead[dir] * (option.ahead_right_dist[dir] + option.ahead_right_lane_width[dir]) + option.sidewalk_width[option.lastDir[dir]] * option.sidewalk_flag[option.lastDir[dir]]];
			
			if(dir === 0){
				let d = Math.sqrt(pt1[0]*pt1[0]+pt1[1]*pt1[1])
				let theta1 = Math.atan(pt1[1]/pt1[0])/Math.PI*180;
				let theta2 = Math.abs(dir*90+theta1+option.angle[dir]);
				let d2 = Math.sqrt(pt2[0]*pt2[0]+pt2[1]*pt2[1])
				let theta3 = Math.atan(pt2[1]/pt2[0])/Math.PI*180;
				let theta4 = Math.abs(theta3)-(option.angle[option.lastDir[dir]]-option.lastDir[dir]*90);
				pt1[1] = -Math.abs(d*Math.sin(theta2*Math.PI/180));
				pt1[0] = Math.abs(d*Math.cos(theta2*Math.PI/180));
				pt2[0] = d2*Math.cos(theta4*Math.PI/180);
				pt2[1] = -d2*Math.sin(theta4*Math.PI/180);
				let pt3 = [Math.min(Math.abs(pt1[0]),Math.abs(pt2[0])) + Math.abs(pt1[0]-pt2[0])/4 , -Math.min(Math.abs(pt1[1]),Math.abs(pt2[1])) - Math.abs(pt1[1]-pt2[1])/4 ];
				
				let path_data = [...pt1, ...pt3, ...pt2].map((e)=> e * option.scale);
				let path = "M " + path_data[0] + " " + path_data[1] + " Q " + path_data[2] + " " + path_data[3] + " " + path_data[4] + " " + path_data[5];
				this.paths.push([path, option.COLOR_BLACK, option.lineWidth*2, "#7770", "translate(" + option.offsetwidth + "," + option.offsetheight + "),rotate(" + 0 + ")"])
			
			}if(dir===1){
				let d = Math.sqrt(pt1[0]*pt1[0]+pt1[1]*pt1[1])
				let theta1 = Math.atan(pt1[1]/pt1[0])/Math.PI*180;
				let theta2 = Math.abs(theta1+option.angle[dir]-dir*90);
				let d2 = Math.sqrt(pt2[0]*pt2[0]+pt2[1]*pt2[1])
				let theta3 = Math.atan(pt2[1]/pt2[0])/Math.PI*180;
				let theta4 = Math.abs(theta3)-(option.angle[option.lastDir[dir]]-option.lastDir[dir]*90);
				pt1[1] = Math.abs(d*Math.cos(theta2*Math.PI/180));
				pt1[0] = Math.abs(d*Math.sin(theta2*Math.PI/180));
				pt2[0] = d2*Math.sin(theta4*Math.PI/180)
				pt2[1] = d2*Math.cos(theta4*Math.PI/180)
				let pt3 = [Math.min(Math.abs(pt1[0]),Math.abs(pt2[0])) + Math.abs(pt1[0]-pt2[0])/4 , Math.min(Math.abs(pt1[1]),Math.abs(pt2[1])) + Math.abs(pt1[1]-pt2[1])/4 ];
				
				let path_data = [...pt1, ...pt3, ...pt2].map((e)=> e * option.scale);
				let path = "M " + path_data[0] + " " + path_data[1] + " Q " + path_data[2] + " " + path_data[3] + " " + path_data[4] + " " + path_data[5];
				this.paths.push([path, option.COLOR_BLACK, option.lineWidth*2, "#7770", "translate(" + option.offsetwidth + "," + option.offsetheight + "),rotate(" + 0 + ")"])
			
			}else if(dir===2){
				let d = Math.sqrt(pt1[0]*pt1[0]+pt1[1]*pt1[1])
				let theta1 = Math.atan(pt1[1]/pt1[0])/Math.PI*180;
				let theta2 = Math.abs(dir*90+theta1+option.angle[dir]);
				let d2 = Math.sqrt(pt2[0]*pt2[0]+pt2[1]*pt2[1])
				let theta3 = Math.atan(pt2[1]/pt2[0])/Math.PI*180;
				let theta4 = Math.abs(theta3)-(option.angle[option.lastDir[dir]]-option.lastDir[dir]*90);
				
				pt1[1] = Math.abs(d*Math.sin(theta2*Math.PI/180));
				pt1[0] = -Math.abs(d*Math.cos(theta2*Math.PI/180));
				pt2[0] = -d2*Math.cos(theta4*Math.PI/180)
				pt2[1] = d2*Math.sin(theta4*Math.PI/180)
				let pt3 = [-Math.min(Math.abs(pt1[0]),Math.abs(pt2[0])) - Math.abs(pt1[0]-pt2[0])/4 , Math.min(Math.abs(pt1[1]),Math.abs(pt2[1])) + Math.abs(pt1[1]-pt2[1])/4 ];
				
				let path_data = [...pt1, ...pt3, ...pt2].map((e)=> e * option.scale);
				let path = "M " + path_data[0] + " " + path_data[1] + " Q " + path_data[2] + " " + path_data[3] + " " + path_data[4] + " " + path_data[5];
				this.paths.push([path, option.COLOR_BLACK, option.lineWidth*2, "#7770", "translate(" + option.offsetwidth + "," + option.offsetheight + "),rotate(" + 0 + ")"])
			
			}else if(dir === 3){
			
				let d = Math.sqrt(pt1[0]*pt1[0]+pt1[1]*pt1[1]);
				let theta1 = Math.atan(pt1[1]/pt1[0])/Math.PI*180;
				let theta2 = Math.abs(theta1+option.angle[dir]+dir*90);
				let d2 = Math.sqrt(pt2[0]*pt2[0]+pt2[1]*pt2[1]);
				let theta3 = Math.atan(pt2[1]/pt2[0])/Math.PI*180;
				let theta4 = Math.abs(theta3)-(option.angle[option.lastDir[dir]]-option.lastDir[dir]*90);
				
				pt1[0] = -Math.abs(d*Math.sin(theta2*Math.PI/180));
				pt1[1] = -Math.abs(d*Math.cos(theta2*Math.PI/180));
				pt2[0] = -d2*Math.sin(theta4*Math.PI/180);
				pt2[1] = -d2*Math.cos(theta4*Math.PI/180);
				let pt3 = [-Math.min(Math.abs(pt1[0]),Math.abs(pt2[0])) - Math.abs(pt1[0]-pt2[0])/4 , -Math.min(Math.abs(pt1[1]),Math.abs(pt2[1])) - Math.abs(pt1[1]-pt2[1])/4 ];
				
				let path_data = [...pt1, ...pt3, ...pt2].map((e)=> e * option.scale);
				let path = "M " + path_data[0] + " " + path_data[1] + " Q " + path_data[2] + " " + path_data[3] + " " + path_data[4] + " " + path_data[5];
				this.paths.push([path, option.COLOR_BLACK, option.lineWidth*2, "#7770", "translate(" + option.offsetwidth + "," + option.offsetheight + "),rotate(" + 0 + ")"])
			}
		}
	}
	
	// 安全岛
	draw_cross_import_safe_island = () => {
		let option = this.option;
		// 安全岛
		for(let dir = 0; dir < option.angle.length; dir++){
			
			if(dir === 0 && Math.abs(option.angle[dir]-dir*90)>10){
				let pt1 = [option.median[option.lastDir[dir]]*option.median_width[option.lastDir[dir]]/2+option.exit_road_total_width[option.lastDir[dir]]+option.median_line_offset[dir]*option.median_line_offset_width[dir], option.median[dir]*(option.median_width[dir]/2)+ option.entry_total_width[dir]];
				let d1 = Math.sqrt(pt1[0]*pt1[0]+pt1[1]*pt1[1]);
				let theta1 = Math.atan(pt1[1]/pt1[0])/Math.PI*180;
				let theta2 = Math.abs(theta1)-(option.angle[option.lastDir[dir]]-option.lastDir[dir]*90);
				pt1[0] = d1*Math.cos(theta2*Math.PI/180);
				pt1[1] = -d1*Math.sin(theta2*Math.PI/180);
				
				let pt2 = [option.median[option.lastDir[dir]]*option.median_width[option.lastDir[dir]]/2+option.exit_road_total_width[option.lastDir[dir]]+option.median_line_offset[dir]*option.median_line_offset_width[dir], option.median[dir]*(option.median_width[dir]/2)+ option.entry_total_width[dir]];
				let d2 = Math.sqrt(pt2[0]*pt2[0]+pt2[1]*pt2[1]);
				let theta3 = Math.atan(pt2[1]/pt2[0])/Math.PI*180;
				let theta4 = Math.abs(theta3)-(option.angle[option.lastDir[dir]]-option.lastDir[dir]*90);
				pt2[0] = d2*Math.cos(theta4*Math.PI/180);
				pt2[1] = -d2*Math.sin(theta4*Math.PI/180);
				
				let pt3 = [option.median[option.lastDir[dir]]*option.median_width[option.lastDir[dir]]/2+option.exit_road_total_width[option.lastDir[dir]], option.median[dir]*(option.median_width[dir]/2)+ option.entry_total_width[dir]];
				let dd3 = Math.sqrt(pt3[0]*pt3[0]+pt3[1]*pt3[1]);
				theta1 = Math.atan(pt3[1]/pt3[0])/Math.PI*180;
				theta2 = Math.abs(theta1)-(option.angle[dir]-dir*90);
				pt3[0] = dd3*Math.cos(theta2*Math.PI/180);
				pt3[1] = -dd3*Math.sin(theta2*Math.PI/180);

				let pt4 = [option.median[option.lastDir[dir]]*option.median_width[option.lastDir[dir]]/2+option.exit_road_total_width[dir]+option.safe_island[dir]*option.safe_island_width[dir], option.median[dir]*(option.median_width[dir]/2)+ option.entry_total_width[dir] ];
				let d4 = Math.sqrt(pt4[0]*pt4[0]+pt4[1]*pt4[1]);
				theta3 = Math.atan(pt4[1]/pt4[0])/Math.PI*180;
				theta4 = Math.abs(theta3)-(option.angle[dir]-dir*90);
				pt4[0] = d4*Math.cos(theta4*Math.PI/180);
				pt4[1] = -d4*Math.sin(theta4*Math.PI/180);

				let k1 = (pt2[1]-pt1[1])/(pt2[0]-pt1[0]);
				let b1 = pt1[1] - k1 * pt1[0];
				let k2 = (pt4[1]-pt3[1])/(pt4[0]-pt3[0]);
				let b2 = pt4[1] - k2 * pt4[0];
				let x1 = (b2-b1)/(k1-k2);
				let y1 = k1*x1+b1;
				let pt5 = [x1, y1];
				
				let x2 = -Math.sqrt(option.safe_island_width[dir]*option.safe_island_width[dir]/(1+k1*k1)) + pt5[0];
				let y2 = k1 * x2 + b1;
				let pt6 = [x2, y2];
				
				let x3 = Math.sqrt(option.safe_island_width[dir]*option.safe_island_width[dir]/(1+k2*k2)) + pt5[0];
				let y3 = k2 * x3 + b2;
				let pt7 = [x3, y3];
				
				let pt8 = [Math.min(Math.abs(pt6[0]), Math.abs(pt7[0])) + Math.abs(pt6[0]-pt7[0])/5, -Math.min(Math.abs(pt6[1]), Math.abs(pt7[1])) - Math.abs(pt6[1]-pt7[1])/5]
			
				let path_data = [[...pt5, ...pt6, ...pt8, ...pt7].map((e)=>e*option.scale)];
				
				if(option.safe_island[dir] === 1){
					let path = "M " + path_data[0] + " " + path_data[1] + " L " + path_data[2] + " " + path_data[3] + " Q" + path_data[4] + " " + path_data[5] + " " + path_data[6] + " " + path_data[7] + " Z";
					this.paths.push([path, option.COLOR_WHITE, option.lineWidth, option.COLOR_GREEN, "translate(" + option.offsetwidth + "," + option.offsetheight + "),rotate(" + 0 + ")"])
				}
			
			}else if(dir===1 && Math.abs(option.angle[dir]-dir*90)>10){
				
				let pt1 = [option.median[option.lastDir[dir]]*option.median_width[option.lastDir[dir]]/2+option.exit_road_total_width[option.lastDir[dir]], option.median[dir]*(option.median_width[dir]/2)+ option.entry_total_width[dir]];
				let d1 = Math.sqrt(pt1[0]*pt1[0]+pt1[1]*pt1[1]);
				let theta1 = Math.atan(pt1[1]/pt1[0])/Math.PI*180;
				let theta2 = Math.abs(theta1)-(option.angle[option.lastDir[dir]]-option.lastDir[dir]*90);
				pt1[0] = d1*Math.cos(theta2*Math.PI/180);
				pt1[1] = d1*Math.sin(theta2*Math.PI/180);
				
				let pt2 = [option.median[option.lastDir[dir]]*option.median_width[option.lastDir[dir]]/2+option.exit_road_total_width[option.lastDir[dir]], option.median[dir]*(option.median_width[dir]/2)+ option.entry_total_width[dir] + option.safe_island_width[dir]];
				let d2 = Math.sqrt(pt2[0]*pt2[0]+pt2[1]*pt2[1]);
				let theta3 = Math.atan(pt2[1]/pt2[0])/Math.PI*180;
				let theta4 = Math.abs(theta3)-(option.angle[option.lastDir[dir]]-option.lastDir[dir]*90);
				pt2[0] = d2*Math.cos(theta4*Math.PI/180);
				pt2[1] = d2*Math.sin(theta4*Math.PI/180);

				let pt3 = [option.median[option.lastDir[dir]]*option.median_width[option.lastDir[dir]]/2+option.exit_road_total_width[option.lastDir[dir]], option.median[dir]*(option.median_width[dir]/2)+ option.entry_total_width[dir]];
				let dd3 = Math.sqrt(pt3[0]*pt3[0]+pt3[1]*pt3[1]);
				theta1 = Math.atan(pt3[1]/pt3[0])/Math.PI*180;
				theta2 = Math.abs(theta1)-(option.angle[dir]-dir*90);
				pt3[0] = dd3*Math.cos(theta2*Math.PI/180);
				pt3[1] = dd3*Math.sin(theta2*Math.PI/180);

				let pt4 = [option.median[option.lastDir[dir]]*option.median_width[option.lastDir[dir]]/2+option.exit_road_total_width[dir]+option.safe_island[dir]*option.safe_island_width[dir], option.median[dir]*(option.median_width[dir]/2)+ option.entry_total_width[dir]];
				let d4 = Math.sqrt(pt4[0]*pt4[0]+pt4[1]*pt4[1]);
				theta3 = Math.atan(pt4[1]/pt4[0])/Math.PI*180;
				theta4 = Math.abs(theta3)-(option.angle[dir]-dir*90);
				pt4[0] = d4*Math.cos(theta4*Math.PI/180);
				pt4[1] = d4*Math.sin(theta4*Math.PI/180);

				let k1 = (pt2[1]-pt1[1])/(pt2[0]-pt1[0]);
				let b1 = pt1[1] - k1 * pt1[0];
				let k2 = (pt4[1]-pt3[1])/(pt4[0]-pt3[0]);
				let b2 = pt4[1] - k2 * pt4[0];
				let x1 = (b2-b1)/(k1-k2);
				let y1 = k1*x1+b1;
				let pt5 = [x1, y1];
				
				let x2 = Math.sqrt(option.safe_island_width[dir]*option.safe_island_width[dir]/(1+k1*k1)) + pt5[0];
				let y2 = k1 * x2 + b1;
				let pt6 = [x2, y2];
				
				let x3 = Math.sqrt(option.safe_island_width[dir]*option.safe_island_width[dir]/(1+k2*k2)) + pt5[0];
				let y3 = k2 * x3 + b2;
				let pt7 = [x3, y3];
				
				let pt8 = [Math.min(Math.abs(pt6[0]), Math.abs(pt7[0])) + Math.abs(pt6[0]-pt7[0])/5, Math.min(Math.abs(pt6[1]), Math.abs(pt7[1])) + Math.abs(pt6[1]-pt7[1])/5]

				let path_data = [...pt5, ...pt6, ...pt8, ...pt7].map((e)=>e*option.scale);
				
				if(option.safe_island[dir] === 1){
					let path = "M " + path_data[0] + " " + path_data[1] + " L " + path_data[2] + " " + path_data[3] + " Q" + path_data[4] + " " + path_data[5] + " " + path_data[6] + " " + path_data[7] + " Z";
					this.paths.push([path, option.COLOR_WHITE, option.lineWidth, option.COLOR_GREEN, "translate(" + option.offsetwidth + "," + option.offsetheight + "),rotate(" + 0 + ")"])
				}
				
			}else if(dir===2 && Math.abs(option.angle[dir]-dir*90)>10){
			
				let pt1 = [option.median[option.lastDir[dir]]*option.median_width[option.lastDir[dir]]/2+option.exit_road_total_width[option.lastDir[dir]], option.median[dir]*(option.median_width[dir]/2)+ option.entry_total_width[dir]];
				let d1 = Math.sqrt(pt1[0]*pt1[0]+pt1[1]*pt1[1]);
				let theta1 = Math.atan(pt1[1]/pt1[0])/Math.PI*180;
				let theta2 = Math.abs(theta1)-(option.angle[option.lastDir[dir]]-option.lastDir[dir]*90);
				pt1[0] = -d1*Math.cos(theta2*Math.PI/180);
				pt1[1] = d1*Math.sin(theta2*Math.PI/180);
				
				let pt2 = [option.median[option.lastDir[dir]]*option.median_width[option.lastDir[dir]]/2+option.exit_road_total_width[option.lastDir[dir]], option.median[dir]*(option.median_width[dir]/2)+ option.entry_total_width[dir]+option.safe_island_width[dir]];
				let d2 = Math.sqrt(pt2[0]*pt2[0]+pt2[1]*pt2[1]);
				let theta3 = Math.atan(pt2[1]/pt2[0])/Math.PI*180;
				let theta4 = Math.abs(theta3)-(option.angle[option.lastDir[dir]]-option.lastDir[dir]*90);
				pt2[0] = -d2*Math.cos(theta4*Math.PI/180);
				pt2[1] = d2*Math.sin(theta4*Math.PI/180);
				
				let pt3 = [option.median[option.lastDir[dir]]*option.median_width[option.lastDir[dir]]/2+option.exit_road_total_width[option.lastDir[dir]], option.median[dir]*(option.median_width[dir]/2)+ option.entry_total_width[dir]];
				let dd3 = Math.sqrt(pt3[0]*pt3[0]+pt3[1]*pt3[1]);
				theta1 = Math.atan(pt3[1]/pt3[0])/Math.PI*180;
				theta2 = Math.abs(theta1)-(option.angle[dir]-dir*90);
				pt3[0] = -dd3*Math.cos(theta2*Math.PI/180);
				pt3[1] = dd3*Math.sin(theta2*Math.PI/180);
				
				let pt4 = [option.median[option.lastDir[dir]]*option.median_width[option.lastDir[dir]]/2+option.exit_road_total_width[dir]+option.safe_island[dir]*option.safe_island_width[dir], option.median[dir]*(option.median_width[dir]/2)+ option.entry_total_width[dir]];
				let d4 = Math.sqrt(pt4[0]*pt4[0]+pt4[1]*pt4[1]);
				theta3 = Math.atan(pt4[1]/pt4[0])/Math.PI*180;
				theta4 = Math.abs(theta3)-(option.angle[dir]-dir*90);
				pt4[0] = -d4*Math.cos(theta4*Math.PI/180);
				pt4[1] = d4*Math.sin(theta4*Math.PI/180);
			
				let k1 = (pt2[1]-pt1[1])/(pt2[0]-pt1[0]);
				let b1 = pt1[1] - k1 * pt1[0];
				let k2 = (pt4[1]-pt3[1])/(pt4[0]-pt3[0]);
				let b2 = pt4[1] - k2 * pt4[0];
				let x1 = (b2-b1)/(k1-k2);
				let y1 = k1*x1+b1;
				let pt5 = [x1, y1];
				
				let x2 = Math.sqrt(option.safe_island_width[dir]*option.safe_island_width[dir]/(1+k1*k1)) + pt5[0];
				let y2 = k1 * x2 + b1;
				let pt6 = [x2, y2];
				
				let x3 = -Math.sqrt(option.safe_island_width[dir]*option.safe_island_width[dir]/(1+k2*k2)) + pt5[0];
				let y3 = k2 * x3 + b2;
				let pt7 = [x3, y3];
				
				let pt8 = [-Math.min(Math.abs(pt6[0]), Math.abs(pt7[0])) - Math.abs(pt6[0]-pt7[0])/5, Math.min(Math.abs(pt6[1]), Math.abs(pt7[1])) + Math.abs(pt6[1]-pt7[1])/5]

				let path_data = [[...pt5, ...pt6, ...pt8, ...pt7].map((e)=>e*option.scale)];
				
				if(option.safe_island[dir] === 1){
					let path = "M " + path_data[0] + " " + path_data[1] + " L " + path_data[2] + " " + path_data[3] + " Q" + path_data[4] + " " + path_data[5] + " " + path_data[6] + " " + path_data[7] + " Z";
					this.paths.push([path, option.COLOR_WHITE, option.lineWidth, option.COLOR_GREEN, "translate(" + option.offsetwidth + "," + option.offsetheight + "),rotate(" + 0 + ")"])
				}
				
			}else if(dir === 3 && Math.abs(option.angle[dir]-dir*90)>10){
			
				let pt1 = [option.median[option.lastDir[dir]]*option.median_width[option.lastDir[dir]]/2+option.exit_road_total_width[option.lastDir[dir]], option.median[dir]*(option.median_width[dir]/2)+ option.entry_total_width[dir]];
				let d1 = Math.sqrt(pt1[0]*pt1[0]+pt1[1]*pt1[1]);
				let theta1 = Math.atan(pt1[1]/pt1[0])/Math.PI*180;
				let theta2 = Math.abs(theta1)-(option.angle[option.lastDir[dir]]-option.lastDir[dir]*90);
				pt1[0] = -d1*Math.cos(theta2*Math.PI/180);
				pt1[1] = -d1*Math.sin(theta2*Math.PI/180);
				
				let pt2 = [option.median[option.lastDir[dir]]*option.median_width[option.lastDir[dir]]/2+option.exit_road_total_width[option.lastDir[dir]], option.median[dir]*(option.median_width[dir]/2)+ option.entry_total_width[dir]+option.safe_island_width[dir]];
				let d2 = Math.sqrt(pt2[0]*pt2[0]+pt2[1]*pt2[1]);
				let theta3 = Math.atan(pt2[1]/pt2[0])/Math.PI*180;
				let theta4 = Math.abs(theta3)-(option.angle[option.lastDir[dir]]-option.lastDir[dir]*90);
				pt2[0] = -d2*Math.cos(theta4*Math.PI/180);
				pt2[1] = -d2*Math.sin(theta4*Math.PI/180);

				let pt3 = [option.median[option.lastDir[dir]]*option.median_width[option.lastDir[dir]]/2+option.exit_road_total_width[option.lastDir[dir]], option.median[dir]*(option.median_width[dir]/2)+ option.entry_total_width[dir]];
				let dd3 = Math.sqrt(pt3[0]*pt3[0]+pt3[1]*pt3[1]);
				theta1 = Math.atan(pt3[1]/pt3[0])/Math.PI*180;
				theta2 = Math.abs(theta1)-(option.angle[dir]-dir*90);
				pt3[0] = -dd3*Math.cos(theta2*Math.PI/180);
				pt3[1] = -dd3*Math.sin(theta2*Math.PI/180);

				let pt4 = [option.median[option.lastDir[dir]]*option.median_width[option.lastDir[dir]]/2+option.exit_road_total_width[dir]+option.safe_island[dir]*option.safe_island_width[dir], option.median[dir]*(option.median_width[dir]/2)+ option.entry_total_width[dir]];
				let d4 = Math.sqrt(pt4[0]*pt4[0]+pt4[1]*pt4[1]);
				theta3 = Math.atan(pt4[1]/pt4[0])/Math.PI*180;
				theta4 = Math.abs(theta3)-(option.angle[dir]-dir*90);
				pt4[0] = -d4*Math.cos(theta4*Math.PI/180);
				pt4[1] = -d4*Math.sin(theta4*Math.PI/180);
			
				let k1 = (pt2[1]-pt1[1])/(pt2[0]-pt1[0]);
				let b1 = pt1[1] - k1 * pt1[0];
				let k2 = (pt4[1]-pt3[1])/(pt4[0]-pt3[0]);
				let b2 = pt4[1] - k2 * pt4[0];
				let x1 = (b2-b1)/(k1-k2);
				let y1 = k1*x1+b1;
				let pt5 = [x1, y1];
				
				let x2 = -Math.sqrt(option.safe_island_width[dir]*option.safe_island_width[dir]/(1+k1*k1)) + pt5[0];
				let y2 = k1 * x2 + b1;
				let pt6 = [x2, y2];
				
				let x3 = -Math.sqrt(option.safe_island_width[dir]*option.safe_island_width[dir]/(1+k2*k2)) + pt5[0];
				let y3 = k2 * x3 + b2;
				let pt7 = [x3, y3];
				
				let pt8 = [-Math.min(Math.abs(pt6[0]), Math.abs(pt7[0])) - Math.abs(pt6[0]-pt7[0])/5, -Math.min(Math.abs(pt6[1]), Math.abs(pt7[1])) - Math.abs(pt6[1]-pt7[1])/5]

				let path_data = [[...pt5, ...pt6, ...pt8, ...pt7].map((e)=>e*option.scale)];
				
				if(option.safe_island[dir] === 1){
					let path = "M " + path_data[0] + " " + path_data[1] + " L " + path_data[2] + " " + path_data[3] + " Q" + path_data[4] + " " + path_data[5] + " " + path_data[6] + " " + path_data[7] + " Z";
					this.paths.push([path, option.COLOR_WHITE, option.lineWidth, option.COLOR_GREEN, "translate(" + option.offsetwidth + "," + option.offsetheight + "),rotate(" + 0 + ")"])
				}
				
			}else{
				let pt1 = [option.median[option.lastDir[dir]] * option.median_width[option.lastDir[dir]]/2 + option.exit_road_total_width[option.lastDir[dir]], -option.median[dir]*option.median_width[dir]/2-option.entry_road_total_width[dir]];
				let pt2 = [option.median[option.lastDir[dir]] * option.median_width[option.lastDir[dir]]/2 + option.exit_road_total_width[option.lastDir[dir]] + option.safe_island_width[dir], -option.median[dir]*option.median_width[dir]/2-option.entry_road_total_width[dir]];
				let pt3 = [option.median[option.lastDir[dir]] * option.median_width[option.lastDir[dir]]/2 + option.exit_road_total_width[option.lastDir[dir]] + option.safe_island_width[dir]/5, -option.median[dir]*option.median_width[dir]/2-option.entry_road_total_width[dir] - option.safe_island_width[dir]/5];
				let pt4 = [option.median[option.lastDir[dir]] * option.median_width[option.lastDir[dir]]/2 + option.exit_road_total_width[option.lastDir[dir]], -option.median[dir]*option.median_width[dir]/2-option.entry_road_total_width[dir] - option.safe_island_width[dir]];
				
				let path_data = [...pt1, ...pt2, ...pt3, ...pt4].map((e)=>e*option.scale);

				if(option.safe_island[dir] === 1){
					let path = "M " + path_data[0] + " " + path_data[1] + " L " + path_data[2] + " " + path_data[3] + " Q" + path_data[4] + " " + path_data[5] + " " + path_data[6] + " " + path_data[7] + " Z";
					this.paths.push([path, option.COLOR_WHITE, option.lineWidth, option.COLOR_GREEN, "translate(" + option.offsetwidth + "," + option.offsetheight + "),rotate(" + option.angle[dir] + ")"]);
				}
			}
		}
	}
	
	// 进口导向箭头
	draw_cross_import_arrow = () => {
		let option = this.option;
		// 导向箭头
		for(let dir = 0; dir < option.angle.length; dir++){
			let lane_dir = option.lane_dir[dir].split(",");
			for(let lane_index = 0; lane_index < option.entry_main_num[dir]+option.entry_expand_num[dir]; lane_index++){
				let pt1 = [option.stopline_to_center[dir] + option.arrow2stopline[dir], 
				-option.median[dir]*(option.median_width[dir]/2-option.median_shrink_flag[dir]*option.median_shrink_width[dir])+option.median_line_offset[dir]*option.median_line_offset_width[dir]-(option.median[dir]*option.median_shrink_flag[dir]*option.median_shrink_width[dir]+option.median_line_offset[dir]*option.median_line_offset_width[dir]+option.entry_main_num[dir]*option.entry_main_width[dir] + option.entry_expand[dir] * option.entry_expand_width[dir])/(option.entry_main_num[dir]+option.entry_expand_num[dir])*(lane_index+0.5)];
				let pt2 = [option.stopline_to_center[dir] + option.arrow2stopline[dir], 
				-option.median[dir]*(option.median_width[dir]/2-option.median_shrink_flag[dir]*option.median_shrink_width[dir])+option.median_line_offset[dir]*option.median_line_offset_width[dir]-(option.median[dir]*option.median_shrink_flag[dir]*option.median_shrink_width[dir]+option.median_line_offset[dir]*option.median_line_offset_width[dir]+option.entry_main_num[dir]*option.entry_main_width[dir] + option.entry_expand[dir] * option.entry_expand_width[dir])/(option.entry_main_num[dir]+option.entry_expand_num[dir])*(lane_index+0.5)];
				let path_data = [...pt1, ...pt2].map((e)=> e * option.scale);
				if(lane_dir[lane_index]=== "L"){
					this.lines_arrow.push([...path_data, option.COLOR_WHITE, option.lineWidth, option.dashArraySolid, option.dashOffsetNone, "translate(" + option.offsetwidth + ", " + option.offsetheight + "),rotate(" + option.angle[dir] + ")", "url(#left_arrow)", ""]);
				}else if(lane_dir[lane_index]=== "R"){
					this.lines_arrow.push([...path_data, option.COLOR_WHITE, option.lineWidth, option.dashArraySolid, option.dashOffsetNone, "translate(" + option.offsetwidth + ", " + option.offsetheight + "),rotate(" + option.angle[dir] + ")", "url(#right_arrow)", ""]);
				}else if(lane_dir[lane_index]=== "T"){
					this.lines_arrow.push([...path_data, option.COLOR_WHITE, option.lineWidth, option.dashArraySolid, option.dashOffsetNone, "translate(" + option.offsetwidth + ", " + option.offsetheight + "),rotate(" + option.angle[dir] + ")", "url(#th_arrow)", ""]);
				}else if(lane_dir[lane_index]=== "TL"){
					this.lines_arrow.push([...path_data, option.COLOR_WHITE, option.lineWidth, option.dashArraySolid, option.dashOffsetNone, "translate(" + option.offsetwidth + ", " + option.offsetheight + "),rotate(" + option.angle[dir] + ")", "url(#th_left_arrow)", ""]);
				}else{
					this.lines_arrow.push([...path_data, option.COLOR_WHITE, option.lineWidth, option.dashArraySolid, option.dashOffsetNone, "translate(" + option.offsetwidth + ", " + option.offsetheight + "),rotate(" + option.angle[dir] + ")", "url(#th_right_arrow)", ""]);
				}

			}
		}
	}

	setOption = (option = this.option) => {
		this.lines = [];
        this.paths = [];
        this.texts = [];
		this.lines_arrow = [];
		this.link_pts = {entry_edge:[], exit_edge: [], median1:[], median2:[], entry_lane:[], exit_lane:[]};
		this.option = option;
		this.create_layout_icon();
		this.draw_cross_sidewalk();
		this.draw_cross_median();
		this.draw_import_main_sub_saparation();
		this.draw_export_main_sub_saparation();
		this.draw_import_car_bike_saparation();
		this.draw_export_car_bike_saparation();
		this.draw_cross_stopline();
		this.draw_cross_import_solid_line();
		this.draw_cross_import_channelized();
		this.draw_cross_import_main_line();
		this.draw_cross_import_sub_line();
		this.draw_cross_export_main_line();
		this.draw_cross_export_sub_line();
		this.draw_cross_import_edge_line();
		this.draw_cross_export_edge_line();
		this.draw_cross_import_curve();
		this.draw_cross_import_safe_island();
		this.draw_cross_import_arrow();
		// this.draw();
	}
	
	draw = () => {

		this.svg.append("g").attr("id", "lines").selectAll("line").data(this.lines).enter().append("line").attr("x1", (d,i) => d[0]).attr("y1", (d,i) => d[1]).attr("x2", (d,i) => d[2]).attr("y2", (d,i) => d[3])
		.attr("stroke", (d,i) => d[4]).attr("stroke-width", (d,i) => d[5])
		.attr("stroke-dasharray", (d,i) => d[6]).attr("stroke-dashoffset", (d,i) => d[7])
		.attr("transform", (d,i) => d[8]);

		this.svg.append("g").attr("id", "lines").selectAll("line").data(this.lines_arrow).enter().append("line").attr("x1", (d,i) => d[0]).attr("y1", (d,i) => d[1]).attr("x2", (d,i) => d[2]).attr("y2", (d,i) => d[3])
		.attr("stroke", (d,i) => d[4]).attr("stroke-width", (d,i) => d[5])
		.attr("stroke-dasharray", (d,i) => d[6]).attr("stroke-dashoffset", (d,i) => d[7])
		.attr("transform", (d,i) => d[8]).attr("marker-start", (d,i) => d[9]);

		this.svg.append("g").attr("id", "paths").selectAll("path").data(this.paths).enter().append("path")
		.attr("d", (d,i)=> d[0]).attr("stroke", (d,i)=>d[1]).attr("stroke-width", (d,i)=>d[2]).attr("fill", (d,i)=>d[3])
		.attr("transform", (d, i) => d[4]);

		this.svg.append("g").attr("id", "texts").selectAll("text").data(this.texts).enter().append("text")
        .attr("x", (d,i)=>d[0]).attr("y", (d,i)=>d[1]).attr("text-anchor", "middle")
        .text((d,i) => d[2]).attr("fill", (d,i)=> d[3]).attr("font-size", (d,i)=> d[4]).attr("transform", (d,i)=> d[5]);
	}

}


export class link_geometry{
	constructor(divID, start_node_info, end_node_info, link_info) {
		this.divID = divID;
		this.link_lines = [];
		this.start_node_info = start_node_info;
		this.end_node_info = end_node_info;
		this.link_info = link_info;
		this.lines = [];
		this.layout = null;
		this.layout2 = null;
		this.offset1 = 0;
		this.offset2 = 0;
		this.init_svg(divID);
		this.create_icon();
		this.create_node_option(start_node_info, end_node_info, link_info);
	}
	
	init_svg = (divID) => {
		let odiv = $("#" + divID)[0];
		this.width = odiv.offsetWidth;
		this.height = odiv.offsetHeight;
		this.svg = d3.select("body").select("#" + divID).append("svg").attr('width', this.width).attr('height', this.height);
	}

	create_icon = () => {
		// 直行导向箭头
		let th_arrow = this.svg.append("defs").attr("id", "arrow").append("marker").attr("id", "th_arrow")
		.attr("viewBox","0 0 30 4.5").attr("refX", "0").attr("refY", "2.25").attr("markerWidth", (5*2)).attr("markerHeight", (0.75*2)).attr("orient", "auto").attr("markerUnits", "strokeWidth");	
		th_arrow.append("path").attr("d", "M0,2.25 L12,4.5 L12,3 L30,3 L30,1.5 L12,1.5 L12,0 L0,2.25 z").attr("fill", "#fff");

		// 直左导向箭头
		let th_left_arrow = this.svg.select("#arrow").append("marker").attr("id", "th_left_arrow")
		.attr("viewBox","0 0 30 10").attr("refX", "0").attr("refY", "5").attr("markerWidth", (5*2)).attr("markerHeight", (5/3*2)).attr("orient", "auto").attr("markerUnits", "strokeWidth");	
		th_left_arrow.append("path").attr("d", "M0,2.25 L12,4.5 L12,3 L22,3 L15,7 L10,7 L18,10, L25.5,7 L21,7 L28,3 L30,3 L30,1.5 L12,1.5 L12,0 L0,2.25 z").attr("fill", "#fff");

		// 直右导向箭头
		let th_right_arrow = this.svg.select("#arrow").append("marker").attr("id", "th_right_arrow")
		.attr("viewBox","0 0 30 10").attr("refX", "0").attr("refY", "5").attr("markerWidth", (5*2)).attr("markerHeight", (5/3*2)).attr("orient", "auto").attr("markerUnits", "strokeWidth");	
		th_right_arrow.append("path").attr("d", "M0,7.75 L12,5.5 L12,7 L22,7 L15,4 L10,4 L18,0, L25.5,4 L21,4 L28,7 L30,7 L30,8.5 L12,8.5 L12,10 L0,7.75 z").attr("fill", "#fff");

		// 左转导向箭头
		let left_arrow = this.svg.select("#arrow").append("marker").attr("id", "left_arrow")
		.attr("viewBox","0 0 30 7.5").attr("refX", "0").attr("refY", "3.75").attr("markerWidth", (5*2)).attr("markerHeight", (1.25*2)).attr("orient", "auto").attr("markerUnits", "strokeWidth");	
		left_arrow.append("path").attr("d", "M0,4.5 L8,7.5 L15.5,4.5 L11,4.5 L16.5,1.5 L30,1.5 L30,0 L10.5,0 L5,4.5 L0,4.5 Z").attr("fill", "#fff");

		// 右转导向箭头
		let right_arrow = this.svg.select("#arrow").append("marker").attr("id", "right_arrow")
		.attr("viewBox","0 0 30 7.5").attr("refX", "0").attr("refY", "3.75").attr("markerWidth", (5*2)).attr("markerHeight", (1.25*2)).attr("orient", "auto").attr("markerUnits", "strokeWidth");	
		right_arrow.append("path").attr("d", "M0,3 L8,0 L15.5,3 L11,3 L16.5,6 L30,6 L30,7.5 L10.5,7.5 L5,3 L0,3 Z").attr("fill", "#fff");

		// 调头箭头
		let uturn_arrow = this.svg.select("#arrow").append("marker").attr("id", "uturn_arrow")
		.attr("viewBox","0 0 30 7.5").attr("refX", "0").attr("refY", "3.75").attr("markerWidth", (5*2)).attr("markerHeight", (1.25*2)).attr("orient", "auto").attr("markerUnits", "strokeWidth");	
		uturn_arrow.append("path").attr("d", "M0,3 L8,0 L15.5,3 L11,3 L16.5,6 L30,6 L30,7.5 L10.5,7.5 L5,3 L0,3 Z").attr("fill", "#fff");

	}


	create_node_option = (start_node_info, end_node_info, link_info) => {

		let index1 = 0;
		let index2 = 0;

		let node1_east = start_node_info.east;
		let node1_south = start_node_info.south;
		let node1_west = start_node_info.west;
		let node1_north = start_node_info.north;

		let opt1 = {};
		let keys1 = Object.keys(node1_east);
		for (let index = 0; index < keys1.length; index++) {
			const key = keys1[index];
			// 北向南
			if(link_info.link_dir === 4){
				node1_south.angle=0;
				node1_west.angle=90;
				node1_north.angle=180;
				node1_east.angle=270;
				opt1[key] = [node1_south[key], node1_west[key], node1_north[key], node1_east[key]];
				opt1.link_flag = 0;
				index1 = 3;
			}
			// 南向北
			if(link_info.link_dir === 2){
				node1_south.angle=180;
				node1_west.angle=270;
				node1_north.angle=0;
				node1_east.angle=90;
				opt1[key] = [node1_north[key], node1_east[key], node1_south[key], node1_west[key]];
				opt1.link_flag = 0;
				index1 = 1;
			}
			if(link_info.link_dir === 3){
				node1_west.angle=0;
				node1_north.angle=90;
				node1_east.angle=180;
				node1_south.angle=270;
				opt1[key] = [node1_west[key], node1_north[key], node1_east[key], node1_south[key]];
				opt1.link_flag = 0;
				index1 = 0;
			}
			if(link_info.link_dir === 1){
				opt1[key] = [node1_east[key], node1_south[key], node1_west[key], node1_north[key]];
				opt1.link_flag = 0;
				index1 = 2;
			}
		}
				
		let node2_east = end_node_info.east;
		let node2_south = end_node_info.south;
		let node2_west = end_node_info.west;
		let node2_north = end_node_info.north;

		let opt2 = {};
		let keys2 = Object.keys(node2_east);
		for (let index = 0; index < keys2.length; index++) {
			const key = keys2[index];
			// 北向南
			if(link_info.link_dir === 4){
				node2_south.angle=0;
				node2_west.angle=90;
				node2_north.angle=180;
				node2_east.angle=270;
				opt2[key] = [node2_south[key], node2_west[key], node2_north[key], node2_east[key]];
				opt2.link_flag = 2;
				index2 = 3;
			}
			// 南向北
			if(link_info.link_dir === 2){
				node2_south.angle=180;
				node2_west.angle=270;
				node2_north.angle=0;
				node2_east.angle=90;
				opt2[key] = [node2_north[key], node2_east[key], node2_south[key], node2_west[key]];
				opt2.link_flag = 2;
				index2 = 1;
			}
			if(link_info.link_dir === 3){
				node2_west.angle=0;
				node2_north.angle=90;
				node2_east.angle=180;
				node2_south.angle=270;
				opt2[key] = [node2_west[key], node2_north[key], node2_east[key], node2_south[key]];
				opt2.link_flag = 2;
				index2 = 0;
			}
			if(link_info.link_dir === 1){
				opt2[key] = [node2_east[key], node2_south[key], node2_west[key], node2_north[key]];
				opt2.link_flag = 2;
				index2 = 2;
			}
		}

		let exit_total_width = opt1.exit_main_num[0] * opt1.exit_main_width[0] + 
		opt1.exit_main_sub_sep[0] * (opt1.entry_sub_num[0] * opt1.entry_sub_width[0] + opt1.exit_main_sub_sep_width[0]) + 
		opt1.exit_car_bike_sep[0] * (opt1.exit_car_bike_sep_width[0] + opt1.exit_bike_width[0]) -
		opt1.median_line_offset[0] * opt1.median_line_offset_width[0];
		let stopline2center = opt2.median[0] * opt2.median_width[0]/2 + exit_total_width + 
		opt2.safe_island[0] * (opt2.sidewalk2safeisland_length[0] + opt2.sidewalk_width[0] * opt2.sidewalk_flag[0] + opt2.stopline2sidewalk[0]) + 
		(1-opt2.safe_island[0]) * (opt2.sidewalk2last_exit_length[0] + opt2.turning_radius[0] + opt2.sidewalk_width[0]*2 + opt2.stopline2sidewalk[0])
		+ opt2.median_line_offset[0] * opt2.median_line_offset_width[0];
		
		this.scale = this.width / (link_info.link_length/2 + stopline2center*2 + opt1.channelized_length[0] + opt2.channelized_length[0] + opt1.gradual_length[0] + opt2.gradual_length[0]) / 1.2;
		this.offset1 = this.width / 12 + (stopline2center + opt2.channelized_length[0] + opt2.gradual_length[0])*this.scale;
		this.offset2 = this.offset1 + link_info.link_length/2*this.scale;

		opt1.scale = this.scale;
		opt2.scale = this.scale;
		this.layout = new link_node(this.svg, this.offset1, this.height/2, opt1);
		this.layout2 = new link_node(this.svg, this.offset2, this.height/2, opt2);

	}

	create_link_lines = (layout, layout2, offset1, offset2, height) => {
		let lines = [];
		// 边缘线
		lines.push([layout.link_pts.entry_edge[0] + offset1, layout.link_pts.entry_edge[1] + height/2, -layout2.link_pts.exit_edge[0] + offset2, -layout2.link_pts.exit_edge[1] + height/2, "#000", 2, "", "", "translate(" + 0 + "," + 0 + "),rotate(" + 0 + ")"]);
		lines.push([layout.link_pts.exit_edge[0] + offset1, layout.link_pts.exit_edge[1] + height/2, -layout2.link_pts.entry_edge[0] + offset2, -layout2.link_pts.entry_edge[1] + height/2, "#000", 2, "", "", "translate(" + 0 + "," + 0 + "),rotate(" + 0 + ")"]);
		
		// 中心线
		lines.push([layout.link_pts.median1[0] + offset1, layout.link_pts.median1[1] + height/2, -layout2.link_pts.median2[0] + offset2, -layout2.link_pts.median2[1] + height/2, "#ff0", 1, "", "", "translate(" + 0 + "," + 0 + "),rotate(" + 0 + ")"]);
		lines.push([layout.link_pts.median2[0] + offset1, layout.link_pts.median2[1] + height/2, -layout2.link_pts.median1[0] + offset2, -layout2.link_pts.median1[1] + height/2, "#ff0", 1, "", "", "translate(" + 0 + "," + 0 + "),rotate(" + 0 + ")"]);
		
		for(let i = 0; i < layout.link_pts.exit_lane.length; i++){
			lines.push([layout.link_pts.exit_lane[i][0] + offset1, layout.link_pts.exit_lane[i][1] + height/2, -layout2.link_pts.entry_lane[i][0] + offset2, -layout2.link_pts.entry_lane[i][1] + height/2, "#fff", 1, "5,5", "", "translate(" + 0 + "," + 0 + "),rotate(" + 0 + ")"]);
		}

		for(let i = 0; i < layout.link_pts.entry_lane.length; i++){
			lines.push([layout.link_pts.entry_lane[i][0] + offset1, layout.link_pts.entry_lane[i][1] + height/2, -layout2.link_pts.exit_lane[i][0] + offset2, -layout2.link_pts.exit_lane[i][1] + height/2, "#fff", 1, "5,5", "", "translate(" + 0 + "," + 0 + "),rotate(" + 0 + ")"]);
		}
		this.link_lines = lines;
		
	}

	draw_lines = () => {
		this.svg.append("g").attr("id", "lines").selectAll("line").data(this.link_lines).enter().append("line")
		.attr("x1", (d,i) => d[0]).attr("y1", (d,i) => d[1]).attr("x2", (d,i) => d[2]).attr("y2", (d,i) => d[3])
		.attr("stroke", (d,i) => d[4]).attr("stroke-width", (d,i) => d[5])
		.attr("stroke-dasharray", (d,i) => d[6]).attr("stroke-dashoffset", (d,i) => d[7])
		.attr("transform", (d,i) => d[8]);
	}

	clear_svg = () => {
		this.svg.selectAll("*").remove();
	}

	draw = () => {

		this.layout.setOption();
		this.layout2.setOption();
		this.create_link_lines(this.layout, this.layout2, this.offset1, this.offset2, this.height);

		this.layout.draw();
		this.layout2.draw();
		this.draw_lines();
	}

	

}

