import React, { Component } from 'react'
import {
    Card,
    List,
    Icon,
    Table,
} from 'antd'
import LinkButton from '../../components/link-button'
import { reqAccidentById } from '../../api'
import Chart from '../../components/chart'
import { getNowTimeString } from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import { ACCIDENT_SPECIFIC_LOCATION, SIGN_MARKING_CONDITION, LIGHT_CONDITION, ACCIDENT_TYPE, ACCIDENT_CLIMATE, CAR_DAMAGE, IS_BREAKDOWN, ILLEGAL_BEHAVIOR, TRIP_MODE } from '../../utils/baoshan'
import _ from 'lodash'
import { LineOption, AreaOption, AreaOption2, BarOption3, PieOption2, BarOption, BarOption2, LineOption3 } from '../../config/echartOption'
import { incidents_type, hour_accidents, obj_incidents, climate_incidents } from '../../utils/mock_data/accidents_data'
import { time_point_hour } from '../../utils/mock_data/origin_data'

const { Item } = List

export default class AccidentsDetail extends Component {


    state = {
        div11_option: {},
        div12_option: {},
        div21_option: {},
        div22_option: {},
    }

    onWindowResize = _.throttle(() => {
        this.setState({ tableBodyHeight: window.innerHeight * 0.9 - 166  })
    }, 800)

    load_data = () => {

        

        let div11_option = BarOption3(incidents_type.map( e => e[0] ), incidents_type.map( e => e[1] ), "")
        let div12_option = LineOption3(time_point_hour, hour_accidents, "")
        let div21_option = BarOption3(climate_incidents.map( e => e[0] ), climate_incidents.map( e => e[1] ), "")
        let div22_option = PieOption2(obj_incidents.map( e => e[0] ), obj_incidents.map( e => e[1] ), "")
        
        this.setState({
            div11_option, div12_option, div21_option, div22_option
        })

    }

    componentDidMount() {
        this.load_data()
        window.addEventListener('resize', this.onWindowResize)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowResize)
    }
    

    render() {

        
        return (
            <Card style={{ height: 'calc(100% - 2px)' }}>
                <List>
                    <LinkButton onClick={ () => this.props.history.goBack() }>
                        <Icon type="arrow-left"></Icon>
                    </LinkButton>
                    &nbsp;&nbsp;
                    <span>事故列表</span>
                </List>
                <div className="full" style={{ height: 500, width: '100%', display: 'flex', flexWrap: 'nowrap' }}>
                    <div className="lyf-col-5" style={{ display: 'flex', flexWrap: 'wrap' }}>
                            <div className="lyf-row-5">
                                <Chart option={ this.state.div11_option }/>
                            </div>
                            <div className="lyf-row-5">
                                <Chart option={ this.state.div12_option }/>
                            </div>
                        </div>
                        <div className="lyf-col-5" style={{ display: 'flex', flexWrap: 'wrap' }}>
                            <div className="lyf-row-5">
                                <Chart option={ this.state.div21_option }/>
                            </div>
                            <div className="lyf-row-5">
                                <Chart option={ this.state.div22_option }/>
                            </div>
                        </div>
                </div>
            </Card>
        )
    }
}
