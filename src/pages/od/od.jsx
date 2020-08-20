import React, { Component } from 'react'
import { Tabs, Table, Tag, DatePicker } from 'antd'
import L from 'leaflet'
import { MAP_CENTER, TMS } from '../../utils/xiaoshan'
import Chart from '../../components/chart'

import './od.less'
import { GaugeOption3, AreaOption2, BarOption2 } from '../../config/echartOption'

const { TabPane } = Tabs

export default class State extends Component {

    state = {
        firstRender: true,
        displayRight: false,
        div11_data: [],
        div31_option: {},
        div32_option: {},
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
        }
        // this.map._onResize()
    }

    componentWillMount() {
        this.link_state_columns = [{
            dataIndex: 'index',
            title: '拥堵排名',
            render: index => index < 4?<Tag color="#108ee9">{ index }</Tag>:<Tag color="">{ index }</Tag>
        },{
            dataIndex: 'link_name',
            title: '路段名称',
            render: link_name => <a 
                onClick ={ () => { this.state.displayRight?this.setState({ displayRight: true }):console.log("右侧窗口已打开，请读数据就好了！") } }
            >
                { link_name }
            </a>
        },{
            dataIndex: 'avg_speed',
            title: '速度',
        }]

        let div11_data = [{
            index: 1,
            link_name: '路段1',
            avg_speed: 35,
        },{
            index: 2,
            link_name: '路段1',
            avg_speed: 35,
        },{
            index: 3,
            link_name: '路段1',
            avg_speed: 35,
        },{
            index: 4,
            link_name: '路段1',
            avg_speed: 35,
        },{
            index: 5,
            link_name: '路段1',
            avg_speed: 35,
        },{
            index: 6,
            link_name: '路段1',
            avg_speed: 35,
        },{
            index: 7,
            link_name: '路段1',
            avg_speed: 35,
        },{
            index: 8,
            link_name: '路段1',
            avg_speed: 35,
        },{
            index: 9,
            link_name: '路段1',
            avg_speed: 35,
        },{
            index: 10,
            link_name: '路段1',
            avg_speed: 35,
        },]

        let div31_option = GaugeOption3(3, "拥堵指数", "km/h", 10)
        let div32_option = BarOption2(['1', '2', '3'], [1, 2, 3], '平均速度')

        this.setState({
            div11_data, div31_option, div32_option
        })
    }

    componentDidMount() {
        this.initMap()
    }

    render() {
        const { displayRight } = this.state
        return (
            <div className="od">
                <Tabs defaultActiveKey="1" className="full">
                    <TabPane tab="发生点" key="1" className="col-item">
                        <div className="col-item-left">
                            <Table
                                rowKey = "index"
                                showHeader = { false }
                                pagination = { false }
                                dataSource = { this.state.div11_data }
                                columns = { this.link_state_columns }
                            />

                        </div>
                        <div className="col-item-middle">
                            <div className="full" id="map">

                            </div>

                        </div>
                        <div className="col-item-right" style={{ display: displayRight?"block":"none" }}>
                            <div className="lyf-row-5">
                                <div style={{ height: 45, paddingLeft: 10, fontSize: 20,display: 'flex', alignItems: 'center' }}>
                                    发生量
                                </div>
                                <div style={{ height: "calc(100% - 45px)", padding: 20 }}>
                                    <div className="lyf-row-2" style={{ display: 'flex', alignItems: 'center' }}>
                                        自由流速度：43 km/h
                                    </div>
                                    <div className="lyf-row-2" style={{ fontSize: 20, display: 'flex', alignItems: 'center' }}>
                                        当前速度：35 km/h
                                    </div>
                                    <div className="lyf-row-6">
                                        <Chart option={ this.state.div31_option }/>
                                    </div>
                                </div>
                            </div>
                            <div className="lyf-row-5">
                                <div style={{ height: 45, paddingLeft: 10, fontSize: 20, display: 'flex', alignItems: 'center' }}>
                                    热门目的地
                                </div>
                                <div style={{ height: "calc(100% - 45px)", padding: 20 }}>
                                    <div className="lyf-row-2">
                                        日期：<DatePicker size="small"/>
                                    </div>
                                    <div className="lyf-row-2 lyf-center">
                                        平均速度： 32.3 km/h
                                    </div>
                                    <div className="lyf-row-6">
                                        <Chart option={ this.state.div32_option }/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabPane>
                    <TabPane tab="吸引点" key="2" className="col-item">
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}
