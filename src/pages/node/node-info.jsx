import React, { Component } from 'react'
import { Table, message, Icon, Radio } from 'antd'
import L from 'leaflet'
import LinkButton from '../../components/link-button'
import { reqNodes, reqUrbanNodes, reqHighwayNodes, reqDJNodes, reqQuxianDevices, reqQuxianNodes } from '../../api'
import { TMS, MAP_CENTER, NODE_CONFIG } from '../../utils/baoshan'
import memoryUtils from '../../utils/memoryUtils'
import _ from 'lodash'

import './node-info.less'
import 'leaflet/dist/leaflet.css'
import { bd09togcj02 } from '../../utils/lnglatUtils'

export default class NodeInfo extends Component {

    state = {
        loading: false,
        nodes: [],
        tableBodyHeight: 480,
        node_location: '2',
    }

    // 初始化表格列
    initColumns = () => {
        return [{
            title: '交叉口名称',
            dataIndex: 'node_name',
            width: 200,
        },{
            title: '几何布局',
            width: 100,
            render: node => (
                <LinkButton onClick = { () => {
                    memoryUtils.node = node
                    this.props.history.push({ pathname: "/node/geometry/" + node.node_id })
                } }>查看布局</LinkButton>
            )
        },{
            title: '流量信息',
            width: 100,
            render: node => (
                <LinkButton onClick = { async () => {
                    memoryUtils.node = node
                    this.props.history.push({ pathname: "/node/flow/" + node.node_id })
                } }>查看流量</LinkButton>
            )
        }]
    }

    // 加载点位列表
    loadNodes = async (node_location) => {
        const result = node_location === '1'? await reqNodes():node_location === '2'? await reqUrbanNodes(): node_location === '3'? await reqHighwayNodes(): node_location === '4'?  await reqQuxianNodes(): await reqDJNodes()

        if(result.code === 1){
            this.setNode(result.data)
            this.setState({ 
                nodes: result.data,
            })
        }else{
            message.error(result.message)
        }

    }

    // 将点位添加到地图
    setNode = (nodes) => {
        this.node = []
        nodes.forEach( e => {

            let lat = parseFloat(e.node_lng_lat.split(',')[1])
            let lng = parseFloat(e.node_lng_lat.split(',')[0])

            // let lat = bd09togcj02(tmp_lng, tmp_lat)[1]
            // let lng = bd09togcj02(tmp_lng, tmp_lat)[0]
            
            this.node.push( L.circle([lat, lng], {...NODE_CONFIG}).bindPopup(e.node_name) )
        })
        this.node_layer? this.map.removeLayer(this.node_layer):console.log()
        this.node_layer = L.layerGroup(this.node)
        this.node_layer.addTo(this.map)
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
        }
    }

    componentWillMount() {
        this.columns = this.initColumns()
        this.loadNodes(this.state.node_location)
    }

    onWindowResize = _.throttle(() => {
        this.setState({ tableBodyHeight: window.innerHeight - 200  })
    }, 800)
    
    componentDidMount() {
        this.initMap()
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
        const { loading, nodes, tableBodyHeight, node_location } = this.state
        return (
            <div className = "lvqi-row1-col2">
                <div className = "lvqi-col-2">
                    <div className="lvqi-card-title">
                        点位地图
                    </div>
                    <div className="lvqi-card-content" id="map">
                    </div>
                </div>
                <div className = "lvqi-col-2">
                    <div className="lvqi-card-title">
                        点位列表
                        &nbsp;&nbsp;
                        <Icon type="plus" style={{ float:'right' }} onClick={ () => {
                            memoryUtils.node = {}
                            this.props.history.push({ pathname: "/node/add" })
                        } }></Icon>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <Radio.Group size="small" defaultValue={ node_location } onChange={ (event) => {this.loadNodes(event.target.value);this.setState({ node_location: event.target.value })} }>
                            <Radio.Button value="1">全部</Radio.Button>
                            <Radio.Button value="2">城区</Radio.Button>
                            <Radio.Button value="3">高速</Radio.Button>
                            <Radio.Button value="4">区县界</Radio.Button>
                            <Radio.Button value="5">电警</Radio.Button>
                        </Radio.Group>
                    </div>
                    <div className="lvqi-card-content" id="table">
                        <Table 
                            bordered = { true }
                            rowKey = "node_id"
                            columns = { this.columns }
                            dataSource = { nodes }
                            loading = { loading }
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
