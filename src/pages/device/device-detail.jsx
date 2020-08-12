import React, { Component } from 'react'
import { Form, Input, Button, Select, Tabs, TreeSelect, Radio, Modal, Icon, message, Table } from 'antd'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import LinkButton from '../../components/link-button'
import { TMS, MAP_CENTER, DEVICE_CAP_DIR } from '../../utils/baoshan'
import memoryUtils from '../../utils/memoryUtils'
import { getTodayDateString } from '../../utils/dateUtils'
import { reqDeviceById, reqNodes, reqUpdateDevice, reqInsertDevice } from '../../api'
import { gcj02tobd09 } from '../../utils/lnglatUtils'

const Item = Form.Item
const Option = Select.Option

class DeviceDetail extends Component {

    state = {
        device: memoryUtils.device||{},
        isUpdate: false,
        map_visible: false,
        nodes: [],
    }
    // 初始化地图
    initMap = () => {
        const { setFieldsValue }  = this.props.form
        if(!this.map){
            this.map = L.map('map', {
                center: MAP_CENTER,
                zoom: 14,
                zoomControl: false,
                attributionControl: false,
            })
            L.tileLayer(TMS, { maxZoom: 16 }).addTo(this.map)

            const{ isUpdate } = this.state
            let dev_lat_lng = isUpdate?[this.state.device.dev_lat, this.state.device.dev_lng]:[25.12,99.175]
            this.dev = L.circle(dev_lat_lng, {radius:20, fillOpacity: 1}).addTo(this.map)
            this.map.setView(dev_lat_lng)
            this.map.setZoom(15)

            this.map.on("click", (e) => {
                this.dev.setLatLng([e.latlng.lat.toFixed(8), e.latlng.lng.toFixed(8)])
                setFieldsValue({ dev_lng: e.latlng.lng.toFixed(8), dev_lat: e.latlng.lat.toFixed(8) })
            })
            this.map._onResize()
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
        
    // 根据ID获取设备详情
    loadDeviceById = async (dev_id) => {
        const result = await reqDeviceById(dev_id)
        if(result.code === 1){
            const device = result.data
            this.setState({ device })
            
        }else{
            message.error(result.message)
        }
    }

    // 显示地图
    showLocation = ( value ) => {
        this.setState({
            map_visible: true
        })
        !this.map||this.map === null ?this.initMap():this.map._onResize()
    }

    handleSubmit = (e) => {
        e.preventDefault()
        const { isUpdate } = this.state
        this.props.form.validateFields( async (err, values) => {
            if( !err ){
                let device = values
                let lng = values.dev_lat_lng.split(",")[0]
                let lat = values.dev_lat_lng.split(",")[1]

                // device.dev_lat = gcj02tobd09(lng, lat)[1]
                // device.dev_lng = gcj02tobd09(lng, lat)[0]

                device.dev_lat = lat
                device.dev_lng = lng

                const result = isUpdate?await reqUpdateDevice(device):await reqInsertDevice(device)
                if(result.code === 1){
                    message.success(isUpdate?"更新设备成功！":"添加设备成功！")
                    this.props.history.replace("/device")
                }else{
                    message.error(result.msg)
                }
            }
        } )
    }

    componentDidMount() {
        let { device } = this.state
        if(device.dev_id){
            this.setState({ isUpdate: true })
            this.loadDeviceById(device.dev_id)
        }
        this.loadNodes()
    }
    
    componentWillUnmount = () => {
        this.setState = (state, callback) => {
            return
        }
    }
    
    render() {

        const { map_visible, device, nodes } = this.state

        const { getFieldDecorator } = this.props.form

        // 表单行样式
        const form_layout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 8 },
        }

        const tailLayout = {
            wrapperCol: { offset: 10, span: 12 },
        }

        return (
            <div className="lyf-card">
                <div className="lyf-card-title">
                    <LinkButton onClick={ () => this.props.history.goBack() }>
                        <Icon type="arrow-left"></Icon>
                    </LinkButton>
                    &nbsp;&nbsp;
                    <span>设备管理</span>
                </div>
                <div className="lyf-card-content">
                    <Form
                        { ...form_layout }
                        onSubmit = { this.handleSubmit }
                        className="full"
                    >
                        <Item label="设备编号">
                            {
                                getFieldDecorator("dev_id", {
                                    initialValue: device.dev_id || '',
                                })(
                                    <Input />
                                )
                            }
                        </Item>
                        <Item label="设备名称">
                            {
                                getFieldDecorator("dev_name", {
                                    initialValue: device.dev_name || '',
                                })(
                                    <Input />
                                )
                            }
                        </Item>
                        <Item label="设备坐标">
                            {
                                getFieldDecorator("dev_lat_lng", {
                                    initialValue: device.dev_lng?(device.dev_lng + ',' + device.dev_lat):"99.175,25.12",
                                    rules: [
                                        { required: false, message: "必须选择经纬度！" }
                                    ]
                                })(
                                    <Input.Search size="small" onSearch = { this.showLocation } enterButton="定位" placeholder="请选择经纬度!" />
                                )
                            }
                            <Modal
                                title = { "选择经纬度" }
                                okText = { "确定" }
                                cancelText = { "取消" }
                                centered = { true }
                                forceRender = { true }
                                visible = { map_visible }
                                onOk = { () => this.setState({ map_visible: false }) }
                                onCancel = { () => this.setState({ map_visible: false }) }
                            >
                                <div style={{ width: '100%', height: 300 }} id="map"></div>
                            </Modal>
                        </Item>
                        <Item label="拍摄角度">
                            {
                                getFieldDecorator("cap_angle", {
                                    initialValue: device.cap_angle?(device.cap_angle):'0',
                                })(
                                    <Input/>
                                )
                            }
                        </Item>
                        <Item label="设备点位">
                            {
                                getFieldDecorator("node_id", {
                                    initialValue: device.node_id || '',
                                })(
                                    
                                    nodes.length>0?<Select>
                                        {
                                            nodes.map( e => <Option key={ e.node_id } value={ e.node_id }>{ e.node_name }</Option> )
                                        }
                                    </Select>:<></>
                                )
                            }
                        </Item>
                        <Item label="拍摄方向">
                            {
                                getFieldDecorator("cap_dir", {
                                    initialValue: device.cap_dir || '',
                                })(
                                    <Select>
                                        {
                                            DEVICE_CAP_DIR.map( (e, i) => <Option key={i} value={i+1}>{e}</Option> )
                                        }
                                    </Select>
                                )
                            }
                        </Item>
                        <Item label="拍摄车道数">
                            {
                                getFieldDecorator("cap_num", {
                                    initialValue: device.cap_num || '2',
                                })(
                                    <Input/>
                                )
                            }
                        </Item>
                        <Item label="设备位置">
                            {
                                getFieldDecorator("dev_location", {
                                    initialValue: device.dev_location || '',
                                })(
                                    <Input/>
                                )
                            }
                        </Item>
                        <Item label="IP地址">
                            {
                                getFieldDecorator("ip_address", {
                                    initialValue: device.ip_address || '192.',
                                })(
                                    <Input/>
                                )
                            }
                        </Item>
                        <Item label="设备类型">
                            {
                                getFieldDecorator("dev_type", {
                                    initialValue: device.dev_type || '',
                                })(
                                    <Input/>
                                )
                            }
                        </Item>
                        <Item label="创建日期">
                            {
                                getFieldDecorator("create_time", {
                                    initialValue: device.create_time || getTodayDateString(),
                                })(
                                    <Input/>
                                )
                            }
                        </Item>
                        <Item label="距标准位置">
                            {
                                getFieldDecorator("dist_to_norm", {
                                    initialValue: device.dist_to_norm || '0',
                                })(
                                    <Input/>
                                )
                            }
                        </Item>
                        <Item label="设备描述">
                            {
                                getFieldDecorator("description", {
                                    initialValue: device.description || '无',
                                })(
                                    <Input/>
                                )
                            }
                        </Item>
                        <Item {...tailLayout}>
                            <Button htmlType="submit" type="primary">提交</Button>
                        </Item>
                    </Form>
                </div>
            </div>
        )
    }
}
    
export default Form.create()(DeviceDetail)