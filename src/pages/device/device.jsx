import React, { Component } from 'react'
import { Tabs, Table, Tag, DatePicker } from 'antd'
import L from 'leaflet'
import { MAP_CENTER, TMS } from '../../utils/xiaoshan'
import Chart from '../../components/chart'

import { GaugeOption3, AreaOption2 } from '../../config/echartOption'
import './device.less'
import { dev_rcg_rate_top, last_day_dev_quality, search_dev_quality } from '../../utils/mock_data/dev_data'

const { TabPane } = Tabs

export default class Device extends Component {

    state = {
        firstRender: true,
        div11_data: [],
        div31_option: {},
        div32_option: {},
    }

    initDevice = () => {
        
        for(let i = 0; i < last_day_dev_quality.length; i++){
            let dt = last_day_dev_quality[i]
            let pt = L.circle([parseFloat(dt[7]), parseFloat(dt[6])], { color: ['#f00', '#0f0'][parseFloat(dt[4])<0.1?0:1] })
            pt.addTo(this.map)
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
            this.initDevice()
        }
        // this.map._onResize()
    }

    componentWillMount() {
        this.dev_rcg_rate_columns = [{
            dataIndex: 'index',
            title: '质量排名',
            key: 'index',
            render: index => index < 4?<Tag color="#108ee9">{ index }</Tag>:<Tag color="">{ index }</Tag>
        },{
            dataIndex: 'dev_name',
            title: '设备名称',
            key: 'dev_name',
        },{
            dataIndex: 'rcg_rate',
            title: '速度',
            key: 'rcg_rate',
        }]

        let div11_data = dev_rcg_rate_top.map( (e, i) => ({ index: (i + 1), dev_name: e[0], rcg_rate:e[3]*100+'%' }) )

        let div31_option = GaugeOption3(3, "拥堵指数", "%", 10)
        let div32_option = AreaOption2([], search_dev_quality, '')

        this.setState({
            div11_data, div31_option, div32_option
        })
    }

    componentDidMount() {
        this.initMap()
    }

    render() {
        return (
            <div className="device">
                <Tabs defaultActiveKey="1" className="full">
                    <TabPane tab="设备传输率" key="1" className="col-item">
                        <div className="col-item-left">
                            <Table
                                rowKey = "index"
                                showHeader = { false }
                                pagination = { false }
                                dataSource = { this.state.div11_data }
                                columns = { this.dev_rcg_rate_columns }
                            />

                        </div>
                        <div className="col-item-middle">
                            <div className="full" id="map">

                            </div>

                        </div>
                        <div className="col-item-right">
                            <div className="lyf-row-5">
                                <div style={{ height: 45, paddingLeft: 10, fontSize: 20,display: 'flex', alignItems: 'center' }}>
                                    设备状态
                                </div>
                                <div style={{ height: "calc(100% - 45px)", padding: 20 }}>
                                    <div className="lyf-row-2" style={{ fontSize: 20, display: 'flex', alignItems: 'center' }}>
                                        识别率：82%
                                    </div>
                                    <div className="lyf-row-6">
                                        <Chart option={ this.state.div31_option }/>
                                    </div>
                                </div>
                            </div>
                            <div className="lyf-row-5">
                                <div style={{ height: 45, paddingLeft: 10, fontSize: 20, display: 'flex', alignItems: 'center' }}>
                                    历史状态
                                </div>
                                <div style={{ height: "calc(100% - 45px)", padding: 20 }}>
                                    <div className="lyf-row-2">
                                        日期：<DatePicker size="small"/>
                                    </div>
                                    <div className="lyf-row-2 lyf-center">
                                        识别率：82%
                                    </div>
                                    <div className="lyf-row-6">
                                        <Chart option={ this.state.div32_option }/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabPane>
                    <TabPane tab="设备识别率" key="2" className="col-item">
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}
