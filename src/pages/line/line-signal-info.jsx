import React, { Component } from 'react'

import { Table, message, Button, Icon, Popconfirm } from 'antd'

import { reqNodes, reqNodeSchemaById, reqLineSchemas, reqLineSchemaById, reqDeleteLineSchema } from '../../api'
import { PHASE_SCHEMA } from '../../utils/ConstantUtils'
import { vector } from '../../utils/ArrayCal'
import memoryUtils from '../../utils/memoryUtils'
import LinkButton from '../../components/link-button'

export default class LineSignalInfo extends Component {

    state = {
        nodes: {},
        line_nodes: [],
        line_schema_list: [],
        node_schema_list: [],
        node_id: undefined,
        node_offset: [],
        node_schema_phases: [],
    }

    initColumns = () => {
        this.line_schema_columns = [{
            title: '方案编号',
            dataIndex: "line_schema_id",
            align: 'center',
            render: line_schema_id => <Button onClick={ () => this.loadLineSchemaById(line_schema_id) }>{line_schema_id}</Button>
        },{
            title: '执行日期',
            align: 'center',
            render: schema => schema.start_date + ' 至 ' + schema.end_date,
        },{
            title: '执行时间',
            align: 'center',
            render: schema => schema.start_time.substr(11, 5) + '至' + schema.end_time.substr(11, 5)
        },{
            title: '是否执行',
            dataIndex: "execution",
            align: 'center',
            render: execution => execution===1?"正在执行":"未执行"
        },{
            title: '周期',
            dataIndex: "public_cycle",
            align: 'center',
        },{
            title: '绿波带宽',
            dataIndex: "band_width",
            align: 'center',
        },{
            title: '删除',
            align: 'center',
            render: schema => <Popconfirm 
                title="是否删除?" 
                onConfirm={async() => {
                    const result = await reqDeleteLineSchema(schema.line_schema_id)
                    result.code === 1?message.success("删除干线方案成功！"):message.error(result.message)
                } }
            >
                <a href="#">删除</a>
            </Popconfirm>
        }]
        this.node_schema_columns = [{
            title: '方案编号',
            dataIndex: "node_schema_id",
            align: 'center',
            render: node_schema_id => <Button onClick={ () => this.loadNodeSchemaById(node_schema_id) }>{node_schema_id}</Button>
        },{
            title: '路口名称',
            dataIndex: "node_name",
            align: 'center',
        },{
            title: '周期时长',
            align: 'center',
            dataIndex: 'schema_cycle',
            render: schema_cycle => schema_cycle + ' s',
        },{
            title: '绿信比',
            align: 'center',
            dataIndex: 'green_ratio',
        },{
            title: '相位差',
            dataIndex: "offset",
            align: 'center',
            render: offset => offset + " s"
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
        const result = await reqNodes()
        if(result.code === 1){
            const data = result.data
            let nodes = {}
            data.forEach( e => {
                nodes[e.node_id] = e.node_name
            } )
            this.setState({ nodes })
        }else{
            message.error(result.message)
        }
    }

    // 加载
    loadLines = async () => {
        if(memoryUtils.line.line_id){
            this.loadLineSchemas(memoryUtils.line.line_id)
        }
    }

    // 加载全部方案
    loadLineSchemas = async (line_id) => {
        const result = await reqLineSchemas(line_id)
        if(result.code === 1){
            this.setState({ line_schema_list: result.data })
        } else {
            message.error(result.message)
        }
    }

    loadLineSchemaById = async(line_schema_id) => {
        const { nodes } = this.state
        const result = await reqLineSchemaById(line_schema_id)
        if(result.code === 1){
            const data = result.data.nodes
            let node_schema_list = data.map( e => ({ ...e, node_name: nodes[e.node_id] }) )
            this.setState({ node_schema_list })
        } else {
            message.error(result.message)
        }
    }

    // 加载点位信号方案
    loadNodeSchemaById = async (node_schema_id) => {
        const result = await reqNodeSchemaById(node_schema_id)
        if(result.code === 1){
            let node_schema = result.data
            let node_schema_phases = vector.property_unique(node_schema.phases, 'phase_index')
            this.setState({ node_schema_phases })
        } else {
            message.error(result.message)
        }
        
    }

    componentWillMount() {
        this.loadNodes()
        this.loadLines()
        this.initColumns()
    }

    componentWillUnmount() {
        this.setState = (state, callback) => {
            return
        }
    }

    render() {

        const { line_schema_list, node_schema_list, node_schema_phases } = this.state

        return (
            <div className="full">
                <div className="lyf-card-title">
                    <LinkButton onClick={ () => this.props.history.goBack() }>
                        <Icon type="arrow-left"></Icon>
                    </LinkButton>
                    &nbsp;&nbsp;
                    <span>干线管理</span>
                </div>
                <div
                    style={{ height: 60, width:'100%' }}
                >
                    <div className="lyf-center" style={{ width: '100%', height: 60, borderBottom: '1px solid #1DA57A' }}>
                        <div className="lyf-col-1 lyf-center" style={{ textAlign:"center" }}>
                            <Button size="small" onClick={ () => { this.props.history.push("/line/signal-add") } }>添加方案</Button>
                        </div>
                    </div>
                </div>
                <div style={{ width: '100%', height: "calc(100% - 120px)", display: 'flex', flexWrap: 'nowrap' }}>
                    <div className="lyf-col-5">
                        <div className="lyf-row-5">
                            <Table
                                bordered = { true }
                                rowKey = "line_schema_id"
                                columns = { this.line_schema_columns }
                                dataSource = { line_schema_list }
                                pagination = { false }
                                align="center"
                            />
                        </div>
                        <div className="lyf-row-5">
                            <Table
                                bordered = { true }
                                rowKey = "node_schema_id"
                                columns = { this.node_schema_columns }
                                dataSource = { node_schema_list }
                                pagination = { false }
                            />
                        </div>

                    </div>
                    <div className="lyf-col-5">
                        <div className="lyf-row-5 lyf-center">
                            <Table
                                bordered = { true }
                                rowKey = "phase_index"
                                columns = { this.phase_columns }
                                dataSource = { node_schema_phases }
                                pagination = { false }
                                style={{ width: '100%', height: '100%' }}
                            />
                        </div>
                        <div className="lyf-row-5 lyf-center">
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
