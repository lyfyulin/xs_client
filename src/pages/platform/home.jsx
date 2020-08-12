import React, { Component } from 'react'
import DataBox from '../../components/data-box'
import Chart from '../../components/chart'
import { GaugeOption5, RadarOption2, GaugeOption2, BiAreaOption, BiLineOption, AreaOption, CalendarOption, HorizontalBarOption, BallOption3 } from '../../config/echartOption'

import {  reqTodayVn, 
    reqLastOCnts, 
    reqLastRdnetState,
    reqLastAvgTripTime,
    reqLastAvgTripFreq,
    reqCurrentNonlocalRatio,
    reqCurrentInterDelay,
    reqLastDCnts,
    reqTodayRcgRate,
    reqTodayTaxiDist, 
    reqTodayOnlineDist, 
    reqCurrentTongqinRatio, 
    reqLastAvgTripDist, 
    reqCurrentLinkState, 
    reqTodayRdnetState, 
    reqNotMissSearch,
    reqTodayTaxiVn,
    reqTodayOnlineVn,
    reqTodayNonlocalVn
} from '../../api'
import { NODE_INFO } from '../../utils/baoshan'
import { TIME_POINT, TIME_POINT_15MIN } from '../../utils/ConstantUtils'
import { Spin, message } from 'antd'
import LvqiTable from '../../components/table'
import LvqiMap from '../../components/map'
import { getNowDateString, getLastNDayDateString } from '../../utils/dateUtils'

export default class Home extends Component {

    state = {
        firstRender: false,
        div11_option: {},   //RadarOption2(),
        div12_option: {},   //BiAreaOption(),
        div13_option: {},   //CalendarOption(),
        div21_option: {},   //GaugeOption2(),
        div22_option: {},   //AreaOption(),
        div23_data: [],
        div32_option: {},   //BiLineOption(),
        div41_option: {},   //GaugeOption5(),
        div42_option: {},   //AreaOption(),
        div43_data: [],
        div51_option: {},   //RadarOption2(),
        div52_option: {},   //HorizontalBarOption(),
        div53_option: {},   //BallOption3,
    }

    load_data = async() => {

        const result11 = await reqLastOCnts()

        const result12_1 = await reqTodayTaxiDist()
        const result12_2 = await reqTodayOnlineDist()

        const result13 = await reqNotMissSearch( getLastNDayDateString(20), getNowDateString(), "00:00:00", "23:59:59" )
        
        const result21 = await reqTodayRdnetState()

        const result22 = await reqCurrentTongqinRatio()

        const result23 = await reqCurrentLinkState()

        const result32_1 = await reqLastRdnetState()

        const result41_1 = await reqLastAvgTripDist()
        const result41_2 = await reqLastAvgTripTime()
        const result41_3 = await reqLastAvgTripFreq()

        const result42 = await reqCurrentNonlocalRatio()

        const result43 = await reqCurrentInterDelay()

        const result51 = await reqLastDCnts()

        const result52_1 = await reqTodayVn()
        const result52_2 = await reqTodayTaxiVn()
        const result52_3 = await reqTodayOnlineVn()
        const result52_4 = await reqTodayNonlocalVn()

        const result53 = await reqTodayRcgRate()

        let div11_option

        if(result11.code === 1){
            let data11 = result11.data.slice(0, 10)
            div11_option = RadarOption2(data11.map(e => NODE_INFO[e.o_node][1]), data11.map((e, i) => e.cnts), "right" )
        }else{
            message.error(result11.message)
        }

        let div12_option

        if(result12_1.code === 1){
            let data12_1 = result12_1.data.map( e => e.taxi_km )
            let data12_2 = result12_2.data.map( e => e.carhailing_km )
            div12_option = BiAreaOption(TIME_POINT, data12_1, data12_2)
        }else{
            message.error(result12_1.message)
        }
        
        let div13_option

        if(result13.code === 1){
            let data13_x = result13.data.map( e => e.time_point )
            let data13_y = result13.data.map( e => [e.time_point, e.not_miss_rate] )
            div13_option = CalendarOption( [data13_x[0].slice(0, 10), data13_x[data13_x.length - 1].slice(0, 10)], data13_y )
        }else{
            message.error(result13.message)
        }

        let div21_option
        let data21
        if(result21.code === 1){
            data21 = result21.data.map( e => e.speed )
            div21_option = GaugeOption2(data21[data21.length - 1])
        }else{
            message.error(result21.message)
        }

        let div22_option

        if(result22.code === 1){
            let data22 = result22.data.map( e => e.tongqin_ratio )
            div22_option = AreaOption( TIME_POINT_15MIN.slice(0, data22.length - 1), data22, "通勤车流量比例" )
        }else{
            message.error(result22.message)
        }


        let div23_data

        if(result23.code === 1){
            div23_data = result23.data
        }else{
            message.error(result23.message)
        }

        let div42_option

        if(result42.code === 1){
            let data42 = result42.data.map( e => e.foreign_ratio )
            div42_option = AreaOption( TIME_POINT_15MIN.slice(0, data42.length - 1), data42, "外地车流量比例" )
        }else{
            message.error(result42.message)
        }


        let div43_data

        if(result43.code === 1){
            div43_data = result43.data
        }else{
            message.error(result43.message)
        }

        let div32_option

        if(result32_1.code === 1){
            let data32_1 = result32_1.data.map( e => e.speed )
            div32_option = BiLineOption( TIME_POINT, data32_1, data21 )
        }else{
            message.error(result32_1.message)
        }

        let div41_option

        if(result41_1.code === 1 && result41_2.code === 1 && result41_3.code === 1){
            if(result41_1.data[0] === null){
                div41_option = GaugeOption5( 0,0,0 )
            }else{
                div41_option = GaugeOption5( result41_1.data[0].avg_trip_dist, result41_2.data[0].avg_trip_time, result41_3.data[0].avg_trip_freq )
            }
        }else{
            message.error(result41_1.message)
        }
        
        let div51_option

        if(result51.code === 1){
            let data51 = result51.data.slice(0, 10)
            div51_option = RadarOption2(data51.map(e => NODE_INFO[e.d_node][1]), data51.map((e, i) => e.cnts), "left" )
        }else{
            message.error(result51.message)
        }

        let div52_option

        if(result52_1.code === 1 && result52_2.code === 1 && result52_3.code === 1 && result52_4.code === 1 ){
            let data52_1 = result52_1.data
            let data52_2 = result52_2.data
            let data52_3 = result52_3.data
            let data52_4 = result52_4.data
            div52_option = HorizontalBarOption(["在途量", "出租车", "网约车", "外地车"], [data52_1[data52_1.length - 1].all_num, data52_2[data52_2.length - 1].taxi_num, data52_3[data52_3.length - 1].carhailing_num, data52_4[data52_4.length - 1].foreign_num])
        }else{
            message.error(result52_1.message)
        }

        let div53_option

        if(result53.code === 1){
            let data53 = result53.data[result53.data.length - 1].rcg_rate
            div53_option = BallOption3(data53)
        }else{
            message.error(result53.message)
        }

        this.setState({ 
            div11_option, div12_option, div13_option, div21_option, div22_option, div23_data, div32_option,
            div41_option, div42_option, div43_data, div51_option, div52_option,  div53_option, firstRender: true 
        })

    }

    componentDidMount = () => {
        this.load_data()
        this.timer = setInterval( this.load_data, 60000 )
    }

    componentWillUnmount() {
        clearInterval( this.timer )
        this.setState = (state, callback) => {
            return
        }
    }

    render() {
        let { firstRender, div11_option, div12_option, div13_option, div21_option, div22_option, div23_data, div32_option, div41_option, div42_option, div43_data, div51_option, div52_option, div53_option } = this.state
        return (
            <div className="full" style={{ display: 'flex' }}>
                <div className={firstRender?"none":"loading lyf-center"}>
                    <Spin size="large" spinning={!firstRender}/>
                </div>
                <div className="lyf-6-col">
                    <div className="lyf-3-row lyf-center">
                        <DataBox title={ "交通发生量" }>
                            <Chart option={ div11_option }/>
                        </DataBox>
                    </div>
                    <div className="lyf-3-row lyf-center">
                        <DataBox title={ "运营车公里数" }>
                            <Chart option={ div12_option }/>
                        </DataBox>
                    </div>
                    <div className="lyf-3-row lyf-center">
                        <DataBox title={ "数据传输完整率" }>
                            <Chart option={ div13_option }/>
                        </DataBox>
                    </div>
                </div>
                <div className="lyf-6-col">
                    <div className="lyf-3-row lyf-center">
                        <DataBox title={ "路网平均速度" }>
                            <Chart option={ div21_option }/>
                        </DataBox>
                    </div>
                    <div className="lyf-3-row lyf-center">
                        <DataBox title={ "通勤流量比例" }>
                            <Chart option={ div22_option }/>
                        </DataBox>
                    </div>
                    <div className="lyf-3-row lyf-center">
                        <DataBox title={ "路段行程速度" }>
                            <LvqiTable data={ div23_data } slideTimer = { 3000 } dataType="link"/>
                        </DataBox>
                    </div>
                </div>
                <div className="lyf-3-col">
                    <div className="lyf-2-3-row lyf-center">
                        <DataBox title={ "路段运行状态" }>
                            <LvqiMap data = {div23_data} dataType="link"/>
                        </DataBox>
                    </div>
                    <div className="lyf-3-row lyf-center">
                        <DataBox title={ "宏观态势" }>
                            <Chart option={ div32_option }/>
                        </DataBox>
                    </div>
                </div>
                <div className="lyf-6-col">
                    <div className="lyf-3-row lyf-center">
                        <DataBox title={ "机动车出行特征" }>
                            <Chart option={ div41_option }/>
                        </DataBox>
                    </div>
                    <div className="lyf-3-row lyf-center">
                        <DataBox title={ "外地车流量比例" }>
                            <Chart option={ div42_option }/>
                        </DataBox>
                    </div>
                    <div className="lyf-3-row lyf-center">
                        <DataBox title={ "交叉口延误" }>
                            <LvqiTable data={ div43_data } slideTimer = { 3000 } dataType="inter"/>
                        </DataBox>
                    </div>
                </div>
                <div className="lyf-6-col">
                    <div className="lyf-3-row lyf-center">
                        <DataBox title={ "交通吸引量" }>
                            <Chart option={ div51_option }/>
                        </DataBox>
                    </div>
                    <div className="lyf-3-row lyf-center">
                        <DataBox title={ "在途车辆数" }>
                            <Chart option={ div52_option }/>
                        </DataBox>
                    </div>
                    <div className="lyf-3-row lyf-center">
                        <DataBox title={ "车牌识别准确率" }>
                            <Chart option={ div53_option }/>
                        </DataBox>
                    </div>
                </div>
            
            </div>
        )
    }
}

