import React, { Component } from 'react'
import { Form, Select, message, Input, Button, Radio, Checkbox } from 'antd'
import Chart from '../../components/chart'
import { LineOption, BarConfigOption, LineConfigOption, AreaConfigOption } from '../../config/echartOption'
import { COLOR_LIST } from '../../utils/ConstantUtils'
import { NODE_INFO } from '../../utils/baoshan'

const Item = Form.Item
const Option = Select.Option

export default class OptionalChart extends Component {

    state = {
        option: {},
        chart_style: "1",
        chart_bar_width: 10,
        chart_bar_span: 20,
        show_title: true,
        chart_color: '#00FF00',
        chart_background: '#ccc'
    }

    handle_chart_data = (search_type, data) => {
        let x_data, y_data, title
        switch(search_type){
            case 'car/nonlocal':
                x_data = data.map( e => e.time_point )
                y_data = data.map( e => e.foreign_ratio )
                title = "外地车比例"
                break;
            case 'car/tongqin':
                x_data = data.map( e => e.time_point )
                y_data = data.map( e => e.tongqin_ratio )
                title = "通勤车比例"
                break;
            case 'car/taxi':
                x_data = data.map( e => e.time_point )
                y_data = data.map( e => e.taxi_num )
                title = "出租车量"
                break;
            case 'car/online':
                x_data = data.map( e => e.time_point )
                y_data = data.map( e => e.carhailing_num )
                title = "网约车量"
                break;
            case 'od/cnts':
                x_data = data.map( e => e.time_point.substr(0, 10) )
                y_data = data.map( e => e.cnts )
                title = "出行总量"
                break;
            case 'od/o_cnts':
                x_data = data.map( e => NODE_INFO[e.o_node-1][1] )
                y_data = data.map( e => e.cnts )
                title = "发生量"
                break;
            case 'od/d_cnts':
                x_data = data.map( e => NODE_INFO[e.d_node-1][1] )
                y_data = data.map( e => e.cnts )
                title = "吸引量"
                break;
            case 'od/trip_time':
                x_data = data.map( e => e.time_point.substr(0, 10) )
                y_data = data.map( e => e.avg_trip_time )
                title = "出行时长"
                break;
            case 'od/trip_dist':
                x_data = data.map( e => e.time_point.substr(0, 10) )
                y_data = data.map( e => e.avg_trip_dist )
                title = "出行距离"
                break;
            case 'od/trip_freq':
                x_data = data.map( e => e.time_point )
                y_data = data.map( e => e.avg_trip_freq )
                title = "出行次数"
                break;
            case "state/rdnet": 
                x_data = data.map( e => e.time_point )
                y_data = data.map( e => e.speed )
                title = "道路车均速度"
                break;
            case "state/vn": 
                x_data = data.map( e => e.time_point )
                y_data = data.map( e => e.all_num )
                title = "在途车辆数"
                break;
            case "state/intersection": 
                x_data = data.map( e => e.time_point )
                y_data = data.map( e => e.avg_delay )
                title = "路口车均延误"
                break;
            case "state/road":
                x_data = data.map( e => e.time_point )
                y_data = data.map( e => e.speed )
                title = "干道速度"
                break;
            case "state/link":
                x_data = data.map( e => e.time_point )
                y_data = data.map( e => e.speed )
                title = "路段速度"
                break;
            case "device/rcg_rate":
                x_data = data.map( e => e.time_point )
                y_data = data.map( e => e.rcg_rate )
                title = "设备识别率"
                break;
            case "device/not_miss_rate":
                x_data = data.map( e => e.time_point )
                y_data = data.map( e => e.not_miss_rate )
                title = "设备传输率"
                break;
            default:
                message.error("无法显示！")
                x_data = []
                y_data = []
                title = ""
        }
        return {x_data, y_data, title}
    }
    
    componentWillReceiveProps = (nextProps) => {
        let { search_type, data } = nextProps
        
        if(data.length > 0){
            let {x_data, y_data, title} = this.handle_chart_data(search_type, data)
            let option
            switch(this.state.chart_style){
                case "1":
                    option = BarConfigOption(x_data, y_data, this.state.chart_color, this.state.chart_background, title, this.state.show_title, this.state.chart_bar_width)
                    break;
                case "2":
                    option = LineConfigOption(x_data, y_data, this.state.chart_color, this.state.chart_background, title, this.state.show_title, this.state.chart_bar_width)
                    break;
                default:
                    message.error("展示失败！")
            }
            this.setState({ option })
        }
    }

    render() {

        const { option } = this.state

        const formLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 14 },
        }

        return (
            <div className="full" style={{ display: "flex", flexWrap: 'nowrap', backgroundColor: "#ccc" }}>
                <div className="lyf-col-7" style={{ border: '3px solid #0ff' }}>
                    <Chart option={ option }/>
                </div>
                <div className="lyf-col-3">
                    <Form
                        className="full"
                        { ...formLayout }
                    >
                        <Item label="图表类型" style={{ height: 40 }}>
                            <Select defaultValue="1" size="small" onChange = { (value) => this.setState({ chart_style: value }) }>
                                <Option value="1">柱状图</Option>
                                <Option value="2">折线图</Option>
                            </Select>
                        </Item>
                        <Item label="图表颜色" style={{ height: 40 }}>
                            <Select defaultValue="#00FF00" size="small" onChange = { (value) => this.setState({ chart_color: value }) }>
                                {
                                    COLOR_LIST.map( e => <Option key={e.value} value={e.value}>{e.name}</Option> )
                                }
                            </Select>
                        </Item>
                        <Item label="背景颜色" style={{ height: 40 }}>
                            <Select defaultValue="#ccc" size="small" onChange = { (value) => this.setState({ chart_background: value }) }>
                                {
                                    COLOR_LIST.map( e => <Option key={e.value} value={e.value}>{e.name}</Option> )
                                }
                            </Select>
                        </Item>
                        <Item label="柱宽" style={{ height: 40 }}>
                            <Input type="number" size="small" min="1" max="100" defaultValue="10" onChange={ (e) => this.setState({ chart_bar_width: e.target.value }) }/>
                        </Item>
                        <div label="标题" className="lyf-center" style={{ height: 40, width: '100%' }}>
                            <Checkbox defaultChecked onChange={ (e) => this.setState({ show_title: e.target.checked }) }>显示图标题</Checkbox>
                        </div>
                    </Form>
                </div>

            </div>
        )
    }
}
