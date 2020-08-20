import React, { Component } from 'react'
import { Icon, DatePicker, Select, Tabs, Table } from 'antd'
import Chart from '../../components/chart'
import { AreaOption2, BarOption3 } from '../../config/echartOption'

import './vn.less'

const { TabPane } = Tabs

export default class Vn extends Component {

    state = {
        div12_option: {},
        div21_option: {},
        div22_data: [],
    }


    componentWillMount() {
        let div12_option = AreaOption2(['1', '2', '3'], [1,2,3], "")

        this.cong_link_columns = [{
            dataIndex: 'link_name',
            title: '路段名',
            key: 'link_name',
            width: 300,
        },{
            dataIndex: 'avg_speed',
            title: '速度',
            key: 'avg_speed',
            width: 100,
        }]

        let div22_data = [{
            index: 1,
            link_name: "市心路(道源路-人民路)",
            avg_speed: 32.31,
        }, {
            index: 2,
            link_name: "晨晖路(市心路-高桥路)",
            avg_speed: 32.32,
        }, {
            index: 3,
            link_name: "永晖路(建设一路-建设四路)",
            avg_speed: 32.32,
        }, {
            index: 4,
            link_name: "振宁路(金鸡路-博奥路)",
            avg_speed: 32.32,
        }, {
            index: 5,
            link_name: "金鸡路(飞虹路-振宁路)",
            avg_speed: 32.32,
        }]

        let div21_option = BarOption3(["1", "2", "3"], [1, 2, 3], "路网运行速度")


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
                                <Select defaultValue="0">
                                    <Select.Option value="0">请选择</Select.Option>
                                </Select>
                            </div>
                            <div className="lyf-col-5">
                                <DatePicker />
                            </div>
                        </div>
                        <div className="lyf-row-8">
                            <Chart option = { this.state.div12_option }/>
                        </div>
                    </div>
                </div>
                <div className="lyf-row-5 second-row">
                    <div className="lyf-col-5" className="col-item-1">
                        <Tabs defaultActiveKey="1">
                            <TabPane tab="路段状态" key="1" style={{height: 255}}>
                                <Chart option={ this.state.div21_option }/>
                            </TabPane>
                            <TabPane tab="路口状态" key="2" style={{height: 255}}>
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
                                columns = { this.cong_link_columns }
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
