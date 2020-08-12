import React, { Component } from 'react'

import moment from 'moment'
import 'moment/locale/zh-cn'
import { Table, message, Select, Button, Form, DatePicker, TimePicker, Radio, Checkbox } from 'antd'

import { reqNodeSchemas, reqNodes, reqNodeSchemaById, reqDeleteNodeSchema, reqNodeSchemaExecSearch, reqNodeById, reqUrbanNodes } from '../../api'
import { DIRECTION_LIST } from '../../utils/ConstantUtils'
import { PHASE_SCHEMA } from '../../utils/ConstantUtils'
import SignalSchema from './signal-schema'
import { vector } from '../../utils/ArrayCal'
import memoryUtils from '../../utils/memoryUtils'
import LinkButton from '../../components/link-button'
import { getDateString, getTimeString } from '../../utils/dateUtils'
import _ from 'lodash'

const Option = Select.Option
const Item = Form.Item
class NodeSignalInfo extends Component {

    state = {
        nodes: [],
        schema_list: [],
        node_id: undefined,
        schema_phases: [],
        tableBodyHeight: 480,
        inter_type: 0,
    }

    initColumns = () => {
        this.schema_columns = [{
            title: '方案编号',
            dataIndex: "node_schema_id",
            align: 'center',
            width: 100,
            render: node_schema_id => <Button onClick={ () => this.loadNodeSchemaById(node_schema_id) }>{node_schema_id}</Button>
        },{
            title: '执行日期',
            align: 'center',
            width: 100,
            render: schema => schema.start_date + ' 至 ' + schema.end_date,
        },{
            title: '执行时间',
            align: 'center',
            width: 100,
            render: schema => schema.start_time.substr(11, 5) + '至' + schema.end_time.substr(11, 5)
        },{
            title: '是否执行',
            dataIndex: "execution",
            align: 'center',
            width: 100,
            render: execution => execution===1?"正在执行":"未执行"
        },{
            title: '周期',
            dataIndex: "schema_cycle",
            width: 100,
            align: 'center',
        },{
            title: '描述',
            dataIndex: "description",
            width: 100,
            align: 'center',
        },{
            title: '操作',
            width: 100,
            align: 'center',
            render: node_schema => <LinkButton
                onClick = { () => {
                    memoryUtils.node_schema = node_schema
                    this.props.history.push("/node-signal/update")
                } }
            >修改</LinkButton>
        },{
            title: '删除',
            width: 100,
            align: 'center',
            render: node_schema => <LinkButton
                onClick = { async () => {
                    memoryUtils.node_schema = {}
                    const result = await reqDeleteNodeSchema(node_schema.node_schema_id)
                    if(result.code === 1){
                        this.props.history.push("/node-signal/browse")
                    }else{
                        message.error(result.message)
                    }
                } }
            >删除</LinkButton>
        }]
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
    }

    // 加载点位
    loadNodes = async () => {
        const result = await reqUrbanNodes()
        if(result.code === 1){
            const nodes = result.data
            if(!memoryUtils.node.node_id){
                memoryUtils.node = nodes[0]
            }
            this.setState({ nodes })
            this.loadNodeSchemas(memoryUtils.node.node_id)

        }else{
            message.error(result.message)
        }
    }

    handleChange = (node_id) => {
        this.setState({ node_id })
        memoryUtils.node = this.state.nodes.filter( node => node.node_id === node_id*1 )[0]
        this.loadNodeById(node_id)
    }

    // 加载全部方案
    loadNodeSchemas = async (node_id) => {
        const result = await reqNodeSchemas(node_id)
        if(result.code === 1){
            this.setState({ schema_list: result.data })
        } else {
            this.setState({ schema_list: [] })
            message.error(result.message)
        }
    }

    loadNodeSchemaById = async (node_schema_id) => {

        const result = await reqNodeSchemaById(node_schema_id)
        if(result.code === 1){
            let node_schema = result.data
            let schema_phases = vector.property_unique(node_schema.phases, 'phase_index')
            node_schema.phases = schema_phases
            memoryUtils.node_schema = node_schema
            this.setState({ schema_phases })
        } else {
            message.error(result.message)
        }
    }

    loadNodeById = async (node_id) => {
        let inter_type = 0
        if(node_id){
            const result = await reqNodeById(node_id)
            if(result.code === 1){
                let directions = result.data.directions.map( e => e.direction )
                if(directions.length === 4){
                    inter_type = 0
                }else if(directions.length === 3 && directions[0] === 2){
                    inter_type = 1
                }else if(directions.length === 3 && directions[1] === 3){
                    inter_type = 2
                }else if(directions.length === 3 && directions[2] === 4){
                    inter_type = 3
                }else if(directions.length === 3){
                    inter_type = 4
                }
            }
        }
        this.setState({ inter_type })
    }

    // 表单点位过滤
    handleFilter = (inputValue, option) => {
        if(!/[a-zA-Z]/.test(inputValue)){
            return option.props.children.indexOf(inputValue) === -1?false:true
        }
    }

    handleSubmit = (event) => {
        event.preventDefault()
        
    }

    componentWillMount() {
        this.loadNodes()
        this.initColumns()
    }

    onWindowResize = _.throttle(() => {
        this.setState({ tableBodyHeight: window.innerHeight - 200  })
    }, 800)
    
    componentDidMount() {
        this.setState({ tableBodyHeight: window.innerHeight - 200 })
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

        const { nodes, schema_list, schema_phases, tableBodyHeight, inter_type } = this.state

        const formLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 17 },
        }
    
        const options = nodes.map(node => <Option key={node.node_id} value={node.node_id}>{node.node_name}</Option>)

        return (
            <div className="full">
                <Form
                    style={{ height: 60, width:'100%' }}
                    { ...formLayout }
                    onSubmit = { this.handleSubmit }
                >
                    <div className="full lyf-center" style={{ height: 60, borderBottom: '1px solid #1DA57A', borderTop: '1px solid #1DA57A' }}>
                        <div className="lyf-col-2 lyf-center">
                            <Item label="路口名称">
                                {
                                    getFieldDecorator("node_id", {
                                        initialValue: memoryUtils.node.node_id?memoryUtils.node.node_id:"",
                                    })(
                                        <Select 
                                            showSearch 
                                            filterOption={this.handleFilter} 
                                            style={{ width: '100%' }} 
                                            placeholder="" 
                                            onChange={this.handleChange}
                                            size="small"
                                        >
                                            {options}
                                        </Select>
                                    )
                                }
                            </Item>
                        </div>

                        <div className="lyf-col-1 lyf-center" style={{ textAlign:"center" }}>
                            <Button size="small" onClick={ () => { this.loadNodeSchemas(this.state.node_id) } }>全部方案</Button>
                        </div>
                        <div className="lyf-col-1 lyf-center" style={{ textAlign:"center" }}>
                            <Button size="small" onClick={ () => { this.props.history.push("/node-signal/add") } }>添加方案</Button>
                        </div>
                        <div className="lyf-col-1 lyf-center" style={{ textAlign:"center" }}>
                            <Button size="small" onClick={ () => { this.props.history.push("/node-signal/generate") } }>方案生成</Button>
                        </div>
                        <div className="lyf-col-1 lyf-center" style={{ textAlign:"center" }}>
                            <Button size="small" onClick={ () => { this.props.history.push("/node-signal/optimize") } }>方案优化</Button>
                        </div>
                    </div>
                </Form>
                <div style={{ width: '100%', height: "calc(100% - 80px)", display: 'flex', flexWrap: 'nowrap' }}>
                    <div className="lyf-col-5">
                        <Table
                            bordered = { true }
                            rowKey = "node_schema_id"
                            columns = { this.schema_columns }
                            dataSource = { schema_list }
                            pagination = { false }
                            scroll={{ y: tableBodyHeight }}
                            align="center"
                        />
                    </div>
                    <div className="lyf-col-5">
                        <div className="lyf-row-5 lyf-center">
                            <SignalSchema data = { schema_phases } inter_type = {inter_type}/>
                        </div>
                        <div className="lyf-row-5 lyf-center">
                            <Table
                                bordered = { true }
                                rowKey = "phase_index"
                                columns = { this.phase_columns }
                                dataSource = { schema_phases }
                                pagination = { false }
                                style={{ width: '100%', height: '100%' }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Form.create()(NodeSignalInfo)