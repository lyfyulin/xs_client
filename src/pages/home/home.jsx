import React, { Component } from 'react'
import { Icon, Tabs, DatePicker, Table  } from 'antd'
import Chart from '../../components/chart'
import { AreaOption2, BarOption3, GaugeOption2 } from '../../config/echartOption'
import './home.less'


const { TabPane } = Tabs

export default class Home extends Component {

    state = {
        div11_option: {},
        div21_option: {},
        div22_data: [],
        div31_data: [],
        div32_option: {},
    }

    load_data = () => {
        // 拥堵路段
        let cong_speed = 28.6
        let cong_lastweek_speed = 27.6
        let cong_lastyear_speed = 25.8
        let cong_state_index = 2.8

        // 路网状态
        let rdnet_speed = 28.4
        let rdnet_lastweek_speed = 29.2
        let rdnet_today_speed = []

        // 在途车辆数
        let total_vn = 28423
        let car_vn = 24569
        let truckbus_vn = 3854
        let local_vn = 26560
        let nonlocal_vn = 1863

        // 设备质量
        let dev_rcg_rate = 78
        let dev_lastweek_rcg_rate = 76
        let dev_lastyear_rcg_rate = 74

        // 通勤车热点路段


        // 出行时长

        // 出行距离

        // 出行次数





    }

    componentWillMount() {
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

        this.tongqin_link_columns = [{
            dataIndex: 'link_name',
            title: '路段名',
            key: 'link_name',
            width: 300,
        },{
            dataIndex: 'tongqin_vn',
            title: '通勤量',
            key: 'tongqin_vn',
            width: 100,
        }]


        let div11_option = AreaOption2(["1", "2", "3"], [1, 2, 3], "路网运行速度" )
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

        let div31_data = [{
            index: 1,
            link_name: "振宁路",
            tongqin_vn: 32.31,
        }, {
            index: 2,
            link_name: "金鸡路",
            tongqin_vn: 32.32,
        }, {
            index: 3,
            link_name: "建设一路",
            tongqin_vn: 32.32,
        }, {
            index: 4,
            link_name: "博奥路",
            tongqin_vn: 32.32,
        }, {
            index: 5,
            link_name: "潘水路",
            tongqin_vn: 32.32,
        }]

        let div21_option = BarOption3(["1", "2", "3"], [1, 2, 3], "路网运行速度")

        let div32_option = GaugeOption2(78, "设备识别率", "%")
        
        this.setState({
            div11_option, div22_data, div31_data, div21_option, div32_option
        })
    }

    render() {

        return (
            <div className="home">
                <div className="first-row">
                    <div className="row-item">
                        <div className="row-item-title">
                            拥堵路段状态
                        </div>
                        <div className="row-item-subtitle">
                            28.6 km/h
                        </div>
                        <div className="row-item-content">
                            <div className="row-item-content-ele-tab">
                                周同比 <Icon style={{ color: '#f00' }} type="caret-up"/>  12%
                            </div>
                            <div className="row-item-content-ele-tab">
                                年环比 <Icon style={{ color: '#0f0' }} type="caret-down"/>  11%
                            </div>
                        </div>
                        <div className="row-item-foot">
                            拥堵指数 2.8
                        </div>
                    </div>
                    <div className="row-item">
                    <div className="row-item-title">
                            路网平均速度
                        </div>
                        <div className="row-item-subtitle">
                            28.4 km/h
                        </div>
                        <div className="row-item-content">
                            <div className="full">
                                <Chart option={ this.state.div11_option }/>
                            </div>
                        </div>
                        <div className="row-item-foot">
                            上周同期 28.42 km/h
                        </div>
                    </div>
                    <div className="row-item">
                    <div className="row-item-title">
                            在途车辆数
                        </div>
                        <div className="row-item-subtitle">
                            28,423 辆
                        </div>
                        <div className="row-item-content" style={{ flexWrap:'wrap' }}>
                            <div className="row-item-content-ele">
                                <div className="row-item-content-ele-tab">
                                    大型车 <Icon style={{ color: '#f00' }} type="caret-up"/>  3,854
                                </div>
                                <div className="row-item-content-ele-tab">
                                    小客车 <Icon style={{ color: '#0f0' }} type="caret-down"/>  24,569
                                </div>
                            </div>
                            <div className="row-item-content-ele">
                                <div className="row-item-content-ele-tab">
                                    浙A <Icon style={{ color: '#0f0' }} type="caret-down"/>  26,560
                                </div>
                                <div className="row-item-content-ele-tab">
                                    非浙A <Icon style={{ color: '#0f0' }} type="caret-down"/>  1,863
                                </div>
                            </div>
                        </div>
                        <div className="row-item-foot">
                            上周同期 
                        </div>
                    </div>
                    <div className="row-item">
                    <div className="row-item-title">
                            设备识别率
                        </div>
                        <div className="row-item-subtitle">
                            78%
                        </div>
                        <div className="row-item-content">

                        </div>
                        <div className="row-item-foot" style={{ display: 'flex', flexWrap: 'nowrap' }}>
                            <div className="row-item-foot-ele-tab">
                                周同比 <Icon style={{ color: '#f00' }} type="caret-up"/>  12%
                            </div>
                            <div className="row-item-foot-ele-tab">
                                年环比 <Icon style={{ color: '#0f0' }} type="caret-down"/>  11%
                            </div>
                        </div>
                    </div>
                </div>

                <div className="second-row">
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
                    <div className="lyf-col-5" className="col-item-2">
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

                
                <div className="third-row">
                    <div className="lyf-col-5 col-item-1">
                        <div className="col-item-1-title">
                            通勤热点
                        </div>
                        <div className="col-item-1-content">
                            <Table 
                                rowKey = "index"
                                showHeader = { false }
                                columns = { this.tongqin_link_columns }
                                dataSource = { this.state.div31_data }
                                pagination = { false }
                            />
                        </div>
                    </div>
                    <div className="lyf-col-5 col-item-2">
                        <div className="col-item-2-title">
                            设备质量
                        </div>
                        <div className="col-item-2-content lyf-center">
                            <div className="lyf-col-5">
                                <div className="lyf-row-2 lyf-center lyf-font-2">
                                    设备识别率
                                </div>
                                <div className="lyf-row-8">
                                    <Chart option={ this.state.div32_option }/>
                                </div>
                            </div>
                            <div className="lyf-col-5">
                                <div className="lyf-row-2 lyf-center lyf-font-2">
                                    设备传输率
                                </div>
                                <div className="lyf-row-8">
                                    <Chart option={ this.state.div32_option }/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="forth-row">
                    <Tabs defaultActiveKey="1">
                        <TabPane 
                            tab={<div><div style={{ height: 30 }}>出行时长</div><div style={{ textAlign: 'left', fontSize: 30 }}>16.2分钟</div></div>} 
                            key="1" 
                            style={{ height: 200 }}
                        >
                            <Chart option={ this.state.div11_option }/>
                        </TabPane>
                        <TabPane 
                            tab={<div><div style={{ height: 30 }}>出行距离</div><div style={{ textAlign: 'left', fontSize: 30 }}>5 km</div></div>} 
                            key="2" 
                            style={{ height: 200 }}
                        >
                            <Chart option={ this.state.div11_option }/>
                        </TabPane>
                        <TabPane 
                            tab={<div><div style={{ height: 30 }}>出行次数</div><div style={{ textAlign: 'left', fontSize: 30 }}>1 次</div></div>} 
                            key="3" 
                            style={{ height: 200 }}
                        >
                            <Chart option={ this.state.div11_option }/>
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        )
    }
}
