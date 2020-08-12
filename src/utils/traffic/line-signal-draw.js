
drawSvgLine = (svg, lines) => {
    svg.append("g").attr("id", "lines").selectAll("line").data(lines).enter().append("line").attr("x1", (d,i) => d[0]).attr("y1", (d,i) => d[1])
    .attr("x2", (d,i) =>d[2]).attr("y2", (d,i) => d[3])
    .attr("stroke", (d,i) => d[4]).attr("stroke-width", (d,i) => d[5])
    .attr("transform", (d,i) => ("translate(" + d[6] + ", " + d[7] + "),rotate(" + d[8] + ")"));
}
drawSvgText = (svg, texts) => {
    svg.append("g").attr("id", "texts").selectAll("text").data(texts).enter().append("text")
    .attr("x", (d,i) => d[0]).attr("y", (d,i) => d[1]).attr("fill", (d,i)=> d[2])
    .attr("font-size", (d,i) => d[3]).text((d,i) => d[4])
    .attr("text-anchor", "middle");
}
drawSvgPath = (svg, paths) => {
    svg.append("g").attr("id", "paths").selectAll("path").data(paths).enter().append("path")
    .attr("d", (d,i)=> d[0]).attr("stroke", (d,i)=> d[1]).attr("stroke-width", (d,i)=> d[2]).attr("fill", (d,i)=> d[3])
    .attr("transform", (d, i) => ("translate(" + d[4] + ", " + d[5] + "),rotate(" + d[6] + ")"));

}

drawInSvg = (divID, cycle, dist, cross_name, band_width, start_time, end_time) => {

    // 初始化
    let odiv = $("#" + divID)[0];
    let width = odiv.offsetWidth;
    let height = odiv.offsetHeight;
    let svg = d3.select("body").select("#" + divID).append("svg").attr("width", width).attr("height", height).style("background", "#777");
    
    // 参数计算
    let actual_coor = dist;
    let location = arrayAccumulate(actual_coor);
    let show_cycle_num = parseInt(end_time[end_time.length - 1]/cycle);

    // 缩放计算
    let scale_y = height / (show_cycle_num * cycle) / 1.5;
    let scale_x = width / location[location.length - 1] / 1.2;
    let offset_x = width/12;
    let offset_y = height/12;
    let font_size = 10;

    let mincycle = 3;

    // 绘制中 绿灯起始时刻/结束时刻 最小值
    let first_green = [];
    let first_red = [];
    for(let i = 0; i < start_time.length; i++)
    {
        let tmp = start_time[i] - cycle * mincycle;
        let tmp2 = end_time[i] - cycle * mincycle;
        first_green.push(tmp);
        first_red.push(tmp2);
    }

    // 相位绘制
    let lines = [];
    let texts = [];
    let paths = [];
    for(let i = 0; i < location.length; i++)
    {
        for(let j = 0; j < show_cycle_num * 5; j++)
        {
            let green_y1 = first_green[i] + j * cycle;
            let green_y2 = first_red[i] + j * cycle;
            let red_y1 = first_red[i] + j * cycle;
            let red_y2 = first_green[i] + (j + 1) * cycle;

            if(green_y2<=0){
                continue;
            }
            if(green_y2>0 && green_y1<=0){
                green_y1 = 0;
            }
            
            if(red_y2<=0){
                continue;
            }
            if(red_y2>0 && red_y1<=0){
                red_y1 = 0;
            }

            if(green_y1 >= (height-2*offset_y)/scale_y){
                green_y1 = (height-2*offset_y)/scale_y;
                green_y2 = (height-2*offset_y)/scale_y;
            }
            if(green_y1 < (height-2*offset_y)/scale_y && green_y2 >= (height-2*offset_y)/scale_y){
                green_y2 = (height-2*offset_y)/scale_y;
            }

            if(red_y1 >= (height-2*offset_y)/scale_y){
                red_y1 = (height-2*offset_y)/scale_y;
                red_y2 = (height-2*offset_y)/scale_y;
            }
            if(red_y1 < (height-2*offset_y)/scale_y && red_y2 >= (height-2*offset_y)/scale_y){
                red_y2 = (height-2*offset_y)/scale_y;
            }

            lines.push([location[i] * scale_x, scale_y * green_y1, location[i] * scale_x, scale_y * green_y2, "#0f0", 3, offset_x, offset_y, 0]);
            lines.push([location[i] * scale_x, scale_y * red_y1, location[i] * scale_x, scale_y * red_y2, "#f00", 3, offset_x, offset_y, 0]);
        }
        texts.push([location[i] * scale_x + offset_x, height-offset_y + font_size + 5, "#0f0", font_size, cross_name[i]]);
    }

    // 速度线段
    let pt12 = [location[0] * scale_x, scale_y * (first_green[first_green.length-1]+cycle*mincycle - location[location.length - 1]/12.5), 
    location[location.length-1] * scale_x, scale_y * (first_green[first_green.length-1]+cycle*mincycle)];
    let pt34 = [location[0] * scale_x, scale_y * (first_green[first_green.length-1]+cycle*mincycle - location[location.length - 1]/12.5+band_width[1]), 
    location[location.length-1] * scale_x, scale_y * (first_green[first_green.length-1]+cycle*mincycle+band_width[1])]

    let pt56 = [location[0] * scale_x, scale_y * (first_green[0]+cycle*mincycle + location[location.length-1]/12.5+cycle), 
    location[location.length-1] * scale_x, scale_y * (first_green[0]+cycle*mincycle+cycle)];
    let pt78 = [location[0] * scale_x, scale_y * (first_green[0]+cycle*mincycle + location[location.length-1]/12.5+cycle-band_width[2]), 
    location[location.length-1] * scale_x, scale_y * (first_green[0]+cycle*mincycle+cycle-band_width[2])];

    let path_data = "M " + pt12[0] + "," + pt12[1] + " L " + pt12[2] + "," + pt12[3] + " L " + pt34[2] + "," + pt34[3] + " L " + pt34[0] + "," + pt34[1] + " Z";
    paths.push([path_data, "#ff0", 1, "#ccc4", offset_x, offset_y, 0]);

    path_data = "M " + pt56[0] + " " + pt56[1] + " L " + pt56[2] + " " + pt56[3] + " L " + pt78[2] + " " + pt78[3] + " L " + pt78[0] + " " + pt78[1] + " Z";
    paths.push([path_data, "#ff0", 1, "#ccc4", offset_x, offset_y, 0]);
    drawSvgLine(svg, lines);
    drawSvgText(svg, texts);
    drawSvgPath(svg, paths);
}
