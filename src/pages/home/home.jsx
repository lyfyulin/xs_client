import React, { Component } from 'react'
import { Icon, Tabs, DatePicker, Table  } from 'antd'
import Chart from '../../components/chart'
import { AreaOption2, LineOption2, GaugeOption2 } from '../../config/echartOption'
import { current_cong, current_rdnet, today_rdnet, current_whole_vn, last_devs_rcg_rate, current_road_state_top,
    search_road_state, tongqin_hot_road_top, tongqin_hot_node_top, od_trip_dist, od_trip_freq, od_trip_time, 
    od_avg_trip_dist, od_avg_trip_freq, od_avg_trip_time 
} from '../../utils/mock_data/home_data'

import { time_point, link_data, node_data, dev_data } from '../../utils/mock_data/origin_data'

import './home.less'

const { TabPane } = Tabs

export default class Home extends Component {

    state = {
        current_cong, current_rdnet, today_rdnet, current_whole_vn, last_devs_rcg_rate, current_road_state_top,
        search_road_state, tongqin_hot_road_top, tongqin_hot_node_top, od_trip_dist, od_trip_freq, od_trip_time, 
        od_avg_trip_dist, od_avg_trip_freq, od_avg_trip_time,
        div11_option: {},
        div21_option: {},
        div22_data: [],
        div31_data: [],
        div32_option: {},
        div33_option: {},
        div41_option: {}, 
        div42_option: {}, 
        div43_option: {},
    }

    load_data = () => {
        // 拥堵路段
        let cong_speed = current_cong.cong_speed
        let cong_last_week_speed = current_cong.last_week
        let cong_last_year_speed = current_cong.last_year
        let cong_state_index = current_cong.state_index

        // 路网状态
        let rdnet_speed = current_rdnet.rdnet_speed
        let rdnet_last_week_speed = current_rdnet.last_week
        let rdnet_today_speed = today_rdnet

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

        this.road_columns = [{
            dataIndex: 'road_name',
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
            dataIndex: 'flow',
            title: '通勤量',
            key: 'flow',
            width: 100,
        }]

        let div11_option = AreaOption2(time_point.slice(0, today_rdnet.length - 1), today_rdnet, "路网运行速度" )

        let div22_data = current_road_state_top.slice(0, 5).map( (e, i) => ({ index: (i + 1), ...e }) )

        

        let div31_data = tongqin_hot_road_top.slice(0, 5).map( (e, i) => ({ index: (i + 1), ...e }) )

        
        let div21_option = LineOption2(time_point.slice(0, search_road_state.length - 1), search_road_state, "路网运行速度")

        let div32_option = GaugeOption2(91.01, "设备识别率", "%")

        let div33_option = GaugeOption2(91.23, "设备传输率", "%")

        let div41_option = LineOption2(od_trip_time.map( e => e[0] ), od_trip_time.map( e => e[1] ), "")
        let div42_option = LineOption2(od_trip_dist.map( e => e[0] ), od_trip_dist.map( e => e[1] ), "")
        let div43_option = LineOption2(od_trip_freq.map( e => e[0] ), od_trip_freq.map( e => e[1] ), "")
        
        this.setState({
            div11_option, div22_data, div31_data, div21_option, div32_option, div33_option,
            div41_option, div42_option, div43_option
        })
        
    }

    render() {

        let {
            current_cong, current_rdnet, today_rdnet, current_whole_vn, last_devs_rcg_rate, current_road_state_top,
            search_road_state, tongqin_hot_road_top, tongqin_hot_node_top, od_trip_dist, od_trip_freq, od_trip_time, 
            od_avg_trip_dist, od_avg_trip_freq, od_avg_trip_time
        } = this.state

        return (
            <div className="home">
                <div className="first-row">
                    <div className="row-item">
                        <div className="row-item-title">
                            拥堵路段状态
                        </div>
                        <div className="row-item-subtitle">
                            { current_cong.cong_speed } km/h
                        </div>
                        <div className="row-item-content">
                            <div className="row-item-content-ele-tab">
                                周同比 <Icon style={{ color: '#f00' }} type="caret-up"/>  1.3%
                            </div>
                            <div className="row-item-content-ele-tab">
                                年环比 <Icon style={{ color: '#0f0' }} type="caret-down"/>  2.1%
                            </div>
                        </div>
                        <div className="row-item-foot">
                            拥堵指数 { current_cong.state_index }
                        </div>
                    </div>
                    <div className="row-item">
                    <div className="row-item-title">
                            路网平均速度
                        </div>
                        <div className="row-item-subtitle">
                            { current_rdnet.rdnet_speed } km/h
                        </div>
                        <div className="row-item-content">
                            <div className="full">
                                <Chart option={ this.state.div11_option }/>
                            </div>
                        </div>
                        <div className="row-item-foot">
                            上周同期 { current_rdnet.last_week } km/h
                        </div>
                    </div>
                    <div className="row-item">
                    <div className="row-item-title">
                            在途车辆数
                        </div>
                        <div className="row-item-subtitle">
                            { current_whole_vn.total_vn } 辆
                        </div>
                        <div className="row-item-content" style={{ flexWrap:'wrap' }}>
                            <div className="row-item-content-ele">
                                <div className="row-item-content-ele-tab">
                                    大型车 <Icon style={{ color: '#f00' }} type="caret-up"/>  { current_whole_vn.truck_vn }
                                </div>
                                <div className="row-item-content-ele-tab">
                                    小客车 <Icon style={{ color: '#0f0' }} type="caret-down"/>  { current_whole_vn.car_vn }
                                </div>
                            </div>
                            <div className="row-item-content-ele">
                                <div className="row-item-content-ele-tab">
                                    浙A <Icon style={{ color: '#0f0' }} type="caret-down"/>  { current_whole_vn.local_vn }
                                </div>
                                <div className="row-item-content-ele-tab">
                                    非浙A <Icon style={{ color: '#0f0' }} type="caret-down"/>  { current_whole_vn.foreign_vn }
                                </div>
                            </div>
                        </div>
                        <div className="row-item-foot">
                            上周同期 { current_whole_vn.last_week }
                        </div>
                    </div>
                    <div className="row-item">
                    <div className="row-item-title">
                            设备识别率
                        </div>
                        <div className="row-item-subtitle">
                            { last_devs_rcg_rate.last_day * 100 + '%' }
                        </div>
                        <div className="row-item-content">

                        </div>
                        <div className="row-item-foot" style={{ display: 'flex', flexWrap: 'nowrap' }}>
                            <div className="row-item-foot-ele-tab">
                                周同比 <Icon style={{ color: '#f00' }} type="caret-down"/>  4%
                            </div>
                            <div className="row-item-foot-ele-tab">
                                年环比 <Icon style={{ color: '#f00' }} type="caret-down"/>  3%
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
                                columns = { this.road_columns }
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
                                    <Chart option={ this.state.div33_option }/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="forth-row">
                    <Tabs defaultActiveKey="1">
                        <TabPane 
                            tab={<div><div style={{ height: 30 }}>出行时长</div><div style={{ textAlign: 'left', fontSize: 30 }}>{ od_avg_trip_time }分钟</div></div>} 
                            key="1" 
                            style={{ height: 200 }}
                        >
                            <Chart option={ this.state.div41_option }/>
                        </TabPane>
                        <TabPane 
                            tab={<div><div style={{ height: 30 }}>出行距离</div><div style={{ textAlign: 'left', fontSize: 30 }}>{ od_avg_trip_dist } km</div></div>} 
                            key="2" 
                            style={{ height: 200 }}
                        >
                            <Chart option={ this.state.div42_option }/>
                        </TabPane>
                        <TabPane 
                            tab={<div><div style={{ height: 30 }}>出行次数</div><div style={{ textAlign: 'left', fontSize: 30 }}>{ od_avg_trip_freq } 次</div></div>} 
                            key="3" 
                            style={{ height: 200 }}
                        >
                            <Chart option={ this.state.div43_option }/>
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        )
    }
}
