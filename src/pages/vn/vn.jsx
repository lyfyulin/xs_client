import React, { Component } from 'react'
import { Icon, DatePicker, Select, Tabs, Table } from 'antd'
import Chart from '../../components/chart'
import { AreaOption2, BarOption3 } from '../../config/echartOption'
import { current_urban_total_vn, today_urban_vn, today_ban_vn, foreign_truck_node } from '../../utils/mock_data/vn_data'
import './vn.less'

const { TabPane } = Tabs

export default class Vn extends Component {

    state = {
        vn_id: 1,
        div12_option: {},
        div21_option: {},
        div22_data: [],
    }

    get_vn = (vn_id) => {
        switch(vn_id){
            case 1:
                return AreaOption2([], today_urban_vn.map( e => e[0] ), "核心区在途车辆数")
                break
            case 2:
                return AreaOption2([], today_urban_vn.map( e => e[1] ), "核心区外地车")
                break
            case 3:
                return AreaOption2([], today_urban_vn.map( e => e[2] ), "核心区本地车")
                break
            case 4:
                return AreaOption2([], today_urban_vn.map( e => e[3] ), "核心区大车")
                break
            case 5:
                return AreaOption2([], today_urban_vn.map( e => e[4] ), "核心区小车")
                break
            case 6:
                    return AreaOption2([], today_urban_vn.map( e => e[5] ), "核心区工程车")
                    break
            case 7:
                    return AreaOption2([], today_ban_vn.map( e => e[0] ), "区外流出")
                    break
            case 8:
                    return AreaOption2([], today_ban_vn.map( e => e[1] ), "限行区本地车")
                    break
            default:
                return AreaOption2([], today_urban_vn.map( e => e[1] ), "限行区绿牌")
        }
    }

    componentWillMount() {
        let div12_option = AreaOption2([], [1,2,3], "")

        this.foreign_node_columns = [{
            dataIndex: 'device_name',
            title: '边缘点位',
            key: 'device_name',
            width: 300,
        },{
            dataIndex: 'total_vn',
            title: '速度',
            key: 'total_vn',
            width: 100,
        }]

        let div22_data = foreign_truck_node.slice(0, 5).map( (e, i) => ({ index: (i+1), ...e }))


        let div21_option = BarOption3(foreign_truck_node.map( e => e.device_name ), foreign_truck_node.map( e => e.total_vn ), "点位外地货车")


        this.setState({ div12_option, div21_option, div22_data })
    }
    
    render() {
        return (
            <div className="vn">
                <div className="first-row">
                    <div className="lyf-col-3 col-item-1">
                        <div className="col-item-title">
                            在途车辆数
                        </div>
                        <div className="col-item-subtitle">
                            28,135 辆
                        </div>
                        <div className="col-item-content">
                            <div className="col-item-content-ele">
                                <div className="col-item-content-ele-tab">
                                    大型车 <Icon style={{ color: '#f00' }} type="caret-up"/>  3,854
                                </div>
                                <div className="col-item-content-ele-tab">
                                    小客车 <Icon style={{ color: '#0f0' }} type="caret-down"/>  24,569
                                </div>
                            </div>
                            <div className="col-item-content-ele">
                                <div className="col-item-content-ele-tab">
                                    浙A <Icon style={{ color: '#0f0' }} type="caret-down"/>  26,560
                                </div>
                                <div className="col-item-content-ele-tab">
                                    非浙A <Icon style={{ color: '#0f0' }} type="caret-down"/>  1,863
                                </div>
                            </div>
                            <div className="col-item-content-ele">
                                <div className="col-item-content-ele-tab">
                                    货车 <Icon style={{ color: '#0f0' }} type="caret-down"/>  26,560
                                </div>
                                <div className="col-item-content-ele-tab">
                                    工程车 <Icon style={{ color: '#0f0' }} type="caret-down"/>  1,863
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="lyf-col-7 col-item-2">
                        <div className="lyf-row-2" style={{ display: 'flex', flexWrap: 'nowrap' }}>
                            <div className="lyf-col-5">
                                <Select defaultValue="1" onChange = {(value) => { this.setState({ vn_id: value }) }} >
                                    <Select.Option value="0">请选择</Select.Option>
                                    <Select.Option value="1">全区在途车辆数</Select.Option>
                                    <Select.Option value="2">全区外地车</Select.Option>
                                    <Select.Option value="3">全区本地车</Select.Option>
                                    <Select.Option value="4">全区大货车</Select.Option>
                                    <Select.Option value="5">全区小客车</Select.Option>
                                    <Select.Option value="6">全区工程车</Select.Option>
                                    <Select.Option value="7">限行区在途车辆数</Select.Option>
                                    <Select.Option value="8">限行区外地车</Select.Option>
                                    <Select.Option value="9">限行区绿牌车</Select.Option>
                                </Select>
                            </div>
                            <div className="lyf-col-5">
                                <DatePicker />
                            </div>
                        </div>
                        <div className="lyf-row-8">
                            <Chart option = { this.get_vn(this.state.vn_id) }/>
                        </div>
                    </div>
                </div>
                <div className="lyf-row-5 second-row">
                    <div className="lyf-col-5" className="col-item-1">
                        <Tabs defaultActiveKey="1">
                            <TabPane tab="货车点位" key="1" style={{height: 255}}>
                                <Chart option={ this.state.div21_option }/>
                            </TabPane>
                        </Tabs>
                    </div>
                    <div className="lyf-col-5 col-item-2">
                        <div className="col-item-2-title">
                            <DatePicker/>
                        </div>
                        <div className="col-item-2-content">
                            <Table 
                                rowKey = "index"
                                showHeader = { false }
                                columns = { this.foreign_node_columns }
                                dataSource = { this.state.div22_data }
                                pagination = { false }
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
