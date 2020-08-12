
class Layout {
    constructor(divID = "", name = "") {
        this.divID = divID;
        this.name = name;
        this.svg = null;
        this.lines = [];
        this.paths = [];
        this.texts = [];
        this.lines_arrow = [];
        this.initSvg();
        this.initOption();
		// this.create_cross_test();
    }
	initSvg = () => {
		let odiv = $(this.divID)[0];
        this.width = odiv.offsetWidth;
        this.height = odiv.offsetHeight;
        this.svg = d3.select("body").select(this.divID).append("svg").attr('width', this.width).attr('height', this.height);
	}
	initOption = () => {
		let option = {
			width: this.width,
			height: this.height,
			background: "#777",
			scale: 3,

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
			angle : [0,102,180,270],
			roadName : ["新华西路", "建设南路", "新华西路", "建设南路"],
			entry_main_num : [5,4,5,4],					// 进口主道数
			entry_expand_num : [0,0,0,0],					// 进口展宽车道数
			exit_main_num : [3,3,3,3],					// 出口主道数
			lane_dir : ['L,L,T,T,T,R','L,L,T,TR','L,L,T,T,TR','L,L,T,TR'],				// 进口车道行驶方向

			// 第二级
			// 提前右转设置
			right_ahead : [0,0,0,0],				// 是否设置提前右转
			safe_island : [0,0,0,0],				// 是否设置安全岛	
			// 进口区划
			median : [0,0,0,0], 							// 是否存在中央分隔带
			median_shrink_flag : [0,0,0,0],				// 是否压缩中央分隔带
			entry_expand : [0,0,0,0],				// 进口是否向外展宽
			median_line_offset : [0,0,0,0],				// 中心线是否偏移
			// 人行道
			sidewalk_flag : [1,1,1,1],					// 进口是否设置人行道
			// 待行区
			left_wait : [0,0,0,0],					// 进口是否存在左转待行区
			through_wait : [0,0,0,0],				// 进口是否存在直行待行区
			// 辅道
			entry_sub : [0,0,0,0],						// 进口是否存在辅道
			entry_main_sub_sep : [0,0,0,0],		// 进口主辅隔离方式
			entry_sub_num : [2,2,2,2],					// 进口辅道数
			exit_sub : [0,0,0,0],						// 出口是否存在辅道
			exit_main_sub_sep : [0,0,0,0],		// 出口主辅隔离方式
			exit_sub_num : [2,2,2,2],					// 出口辅道数
			// 非机动车道
			entry_car_bike_sep : [0,0,0,0],		// 进口机非隔离方式
			exit_car_bike_sep : [0,0,0,0],		// 出口机非隔离方式
			// 行人道
			entry_pedestrian : [1,1,1,1],				// 是否存在行人道
			entry_bike_pedestrian_sep : [1,1,1,1],
			entry_pedestrian_width : [3,3,3,3],
			exit_pedestrian : [1,1,1,1],				// 是否存在行人道
			exit_bike_pedestrian_sep : [1,1,1,1],
			exit_pedestrian_width : [3,3,3,3],

			// 第三级
			road_name_flag : [1,0,0,1],
			// 车道宽
			entry_main_width : [3,3,3,3],					// 进口主道宽度
			entry_sub_width : [3,3,3,3],					// 进口辅道宽度
			exit_main_width : [3,3,3,3],					// 出口主道宽度
			exit_sub_width : [3,3,3,3],					// 出口辅道宽度
			entry_bike_width : [2,2,2,2],					// 进口非机动车道宽度
			exit_bike_width : [2,2,2,2],					// 出口非机动车道宽度
			// 展宽情况
			median_width : [3,3,3,3],							// 中央分隔带宽度
			median_shrink_width : [2,2,2,2],				// 进口压缩中央分隔带宽度
			median_line_offset_width : [1,1,1,1],				// 进口中心线偏移距离
			entry_expand_width : [2,2,2,2],				// 进口道向外展宽宽度
			// 第四级
			entry_car_bike_sep_width : [2,2,2,2],		// 进口机非隔离宽度
			entry_main_sub_sep_width : [2,2,2,2],		// 进口主辅隔离宽度
			exit_main_sub_sep_width : [2,2,2,2],		// 出口主辅隔离宽度
			exit_car_bike_sep_width : [2,2,2,2],		// 出口机非隔离宽度
			// 待转区/渠化段
			left_wait_length : [0,0,0,0],				// 进口左转待行区
			through_wait_length : [0,0,0,0],				// 进口直行待行区
			channelized_length : [20,20,20,20],			// 进口渠化长度  
			gradual_length : [10,10,10,10],				// 进口渐变长度
			
			// 默认值
			arrow2stopline : [1,1,1,1],					// 进口导向箭头距停车线距离
			turning_radius : [5,5,5,5],					// 进口转弯半径
			ahead_right_dist : [8,8,8,8],				// 进口提前右转距停车线距离
			ahead_right_lane_width : [4,4,4,4],			// 进口提前右转车道宽度
			safe_island_width : [9,9,9,9],				// 进口安全岛宽度
			// 人行道
			stopline2sidewalk : [1,1,1,1],				// 进口停车线距人行道距离
			sidewalk_width : [5,5,5,5],					// 进口人行道宽度
			sidewalk2safeisland_length : [1,1,1,1],		// 进口人行道距安全岛左边缘长度
			sidewalk2curve_length : [1,1,1,1],			// 进口人行道距转弯处长度
			sidewalk2last_exit_length : [1,1,1,1],		// 距离上个方向出口长度
			// 自动计算
			entry_total_width: [],
			entry_road_total_width: [],
			exit_total_width: [],
			exit_road_total_width: [],
			sidewalk_center_to_center: [],
			stopline_to_center: []
		}

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
		let i = 0;
		option.stopline_to_center = option.angle.map((e,i) => {
			return option.median[option.lastDir[i]] * option.median_width[option.lastDir[i]]/2 + option.exit_total_width[option.lastDir[i]] + 
				option.safe_island[i] * (option.sidewalk2safeisland_length[i] + option.sidewalk_width[i] * option.sidewalk_flag[i] + option.stopline2sidewalk[i]) + 
				(1-option.safe_island[i]) * (option.sidewalk2last_exit_length[i] + option.turning_radius[i] + option.sidewalk_width[i]*2 + option.stopline2sidewalk[i])
				+ option.median_line_offset[i] * option.median_line_offset_width[i]
				
		});
		let scale1 = Math.floor( option.width/(option.stopline_to_center[0] + option.stopline_to_center[2] + option.channelized_length[0] * 2 + option.gradual_length[0] * 2 + option.channelized_length[2] * 2 + option.gradual_length[2] * 2)/1.1 * 4 )/4;
		let scale2 = Math.floor( option.height/(option.stopline_to_center[1] + option.stopline_to_center[3] + option.channelized_length[1] * 2 + option.gradual_length[1] * 2 + option.channelized_length[3] * 2 + option.gradual_length[3] * 2)/1.1 * 4 )/4;
		
		option.scale = Math.min(scale1, scale2);
		this.svg.style("background", option.background);
		this.option = option;
	}

	// 测试线
	create_cross_test = () => {
		let option = this.option;
		this.lines.push([0, -10, 0, 10, option.COLOR_WHITE, option.lineWidth, option.dashArraySolid, option.dashOffsetNone, "translate(" + option.width / 2 + "," + option.height / 2 + "),rotate(" + 0 + ")"]);
		this.lines.push([-10, 0, 10, 0, option.COLOR_WHITE, option.lineWidth, option.dashArraySolid, option.dashOffsetNone, "translate(" + option.width / 2 + "," + option.height / 2 + "),rotate(" + 0 + ")"]);
	}

	// 创建导向箭头图标
	create_layout_icon = () => {
		let option = this.option;
		// 直行导向箭头
		let th_arrow = this.svg.append("defs").attr("id", "arrow").append("marker").attr("id", "th_arrow")
		.attr("viewBox","0 0 30 4.5").attr("refX", "0").attr("refY", "2.25").attr("markerWidth", ""+(5*option.scale)).attr("markerHeight", ""+(0.75*option.scale)).attr("orient", "auto").attr("markerUnits", "strokeWidth");	
		th_arrow.append("path").attr("d", "M0,2.25 L12,4.5 L12,3 L30,3 L30,1.5 L12,1.5 L12,0 L0,2.25 z").attr("fill", "#fff");

		// 直左导向箭头
		let th_left_arrow = this.svg.select("#arrow").append("marker").attr("id", "th_left_arrow")
		.attr("viewBox","0 0 30 10").attr("refX", "0").attr("refY", "5").attr("markerWidth", ""+(5*option.scale)).attr("markerHeight", ""+(5/3*option.scale)).attr("orient", "auto").attr("markerUnits", "strokeWidth");	
		th_left_arrow.append("path").attr("d", "M0,2.25 L12,4.5 L12,3 L22,3 L15,7 L10,7 L18,10, L25.5,7 L21,7 L28,3 L30,3 L30,1.5 L12,1.5 L12,0 L0,2.25 z").attr("fill", "#fff");

		// 直右导向箭头
		let th_right_arrow = this.svg.select("#arrow").append("marker").attr("id", "th_right_arrow")
		.attr("viewBox","0 0 30 10").attr("refX", "0").attr("refY", "5").attr("markerWidth", ""+(5*option.scale)).attr("markerHeight", ""+(5/3*option.scale)).attr("orient", "auto").attr("markerUnits", "strokeWidth");	
		th_right_arrow.append("path").attr("d", "M0,7.75 L12,5.5 L12,7 L22,7 L15,4 L10,4 L18,0, L25.5,4 L21,4 L28,7 L30,7 L30,8.5 L12,8.5 L12,10 L0,7.75 z").attr("fill", "#fff");

		// 左转导向箭头
		let left_arrow = this.svg.select("#arrow").append("marker").attr("id", "left_arrow")
		.attr("viewBox","0 0 30 7.5").attr("refX", "0").attr("refY", "3.75").attr("markerWidth", ""+(5*option.scale)).attr("markerHeight", ""+(1.25*option.scale)).attr("orient", "auto").attr("markerUnits", "strokeWidth");	
		left_arrow.append("path").attr("d", "M0,4.5 L8,7.5 L15.5,4.5 L11,4.5 L16.5,1.5 L30,1.5 L30,0 L10.5,0 L5,4.5 L0,4.5 Z").attr("fill", "#fff");

		// 右转导向箭头
		let right_arrow = this.svg.select("#arrow").append("marker").attr("id", "right_arrow")
		.attr("viewBox","0 0 30 7.5").attr("refX", "0").attr("refY", "3.75").attr("markerWidth", ""+(5*option.scale)).attr("markerHeight", ""+(1.25*option.scale)).attr("orient", "auto").attr("markerUnits", "strokeWidth");	
		right_arrow.append("path").attr("d", "M0,3 L8,0 L15.5,3 L11,3 L16.5,6 L30,6 L30,7.5 L10.5,7.5 L5,3 L0,3 Z").attr("fill", "#fff");

		// 调头箭头
		let uturn_arrow = this.svg.select("#arrow").append("marker").attr("id", "uturn_arrow")
		.attr("viewBox","0 0 30 7.5").attr("refX", "0").attr("refY", "3.75").attr("markerWidth", ""+(5*option.scale)).attr("markerHeight", ""+(1.25*option.scale)).attr("orient", "auto").attr("markerUnits", "strokeWidth");	
		uturn_arrow.append("path").attr("d", "M0,3 L8,0 L15.5,3 L11,3 L16.5,6 L30,6 L30,7.5 L10.5,7.5 L5,3 L0,3 Z").attr("fill", "#fff");

		let camera = this.svg.select("#arrow").append("marker").attr("id", "cameras")
		.attr("viewBox","0 0 30 7.5").attr("refX", "8").attr("refY", "6.5").attr("markerWidth", ""+(30*option.scale)).attr("markerHeight", ""+(7.5*option.scale)).attr("orient", "auto").attr("markerUnits", "strokeWidth");	
		camera.append("path").attr("d", "M11.176,6.269l0.913-0.216c0.059-0.014,0.132-0.002,0.162,0.026c0.008,0.008,0.013,0.016,0.013,0.025v0.842 c0,0.031-0.055,0.057-0.121,0.057c-0.019,0-0.037-0.002-0.054-0.006l-0.913-0.216v0.2c0,0.126-0.216,0.229-0.483,0.229H8.519 c-0.267,0-0.483-0.102-0.483-0.229V6.069c0-0.126,0.216-0.228,0.483-0.228h2.174c0.267,0,0.483,0.102,0.483,0.228V6.269	L11.176,6.269z")
		.attr("fill", "#d81e06");

		let camera2 = this.svg.select("#arrow").append("marker").attr("id", "camera2")
		.attr("viewBox","0 0 30 7.5").attr("refX", "8").attr("refY", "3").attr("markerWidth", ""+(30*option.scale)).attr("markerHeight", ""+(7.5*option.scale)).attr("orient", "auto").attr("markerUnits", "strokeWidth");	
		// camera2.append("path").attr("d", "M9.124,6.782L8.211,6.998C8.152,7.012,8.079,7,8.049,6.972C8.041,6.964,8.036,6.956,8.036,6.947V6.104 c0-0.031,0.055-0.057,0.121-0.057c0.019,0,0.037,0.002,0.054,0.006l0.913,0.216v-0.2c0-0.126,0.216-0.229,0.483-0.229h2.174 c0.267,0,0.483,0.102,0.483,0.229v0.913c0,0.126-0.216,0.228-0.483,0.228H9.606c-0.267,0-0.483-0.102-0.483-0.228V6.782L9.124,6.782 z")
		// .attr("fill", "#d81e06");

		camera2.append("path").attr("d", "M6.286,3.718L3.834,4.356C3.675,4.396,3.479,4.363,3.398,4.279C3.376,4.256,3.364,4.231,3.364,4.205V1.713 c0-0.093,0.147-0.169,0.326-0.169c0.049,0,0.098,0.006,0.145,0.018L6.286,2.2v-0.59c0-0.374,0.582-0.676,1.298-0.676h5.845 c0.716,0,1.298,0.302,1.298,0.676v2.7c0,0.373-0.582,0.674-1.298,0.674H7.584c-0.716,0-1.298-0.302-1.298-0.674V3.718L6.286,3.718z")
		.attr("fill", "#d81e06");

	}
	// 人行道
	draw_cross_sidewalk = () => {
		let option = this.option;
		for(let dir = 0; dir < option.angle.length; dir++){
			if(option.sidewalk_flag[dir] !== 0){
				let pt1 = [option.sidewalk_center_to_center[dir], -option.safe_island[dir] * (option.median[dir] * option.median_width[dir] / 2 + option.entry_road_total_width[dir]) - (1 - option.safe_island[dir]) * (option.median[dir] * option.median_width[dir] / 2 + option.entry_road_total_width[dir] + option.entry_expand[dir] * option.entry_expand_width[dir])];
				let pt2 = [option.sidewalk_center_to_center[dir], option.median[dir] * option.median_width[dir] / 2 + option.exit_total_width[dir] + option.median_line_offset[dir] * option.median_line_offset_width[dir]];
				// console.log(pt1, pt2);
				let sidewalk_path = [...pt1, ...pt2].map((e)=> e * option.scale);

				this.lines.push([...sidewalk_path, option.COLOR_WHITE, option.sidewalk_width[dir] * option.scale, option.dashArraySidwWalk, option.dashOffset, "translate(" + option.width / 2 + "," + option.height / 2 + "),rotate(" + option.angle[dir] + ")"]);
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
				this.paths.push([path, option.COLOR_WHITE, option.lineWidth, option.COLOR_GREEN, "translate(" + option.width / 2 + "," + option.height / 2 + "),rotate(" + option.angle[dir] + ")"]);
			}else {
				let point1 = [option.stopline_to_center[dir], option.median[dir] * option.median_width[dir] / 2 + option.median_line_offset[dir] * option.median_line_offset_width[dir]];
				let point2 = [option.stopline_to_center[dir] + option.channelized_length[dir], option.median[dir] * option.median_width[dir] / 2 + option.median_line_offset[dir] * option.median_line_offset_width[dir]];
				let point3 = [option.stopline_to_center[dir] + option.channelized_length[dir] + option.gradual_length[dir], option.median[dir] * option.median_width[dir] / 2];
				let point4 = [option.stopline_to_center[dir] + option.channelized_length[dir] * 2 + option.gradual_length[dir] * 2, option.median[dir] * option.median_width[dir] / 2];
				let path_data = [...point1, ...point2, ...point3, ...point4].map((e)=> e * option.scale);

				let path = "M " + path_data[0] + " " + (path_data[1] - option.doubleYellowGap) + " L " + path_data[2] + " " + (path_data[3] - option.doubleYellowGap) + " L " + path_data[4] + " " + (path_data[5] - option.doubleYellowGap) + " L " + path_data[6] + " " + (path_data[7] - option.doubleYellowGap) + " M " + path_data[0] + " " + (path_data[1] + option.doubleYellowGap) + " L " + path_data[2] + " " + (path_data[3] + option.doubleYellowGap) + " L " + path_data[4] + " " + (path_data[5] + option.doubleYellowGap) + " L " + path_data[6] + " " + (path_data[7] + option.doubleYellowGap);
				
				this.paths.push([path, option.COLOR_YELLOW, option.lineWidth, option.COLOR_YELLOW + "0", "translate(" + option.width / 2 + "," + option.height / 2 + "),rotate(" + option.angle[dir] + ")"])
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
			
			if(option.entry_main_sub_sep[dir] == 1){
				let path = "M " + path_pts[0] + " " + path_pts[1] + " L " + path_pts[2] + " " + path_pts[3] + " L " + path_pts[4] + " " + path_pts[5] + " L " + path_pts[6] + " " + path_pts[7] + " L " + path_pts[8] + " " + path_pts[9] + " Z";
				this.paths.push([path, option.COLOR_WHITE, option.lineWidth, option.COLOR_GREEN, "translate(" + option.width / 2 + "," + option.height / 2 + "),rotate(" + option.angle[dir] + ")"]);
			}
			/*
			else{
				let path = "M " + path_pts[0] + " " + (path_pts[1] - option.doubleYellowGap) + " L " + path_pts[2] + " " + (path_pts[3] - option.doubleYellowGap) + " M " + path_pts[0] + " " + (path_pts[1] + option.doubleYellowGap) + " L " + path_pts[2] + " " + (path_pts[3] + option.doubleYellowGap);
				this.paths.push([path, option.COLOR_WHITE, option.lineWidth, option.COLOR_WHITE, "translate(" + option.width / 2 + "," + option.height / 2 + "),rotate(" + option.angle[dir] + ")"]);
			}
			*/
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
				this.paths.push([path, option.COLOR_WHITE, option.lineWidth, option.COLOR_GREEN, "translate(" + option.width / 2 + "," + option.height / 2 + "),rotate(" + option.angle[dir] + ")"]);
			}
			/*
			else{
				let path = "M " + path_data[0] + " " + (path_data[1] - option.doubleYellowGap) + " L " + path_data[2] + " " + (path_data[3] - option.doubleYellowGap) + " M " + path_data[0] + " " + (path_data[1] + option.doubleYellowGap) + " L " + path_data[2] + " " + (path_data[3] + option.doubleYellowGap);
				this.paths.push([path, option.COLOR_WHITE, option.lineWidth, option.COLOR_WHITE, "translate(" + option.width / 2 + "," + option.height / 2 + "),rotate(" + option.angle[dir] + ")"])
			}
			*/
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

			if(option.entry_car_bike_sep[dir] == 1){
				let path = "M " + path_data[0] + " " + path_data[1] + " L " + path_data[2] + " " + path_data[3] + " L " + path_data[4] + " " + path_data[5] + " L " + path_data[6] + " " + path_data[7] + " L " + path_data[8] + " " + path_data[9] + " Z";
				this.paths.push([path, option.COLOR_WHITE, option.lineWidth, option.COLOR_GREEN, "translate(" + option.width / 2 + "," + option.height / 2 + "),rotate(" + option.angle[dir] + ")"])
			}
			/*
			else{
				car_bike_separation.attr("d", (d,i)=> "M " + d[0] + " " + (d[1] - option.doubleYellowGap) + " L " + d[2] + " " + (d[3] - option.doubleYellowGap) + " M " + d[0] + " " + (d[1] + option.doubleYellowGap) + " L " + d[2] + " " + (d[3] + option.doubleYellowGap))
				.attr("stroke", (d,i)=>"#fff").attr("stroke-width", (d,i)=>1).attr("fill", (d,i)=>"#fff").attr("transform", (d, i) => "translate(" + option.width / 2 + "," + option.height / 2 + "),rotate(" + option.angle[dir] + ")");
			}
			*/
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

			if(option.exit_car_bike_sep[dir] == 1){
				let path = "M " + path_data[0] + " " + path_data[1] + " L " + path_data[2] + " " + path_data[3] + " L " + path_data[4] + " " + path_data[5] + " L " + path_data[6] + " " + path_data[7] + " L " + path_data[8] + " " + path_data[9] + " Z";
				this.paths.push([path, option.COLOR_WHITE, option.lineWidth, option.COLOR_GREEN, "translate(" + option.width / 2 + "," + option.height / 2 + "),rotate(" + option.angle[dir] + ")"]);
			}
			/*
			else{
				ex_car_bike_separation.attr("d", (d,i)=> "M " + d[0] + " " + (d[1] - option.doubleYellowGap) + " L " + d[2] + " " + (d[3] - option.doubleYellowGap) + " M " + d[0] + " " + (d[1] + option.doubleYellowGap) + " L " + d[2] + " " + (d[3] + option.doubleYellowGap))
				.attr("stroke", (d,i)=>"#fff").attr("stroke-width", (d,i)=>1).attr("fill", (d,i)=>"#fff").attr("transform", (d, i) => "translate(" + option.width / 2 + "," + option.height / 2 + "),rotate(" + option.angle[dir] + ")");
			}
			*/
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
			this.lines.push([...path_data, option.COLOR_WHITE, option.lineWidth*2, option.dashArraySolid, option.dashOffsetNone, "translate(" + option.width / 2 + "," + option.height / 2 + "),rotate(" + option.angle[dir] + ")"]);
		}
	}

	// 进口主道实线
	draw_cross_import_solid_line = () => {
		let option = this.option;
		// 进口主道渠化区车道线 
		for(let dir = 0; dir < option.angle.length; dir++){
			
			for(let lane_index = 1; lane_index < option.entry_main_num[dir]+option.entry_expand_num[dir]+1*option.entry_expand[dir]; lane_index++){

				let pt1 = [option.stopline_to_center[dir], -option.median[dir]*(option.median_width[dir]/2-option.median_shrink_flag[dir]*option.median_shrink_width[dir])+option.median_line_offset[dir]*option.median_line_offset_width[dir]-(option.median[dir]*option.median_shrink_flag[dir]*option.median_shrink_width[dir]+option.median_line_offset[dir]*option.median_line_offset_width[dir]+option.entry_main_num[dir]*option.entry_main_width[dir])/(option.entry_main_num[dir]+option.entry_expand_num[dir])*(lane_index)];
				let pt2 = [option.stopline_to_center[dir] + option.channelized_length[dir], -option.median[dir]*(option.median_width[dir]/2-option.median_shrink_flag[dir]*option.median_shrink_width[dir])+option.median_line_offset[dir]*option.median_line_offset_width[dir]-(option.median[dir]*option.median_shrink_flag[dir]*option.median_shrink_width[dir]+option.median_line_offset[dir]*option.median_line_offset_width[dir]+option.entry_main_num[dir]*option.entry_main_width[dir])/(option.entry_main_num[dir]+option.entry_expand_num[dir])*(lane_index)];
				
				let path_data = [...pt1, ...pt2].map((e)=> e * option.scale);
				this.lines.push([...path_data, option.COLOR_WHITE, option.lineWidth, option.dashArraySolid, option.dashOffsetNone, "translate(" + option.width / 2 + "," + option.height / 2 + "),rotate(" + option.angle[dir] + ")"]);
			}
		}
	}

	// 进口主道渠化区渐变段车道线
	draw_cross_import_channelized = () => {
		let option = this.option;
		for(let dir = 0; dir < option.angle.length; dir++){
			
			for(let lane_index = 1; lane_index < option.entry_main_num[dir]+option.entry_expand_num[dir]; lane_index++){
			
				let pt1 = [option.stopline_to_center[dir] + option.channelized_length[dir], -option.median[dir]*(option.median_width[dir]/2-option.median_shrink_flag[dir]*option.median_shrink_width[dir])+option.median_line_offset[dir]*option.median_line_offset_width[dir]-(option.median[dir]*option.median_shrink_flag[dir]*option.median_shrink_width[dir]+option.median_line_offset[dir]*option.median_line_offset_width[dir]+option.entry_main_num[dir]*option.entry_main_width[dir])/(option.entry_main_num[dir]+option.entry_expand_num[dir])*(lane_index)];
				let pt2 = [option.stopline_to_center[dir] + option.channelized_length[dir] + option.gradual_length[dir]*0.66, -option.median[dir]*(option.median_width[dir]/2-option.median_shrink_flag[dir]*option.median_shrink_width[dir])+option.median_line_offset[dir]*option.median_line_offset_width[dir]-(option.median[dir]*option.median_shrink_flag[dir]*option.median_shrink_width[dir]+option.median_line_offset[dir]*option.median_line_offset_width[dir]+option.entry_main_num[dir]*option.entry_main_width[dir])/(option.entry_main_num[dir]+option.entry_expand_num[dir])*(lane_index)];
				
				let path_data = [...pt1, ...pt2].map((e)=> e * option.scale);
				this.lines.push([...path_data, option.COLOR_WHITE, option.lineWidth, option.dashArray, option.dashOffset, "translate(" + option.width / 2 + "," + option.height / 2 + "),rotate(" + option.angle[dir] + ")"])
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
				this.lines.push([...path_data, option.COLOR_WHITE, option.lineWidth, option.dashArray, option.dashOffsetNone, "translate(" + option.width / 2 + "," + option.height / 2 + "),rotate(" + option.angle[dir] + ")"])
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
				this.lines.push([...path_data, option.COLOR_WHITE, option.dashArray, option.dashOffsetNone, "translate(" + option.width / 2 + "," + option.height / 2 + "),rotate(" + option.angle[dir] + ")"])
				console.log([...path_data, option.COLOR_WHITE, option.dashArray, option.dashOffsetNone, "translate(" + option.width / 2 + "," + option.height / 2 + "),rotate(" + option.angle[dir] + ")"])
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
				this.lines.push([...path_data, option.COLOR_WHITE, option.lineWidth, option.dashArray, option.dashOffsetNone, "translate(" + option.width / 2 + "," + option.height / 2 + "),rotate(" + option.angle[dir] + ")"]);
				let path_data2 = [...pt2, ...pt3].map((e)=> e * option.scale);
				this.lines.push([...path_data2, option.COLOR_WHITE, option.lineWidth, option.dashArray, option.dashOffsetNone, "translate(" + option.width / 2 + "," + option.height / 2 + "),rotate(" + option.angle[dir] + ")"]);
				let path_data3 = [...pt3, ...pt4].map((e)=> e * option.scale);
				this.lines.push([...path_data3, option.COLOR_WHITE, option.lineWidth, option.dashArray, option.dashOffsetNone, "translate(" + option.width / 2 + "," + option.height / 2 + "),rotate(" + option.angle[dir] + ")"]);
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
				this.lines.push([...path_data, option.COLOR_WHITE, option.lineWidth, option.dashArray, option.dashOffsetNone, "translate(" + option.width / 2 + "," + option.height / 2 + "),rotate(" + option.angle[dir] + ")"]);
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
			this.paths.push([path, option.COLOR_BLACK, option.lineWidth*2, option.COLOR_BLACK + "0", "translate(" + option.width / 2 + "," + option.height / 2 + "),rotate(" + option.angle[dir] + ")"]);
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
			this.paths.push([path, option.COLOR_BLACK, option.lineWidth*2, option.COLOR_BLACK, "translate(" + option.width / 2 + "," + option.height / 2 + "),rotate(" + option.angle[dir] + ")"])
		}
	}

	// 转弯曲线
	draw_cross_import_curve = () => {
		let option = this.option;
		for(let dir = 0; dir < option.angle.length; dir++){
			let pt1 = [option.stopline_to_center[dir] - option.sidewalk_width[dir] * option.sidewalk_flag[dir] + option.right_ahead[dir] * (option.ahead_right_dist[dir] + option.ahead_right_lane_width[dir]), -option.median[dir]*option.median_width[dir]/2-option.entry_road_total_width[dir]-option.entry_expand[dir]*option.entry_expand_width[dir]];
			let pt2 = [(option.median[option.lastDir[dir]]*option.median_width[option.lastDir[dir]]/2 + option.exit_road_total_width[option.lastDir[dir]]), -option.stopline_to_center[option.lastDir[dir]] - option.right_ahead[dir] * (option.ahead_right_dist[dir] + option.ahead_right_lane_width[dir]) + option.sidewalk_width[option.lastDir[dir]] * option.sidewalk_flag[option.lastDir[dir]]];
			
			if(dir == 0){
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
				this.paths.push([path, option.COLOR_BLACK, option.lineWidth*2, "#7770", "translate(" + option.width / 2 + "," + option.height / 2 + "),rotate(" + 0 + ")"])
			
			}if(dir==1){
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
				this.paths.push([path, option.COLOR_BLACK, option.lineWidth*2, "#7770", "translate(" + option.width / 2 + "," + option.height / 2 + "),rotate(" + 0 + ")"])
			
			}else if(dir==2){
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
				this.paths.push([path, option.COLOR_BLACK, option.lineWidth*2, "#7770", "translate(" + option.width / 2 + "," + option.height / 2 + "),rotate(" + 0 + ")"])
			
			}else if(dir == 3){
			
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
				this.paths.push([path, option.COLOR_BLACK, option.lineWidth*2, "#7770", "translate(" + option.width / 2 + "," + option.height / 2 + "),rotate(" + 0 + ")"])
			}
		}
	}

	// 安全岛
	draw_cross_import_safe_island = () => {
		let option = this.option;
		// 安全岛
		for(let dir = 0; dir < option.angle.length; dir++){
			
			if(dir == 0 && Math.abs(option.angle[dir]-dir*90)>10){
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
				d3 = Math.sqrt(pt3[0]*pt3[0]+pt3[1]*pt3[1]);
				theta1 = Math.atan(pt3[1]/pt3[0])/Math.PI*180;
				theta2 = Math.abs(theta1)-(option.angle[dir]-dir*90);
				pt3[0] = d3*Math.cos(theta2*Math.PI/180);
				pt3[1] = -d3*Math.sin(theta2*Math.PI/180);

				let pt4 = [option.median[option.lastDir[dir]]*option.median_width[option.lastDir[dir]]/2+option.exit_road_total_width[dir]+option.safe_island[dir]*option.safe_island_width[dir], option.median[dir]*(option.median_width[dir]/2)+ option.entry_total_width[dir] ];
				d4 = Math.sqrt(pt4[0]*pt4[0]+pt4[1]*pt4[1]);
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
				
				pt8 = [Math.min(Math.abs(pt6[0]), Math.abs(pt7[0])) + Math.abs(pt6[0]-pt7[0])/5, -Math.min(Math.abs(pt6[1]), Math.abs(pt7[1])) - Math.abs(pt6[1]-pt7[1])/5]
			
				let path_data = [[...pt5, ...pt6, ...pt8, ...pt7].map((e)=>e*option.scale)];
				
				if(option.safe_island[dir] === 1){
					let path = "M " + path_data[0] + " " + path_data[1] + " L " + path_data[2] + " " + path_data[3] + " Q" + path_data[4] + " " + path_data[5] + " " + path_data[6] + " " + path_data[7] + " Z";
					this.paths.push([path, option.COLOR_WHITE, option.lineWidth, option.COLOR_GREEN, "translate(" + option.width / 2 + "," + option.height / 2 + "),rotate(" + 0 + ")"])
				}
			
			}else if(dir==1 && Math.abs(option.angle[dir]-dir*90)>10){
				
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
				d3 = Math.sqrt(pt3[0]*pt3[0]+pt3[1]*pt3[1]);
				theta1 = Math.atan(pt3[1]/pt3[0])/Math.PI*180;
				theta2 = Math.abs(theta1)-(option.angle[dir]-dir*90);
				pt3[0] = d3*Math.cos(theta2*Math.PI/180);
				pt3[1] = d3*Math.sin(theta2*Math.PI/180);

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
					this.paths.push([path, option.COLOR_WHITE, option.lineWidth, option.COLOR_GREEN, "translate(" + option.width / 2 + "," + option.height / 2 + "),rotate(" + 0 + ")"])
				}
				
			}else if(dir==2 && Math.abs(option.angle[dir]-dir*90)>10){
			
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
				d3 = Math.sqrt(pt3[0]*pt3[0]+pt3[1]*pt3[1]);
				theta1 = Math.atan(pt3[1]/pt3[0])/Math.PI*180;
				theta2 = Math.abs(theta1)-(option.angle[dir]-dir*90);
				pt3[0] = -d3*Math.cos(theta2*Math.PI/180);
				pt3[1] = d3*Math.sin(theta2*Math.PI/180);
				
				let pt4 = [option.median[option.lastDir[dir]]*option.median_width[option.lastDir[dir]]/2+option.exit_road_total_width[dir]+option.safe_island[dir]*option.safe_island_width[dir], option.median[dir]*(option.median_width[dir]/2)+ option.entry_total_width[dir]];
				d4 = Math.sqrt(pt4[0]*pt4[0]+pt4[1]*pt4[1]);
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
				
				pt8 = [-Math.min(Math.abs(pt6[0]), Math.abs(pt7[0])) - Math.abs(pt6[0]-pt7[0])/5, Math.min(Math.abs(pt6[1]), Math.abs(pt7[1])) + Math.abs(pt6[1]-pt7[1])/5]

				let path_data = [[...pt5, ...pt6, ...pt8, ...pt7].map((e)=>e*option.scale)];
				
				if(option.safe_island[dir] === 1){
					let path = "M " + path_data[0] + " " + path_data[1] + " L " + path_data[2] + " " + path_data[3] + " Q" + path_data[4] + " " + path_data[5] + " " + path_data[6] + " " + path_data[7] + " Z";
					this.paths.push([path, option.COLOR_WHITE, option.lineWidth, option.COLOR_GREEN, "translate(" + option.width / 2 + "," + option.height / 2 + "),rotate(" + 0 + ")"])
				}
				
			}else if(dir == 3 && Math.abs(option.angle[dir]-dir*90)>10){
			
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
				d3 = Math.sqrt(pt3[0]*pt3[0]+pt3[1]*pt3[1]);
				theta1 = Math.atan(pt3[1]/pt3[0])/Math.PI*180;
				theta2 = Math.abs(theta1)-(option.angle[dir]-dir*90);
				pt3[0] = -d3*Math.cos(theta2*Math.PI/180);
				pt3[1] = -d3*Math.sin(theta2*Math.PI/180);

				let pt4 = [option.median[option.lastDir[dir]]*option.median_width[option.lastDir[dir]]/2+option.exit_road_total_width[dir]+option.safe_island[dir]*option.safe_island_width[dir], option.median[dir]*(option.median_width[dir]/2)+ option.entry_total_width[dir]];
				d4 = Math.sqrt(pt4[0]*pt4[0]+pt4[1]*pt4[1]);
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
				
				pt8 = [-Math.min(Math.abs(pt6[0]), Math.abs(pt7[0])) - Math.abs(pt6[0]-pt7[0])/5, -Math.min(Math.abs(pt6[1]), Math.abs(pt7[1])) - Math.abs(pt6[1]-pt7[1])/5]

				let safe_island_path = [[...pt5, ...pt6, ...pt8, ...pt7].map((e)=>e*option.scale)];
				
				if(option.safe_island[dir] === 1){
					let path = "M " + path_data[0] + " " + path_data[1] + " L " + path_data[2] + " " + path_data[3] + " Q" + path_data[4] + " " + path_data[5] + " " + path_data[6] + " " + path_data[7] + " Z";
					this.paths.push([path, option.COLOR_WHITE, option.lineWidth, option.COLOR_GREEN, "translate(" + option.width / 2 + "," + option.height / 2 + "),rotate(" + 0 + ")"])
				}
				
			}else{
				let pt1 = [option.median[option.lastDir[dir]] * option.median_width[option.lastDir[dir]]/2 + option.exit_road_total_width[option.lastDir[dir]], -option.median[dir]*option.median_width[dir]/2-option.entry_road_total_width[dir]];
				let pt2 = [option.median[option.lastDir[dir]] * option.median_width[option.lastDir[dir]]/2 + option.exit_road_total_width[option.lastDir[dir]] + option.safe_island_width[dir], -option.median[dir]*option.median_width[dir]/2-option.entry_road_total_width[dir]];
				let pt3 = [option.median[option.lastDir[dir]] * option.median_width[option.lastDir[dir]]/2 + option.exit_road_total_width[option.lastDir[dir]] + option.safe_island_width[dir]/5, -option.median[dir]*option.median_width[dir]/2-option.entry_road_total_width[dir] - option.safe_island_width[dir]/5];
				let pt4 = [option.median[option.lastDir[dir]] * option.median_width[option.lastDir[dir]]/2 + option.exit_road_total_width[option.lastDir[dir]], -option.median[dir]*option.median_width[dir]/2-option.entry_road_total_width[dir] - option.safe_island_width[dir]];
				
				let path_data = [...pt1, ...pt2, ...pt3, ...pt4].map((e)=>e*option.scale);

				if(option.safe_island[dir] === 1){
					let path = "M " + path_data[0] + " " + path_data[1] + " L " + path_data[2] + " " + path_data[3] + " Q" + path_data[4] + " " + path_data[5] + " " + path_data[6] + " " + path_data[7] + " Z";
					this.paths.push([path, option.COLOR_WHITE, option.lineWidth, option.COLOR_GREEN, "translate(" + option.width / 2 + "," + option.height / 2 + "),rotate(" + option.angle[dir] + ")"]);
				}
			}
			console.log(this.paths);
			
		}
	}

	// 进口导向箭头
	draw_cross_import_arrow = () => {
		let option = this.option;
		// 导向箭头
		for(let dir = 0; dir < option.angle.length; dir++){
			let lane_dir = option.lane_dir[dir].split(",");
			for(let lane_index = 0; lane_index < option.entry_main_num[dir]+option.entry_expand_num[dir]; lane_index++){
				let pt1 = [option.stopline_to_center[dir] + option.arrow2stopline[dir], -option.median[dir]*(option.median_width[dir]/2-option.median_shrink_flag[dir]*option.median_shrink_width[dir])+option.median_line_offset[dir]*option.median_line_offset_width[dir]-(option.median[dir]*option.median_shrink_flag[dir]*option.median_shrink_width[dir]+option.median_line_offset[dir]*option.median_line_offset_width[dir]+option.entry_main_num[dir]*option.entry_main_width[dir])/(option.entry_main_num[dir]+option.entry_expand_num[dir])*(lane_index+0.5)];
				let pt2 = [option.stopline_to_center[dir] + option.arrow2stopline[dir], -option.median[dir]*(option.median_width[dir]/2-option.median_shrink_flag[dir]*option.median_shrink_width[dir])+option.median_line_offset[dir]*option.median_line_offset_width[dir]-(option.median[dir]*option.median_shrink_flag[dir]*option.median_shrink_width[dir]+option.median_line_offset[dir]*option.median_line_offset_width[dir]+option.entry_main_num[dir]*option.entry_main_width[dir])/(option.entry_main_num[dir]+option.entry_expand_num[dir])*(lane_index+0.5)];
				let path_data = [...pt1, ...pt2].map((e)=> e * option.scale);
				if(lane_dir[lane_index]== "L"){
					this.lines_arrow.push([...path_data, option.COLOR_WHITE, option.lineWidth, option.dashArraySolid, option.dashOffsetNone, "translate(" + option.width / 2 + ", " + option.height / 2 + "),rotate(" + option.angle[dir] + ")", "url(#left_arrow)", ""]);
				}else if(lane_dir[lane_index]== "R"){
					this.lines_arrow.push([...path_data, option.COLOR_WHITE, option.lineWidth, option.dashArraySolid, option.dashOffsetNone, "translate(" + option.width / 2 + ", " + option.height / 2 + "),rotate(" + option.angle[dir] + ")", "url(#right_arrow)", ""]);
				}else if(lane_dir[lane_index]== "T"){
					this.lines_arrow.push([...path_data, option.COLOR_WHITE, option.lineWidth, option.dashArraySolid, option.dashOffsetNone, "translate(" + option.width / 2 + ", " + option.height / 2 + "),rotate(" + option.angle[dir] + ")", "url(#th_arrow)", ""]);
				}else if(lane_dir[lane_index]== "TL"){
					this.lines_arrow.push([...path_data, option.COLOR_WHITE, option.lineWidth, option.dashArraySolid, option.dashOffsetNone, "translate(" + option.width / 2 + ", " + option.height / 2 + "),rotate(" + option.angle[dir] + ")", "url(#th_left_arrow)", ""]);
				}else{
					this.lines_arrow.push([...path_data, option.COLOR_WHITE, option.lineWidth, option.dashArraySolid, option.dashOffsetNone, "translate(" + option.width / 2 + ", " + option.height / 2 + "),rotate(" + option.angle[dir] + ")", "url(#th_right_arrow)", ""]);
				}
			}

			let pt1 = [option.stopline_to_center[dir] - option.arrow2stopline[dir], -option.median[dir]*(option.median_width[dir]/2-option.median_shrink_flag[dir]*option.median_shrink_width[dir])+option.median_line_offset[dir]*option.median_line_offset_width[dir]-(option.median[dir]*option.median_shrink_flag[dir]*option.median_shrink_width[dir]+option.median_line_offset[dir]*option.median_line_offset_width[dir]+option.entry_main_num[dir]*option.entry_main_width[dir])/2];
			let pt2 = [option.stopline_to_center[dir] - option.arrow2stopline[dir], -option.median[dir]*(option.median_width[dir]/2-option.median_shrink_flag[dir]*option.median_shrink_width[dir])+option.median_line_offset[dir]*option.median_line_offset_width[dir]-(option.median[dir]*option.median_shrink_flag[dir]*option.median_shrink_width[dir]+option.median_line_offset[dir]*option.median_line_offset_width[dir]+option.entry_main_num[dir]*option.entry_main_width[dir])/2];
			let path_data = [...pt1, ...pt2].map((e)=> e * option.scale);
			this.lines_arrow.push([...path_data, option.COLOR_WHITE, option.lineWidth, option.dashArraySolid, option.dashOffsetNone, "translate(" + option.width / 2 + ", " + option.height / 2 + "),rotate(" + option.angle[dir] + ")", "url(#camera2)", ""]);
		}
	}
	// 路名
	draw_cross_roadname = () => {
		let option = this.option;
		// 道路名称
		for (let dir = 0; dir < option.angle.length; dir++) {
			if(option.road_name_flag[dir] !== 0){
				if(dir === 0 || dir === 2){
					let path_data = [option.stopline_to_center[dir]+option.channelized_length[dir]+option.gradual_length[dir],option.exit_total_width[dir]+2*option.scale].map(e=>e*option.scale);
					this.texts.push([...path_data, option.roadName[dir], option.COLOR_CYAN, "" + option.layoutFontSize * option.scale, "translate(" + option.width / 2 + ", " + option.height / 2 + "),rotate(" + option.angle[dir] + ")"]);
				}else{
					let path_data = [option.stopline_to_center[dir]+option.channelized_length[dir]+option.gradual_length[dir], -option.exit_total_width[dir]-1*option.scale].map(e=>e*option.scale);
					this.texts.push([...path_data, option.roadName[dir], option.COLOR_CYAN, "" + option.layoutFontSize * option.scale, "translate(" + option.width / 2 + ", " + option.height / 2 + "),rotate(" + option.angle[dir] + ")"]);
				}

			}
		}
	}

	draw = () => {
		// data = {t_lines: t_lines, t_lines_arrow:t_lines_arrow,t_paths:t_paths};
		/*
		let t_lines = [{"x1":106.875,"x2":106.875,"y1":-71.25,"y2":42.75,"stroke":"#fff","strokeWidth":23,"dashArray":"3,3","dashOffset":3,"offsetx":700.0,"offsety":450.0,"rotate":0.0},{"x1":106.875,"x2":106.875,"y1":-57.0,"y2":42.75,"stroke":"#fff","strokeWidth":23,"dashArray":"3,3","dashOffset":3,"offsetx":700.0,"offsety":450.0,"rotate":270.0},{"x1":106.875,"x2":106.875,"y1":-71.25,"y2":42.75,"stroke":"#fff","strokeWidth":23,"dashArray":"3,3","dashOffset":3,"offsetx":700.0,"offsety":450.0,"rotate":180.0},{"x1":106.875,"x2":106.875,"y1":-57.0,"y2":42.75,"stroke":"#fff","strokeWidth":23,"dashArray":"3,3","dashOffset":3,"offsetx":700.0,"offsety":450.0,"rotate":90.0},{"x1":123.5,"x2":123.5,"y1":-71.25,"y2":0.0,"stroke":"#fff","strokeWidth":2,"dashArray":"","dashOffset":0,"offsetx":700.0,"offsety":450.0,"rotate":0.0},{"x1":123.5,"x2":123.5,"y1":-57.0,"y2":0.0,"stroke":"#fff","strokeWidth":2,"dashArray":"","dashOffset":0,"offsetx":700.0,"offsety":450.0,"rotate":270.0},{"x1":123.5,"x2":123.5,"y1":-71.25,"y2":0.0,"stroke":"#fff","strokeWidth":2,"dashArray":"","dashOffset":0,"offsetx":700.0,"offsety":450.0,"rotate":180.0},{"x1":123.5,"x2":123.5,"y1":-57.0,"y2":0.0,"stroke":"#fff","strokeWidth":2,"dashArray":"","dashOffset":0,"offsetx":700.0,"offsety":450.0,"rotate":90.0},{"x1":123.5,"x2":218.5,"y1":-14.25,"y2":-14.25,"stroke":"#fff","strokeWidth":1,"dashArray":"","dashOffset":0,"offsetx":700.0,"offsety":450.0,"rotate":0.0},{"x1":123.5,"x2":218.5,"y1":-28.5,"y2":-28.5,"stroke":"#fff","strokeWidth":1,"dashArray":"","dashOffset":0,"offsetx":700.0,"offsety":450.0,"rotate":0.0},{"x1":123.5,"x2":218.5,"y1":-42.75,"y2":-42.75,"stroke":"#fff","strokeWidth":1,"dashArray":"","dashOffset":0,"offsetx":700.0,"offsety":450.0,"rotate":0.0},{"x1":123.5,"x2":218.5,"y1":-57.0,"y2":-57.0,"stroke":"#fff","strokeWidth":1,"dashArray":"","dashOffset":0,"offsetx":700.0,"offsety":450.0,"rotate":0.0},{"x1":123.5,"x2":218.5,"y1":-14.25,"y2":-14.25,"stroke":"#fff","strokeWidth":1,"dashArray":"","dashOffset":0,"offsetx":700.0,"offsety":450.0,"rotate":270.0},{"x1":123.5,"x2":218.5,"y1":-28.5,"y2":-28.5,"stroke":"#fff","strokeWidth":1,"dashArray":"","dashOffset":0,"offsetx":700.0,"offsety":450.0,"rotate":270.0},{"x1":123.5,"x2":218.5,"y1":-42.75,"y2":-42.75,"stroke":"#fff","strokeWidth":1,"dashArray":"","dashOffset":0,"offsetx":700.0,"offsety":450.0,"rotate":270.0},{"x1":123.5,"x2":218.5,"y1":-14.25,"y2":-14.25,"stroke":"#fff","strokeWidth":1,"dashArray":"","dashOffset":0,"offsetx":700.0,"offsety":450.0,"rotate":180.0},{"x1":123.5,"x2":218.5,"y1":-28.5,"y2":-28.5,"stroke":"#fff","strokeWidth":1,"dashArray":"","dashOffset":0,"offsetx":700.0,"offsety":450.0,"rotate":180.0},{"x1":123.5,"x2":218.5,"y1":-42.75,"y2":-42.75,"stroke":"#fff","strokeWidth":1,"dashArray":"","dashOffset":0,"offsetx":700.0,"offsety":450.0,"rotate":180.0},{"x1":123.5,"x2":218.5,"y1":-57.0,"y2":-57.0,"stroke":"#fff","strokeWidth":1,"dashArray":"","dashOffset":0,"offsetx":700.0,"offsety":450.0,"rotate":180.0},{"x1":123.5,"x2":218.5,"y1":-14.25,"y2":-14.25,"stroke":"#fff","strokeWidth":1,"dashArray":"","dashOffset":0,"offsetx":700.0,"offsety":450.0,"rotate":90.0},{"x1":123.5,"x2":218.5,"y1":-28.5,"y2":-28.5,"stroke":"#fff","strokeWidth":1,"dashArray":"","dashOffset":0,"offsetx":700.0,"offsety":450.0,"rotate":90.0},{"x1":123.5,"x2":218.5,"y1":-42.75,"y2":-42.75,"stroke":"#fff","strokeWidth":1,"dashArray":"","dashOffset":0,"offsetx":700.0,"offsety":450.0,"rotate":90.0},{"x1":218.5,"x2":249.84999,"y1":-14.25,"y2":-14.25,"stroke":"#fff","strokeWidth":1,"dashArray":"5,5","dashOffset":3,"offsetx":700.0,"offsety":450.0,"rotate":0.0},{"x1":218.5,"x2":249.84999,"y1":-28.5,"y2":-28.5,"stroke":"#fff","strokeWidth":1,"dashArray":"5,5","dashOffset":3,"offsetx":700.0,"offsety":450.0,"rotate":0.0},{"x1":218.5,"x2":249.84999,"y1":-42.75,"y2":-42.75,"stroke":"#fff","strokeWidth":1,"dashArray":"5,5","dashOffset":3,"offsetx":700.0,"offsety":450.0,"rotate":0.0},{"x1":218.5,"x2":249.84999,"y1":-57.0,"y2":-57.0,"stroke":"#fff","strokeWidth":1,"dashArray":"5,5","dashOffset":3,"offsetx":700.0,"offsety":450.0,"rotate":0.0},{"x1":218.5,"x2":249.84999,"y1":-14.25,"y2":-14.25,"stroke":"#fff","strokeWidth":1,"dashArray":"5,5","dashOffset":3,"offsetx":700.0,"offsety":450.0,"rotate":270.0},{"x1":218.5,"x2":249.84999,"y1":-28.5,"y2":-28.5,"stroke":"#fff","strokeWidth":1,"dashArray":"5,5","dashOffset":3,"offsetx":700.0,"offsety":450.0,"rotate":270.0},{"x1":218.5,"x2":249.84999,"y1":-42.75,"y2":-42.75,"stroke":"#fff","strokeWidth":1,"dashArray":"5,5","dashOffset":3,"offsetx":700.0,"offsety":450.0,"rotate":270.0},{"x1":218.5,"x2":249.84999,"y1":-14.25,"y2":-14.25,"stroke":"#fff","strokeWidth":1,"dashArray":"5,5","dashOffset":3,"offsetx":700.0,"offsety":450.0,"rotate":180.0},{"x1":218.5,"x2":249.84999,"y1":-28.5,"y2":-28.5,"stroke":"#fff","strokeWidth":1,"dashArray":"5,5","dashOffset":3,"offsetx":700.0,"offsety":450.0,"rotate":180.0},{"x1":218.5,"x2":249.84999,"y1":-42.75,"y2":-42.75,"stroke":"#fff","strokeWidth":1,"dashArray":"5,5","dashOffset":3,"offsetx":700.0,"offsety":450.0,"rotate":180.0},{"x1":218.5,"x2":249.84999,"y1":-57.0,"y2":-57.0,"stroke":"#fff","strokeWidth":1,"dashArray":"5,5","dashOffset":3,"offsetx":700.0,"offsety":450.0,"rotate":180.0},{"x1":218.5,"x2":249.84999,"y1":-14.25,"y2":-14.25,"stroke":"#fff","strokeWidth":1,"dashArray":"5,5","dashOffset":3,"offsetx":700.0,"offsety":450.0,"rotate":90.0},{"x1":218.5,"x2":249.84999,"y1":-28.5,"y2":-28.5,"stroke":"#fff","strokeWidth":1,"dashArray":"5,5","dashOffset":3,"offsetx":700.0,"offsety":450.0,"rotate":90.0},{"x1":218.5,"x2":249.84999,"y1":-42.75,"y2":-42.75,"stroke":"#fff","strokeWidth":1,"dashArray":"5,5","dashOffset":3,"offsetx":700.0,"offsety":450.0,"rotate":90.0},{"x1":266.0,"x2":408.5,"y1":-14.25,"y2":-14.25,"stroke":"#fff","strokeWidth":1,"dashArray":"5,5","dashOffset":3,"offsetx":700.0,"offsety":450.0,"rotate":0.0},{"x1":266.0,"x2":408.5,"y1":-28.5,"y2":-28.5,"stroke":"#fff","strokeWidth":1,"dashArray":"5,5","dashOffset":3,"offsetx":700.0,"offsety":450.0,"rotate":0.0},{"x1":266.0,"x2":408.5,"y1":-42.75,"y2":-42.75,"stroke":"#fff","strokeWidth":1,"dashArray":"5,5","dashOffset":3,"offsetx":700.0,"offsety":450.0,"rotate":0.0},{"x1":266.0,"x2":408.5,"y1":-57.0,"y2":-57.0,"stroke":"#fff","strokeWidth":1,"dashArray":"5,5","dashOffset":3,"offsetx":700.0,"offsety":450.0,"rotate":0.0},{"x1":266.0,"x2":408.5,"y1":-14.25,"y2":-14.25,"stroke":"#fff","strokeWidth":1,"dashArray":"5,5","dashOffset":3,"offsetx":700.0,"offsety":450.0,"rotate":270.0},{"x1":266.0,"x2":408.5,"y1":-28.5,"y2":-28.5,"stroke":"#fff","strokeWidth":1,"dashArray":"5,5","dashOffset":3,"offsetx":700.0,"offsety":450.0,"rotate":270.0},{"x1":266.0,"x2":408.5,"y1":-42.75,"y2":-42.75,"stroke":"#fff","strokeWidth":1,"dashArray":"5,5","dashOffset":3,"offsetx":700.0,"offsety":450.0,"rotate":270.0},{"x1":266.0,"x2":408.5,"y1":-14.25,"y2":-14.25,"stroke":"#fff","strokeWidth":1,"dashArray":"5,5","dashOffset":3,"offsetx":700.0,"offsety":450.0,"rotate":180.0},{"x1":266.0,"x2":408.5,"y1":-28.5,"y2":-28.5,"stroke":"#fff","strokeWidth":1,"dashArray":"5,5","dashOffset":3,"offsetx":700.0,"offsety":450.0,"rotate":180.0},{"x1":266.0,"x2":408.5,"y1":-42.75,"y2":-42.75,"stroke":"#fff","strokeWidth":1,"dashArray":"5,5","dashOffset":3,"offsetx":700.0,"offsety":450.0,"rotate":180.0},{"x1":266.0,"x2":408.5,"y1":-57.0,"y2":-57.0,"stroke":"#fff","strokeWidth":1,"dashArray":"5,5","dashOffset":3,"offsetx":700.0,"offsety":450.0,"rotate":180.0},{"x1":266.0,"x2":408.5,"y1":-14.25,"y2":-14.25,"stroke":"#fff","strokeWidth":1,"dashArray":"5,5","dashOffset":3,"offsetx":700.0,"offsety":450.0,"rotate":90.0},{"x1":266.0,"x2":408.5,"y1":-28.5,"y2":-28.5,"stroke":"#fff","strokeWidth":1,"dashArray":"5,5","dashOffset":3,"offsetx":700.0,"offsety":450.0,"rotate":90.0},{"x1":266.0,"x2":408.5,"y1":-42.75,"y2":-42.75,"stroke":"#fff","strokeWidth":1,"dashArray":"5,5","dashOffset":3,"offsetx":700.0,"offsety":450.0,"rotate":90.0},{"x1":123.5,"x2":218.5,"y1":14.25,"y2":14.25,"stroke":"#fff","strokeWidth":1,"dashArray":"5,5","dashOffset":3,"offsetx":700.0,"offsety":450.0,"rotate":0.0},{"x1":218.5,"x2":266.0,"y1":14.25,"y2":14.25,"stroke":"#fff","strokeWidth":1,"dashArray":"5,5","dashOffset":3,"offsetx":700.0,"offsety":450.0,"rotate":0.0},{"x1":266.0,"x2":408.5,"y1":14.25,"y2":14.25,"stroke":"#fff","strokeWidth":1,"dashArray":"5,5","dashOffset":3,"offsetx":700.0,"offsety":450.0,"rotate":0.0},{"x1":123.5,"x2":218.5,"y1":28.5,"y2":28.5,"stroke":"#fff","strokeWidth":1,"dashArray":"5,5","dashOffset":3,"offsetx":700.0,"offsety":450.0,"rotate":0.0},{"x1":218.5,"x2":266.0,"y1":28.5,"y2":28.5,"stroke":"#fff","strokeWidth":1,"dashArray":"5,5","dashOffset":3,"offsetx":700.0,"offsety":450.0,"rotate":0.0},{"x1":266.0,"x2":408.5,"y1":28.5,"y2":28.5,"stroke":"#fff","strokeWidth":1,"dashArray":"5,5","dashOffset":3,"offsetx":700.0,"offsety":450.0,"rotate":0.0},{"x1":123.5,"x2":218.5,"y1":14.25,"y2":14.25,"stroke":"#fff","strokeWidth":1,"dashArray":"5,5","dashOffset":3,"offsetx":700.0,"offsety":450.0,"rotate":270.0},{"x1":218.5,"x2":266.0,"y1":14.25,"y2":14.25,"stroke":"#fff","strokeWidth":1,"dashArray":"5,5","dashOffset":3,"offsetx":700.0,"offsety":450.0,"rotate":270.0},{"x1":266.0,"x2":408.5,"y1":14.25,"y2":14.25,"stroke":"#fff","strokeWidth":1,"dashArray":"5,5","dashOffset":3,"offsetx":700.0,"offsety":450.0,"rotate":270.0},{"x1":123.5,"x2":218.5,"y1":28.5,"y2":28.5,"stroke":"#fff","strokeWidth":1,"dashArray":"5,5","dashOffset":3,"offsetx":700.0,"offsety":450.0,"rotate":270.0},{"x1":218.5,"x2":266.0,"y1":28.5,"y2":28.5,"stroke":"#fff","strokeWidth":1,"dashArray":"5,5","dashOffset":3,"offsetx":700.0,"offsety":450.0,"rotate":270.0},{"x1":266.0,"x2":408.5,"y1":28.5,"y2":28.5,"stroke":"#fff","strokeWidth":1,"dashArray":"5,5","dashOffset":3,"offsetx":700.0,"offsety":450.0,"rotate":270.0},
		{"x1":123.5,"x2":218.5,"y1":14.25,"y2":14.25,"stroke":"#fff","strokeWidth":1,"dashArray":"5,5","dashOffset":3,"offsetx":700.0,"offsety":450.0,"rotate":180.0},{"x1":218.5,"x2":266.0,"y1":14.25,"y2":14.25,"stroke":"#fff","strokeWidth":1,"dashArray":"5,5","dashOffset":3,"offsetx":700.0,"offsety":450.0,"rotate":180.0},{"x1":266.0,"x2":408.5,"y1":14.25,"y2":14.25,"stroke":"#fff","strokeWidth":1,"dashArray":"5,5","dashOffset":3,"offsetx":700.0,"offsety":450.0,"rotate":180.0},{"x1":123.5,"x2":218.5,"y1":28.5,"y2":28.5,"stroke":"#fff","strokeWidth":1,"dashArray":"5,5","dashOffset":3,"offsetx":700.0,"offsety":450.0,"rotate":180.0},{"x1":218.5,"x2":266.0,"y1":28.5,"y2":28.5,"stroke":"#fff","strokeWidth":1,"dashArray":"5,5","dashOffset":3,"offsetx":700.0,"offsety":450.0,"rotate":180.0},{"x1":266.0,"x2":408.5,"y1":28.5,"y2":28.5,"stroke":"#fff","strokeWidth":1,"dashArray":"5,5","dashOffset":3,"offsetx":700.0,"offsety":450.0,"rotate":180.0},{"x1":123.5,"x2":218.5,"y1":14.25,"y2":14.25,"stroke":"#fff","strokeWidth":1,"dashArray":"5,5","dashOffset":3,"offsetx":700.0,"offsety":450.0,"rotate":90.0},{"x1":218.5,"x2":266.0,"y1":14.25,"y2":14.25,"stroke":"#fff","strokeWidth":1,"dashArray":"5,5","dashOffset":3,"offsetx":700.0,"offsety":450.0,"rotate":90.0},{"x1":266.0,"x2":408.5,"y1":14.25,"y2":14.25,"stroke":"#fff","strokeWidth":1,"dashArray":"5,5","dashOffset":3,"offsetx":700.0,"offsety":450.0,"rotate":90.0},{"x1":123.5,"x2":218.5,"y1":28.5,"y2":28.5,"stroke":"#fff","strokeWidth":1,"dashArray":"5,5","dashOffset":3,"offsetx":700.0,"offsety":450.0,"rotate":90.0},{"x1":218.5,"x2":266.0,"y1":28.5,"y2":28.5,"stroke":"#fff","strokeWidth":1,"dashArray":"5,5","dashOffset":3,"offsetx":700.0,"offsety":450.0,"rotate":90.0},{"x1":266.0,"x2":408.5,"y1":28.5,"y2":28.5,"stroke":"#fff","strokeWidth":1,"dashArray":"5,5","dashOffset":3,"offsetx":700.0,"offsety":450.0,"rotate":90.0}]
		let t_lines_arrow = [{"x1":128.25,"y1":-7.125,"x2":128.25,"y2":-7.125,"stroke":"#fff","strokeWidth":1,"dashArray":"","dashOffset":0,"offsetx":700.0,"offsety":450.0,"rotate":0.0,"markerStart":"url(#left_arrow)","markerEnd":""},{"x1":128.25,"y1":-21.375,"x2":128.25,"y2":-21.375,"stroke":"#fff","strokeWidth":1,"dashArray":"","dashOffset":0,"offsetx":700.0,"offsety":450.0,"rotate":0.0,"markerStart":"url(#left_arrow)","markerEnd":""},{"x1":128.25,"y1":-35.625,"x2":128.25,"y2":-35.625,"stroke":"#fff","strokeWidth":1,"dashArray":"","dashOffset":0,"offsetx":700.0,"offsety":450.0,"rotate":0.0,"markerStart":"url(#left_arrow)","markerEnd":""},{"x1":128.25,"y1":-49.875,"x2":128.25,"y2":-49.875,"stroke":"#fff","strokeWidth":1,"dashArray":"","dashOffset":0,"offsetx":700.0,"offsety":450.0,"rotate":0.0,"markerStart":"url(#left_arrow)","markerEnd":""},{"x1":128.25,"y1":-64.125,"x2":128.25,"y2":-64.125,"stroke":"#fff","strokeWidth":1,"dashArray":"","dashOffset":0,"offsetx":700.0,"offsety":450.0,"rotate":0.0,"markerStart":"url(#left_arrow)","markerEnd":""},{"x1":128.25,"y1":-7.125,"x2":128.25,"y2":-7.125,"stroke":"#fff","strokeWidth":1,"dashArray":"","dashOffset":0,"offsetx":700.0,"offsety":450.0,"rotate":90.0,"markerStart":"url(#left_arrow)","markerEnd":""},{"x1":128.25,"y1":-21.375,"x2":128.25,"y2":-21.375,"stroke":"#fff","strokeWidth":1,"dashArray":"","dashOffset":0,"offsetx":700.0,"offsety":450.0,"rotate":90.0,"markerStart":"url(#left_arrow)","markerEnd":""},{"x1":128.25,"y1":-35.625,"x2":128.25,"y2":-35.625,"stroke":"#fff","strokeWidth":1,"dashArray":"","dashOffset":0,"offsetx":700.0,"offsety":450.0,"rotate":90.0,"markerStart":"url(#left_arrow)","markerEnd":""},{"x1":128.25,"y1":-49.875,"x2":128.25,"y2":-49.875,"stroke":"#fff","strokeWidth":1,"dashArray":"","dashOffset":0,"offsetx":700.0,"offsety":450.0,"rotate":90.0,"markerStart":"url(#left_arrow)","markerEnd":""},{"x1":128.25,"y1":-7.125,"x2":128.25,"y2":-7.125,"stroke":"#fff","strokeWidth":1,"dashArray":"","dashOffset":0,"offsetx":700.0,"offsety":450.0,"rotate":180.0,"markerStart":"url(#left_arrow)","markerEnd":""},{"x1":128.25,"y1":-21.375,"x2":128.25,"y2":-21.375,"stroke":"#fff","strokeWidth":1,"dashArray":"","dashOffset":0,"offsetx":700.0,"offsety":450.0,"rotate":180.0,"markerStart":"url(#left_arrow)","markerEnd":""},{"x1":128.25,"y1":-35.625,"x2":128.25,"y2":-35.625,"stroke":"#fff","strokeWidth":1,"dashArray":"","dashOffset":0,"offsetx":700.0,"offsety":450.0,"rotate":180.0,"markerStart":"url(#left_arrow)","markerEnd":""},{"x1":128.25,"y1":-49.875,"x2":128.25,"y2":-49.875,"stroke":"#fff","strokeWidth":1,"dashArray":"","dashOffset":0,"offsetx":700.0,"offsety":450.0,"rotate":180.0,"markerStart":"url(#left_arrow)","markerEnd":""},{"x1":128.25,"y1":-64.125,"x2":128.25,"y2":-64.125,"stroke":"#fff","strokeWidth":1,"dashArray":"","dashOffset":0,"offsetx":700.0,"offsety":450.0,"rotate":180.0,"markerStart":"url(#left_arrow)","markerEnd":""},{"x1":128.25,"y1":-7.125,"x2":128.25,"y2":-7.125,"stroke":"#fff","strokeWidth":1,"dashArray":"","dashOffset":0,"offsetx":700.0,"offsety":450.0,"rotate":270.0,"markerStart":"url(#left_arrow)","markerEnd":""},{"x1":128.25,"y1":-21.375,"x2":128.25,"y2":-21.375,"stroke":"#fff","strokeWidth":1,"dashArray":"","dashOffset":0,"offsetx":700.0,"offsety":450.0,"rotate":270.0,"markerStart":"url(#left_arrow)","markerEnd":""},{"x1":128.25,"y1":-35.625,"x2":128.25,"y2":-35.625,"stroke":"#fff","strokeWidth":1,"dashArray":"","dashOffset":0,"offsetx":700.0,"offsety":450.0,"rotate":270.0,"markerStart":"url(#left_arrow)","markerEnd":""},{"x1":128.25,"y1":-49.875,"x2":128.25,"y2":-49.875,"stroke":"#fff","strokeWidth":1,"dashArray":"","dashOffset":0,"offsetx":700.0,"offsety":450.0,"rotate":270.0,"markerStart":"url(#left_arrow)","markerEnd":""}]
		let t_paths = [{"path":"M 123.5 -1.0 L 218.5 -1.0 L 266.0 -1.0 L 408.5 -1.0 M 123.5 1.0 L 218.5 1.0 L 266.0 1.0 L 408.5 1.0","stroke":"#ff0","strokeWidth":1,"fill":"#ff0","offsetx":700.0,"offsety":450.0,"rotate":0.0},{"path":"M 123.5 -1.0 L 218.5 -1.0 L 266.0 -1.0 L 408.5 -1.0 M 123.5 1.0 L 218.5 1.0 L 266.0 1.0 L 408.5 1.0","stroke":"#ff0","strokeWidth":1,"fill":"#ff0","offsetx":700.0,"offsety":450.0,"rotate":90.0},{"path":"M 123.5 -1.0 L 218.5 -1.0 L 266.0 -1.0 L 408.5 -1.0 M 123.5 1.0 L 218.5 1.0 L 266.0 1.0 L 408.5 1.0","stroke":"#ff0","strokeWidth":1,"fill":"#ff0","offsetx":700.0,"offsety":450.0,"rotate":180.0},{"path":"M 123.5 -1.0 L 218.5 -1.0 L 266.0 -1.0 L 408.5 -1.0 M 123.5 1.0 L 218.5 1.0 L 266.0 1.0 L 408.5 1.0","stroke":"#ff0","strokeWidth":1,"fill":"#ff0","offsetx":700.0,"offsety":450.0,"rotate":270.0},{"path":"M 99.75 -71.25 L 218.5 -71.25 L 266.0 -71.25 L 408.5 -71.25","stroke":"#000","strokeWidth":2,"fill":"#0000","offsetx":700.0,"offsety":450.0,"rotate":0.0},{"path":"M 99.75 -57.0 L 218.5 -57.0 L 266.0 -57.0 L 408.5 -57.0","stroke":"#000","strokeWidth":2,"fill":"#0000","offsetx":700.0,"offsety":450.0,"rotate":90.0},{"path":"M 99.75 -71.25 L 218.5 -71.25 L 266.0 -71.25 L 408.5 -71.25","stroke":"#000","strokeWidth":2,"fill":"#0000","offsetx":700.0,"offsety":450.0,"rotate":180.0},{"path":"M 99.75 -57.0 L 218.5 -57.0 L 266.0 -57.0 L 408.5 -57.0","stroke":"#000","strokeWidth":2,"fill":"#0000","offsetx":700.0,"offsety":450.0,"rotate":270.0},{"path":"M 99.75 42.75 L 408.5 42.75","stroke":"#000","strokeWidth":2,"fill":"#0000","offsetx":700.0,"offsety":450.0,"rotate":0.0},{"path":"M 99.75 42.75 L 408.5 42.75","stroke":"#000","strokeWidth":2,"fill":"#0000","offsetx":700.0,"offsety":450.0,"rotate":90.0},{"path":"M 99.75 42.75 L 408.5 42.75","stroke":"#000","strokeWidth":2,"fill":"#0000","offsetx":700.0,"offsety":450.0,"rotate":180.0},{"path":"M 99.75 42.75 L 408.5 42.75","stroke":"#000","strokeWidth":2,"fill":"#0000","offsetx":700.0,"offsety":450.0,"rotate":270.0},{"path":"M 99.75 -71.25 Q 57.000004 -78.375 42.750004 -99.74999","stroke":"#000","strokeWidth":2,"fill":"#0000","offsetx":700.0,"offsety":450.0,"rotate":0.0},{"path":"M 57.0 99.75 Q 67.6875 57.000004 99.74999 42.750004","stroke":"#000","strokeWidth":2,"fill":"#0000","offsetx":700.0,"offsety":450.0,"rotate":0.0},{"path":"M -99.75003 71.24997 Q -57.000008 78.37497 -42.750004 99.74999","stroke":"#000","strokeWidth":2,"fill":"#0000","offsetx":700.0,"offsety":450.0,"rotate":0.0},{"path":"M -56.999985 -99.75001 Q -67.687485 -57.000004 -99.74999 -42.750004","stroke":"#000","strokeWidth":2,"fill":"#0000","offsetx":700.0,"offsety":450.0,"rotate":0.0}]


		let t_line = this.svg.append("g").attr("id", "t_lines").selectAll("line").data(t_lines).enter().append("line").attr("x1", (d,i) => d.x1).attr("y1", (d,i) =>d.y1)
			.attr("x2", (d,i) =>d.x2).attr("y2", (d,i) => d.y2)
			.attr("stroke", (d,i) => d.stroke).attr("stroke-width", (d,i) => d.strokeWidth)
			.attr("stroke-dasharray", (d,i) => d.dashArray).attr("stroke-dashoffset", (d,i) => d.dashOffset)
			.attr("transform", (d,i) => ("translate(" + d.offsetx + ", " + d.offsety + "),rotate(" + d.rotate + ")"));

		let t_line_arrow = this.svg.append("g").attr("id", "t_lines_arrow").selectAll("line").data(t_lines_arrow).enter().append("line")
		.attr("x1", (d,i) => d.x1).attr("y1", (d,i) => d.y1).attr("x2", (d,i) => d.x1).attr("y2", (d,i) => d.y1)
		.attr("stroke", (d,i) => d.stroke).attr("stroke-width", (d,i) => d.strokeWidth)
		.attr("stroke-dasharray", (d,i) => d.dashArray).attr("stroke-dashoffset", (d,i) => d.dashOffset)
		.attr("transform", (d,i) => ("translate(" + 700 + ", " + 450 + "),rotate(" + d.rotate + ")")).attr("marker-start", (d,i) => d.markerStart);

		let t_path = this.svg.append("g").attr("id", "t_paths").selectAll("path").data(t_paths).enter().append("path")
		.attr("d", (d,i)=> d.path).attr("stroke", (d,i)=>d.stroke).attr("stroke-width", (d,i)=>d.strokeWidth).attr("fill", (d,i)=>d.fill)
		.attr("transform", (d, i) => ("translate(" + d.offsetx + ", " + d.offsety + "),rotate(" + d.rotate + ")"));
		*/

		let line = this.svg.append("g").attr("id", "lines").selectAll("line").data(this.lines).enter().append("line").attr("x1", (d,i) => d[0]).attr("y1", (d,i) => d[1]).attr("x2", (d,i) => d[2]).attr("y2", (d,i) => d[3])
		.attr("stroke", (d,i) => d[4]).attr("stroke-width", (d,i) => d[5])
		.attr("stroke-dasharray", (d,i) => d[6]).attr("stroke-dashoffset", (d,i) => d[7])
		.attr("transform", (d,i) => d[8]);

		let line_arrow = this.svg.append("g").attr("id", "lines").selectAll("line").data(this.lines_arrow).enter().append("line").attr("x1", (d,i) => d[0]).attr("y1", (d,i) => d[1]).attr("x2", (d,i) => d[2]).attr("y2", (d,i) => d[3])
		.attr("stroke", (d,i) => d[4]).attr("stroke-width", (d,i) => d[5])
		.attr("stroke-dasharray", (d,i) => d[6]).attr("stroke-dashoffset", (d,i) => d[7])
		.attr("transform", (d,i) => d[8]).attr("marker-start", (d,i) => d[9]);

		let path = this.svg.append("g").attr("id", "paths").selectAll("path").data(this.paths).enter().append("path")
		.attr("d", (d,i)=> d[0]).attr("stroke", (d,i)=>d[1]).attr("stroke-width", (d,i)=>d[2]).attr("fill", (d,i)=>d[3])
		.attr("transform", (d, i) => d[4]);

		let text = this.svg.append("g").attr("id", "texts").selectAll("text").data(this.texts).enter().append("text")
        .attr("x", (d,i)=>d[0]).attr("y", (d,i)=>d[1]).attr("text-anchor", "middle")
		.text((d,i) => d[2]).attr("fill", (d,i)=> d[3]).attr("font-size", (d,i)=> d[4]).attr("transform", (d,i)=> d[5]);
		
	}

	clearSvg = () => {
		this.svg.selectAll("*").remove();
	}

	setOption = (option = this.option) => {
		this.clearSvg();
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
		this.draw_cross_roadname();
		this.draw();
	}
	
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
		let image = new Image;  
		image.src = document.getElementsByTagName('img')[0].src;  


		image.onload = function() {  
			
			let saveLink = document.createElement("a");  
			saveLink.download = this.name+"平面布局图.jpg";
			saveLink.target = "_blank";
			saveLink.style.display = "none";
			document.body.appendChild(saveLink);

			context.drawImage(image, 0, 0);  
			saveLink.href = canvas.toDataURL("image/jpeg");
			saveLink.click();
			document.body.removeChild(saveLink);
		};   
	}

	bindButton = (btnId) => {
		$(btnId).click('on', () => {
			this.svg2png();
		});
	}
}


// 交叉口布局
let layout = new Layout("#layout");
layout.setOption();
layout.bindButton("#download_layout");

