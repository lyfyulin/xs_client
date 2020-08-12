import React, { Component } from 'react'
import LinkButton from '../../components/link-button'
import { Icon, Card, Form, Input, InputNumber, Select, Button, message, TimePicker, Table, DatePicker, Radio, Checkbox } from 'antd'
import moment from 'moment'
import 'moment/locale/zh-cn'
import memoryUtils from '../../utils/memoryUtils';
import { PHASE_SCHEMA, PHASE_SCHEMA_FLOW, DIRECTION, DIRECTION_LIST, SIGNAL_SCHEMA, EW_SIGNAL_SCHEMA, SN_SIGNAL_SCHEMA } from '../../utils/ConstantUtils';
import SignalSchema from './signal-schema'
import { reqNodes, reqNodeById, reqNodeFlowByNodeId, reqNodeSchemaExecSearch, reqNodeDelaySearch, reqNodeAvgFlowSearch } from '../../api'
import { vector, getStrCount } from '../../utils/ArrayCal'
import { getDateString, getTimeString, getTodayDateString } from '../../utils/dateUtils'
import _ from 'lodash'
import LyfItem from '../../components/item/item'
import { node_signal_option, cal_control_time } from '../../utils/traffic/node-signal-cal'

const Item = Form.Item
const Option = Select.Option

class OptimizeSchema extends Component {

    state = {
        nodes: [],
        inter_type: 0,
        schema_phases: [],
        tableBodyHeight: 480,
        node: {},
        node_flow: [],
        node_delay: [],
        ew_signal_schema: "0",
        sn_signal_schema: "5",
        fix_cycle: false,
        cycle_time: 120,
    }

    initColumns = () => {
        this.phase_columns = [{
            title: '方案编号',
            dataIndex: "node_schema_id",
            align: 'center',
        },{
            title: '相序',
            dataIndex: "phase_index",
            align: 'center',
            render: phase_index => '相位' + phase_index,
        },{
            title: '相位',
            dataIndex: "phase_schema",
            align: 'center',
            render: phase_schema => PHASE_SCHEMA[phase_schema],
        },{
            title: '时长',
            dataIndex: "phase_time",
            align: 'center',
            render: phase_time => phase_time + 's',
        }]

        this.delay_columns = [{
            title: '方向',
            dataIndex: "direction",
            align: 'center',
            width: 100,
            render: direction => DIRECTION_LIST[direction - 1]
        },{
            title: '左转延误',
            dataIndex: "left_delay",
            align: 'center',
            width: 100,
            render: left_delay => left_delay?left_delay.toFixed(2):"0",
        },{
            title: '直行延误',
            dataIndex: "t_delay",
            align: 'center',
            width: 100,
            render: t_delay => t_delay?t_delay.toFixed(2):"0",
        },{
            title: '方向延误',
            dataIndex: "dir_delay",
            align: 'center',
            width: 100,
            render: dir_delay => dir_delay?dir_delay.toFixed(2):"0",
        }]
    }

    // 加载所有点位
    loadNodes = async () => {
        const result = await reqNodes()
        if(result.code === 1){
            const nodes = result.data
            if(!memoryUtils.node.node_id){
                memoryUtils.node = nodes[0]
            }
            this.setState({ nodes })
        }else{
            message.error(result.message)
        }
    }
    // 加载点位信息
    loadNodeById = async (node_id) => {
        const result = await reqNodeById(node_id)
        this.loadNodeData(node_id)
        if(result.code === 1){
            memoryUtils.node = result.data
            this.setState({ node: result.data })
            let directions = result.data.directions.map( e => e.direction )
            if(directions.length === 4){
                this.setState({ inter_type: 0 })
            }else if(directions.length === 3 && directions[0] === 2){
                this.setState({ inter_type: 1 })
            }else if(directions.length === 3 && directions[1] === 3){
                this.setState({ inter_type: 2 })
            }else if(directions.length === 3 && directions[2] === 4){
                this.setState({ inter_type: 3 })
            }else if(directions.length === 3){
                this.setState({ inter_type: 4 })
            }
        }
    }
    // 下拉框数据过滤
    handleFilter = (inputValue, option) => {
        if(!/[a-zA-Z]/.test(inputValue)){
            return option.props.children.indexOf(inputValue) === -1?false:true
        }
    }
    // 提交请求
    handleSubmit = async (e) => {
        e.preventDefault()
        this.loadNodeData()
    }
    // 加载执行方案
    loadExecNodeSchema = async (start_date, end_date, start_time, end_time, node_id) => {
        const result = await reqNodeSchemaExecSearch(start_date, end_date, start_time, end_time, node_id)

        if(result.code === 1){
            let node_schema = result.data
            let schema_phases = vector.property_unique(node_schema.phases, 'phase_index')
            node_schema.phases = schema_phases
            memoryUtils.node_schema = node_schema
            this.setState({ schema_phases })
        } else {
            this.setState({ schema_phases: [] })
            message.error("此时段为检索到信号方案！")
        }
    }
    // 加载点位流量
    loadNodeFlowById = async(start_date, end_date, start_time, end_time, node_id) => {
        const result = await reqNodeAvgFlowSearch(start_date, end_date, start_time, end_time, node_id)
        if(result.code === 1){
            this.setState({ node_flow: result.data })
        }else{
            message.error(result.message)
        }
    }
    // 加载点位延误
    loadNodeDelayById = async(start_date, end_date, start_time, end_time, node_id) => {
        const result = await reqNodeDelaySearch(start_date, end_date, start_time, end_time, node_id)

        if(result.code === 1){
            this.setState({ node_delay: result.data })
        }else{
            message.error(result.message)
        }
    }
    // 加载点位数据
    loadNodeData = async () => {
        let result = []
        this.props.form.validateFields( async (err, values) => {
            if( !err ){
                let start_date = getDateString(values['start_date'])
                let end_date = getDateString(values['end_date'])
                let start_time = getTimeString(values['start_time'])
                let end_time = getTimeString(values['end_time'])
                let node_id = values["node_id"]
                
                this.loadNodeFlowById(start_date, end_date, start_time, end_time, node_id)
                this.loadExecNodeSchema(start_date, end_date, start_time, end_time, node_id)
                this.loadNodeDelayById(start_date, end_date, start_time, end_time, node_id)
            }else{
                message.error("查询条件错误！")
            }
        } )
        return result
        
    }

    cal_signal_schema = () => {

        const { node, node_flow, ew_signal_schema, sn_signal_schema, fix_cycle, cycle_time } = this.state

        let ql = node_flow.map( e => e.left_flow )
        let qt = node_flow.map( e => e.t_flow )
        let qr = node_flow.map( e => e.right_flow )
        let lane_dir = node.directions.map( e => e.lane_dir )

        let ln = lane_dir.map( e => getStrCount(e, "2") +  getStrCount(e, "7") +  getStrCount(e, "8") +  getStrCount(e, "0")  )
        let tn = lane_dir.map( e => getStrCount(e, "1") +  getStrCount(e, "4") +  getStrCount(e, "5") +  getStrCount(e, "6") +  getStrCount(e, "9")  )
        let rn = lane_dir.map( e => getStrCount(e, "3") )

        let signal_option = node_signal_option
        signal_option.LN = ln
        signal_option.TN = tn
        signal_option.RN = rn
        signal_option.QL = ql
        signal_option.QT = qt
        signal_option.QR = qr
        signal_option.fix_cycle = fix_cycle
        signal_option.cycle_time = cycle_time
        signal_option.phase_schema_group = [ ew_signal_schema, sn_signal_schema ]
        
        let result = cal_control_time(signal_option)

        let phase_schema = [...result[0][0], ...result[0][1]].map( e => e.slice(0, 1) * 1 > 4? (e.slice(0, 1) * 1 - 5): (e.slice(0, 1) * 1 + 5) )
        let phase_time = [...result[1][0], ...result[1][1]].map( e => e?e.toFixed(0):"0" )

        let schema_phases = phase_schema.map( (e, i) => ({ phase_index: (i + 1), phase_schema: e, phase_time: phase_time[i] }) )
        this.setState({ schema_phases })
        
    }

    onWindowResize = _.throttle(() => {
        this.setState({ tableBodyHeight: window.innerHeight - 250  })
    }, 800)

    componentWillMount() {
        this.initColumns()
        this.loadNodes()
    }

    componentDidMount() {
        let node = memoryUtils.node
        if(node.node_id){
            this.loadNodeById(node.node_id)
        }
        this.setState({ tableBodyHeight: window.innerHeight - 250 })
        window.addEventListener('resize', this.onWindowResize)
    }

    componentWillUnmount = () => {
        window.removeEventListener('resize', this.onWindowResize)
        this.setState = (state, callback) => {
            return
        }
    }

    render() {

        const { getFieldDecorator } = this.props.form

        const { nodes, tableBodyHeight, schema_phases, inter_type, node_delay } = this.state
        
        const title = (
            <span>
                <LinkButton onClick={ () => this.props.history.goBack() }>
                    <Icon type="arrow-left"></Icon>
                </LinkButton>
                &nbsp;&nbsp;
                <span>单点控制</span>
            </span>
        )

        const formLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 17 },
        }

        const options = nodes.map(node => <Option key={node.node_id} value={node.node_id}>{node.node_name}</Option>)


        return (
            <Card className="full" title={title} style={{ margin: 0, padding: 0,  }}>
                <div className="full" style={{ display: 'flex', flexWrap: 'nowrap' }}>
                    <Form
                        style={{ height: 60, width:'100%' }}
                        { ...formLayout }
                        onSubmit = { this.handleSubmit }
                    >
                        <div className="full lyf-center" style={{ height: 60, width: '100%', borderBottom: '1px solid #1DA57A', borderTop: '1px solid #1DA57A' }}>
                            <div className="lyf-col-2 lyf-center">
                                <Item label="路口名称">
                                    {
                                        getFieldDecorator("node_id", {
                                            initialValue: memoryUtils.node.node_id?memoryUtils.node.node_id:"",
                                        })(
                                            <Select
                                                style={{ width: '100%' }} 
                                                disabled
                                                size="small"
                                            >
                                                {options}
                                            </Select>
                                        )
                                    }
                                </Item>
                            </div>
                            <div className="lyf-col-2 lyf-center">
                                <Item label="起始日期" name="start_date">
                                    {
                                        getFieldDecorator("start_date", {
                                            initialValue: moment("2020-07-01"),
                                        })(
                                            <DatePicker 
                                                style={{ width:'100%' }} 
                                                placeholder="请选择日期" 
                                                size="small"
                                                format = "YYYY-MM-DD"
                                            />
                                        )
                                    }
                                </Item>
                            </div>
                            <div className="lyf-col-2 lyf-center">
                                <Item label="结束日期" name="end_date">
                                    {
                                        getFieldDecorator("end_date", {
                                            initialValue: moment(getTodayDateString()),
                                        })(
                                            <DatePicker
                                                size="small"
                                                style={{ width:'100%' }} 
                                                placeholder="请选择日期" 
                                                size="small"
                                                format = "YYYY-MM-DD"
                                            />
                                        )
                                    }
                                </Item>
                            </div>
                            <div className="lyf-col-1 lyf-center">
                                <Item label="起始时间" name="start_time">
                                    {
                                        getFieldDecorator("start_time", {
                                            initialValue: moment("2020-01-01 07:00:00"),
                                        })(
                                            <TimePicker 
                                                style={{ width:'100%' }} 
                                                placeholder="请选择时间" 
                                                size="small"
                                                format = "HH:mm:ss"
                                            />
                                        )
                                    }
                                </Item>
                            </div>
                            <div className="lyf-col-1 lyf-center">
                                <Item label="结束时间" name="end_time">
                                    {
                                        getFieldDecorator("end_time", {
                                            initialValue: moment("2020-01-01 08:00:00"),
                                        })(
                                            <TimePicker 
                                                size="small"
                                                style={{ width:'100%' }} 
                                                placeholder="请选择时间" 
                                                size="small"
                                                format = "HH:mm:ss"
                                            />
                                        )
                                    }
                                </Item>
                            </div>
                            <div className="lyf-col-1 lyf-center" style={{ textAlign:"center" }}>
                                <Button size="small" onClick={ () => this.loadNodeData() }>查询方案</Button>
                            </div>
                        </div>
                    </Form>
                </div>
                <div style={{ height: tableBodyHeight, display: 'flex', flexWrap: 'nowrap' }}>
                    <div className="lyf-col-5">
                        <div className="lyf-row-5">
                            <Table
                                bordered = { true }
                                rowKey = "phase_index"
                                columns = { this.phase_columns }
                                dataSource = { schema_phases }
                                pagination = { false }
                                style={{ width: '100%', height: '100%' }}
                            />
                        </div>
                        <div className="lyf-row-5">
                            <Table 
                                bordered = { true }
                                className="full"
                                rowKey = "direction"
                                columns = { this.delay_columns }
                                dataSource = { this.state.node_delay }
                                pagination = { false }
                                align="center"
                            />
                        </div>
                    </div>
                    <div className="lyf-col-5">
                        <div className="lyf-row-5">
                            <SignalSchema data={ schema_phases } inter_type={ inter_type }/>
                        </div>
                    </div>
                </div>
            </Card>
        )
    }
}

export default Form.create()(OptimizeSchema)
