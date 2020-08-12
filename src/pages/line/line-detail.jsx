import React, { Component } from 'react'
import { Card, Icon, Input, Select, Button, Modal, message, Form, TreeSelect, InputNumber } from 'antd'
import LinkButton from '../../components/link-button'
import L from 'leaflet'
import { reqLineById, reqNodes, reqUpdateLine, reqLinks, reqInsertLine } from '../../api'
import { TMS, MAP_CENTER, LINK_TYPE, LINE_DIR, LINK_CONFIG, LINE_TYPE } from '../../utils/baoshan'
import '../../utils/leaflet/LeafletEditable'
import memoryUtils from '../../utils/memoryUtils'
import { Str2LatLng } from '../../utils/lnglatUtils'
import { getNowDateTimeString } from '../../utils/dateUtils'

const Item = Form.Item
const Option = Select.Option
const { SHOW_PARENT } = TreeSelect

class LineDetail extends Component {

    constructor(props) {
        super(props)
        this.map = null
    }

    state = {
        line: memoryUtils.line||{},
        line_sequence: memoryUtils.line.line_sequence||"99.175,25.12;99.175,25.122",
        map_visible: false,
        nodes: [],
        node_num: memoryUtils.line.node_num||2,
        value: undefined,
        isUpdate: false,
    }
    
    // 根据ID获取干线详情
    loadLineById = async (line_id) => {
        const result = await reqLineById(line_id)
        if(result.code === 1){
            const line = result.data
            this.setState({ line })
        }else{
            message.error(result.message)
        }
    }

    // 加载点位
    loadNodes = async () => {
        const result = await reqNodes()
        if(result.code === 1){
            let nodes = result.data
            this.setState({ nodes })            
        }
    }

    // 初始化地图 包括加载line
    initMap = () => {
        const { line } = this.state
        if(!this.map){
            this.map = L.map('map', {
                editable: true,
                center: MAP_CENTER,
                zoom: 14,
                zoomControl: false,
                attributionControl: false,
            })
            L.tileLayer(TMS, { maxZoom: 16 }).addTo(this.map)
            this.map._onResize()
            this.setLinePts()
        }
    }

    // 将line映射到地图上
    setLinePts = () => {
        const { line, line_sequence } = this.state
        line.line_sequence = line.line_sequence?line.line_sequence:line_sequence
        this.setState({ line })
        this.polyline = L.polyline(Str2LatLng(line.line_sequence), {...LINK_CONFIG}).addTo(this.map)
        this.polyline.enableEdit()
        this.polyline.on('editable:vertex:dragend', (e) => {
            let line_lnglats = e.vertex.latlngs.map( e=> [e.lng.toFixed(7), e.lat.toFixed(7)])
            let new_line_sequence = line_lnglats.map( e=> e.join(",")).join(";")
            line.line_sequence = new_line_sequence
            this.setState({ line: line, line_sequence: new_line_sequence})
        })
        this.map.fitBounds(this.polyline.getBounds())
        this.map.setZoom(15)
    }
    
    // line 修改
    lineLocation = () => {
        this.setState({ map_visible: true })
        this.initMap()
    }

    // 表单点位过滤
    handleFilter = (inputValue, option) => {
        if(!/[a-zA-Z]/.test(inputValue)){
            return option.props.children.indexOf(inputValue) === -1?false:true
        }
    }

    onLineNodesChange = nodes => {
        const { line, isUpdate } = this.state
        line.node_num = nodes.length
        line.node_list = nodes.join(",")
        line.nodes = isUpdate?nodes.map( (e,i) => ({ node_index: i + 1, line_id: line.line_id, node_id: e })):nodes.map( (e,i) => ({ node_index: i + 1, node_id: e }))
        this.setState({ line })
    }

    // 表单点位过滤
    handleFilter = (inputValue, option) => {
        if(!/[a-zA-Z]/.test(inputValue)){
            return option.props.children.indexOf(inputValue) === -1?false:true
        }
    }

    getValues = () => {
        let result = undefined
        this.props.form.validateFields( async (err, values) => {
            if( !err ){
                result = this.convertData(values)
            }else{
                message.error("数据提交失败！")
            }
        } )
        return result
    }

    convertData = (values) => {
        let new_line = {}

        const { line, node_num, line_sequence, isUpdate } = this.state
        new_line = {...line, ...values}

        let data = Object.entries( new_line )
        let node_list = data.filter( (item, index) => item[0].indexOf("node_id_") !== -1 && item[1]!=="" ).map( e => e[1] )
        new_line.update_time = getNowDateTimeString()
        new_line.node_num = node_list.length
        new_line.line_sequence = line_sequence
        new_line.nodes = isUpdate?node_list.map( (node_id, index) => ({ line_id: new_line.line_id, node_index: (index + 1), node_id: node_id }) ):node_list.map( (node_id, index) => ({ node_index: (index + 1), node_id: node_id }) )
        new_line.node_list = node_list.toString()
        return new_line
    }


    // 提交修改
    handleSubmit = async ( event ) => {
        event.preventDefault()
        const {isUpdate} = this.state
        let line = this.getValues()
        
        const result = isUpdate? await reqUpdateLine(line):await reqInsertLine(line)
        if(result.code === 1){
            message.success(isUpdate?"更新干线成功！":"添加干线成功！")
            this.props.history.replace("/line")
        }else{
            message.error(result.message)
        }
    }

    componentWillMount() {
        let { line } = this.state
        if(line.line_id){
            this.setState({ isUpdate: true })
            this.loadLineById(line.line_id)
        }
        this.loadNodes()
    }

    componentWillUnmount = () => {
        this.setState = (state, callback) => {
            return
        }
    }

    render() {

        const { getFieldDecorator }  = this.props.form

        const { map_visible, line, nodes, node_num } = this.state

        const title = (
            <span>
                <LinkButton onClick={ () => this.props.history.replace('/line') }>
                    <Icon type="arrow-left"></Icon>
                </LinkButton>
                &nbsp;&nbsp;
                <span>干线管理</span>
            </span>
        )

        const options = nodes.map(node => <Option key={node.node_id} value={node.node_id}>{node.node_name}</Option>)

        // 表单行样式
        const form_layout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 8 },
        }

        const tailLayout = {
            wrapperCol: { offset: 10, span: 12 },
        }

        return (
            <Card className="full" title={ title } >
                <Form
                    { ...form_layout }
                    onSubmit = { this.handleSubmit }
                >
                    <Item label="干线名称">
                        {
                            getFieldDecorator("line_name", {
                                initialValue: line.line_name || '',
                            })(
                                <Input />
                            )
                        }
                    </Item>
                    <Item label="干线形状">
                        <Button onClick={ this.lineLocation }> 修改 </Button>
                        <Modal
                            title = { "干线形状" }
                            onOk = {()=>this.setState({ map_visible: false })}
                            onCancel = {()=>this.setState({ map_visible: false })}
                            visible = { map_visible }
                            forceRender = { true }
                        >
                            <div style = {{ width: '100%', height: 300 }} id="map">  </div>
                        </Modal>
                    </Item>
                    <Item label="点位数量">
                        {
                            getFieldDecorator("node_num", {
                                initialValue: line.node_num || node_num,
                            })(
                                <InputNumber onChange={ node_num => this.setState({ node_num }) }/>
                            )
                        }
                    </Item>
                    <Item label="干线方向">
                        {
                            getFieldDecorator("line_dir", {
                                initialValue: line.line_dir || '',
                            })(
                                <Select>
                                    {
                                        LINE_DIR.map( (dir,index) => <Option key={index} value={index + 1}>{dir}</Option> )
                                    }
                                </Select>
                            )
                        }
                    </Item>
                    <Item label="协调方式">
                        {
                            getFieldDecorator("line_type", {
                                initialValue: line.line_type || 1,
                            })(
                                <Select>
                                    {
                                        LINE_TYPE.map( (type,index) => <Option key={index} value={index + 1}>{type}</Option> )
                                    }
                                </Select>
                            )
                        }
                    </Item>
                    {
                        new Array(node_num).toString().split(",").map( (e, i) => <Item key={i} label={ '路口' + ( i + 1 ) }>
                            {
                                getFieldDecorator("node_id_" + ( i + 1 ), {
                                    initialValue: line.nodes&&line.nodes[i]?line.nodes[i].node_id:"",
                                })(
                                    <Select 
                                        showSearch 
                                        filterOption={this.handleFilter} 
                                        style={{ width: '100%' }} 
                                        size="small"
                                    >
                                        <Option value="">请选择</Option>
                                        {options}
                                    </Select>
                                )
                            }
                        </Item> )
                    }
                    <Item { ...tailLayout }>
                        <Button htmlType="submit"> 提交 </Button>
                    </Item>
                </Form>
            </Card>
        )
    }
}

export default Form.create()(LineDetail)