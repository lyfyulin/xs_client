import React, { Component } from 'react'
import { Tabs, Table, Tag, DatePicker } from 'antd'
import L from 'leaflet'
import { MAP_CENTER, TMS, LINK_INFO2 } from '../../utils/xiaoshan'
import Chart from '../../components/chart'
import { tongqin_link_flow, tongqin_flow_hour } from '../../utils/mock_data/tongqin_data'

import { GaugeOption3, AreaOption2 } from '../../config/echartOption'
import './tongqin.less'
import { tongqin_hot_road_top } from '../../utils/mock_data/home_data'

const { TabPane } = Tabs

export default class Tongqin extends Component {

    state = {
        firstRender: true,
        div11_data: [],
        div31_option: {},
        div32_option: {},
    }
    
    initTongqin = () => {
        for(let i = 0; i < LINK_INFO2.length; i++){
            let line = L.polyline(LINK_INFO2[i], {color: '#0ff', opacity:parseInt(tongqin_link_flow[i][1] / 1200) })
            line.addTo(this.map)
        }
    }

    initMap = async() => {
        let { firstRender } = this.state

        if( firstRender ){
            this.setState({ firstRender: false })
            this.map = L.map('map', {
                center: MAP_CENTER, 
                zoom: 12, 
                zoomControl: false, 
                attributionControl: false, 
            })
            L.tileLayer(TMS, { maxZoom: 16, minZoom: 9 }).addTo(this.map)

            this.initTongqin()
        }
        // this.map._onResize()
    }

    componentWillMount() {
        this.tongqin_hotroad_columns = [{
            dataIndex: 'index',
            title: '热点路段',
            key: 'index',
            render: index => index < 4?<Tag color="#108ee9">{ index }</Tag>:<Tag color="">{ index }</Tag>
        },{
            dataIndex: 'link_name',
            title: '路段名称',
            key: 'link_name',
        },{
            dataIndex: 'flow',
            title: '流量',
            key: 'flow',
        }]

        let div11_data = tongqin_hot_road_top.map( (e, i) => ({ index: (i + 1), ...e }) )


        let div31_option = AreaOption2([], tongqin_flow_hour, '通勤车辆数')
        let div32_option = AreaOption2([], tongqin_flow_hour, '历史车辆数')

        this.setState({
            div11_data, div31_option, div32_option
        })
    }

    componentDidMount() {
        this.initMap()
    }

    render() {
        return (
            <div className="tongqin">
                <Tabs defaultActiveKey="1" className="full">
                    <TabPane tab="热点路段" key="1" className="col-item">
                        <div className="col-item-left">
                            <Table
                                rowKey = "index"
                                showHeader = { false }
                                pagination = { false }
                                dataSource = { this.state.div11_data }
                                columns = { this.tongqin_hotroad_columns }
                            />

                        </div>
                        <div className="col-item-middle">
                            <div className="full" id="map">

                            </div>

                        </div>
                        <div className="col-item-right">
                            <div className="lyf-row-5">
                                <div style={{ height: 45, paddingLeft: 10, fontSize: 20,display: 'flex', alignItems: 'center' }}>
                                    路段车辆数
                                </div>
                                <div style={{ height: "calc(100% - 45px)", padding: 20 }}>
                                    <div className="lyf-row-2" style={{ display: 'flex', alignItems: 'center' }}>
                                        通勤车辆数：2,143 辆
                                    </div>
                                    <div className="lyf-row-6">
                                        <Chart option={ this.state.div31_option }/>
                                    </div>
                                </div>
                            </div>
                            <div className="lyf-row-5">
                                <div style={{ height: 45, paddingLeft: 10, fontSize: 20, display: 'flex', alignItems: 'center' }}>
                                    历史车辆数
                                </div>
                                <div style={{ height: "calc(100% - 45px)", padding: 20 }}>
                                    <div className="lyf-row-2">
                                        日期：<DatePicker size="small"/>
                                    </div>
                                    <div className="lyf-row-6">
                                        <Chart option={ this.state.div32_option }/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabPane>
                    <TabPane tab="热点点位" key="2" className="col-item">
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}
