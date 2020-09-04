import React, { Component } from 'react'
import { Form, Input, Button, Select, Tabs, TreeSelect, Radio, Modal, Icon, message, Table } from 'antd'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import LyfItem from '../../components/item/item'
import LinkButton from '../../components/link-button'
import { TMS, MAP_CENTER } from '../../utils/baoshan'
import memoryUtils from '../../utils/memoryUtils'
import { getNowDateTimeString } from '../../utils/dateUtils'
import { reqInsertAccident } from '../../api'
import { connect } from 'react-redux'
import { MORE_POINT_STATUS } from '../../utils/xiaoshan'

const Item = Form.Item
const Option = Select.Option
const { TreeNode } = TreeSelect
const { TabPane } = Tabs


export default class AccidentsEliminate extends Component {

    state = {
        more_points: [],
        eliminate_data: [],
        reason_data: [],
        strategy_data: [],
    }

    initColumns = () => {
        this.more_point_columns = [{
            title: '隐患点',
            dataIndex: 'point_id',
            width: 100,
        },{
            title: '位置',
            dataIndex: 'location',
            width: 200,
        },{
            title: '状态',
            dataIndex: 'status',
            width: 200,
            render: status => MORE_POINT_STATUS[status]
        }]

        this.eliminate_columns = [{
            title: '隐患点',
            dataIndex: 'point_id',
            width: 100,
        },{
            title: '治理时间',
            dataIndex: 'time_point',
            width: 200,
        },{
            title: '事故下降率',
            dataIndex: 'effect_value',
            width: 200,
        }]

        this.reason_columns = [{
            title: '隐患点',
            dataIndex: 'point_id',
            width: 100,
        },{
            title: '原因描述',
            dataIndex: 'reason_summary',
            width: 200,
        }]

        this.strategy_columns = [{
            title: '原因编号',
            dataIndex: 'reason_id',
            width: 100,
        },{
            title: '策略描述',
            dataIndex: 'strategy_summary',
            width: 200,
        },{
            title: '有效性',
            dataIndex: 'effect_value',
            width: 200,
        }]

    }

    load_data = () => {

        let more_points = [{
            point_id: 1, status: 1, location: '104国道同兴村路口'
        }, {
            point_id: 2, status: 0, location: '瓜沥达美印染厂转盘'
        }, {
            point_id: 3, status: 0, location: '曹家桥村道'
        }]

        let eliminate_data = [{
            point_id: 1, time_point: '2020-06-01', strategy_id: 3, effect_value: '38%',
        }, {
            point_id: 2, time_point: '2020-06-01', strategy_id: 4, effect_value: '28%',
        }]

        let reason_data = [
            { point_id: 1, reason_summary: '车道减少,车辆合流' }
        ]

        let strategy_data = [
            { reason_id: 1, strategy_summary: '虚实线标线规范车辆交织过程', effect_value: 18 },
            { reason_id: 1, strategy_summary: '设置前方车道变少标志', effect_value: 6 },
        ]


        this.setState({ more_points, eliminate_data, reason_data, strategy_data })

    }

    componentDidMount() {
        this.initColumns()
        this.load_data()
    }
    
    render() {

        return (
            <div className="lyf-card">
                <div className="lyf-card-title">
                    <LinkButton onClick={ () => this.props.history.goBack() }>
                        <Icon type="arrow-left"></Icon>
                    </LinkButton>
                    &nbsp;&nbsp;
                    <span>事故分析</span>
                </div>
                <div className="lyf-card-content">
                    <div className="lyf-col-5">
                        <div className="lyf-row-5">
                            <Table
                                bordered = { true }
                                rowKey = "point_id"
                                columns = { this.more_point_columns }
                                dataSource = { this.state.more_points }
                            /> 
                        </div>
                        <div className="lyf-row-5">
                            <div className="lyf-row-1 lyf-center lyf-font-4">隐患治理</div>
                            <Table
                                bordered = { true }
                                rowKey = "point_id"
                                columns = { this.eliminate_columns }
                                dataSource = { this.state.eliminate_data }
                            /> 
                        </div>
                    </div>
                    <div className="lyf-col-5">
                        <div className="lyf-row-5">
                            <div className="lyf-row-1 lyf-center lyf-font-4">事故诱因</div>
                            <Table
                                bordered = { true }
                                rowKey = "point_id"
                                columns = { this.reason_columns }
                                dataSource = { this.state.reason_data }
                            /> 
                        </div>
                        <div className="lyf-row-5">
                            <div className="lyf-row-1 lyf-center lyf-font-4">隐患防控策略推荐</div>
                            <Table
                                bordered = { true }
                                rowKey = "reason_id"
                                columns = { this.strategy_columns }
                                dataSource = { this.state.strategy_data }
                            /> 
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
    
