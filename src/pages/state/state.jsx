import React, { Component } from 'react'
import { Tabs, Table, Tag, DatePicker } from 'antd'
import L from 'leaflet'
import { MAP_CENTER, TMS, LINK_INFO2, LINK_COLOR } from '../../utils/xiaoshan'
import Chart from '../../components/chart'

import { current_link_state_top, current_link_state, today_link_state, current_node_delay, current_node_dir_delay, today_node_delay, link_free_speed } from '../../utils/mock_data/state_data'
import { time_point, link_data } from '../../utils/mock_data/origin_data'

import { GaugeOption6, AreaOption2 } from '../../config/echartOption'

import './state.less'
import LinkButton from '../../components/link-button'
import LvqiMap from '../../components/map'

const { TabPane } = Tabs

export default class State extends Component {

    state = {
        firstRender: true,
        chosen_link: current_link_state_top[0][3],
        div11_data: [],
        div21_data: [],
        div31_option: {},
        div32_option: {},
    }

    initLink = () => {
        for(let i = 0; i < LINK_INFO2.length; i++){
            let line = L.polyline(LINK_INFO2[i], {color: LINK_COLOR[parseInt(current_link_state[i][4] / 2)] })
            line.addTo(this.map)
        }
    }

    initMap = () => {
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
            this.initLink()

        }



    }

    componentWillMount() {
        this.link_state_columns = [{
            dataIndex: 'index',
            title: '拥堵排名',
            key: 'index',
            render: index => index < 4?<Tag color="#108ee9">{ index }</Tag>:<Tag color="">{ index }</Tag>
        },{
            title: '路段名称',
            render: link_state => <LinkButton onClick={() => {
                this.setState({ chosen_link: link_state.link_id })
            }}>
                { link_state.link_name }
            </LinkButton>
        },{
            dataIndex: 'avg_speed',
            title: '速度',
            key: 'avg_speed',
        }]

        let div11_data = current_link_state_top.map( (e, i) => ({ index: (i + 1), link_id: e[3], link_name: e[0], avg_speed: e[1] }))

        let div21_data = current_link_state.map( e => ({stateindex: e[4]}) )
        
        let div31_option = GaugeOption6(current_link_state[this.state.chosen_link][4], 10)
        
        let div32_option = AreaOption2(time_point.slice(0, today_link_state.length - 1), today_link_state, '平均速度')

        this.setState({
            div11_data, div21_data, div31_option, div32_option
        })
    }

    componentDidMount() {
        this.initMap()
    }

    render() {
        return (
            <div className="state">
                <Tabs defaultActiveKey="1" className="full">
                    <TabPane tab="路段状态" key="1" className="col-item">
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
                        <div className="col-item-right">
                            <div className="lyf-row-5">
                                <div style={{ borderBottom: '1px solid #ccc', height: 45, marginLeft: 10, marginRight: 10, fontSize: 20,display: 'flex', alignItems: 'center' }}>
                                    当前路段
                                </div>
                                <div style={{ height: "calc(100% - 45px)", padding: 20 }}>
                                    <div className="lyf-row-2" style={{ display: 'flex', alignItems: 'center' }}>
                                        { link_data[this.state.chosen_link - 1][1] }
                                    </div>
                                    <div className="lyf-row-2" style={{ fontSize: 20, display: 'flex', alignItems: 'center' }}>
                                        自由流速度：{ link_free_speed[this.state.chosen_link - 1] } km/h
                                    </div>
                                    <div className="lyf-row-6">
                                        <Chart option={ this.state.div31_option }/>
                                    </div>
                                </div>
                            </div>
                            <div className="lyf-row-5">
                                <div style={{ borderBottom: '1px solid #ccc', height: 45, marginLeft: 10, marginRight: 10, fontSize: 20, display: 'flex', alignItems: 'center' }}>
                                    历史状态
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
                    <TabPane tab="路口状态" key="2" className="col-item">
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}
