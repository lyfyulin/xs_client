import React, { Component } from 'react'
import DataBox from '../../components/data-box'
import Chart from '../../components/chart'
import { RadarOption2, BiLineOption } from '../../config/echartOption'
import { reqLastRdnetState, reqCurrentLinkState, reqTodayRdnetState, reqCurrentInterDelay, reqTodayVn, reqLastVn } from '../../api'
import { NODE_INFO } from '../../utils/baoshan'
import LvqiMap from '../../components/map'
import { TIME_POINT } from '../../utils/ConstantUtils'
import LvqiTable from '../../components/table'


export default class Inter extends Component {

    state = {
        firstRender: false,
        div11_data: [],
        div22_option: {},
    }

    load_data = async() => {

        const result11 = await reqCurrentInterDelay()
        const result22_1 = await reqTodayVn()
        const result22_2 = await reqLastVn()

        let div11_data = result11.data

        let data22_1 = result22_1.data.map( e => e.all_num )
        let data22_2 = result22_2.data.map( e => e.all_num )
        let div22_option = BiLineOption( TIME_POINT, data22_2, data22_1, 0 )

        this.setState({
            div11_data, div22_option, firstRender: true 
        })
    }

    componentDidMount = () => {
        this.load_data()
        this.timer = setInterval( this.load_data, 100000 )
    }

    componentWillUnmount() {
        clearInterval( this.timer )
        this.setState = (state, callback) => {
            return
        }
    }

    render() {
        const { div11_data, div22_option } = this.state
        return (
            <div className="full lyf-center">
                <div className="lyf-row-7" style={{ display: 'flex' }}>
                    <div className="lyf-col-6 lyf-center">
                        <DataBox title={ "路段主体" }>
                            <LvqiMap data = {div11_data} dataType="inter"/>
                        </DataBox>
                    </div>
                    <div className="lyf-col-4 lyf-center">
                        <DataBox title={ "路段运行状态" }>
                            <LvqiTable data={ div11_data } slideTimer = { 3000 } rowNum={ 5 } dataType="inter"/>
                        </DataBox>
                    </div>
                </div>
                
                <div className="lyf-row-3">
                    <Chart option={ div22_option }/>
                </div>
            </div>
        )
    }
}
