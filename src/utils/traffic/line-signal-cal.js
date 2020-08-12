import {ArrayArgMax, ArrayFindValueIndex, ArrayMax, ArraySum, ArrayAccumulate, ArrayMin} from '../ArrayCal'
import { PHASE_SCHEMA } from '../ConstantUtils'

import $ from 'jquery'
import {d3} from 'd3-node'
import { message } from 'antd'


// 干线配时计算
export class LineSignalCal {

	constructor(line_cycle, line_link_length, line_speed, line_node_cycle, line_node_green_ratio, line_node_name) {

		this.line_link_length = [0, ...line_link_length]
		
		this.line_node_name = line_node_name
		this.line_node_green_ratio = line_node_green_ratio

        // 初始化参数
        this.init_params( line_cycle, line_speed, line_node_cycle )
		// 参数及数据
		this.gap_skip = 10
		// 结果集
		this.green_start_time_arr = []
		this.green_end_time_arr = []
		this.double_band_width = []
		this.relative_offset = []

    }
	
	init_params = ( line_cycle, line_speed, line_node_cycle ) => {

		let line_link_length = this.line_link_length
		let line_node_name = this.line_node_name
		let line_node_green_ratio = this.line_node_green_ratio

		// 公共周期时长
		this.line_cycle = line_cycle
		// 各路口间距
		this.line_link_length = line_link_length
		// 干线速度
		this.line_speed = line_speed
		// 各路口信号周期
		this.line_node_cycle = line_node_cycle
		// 绿信比
		this.line_node_green_ratio = line_node_green_ratio
		// 交叉口名称
		this.line_node_name = line_node_name

	}

	setOption = ( line_cycle, line_speed, line_node_cycle ) => {

		let line_link_length = this.line_link_length
		let line_node_green_ratio = this.line_node_green_ratio
        
        this.init_params( line_cycle, line_speed, line_node_cycle )

		// 结果集
		this.green_start_time_arr = []
		this.green_end_time_arr = []
		this.double_band_width = []
		this.relative_offset = []

		let relative_offset = this.calLineControl(line_cycle, line_speed, line_node_green_ratio, line_node_cycle, line_link_length );
		return relative_offset
	}

	// 数组排序返回序号
	arraySortReturnIndex = (arr) => {
		let index = [];
		let tmp = 0;
		let tmp_arr = [];
		for(let i = 0; i < arr.length; i++){
			tmp_arr.push(arr[i]);
		}
		for(let i = 0; i < arr.length; i++){
			index.push(i);
		}
		for (let i = 0; i < tmp_arr.length; i++)  
		{  
			for (let j = i + 1; j < tmp_arr.length; j++)  
			{  
				if (tmp_arr[i] >= tmp_arr[j])  {  
					tmp = tmp_arr[i];
					tmp_arr[i] = tmp_arr[j];
					tmp_arr[j] = tmp;
					tmp = index[i];
					index[i] = index[j];
					index[j] = tmp;
				}
			}
		}
		return index;
	}

	// 计算实际交叉口与理想交叉口间距
	calGreenWave = (line_link_length, line_speed, line_cycle, min_actual2dream_gap, max_actual2dream_gap, gap_skip) => {

		let result = [];
		let coordinate = ArrayAccumulate(line_link_length)
		
		let dream_max_shift_gap = 0;
		let dream_max_shift_gap_cross = 0;			// 最大挪移的交叉口
		let dream_gap = 0;							// 最佳x值
		let dream_shift_gap = 0;
		for(let gaps_arr = min_actual2dream_gap; gaps_arr < max_actual2dream_gap; gaps_arr += gap_skip)			// x值
		{
			let dream2actual_gap = [];				//与理想交叉口的距离
			for(let i = 0; i < line_link_length.length; i++)
			{
				dream2actual_gap.push(coordinate[i] - gaps_arr * parseInt(coordinate[i]/gaps_arr, 10));		// 表中间内容
			}
			dream2actual_gap.push(gaps_arr);
			let sort_index = this.arraySortReturnIndex(dream2actual_gap);

			let shift_gap = [];
			for(let i = 1; i < dream2actual_gap.length; i++)
			{
				let index = sort_index[i];
				shift_gap.push(dream2actual_gap[index] - dream2actual_gap[sort_index[i - 1]]);		// 计算相邻挪移量之差。

				if(dream2actual_gap[index] - dream2actual_gap[sort_index[i - 1]] > dream_max_shift_gap)
				{
					dream_max_shift_gap = dream2actual_gap[index] - dream2actual_gap[sort_index[i - 1]];
					
					dream_max_shift_gap_cross = sort_index[i-1];											// 最大挪移在哪个交叉口
					dream_shift_gap = (gaps_arr - dream_max_shift_gap) / 2;			// 最大挪移
					dream_gap = gaps_arr;
				}
			}
		}
		result.push(dream_shift_gap);
		result.push(dream_max_shift_gap_cross);
		result.push(dream_gap);
		return result;
	}

	// 计算理想交叉口位置
	calactual2dreamLocation = (coordinate, gap_cross) => {
		let result = [];
		let min_cross = Math.ceil(((coordinate[gap_cross[1]] - gap_cross[0]) - coordinate[0]) / gap_cross[2]);
		let max_cross = Math.ceil((coordinate[coordinate.length - 1] - (coordinate[gap_cross[1]] - gap_cross[0])) / gap_cross[2]);
		let center_coor = coordinate[gap_cross[1]] - gap_cross[0];
		
		let dream_coor = [];
		let first_dream_coor = center_coor - min_cross * gap_cross[2];
		dream_coor.push(first_dream_coor);
		for(let i = 1; i < min_cross + max_cross + 1; i++)
		{
			dream_coor.push(first_dream_coor + i * gap_cross[2]);
		}
		let actual2dream_gap = [];
		let actual2dream_left_or_right = [];
		let actual2dream_index = [];
			
		for(let i = 0; i < coordinate.length; i++)
		{
			let temp_tmp = coordinate[i] - dream_coor[0];
			let temp_tmp2 = 0;
			let temp_tmp3 = 0;
			for(let j = 0; j < dream_coor.length; j++)
			{
				if(temp_tmp >= Math.abs(coordinate[i] - dream_coor[j]))
				{
					temp_tmp = Math.abs(coordinate[i] - dream_coor[j]);
					// 实际交叉口位于理想交叉口右侧
					if((coordinate[i] - dream_coor[j]) > 0)		
					{	
						temp_tmp2 = 2;
					}
					else{
						temp_tmp2 = 1;
					}
					temp_tmp3 = j + 1;
				}
			}
			actual2dream_gap.push(temp_tmp);				//	实际交叉口与理想交叉口的距离
			actual2dream_left_or_right.push(temp_tmp2);		//	实际交叉口位于理想交叉口的左侧或者右侧
			actual2dream_index.push(temp_tmp3);				//	实际交叉口对应理想交叉口的编号
		}
		result.push(actual2dream_left_or_right);
		result.push(actual2dream_gap);
		result.push(actual2dream_index);
		return result;
	}

	//step 14 计算各个交叉口的相位差
	calOffset = (cross_lamda_arr, cross_cycle_arr, to_dream_cross_index) => {
		let offset = [];
		for(let i = 0; i < cross_lamda_arr.length; i++)
		{
			if(to_dream_cross_index[i] % 2 === 0)
			{
				offset.push(parseInt((0.5 - 0.5 * cross_lamda_arr[i]) * cross_cycle_arr[i], 10));
			}
			else
			{
				offset.push(parseInt((1 - 0.5 * cross_lamda_arr[i]) * cross_cycle_arr[i], 10));
			}
		}	
		return offset;
	}
	
	// step 15 计算相对相位差
	calRelativeOffset = (offset, line_cycle, suppose_cross_index) => {
		let relative_offset = [];
		
		for(let i = 0; i < offset.length; i++)
		{
			if(offset[i] >= offset[suppose_cross_index])
			{
				relative_offset.push(offset[i] - offset[suppose_cross_index]);
				
			}
			else
			{
				relative_offset.push(offset[i] - offset[suppose_cross_index] + line_cycle);
			}
		}
		return relative_offset;
	}
			
	// 计算关键相位绿灯启亮时刻
	calGreenStartTime = (lamda_arr, line_cycle, relative_offset, index) => {
		let green_start_time_arr = [];
		for(let i = 0; i < index.length; i++)
		{
			let temp = relative_offset[i];
			
			while(true)
			{
				if((index[i] * 0.5 - 0.75) * line_cycle <= temp && temp <= (index[i] * 0.5 - 0.25) * line_cycle)
				{
					break;
				}
				else if((index[i] * 0.5 - 0.75) * line_cycle >= temp)
				{
					temp += line_cycle * 0.5;
				}
				else if((index[i] * 0.5 - 0.25) * line_cycle <= temp)
				{
					temp -= line_cycle * 0.5;
				}
			}
			green_start_time_arr.push(temp);
		}
		return green_start_time_arr;
	}
	
	// 计算关键相位绿灯停止时刻。
	calGreenEndTime = (lamda_arr, line_cycle, green_start_time_arr) => {
		let green_end_time_arr = [];
		for(let i = 0; i < green_start_time_arr.length; i++)
		{
			green_end_time_arr.push(green_start_time_arr[i] + line_cycle * lamda_arr[i]);
		}
		return green_end_time_arr;
	}

	// 计算绿波带宽度
	calGreenBandWidth = (actual2dreamgap, actual2dreamdirection, actual2dream_index, dream_gap, line_speed, green_start_time, green_end_time) => {
		let relative_left_coor = [];
		let relative_right_coor = [];
		for(let i = 0; i < actual2dream_index.length; i++)
		{
			let temp = actual2dreamgap[i] * (actual2dreamdirection[i] - 1.5) * 2 + dream_gap * (actual2dream_index[i] - 1);
			relative_left_coor.push(temp);
		}
		for(let i = actual2dream_index.length - 1; i >= 0; i--)
		{
			let temp = actual2dreamgap[i] * (1.5 - actual2dreamdirection[i]) * 2 + dream_gap * (actual2dream_index[actual2dream_index.length - 1] - actual2dream_index[i]);
			relative_right_coor.push(temp);
		}
		let max_k1 = 0;
		let min_k2 = 0;
		max_k1 = green_start_time[0] - relative_left_coor[0] / line_speed;
		min_k2 = green_end_time[0] - relative_left_coor[0] / line_speed;
		for(let i = 0; i < green_start_time.length; i++)
		{
			if(max_k1 < green_start_time[i] - relative_left_coor[i] / line_speed)
			{
				max_k1 = green_start_time[i] - relative_left_coor[i] / line_speed;
			}
			
			if(min_k2 > green_end_time[i] - relative_left_coor[i] / line_speed)
			{
				min_k2 = green_end_time[i] - relative_left_coor[i] / line_speed;
			}
		}
		// 正向绿波带宽度
		let positive_bandwidth = parseInt(min_k2 - max_k1, 10);
		
		max_k1 = 0;
		min_k2 = 0;
		max_k1 = green_start_time[green_start_time.length - 1] + relative_right_coor[0] / line_speed;
		min_k2 = green_end_time[green_start_time.length - 1] + relative_right_coor[0] / line_speed;
		for(let i = 0; i < green_start_time.length; i++)
		{
			if(max_k1 < green_start_time[green_start_time.length - 1 - i] + relative_right_coor[i] / line_speed)
			{
				max_k1 = green_start_time[green_start_time.length - 1 - i] + relative_right_coor[i] / line_speed;
			}
			
			if(min_k2 > green_end_time[green_start_time.length - 1 - i] + relative_right_coor[i] / line_speed)
			{
				min_k2 = green_end_time[green_start_time.length - 1 - i] + relative_right_coor[i] / line_speed;
			}
		}
		// 反向绿波带宽度
		let opposite_bandwidth = parseInt(min_k2 - max_k1, 10);		
		return [parseInt((opposite_bandwidth + positive_bandwidth) / 2, 10), opposite_bandwidth, positive_bandwidth];
		
	}

	// 计算控制方案
	calLineControl = ( line_cycle, line_speed, green_ratio, line_node_cycle, line_link_length ) => {

		let gap_skip = this.gap_skip;
		let min_actual2dream_gap = line_speed * line_cycle / 2 - gap_skip * 10;
		let max_actual2dream_gap = line_speed * line_cycle / 2 + gap_skip * 10;
		let gap_cross = this.calGreenWave(line_link_length, line_speed, line_cycle, min_actual2dream_gap, max_actual2dream_gap, gap_skip);
		
		let coordinate = ArrayAccumulate(line_link_length)
			
		//  step 12 实际交叉口与理想协调交叉口距离
		let actual2dreamlocation = this.calactual2dreamLocation(coordinate, gap_cross);

		// 计算相对相位差
		let offset_arr = this.calOffset(green_ratio, line_node_cycle, actual2dreamlocation[2]);
		let relative_offset = this.calRelativeOffset(offset_arr, line_cycle, 0);				// 假设相对第1个交叉口进行相位差计算  
		
		// 计算绿灯起始时刻/结束时刻
		let green_start_time_arr = this.calGreenStartTime(green_ratio, line_cycle, relative_offset, actual2dreamlocation[2]);
		let green_end_time_arr = this.calGreenEndTime(green_ratio, line_cycle, green_start_time_arr);

		// 计算双向绿波宽度
		let double_band_width = this.calGreenBandWidth(actual2dreamlocation[1], actual2dreamlocation[0], actual2dreamlocation[2], gap_cross[2], line_speed, green_start_time_arr, green_end_time_arr);

		this.relative_offset = relative_offset
		this.green_start_time_arr = green_start_time_arr;
		this.green_end_time_arr = green_end_time_arr;
		
		this.double_band_width = double_band_width

		return relative_offset
		
	}

	getOffset = () => {
		return this.relative_offset
	}
	getBandWidth = () => {
		return this.double_band_width
	}
	getGreenStartTime = () => {
		return this.green_start_time_arr
	}
	getGreenEndTime = () => {
		return this.green_end_time_arr
	}

}

// 绘图类
export class LineDepict {
    constructor( divID = "", line_node_name, line_link_length, line_speed, line_cycle, line_node_phase_offset, line_node_green_ratio, line_node_phase_schema, line_node_phase_time, line_node_offset ){
        this.divID = divID
        this.svg = null
        this.lines = []
        this.texts = []
        
        // 上下左右空隙
        this.left_right_gap = 200
        this.top_bottom_gap = 20
        this.font_size = 10
        this.font_phase_gap = 20

        this.line_node_name = line_node_name
        this.line_node_phase_offset = line_node_phase_offset
        this.line_node_green_ratio = line_node_green_ratio
        this.line_node_offset = line_node_offset
        this.line_speed = line_speed
        this.line_cycle = line_cycle
		this.line_link_length = line_link_length
		this.line_node_phase_schema = line_node_phase_schema
		this.line_node_phase_time = line_node_phase_time

        // 交叉口距离  把第一个位置加上
		this.line_node_location = [0, ...ArrayAccumulate(line_link_length)]

        this.initOption(line_cycle)

        this.initSvg();
    }
    // 初始化svg
    initSvg = () => {
		$(this.divID).empty()
		let o_div = $(this.divID)[0];
		if(o_div && o_div.offsetWidth){
			this.width = o_div.offsetWidth
			this.height = o_div.offsetHeight
		}else{
			this.width = 200
			this.height = 200
		}
        this.svg = d3.select("body").select(this.divID).append("svg").attr('width', this.width).attr('height', this.height).style("background-color", '#ccc');
        this.width_scale = this.width / (this.width_cursor + this.left_right_gap * 2)
        this.height_scale = this.height / (this.height_cursor + this.top_bottom_gap * 2)
    }

    initOption = ( line_cycle ) => {

		let line_link_length = this.line_link_length
		let line_node_phase_schema = this.line_node_phase_schema
		let line_node_phase_time = this.line_node_phase_time

		// 计算数据
		let line_length = eval(line_link_length.join("+"))
		
        // 图形宽度和高度的最大值 及画几个周期
        this.width_cursor = line_length
        this.height_cursor = Math.ceil(line_length / this.line_speed * 3.6 / line_cycle + 1) * line_cycle
        this.circle_cursor = Math.ceil(line_length / this.line_speed * 3.6 / line_cycle + 1)

        // 各路口方案
        this.line_node_schema = line_node_phase_schema.map( schema => schema.split(",").map( phase_id => PHASE_SCHEMA[phase_id] ) )
		
		// 按绿信比计算各路口相位绿灯时间
		let line_node_time = line_node_phase_time.map( schema => schema.split(",").map( time => time * 1 ) )
		let line_node_cycle = line_node_time.map( node_time => ArraySum(node_time) )
		this.line_node_time = line_node_time.map( (schema, node_index) => schema.map( (phase_time, phase_index) => phase_time / line_node_cycle[node_index] * line_cycle ) ).map( e => [0, ...ArrayAccumulate(e)] )
		
    }

    // 设置属性
    setOption = (line_speed, line_cycle, line_node_offset, line_band_width) => {

        this.lines = []
        this.texts = []
		this.clearSvg()

		// 初始化参数
		this.line_speed = line_speed
		this.line_cycle = line_cycle

        this.initOption( line_cycle )
		
        this.line_node_offset = line_node_offset

        let line_node_location = this.line_node_location
        let line_node_schema = this.line_node_schema
        let line_node_time = this.line_node_time
		let line_node_name = this.line_node_name

		let line_node_phase_offset = this.line_node_phase_offset

        // 各个路口信号相位
        line_node_location.forEach( (node_location, node_index) => {

            let x = node_location + this.left_right_gap
            let y_min = this.top_bottom_gap
			let y_max = this.height_cursor + this.top_bottom_gap
			
            // 相位绘制
            for( let circle = -1; circle < this.circle_cursor; circle ++ ){
                for( let phase_index = 0; phase_index < line_node_time[node_index].length - 1; phase_index ++ ){
                    let pt1 = [ x, line_node_time[node_index][phase_index] + line_node_offset[node_index] - line_node_phase_offset[0][node_index] + circle * this.line_cycle + this.top_bottom_gap ]
                    let pt2 = [ x, line_node_time[node_index][phase_index + 1] + line_node_offset[node_index] - line_node_phase_offset[0][node_index] + circle * this.line_cycle + this.top_bottom_gap ]

                    // console.log(`第${node_index}个路口，第${circle}周期， 第${phase_index}相位：${pt1}, ${pt2}, 协调相位差${line_node_phase_offset[0][node_index]}`)

                    let x1 = pt1[0] * this.width_scale
                    let y1 = (y_max - (pt1[1] < y_min?y_min: pt1[1] > y_max?y_max: pt1[1]) + this.top_bottom_gap) * this.height_scale
                    let x2 = pt2[0] * this.width_scale
                    let y2 = (y_max - (pt2[1] < y_min?y_min: pt2[1] > y_max?y_max: pt2[1]) + this.top_bottom_gap) * this.height_scale

                    if(phase_index === 0){
                        this.lines.push([ x1, y1, x2, y2, "#0f0", 5, "", "", "translate(0,0),rotate(0)", line_node_schema[node_index][phase_index] + ":" + (line_node_time[node_index][phase_index + 1] - line_node_time[node_index][phase_index]) + "s" ])
                    }else{
                        this.lines.push([ x1, y1, x2, y2, "#f00", 5, "", "", "translate(0,0),rotate(0)", line_node_schema[node_index][phase_index] + ":" + (line_node_time[node_index][phase_index + 1] - line_node_time[node_index][phase_index]) + "s" ])
                    }
                }
            }
            // 名称绘制
            let text_offset = node_index % 2 === 0? this.font_phase_gap : 5
            this.texts.push([x * this.width_scale, ( y_max ) * this.height_scale + this.font_size + text_offset, line_node_name[node_index].replace("交叉口", ""), "", this.font_size, ""])

        } )

		// 正向线
		let y_max = this.height_cursor + this.top_bottom_gap
		let start_b = []
        for( let node_index = 0; node_index < line_node_location.length; node_index++ ){
			start_b.push( line_node_offset[node_index] - line_node_location[node_index] / line_speed * 3.6 )
		}

		let new_start_b = start_b.map( e => (e + line_cycle*2)%line_cycle )
		
		let pos_start_b = ArrayMax(new_start_b)
		let x1 = line_node_location[0] + this.left_right_gap
		let y1 = pos_start_b
		let x2 = line_node_location[line_node_location.length - 1] + this.left_right_gap
		let y2 = line_node_location[line_node_location.length - 1] / line_speed * 3.6 + pos_start_b
		this.lines.push([ x1 * this.width_scale, (y_max - y1) * this.height_scale, x2 * this.width_scale, (y_max - y2) * this.height_scale, "#c2f", 3, "10,10", "", "translate(0,0),rotate(0)", "速度值:" + this.line_speed ])
		x1 = x1
		y1 = y1 + line_band_width[0]
		x2 = x2
		y2 = y2 + line_band_width[0]
		this.lines.push([ x1 * this.width_scale, (y_max - y1) * this.height_scale, x2 * this.width_scale, (y_max - y2) * this.height_scale, "#c2f", 3, "10,10", "", "translate(0,0),rotate(0)", "速度值:" + this.line_speed ])

		
		// 反向线
		let end_b = []
        for( let node_index = 0; node_index < line_node_location.length; node_index++ ){
			end_b.push( line_node_offset[node_index] + line_node_location[node_index] / line_speed * 3.6 )
		}
		let neg_end_b = ArrayMin(end_b)
		
		x1 = line_node_location[0] + this.left_right_gap
		y1 = neg_end_b + line_cycle * 1
		x2 = line_node_location[line_node_location.length - 1] + this.left_right_gap
		y2 = - line_node_location[line_node_location.length - 1] / line_speed * 3.6 + line_cycle * 1 + neg_end_b
		this.lines.push([ x1 * this.width_scale, (y_max - y1) * this.height_scale, x2 * this.width_scale, (y_max - y2) * this.height_scale, "#c2f", 3, "10,10", "", "translate(0,0),rotate(0)", "速度值:" + this.line_speed ])
		x1 = x1
		y1 = y1 + line_band_width[1]
		x2 = x2
		y2 = y2 + line_band_width[1]
		this.lines.push([ x1 * this.width_scale, (y_max - y1) * this.height_scale, x2 * this.width_scale, (y_max - y2) * this.height_scale, "#c2f", 3, "10,10", "", "translate(0,0),rotate(0)", "速度值:" + this.line_speed ])
		
		this.draw();
    }

    // 绘制干线图
    draw = () => {
        this.svg.append("g").attr("id", "lines").selectAll("line").data(this.lines).enter().append("line")
        .attr("x1", (d,i) => d[0]).attr("y1", (d,i) => d[1]).attr("x2", (d,i) => d[2]).attr("y2", (d,i) => d[3])
        .attr("stroke", (d,i) => d[4]).attr("stroke-width", (d,i) => d[5])
        .attr("stroke-dasharray", (d,i) => d[6]).attr("stroke-dashoffset", (d,i) => d[7])
		.attr("transform", (d,i) => d[8]).on("click", (d,i) => message.info(d[9]))
		
        this.svg.append("g").attr("id", "texts").selectAll("text").data(this.texts).enter().append("text")
        .attr("x", (d,i)=>d[0]).attr("y", (d,i)=>d[1]).attr("text-anchor", "middle").attr("font-family", "Times New Roman")
        .text((d,i) => d[2]).attr("fill", (d,i)=> d[3]).attr("font-size", (d,i)=> d[4]).attr("transform", (d,i)=> d[5]);
    }

    // 清除svg
    clearSvg = () => {
		this.svg.selectAll("*").remove();
	}
}



