import React, { Component } from 'react'
import { Tabs, Table, Tag, DatePicker } from 'antd'
import L from 'leaflet'
import { MAP_CENTER, TMS } from '../../utils/xiaoshan'
import Chart from '../../components/chart'

import './od.less'
import { GaugeOption3, AreaOption2, BarOption2 } from '../../config/echartOption'
import { od_o_top, od_node_trip } from '../../utils/mock_data/od_data'

const { TabPane } = Tabs

export default class State extends Component {

    state = {
        firstRender: true,
        displayRight: false,
        div11_data: [],
        div31_option: {},
        div32_option: {},
    }

    initOdTrips = () => {

        let line_layer = new L.LayerGroup();
        let line2_layer = new L.LayerGroup();
        let pt_layer = new L.LayerGroup();
    
        let colors = ["#87cc26", "#87cc26", "#edee20", "#edee20", "#f58522", "#f58522"];
        let line_colors = ["#87cc26", "#87cc26", "#edee20", "#edee20", "#f58522", "#f58522"];
    
        od_node_trip.forEach((e,i) => {
            if(e[0] === e[3]){
                // let pt1 = bd09togcj02(e[2], e[1]);
                let pt1 = [parseFloat(e[2]), parseFloat(e[1])]
    
                let pt = L.circle(pt1, {
                    color: colors[Math.round(e[6]/8000)],
                    opacity: 1,
                    fillColor: colors[Math.round(e[6]/8000)],
                    fillOpacity: 1,
                    radius: e[6]/50,
                }).addTo(pt_layer).bindPopup(e[0] + '至' + e[3] + '，出行量：' + e[6])

            }else{
                if(Math.round(e[6]/364)>3){
                    let pt1 = [parseFloat(e[2]), parseFloat(e[1])]
                    let pt2 = [parseFloat(e[5]), parseFloat(e[4])]
    
                    let line = L.polyline([pt1, pt2], {
                        stroke: true,
                        color: line_colors[Math.round(e[6]/364)],
                        opacity: 1,
                        lineCap: "butt",
                        weight: e[6]/100,
                    }).addTo(line2_layer).bindPopup(e[0] + '至' + e[3] + '，出行量：' + e[6])

                }else{
                    let pt1 = [parseFloat(e[2]), parseFloat(e[1])]
                    let pt2 = [parseFloat(e[5]), parseFloat(e[4])]
    
                    let line = L.polyline([pt1, pt2], {
                        stroke: true,
                        color: line_colors[Math.round(e[6]/364)],
                        opacity: 1,
                        weight: e[6]/100,
                    }).addTo(line_layer).bindPopup(e[0] + '至' + e[3] + '，出行量：' + e[6])
                }
            }
        })
        line_layer.addTo(this.map);
    
        line2_layer.addTo(this.map);
        pt_layer.addTo(this.map);
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

            this.initOdTrips()
        }
        // this.map._onResize()
    }

    componentWillMount() {
        this.link_state_columns = [{
            dataIndex: 'index',
            title: '出行排名',
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
            dataIndex: 'o_cnts',
            title: '发生量',
        }]

        let div11_data = od_o_top.map( ( e, i ) => ({ index: (i + 1), link_name: e[0], o_cnts: e[1] }) )

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
