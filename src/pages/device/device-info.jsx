import React, { Component } from 'react'
import { Table, message, Icon, Popconfirm, Button, Radio } from 'antd'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import '../node/node-info.less'
import LinkButton from '../../components/link-button'
import { TMS, MAP_CENTER, DEVICE_CONFIG } from '../../utils/baoshan'
import { reqDevices, reqDeleteDevice, reqUrbanDevices, reqHighwayDevices, reqDJDevices, reqQuxianDevices } from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import { bd09togcj02 } from '../../utils/lnglatUtils'
import _ from 'lodash'

export default class DeviceInfo extends Component {

    state = {
        devices: [],
        tableBodyHeight: 480,
        dev_location: '1',
    }

    // 初始化表格列
    initColumns = () => {
        return [{
            title: '设备编号',
            width: 250,
            dataIndex: 'dev_id'
        },{
            title: '设备名称',
            width: 500,
            render: device => (<LinkButton onClick ={ () => { 
                    this.deviceBlink(device)
                } }> { device.dev_name } </LinkButton>
            )
        },{
            title: '操作',
            width: 300,
            render: device => <span>
                <LinkButton onClick = { () => {
                    memoryUtils.device = device
                    this.props.history.push({ pathname: "/device/detail/" + device.dev_id })
                } }>修改</LinkButton>
                <Popconfirm 
                    title="是否删除?" 
                    onConfirm={async() => {
                        let dev_id = device.dev_id
                        const result = await reqDeleteDevice(dev_id)
                        result.code === 1?message.success("删除设备成功！"):message.error(result.message)
                        this.load_devices()
                    } }
                >
                    <LinkButton>删除</LinkButton>
                </Popconfirm>
            </span>
        }]
    }

    deviceBlink = (device) => {
        this.map.fitBounds(this.device[device.key].getBounds())
        this.device[device.key].setStyle({ color: DEVICE_CONFIG.blink })
        setTimeout( () => {
            this.device[device.key].setStyle({ color: DEVICE_CONFIG.color })
        }, 1000 )
    }

    // 加载点位列表
    load_devices = async (dev_location) => {
        // 1-全部;2-城区;3-高速;4-电警
        const result = dev_location === '1'? await reqDevices(): dev_location === '2'? await reqUrbanDevices(): dev_location === '3'? await reqHighwayDevices(): dev_location === '4'?await reqQuxianDevices(): await reqDJDevices()
        if(result.code === 1){
            const devices = result.data.map( (e, index) => ({ key: index, ...e }) )
            this.setDevice(devices)
            this.setState({ devices })
        }else{
            message.error(result.message)
        }
    }

    // 将设备添加到地图
    setDevice = (devices) => {
        this.device = []
        devices.forEach( e => {
            let lat = bd09togcj02(e.dev_lng, e.dev_lat)[1]
            let lng = bd09togcj02(e.dev_lng, e.dev_lat)[0]
            // let lat = e.dev_lat
            // let lng = e.dev_lng
            this.device.push( L.circle([lat, lng], { ...DEVICE_CONFIG }).bindPopup(`设备名称${e.dev_name}<br/><img style='width: 300px;height:auto;' src='http://192.122.2.196/dev/${e.dev_id}.png' alt='${e.dev_name}' />`) )
        })
        this.map.removeLayer(this.devices_circle)
        this.devices_circle = L.layerGroup(this.device)
        this.devices_circle.addTo(this.map)
    }

    // 初始化地图
    initMap = () => {
        if(!this.map){
            this.map = L.map('map', {
                center: MAP_CENTER,
                zoom: 14,
                zoomControl: false,
                attributionControl: false,
            })
            L.tileLayer(TMS, { maxZoom: 16 }).addTo(this.map)
            this.map._onResize()
            this.devices_circle = L.layerGroup()
            // L.Control({position:'topright'}).addTo(this.map)
        }
    }

    componentWillMount() {
        this.columns = this.initColumns()
        this.load_devices(this.state.dev_location)
    }

    onWindowResize = _.throttle(() => {
        this.setState({ tableBodyHeight: window.innerHeight - 200  })
    }, 800)
    
    componentDidMount() {
        this.initMap()
        this.setState({ tableBodyHeight: window.innerHeight - 200 })
        window.addEventListener('resize', this.onWindowResize)
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowResize)
        this.setState = (state, callback) => {
            return
        }
    }
    
    render() {
        const { devices, tableBodyHeight, dev_location } = this.state
        return (
            <div className = "lvqi-row1-col2">
                <div className = "lvqi-col-2">
                    <div className="lvqi-card-title">
                        设备地图
                    </div>
                    <div className="lvqi-card-content" id="map">
                    </div>
                </div>
                <div className = "lvqi-col-2">
                    <div className="lvqi-card-title">
                        设备列表
                        &nbsp;&nbsp;
                        <Icon type="plus" style={{ float:'right' }} onClick={ () => {
                            memoryUtils.device = {}
                            this.props.history.push({ pathname: "/device/add" })
                        } }></Icon>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <Radio.Group size="small" defaultValue={ dev_location } onChange={ (event) => {this.load_devices(event.target.value);this.setState({ dev_location: event.target.value })} }>
                            <Radio.Button value="1">全部</Radio.Button>
                            <Radio.Button value="2">城区</Radio.Button>
                            <Radio.Button value="3">高速</Radio.Button>
                            <Radio.Button value="4">区县</Radio.Button>
                            <Radio.Button value="5">电警</Radio.Button>
                        </Radio.Group>
                    </div>
                    <div className="lvqi-card-content" id="table">
                        <Table 
                            bordered = { true }
                            rowKey = "dev_id"
                            columns = { this.columns }
                            dataSource = { devices }
                            pagination = { false }
                            scroll={{ y: tableBodyHeight }}
                        >
                        </Table>
                    </div>
                </div>
            </div>
        )
    }
}
