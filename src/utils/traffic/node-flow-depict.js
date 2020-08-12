
import $ from 'jquery'
import {d3} from 'd3-node'

export default class NodeFlowDepict {
    constructor(divID = "", flow = [], name = ""){
        this.divID = divID;
        this.flow = flow;
        this.name = name;
        this.svg = null;
        this.lines = [];
        this.paths = [];
        this.texts = [];
        this.lines_arrow = [];
        this.initSvg();
        this.initOption();
        this.create_flow_icons();
        this.create_flow_lines();
        this.create_flow_texts();
    }
    // 初始化svg
    initSvg = () => {
        let odiv = $(this.divID)[0];
        this.width = odiv.offsetWidth;
        this.height = odiv.offsetHeight;
        this.svg = d3.select("body").select(this.divID).append("svg").attr('width', this.width).attr('height', this.height);
    }
    // 初始化参数
    initOption = () => {
        let option = {
            width: this.width,
            height: this.height,
            background: "",
            scale: 3,
            colors: ["#f00", "#0ff", "#ff0", "#0f0"],
            lineWidth: 1,
            flowLineWidth: 3,
            flowFontSize: 6,
            flowFontColor: "#000",
            dashArray: "",
            dashOffset: 0,
            direction: [0, 90, 180, 270],
            last_dir: [3, 0, 1, 2],
            next_dir: [1, 2, 3, 0],
            oppo_dir: [2, 3, 0, 1],
            flow: this.flow,
            imFlow2Center : 10,
            exFlow2Center : 10,
            startLineLength : 20,
            endLineLength : 10,
            startLine2Center : 50,
            endLine2Center : 50,
            thText2StartLine : 25,
            thTextOffset : 2,
            leftText2StartLine : 20,
            leftTextOffset : 6,
            rightText2StartLine : 20,
            rightTextOffset : 6
        };
        let scale = Math.min(option.width / 1.2 / (option.startLineLength + option.endLineLength + option.startLine2Center + option.endLine2Center), option.height / 1.2 / (option.startLineLength + option.endLineLength + option.startLine2Center + option.endLine2Center));
        option.scale = scale;
        this.option = option;
        this.svg.style("background", option.background);
    }

    // 设置属性
    setOption = (flow) => {
        // this.clearSvg();
        this.option.flow = flow;
        this.lines = [];
        this.paths = [];
        this.texts = [];
        this.lines_arrow = [];
        this.clearSvg();
        this.create_flow_icons();
        this.create_flow_lines();
        this.create_flow_texts();
        this.draw();
    }

    // 创建引用箭头
    create_flow_icons = () => {
        let option = this.option;
        this.svg.append("defs").attr("id", "flow_arrow");
        for (let dir = 0; dir < option.direction.length; dir++) {
            this.svg.selectAll("#flow_arrow").append("marker").attr("id", "west_arrow" + dir)
                .attr("viewBox","0 0 12 6").attr("refX", "0").attr("refY", "3")
                .attr("orient", "auto").attr("markerUnits", "strokeWidth")
                .attr("markerWidth","6").attr("markerHeight","3")
                .append("path").attr("d", "M0,0 L0,6 L12,3 z").attr("fill", option.colors[dir]);
        }
    }
    // 创建线
    create_flow_lines = () => {
        let option = this.option;
        for (let dir = 0; dir < option.direction.length; dir++) {
            // 起始线
            let line_data = [option.startLine2Center, -option.imFlow2Center, option.startLine2Center + option.startLineLength, -option.imFlow2Center].map(e => e * option.scale);
            this.lines.push([...line_data, option.colors[dir], option.flowLineWidth * 3, option.dashArray, option.dashOffset, "translate(" + option.width / 2 + "," + option.height / 2 + "),rotate(" + option.direction[dir] + ")"])
            // 直行线
            line_data = [-option.endLine2Center, -option.imFlow2Center, option.startLine2Center, -option.imFlow2Center].map(e => e * option.scale);
            this.lines.push([...line_data, option.colors[dir], option.flowLineWidth, option.dashArray, option.dashOffset, "translate(" + option.width / 2 + "," + option.height / 2 + "),rotate(" + option.direction[dir] + ")"])
            // 左转线
            let path_data = [];
            path_data = [option.startLine2Center, -option.imFlow2Center + option.flowLineWidth / option.scale, -option.imFlow2Center + option.flowLineWidth / option.scale, -option.imFlow2Center + option.flowLineWidth / option.scale, -option.imFlow2Center + option.flowLineWidth / option.scale, option.endLine2Center].map(e => e * option.scale);
            let left_p = "M " + path_data[0] + " " + path_data[1] + " Q" + path_data[2] + " " + path_data[3] + " " + path_data[4] + " " + path_data[5] + "";
            this.paths.push([left_p, option.colors[dir], option.flowLineWidth, option.colors[dir] + "0", "translate(" + option.width / 2 + "," + option.height / 2 + "),rotate(" + option.direction[dir] + ")"]);
            // 右转线
            path_data = [];
            path_data = [option.startLine2Center, -option.imFlow2Center - option.flowLineWidth / option.scale, option.exFlow2Center + option.flowLineWidth / option.scale, -option.imFlow2Center - option.flowLineWidth / option.scale, option.exFlow2Center + option.flowLineWidth / option.scale, -option.endLine2Center].map(e => e * option.scale);
            let right_p = "M " + path_data[0] + " " + path_data[1] + " Q" + path_data[2] + " " + path_data[3] + " " + path_data[4] + " " + path_data[5] + "";
            this.paths.push([right_p, option.colors[dir], option.flowLineWidth, option.colors[dir]+"0", "translate(" + option.width / 2 + "," + option.height / 2 + "),rotate(" + option.direction[dir] + ")"]);
            // 结束线
            let line_arrow_data = [-option.endLine2Center, -option.imFlow2Center, -option.endLine2Center - option.endLineLength, -option.imFlow2Center].map(e => e * option.scale);
            this.lines_arrow.push([...line_arrow_data, option.colors[option.oppo_dir[dir]], option.flowLineWidth * 3, option.dashArray, option.dashOffset, "translate(" + option.width / 2 + ", " + option.height / 2 + "),rotate(" + option.direction[dir] + ")", "", "url(#west_arrow" + option.oppo_dir[dir] + ")"]);
        }
    }

    // 创建文字
    create_flow_texts = () => {
        let option = this.option;

        for (let dir = 0; dir < option.direction.length; dir++) {
            if(dir === 0 || dir === 1){
                // 直行
                let text_data = [option.startLine2Center - option.thText2StartLine, -option.imFlow2Center + option.flowFontSize * 0.4].map(e => e * option.scale);
                this.texts.push([...text_data, option.flow[dir * 3], option.flowFontColor, "" + option.flowFontSize * option.scale, "translate(" + option.width / 2 + ", " + option.height / 2 + "),rotate(" + option.direction[dir] + ")"]);
                // 左转
                text_data = [option.startLine2Center - option.leftText2StartLine, -option.imFlow2Center - option.leftTextOffset].map(e => e * option.scale);
                this.texts.push([...text_data, option.flow[dir * 3 + 1], option.flowFontColor, "" + option.flowFontSize * option.scale, "translate(" + option.width / 2 + ", " + option.height / 2 + "),rotate(" + option.direction[dir] + ")"]);
                // 右转
                text_data = [option.startLine2Center-option.rightText2StartLine, -option.imFlow2Center + option.rightTextOffset + option.flowFontSize].map(e => e * option.scale);
                this.texts.push([...text_data, option.flow[dir * 3 + 2], option.flowFontColor, "" + option.flowFontSize * option.scale, "translate(" + option.width / 2 + ", " + option.height / 2 + "),rotate(" + option.direction[dir] + ")"]);
            }else if(dir === 2 || dir === 3){
                // 直行
                let text_data = [-option.startLine2Center + option.thText2StartLine, option.imFlow2Center + option.flowFontSize * 0.4].map(e => e * option.scale);
                this.texts.push([...text_data, option.flow[dir * 3], option.flowFontColor, "" + option.flowFontSize * option.scale, "translate(" + option.width / 2 + ", " + option.height / 2 + "),rotate(" + option.direction[option.oppo_dir[dir]] + ")"]);
                // 左转
                text_data = [-option.startLine2Center + option.leftText2StartLine, option.imFlow2Center - option.leftTextOffset].map(e => e * option.scale);
                this.texts.push([...text_data, option.flow[dir * 3 + 1], option.flowFontColor, "" + option.flowFontSize * option.scale, "translate(" + option.width / 2 + ", " + option.height / 2 + "),rotate(" + option.direction[option.oppo_dir[dir]] + ")"]);
                // 右转
                text_data = [-option.startLine2Center + option.rightText2StartLine, option.imFlow2Center + option.rightTextOffset + option.flowFontSize].map(e => e * option.scale);
                this.texts.push([...text_data, option.flow[dir * 3 + 2], option.flowFontColor, "" + option.flowFontSize * option.scale, "translate(" + option.width / 2 + ", " + option.height / 2 + "),rotate(" + option.direction[option.oppo_dir[dir]] + ")"]);
            }
        }
    }
    draw = () => {

        this.svg.append("g").attr("id", "lines").selectAll("line").data(this.lines).enter().append("line")
        .attr("x1", (d,i) => d[0]).attr("y1", (d,i) => d[1]).attr("x2", (d,i) => d[2]).attr("y2", (d,i) => d[3])
        .attr("stroke", (d,i) => d[4]).attr("stroke-width", (d,i) => d[5])
        .attr("stroke-dasharray", (d,i) => d[6]).attr("stroke-dashoffset", (d,i) => d[7])
        .attr("transform", (d,i) => d[8]);

        this.svg.append("g").attr("id", "lines").selectAll("line").data(this.lines_arrow).enter().append("line")
        .attr("x1", (d,i) => d[0]).attr("y1", (d,i) => d[1]).attr("x2", (d,i) => d[2]).attr("y2", (d,i) => d[3])
        .attr("stroke", (d,i) => d[4]).attr("stroke-width", (d,i) => d[5])
        .attr("stroke-dasharray", (d,i) => d[6]).attr("stroke-dashoffset", (d,i) => d[7])
        .attr("transform", (d,i) => d[8]).attr("marker-start", (d,i) => d[9]).attr("marker-end", (d,i) => d[10]);

        this.svg.append("g").attr("id", "paths").selectAll("path").data(this.paths).enter().append("path")
        .attr("d", (d,i)=> d[0]).attr("stroke", (d,i)=>d[1]).attr("stroke-width", (d,i)=>d[2]).attr("fill", (d,i)=>d[3])
        .attr("transform", (d, i) => d[4]);

        this.svg.append("g").attr("id", "texts").selectAll("text").data(this.texts).enter().append("text")
        .attr("x", (d,i)=>d[0]).attr("y", (d,i)=>d[1]).attr("text-anchor", "middle").attr("font-family", "Times New Roman")
        .text((d,i) => d[2]).attr("fill", (d,i)=> d[3]).attr("font-size", (d,i)=> d[4]).attr("transform", (d,i)=> d[5]);

    }
    clearSvg = () => {
		this.svg.selectAll("*").remove();
	}
    
    svg2png = () => {
        //  将一个xml文件或节点转换为一个字符串
        // var svg = d3.select("body").select(this.divID).select('svg');
        let serializer = new XMLSerializer();  
        let source = serializer.serializeToString(this.svg.node());

        source = '<?xml version="1.0" standalone="no"?>\r\n' + source;  
        let url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);  // 把字符串作为URI组件进行编码
        document.write('<img src="' + url + '"/>');  // 文本中写入

        let canvas = document.createElement("canvas");  
        canvas.width = this.width;
        canvas.height = this.height;

        let context = canvas.getContext("2d");  
        let image = new Image();
        image.src = document.getElementsByTagName('img')[0].src;  
        

        image.onload = function() {  
            
            let saveLink = document.createElement("a");  
            saveLink.download = this.name+"flow.jpg";
            saveLink.target = "_blank";
            saveLink.style.display = "none";
            document.body.appendChild(saveLink);

            // 画入canvas
            context.drawImage(image, 0, 0);  
            // 创建链接
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
