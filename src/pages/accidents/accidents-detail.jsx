import React, { Component } from 'react'
import {
    Card,
    List,
    Icon,
    Table,
} from 'antd'
import LinkButton from '../../components/link-button'
import { reqAccidentById } from '../../api'
import { getNowTimeString } from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import { ACCIDENT_SPECIFIC_LOCATION, SIGN_MARKING_CONDITION, LIGHT_CONDITION, ACCIDENT_TYPE, ACCIDENT_CLIMATE, CAR_DAMAGE, IS_BREAKDOWN, ILLEGAL_BEHAVIOR, TRIP_MODE } from '../../utils/baoshan'
import _ from 'lodash'

const { Item } = List

export default class AccidentsDetail extends Component {


    state = {
        accident: memoryUtils.accident,
        parties: [],
    }

    initColumns = () => {
        this.columns = [
            {
                title: '出行者',
                dataIndex: 'id',
                width: 100,
                render: id => '出行者' + id,
            },{
                title: '出行方式',
                dataIndex: 'trip_mode',
                width: 100,
                render: trip_mode => TRIP_MODE[trip_mode],
            },{
                title: '姓名',
                dataIndex: 'party_name',
                width: 100,
            },{
                title: '身份证',
                dataIndex: 'id_card',
                width: 100,
            },{
                title: '车牌号',
                dataIndex: 'plate_number',
                width: 100,
            },{
                title: '故障',
                dataIndex: 'is_breakdown',
                width: 100,
                render: is_breakdown => IS_BREAKDOWN[is_breakdown],
            },{
                title: '车损',
                dataIndex: 'car_damage',
                width: 100,
                render: car_damage => CAR_DAMAGE[car_damage],
            },{
                title: '违法行为',
                dataIndex: 'illegal_behavior',
                width: 100,
                render: illegal_behavior => ILLEGAL_BEHAVIOR[illegal_behavior],
            },{
                title: '轻伤人数',
                dataIndex: 'minor_injure',
                width: 100,
            },{
                title: '重伤人数',
                dataIndex: 'serious_injure',
                width: 100,
            },{
                title: '死亡人数',
                dataIndex: 'death',
                width: 100,
            }
        ]
        
    }

    loadAccident = async () => {
        const { accident } = this.state
        let accident_id
        if(accident.accident_id){
            accident_id = accident.accident_id
        }else{
            accident_id = this.props.match.params.id
        }
        const result = await reqAccidentById(accident_id)
        if(result.code === 1){
            let parties = result.data.parties.map( (item, index)=> ({ id: index + 1, ...item }))
            this.setState({ accident: result.data, parties })
        }
    }

    onWindowResize = _.throttle(() => {
        this.setState({ tableBodyHeight: window.innerHeight * 0.9 - 166  })
    }, 800)

    componentWillMount() {
        this.initColumns()
        this.loadAccident()
    }

    componentDidMount() {
        window.addEventListener('resize', this.onWindowResize)
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowResize)
    }
    

    render() {

        const { parties, accident } = this.state
        
        return (
            accident?(
            <Card style={{ height: 'calc(100% - 2px)' }}>
                <List>
                    <LinkButton onClick={ () => this.props.history.goBack() }>
                        <Icon type="arrow-left"></Icon>
                    </LinkButton>
                    &nbsp;&nbsp;
                    <span>事故列表</span>
                    <Item>
                        <span className = "detail-item-left">事故时间：</span>
                        <span className = "detail-item-right">{ accident.accident_time || getNowTimeString() }</span>
                    </Item>
                    <Item>
                        <span className = "detail-item-left">事故经纬度：</span>
                        <span className = "detail-item-right">{ accident.accident_lng_lat }</span>
                    </Item>
                    <Item>
                        <span className = "detail-item-left">天气条件：</span>
                        <span className = "detail-item-right">{ ACCIDENT_CLIMATE[accident.climate] }</span>
                    </Item>
                    <Item>
                        <span className = "detail-item-left">事故位置：</span>
                        <span className = "detail-item-right">{ accident.accident_location }</span>
                    </Item>
                    <Item>
                        <span className = "detail-item-left">事故具体位置：</span>
                        <span className = "detail-item-right">{ ACCIDENT_SPECIFIC_LOCATION[accident.accident_specific_location] }</span>
                    </Item>
                    <Item>
                        <span className = "detail-item-left">事故类型：</span>
                        <span className = "detail-item-right">{ ACCIDENT_TYPE[accident.light_condition] }</span>
                    </Item>
                    <Item>
                        <span className = "detail-item-left">灯光情况：</span>
                        <span className = "detail-item-right">{ LIGHT_CONDITION[accident.light_condition] }</span>
                    </Item>
                    <Item>
                        <span className = "detail-item-left">标线情况：</span>
                        <span className = "detail-item-right">{ SIGN_MARKING_CONDITION[accident.sign_marking_condition] }</span>
                    </Item>
                    <Item>
                        <Table
                            bordered = { true }
                            rowKey = "id"
                            columns = { this.columns }
                            dataSource = { parties }
                            pagination = {false}
                            scroll = {{ y: window.innerHeight * 0.9-535 }}
                            style = {{ width: '100%' }}
                        />
                    </Item>
                        {/* accident.parties&&accident.parties.length>0?(
                            accident.parties.map( (party, index) => (
                                <Item key={'x' + index}>
                                    <Item key={'1' + index} className="lyf-col-2">
                                        <span className = "lyf-font-3">出行者{ index + 1 }</span>
                                    </Item>
                                    <Item key={index}>
                                        <div className='lyf-3-col'>
                                            <span className = "detail-item-left">出行方式：</span>
                                            <span className = "detail-item-right">{ TRIP_MODE[party.trip_mode] }</span>
                                        </div>
                                        <div className='lyf-3-col'>
                                            <span className = "detail-item-left">姓名：</span>
                                            <span className = "detail-item-right">{ party.party_name }</span>
                                        </div>
                                        <div className='lyf-3-col'>
                                            <span className = "detail-item-left">身份证号：</span>
                                            <span className = "detail-item-right">{ party.id_card }</span>
                                        </div>
                                        <div className='lyf-3-col'>
                                            <span className = "detail-item-left">车牌号：</span>
                                            <span className = "detail-item-right">{ party.plate_number }</span>
                                        </div>
                                        <div className='lyf-3-col'>
                                            <span className = "detail-item-left">车辆是否故障：</span>
                                            <span className = "detail-item-right">{ IS_BREAKDOWN[party.is_breakdown] }</span>
                                        </div>
                                        <div className='lyf-3-col'>
                                            <span className = "detail-item-left">是否车损：</span>
                                            <span className = "detail-item-right">{ CAR_DAMAGE[party.car_damage] }</span>
                                        </div>
                                        <div className='lyf-3-col'>
                                            <span className = "detail-item-left">是否违法：</span>
                                            <span className = "detail-item-right">{ ILLEGAL_BEHAVIOR[party.illegal_behavior] }</span>
                                        </div>
                                        <div className='lyf-3-col'>
                                            <span className = "detail-item-left">轻伤人数：</span>
                                            <span className = "detail-item-right">{ party.minor_injure }</span>
                                        </div>
                                        <div className='lyf-3-col'>
                                            <span className = "detail-item-left">重伤人数：</span>
                                            <span className = "detail-item-right">{ party.serious_injure }</span>
                                        </div>
                                        <div className='lyf-3-col'>
                                            <span className = "detail-item-left">死亡人数：</span>
                                            <span className = "detail-item-right">{ party.death }</span>
                                        </div>
                                    </Item>
                                </Item>
                            ) )
                        ):(<></>) */}
                </List>
            </Card>):(<></>)
        )
    }
}
