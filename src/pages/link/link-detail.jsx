import React, { Component } from 'react'
import { Card, Icon, Input, Select, Button, Modal, message, Form } from 'antd'
import LinkButton from '../../components/link-button'
import L from 'leaflet'
import '../../utils/leaflet/LeafletEditable'
import { TMS, MAP_CENTER, LINK_TYPE, LINK_CONFIG, LINK_RANK, LINK_DIR } from '../../utils/baoshan'
import memoryUtils from '../../utils/memoryUtils'
import { reqLinkById, reqNodes, reqUpdateLink, reqInsertLink } from '../../api'
import { Str2LatLng } from '../../utils/lnglatUtils'

const Item = Form.Item
const Option = Select.Option

class LinkDetail extends Component {

    constructor(props) {
        super(props)
        this.map = null
    }

    state = {
        link: memoryUtils.link||{},
        map_visible: false,
        isUpdate: false,
        nodes: [],
        value: undefined,
    }
    
    // 根据ID获取路段详情
    loadLink = async (link_id) => {
        const result = await reqLinkById(link_id)
        if(result.code === 1){
            const link = result.data
            this.setState({
                link,
            })
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

    // 初始化地图 包括加载link
    initMap = () => {
        const { link } = this.state
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
            this.setLink()
        }
    }

    // 将link映射到地图上
    setLink = () => {
        const { link } = this.state
        link.link_sequence = link.link_sequence?link.link_sequence:"25.122,99.175;25.12,99.175"
        this.polyline = L.polyline(Str2LatLng(link.link_sequence), {...LINK_CONFIG}).addTo(this.map)
        this.polyline.enableEdit()
        this.polyline.on('editable:vertex:dragend', (e) => {
            let link_lnglats = e.vertex.latlngs.map( e=> [e.lat.toFixed(7), e.lng.toFixed(7)])
            link.link_sequence = link_lnglats.map( e=> e.join(",")).join(";")
            this.setState({ link })
        })
        this.map.fitBounds(this.polyline.getBounds())
        this.map.setZoom(15)
    }
    
    // link 修改
    linkLocation = () => {
        this.setState({ map_visible: true })
        this.initMap()
    }

    // 表单点位过滤
    handleFilter = (inputValue, option) => {
        if(!/[a-zA-Z]/.test(inputValue)){
            return option.props.children.indexOf(inputValue) === -1?false:true
        }
    }

    // 点位选择
    handleChange = value => {
        this.setState({ value })
    }
    
    // 提交修改
    handleSubmit = ( event ) => {
        event.preventDefault()
        const {isUpdate} = this.state
        this.props.form.validateFields( async (error, values) => {
            if( !error ){
                let { link } = this.state
                if(isUpdate || link.link_sequence){
                    const result = isUpdate?await reqUpdateLink({ ...link, ...values }):await reqInsertLink({ ...link, ...values })
                    if(result.code === 1){
                        message.success(isUpdate?"更新路段成功！":"添加路段成功！")
                        this.props.history.replace("/link")
                    }else{
                        message.error(result.message)
                    }
                }else{
                    message.error("请选择路段形状！")
                }

            }
        } )
    }

    componentWillMount() {
        let { link } = this.state
        this.loadNodes()
        if( link.link_id ){
            this.setState({ isUpdate: true })
            this.loadLink(link.link_id)
        }
    }

    componentWillUnmount() {
        this.setState = (state, callback) => {
            return
        }
    }

    render() {

        const { getFieldDecorator }  = this.props.form

        const { map_visible, link, nodes } = this.state

        const title = (
            <span>
                <LinkButton onClick={ () => this.props.history.goBack() }>
                    <Icon type="arrow-left"></Icon>
                </LinkButton>
                &nbsp;&nbsp;
                <span>路段</span>
            </span>
        )

        // 表单行样式
        const layout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 8 },
        }

        const tailLayout = {
            wrapperCol: { offset: 10, span: 12 },
        }

        const options = nodes.map(node => <Option key={node.node_id} value={node.node_id}>{node.node_name}</Option>)

        return (
            <Card className="full" title={title} >
                <Form
                    { ...layout }
                    onSubmit = { this.handleSubmit }
                >
                    <Item label="路段名称">
                        {
                            getFieldDecorator("link_name", {
                                initialValue: link.link_name || '',
                            })(
                                <Input />
                            )
                        }
                    </Item>
                    <Item label="路段类型">
                        {
                            getFieldDecorator("link_rank", {
                                initialValue: link.link_rank || 1,
                            })(
                                <Select>
                                    {
                                        LINK_RANK.map( (opt, index) => (
                                            <Option key={ index } value={ index + 1 }>{ opt }</Option>
                                        ) )
                                    }
                                </Select>
                            )
                        }
                    </Item>
                    <Item label="路段形状">
                        <Button onClick={ this.linkLocation }> 修改 </Button>
                        <Modal
                            title = { "修改路段" }
                            onOk = {()=>this.setState({ map_visible: false })}
                            onCancel = {()=>this.setState({ map_visible: false })}
                            visible = { map_visible }
                            forceRender = { true }
                        >
                            <div style = {{ width: '100%', height: 300 }} id="map">  </div>
                        </Modal>
                    </Item>
                    <Item label="路段长度">
                        {
                            getFieldDecorator("link_length", {
                                initialValue: link.link_length || '',
                            })(
                                <Input suffix="米"/>
                            )
                        }
                    </Item>
                    <Item label="路段方向">
                        {
                            getFieldDecorator("link_dir", {
                                initialValue: link.link_dir || '',
                            })(
                                <Select style={{ width: '100%' }}>
                                    {
                                        LINK_DIR.map( (e, i) => <Option key={i} value = {i}>{e}</Option> )
                                    }
                                </Select>
                            )
                        }
                    </Item>
                    <Item label="起始点位">
                        {
                            getFieldDecorator("start_node", {
                                initialValue: link.start_node || '',
                            })(
                                <Select showSearch filterOption={ this.handleFilter } style={{ width: '100%' }} onChange={this.handleChange}>
                                    {
                                        options
                                    }
                                </Select>
                            )
                        }
                    </Item>
                    <Item label="结束点位">
                        {
                            getFieldDecorator("end_node", {
                                initialValue: link.end_node || '',
                            })(
                                <Select showSearch filterOption={ this.handleFilter } style={{ width: '100%' }} onChange={this.handleChange}>
                                    {
                                        options
                                    }
                                </Select>
                            )
                        }
                    </Item>

                    <Item { ...tailLayout }>
                        <Button htmlType="submit"> 提交 </Button>
                    </Item>
                </Form>
            </Card>
        )
    }
}

export default Form.create()(LinkDetail)