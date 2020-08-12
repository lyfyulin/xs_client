import React, { Component } from 'react'
import { Icon, Button, Form, Input, DatePicker, TimePicker, Tabs, message, Table } from 'antd'
import LinkButton from '../../components/link-button'
import LyfItem from '../../components/item/item'
import moment from 'moment'
import 'moment/locale/zh-cn'
import { getDateString, getTodayDateTimeString, getTimeString, getTodayDateString, getTodayTimeString, getNowTimeString } from '../../utils/dateUtils'
import { DIRECTION_LIST } from '../../utils/ConstantUtils'
import NodeFlowDepict from '../../utils/traffic/node-flow-depict'
import memoryUtils from '../../utils/memoryUtils'
import { reqNodeFlowByNodeId, reqNodeById, reqNodeAvgFlowSearch } from '../../api'

const { TabPane } = Tabs

class NodeFlow extends Component {

    state = {
        node: memoryUtils.node,
        activeDirection: '1',
        flow: [],
    }

    initColumns = () => {
        this.columns = [{
            title: '方向',
            dataIndex: "direction",
            render: direction => DIRECTION_LIST[direction - 1]
        },{
            title: '直行',
            dataIndex: "t_flow"
        },{
            title: '左转',
            dataIndex: "left_flow"
        },{
            title: '右转',
            dataIndex: "right_flow"
        }]
    }

    handleSubmit = ( event ) => {
        event.preventDefault()
        this.props.form.validateFields( (error, values) => {
            if( !error ){
                
                let start_date = getDateString(values["start_date"])
                let end_date = getDateString(values["end_date"])
                let start_time = getTimeString(values["start_time"])
                let end_time = getTimeString(values["end_time"])
                
                this.getNodeFlow(start_date, end_date, start_time, end_time, this.state.node.node_id)
                
            }
        } )
    }

    getNodeFlow = async (start_date, end_date, start_time, end_time, node_id) => {

        const result = await reqNodeAvgFlowSearch(start_date, end_date, start_time, end_time, node_id)
        
        if(result.code === 1){
            const flow = result.data.map( e => [ e.t_flow, e.left_flow, e.right_flow ])
            this.flow_chart.setOption(flow.flat())
            this.setState({ flow: result.data })
        } else {
            message.error(result.message)
        }
        
    }

    componentWillMount() {
        this.initColumns()
    }

    async componentDidMount() {

        let node = this.state.node
        if( node.node_id ){
            this.getNodeFlow(getTodayDateString(), getTodayDateString(), getTodayTimeString(), getNowTimeString(), node.node_id)
        }else{
            const node_id = this.props.match.params.id
            const result = await reqNodeById(node_id)
            this.setState({ node: result.data })
            this.getNodeFlow(getTodayDateString(), getTodayDateString(), getTodayTimeString(), getNowTimeString(), node_id)
        }

        this.flow_chart = new NodeFlowDepict("#flow")
        this.flow_chart.draw()
    }

    render() {
        const { activeDirection, node, flow } = this.state
        const { getFieldDecorator } = this.props.form
        const formLayout = {
            labelCol : { span: 11 } ,
            wrapperCol : { span: 11 },
        }
        return (
            <div className="lyf-card">
                <div className="lyf-card-title">
                    <LinkButton onClick={ () => this.props.history.goBack() }>
                        <Icon type="arrow-left"></Icon>
                    </LinkButton>
                    &nbsp;&nbsp;
                    <span>交叉口</span>
                </div>
                <div className="lyf-card-content">
                    <div className="lyf-col-5">
                        <div className="lyf-row2">
                            <Form
                                { ...formLayout } 
                                onSubmit = { this.handleSubmit }
                                style = {{ width: '100%', height: '100%', margin: 0, padding: 20 }}
                            >
                                <LyfItem label="交叉口名称">
                                    {
                                        getFieldDecorator("node_name", {
                                            initialValue: node.node_name||"",
                                        })(<Input size="small"/>)
                                    }
                                </LyfItem>
                                <LyfItem label="日期范围">
                                    {
                                        getFieldDecorator("start_date", {
                                            initialValue: moment(),
                                        })(
                                            <DatePicker 
                                                style={{ width:'100%' }} 
                                                placeholder="请选择日期" 
                                                size="small"
                                                format = "YYYY-MM-DD"
                                            />
                                        )
                                    }
                                    &nbsp;-&nbsp;
                                    {
                                        getFieldDecorator("end_date", {
                                            initialValue: moment(),
                                        })(
                                            <DatePicker 
                                                style={{ width:'100%' }} 
                                                placeholder="请选择日期" 
                                                size="small"
                                                format = "YYYY-MM-DD"
                                            />
                                        )
                                    }
                                </LyfItem>
                                <LyfItem label="时间范围">
                                    {
                                        getFieldDecorator("start_time", {
                                            initialValue: moment("2020-01-01 00:00:00"),
                                        })(
                                            <TimePicker 
                                                style={{ width:'100%' }} 
                                                placeholder="请选择时间" 
                                                size="small"
                                                format = "HH:mm:ss"
                                            />
                                        )
                                    }
                                    &nbsp;-&nbsp;
                                    {
                                        getFieldDecorator("end_time", {
                                            initialValue: moment(),
                                        })(
                                            <TimePicker 
                                                style={{ width:'100%' }} 
                                                placeholder="请选择时间" 
                                                size="small"
                                                format = "HH:mm:ss"
                                            />
                                        )
                                    }
                                </LyfItem>
                                <div style={{ textAlign: 'center' }}>
                                    <Button htmlType="submit">查询</Button>
                                </div>
                            </Form>
                        </div>
                        <div className="lyf-row2">
                        </div>
                    </div>
                    <div className="lyf-col-5">
                        <div className="lyf-row1">
                            <Tabs
                                activeKey = { activeDirection }
                                onChange = { activeDirection => this.setState({ activeDirection }) }
                                style = {{ width: '100%', height: '100%', margin: 0, padding: 0 }}
                            >
                                <TabPane tab="流量图" key="1" id="flow" style={{ width: '100%', height: 500, margin: 0, padding: 0 }}>
                                </TabPane>
                                <TabPane tab="流量表" key="2" style={{ width: '100%', height: 500, margin: 0, padding: 0, backgroundColor: '#fcc' }}>
                                    <Table
                                        bordered = { true }
                                        rowKey = "direction"
                                        columns = { this.columns }
                                        dataSource = { flow }
                                        pagination = { false }
                                        scroll={{ y: 480 }}
                                    />
                                </TabPane>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Form.create()( NodeFlow )