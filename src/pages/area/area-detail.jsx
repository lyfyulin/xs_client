import React, { Component } from 'react'
import { Card, Icon, Input, Select, Button, Modal, message, Form, TreeSelect } from 'antd'
import LinkButton from '../../components/link-button'
import L from 'leaflet'
import { reqAreaById, reqNodes, reqUpdateArea, reqLinks, reqInsertArea } from '../../api'
import { TMS, MAP_CENTER, LINK_TYPE, AREA_CONFIG } from '../../utils/baoshan'
import '../../utils/leaflet/LeafletEditable'
import memoryUtils from '../../utils/memoryUtils'
import { Str2LatLng } from '../../utils/lnglatUtils'

const Item = Form.Item
const Option = Select.Option
const { SHOW_PARENT } = TreeSelect

class AreaDetail extends Component {

    constructor(props) {
        super(props)
        this.map = null
    }

    state = {
        area: memoryUtils.area||{},
        map_visible: false,
        isUpdate: false,
        node_list: [],
        link_list: [],
        value: undefined,
    }
    
    // 根据ID获取区域详情
    loadAreaById = async (area_id) => {
        const result = await reqAreaById(area_id)
        if(result.code === 1){
            const area = result.data
            this.setState({ area })
        }else{
            message.error(result.message)
        }
    }

    // 加载点位
    loadNodes = async () => {
        const result = await reqNodes()
        if(result.code === 1){
            let node_list = result.data
            this.setState({ node_list })            
        }
    }

    // 加载路段
    loadLinks = async () => {
        const result = await reqLinks()
        if(result.code === 1){
            let link_list = result.data
            this.setState({ link_list })
        }else{
            message.error(result.message)
        }
    }

    // 初始化地图 包括加载area
    initMap = () => {
        const { area } = this.state
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
            this.setAreaPts()
        }
    }

    // 将area映射到地图上
    setAreaPts = () => {
        const { area } = this.state
        area.area_sequence = area.area_sequence?area.area_sequence:"99.175,25.12;99.175,25.122;99.176,25.122"
        this.setState({ area })
        this.polygon = L.polygon(Str2LatLng(area.area_sequence), {...AREA_CONFIG}).addTo(this.map)
        this.polygon.enableEdit()
        this.polygon.on('editable:vertex:dragend', (e) => {
            let area_lnglats = e.vertex.latlngs.map( e=> [e.lng.toFixed(7), e.lat.toFixed(7)])
            area.area_sequence = area_lnglats.map( e=> e.join(",")).join(";")
            this.setState({ area })
        })

        this.map.fitBounds(this.polygon.getBounds())
        this.map.setZoom(15)
    }
    
    // area 修改
    areaLocation = () => {
        this.setState({ map_visible: true })
        this.initMap()
    }

    // 表单点位过滤
    handleFilter = (inputValue, option) => {
        if(!/[a-zA-Z]/.test(inputValue)){
            return option.props.children.indexOf(inputValue) === -1?false:true
        }
    }

    onAreaNodesChange = nodes => {
        const { area, isUpdate } = this.state
        area.nodes = isUpdate?nodes.map( (e,i) => ({ node_index: i + 1, area_id: area.area_id, node_id: e })):nodes.map( (e,i) => ({ node_index: i + 1, node_id: e }))
        this.setState({ area })
    }
    
    onAreaLinksChange = links => {
        const { area, isUpdate } = this.state
        area.links = isUpdate?links.map( (e,i) => ({ link_index: i + 1, area_id: area.area_id, link_id: e*1 })):links.map( (e,i) => ({ link_index: i + 1, link_id: e*1 }))
        this.setState({ area })
    }

    // 提交修改
    handleSubmit = ( event ) => {
        event.preventDefault()
        const { isUpdate } = this.state
        this.props.form.validateFields( async (error, values) => {
            if( !error ){
                let { area } = this.state
                if(isUpdate || area.area_sequence){
                    const result = isUpdate?await reqUpdateArea({ ...area, ...values }):await reqInsertArea({ ...area, ...values })
                    if(result.code === 1){
                        message.success(isUpdate?"更新区域成功！":"添加区域成功！")&&this.props.history.replace("/area")
                    }else{
                        message.error(result.message)
                    }
                }else{
                    message.error("请选择区域形状!")
                }

            }
        } )
    }

    componentWillMount() {
        const { area } = this.state
        if(area.area_id){
            this.setState({ isUpdate: true })
            this.loadAreaById(area.area_id)
        }
        this.loadNodes()
        this.loadLinks()
    }

    componentWillUnmount = () => {
        this.setState = (state, callback) => {
            return
        }
    }

    render() {

        const { getFieldDecorator }  = this.props.form

        const { map_visible, area, node_list, link_list } = this.state

        const title = (
            <span>
                <LinkButton onClick={ () => this.props.history.replace('/area') }>
                    <Icon type="arrow-left"></Icon>
                </LinkButton>
                &nbsp;&nbsp;
                <span>区域</span>
            </span>
        )

        const treeDataNode = node_list.map(node => ({ title: node.node_name, value: node.node_id, key: node.node_id }))
        const area_nodes = area.nodes&&area.nodes.length>0&&area.nodes[0]?area.nodes.map( e => e.node_id ):[]
        const treePropsNode = {
            treeData: treeDataNode,
            value: area_nodes,
            onChange: this.onAreaNodesChange,
            treeCheckable: true,
        }

        const treeDataLink = link_list.map(link => ({ title: link.link_name, value: ''+link.link_id, key: link.link_id }))
        const area_links = area.links&&area.links.length>0&&area.links[0]?area.links.map( e => e.link_id ):[]
        const treePropsLink = {
            treeData: treeDataLink,
            value: area_links,
            onChange: this.onAreaLinksChange,
            treeCheckable: true,
        }

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
                    <Item label="区域名称">
                        {
                            getFieldDecorator("area_name", {
                                initialValue: area.area_name || '',
                            })(
                                <Input />
                            )
                        }
                    </Item>
                    <Item label="区域形状">
                        <Button onClick={ this.areaLocation }> 修改 </Button>
                        <Modal
                            title = { "修改区域" }
                            onOk = {()=>this.setState({ map_visible: false })}
                            onCancel = {()=>this.setState({ map_visible: false })}
                            visible = { map_visible }
                            forceRender = { true }
                        >
                            <div style = {{ width: '100%', height: 300 }} id="map">  </div>
                        </Modal>
                    </Item>
                    <Item label="区域描述">
                        {
                            getFieldDecorator("description", {
                                initialValue: area.description || '',
                            })(
                                <Input/>
                            )
                        }
                    </Item>
                    <Item label="区域点位">
                        <TreeSelect { ...treePropsNode } />
                    </Item>
                    <Item label="区域路段">
                        <TreeSelect { ...treePropsLink } />
                    </Item>
                    <Item { ...tailLayout }>
                        <Button htmlType="submit"> 提交 </Button>
                    </Item>
                </Form>
            </Card>
        )
    }
}

export default Form.create()(AreaDetail)