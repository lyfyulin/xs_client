import React, { Component } from 'react'
import DataBox from '../../components/data-box'
import L from 'leaflet'
import { MAP_CENTER, TMS, LINK_INFO, LINK_NAME } from '../../utils/baoshan'
import { message, Spin } from 'antd'
import { reqCurrentTongqinHotRoad, reqCurrentTongqinRatio, reqTodayVn } from '../../api'
import { BiLineOption2, BiAreaOption } from '../../config/echartOption'
import { TIME_POINT, TIME_POINT_15MIN } from '../../utils/ConstantUtils'
import LvqiTable from '../../components/table'
import Chart from '../../components/chart'

export default class Tongqin extends Component {


    state = {
        firstRender: true,
        div21_data: [],
        div31_option: {},
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
            L.tileLayer(TMS, { maxZoom: 16 }).addTo(this.map)
            this.initLink()
        }
        this.map._onResize()
    }

    load_data = async () => {
        const result11 = await reqCurrentTongqinHotRoad()
        const result31_1 = await reqCurrentTongqinRatio()
        const result31_2 = await reqTodayVn()

        let div21_data = []
        if(result11.code === 1){
            this.setLink(result11.data)
            div21_data = result11.data.map( e => ({ name: LINK_NAME[e.link_id - 1], value: e.cnt + '辆' }) )
        }else{
            message.error(result11.message)
        }

        let div31_option = {}
        if(result31_1.code === 1 && result31_2.code === 1){
            let data2 = result31_1.data.map( e => e.tongqin_ratio )
            let data1 = result31_2.data.map( e => e.all_num )
            let y_data1 = []
            let y_data2 = []
            for(let j = 0; j < data2.length; j++){
                if(data1[j*3]){
                    y_data1.push(data1[j*3] - (data2[j]*data1[j*3]).toFixed(0))
                    y_data2.push((data2[j]*data1[j*3]).toFixed(0)*1)
                }
            }
            div31_option = BiAreaOption(TIME_POINT_15MIN, y_data1, y_data2, '非通勤车', '通勤车')
        }else{
            message.error(result31_1.message)
            message.error(result31_2.message)
        }

        this.setState({ div21_data, div31_option, firstRender: false })

    }

    initLink = () => {
        this.links = []
        for(let i = 0; i < 121/*LINK_INFO.length*/; i++){
            this.links.push( L.polyline(LINK_INFO[i], {color: '#33CCCC'}) )
        }
        L.layerGroup(this.links).addTo(this.map)
    }

    setLink = (data) => {
        data.forEach( (e, i) => {
            this.links[i].setStyle({ opacity: e.cnt/600 })
        })
    }

    componentDidMount() {
        this.load_data()
        this.initMap()
        this.timer = setInterval( this.load_data, 100000 )
    }

    componentWillUnmount() {
        clearInterval( this.timer )
        this.setState = (state, callback) => {
            return
        }
    }

    render() {
        const { firstRender, div21_data, div31_option } = this.state

        return (
            <div className="full lyf-center">
                <div className={firstRender?"loading lyf-center":"none"}>
                    <Spin size="large" spinning={firstRender}/>
                </div>
                <div className="lyf-row-7" style={{ display: 'flex' }}>
                    <div className="lyf-col-6 lyf-center">
                        <DataBox title={ "热点路段" }>
                            <div id="map" className="full"></div>
                        </DataBox>
                    </div>
                    <div className="lyf-col-4 lyf-center">
                        <DataBox title={ "路段通勤流量" }>
                            <LvqiTable data={ div21_data } rowNum = { 6 } slideTimer = { 3000 } dataType="tongqin"/>
                        </DataBox>
                    </div>
                </div>
                <div className="lyf-row-3 lyf-center">
                    <DataBox title={ "路段通勤流量" }>
                        <Chart option={ div31_option }/>
                    </DataBox>
                </div>
            </div>
        )
    }
}
