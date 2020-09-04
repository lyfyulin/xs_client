import echarts from 'echarts'
import 'echarts-liquidfill'

// 双面积图
export const BiAreaOption = ( x_data = [], y_data1 = [], y_data2 = [], name1 = '出租车', name2 = '网约车' ) => ({
    tooltip : {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            label: {
                backgroundColor: '#6a7985'
            }
        },
        backgroundColor: '#0ff',
        textStyle:{
            color: '#000',
        },
    },
    legend: {
        data:[name1,name2],
        textStyle:{
            color: '#fff'
        },
        top:'5%',
    },
    grid: {
        left: '3%',
        right: '8%',
        bottom: '3%',
        top: '15%',
        containLabel: true
    },
    xAxis : [
        {
            type : 'category',
            boundaryGap : false,
            data : x_data,
            axisLabel:{
                lineStyle:{
                    color: '#fff',
                }
            },
            axisTick:{
                lineStyle:{
                    color:'#fff',
                },
                inside: 'inner'
            },
            axisLine:{
                lineStyle:{
                    color: '#fff',
                }
            }
        }
    ],
    yAxis : [
        {
            type : 'value',
            axisLabel:{
                lineStyle:{
                    color: '#fff',
                }
            },
            axisTick:{
                lineStyle:{
                    color:'#fff',
                },
                inside: 'inner'
            },
            axisLine:{
                lineStyle:{
                    color: '#fff',
                }
            },
            splitLine:{
                show:false,
            }
        }
    ],
    series : [
        {
            name:name1,
            type:'line',
            stack: '车公里数',
            areaStyle: {},
            data: y_data1
        },
        {
            name:name2,
            type:'line',
            stack: '车公里数',
            areaStyle: {},
            data: y_data2
        }
    ]
})


// 面积图
export const AreaOption = (  x_data = [], y_data = [], tip = "" ) => ({
    tooltip: {
        trigger: 'axis',
        position: function (pt) {
            return [pt[0], '80%'];
        },
        formatter: (e) =>{
            return tip + ':' + (e[0].data*100).toFixed(2) + '%';
        },
        backgroundColor: '#0ff',
        textStyle:{
            color: '#000',
        },
        zlevel: 100
    },
    title: {
        left: 'center',
    },
    grid: {
        left: '3%',
        right: '8%',
        bottom: '3%',
        top: '10%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: x_data,
        axisLabel:{
            lineStyle:{
                color: '#fff',
            },
        },
        axisTick:{
            lineStyle:{
                color:'#fff',
            },
            inside: 'inner'
        },
        axisLine:{
            lineStyle:{
                color: '#fff',
            }
        }
    },
    yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        min: 0,
        max: 1,
        axisLabel:{
            lineStyle:{
                color: '#fff',
            }
        },
        axisTick:{
            lineStyle:{
                color:'#fff',
            },
            inside: 'inner'
        },
        axisLine:{
            lineStyle:{
                color: '#fff',
            },
            // symbol: ['none', 'arrow'],
            symbolSize: [8,15],
        },
        splitLine:{
            show:false,
        }
    },
    series: [
        {
            name: tip,
            type:'line',
            smooth:true,
            symbol: 'none',
            sampling: 'average',
            itemStyle: {
                color: 'rgb(255, 70, 131)'
            },
            areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgb(255, 158, 68)'
                }, {
                    offset: 1,
                    color: 'rgb(255, 70, 131)'
                }])
            },
            data: y_data
        }
    ]
})



// 面积图  无坐标轴 无标签
export const AreaOption2 = (  x_data = [], y_data = [], title = "" ) => ({
    tooltip: {
        trigger: 'axis',
        position: function (pt) {
            return [pt[0], '80%'];
        },
        formatter: (e) => {
            return '时间：' + e[0].axisValue + '<br/>' + title + ':' + e[0].data + ' km/h';
        },
        backgroundColor: '#0ff',
        textStyle:{
            color: '#000',
        },
        zlevel: 100
    },
    title: {
        left: 'center',
    },
    grid: {
        left: '8%',
        right: '8%',
        bottom: '10%',
        top: '10%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: x_data,
        axisLabel:{
            show: false,
        },
        axisTick:{
            show: false,
        },
        axisLine:{
            show: false,
        }
    },
    yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        axisLabel:{
            show: false,
        },
        axisTick:{
            show: false,
        },
        axisLine:{
            show: false,
        },
        splitLine:{
            show:false,
        }
    },
    series: [
        {
            name: title,
            type:'line',
            smooth:true,
            symbol: 'none',
            sampling: 'average',
            itemStyle: {
                color: 'rgb(255, 70, 131)'
            },
            areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgb(255, 158, 68)'
                }, {
                    offset: 1,
                    color: 'rgb(255, 70, 131)'
                }])
            },
            data: y_data
        }
    ]
})

// 日历图
export const CalendarOption = ( x_data = ["2020-04-10"], y_data = [0] ) => ({
    tooltip : {
        trigger: 'item',
        formatter: (e) => {
            return '传输完整度' + (e.data[1] * 100).toFixed(2) + '%';
        },
        backgroundColor: '#0ff',
        textStyle:{
            color: '#000',
        },
    },
    calendar: [{
        top: '15%',
        bottom: '5%',
        left: '25%',
        width: '70%',
        range: x_data,
        splitLine: {
            show: true,
            lineStyle: {
                color: '#000',
                width: 4,
                type: 'solid'
            }
        },
        yearLabel: {
            show: false,
            textStyle: {
                color: '#fff'
            },
            color: '#fff',
        },
        monthLabel: {
            textStyle: {
                color: '#fff'
            },
            color: '#fff',
            nameMap: 'cn'
        },
        dayLabel: {
            textStyle: {
                color: '#fff'
            },
            color: '#fff',
            nameMap: 'cn',
            
        },
        itemStyle: {
            normal: {
                color: '#323c48',
                borderWidth: 1,
                borderColor: '#111'
            }
        }
    }],
    series: [
        {
            name: '数据质量',
            type: 'scatter',
            coordinateSystem: 'calendar',
            data: y_data,
            symbolSize: function (val) {
                return val[1] * 20
            },
            itemStyle: {
                normal: {
                    color: '#ddb926'
                }
            }
        }
    ]
})

// 日历图2
export const CalendarOption2 = ( x_data = ["2020-04-01"], y_data = [0] ) => ({
    visualMap: {
        show: false,
        min: 0,
        max: 1
    },
    calendar: {
        top: '15%',
        bottom: '5%',
        left: '25%',
        width: '70%',
        range: x_data,
        yearLabel: {
            show: false,
        },
    },
    series: {
        type: 'heatmap',
        coordinateSystem: 'calendar',
        data: y_data
    }
})

// 指示器图
export const GaugeOption = ( data = 0, title = "", unit = "km/h" ) => ({
    tooltip: {
        formatter: '{a} <br/>{b} : {c}' + unit
    },
    toolbox: {
        feature: {
            restore: {},
            saveAsImage: {}
        }
    },
    series: [
        {
            name: title,
            type: 'gauge',
            detail: {formatter: '{value}' + unit},
            data: [{value: data, name: title}]
        }
    ]
})

// 指示器图2
export const GaugeOption2 = ( data = 0, title = "", unit = "", maxValue = 100, color = { color: '#468EFD' } ) => ({
    // backgroundColor: '#0E1327',
    tooltip:{
        show: true,
        position: "right",
        formatter: "{a} <br/>{b} : {c}" + unit,
        backgroundColor: '#5AD8A6',
        textStyle:{
            color: '#000',
        },
    },
    series: [{
            name: title,
            title: {
                show: false,
                offsetCenter: [0, 46], // x, y，单位px
                textStyle: {
                    color: "#fff",
                    fontSize: 14, //表盘上的标题文字大小
                    fontWeight: 400,
                    fontFamily: 'PingFangSC'
                }
            },
            type: "gauge",
            radius: '40%',
            max: maxValue,
            splitNumber: 10,
            axisLine: {
                lineStyle: {
                    color: [
                        [data / 60, color.color],
                        [1, "#111F42"]
                    ],
                    width: 8
                }
            },
            axisLabel: {
                show: false,
            },
            axisTick: {
                show: false,
            },
            splitLine: {
                show: false,
            },
            itemStyle: {
                show: false,
            },
            detail: {
                formatter: function(value) {
                    if (value !== 0) {
                        var num = Math.round(value ) ;
                        return parseInt(num).toFixed(0)+unit;
                    } else {
                        return 0;
                    }
                },
                offsetCenter: [0, 55],
                textStyle: {
                    padding: [0, 0, 0, 0],
                    fontSize: 18,
                    fontWeight: '700',
                    color: color.color
                }
            },
            data: [{
                name: title,
                value: data,
            }],
            pointer: {
                show: true,
                length: '75%',
                radius: '20%',
                width: 8, //指针粗细
            },
            animationDuration: 4000,
        },
        {
            name: '外部刻度',
            type: 'gauge',
            //  center: ['20%', '50%'],
            radius: '70%',
            min: 0, //最小刻度
            max: 60, //最大刻度
            splitNumber: 10, //刻度数量
            startAngle: 225,
            endAngle: -45,
            axisLine: {
                show: true,
                lineStyle: {
                    width: 1,
                    color: [
                        [1, 'rgba(0,0,0,0)']
                    ]
                }
            }, //仪表盘轴线
            axisLabel: {
                show: true,
                color: '#4d5bd1',
                distance: 25,
                formatter: function(v) {
                    switch (v + '') {
                        case '0':
                            return '0';
                        case '25':
                            return '25';
                        case '50':
                            return '50';
                        case '75':
                            return '75';
                        case '100':
                            return '100';
                    }
                }
            }, //刻度标签。
            axisTick: {
                show: true,
                splitNumber: 5,
                lineStyle: {
                    color: color.color, //用颜色渐变函数不起作用
                    width: 1,
                },
                length: -8
            }, //刻度样式
            splitLine: {
                show: true,
                length: -20,
                lineStyle: {
                    color: color.color, //用颜色渐变函数不起作用
                }
            }, //分隔线样式
            detail: {
                show: false
            },
            pointer: {
                show: false
            }
        },
    ]
})

// 指示器图3
export const GaugeOption3 = ( data = 0, title = "", unit = "", maxValue = 100, color = { color: '#468EFD' } ) => ({
    // backgroundColor:'#000',
    tooltip: {
        formatter: "{a} <br/> {c} " + unit
    },
    grid: {
        // top: 0,
        // left: 0,
        // right: 0,
        // bottom: 0,
    },
    series: [{
        name: title,
        type: "gauge",
        center: ['50%', '70%'],
        radius: '60%',
        max: maxValue, //最大刻度
        startAngle: 180,
        endAngle: 0,
        axisLine: {
            lineStyle: {
                color: [
                    [data / maxValue, color.color],
                    [1, "#111F42"]
                ],
                width: 3
            }
        },
        axisLabel: {
            show: false,
        },
        axisTick: {
            show: false,
        },
        splitLine: {
            show: false,
        },
        itemStyle: {
            show: false,
        },
        detail: {
            offsetCenter: [0, 30],
            textStyle: {
                fontSize: 18,
                fontWeight: '700',
                color: color.color
            },
            formatter: data => data + ' km/h'
        },
        title: { //标题
            show: false,
            offsetCenter: [0, -5], // x, y，单位px
            textStyle: {
                color: "#0ff",
                fontSize: 30, //表盘上的标题文字大小
                fontWeight: 400,
                fontFamily: 'PingFangSC'
            }
        },
        data: [{
            name: title,
            value: data,
        }],
        pointer: {
            show: true,
            length: '75%',
            radius: '20%',
            width: 5, //指针粗细
        },
        animationDuration: 4000,
    }, {
        name: '',
        type: 'gauge',
         center: ['50%', '70%'],
        radius: '90%',
        min: 0, //最小刻度
        max: 60, //最大刻度
        splitNumber: 6, //刻度数量
        startAngle: 180,
        endAngle: 0,
        axisLine: {
            show: true,
            lineStyle: {
                width: 1,
                color: [
                    [1, 'rgba(0,0,0,0)']
                ]
            }
        }, //仪表盘轴线
        axisLabel: {
            show: true,
            color: '#ff0',
            distance: 25,
            fontSize: 15,

        }, //刻度标签。
        axisTick: {
            show: true,
            splitNumber: 5,
            lineStyle: {
                color: '#ff0', //用颜色渐变函数不起作用
                width: 1,
            },
            length: -8
        }, //刻度样式
        splitLine: {
            show: true,
            length: -20,
            lineStyle: {
                color: '#ff0', //用颜色渐变函数不起作用
            }
        }, //分隔线样式
        detail: {
            show: false
        },
        pointer: {
            show: true
        }
    }]
})

// 指示器图4
export const GaugeOption4 = (data = 0) => ({
    series: [{
            name: '刻度',
            type: 'gauge',
            radius: '80%',
            min: 0,
            max: 100,
            splitNumber: 2, //刻度数量
            startAngle: 180,
            endAngle: 0,
            axisLine: {
                show: false,
                lineStyle: {
                    width: 1,
                    color: [
                        [1, 'rgba(0,0,0,0)']
                    ]
                }
            }, //仪表盘轴线
            axisLabel: {
                show: false,
                color: '#3B53A2',
                distance: 15,
                fontSize: 11,
                formatter: '{value}%'
            }, //刻度标签。
            axisTick: {
                show: false,
                lineStyle: {
                    color: {
                        type: 'radial',
                        colorStops: [{
                                offset: 0,
                                color: '#77C664'
                            },

                            {
                                offset: 0.2,
                                color: '#2CB7C7'
                            },

                            {
                                offset: 0.4,
                                color: '#1DB2DD'
                            },

                            {
                                offset: 0.6,
                                color: '#2D89ED'
                            },

                            {
                                offset: 0.8,
                                color: '#7765B4'
                            },

                            {
                                offset: 1,
                                color: '#EB3457'
                            }
                        ],
                        globalCoord: false // 缺省为 false
                    },
                    width: 2,
                    length: 20,
                },
                length: -5
            }, //刻度样式
            splitLine: {
                show: false,
                length: -5,
            }, //分隔线样式
            detail: {
                show: false
            },
            pointer: {
                show: false
            }
        },
        {
            type: 'gauge',
            z:0,
            radius: '85%',
            min: 0,
            max: 100,
            center: ['50%', '65%'],
            splitNumber: 0, //刻度数量
            startAngle: 180,
            endAngle: 0,
            axisLine: {
                show: true,
                lineStyle: {
                    width: 300,
                    color: [
                        [1,
                            new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                                {
                                    offset: 0,
                                    color: '#77C664'
                                },

                                {
                                    offset: 0.2,
                                    color: '#2CB7C7'
                                },

                                {
                                    offset: 0.4,
                                    color: '#1DB2DD'
                                },

                                {
                                    offset: 0.6,
                                    color: '#2D89ED'
                                },

                                {
                                    offset: 0.8,
                                    color: '#7765B4'
                                },

                                {
                                    offset: 1,
                                    color: '#EB3457'
                                }
                            ])
                        ]
                    ],
                }
            },
            //分隔线样式。
            splitLine: {
                show: false,
            },
            axisLabel: {
                show: false
            },
            axisTick: {
                show: false
            },
            //仪表盘详情，用于显示数据。
            detail: {
                show: true,
                offsetCenter: [0, 30],
                color: '#ddd',
                formatter: function(params) {
                    return params.toFixed(2) + "%";	//显示内容
                },
                textStyle: {
                    color:'#fff',
                    fontSize:20,
                }
            },
            data: [{
                name: "",
                value: data,
            }]
        }
    ]
})

// 指示器图5
export const GaugeOption5 = ( data1 = 0, data2 = 0, data3 = 0 ) => {
    let dataStyle = {
        normal: {
            label: {
                show: false
            },
            labelLine: {
                show: false
            },
            shadowBlur: 0,
            shadowColor: '#203665'
        }
    }
    return {
        series: [{
            name: '平均出行时间',
            type: 'pie',
            clockWise: false,
            radius: ['40%', '43%'],
            itemStyle: dataStyle,
            hoverAnimation: false,
            center: ['20%', '70%'],
            data: [{
                value: data1,
                label: {
                    normal: {
                        rich: {
                            a: {
                                color: '#3a7ad5',
                                align: 'center',
                                fontSize: 16,
                                fontWeight: "bold"
                            },
                            b: {
                                color: '#0ff',
                                align: 'center',
                                fontSize: 16
                            }
                        },
                        formatter: function(params){
                            return ""+"{a|"+(params.value).toFixed(2)+"\n千米}";
                        },
                        position: 'center',
                        show: true,
                        textStyle: {
                            fontSize: '16',
                            fontWeight: 'normal',
                            color: '#fff'
                        }
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#2c6cc4',
                        shadowColor: '#2c6cc4',
                        shadowBlur: 0
                    }
                }
            }, {
                value: 0,
                name: 'invisible',
                itemStyle: {
                    normal: {
                        color: '#24375c'
                    },
                    emphasis: {
                        color: '#24375c'
                    }
                }
            }]
        }, {
            name: '平均出行距离',
            type: 'pie',
            clockWise: false,
            radius: ['40%', '43%'],
            itemStyle: dataStyle,
            hoverAnimation: false,
            center: ['50%', '35%'],
            data: [{
                value: data2,
                label: {
                    normal: {
                        rich: {
                            a: {
                                color: '#d03e93',
                                align: 'center',
                                fontSize: 16,
                                fontWeight: "bold"
                            },
                            b: {
                                color: '#0ff',
                                align: 'center',
                                fontSize: 16
                            }
                        },
                        formatter: function(params){
                            return ""+"{a|"+params.value+"\n分钟}";
                        },
                        position: 'center',
                        show: true,
                        textStyle: {
                            fontSize: '16',
                            fontWeight: 'normal',
                            color: '#fff'
                        }
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#ef45ac',
                        shadowColor: '#ef45ac',
                        shadowBlur: 0
                    }
                }
            }, {
                value: 0,
                name: 'invisible',
                itemStyle: {
                    normal: {
                        color: '#412a4e'
                    },
                    emphasis: {
                        color: '#412a4e'
                    }
                }
            }]
        }, {
            name: '平均出行次数',
            type: 'pie',
            clockWise: false,
            radius: ['40%', '43%'],
            itemStyle: dataStyle,
            hoverAnimation: false,
            center: ['80%', '70%'],
            data: [{
                value: data3,
                label: {
                    normal: {
                        rich: {
                            a: {
                                color: '#8569e4',
                                align: 'center',
                                fontSize: 16,
                                fontWeight: "bold"
                            },
                            b: {
                                color: '#0ff',
                                align: 'center',
                                fontSize: 16
                            }
                        },
                        formatter: function(params){
                            return ""+"{a|"+params.value+"\n次}";
                        },
                        position: 'center',
                        show: true,
                        textStyle: {
                            fontSize: '16',
                            fontWeight: 'normal',
                            color: '#fff'
                        }
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#613fd1',
                        shadowColor: '#613fd1',
                        shadowBlur: 0
                    }
                }
            }, {
                value: 0,
                name: 'invisible',
                itemStyle: {
                    normal: {
                        color: '#453284'
                    },
                    emphasis: {
                        color: '#453284'
                    }
                }
            }]
        }]
    }
}

// 指示器6
export const GaugeOption6 = (data = 0, maxValue = 10) => ({
    series: [{
            name: '刻度',
            type: 'gauge',
            radius: '80%',
            min: 0,
            max: 10,
            splitNumber: 2, //刻度数量
            startAngle: 180,
            endAngle: 0,
            axisLine: {
                show: false,
                lineStyle: {
                    width: 1,
                    color: [
                        [1, 'rgba(0,0,0,0)']
                    ]
                }
            }, //仪表盘轴线
            axisLabel: {
                show: false,
            }, //刻度标签。
            axisTick: {
                show: false,
                lineStyle: {
                    color: {
                        type: 'radial',
                        colorStops: [{
                                offset: 0,
                                color: '#77C664'
                            },

                            {
                                offset: 0.2,
                                color: '#2CB7C7'
                            },

                            {
                                offset: 0.4,
                                color: '#1DB2DD'
                            },

                            {
                                offset: 0.6,
                                color: '#2D89ED'
                            },

                            {
                                offset: 0.8,
                                color: '#7765B4'
                            },

                            {
                                offset: 1,
                                color: '#EB3457'
                            }
                        ],
                        globalCoord: false // 缺省为 false
                    },
                    width: 2,
                    length: 20,
                },
                length: -5
            }, //刻度样式
            splitLine: {
                show: false,
                length: -5,
            }, //分隔线样式
            detail: {
                show: false
            },
            pointer: {
                show: false
            }
        },
        {
            type: 'gauge',
            z:0,
            radius: '85%',
            min: 0,
            max: 100,
            center: ['50%', '65%'],
            splitNumber: 0, //刻度数量
            startAngle: 180,
            endAngle: 0,
            axisLine: {
                show: true,
                lineStyle: {
                    width: 300,
                    color: [
                        [1,
                            new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                                {
                                    offset: 0,
                                    color: '#77C664'
                                },

                                {
                                    offset: 0.2,
                                    color: '#2CB7C7'
                                },

                                {
                                    offset: 0.4,
                                    color: '#1DB2DD'
                                },

                                {
                                    offset: 0.6,
                                    color: '#2D89ED'
                                },

                                {
                                    offset: 0.8,
                                    color: '#7765B4'
                                },

                                {
                                    offset: 1,
                                    color: '#EB3457'
                                }
                            ])
                        ]
                    ],
                }
            },
            //分隔线样式。
            splitLine: {
                show: false,
            },
            axisLabel: {
                show: false
            },
            axisTick: {
                show: false
            },
            //仪表盘详情，用于显示数据。
            detail: {
                show: true,
                offsetCenter: [0, 30],
                color: '#ddd',
                formatter: function(params) {
                    return params.toFixed(2) + "";	//显示内容
                },
                textStyle: {
                    color:'#fff',
                    fontSize:20,
                }
            },
            data: [{
                name: "",
                value: data,
            }]
        }
    ]
})

// 折线图
export const LineOption = ( x_data = [], y_data = [] ) => ({
    grid: {
        top: '8%',
        left: '8%',
        bottom: '15%',
        right: '8%',
    },
    xAxis: {
        type: 'category',
        data: x_data,
        zlevel: 10,
        boundaryGap: ['0%', '30%'],
        axisLabel: {
            textStyle: {
                color: '#fff'
            }
        },
        axisTick:{
            show:false,
            inside:true,
            lineStyle:{
                color:'#fff'
            }
        },
        axisLine:{
            symbol: ['none','arrow'],
            lineStyle:{
                color:'#fff'
            }
        },
    },
    yAxis: {
        type: 'value',
        zlevel: 10,
        boundaryGap: ['0%', '30%'],
        axisLabel: {
            textStyle: {
                color: '#fff'
            }
        },
        axisTick:{
            inside:true,
            lineStyle:{
                color:'#fff'
            }
        },
        axisLine:{
            symbol: ['none','arrow'],
            lineStyle:{
                color:'#fff'
            }
        },
        splitLine: {
            show:false,
        },
    },
    series: [{
        data: y_data,
        type: 'line',
        symbol: 'emptyCircle',
        symbolSize: 12,
        itemStyle:{
            normal:{
                color:  '#0ff'//function(d){return color[Math.floor(Math.random()*5)%5];}
            }
        }
    }]
})

// 折线图2
export const LineOption2 = (x_data = [], y_data = [], name = "") => ({
    // color: ['#d0570e'],
    grid: {
        top: '8%',
        bottom: '8%',
        left: '6%',
        right: '6%',
    },
    tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    xAxis : [
        {
            type : 'category',
            data : x_data,
            axisLabel: {
                textStyle: {
                    color: '#000'
                },
                // rotate:40,
            },
            axisTick:{
                inside:true,
                lineStyle:{
                    color:'#000'
                }
            },
            axisLine:{
                symbol:['none','arrow'],
                symbolSize:6,
                lineStyle:{
                    color:'#000'
                }
            },
        }
    ],
    yAxis : [
        {
            type : 'value',
            axisLabel: {
                textStyle: {
                    color: '#000'
                }
            },
            axisTick:{
                inside:true,
                lineStyle:{
                    color:'#000'
                }
            },
            axisLine:{
                symbol:['none','arrow'],
                symbolSize:6,
                lineStyle:{
                    color:'#000'
                }
            },
            splitLine:{
                show:false,
            }
        }
    ],
    series : [
        {
            name: name,
            type:'line',
            barWidth: '60%',
            data: y_data,
            itemStyle:{
                normal:{
                    color: '#5b8ff9', //function(d){return "#"+Math.floor(Math.random()*(256*256*256-1)).toString(16);}
                }
            }
        }
    ]
})

// 折线图
export const LineOption3 = (x_data = [], y_data = [], name = "") => ({
    // color: ['#d0570e'],
    grid: {
        top: '8%',
        bottom: '8%',
        left: '6%',
        right: '6%',
    },
    tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    xAxis : [
        {
            type : 'category',
            data : x_data,
            axisLabel: {
                textStyle: {
                    color: '#000'
                },
                // rotate:40,
            },
            axisTick:{
                inside:true,
                lineStyle:{
                    color:'#000'
                }
            },
            axisLine:{
                symbol:['none','arrow'],
                symbolSize:6,
                lineStyle:{
                    color:'#000'
                }
            },
        }
    ],
    yAxis : [
        {
            type : 'value',
            axisLabel: {
                textStyle: {
                    color: '#000'
                }
            },
            axisTick:{
                inside:true,
                lineStyle:{
                    color:'#000'
                }
            },
            axisLine:{
                symbol:['none','arrow'],
                symbolSize:6,
                lineStyle:{
                    color:'#000'
                }
            },
            splitLine:{
                show:false,
            }
        }
    ],
    series : [
        {
            name: name,
            type:'line',
            barWidth: '60%',
            data: y_data,
            itemStyle:{
                normal:{
                    color: '#5b8ff9', //function(d){return "#"+Math.floor(Math.random()*(256*256*256-1)).toString(16);}
                }
            }
        }
    ]
})



// 双折线图
export const BiLineOption = (x_data = [], y_data1 = [], y_data2 = [], color = 1) => ({
    grid: {
        bottom: '15%',
        left: '10%',
        right: '5%',
        top: '15%',
    },
    legend: {
        show: true,
        icon: "line",
        inactiveColor: '#ccc', //图例关闭颜色
        top: "3%",
        right: "center",
        orient: "horizontal",
        textStyle:{
            color:'#c2f',
        },
        data: ["实时", "上周同期"]
    },
    title: {
        show:false,
        text: '',
        left: 'center',
        textStyle : {
            color: '#fff'
        }
    },
    tooltip: {
        trigger: 'axis',
        backgroundColor: '#0ff',
        textStyle:{
            color: '#000',
        },
    },
    xAxis: [{
        data: x_data,
        axisLabel: {
            textStyle: {
                color: '#fff'
            }
        },
        axisTick:{
            inside:true,
            lineStyle:{
                color:'#fff'
            }
        },
        axisLine:{
            //symbol:['none','arrow'],
            lineStyle:{
                color:'#fff'
            }
        },
    }],
    yAxis: [{
        splitLine: {show: false},
        axisLabel: {
            textStyle: {
                color: '#fff'
            }
        },
        axisTick:{
            inside:true,
            lineStyle:{
                color:'#fff'
            }
        },
        axisLine:{
            //symbol:['none','arrow'],
            lineStyle:{
                color:'#fff'
            }
        },
        splitArea: {
            show: true,
            areaStyle: {
                color: color?['#F70012', '#FE6C00', '#FED100',  '#A2EE00', '#34D800']:['#34D800', '#A2EE00', '#A2EE00', '#FED100', '#FE6C00', '#F70012'],
            },
        }
    }],
    series: [{
        name:"上周同期",
        type: 'line',
        showSymbol: false,
        data: y_data1,
        lineStyle:{
            width: 2,
            color: '#D962C7',
            type: 'dashed',
        },            
        itemStyle: {//图例颜色
            normal: {
                color: "#D962C7",
                opacity: 1,
            }
        },
    }, {
        name:"实时",
        type: 'line',
        showSymbol: false,
        data: y_data2,
        lineStyle:{
            width: 3,
            color: '#0ff',
        },
        itemStyle: {
            normal: {
                width: 3,
                color: "#0ff"
            }
        },
        markPoint: {
            //symbol:'roundRect',
            data: [
                y_data2.length < 1? { name: '当前', value: 0, xAxis: "", yAxis: 0 }: 
                {name: '当前', value: y_data2[y_data2.length - 1], xAxis: x_data[y_data2.length-1], yAxis: y_data2[y_data2.length-1]},
            ],
            symbolSize: 60,
            label: {
                color: '#9c218c',
                fontSize: 12,
                fontWeight: 'bold',
            },
            itemStyle: {
                color: '#0f6',
            }
        },
    }]
})

// 双折线图
export const BiLineOption2 = (x_data = [], y_data1 = [], y_data2 = [], name1 = "", name2 = "") => ({
    legend: {
        show: true,
        icon: "rect",
        itemHeight: 3,
        inactiveColor: '#ccc', //图例关闭颜色
        top: "2%",
        orient: "horizontal",
        textStyle:{
            color:'#fff',
        },
        data: [name1, name2],
        
    },
    title: {
        show:false,
        left: 'center',
    },
    grid:{
        left: 50,
        bottom: 40,
        right: 10,
        top: 10,
    },
    tooltip: {
        trigger: 'axis',
        backgroundColor: '#0ff',
        textStyle:{
            color: '#000',
        },
    },
    xAxis: {
        data: x_data,
        axisLabel: {
            textStyle: {
                color: '#fff'
            }
        },
        axisTick:{
            inside:true,
            lineStyle:{
                color:'#fff'
            }
        },
        axisLine:{
            lineStyle:{
                color:'#fff'
            }
        },
    },
    yAxis: {
        splitLine: {show: false},
        axisLabel: {
            textStyle: {
                color: '#fff'
            }
        },
        axisTick:{
            inside:true,
            lineStyle:{
                color:'#fff'
            }
        },
        axisLine:{
            lineStyle:{
                color:'#fff'
            }
        },
    },
    series: [{
        name: name1,
        type: 'line',
        showSymbol: false,
        data: y_data1,
        lineStyle:{
            width: 2,
            color: '#D962C7',
            // type: 'dashed',
        },
        itemStyle: {
            normal: {
                color: "#D962C7",
            },
        },

    }, {
        name: name2,
        type: 'line',
        showSymbol: false,
        data: y_data2,
        lineStyle:{
            width: 3,
            color: '#0ff',
            // type: 'dashed',
        },
        itemStyle: {
            normal: {
                color: "#0ff",
                
            },
        },
    }]
})


function BallDataFormat(v = {
	value: '0,0',
	color: '#5dd054'
}) {
	return [{
		value: 0,
		name: v.value,
		itemStyle: {
			normal: {
				color: new echarts.graphic.LinearGradient(
					0, 0, 0, 1, [{
							offset: 0,
							color: '#00feff'
						},
						{
							offset: 1,
							color: v.color
						}
					]
				)
			}
		},
		label: {
			normal: {
				textStyle: {
					fontSize: 20,
					fontWeight: 500,
					color: '#fff'
				}
			}
		}
	}]
}

function BallChildrenFun(str = '') {
	return [{
		type: 'rect',
		left: 'center',
		top: 'center',
		shape: {
			width: 150,
			height: 40,
			r: 20
		},
		style: {
			fill: '#4709f9',
			shadowColor:'#f909a1',
			shadowOffsetX:3,
			shadowOffsetY:3,
			lineWidth:2,
			shadowBlur:10
			//   stroke: '#00feff'
		}
	}, {
		type: 'text',
		left: 'center',
		top: 'center',
		style: {
			fill: '#fff',
			text: str,
			font: '14px Microsoft YaHei'
		}
	}]
}
// 球图
export const BallOption = (data = [
    {text: '浙A', value: '', color: '#5dd054'}, 
    {text: '非浙A', value: '', color: '#ff6804'}, 
    {text: '小车', value: '', color: '#097ff9'}, 
    {text: '大车', value: '', color: '#ee0'}
]) => ({
    legend: {
        show: false
    },
    tooltip: {
        show: false
    },
    series: [{
        type: 'pie',
        radius: [25, 30],
        center: ['28%', '15%'],
        hoverAnimation: false,
        label: {
            normal: {
                position: 'center'
            }
        },
        data: BallDataFormat(data[0])
    }, {
        type: 'pie',
        radius: [25, 30],
        center: ['78%', '15%'],
        hoverAnimation: false,
        label: {
            normal: {
                position: 'center'
            }
        },
        data: BallDataFormat(data[1])
    }, {
        type: 'pie',
        radius: [25, 30],
        center: ['28%', '68%'],
        hoverAnimation: false,
        label: {
            textStyle:{
                fontSize: 2,
            },
            normal: {
                position: 'center'
            }
        },
        data: BallDataFormat(data[2])
    }, {
        type: 'pie',
        radius: [25, 30],
        center: ['78%', '68%'],
        hoverAnimation: false,
        label: {
            textStyle:{
                fontSize: 2,
            },
            normal: {
                position: 'center'
            }
        },
        data: BallDataFormat(data[3])
    }],
    graphic: {
        elements: [{
                type: 'group',
                left: '12%',
                top: '32%',
                scale:[0.9,0.9],
                z: 100,
                children: BallChildrenFun(data[0].text)
            },
            {
                type: 'group',
                left: '64%',
                top: '32%',
                scale:[0.9,0.9],
                z: 100,
                children: BallChildrenFun(data[1].text)
            },
            {
                type: 'group',
                left: '12%',
                bottom: '2%',
                scale:[0.9,0.9],
                z: 100,
                children: BallChildrenFun(data[2].text)
            },
            {
                type: 'group',
                left: '64%',
                bottom: '2%',
                scale:[0.9,0.9],
                z: 100,
                children: BallChildrenFun(data[3].text)
            }
        ]
    }
})
// 水球图
export const BallOption3 = (value = 0, title = "") => ({
    title: {
        text: (value * 100).toFixed(0) + '{a|%}',
        textStyle: {
            fontSize: 40,
            fontFamily: 'Microsoft Yahei',
            fontWeight: 'normal',
            color: '#bcb8fb',
            rich: {
                a: {
                    fontSize: 28,
                }
            }
        },
        x: 'center',
        y: 'center'
    },
    graphic: [{
        type: 'group',
        left: 'center',
        top: '60%',
        children: [{
            type: 'text',
            z: 100,
            left: '10',
            top: 'middle',
            style: {
                fill: '#aab2fa',
                text: title,
                font: '20px Microsoft YaHei'
            }
        }]
    }],
    series: [{
        type: 'liquidFill',
        radius: '70%',
        center: ['50%', '50%'],
        data: [value, value, value],
        backgroundStyle: {
            color: {
                type: 'linear',
                x: 1,
                y: 0,
                x2: 0.5,
                y2: 1,
                colorStops: [{
                    offset: 1,
                    color: 'rgba(68, 145, 253, 0)'
                }, {
                    offset: 0.5,
                    color: 'rgba(68, 145, 253, .25)'
                }, {
                    offset: 0,
                    color: 'rgba(68, 145, 253, 1)'
                }],
                globalCoord: false
            },
        },
        outline: {
            borderDistance: 0,
            itemStyle: {
                borderWidth: 10,
                borderColor: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0,
                        color: 'rgba(69, 73, 240, 0)'
                    }, {
                        offset: 0.5,
                        color: 'rgba(69, 73, 240, .25)'
                    }, {
                        offset: 1,
                        color: 'rgba(69, 73, 240, 1)'
                    }],
                    globalCoord: false
                },
                shadowBlur: 10,
                shadowColor: '#000',
            }
        },
        color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
                offset: 1,
                color: 'rgba(58, 71, 212, 0)'
            }, {
                offset: 0.5,
                color: 'rgba(31, 222, 225, .2)'
            }, {
                offset: 0,
                color: 'rgba(31, 222, 225, 1)'
            }],
            globalCoord: false
        },
        label: {
            normal: {
                formatter: '',
            }
        }
    }]
})
// 柱状图
export const BarOption = ( x_data = [], y_data = [], color = ['#9DC8C8', '#58C9B9', '#519D9E', '#D1B6E1'] ) => ({
    tooltip : {
        trigger: 'item',
        axisPointer: {},
    },
    grid: {
        top: '8%',
        left: '12%',
        bottom: '12%',
    },
    xAxis: {
        type: 'category',
        data: x_data,
        zlevel: 10,
        boundaryGap: ['0%', '30%'],
        axisLabel: {
            textStyle: {
                color: '#fff'
            }
        },
        axisTick:{
            show:false,
            inside:true,
            lineStyle:{
                color:'#fff'
            }
        },
        axisLine:{
            symbol: ['none','arrow'],
            lineStyle:{
                color:'#fff'
            }
        },
    },
    yAxis: {
        type: 'value',
        zlevel: 10,
        boundaryGap: ['0%', '30%'],
        axisLabel: {
            textStyle: {
                color: '#fff'
            }
        },
        axisTick:{
            inside:true,
            lineStyle:{
                color:'#fff'
            }
        },
        axisLine:{
            symbol: ['none','arrow'],
            lineStyle:{
                color:'#fff'
            }
        },
        splitLine: {
            show:false,
        },
    },
    series: [{
        data: y_data,
        type: 'bar',
        symbol: 'emptyCircle',
        symbolSize: 12,
        barMaxWidth: 22,
        itemStyle:{
            normal:{
                color:  function(d){return color[Math.floor(Math.random()*5)%5];}
            }
        }
    }]
})


// 柱状图   柱体颜色随机
export const BarOption2 = (x_data = [], y_data = [], name = "") => ({
    color: ['#d0570e'],
    grid: {
        top: '8%',
    },
    tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    xAxis : [
        {
            type : 'category',
            data : x_data,
            axisLabel: {
                textStyle: {
                    color: '#fff'
                },
                rotate:40,
            },
            axisTick:{
                inside:true,
                lineStyle:{
                    color:'#fff'
                }
            },
            axisLine:{
                symbol:['none','arrow'],
                symbolSize:6,
                lineStyle:{
                    color:'#fff'
                }
            },
        }
    ],
    yAxis : [
        {
            type : 'value',
            axisLabel: {
                textStyle: {
                    color: '#fff'
                }
            },
            axisTick:{
                inside:true,
                lineStyle:{
                    color:'#fff'
                }
            },
            axisLine:{
                symbol:['none','arrow'],
                symbolSize:6,
                lineStyle:{
                    color:'#fff'
                }
            },
            splitLine:{
                show:false,
            }
        }
    ],
    series : [
        {
            name: name,
            type:'bar',
            barWidth: '60%',
            data: y_data,
            itemStyle:{
                normal:{
                    color:function(d){return "#"+Math.floor(Math.random()*(256*256*256-1)).toString(16);}
                }
            }
        }
    ]
})


// 柱状图
export const BarOption3 = (x_data = [], y_data = [], name = "") => ({
    // color: ['#d0570e'],
    grid: {
        top: '8%',
        bottom: '8%',
        left: '6%',
        right: '6%',
    },
    tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    xAxis : [
        {
            type : 'category',
            data : x_data,
            axisLabel: {
                textStyle: {
                    color: '#000'
                },
                // rotate:40,
            },
            axisTick:{
                inside:true,
                lineStyle:{
                    color:'#000'
                }
            },
            axisLine:{
                symbol:['none','arrow'],
                symbolSize:6,
                lineStyle:{
                    color:'#000'
                }
            },
        }
    ],
    yAxis : [
        {
            type : 'value',
            axisLabel: {
                textStyle: {
                    color: '#000'
                }
            },
            axisTick:{
                inside:true,
                lineStyle:{
                    color:'#000'
                }
            },
            axisLine:{
                symbol:['none','arrow'],
                symbolSize:6,
                lineStyle:{
                    color:'#000'
                }
            },
            splitLine:{
                show:false,
            }
        }
    ],
    series : [
        {
            name: name,
            type:'bar',
            barWidth: '60%',
            data: y_data,
            itemStyle:{
                normal:{
                    color: '#5b8ff9', //function(d){return "#"+Math.floor(Math.random()*(256*256*256-1)).toString(16);}
                }
            }
        }
    ]
})



// 水平柱状图
export const HorizontalBarOption = ( x_data = [], y_data = [] ) => ({
    tooltip: {
        trigger: 'axis',
        backgroundColor: '#0ff',
        textStyle:{
            color: '#000',
        },
        axisPointer: {
            type: 'shadow'
        },
        formatter: "{b}: {c}辆"
    },
    grid: {
        left: '6%',
        right: '6%',
        bottom: '3%',
        top: '6%',
        containLabel: true
    },
    xAxis: {
        type: 'value',
        boundaryGap: ['10%', '28%'],
        axisLabel:{
            show:false,
        },
        axisTick:{
            show:false,
        },
        axisLine:{
            show:false
        },
        splitLine:{
            show:false,
        }
    },
    yAxis: {
        type: 'category',
        data: x_data,
        nameGap: 1,
        axisLabel:{
            show:true,
            textStyle:{
                color: '#fff',
                fontSize: 12,
            },
            margin: -25,
        },
        axisTick:{
            show:false,
            interval: 20,
        },
        axisLine:{
            show:false
        },
        splitLine:{
            show:false,
        },
    },
    series: [
        {
            barWidth:10,
            barGap: '10%',
            label: {
              normal: {
                  show: true,
                  position: 'right',
                  color: '#fff',
                  fontSize: 12,
                  formatter: (e) => {
                      return e.value + '辆';
                  }
              },

            },
            itemStyle: {
                normal: {
                    barBorderRadius: 16,
                    color: {
                        type: 'linear',
                        x: 0,
                        x1: 1,
                        colorStops: [{
                            offset: 0,
                            color: '#02ddff'
                        }, {
                            offset: 1,
                            color: '#00feff'
                        }]
                    }
                }
            },
            type: 'bar',
            data: y_data
        }]
        
})
// 水球图
export const BallOption2 = (titleText = ['', '', '', ''], data = [0, 0, 0, 0]) => ({
    // backgroundColor: '#0c1B2E',
    title: [{
        text: '',
        textStyle: {
            fontWeight: 'normal',
            fontSize: 25,
            color: '#fff',
            fontFamily:  'serif'
        }
    },{
        text: titleText[0],
        left: '12%',
        top: '18%',
        textAlign: 'center',
        textStyle: {
            fontWeight: 'normal',
            color: '#086',
            fontSize: 15,
            fontFamily:  'serif',
            textAlign: 'center'
        }
    }, {
        text: titleText[1],
        left: '83%',
        top: '18%',
        textAlign: 'center',
        textStyle: {
            fontWeight: 'normal',
            color: '#086',
            fontSize: 15,
            textAlign: 'center',
            fontFamily:  'serif'
        }
    }, {
        text: titleText[2],
        left: '12%',
        top: '58%',
        textAlign: 'center',
        textStyle: {
            fontWeight: 'normal',
            color: '#086',
            fontSize: 15,
            textAlign: 'center',
            fontFamily:  'serif'
        }
    }, {
        text: titleText[3],
        left: '83%',
        top: '58%',
        textAlign: 'center',
        textStyle: {
            fontWeight: 'normal',
            color: '#086',
            fontSize: 15,
            textAlign: 'center',
            fontFamily:  'serif',
        }
    }],
    series: [{
        type: 'liquidFill',
        data: [parseFloat(data[0]/(data[0]+data[1])).toFixed(2)],
        direction: 'right', //波浪方向或者静止
        radius: '30%',
        color: ['#00c2ff'],// 水球颜色
        center: ['38%', '30%'], //水球位置
        outline: {
            borderDistance: 0, //内环padding值
            itemStyle: {
                borderWidth: 2, //圆边线宽度
                borderColor: '#00c2ff',
            },
        },
        label: {
            normal: {
                formatter: function(param){
                    return '';
                }, //重置百分比字体为空
            }
        },
        // 内图 背景色 边
        backgroundStyle: {
            borderWidth: 5,
            borderColor: 'rgb(255,0,255,0.9)',
            color: 'rgba(4,24,74,0.8)',
        }
    }, {
        type: 'liquidFill',
        data: [parseFloat(data[1]/(data[0]+data[1])).toFixed(2)],
        direction: 'right', //波浪方向或者静止
        radius: '30%',
        color: ['#ffd97a'],// 水球颜色
        center: ['62%', '30%'], //水球位置
        outline: {
            borderDistance: 0, //内环padding值
            itemStyle: {
                borderWidth: 2, //圆边线宽度
                borderColor: '#ffd97a',
            },
        },
        label: {
            normal: {
                formatter: function(param){
                    return '';
                }, //重置百分比字体为空
                color: 'red',
                insideColor: 'yellow',
                fontSize: 10
            }
        },
        // 内图 背景色 边
        backgroundStyle: {
            borderWidth: 5,
            borderColor: 'rgb(255,0,255,0.9)',
            color: 'rgba(4,24,74,0.8)',
        }
    }, {
        type: 'liquidFill',
        data: [parseFloat(data[2]/(data[2]+data[3])).toFixed(2)],
        direction: 'right', //波浪方向或者静止
        radius: '30%',
        color: ['#ffd97a'],// 水球颜色
        center: ['38%', '70%'], //水球位置
        outline: {
            borderDistance: 0, //内环padding值
            itemStyle: {
                borderWidth: 2, //圆边线宽度
                borderColor: '#ffd97a',
            },
        },
        label: {
            normal: {
                formatter: function(param){
                    return '';
                }, //重置百分比字体为空
                color: 'red',
                insideColor: 'yellow',
                fontSize: 10
            }
        },
        // 内图 背景色 边
        backgroundStyle: {
            borderWidth: 5,
            borderColor: 'rgb(255,0,255,0.9)',
            color: 'rgba(4,24,74,0.8)',
        }
    }, {
        type: 'liquidFill',
        data: [parseFloat(data[3]/(data[2]+data[3])).toFixed(2)],
        direction: 'right', //波浪方向或者静止
        radius: '30%',
        color: ['#00c2ff'],// 水球颜色
        center: ['62%', '70%'], //水球位置
        outline: {
            borderDistance: 0, //内环padding值
            itemStyle: {
                borderWidth: 2, //圆边线宽度
                borderColor: '#ffd97a',
            },
        },
        label: {
            normal: {
                formatter: function(param){
                    return '';
                }, //重置百分比字体为空
                color: 'red',
                insideColor: 'yellow',
                fontSize: 10
            }
        },
        // 内图 背景色 边
        backgroundStyle: {
            borderWidth: 5,
            borderColor: 'rgb(255,0,255,0.9)',
            color: 'rgba(4,24,74,0.8)',
        }
    }]
})

// 雷达图1
export const RadarOption = (y_data1 = [], y_data2 = []) => ({
    normal: {
        top: 200,
        left: 300,
        width: 500,
        height: 400,
        zIndex: 6,
        backgroundColor: "#0c1B2E"
    },
    color: ["rgba(245, 166, 35, 1)", "rgba(19, 173, 255, 1)"],
    title: {
        show: true,
        text: "",
        left: "center",
        top: "6%",
        textStyle: {
            fontSize: 18,
            color: "#fff",
            fontStyle: "normal",
            fontWeight: "normal"
        },
    },
    tooltip: {
        show: false,
        trigger: "item",
    },
    legend: {
        show: true,
        //icon: "line",
        left: "center",
        bottom: "10%",
        orient: "horizontal",
        textStyle: {
            fontSize: 14,
            color: "#fff"
        },
        data: ["吸引量", "发生量"]
    },
    radar: {
        center: ["50%", "50%"],
        radius: "60%",
        startAngle: 90,
        splitNumber: 1,
        shape: "circle",
        splitArea: {
            areaStyle: {
                color: ["transparent"]
            }
        },
        axisLabel: {
            show: false,
            fontSize: 18,
            color: "#fff",
            fontStyle: "normal",
            fontWeight: "normal"
        },
        axisLine: {
            show: false,
            lineStyle: {
                color: "#0ee"
            }
        },
        axisTick:{
            show: true,
        },
        splitLine: {
            show: true,
            lineStyle: {
                color: "black"
            }
        },
        indicator: [{
            name: "",
            max: 16000
        }, {
            name: "",
            max: 16000
        }, {
            name: "",
            max: 16000
        }, {
            name: "",
            max: 16000
        }, {
            name: "",
            max: 16000
        }, {
            name: "",
            max: 16000
        }, {
            name: "",
            max: 16000
        }, {
            name: "",
            max: 16000
        }, {
            name: "",
            max: 16000
        }, {
            name: "",
            max: 16000
        }, {
            name: "",
            max: 16000
        }, {
            name: "",
            max: 16000
        }, {
            name: "",
            max: 16000
        }, {
            name: "",
            max: 16000
        }, {
            name: "",
            max: 16000
        }, {
            name: "",
            max: 16000
        }, {
            name: "",
            max: 16000
        }, {
            name: "",
            max: 16000
        }, {
            name: "",
            max: 16000
        }, {
            name: "",
            max: 16000
        }, {
            name: "",
            max: 16000
        }, {
            name: "",
            max: 16000
        }, {
            name: "",
            max: 16000
        }, {
            name: "",
            max: 16000
        }]
    },
    series: [{
        name: "发生量",
        type: "radar",
        symbol: "none",
        symbolSize: 1,
        areaStyle: {
            normal: {
                color: "rgba(245, 166, 35, 0.1)",
            }
        },	
        itemStyle:{
            color: "rgba(245, 166, 35, 0.1)",
            borderColor:'rgba(245, 166, 35, 0.1)',
            borderWidth:10,
        },
        lineStyle: {
            normal: {
                //type: "",
                color: "#ee0",
                width: 2
            }
        },
        data: y_data1,
    }, {
        name: "吸引量",
        type: "radar",
        symbol: "none",
        symbolSize: 1,
        itemStyle: {
            normal: {
                color:'rgba(19, 173, 255, 1)',
                borderColor: "rgba(19, 173, 255, 0.4)",
                borderWidth: 10
            }
        },
        areaStyle: {
            normal: {
                color: "rgba(19, 173, 255, 0.5)"
            }
        },
        lineStyle: {
            normal: {
                color: "#0ee",	
                width: 2,
                type: "solid"
            }
        },
        data: y_data2,
    }]
})
// 雷达图2
export const RadarOption2 = (x_data = [], y_data = [], tooltipPosition = "right") => ({
    tooltip:{
        show: true,
        position: tooltipPosition,
        backgroundColor: '#0ff',
        textStyle:{
            color: '#000',
        },
    },
    angleAxis: {
        type: 'category',
        data: x_data,
        z: 10,
        boundaryGap: false,
        startAngle: 90,
        polarIndex: 0,
        axisLabel: {
            show: false,
            color: '#fff',
        }
    },
    radiusAxis: {
        min: 0,
        polarIndex: 0,
        max: 'dataMax',
        axisLabel: {
            show: false
        },
        axisTick: {
            show: false
        },
    },
    polar: {
    },
    series: [{
        type: 'bar',
        data: y_data,
        coordinateSystem: 'polar',
        name: '发生量',
    }],
    legend: {
        show: false,
        data: ['发生量']
    }
})
// 饼图
export const PieOption = ( x_data = [], y_data = [], colorList = ['#47A2FF ', '#53C8D1', '#59CB74', '#FBD444', '#7F6AAD', '#585247'] ) => ({
    title: {
        show: false,
        text: '',
        subtext: '3',
        textStyle: {
            fontSize: 16,
            color: '#999',
            lineHeight: 20
        },
        subtextStyle: {
            fontSize: 28,
            color: '#333'
        },
        textAlign: 'center',
    },
    tooltip: {
        trigger: 'item',
    },
    legend: {
        type: 'scroll',
        orient: 'vertical',
        right: 15,
        top: 10,
        bottom: 10,
        textStyle: {
            color: '#fff',
        },
        pageTextStyle: {
            color: '#fff'
        }
    },
    color: colorList,
    series: [
        {
            name: '当事人',
            type: 'pie',
            radius: [50, 70],
            center: ['40%', '50%'],
            label: {
                show: false
            },
            labelLine: {
                show: false
            },
            itemStyle: {
                borderWidth: 3,
                borderColor: '#fff'
            },
            data: y_data.map( (e, i) => ({ name: x_data[i], value: y_data[i] }) ),
        }
    ]
})


// 
export const PieOption2 = (x_data = [], y_data = []) => ({
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    series : [{
        name: '',
        type: 'pie',
        radius : '55%',
        center: ['50%', '60%'],
        data: y_data.map( (e, i) => ({ name: x_data[i], value: y_data[i] }) ),
        itemStyle: {
            emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
        }
    }]
})


// 坐标热力图
export const HeatmapOption = (x_data, y_data, data, names) => {
    
    return {
        tooltip : {
            trigger: 'item',
	        backgroundColor: '#0ff',
	        textStyle:{
	        	color: '#000',
            },
            formatter: (e) => {
                 return `<div>
                    <p>时间：${e.data[0]} <p>
                    <p>设备名称：${names[e.data[1].replace("'", "").replace("'", "")]} <p>
                    <p>传输完整率：${(e.data[2]*100).toFixed(0)}% <p>
                <div>`
            }
        },
        grid: {
            left: '3%',
            right: '3%',
            top: '8%',
            bottom: '10%',
        },
        xAxis: {
            type: 'category',
            data: x_data,
            axisTick: {
                alignWithLabel: true
            },
            axisLabel:{
                color: "#fff",
            },
            axisLine:{
                lineStyle:{
                    color: "#fff",
                }
            },
            axisTick: {
                inside: 'inner',
            }
        },
        yAxis: {
            type: 'category',
            data: y_data,
            axisLabel:{
            	show: false,
                color: "#fff",
            },
            axisLine:{
                lineStyle:{
                    color: "#fff",
                },
            },
            splitLine: {
                show: false,
                color: "#fff",
            },
            axisTick: {
                inside: 'inner',
            },
        },
        visualMap: {
            show:false,
            min: 0,
            max: 1,
            calculable: true,
            realtime: false,
            inRange: {
                color: ['#ffffbf','#ffffbf', '#313695', '#00f']
            }
        },
        series: [{
            name: '设备质量',
            type: 'heatmap',
            data: data,
            itemStyle: {
                emphasis: {
                    borderColor: '#333',
                    borderWidth: 1
                }
            },
            progressive: 1000,
            animation: false
            
        }]
    }
}

// 自定义柱状图
export const BarConfigOption = (x_data = [], y_data = [], color, backgroundColor, chart_title, show_title, chart_bar_width ) => ({
    backgroundColor: backgroundColor,
    title: {
        show: show_title,
        text: chart_title,
        left: "center",
        top: '5%',
        textStyle: {
            fontSize: 16,
            color: '#000',
            lineHeight: 20
        },
    },
    grid: {
        top: '8%',
        bottom: '10%',
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    tooltip: {
        trigger: 'axis'
    },
    xAxis: [{
        type : 'category',
        data : x_data,
        axisLabel: {
            show: true,
            textStyle: {
                color: '#000'
            },
            rotate:40,
        },
        axisTick:{
            inside:true,
            lineStyle:{
                color:'#000'
            }
        },
        axisLine:{
            symbol:['none','arrow'],
            symbolSize:6,
            lineStyle:{
                color:'#000'
            }
        },
    }],
    yAxis: [{
        type : 'value',
        axisLabel: {
            textStyle: {
                color: '#000'
            }
        },
        axisTick:{
            inside:true,
            lineStyle:{
                color:'#000'
            }
        },
        axisLine:{
            symbol:['none','arrow'],
            symbolSize: 6,
            lineStyle:{
                color:'#000'
            }
        },
        splitLine:{
            show:false,
        }
    }],
    series: [{
        name: chart_title,
        type: 'bar',
        barWidth: chart_bar_width + '%',
        data: y_data,
        itemStyle:{
            normal:{
                color: color,
            }
        }
    }],
})


// 自定义折线图
export const LineConfigOption = (x_data = [], y_data = [], color, backgroundColor, chart_title, show_title, chart_bar_width, ) => ({
    backgroundColor: backgroundColor,
    title: {
        show: show_title,
        text: chart_title,
        left: "center",
        top: '5%',
        textStyle: {
            fontSize: 16,
            color: '#000',
            lineHeight: 20
        },
    },
    grid: {
        top: '8%',
        bottom: '10%',
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    tooltip : {
        tooltip: {
            trigger: 'axis'
        },
    },
    xAxis: [{
        type : 'category',
        data : x_data,
        boundaryGap: false,
        axisTick:{
            inside:true,
            lineStyle:{
                color:'#000'
            }
        },
        axisLine:{
            symbol:['none','arrow'],
            symbolSize:6,
            lineStyle:{
                color:'#000'
            }
        },
    }],
    yAxis: [{
        type : 'value',
        axisLabel: {
            textStyle: {
                color: '#000'
            }
        },
        axisTick:{
            inside:true,
            lineStyle:{
                color:'#000'
            }
        },
        axisLine:{
            symbol:['none','arrow'],
            symbolSize: 6,
            lineStyle:{
                color:'#000'
            }
        },
        splitLine:{
            show:false,
        }
    }],
    series: [{
        name: chart_title,
        type: 'line',
        data: y_data,
        itemStyle:{
            normal:{
                color: color,
            }
        }
    }],
})



