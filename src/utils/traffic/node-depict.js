import {d3} from 'd3-node'
import $ from 'jquery'
import { ang } from '../ArrayCal'

export class NodeDepict {

    constructor(div_id, offset_x, offset_y, scale = 2.5) {

        this.svg = d3.select("#" + div_id).append("svg").attr('width', '100%').attr('height', '100%')
		this.offset_x = offset_x
		this.offset_y = offset_y
        this.lines = []
        this.paths = []
		this.lines_arrow = []
		this.scale = scale

		this.create_lane_arrow(this.scale)
	}
    
    setOption = (node) => {
        node.directions.length === 3?this.setOption3(node):this.setOption4(node)
    }

    setOption4 = (node) => {

        this.clear()
        
        let directions = node.directions

		let scale = this.scale

        // 各个方向编号(1-东；2-南；3-西；4-北)
        let dir_dirs = directions.map( e => e.direction )
        // 各个方向存储的角度转换为绘制的角度  360 - angle
        let dir_angles = directions.map( e => 360 - e.angle )

        // 关键点 的纵坐标计算
        let dir_width = directions.map( e => {
            let w1 = e.median !== 3? -e.median_line_offset * e.median_line_offset_width: (e.median_width / 2 - e.median_shrink_flag * e.median_shrink_width)
            let w2 = w1
            + e.entry_expand * e.entry_expand_width
            + e.entry_main_width * e.entry_main_num
            + e.entry_sub * (e.entry_sub_width * e.entry_sub_num + e.entry_main_sub_sep !== 3?0:e.entry_main_sub_sep_width)     // 进口辅道
            + e.entry_bike * ( e.entry_bike_width + e.entry_car_bike_sep !== 3?0:e.entry_car_bike_sep_width )                   // 进口非机动车道

            let w3 = e.median !== 3? 0 : e.median_width / 2
            let w4 = w2 - e.entry_expand * e.entry_expand_width

            let w5 = e.median !== 3? e.median_line_offset * e.median_line_offset_width: e.median_width / 2
            let w6 = w5 + 
            + e.exit_main_width * e.exit_main_num 
            + e.exit_sub * (e.exit_sub_width * e.exit_sub_num + e.exit_main_sub_sep !== 3?0:e.exit_main_sub_sep_width)
            + e.exit_bike * ( e.exit_bike_width + e.exit_car_bike_sep !== 3?0:e.exit_car_bike_sep_width )

            let w7 = e.median !== 3? 0: e.median_width / 2
            let w8 = w7 + 
            + e.exit_main_width * e.exit_main_num 
            + e.exit_sub * (e.exit_sub_width * e.exit_sub_num + e.exit_main_sub_sep !== 3?0:e.exit_main_sub_sep_width)
            + e.exit_bike * ( e.exit_bike_width + e.exit_car_bike_sep !== 3?0:e.exit_car_bike_sep_width )

            return ({ w1, w2, w3, w4, w5, w6, w7, w8 })
        } )
        
        // 关键点 的横坐标计算
        let dir_length = directions.map( (e, index) => {

            let link_length = 50

            let last_dir = (index - 1) <0? (index - 1 + 4):(index -1)
            let next_dir = (index + 1) >3? (index + 1 - 4):(index + 1)

            // o点至 上一路口 出口 边缘车道线
            let L1 = dir_width[last_dir].w6

            let exit_to_curve = e.right_ahead === 1? e.safe_island === 1? ( e.safe_island_width + e.ahead_right_lane_width ):(e.ahead_right_lane_width + e.turning_radius): e.turning_radius
            // o点至 本路口 进口 转弯曲线 起点
            let L2 = L1 + exit_to_curve

            // o点至 下一路口 进口 边缘车道线
            let L3 = dir_width[next_dir].w2

            let entry_to_curve = directions[next_dir].right_ahead === 1? directions[next_dir].safe_island === 1? ( directions[next_dir].safe_island_width + directions[next_dir].ahead_right_lane_width ):(directions[next_dir].ahead_right_lane_width + directions[next_dir].turning_radius): directions[next_dir].turning_radius
            // o点至 本路口 出口 转弯曲线起点
            let L4 = L3 + entry_to_curve

            // o点至人行道中点      (有人行道, 无安全岛, 无提前右转, )
            let L5, L6
            if(e.sidewalk_flag === 1){
                if(e.right_ahead === 1){
                    if(e.safe_island === 1){
                        L5 = dir_width[next_dir].w6 + (e.safe_island_width - e.sidewalk_width )/2
                    }else{
                        L5 = dir_width[next_dir].w6 + e.ahead_right_lane_width + e.turning_radius + e.sidewalk2curve_length + e.sidewalk_width / 2
                    }
                }else{
                    L5 = dir_width[next_dir].w6 + e.sidewalk_width / 2 + e.turning_radius
                }
                L6 = L5 + e.sidewalk_width / 2
            }else{
                if(e.right_ahead === 1){
                    if(e.safe_island === 1){
                        L5 = dir_width[next_dir].w6 + e.safe_island_width / 2
                    }else{
                        L5 = dir_width[next_dir].w6 + e.ahead_right_lane_width + e.turning_radius + e.sidewalk2curve_length
                    }
                }else{
                    L5 = dir_width[next_dir].w6 + e.sidewalk2curve_length
                }
                L6 = L5
            }
            
            // o点至停车线
            L6 = L5 + e.sidewalk_flag * e.sidewalk_width / 2 + (1 - e.sidewalk_flag) * e.turning_radius + e.sidewalk2curve_length

            let L7 = L6 + e.channelized_length
            let L8 = L7 + e.gradual_length
            let L9 = L8 + link_length

            // 进口边缘线
            let x1 = L2 + L1
            let y1 = -dir_width[index].w2
            // 出口边缘线
            let x2 = L2 + L1
            let y2 = dir_width[index].w6

            let line = ang.rotate_line([0.1, 0.1, x1, y1], dir_angles[index])
            let line2 = ang.rotate_line([0.1, 0.1, x2, y2], dir_angles[index])

            let pt10 = [line[2],line[3]]
            let pt11 = [line2[2],line2[3]]

            return ({ L1, L2, L3, L4, L5, L6, L7, L8, L9, pt10, pt11 })
        })

        dir_width.forEach( (e, index) => {

            let dir_index = dir_dirs[index] - 1
            let last_dir = (index - 1) <0? (index - 1 + 4):(index -1)           // 上一方向索引
            let next_dir = (index + 1) >3? (index + 1 - 4):(index + 1)          // 下一方向索引

            // 1.路侧线
            // 进口路侧线
            let x1 = dir_length[dir_index].L2 + dir_length[dir_index].L1
            let y1 = -dir_width[dir_index].w2
            let x2 = x1 + dir_length[dir_index].L7
            let y2 = y1
            let x3 = x1 + dir_length[dir_index].L8
            let y3 = -dir_width[dir_index].w4
            let x4 = x1 + dir_length[dir_index].L9
            let y4 = y3
            let line = [x1  * scale, y1 * scale, x2 * scale, y2 * scale]
            let line2 = [x2  * scale, y2 * scale, x3 * scale, y3 * scale]
            let line3 = [x3  * scale, y3 * scale, x4 * scale, y4 * scale]
            this.lines.push({x1: line[0], y1: line[1], x2: line[2], y2: line[3], stroke: '#fff', strokeWidth: 1, dashArray: "", dashOffset: "", offset_x: this.offset_y, offset_y: this.offset_x, rotate: dir_angles[dir_index] })
            this.lines.push({x1: line2[0], y1: line2[1], x2: line2[2], y2: line2[3], stroke: '#fff', strokeWidth: 1, dashArray: "", dashOffset: "", offset_x: this.offset_y, offset_y: this.offset_x, rotate: dir_angles[dir_index] })
            this.lines.push({x1: line3[0], y1: line3[1], x2: line3[2], y2: line3[3], stroke: '#fff', strokeWidth: 1, dashArray: "", dashOffset: "", offset_x: this.offset_y, offset_y: this.offset_x, rotate: dir_angles[dir_index] })

            // 出口路侧线
            x1 = dir_length[dir_index].L2 + dir_length[dir_index].L1
            y1 = dir_width[dir_index].w6
            x2 = x1 + dir_length[dir_index].L9
            y2 = y1
            line = [x1  * scale, y1 * scale, x2 * scale, y2 * scale]
            line2 = ang.rotate_line(line, dir_angles[dir_index])
            this.lines.push({x1: line2[0], y1: line2[1], x2: line2[2], y2:line2[3], stroke: '#fff', strokeWidth: 1, dashArray: "", dashOffset: "", offset_x: this.offset_y, offset_y: this.offset_x, rotate: 0 })
			
			// 2.中央分隔带
            // 进口道路内边缘线
            x1 = dir_length[dir_index].L6 + dir_length[dir_index].L1
            y1 = -dir_width[dir_index].w1
            x2 = x1 + dir_length[dir_index].L7
            y2 = y1
            x3 = x1 + dir_length[dir_index].L8
            y3 = -dir_width[dir_index].w3
            x4 = x1 + dir_length[dir_index].L9
            y4 = y3
            // 出口道路内边缘线
            let x5 = dir_length[dir_index].L6 + dir_length[dir_index].L1
            let y5 = dir_width[dir_index].w5
            let x6 = x5 + dir_length[dir_index].L7
            let y6 = y5
            let x7 = x5 + dir_length[dir_index].L8
            let y7 = dir_width[dir_index].w7
            let x8 = x5 + dir_length[dir_index].L9
            let y8 = y7

			let path_data = [x1, y1, x2, y2, x3, y3, x4, y4, x8, y8, x7, y7, x6, y6, x5, y5].map((e)=> e * scale)
            let path = "M " + path_data[0] + " " + path_data[1] + " L " + path_data[2] + " " + path_data[3]
            + " L " + path_data[4] + " " + path_data[5] + " L " + path_data[6] + " " + path_data[7] + " L " + path_data[8] + " " + path_data[9]
            + " L " + path_data[10] + " " + path_data[11] + " L " + path_data[12] + " " + path_data[13] + " L " + path_data[14] + " " + path_data[15]
            + " L " + path_data[0] + " " + path_data[1]
            + " Z"
            this.paths.push([path, "#fff", 1, "#0f0", "translate(" + this.offset_y + ", " + this.offset_x + "),rotate(" + dir_angles[dir_index] + ")"])

            // 3.车道线
            // 进口主道车道线
            let entry_main_num = directions[dir_index].entry_main_num
            let link_main_num = entry_main_num - directions[dir_index].entry_expand_num
            let entry_stopline_width = dir_width[dir_index].w2 - dir_width[dir_index].w1
            let entry_link_width = dir_width[dir_index].w4 - dir_width[dir_index].w3
            let lanes = directions[dir_index].lane_dir.split(",")
            
            for(let i = 0; i < entry_main_num; i++){

                // 第一条是路侧的车道线，不需要画
                if(i !== 0){
                    x1 = dir_length[dir_index].L6 + dir_length[dir_index].L1
                    y1 = -dir_width[dir_index].w1 - entry_stopline_width / entry_main_num * i
                    x2 = x1 + dir_length[dir_index].L7
                    y2 = y1
                    line = [x1  * scale, y1 * scale, x2 * scale, y2 * scale]
    
                    this.lines.push({x1: line[0], y1: line[1], x2: line[2], y2: line[3], stroke: '#fff', strokeWidth: 1, dashArray: "", dashOffset: "", offset_x: this.offset_y, offset_y: this.offset_x, rotate: dir_angles[dir_index] })
                }
            
                // 导向箭头
                x1 = dir_length[dir_index].L6 + dir_length[dir_index].L1
                y1 = -dir_width[dir_index].w1 - entry_stopline_width / entry_main_num * (i + 0.5)
                if(lanes[i] === '2'){
                    this.lines_arrow.push([x1*scale, y1*scale, x1*scale, y1*scale, "#fff", 1, "", "", "translate(" + this.offset_y + "," + this.offset_x + "),rotate(" + dir_angles[dir_index] + ")", "url(#left_arrow)", ""]);
                }else if(lanes[i] === '1'){
                    this.lines_arrow.push([x1*scale, y1*scale, x1*scale, y1*scale, "#fff", 1, "", "", "translate(" + this.offset_y + "," + this.offset_x + "),rotate(" + dir_angles[dir_index] + ")", "url(#th_arrow)", ""]);
                }else if(lanes[i] === '4'){
                    this.lines_arrow.push([x1*scale, y1*scale, x1*scale, y1*scale, "#fff", 1, "", "", "translate(" + this.offset_y + "," + this.offset_x + "),rotate(" + dir_angles[dir_index] + ")", "url(#th_right_arrow)", ""]);
                }else if(lanes[i] === '5'){
                    this.lines_arrow.push([x1*scale, y1*scale, x1*scale, y1*scale, "#fff", 1, "", "", "translate(" + this.offset_y + "," + this.offset_x + "),rotate(" + dir_angles[dir_index] + ")", "url(#th_left_arrow)", ""]);
                }else if(lanes[i] === '6'){
                    this.lines_arrow.push([x1*scale, y1*scale, x1*scale, y1*scale, "#fff", 1, "", "", "translate(" + this.offset_y + "," + this.offset_x + "),rotate(" + dir_angles[dir_index] + ")", "url(#th_left_arrow)", ""]);
                }
                
            }

            // 进口 主道 非渠化路段上的 车道线
            for(let i = 1; i < link_main_num; i++){

                x1 = dir_length[dir_index].L2 + dir_length[dir_index].L1 + dir_length[dir_index].L8
                y1 = -dir_width[dir_index].w3 - entry_link_width / link_main_num * i
                x2 = dir_length[dir_index].L6 + dir_length[dir_index].L9
                y2 = y1

                line = [x1  * scale, y1 * scale, x2 * scale, y2 * scale]
                this.lines.push({x1: line[0], y1: line[1], x2: line[2], y2:line[3], stroke: '#fff', strokeWidth: 1, dashArray: "5,5", dashOffset: "", offset_x: this.offset_y, offset_y: this.offset_x, rotate: dir_angles[dir_index] })
            }

            // 出口主道 渠化路段+非渠化路段 的车道线
            let exit_main_num = directions[dir_index].exit_main_num
            let exit_stopline_width = dir_width[dir_index].w6 - dir_width[dir_index].w5
            let exit_link_width = dir_width[dir_index].w8 - dir_width[dir_index].w7
            for(let i = 0; i < exit_main_num; i++ ){

                // 第一条不需要画
                if(i !== 0){
                    x5 = dir_length[dir_index].L6 + dir_length[dir_index].L1
                    y5 = dir_width[dir_index].w5 + exit_stopline_width / exit_main_num * i
                    x6 = x5 + dir_length[dir_index].L7
                    y6 = y5
                    x7 = x5 + dir_length[dir_index].L8
                    y7 = dir_width[dir_index].w7 + exit_link_width / exit_main_num * i
                    x8 = x5 + dir_length[dir_index].L9
                    y8 = y7
                    line = [x5  * scale, y5 * scale, x6 * scale, y6 * scale]
                    line2 = [x6  * scale, y6 * scale, x7 * scale, y7 * scale]
                    line3 = [x7  * scale, y7 * scale, x8 * scale, y8 * scale]
                    this.lines.push({x1: line[0], y1: line[1], x2: line[2], y2:line[3], stroke: '#fff', strokeWidth: 1, dashArray: "5,5", dashOffset: "", offset_x: this.offset_y, offset_y: this.offset_x, rotate: dir_angles[dir_index] })
                    this.lines.push({x1: line2[0], y1: line2[1], x2: line2[2], y2:line2[3], stroke: '#fff', strokeWidth: 1, dashArray: "5,5", dashOffset: "", offset_x: this.offset_y, offset_y: this.offset_x, rotate: dir_angles[dir_index] })
                    this.lines.push({x1: line3[0], y1: line3[1], x2: line3[2], y2:line3[3], stroke: '#fff', strokeWidth: 1, dashArray: "5,5", dashOffset: "", offset_x: this.offset_y, offset_y: this.offset_x, rotate: dir_angles[dir_index] })
                }

                x1 = dir_length[dir_index].L6 + dir_length[dir_index].L1
                y1 = dir_width[dir_index].w5 + exit_stopline_width / exit_main_num * (i + 0.5)
                this.lines_arrow.push([x1 * scale, y1 * scale, x1 * scale, y1 * scale, "#fff", 1, "", "", "translate(" + this.offset_y + "," + this.offset_x + "),rotate(" + dir_angles[dir_index] + ")", "url(#opposite_th_arrow)", ""]);
            
            }

            // 4.停车线
            x1 = dir_length[dir_index].L6 + dir_length[dir_index].L1
            y1 = -dir_width[dir_index].w1
            x2 = x1
            y2 = -dir_width[dir_index].w2
            line = [x1  * scale, y1 * scale, x2 * scale, y2 * scale]
            this.lines.push({x1: line[0], y1: line[1], x2: line[2], y2: line[3], stroke: '#fff', strokeWidth: 2, dashArray: "", dashOffset: "", offset_x: this.offset_y, offset_y: this.offset_x, rotate: dir_angles[dir_index] })

            // 5.人行道
            x1 = dir_length[dir_index].L5 + dir_length[dir_index].L1
            y1 = -dir_width[dir_index].w2
            x2 = x1
            y2 = dir_width[dir_index].w6
            line = [x1  * scale, y1 * scale, x2 * scale, y2 * scale]
            this.lines.push({x1: line[0], y1: line[1], x2: line[2], y2: line[3], stroke: '#fff', strokeWidth: directions[dir_index].sidewalk_width * scale, dashArray: "2,2", dashOffset: "", offset_x: this.offset_y, offset_y: this.offset_x, rotate: dir_angles[dir_index] })

            // 6.转弯曲线
            // 进出口端点
            let pt1 = dir_length[next_dir].pt10
            let pt2 = dir_length[dir_index].pt11

            // 切线方程
            x3 = (pt1[0] + pt2[0])/2
            y3 = (pt1[1] + pt2[1])/2
            let k1 = -1/Math.tan(Math.atan((pt2[1] - pt1[1]) / (pt2[0] - pt1[0])))
            let b1 = y3 - k1 * x3

            // 下一方向进口道方程
            let dir_angle = dir_angles[next_dir]
            let k2 = Math.tan(ang.angle2radian(dir_angle))
            let b2 = pt1[1] - k2 * pt1[0]

            // 转弯半径切线交点
            x4 = (b2 - b1) / ( k1 - k2 )
            y4 = k1 * x4 + b1
            if( k2 > 10000){
                x4 = pt1[0]
                y4 = k1 * x4 + b1
            }
            // 转弯半径
            let pt3 = [x4, y4]
            path_data = [...pt1, ...pt3, ...pt2].map( e => e * scale )
            path = "M " + path_data[0] + " " + path_data[1] + " Q " + path_data[2] + " " + path_data[3] + " " + path_data[4] + " " + path_data[5]
            this.paths.push([path, "#fff", 1, "#7770", "translate(" + this.offset_y + ", " + this.offset_x + "),rotate(0)"])

        })

    }
    
    setOption3 = (node) => {

        this.clear()
        
        let directions = node.directions

		let scale = this.scale

        // 各个方向编号(1-东；2-南；3-西；4-北)
        let dir_dirs = directions.map( e => e.direction )
        // 各个方向存储的角度转换为绘制的角度  360 - angle
        let dir_angles = directions.map( e => 360 - e.angle )

        // 关键点 的纵坐标计算
        let dir_width = directions.map( e => {
            let w1 = e.median !== 3? -e.median_line_offset * e.median_line_offset_width: (e.median_width / 2 - e.median_shrink_flag * e.median_shrink_width)
            let w2 = w1
            + e.entry_expand * e.entry_expand_width
            + e.entry_main_width * e.entry_main_num
            + e.entry_sub * (e.entry_sub_width * e.entry_sub_num + e.entry_main_sub_sep !== 3?0:e.entry_main_sub_sep_width)     // 进口辅道
            + e.entry_bike * ( e.entry_bike_width + e.entry_car_bike_sep !== 3?0:e.entry_car_bike_sep_width )                   // 进口非机动车道

            let w3 = e.median !== 3? 0 : e.median_width / 2
            let w4 = w2 - e.entry_expand * e.entry_expand_width

            let w5 = e.median !== 3? e.median_line_offset * e.median_line_offset_width: e.median_width / 2
            let w6 = w5 + 
            + e.exit_main_width * e.exit_main_num 
            + e.exit_sub * (e.exit_sub_width * e.exit_sub_num + e.exit_main_sub_sep !== 3?0:e.exit_main_sub_sep_width)
            + e.exit_bike * ( e.exit_bike_width + e.exit_car_bike_sep !== 3?0:e.exit_car_bike_sep_width )

            let w7 = e.median !== 3? 0: e.median_width / 2
            let w8 = w7 + 
            + e.exit_main_width * e.exit_main_num 
            + e.exit_sub * (e.exit_sub_width * e.exit_sub_num + e.exit_main_sub_sep !== 3?0:e.exit_main_sub_sep_width)
            + e.exit_bike * ( e.exit_bike_width + e.exit_car_bike_sep !== 3?0:e.exit_car_bike_sep_width )

            // console.log({ w1, w2, w3, w4, w5, w6, w7, w8 })
            
            return ({ w1, w2, w3, w4, w5, w6, w7, w8 })
        } )
        
        // 关键点 的横坐标计算
        let dir_length = directions.map( (e, index) => {

            let link_length = 50

            let last_dir = (index - 1) <0? (index - 1 + 3):(index -1)
            let next_dir = (index + 1) >2? (index + 1 - 3):(index + 1)

            // o点至 上一路口 出口 边缘车道线
            let L1 = dir_width[last_dir].w6

            let exit_to_curve = e.right_ahead === 1? e.safe_island === 1? ( e.safe_island_width + e.ahead_right_lane_width ):(e.ahead_right_lane_width + e.turning_radius): e.turning_radius
            // o点至 本路口 进口 转弯曲线 起点
            let L2 = L1 + exit_to_curve

            // o点至 下一路口 进口 边缘车道线
            let L3 = dir_width[next_dir].w2

            let entry_to_curve = directions[next_dir].right_ahead === 1? directions[next_dir].safe_island === 1? ( directions[next_dir].safe_island_width + directions[next_dir].ahead_right_lane_width ):(directions[next_dir].ahead_right_lane_width + directions[next_dir].turning_radius): directions[next_dir].turning_radius
            // o点至 本路口 出口 转弯曲线起点
            let L4 = L3 + entry_to_curve

            // o点至人行道中点      (有人行道, 无安全岛, 无提前右转, )
            let L5, L6
            if(e.sidewalk_flag === 1){
                if(e.right_ahead === 1){
                    if(e.safe_island === 1){
                        L5 = dir_width[next_dir].w6 + (e.safe_island_width - e.sidewalk_width )/2
                    }else{
                        L5 = dir_width[next_dir].w6 + e.ahead_right_lane_width + e.turning_radius + e.sidewalk2curve_length + e.sidewalk_width / 2
                    }
                }else{
                    L5 = dir_width[next_dir].w6 + e.sidewalk_width / 2 + e.turning_radius
                }
                L6 = L5 + e.sidewalk_width / 2
            }else{
                if(e.right_ahead === 1){
                    if(e.safe_island === 1){
                        L5 = dir_width[next_dir].w6 + e.safe_island_width / 2
                    }else{
                        L5 = dir_width[next_dir].w6 + e.ahead_right_lane_width + e.turning_radius + e.sidewalk2curve_length
                    }
                }else{
                    L5 = dir_width[next_dir].w6 + e.sidewalk2curve_length
                }
                L6 = L5
            }
            
            // o点至停车线
            L6 = L5 + e.sidewalk_flag * e.sidewalk_width / 2 + (1 - e.sidewalk_flag) * e.turning_radius + e.sidewalk2curve_length

            let L7 = L6 + e.channelized_length
            let L8 = L7 + e.gradual_length
            let L9 = L8 + link_length

            // 进口边缘线
            let x1 = L2 + L1
            let y1 = -dir_width[index].w2
            // 出口边缘线
            let x2 = L2 + L1
            let y2 = dir_width[index].w6

            let line = ang.rotate_line([0.1, 0.1, x1, y1], dir_angles[index])
            let line2 = ang.rotate_line([0.1, 0.1, x2, y2], dir_angles[index])

            let pt10 = [line[2],line[3]]
            let pt11 = [line2[2],line2[3]]

            // console.log({ L1, L2, L3, L4, L5, L6, L7, L8, L9, pt10, pt11 })

            return ({ L1, L2, L3, L4, L5, L6, L7, L8, L9, pt10, pt11 })
        })

        
        dir_width.forEach( (e, index) => {

            //  dir_index 表示该放下编号        dir_dirs 各个方向编号(1-东；2-南；3-西；4-北)
            // let dir_index = dir_dirs[index] - 1

            let dir_index, last_dir, next_dir
            // 缺东口
            if(dir_dirs[0] === 2){
                if(index === 0){
                    dir_index = 0
                    last_dir = 2           // 上一方向索引
                    next_dir = 1          // 下一方向索引
                }else if(index === 1){
                    dir_index = 1
                    last_dir = 0           // 上一方向索引
                    next_dir = 2          // 下一方向索引
                }else if (index === 2){
                    dir_index = 2
                    last_dir = 1           // 上一方向索引
                    next_dir = 0          // 下一方向索引
                }
            }
            // 缺南口
            if(dir_dirs[1] === 3){
                if(index === 0){
                    dir_index = 0
                    last_dir = 2           // 上一方向索引
                    next_dir = 1          // 下一方向索引
                }else if(index === 1){
                    dir_index = 1
                    last_dir = 0           // 上一方向索引
                    next_dir = 2          // 下一方向索引
                }else if (index === 2){
                    dir_index = 2
                    last_dir = 1           // 上一方向索引
                    next_dir = 0          // 下一方向索引
                }
            }
            // 缺东口
            if(dir_dirs[2] === 4){
                if(index === 0){
                    dir_index = 0
                    last_dir = 2           // 上一方向索引
                    next_dir = 1          // 下一方向索引
                }else if(index === 1){
                    dir_index = 1
                    last_dir = 0           // 上一方向索引
                    next_dir = 2          // 下一方向索引
                }else if (index === 2){
                    dir_index = 2
                    last_dir = 1           // 上一方向索引
                    next_dir = 0          // 下一方向索引
                }
            }
            // 缺东口
            if(dir_dirs[3] === 3){
                if(index === 0){
                    dir_index = 0
                    last_dir = 2           // 上一方向索引
                    next_dir = 1          // 下一方向索引
                }else if(index === 1){
                    dir_index = 1
                    last_dir = 0           // 上一方向索引
                    next_dir = 2          // 下一方向索引
                }else if (index === 2){
                    dir_index = 2
                    last_dir = 1           // 上一方向索引
                    next_dir = 0          // 下一方向索引
                }
            }

            // 1.路侧线
            // 进口路侧线
            let x1 = dir_length[dir_index].L2 + dir_length[dir_index].L1
            let y1 = -dir_width[dir_index].w2
            let x2 = x1 + dir_length[dir_index].L7
            let y2 = y1
            let x3 = x1 + dir_length[dir_index].L8
            let y3 = -dir_width[dir_index].w4
            let x4 = x1 + dir_length[dir_index].L9
            let y4 = y3
            let line = [x1  * scale, y1 * scale, x2 * scale, y2 * scale]
            let line2 = [x2  * scale, y2 * scale, x3 * scale, y3 * scale]
            let line3 = [x3  * scale, y3 * scale, x4 * scale, y4 * scale]
            this.lines.push({x1: line[0], y1: line[1], x2: line[2], y2: line[3], stroke: '#fff', strokeWidth: 1, dashArray: "", dashOffset: "", offset_x: this.offset_y, offset_y: this.offset_x, rotate: dir_angles[dir_index] })
            this.lines.push({x1: line2[0], y1: line2[1], x2: line2[2], y2: line2[3], stroke: '#fff', strokeWidth: 1, dashArray: "", dashOffset: "", offset_x: this.offset_y, offset_y: this.offset_x, rotate: dir_angles[dir_index] })
            this.lines.push({x1: line3[0], y1: line3[1], x2: line3[2], y2: line3[3], stroke: '#fff', strokeWidth: 1, dashArray: "", dashOffset: "", offset_x: this.offset_y, offset_y: this.offset_x, rotate: dir_angles[dir_index] })

            // 出口路侧线
            x1 = dir_length[dir_index].L2 + dir_length[dir_index].L1
            y1 = dir_width[dir_index].w6
            x2 = x1 + dir_length[dir_index].L9
            y2 = y1
            line = [x1  * scale, y1 * scale, x2 * scale, y2 * scale]
            line2 = ang.rotate_line(line, dir_angles[dir_index])
            this.lines.push({x1: line2[0], y1: line2[1], x2: line2[2], y2:line2[3], stroke: '#fff', strokeWidth: 1, dashArray: "", dashOffset: "", offset_x: this.offset_y, offset_y: this.offset_x, rotate: 0 })
			
			// 2.中央分隔带
            // 进口道路内边缘线
            x1 = dir_length[dir_index].L6 + dir_length[dir_index].L1
            y1 = -dir_width[dir_index].w1
            x2 = x1 + dir_length[dir_index].L7
            y2 = y1
            x3 = x1 + dir_length[dir_index].L8
            y3 = -dir_width[dir_index].w3
            x4 = x1 + dir_length[dir_index].L9
            y4 = y3
            // 出口道路内边缘线
            let x5 = dir_length[dir_index].L6 + dir_length[dir_index].L1
            let y5 = dir_width[dir_index].w5
            let x6 = x5 + dir_length[dir_index].L7
            let y6 = y5
            let x7 = x5 + dir_length[dir_index].L8
            let y7 = dir_width[dir_index].w7
            let x8 = x5 + dir_length[dir_index].L9
            let y8 = y7

			let path_data = [x1, y1, x2, y2, x3, y3, x4, y4, x8, y8, x7, y7, x6, y6, x5, y5].map((e)=> e * scale)
            let path = "M " + path_data[0] + " " + path_data[1] + " L " + path_data[2] + " " + path_data[3]
            + " L " + path_data[4] + " " + path_data[5] + " L " + path_data[6] + " " + path_data[7] + " L " + path_data[8] + " " + path_data[9]
            + " L " + path_data[10] + " " + path_data[11] + " L " + path_data[12] + " " + path_data[13] + " L " + path_data[14] + " " + path_data[15]
            + " L " + path_data[0] + " " + path_data[1]
            + " Z"
            this.paths.push([path, "#fff", 1, "#0f0", "translate(" + this.offset_y + ", " + this.offset_x + "),rotate(" + dir_angles[dir_index] + ")"])

            // 3.车道线
            // 进口主道车道线
            let entry_main_num = directions[dir_index].entry_main_num
            let link_main_num = entry_main_num - directions[dir_index].entry_expand_num
            let entry_stopline_width = dir_width[dir_index].w2 - dir_width[dir_index].w1
            let entry_link_width = dir_width[dir_index].w4 - dir_width[dir_index].w3
            let lanes = directions[dir_index].lane_dir.split(",")
            
            for(let i = 0; i < entry_main_num; i++){

                // 第一条是路侧的车道线，不需要画
                if(i !== 0){
                    x1 = dir_length[dir_index].L6 + dir_length[dir_index].L1
                    y1 = -dir_width[dir_index].w1 - entry_stopline_width / entry_main_num * i
                    x2 = x1 + dir_length[dir_index].L7
                    y2 = y1
                    line = [x1  * scale, y1 * scale, x2 * scale, y2 * scale]
    
                    this.lines.push({x1: line[0], y1: line[1], x2: line[2], y2: line[3], stroke: '#fff', strokeWidth: 1, dashArray: "", dashOffset: "", offset_x: this.offset_y, offset_y: this.offset_x, rotate: dir_angles[dir_index] })
                }
            
                // 导向箭头
                x1 = dir_length[dir_index].L6 + dir_length[dir_index].L1
                y1 = -dir_width[dir_index].w1 - entry_stopline_width / entry_main_num * (i + 0.5)
                if(lanes[i] === '2'){
                    this.lines_arrow.push([x1*scale, y1*scale, x1*scale, y1*scale, "#fff", 1, "", "", "translate(" + this.offset_y + "," + this.offset_x + "),rotate(" + dir_angles[dir_index] + ")", "url(#left_arrow)", ""]);
                }else if(lanes[i] === '1'){
                    this.lines_arrow.push([x1*scale, y1*scale, x1*scale, y1*scale, "#fff", 1, "", "", "translate(" + this.offset_y + "," + this.offset_x + "),rotate(" + dir_angles[dir_index] + ")", "url(#th_arrow)", ""]);
                }else if(lanes[i] === '4'){
                    this.lines_arrow.push([x1*scale, y1*scale, x1*scale, y1*scale, "#fff", 1, "", "", "translate(" + this.offset_y + "," + this.offset_x + "),rotate(" + dir_angles[dir_index] + ")", "url(#th_right_arrow)", ""]);
                }
                
            }

            // 进口 主道 非渠化路段上的 车道线
            for(let i = 1; i < link_main_num; i++){

                x1 = dir_length[dir_index].L2 + dir_length[dir_index].L1 + dir_length[dir_index].L8
                y1 = -dir_width[dir_index].w3 - entry_link_width / link_main_num * i
                x2 = dir_length[dir_index].L6 + dir_length[dir_index].L9
                y2 = y1

                line = [x1  * scale, y1 * scale, x2 * scale, y2 * scale]
                this.lines.push({x1: line[0], y1: line[1], x2: line[2], y2:line[3], stroke: '#fff', strokeWidth: 1, dashArray: "5,5", dashOffset: "", offset_x: this.offset_y, offset_y: this.offset_x, rotate: dir_angles[dir_index] })
            }

            // 出口主道 渠化路段+非渠化路段 的车道线
            let exit_main_num = directions[dir_index].exit_main_num
            let exit_stopline_width = dir_width[dir_index].w6 - dir_width[dir_index].w5
            let exit_link_width = dir_width[dir_index].w8 - dir_width[dir_index].w7
            for(let i = 0; i < exit_main_num; i++ ){

                // 第一条不需要画
                if(i !== 0){
                    x5 = dir_length[dir_index].L6 + dir_length[dir_index].L1
                    y5 = dir_width[dir_index].w5 + exit_stopline_width / exit_main_num * i
                    x6 = x5 + dir_length[dir_index].L7
                    y6 = y5
                    x7 = x5 + dir_length[dir_index].L8
                    y7 = dir_width[dir_index].w7 + exit_link_width / exit_main_num * i
                    x8 = x5 + dir_length[dir_index].L9
                    y8 = y7
                    line = [x5  * scale, y5 * scale, x6 * scale, y6 * scale]
                    line2 = [x6  * scale, y6 * scale, x7 * scale, y7 * scale]
                    line3 = [x7  * scale, y7 * scale, x8 * scale, y8 * scale]
                    this.lines.push({x1: line[0], y1: line[1], x2: line[2], y2:line[3], stroke: '#fff', strokeWidth: 1, dashArray: "5,5", dashOffset: "", offset_x: this.offset_y, offset_y: this.offset_x, rotate: dir_angles[dir_index] })
                    this.lines.push({x1: line2[0], y1: line2[1], x2: line2[2], y2:line2[3], stroke: '#fff', strokeWidth: 1, dashArray: "5,5", dashOffset: "", offset_x: this.offset_y, offset_y: this.offset_x, rotate: dir_angles[dir_index] })
                    this.lines.push({x1: line3[0], y1: line3[1], x2: line3[2], y2:line3[3], stroke: '#fff', strokeWidth: 1, dashArray: "5,5", dashOffset: "", offset_x: this.offset_y, offset_y: this.offset_x, rotate: dir_angles[dir_index] })
                }

                x1 = dir_length[dir_index].L6 + dir_length[dir_index].L1
                y1 = dir_width[dir_index].w5 + exit_stopline_width / exit_main_num * (i + 0.5)
                this.lines_arrow.push([x1 * scale, y1 * scale, x1 * scale, y1 * scale, "#fff", 1, "", "", "translate(" + this.offset_y + "," + this.offset_x + "),rotate(" + dir_angles[dir_index] + ")", "url(#opposite_th_arrow)", ""]);
            
            }

            // 4.停车线
            x1 = dir_length[dir_index].L6 + dir_length[dir_index].L1
            y1 = -dir_width[dir_index].w1
            x2 = x1
            y2 = -dir_width[dir_index].w2
            line = [x1  * scale, y1 * scale, x2 * scale, y2 * scale]
            this.lines.push({x1: line[0], y1: line[1], x2: line[2], y2: line[3], stroke: '#fff', strokeWidth: 2, dashArray: "", dashOffset: "", offset_x: this.offset_y, offset_y: this.offset_x, rotate: dir_angles[dir_index] })

            // 5.人行道
            x1 = dir_length[dir_index].L5 + dir_length[dir_index].L1
            y1 = -dir_width[dir_index].w2
            x2 = x1
            y2 = dir_width[dir_index].w6
            line = [x1  * scale, y1 * scale, x2 * scale, y2 * scale]
            this.lines.push({x1: line[0], y1: line[1], x2: line[2], y2: line[3], stroke: '#fff', strokeWidth: directions[dir_index].sidewalk_width * scale, dashArray: "2,2", dashOffset: "", offset_x: this.offset_y, offset_y: this.offset_x, rotate: dir_angles[dir_index] })

            // 6.转弯曲线
            // 进出口端点
            let pt1 = dir_length[next_dir].pt10
            let pt2 = dir_length[dir_index].pt11

            // 切线方程
            x3 = (pt1[0] + pt2[0])/2
            y3 = (pt1[1] + pt2[1])/2
            let k1 = -1/Math.tan(Math.atan((pt2[1] - pt1[1]) / (pt2[0] - pt1[0])))
            let b1 = y3 - k1 * x3

            // 下一方向进口道方程
            let dir_angle = dir_angles[next_dir]
            let k2 = Math.tan(ang.angle2radian(dir_angle))
            let b2 = pt1[1] - k2 * pt1[0]

            // 转弯半径切线交点
            x4 = (b2 - b1) / ( k1 - k2 )
            y4 = k1 * x4 + b1
            if( k2 > 10000){
                x4 = pt1[0]
                y4 = k1 * x4 + b1
            }
            // 转弯半径
            let pt3 = [x4, y4]
            path_data = [...pt1, ...pt3, ...pt2].map( e => e * scale )
            path = "M " + path_data[0] + " " + path_data[1] + " Q " + path_data[2] + " " + path_data[3] + " " + path_data[4] + " " + path_data[5]
            this.paths.push([path, "#fff", 1, "#7770", "translate(" + this.offset_y + ", " + this.offset_x + "),rotate(0)"])

        })
	}
	
	clear = () => {
		this.lines = []
        this.paths = []
		this.lines_arrow = []
        this.svg.selectAll("g").remove()
	}
	
	draw = (node) => {

		this.setOption(node)
		
        this.svg.append("g").attr("id", "lines").selectAll("line").data(this.lines).enter().append("line")
        .attr("x1", (d,i) => d.x1).attr("y1", (d,i) =>d.y1)
		.attr("x2", (d,i) =>d.x2).attr("y2", (d,i) => d.y2)
		.attr("stroke", (d,i) => d.stroke).attr("stroke-width", (d,i) => d.strokeWidth)
		.attr("stroke-dasharray", (d,i) => d.dashArray).attr("stroke-dashoffset", (d,i) => d.dashOffset)
        .attr("transform", (d,i) => ("translate(" + d.offset_x + ", " + d.offset_y + "),rotate(" + d.rotate + ")"))

        this.svg.append("g").attr("id", "paths").selectAll("path").data(this.paths).enter().append("path")
		.attr("d", (d,i)=> d[0]).attr("stroke", (d,i)=>d[1]).attr("stroke-width", (d,i)=>d[2]).attr("fill", (d,i)=>d[3])
        .attr("transform", (d, i) => d[4])
        
		this.svg.append("g").attr("id", "lines_arrow").selectAll("line").data(this.lines_arrow).enter().append("line").attr("x1", (d,i) => d[0]).attr("y1", (d,i) => d[1]).attr("x2", (d,i) => d[2]).attr("y2", (d,i) => d[3])
		.attr("stroke", (d,i) => d[4]).attr("stroke-width", (d,i) => d[5])
		.attr("stroke-dasharray", (d,i) => d[6]).attr("stroke-dashoffset", (d,i) => d[7])
		.attr("transform", (d,i) => d[8]).attr("marker-start", (d,i) => d[9]);

	}

	
	// 创建导向箭头图标
    create_lane_arrow = (scale) => {
        // 直行导向箭头
		let th_arrow = this.svg.append("defs").attr("id", "arrow").append("marker").attr("id", "th_arrow")
		.attr("viewBox","0 0 30 4.5").attr("refX", "0").attr("refY", "2.25").attr("markerWidth", (5*scale)).attr("markerHeight", (0.75*scale)).attr("orient", "auto").attr("markerUnits", "strokeWidth");	
		th_arrow.append("path").attr("d", "M0,2.25 L12,4.5 L12,3 L30,3 L30,1.5 L12,1.5 L12,0 L0,2.25 z").attr("fill", "#fff")

        // 反向直行导向箭头
		let opposite_th_arrow = this.svg.select("#arrow").append("marker").attr("id", "opposite_th_arrow")
		.attr("viewBox","0 0 30 4.5").attr("refX", "0").attr("refY", "2.25").attr("markerWidth", (5*scale)).attr("markerHeight", (0.75*scale)).attr("orient", "auto").attr("markerUnits", "strokeWidth");	
		opposite_th_arrow.append("path").attr("d", "M30,2.25 L18,4.5 L18,3 L0,3 L0,1.5 L18,1.5 L18,0 L30,2.25 z").attr("fill", "#fff");

		// 直左导向箭头
		let th_left_arrow = this.svg.select("#arrow").append("marker").attr("id", "th_left_arrow")
		.attr("viewBox","0 0 30 10").attr("refX", "0").attr("refY", "5").attr("markerWidth", (5*scale)).attr("markerHeight", (5/3*scale)).attr("orient", "auto").attr("markerUnits", "strokeWidth");	
		th_left_arrow.append("path").attr("d", "M0,2.25 L12,4.5 L12,3 L22,3 L15,7 L10,7 L18,10, L25.5,7 L21,7 L28,3 L30,3 L30,1.5 L12,1.5 L12,0 L0,2.25 z").attr("fill", "#fff");

		// 直右导向箭头
		let th_right_arrow = this.svg.select("#arrow").append("marker").attr("id", "th_right_arrow")
		.attr("viewBox","0 0 30 10").attr("refX", "0").attr("refY", "5").attr("markerWidth", (5*scale)).attr("markerHeight", (5/3*scale)).attr("orient", "auto").attr("markerUnits", "strokeWidth");	
		th_right_arrow.append("path").attr("d", "M0,7.75 L12,5.5 L12,7 L22,7 L15,4 L10,4 L18,0, L25.5,4 L21,4 L28,7 L30,7 L30,8.5 L12,8.5 L12,10 L0,7.75 z").attr("fill", "#fff");

		// 左转导向箭头
		let left_arrow = this.svg.select("#arrow").append("marker").attr("id", "left_arrow")
		.attr("viewBox","0 0 30 7.5").attr("refX", "0").attr("refY", "3.75").attr("markerWidth", (5*scale)).attr("markerHeight", (1.25*scale)).attr("orient", "auto").attr("markerUnits", "strokeWidth");	
		left_arrow.append("path").attr("d", "M0,4.5 L8,7.5 L15.5,4.5 L11,4.5 L16.5,1.5 L30,1.5 L30,0 L10.5,0 L5,4.5 L0,4.5 Z").attr("fill", "#fff");

		// 右转导向箭头
		let right_arrow = this.svg.select("#arrow").append("marker").attr("id", "right_arrow")
		.attr("viewBox","0 0 30 7.5").attr("refX", "0").attr("refY", "3.75").attr("markerWidth", (5*scale)).attr("markerHeight", (1.25*scale)).attr("orient", "auto").attr("markerUnits", "strokeWidth");	
		right_arrow.append("path").attr("d", "M0,3 L8,0 L15.5,3 L11,3 L16.5,6 L30,6 L30,7.5 L10.5,7.5 L5,3 L0,3 Z").attr("fill", "#fff");

		// 调头箭头
		let uturn_arrow = this.svg.select("#arrow").append("marker").attr("id", "uturn_arrow")
		.attr("viewBox","0 0 30 7.5").attr("refX", "0").attr("refY", "3.75").attr("markerWidth", (5*scale)).attr("markerHeight", (1.25*scale)).attr("orient", "auto").attr("markerUnits", "strokeWidth");	
		uturn_arrow.append("path").attr("d", "M0,3 L8,0 L15.5,3 L11,3 L16.5,6 L30,6 L30,7.5 L10.5,7.5 L5,3 L0,3 Z").attr("fill", "#fff");

    }
	
}
