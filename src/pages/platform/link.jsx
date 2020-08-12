import React, { Component } from 'react'
import DataBox from '../../components/data-box'
import Chart from '../../components/chart'
import { BiLineOption } from '../../config/echartOption'
import { reqLastRdnetState, reqCurrentLinkState, reqTodayRdnetState } from '../../api'
import LvqiMap from '../../components/map'
import { TIME_POINT } from '../../utils/ConstantUtils'
import LvqiTable from '../../components/table'
import { message } from 'antd'


export default class Link extends Component {

    state = {
        firstRender: false,
        div11_data: [],
        div22_option: {},
    }

    load_data = async() => {

        const result11 = await reqCurrentLinkState()
        const result21 = await reqTodayRdnetState()
        const result32_1 = await reqLastRdnetState()

        let data21 = []
        if(result21.code === 1){
            data21 = result21.data.map( e => e.speed )
        }else{
            message.error(result21.message)
        }
        
        let div22_option = {}
        if(result32_1.code === 1){
            let data32_1 = result32_1.data.map( e => e.speed )
            div22_option = BiLineOption( TIME_POINT, data32_1, data21 )
        }else{
            message.error(result32_1.message)
        }

        let div11_data = []
        if(result11.code === 1){
            div11_data = result11.data
        }else{
            message.error(result11.message)
        }

        this.setState({
            div11_data, data21, div22_option, firstRender: true 
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
                            <LvqiMap data = {div11_data} dataType="link"/>
                        </DataBox>
                    </div>
                    <div className="lyf-col-4 lyf-center">
                        <DataBox title={ "路段运行状态" }>
                            <LvqiTable data={ div11_data } slideTimer = { 3000 } rowNum={ 5 } dataType="link"/>
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
