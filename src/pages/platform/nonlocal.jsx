import React, { Component } from 'react'
import DataBox from '../../components/data-box'
import { MAP_CENTER, TMS, NODE_INFO } from '../../utils/baoshan'
import L from 'leaflet'
import { reqCurrentNodeNonlocalRatio, reqWeekNonlocalRatio, reqTodayNonlocalVn, reqNonlocalRatioSearch, reqTodayTaxiVn, reqTodayOnlineVn, reqCurrentNonlocalRatio } from '../../api'
import { bd09togcj02 } from '../../utils/lnglatUtils'
import { message, Spin } from 'antd'
import { getTodayDateTimeString, getNowDateTimeString } from '../../utils/dateUtils'
import Chart from '../../components/chart'
import { TIME_POINT_15MIN, TIME_POINT, WEEK_DAY } from '../../utils/ConstantUtils'
import { AreaOption, BiLineOption2, LineOption } from '../../config/echartOption'

export default class Nonlocal extends Component {

    state = {
        firstRender: true,
        div21_option: {}, 
        div22_option: {}, 
        div31_option: {},
    }

    initMap = () => {
        let { firstRender } = this.state
        if( firstRender ){
            
            this.map = L.map('map', {
                center: MAP_CENTER, 
                zoom: 12, 
                zoomControl: false, 
                attributionControl: false, 
            })
            L.tileLayer(TMS, { maxZoom: 16 }).addTo(this.map)
            this.initNode()
        }
        this.map._onResize()
    }

    load_data = async () => {
        const result11 = await reqCurrentNodeNonlocalRatio()
        const result21 = await reqWeekNonlocalRatio()
        const result22 = await reqCurrentNonlocalRatio()
        const result31_1 = await reqTodayTaxiVn()
        const result31_2 = await reqTodayOnlineVn()

        if(result11.code === 1){
            this.setNode(result11.data)
        }else{
            message.error(result11.message)
        }
        
        let div21_option
        if(result21.code === 1){
            let data21 = result21.data
            div21_option = LineOption(data21.map( e => WEEK_DAY[e.day_id - 1] ), data21.map( e => e.foreign_ratio ))
            
        }else{
            message.error(result21.message)
        }
        
        let div22_option
        if(result22.code === 1){
            let data22 = result22.data.map( e => e.foreign_ratio )
            div22_option = AreaOption( TIME_POINT_15MIN, data22, "外地车流量比例" )
        }else{
            message.error(result22.message)
        }
        
        let div31_option
        if(result31_1.code === 1 && result31_2.code === 1){
            let data31_1 = result31_1.data.map( e => e.taxi_num )
            let data31_2 = result31_2.data.map( e => e.carhailing_num )
            div31_option = BiLineOption2( TIME_POINT, data31_1, data31_2, '出租车', '网约车' )
        }else{
            message.error(result31_1.message)
            message.error(result31_2.message)
        }

        this.setState({ div21_option, div22_option, div31_option, firstRender: false })
        
    }

    initNode = () => {
        this.nodes = []
        for(let i = 0; i < NODE_INFO.length; i++){
            let lng = bd09togcj02(NODE_INFO[i][2], NODE_INFO[i][3])[0]
            let lat = bd09togcj02(NODE_INFO[i][2], NODE_INFO[i][3])[1]
            this.nodes.push( L.circle([lat, lng], {color: '#33CCCC', stroke:false, fillOpacity: 0.9, opacity: 0.9, radius: 30}) )
        }
        L.layerGroup(this.nodes).addTo(this.map)
    }

    setNode = (data) => {
        data.forEach( (e, i) => {
            this.nodes[i].setRadius(e.foreign_ratio*400)
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
        const { firstRender, div21_option, div22_option, div31_option } = this.state
        return (
            <div className="full lyf-center">
                <div className={firstRender?"loading lyf-center":"none"}>
                    <Spin size="large" spinning={firstRender}/>
                </div>
                <div className="lyf-row-7" style={{ display: 'flex' }}>
                    <div className="lyf-col-6 lyf-center">
                        <DataBox title={ "外地车分布" }>
                            <div id="map" className="full">
                            </div>
                        </DataBox>
                    </div>
                    <div className="lyf-col-4">
                        <div className="lyf-row-5 lyf-center">
                            <DataBox title={ "外地车周变化" }>
                                <Chart option={ div21_option }/>
                            </DataBox>
                        </div>
                        <div className="lyf-row-5 lyf-center">
                            <DataBox title={ "外地车比例日变化" }>
                                <Chart option={ div22_option }/>
                            </DataBox>
                        </div>
                    </div>
                </div>
                <div className="lyf-row-3 lyf-center">
                    <DataBox title={ "出租车网约车在途量" }>
                        <Chart option={ div31_option }/>
                    </DataBox>
                </div>
            </div>
        )
    }
}
