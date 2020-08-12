import React, { Component } from 'react'
import { Table, message, Icon, Popconfirm } from 'antd'
import L from 'leaflet'
import LinkButton from '../../components/link-button'
import { TMS, MAP_CENTER, AREA_CONFIG, AREA_BLINK_CONFIG } from '../../utils/baoshan'
import { reqAreas, reqDeleteArea } from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import '../../utils/leaflet/LeafletLegend'
import _ from 'lodash'

import './area.less'


export default class AreaInfo extends Component {

    state = {
        loading: false,
        areas: [],
        tableBodyHeight: 480
    }

    // 初始化区域列
    initColumns = () => {
        return [{
            title: '区域编号',
            width: 200,
            dataIndex: 'area_id',
        },{
            title: '区域名称',
            width: 200,
            // dataIndex: 'area_name',
            render: area => <a 
                onClick ={ () => { this.areaBlink(area) } }
            >
                { area.area_name }
            </a>
        },{
            title: '操作',
            width: 200,
            render: area => (<span>
                <LinkButton onClick = { () => {
                    memoryUtils.area = area
                    this.props.history.push({ pathname: "/area/detail/" + area.area_id })
                } }>修改</LinkButton>
                <Popconfirm 
                    title="是否删除?" 
                    onConfirm={async() => {
                        let area_id = area.area_id
                        const result = await reqDeleteArea(area_id)
                        result.code === 1?message.success("删除区域成功！"):message.error(result.message)
                        this.load_areas()
                    } }
                >
                    <LinkButton>删除</LinkButton>
                </Popconfirm>
            </span>)
        }]
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

    // 加载区域列表数据
    load_areas = async () => {
        const result = await reqAreas()
        if(result.code === 1){
            const areas = result.data.map( (e, index) => ({ index: index, ...e }) )
            this.setArea(areas)
            this.setState({ 
                areas
            })
        }else{
            message.error(result.message)
        }
    }

    // 将区域添加到地图
    setArea = (areas) => {
        this.area = []
        areas.forEach( area => {
            const area_pts_string = area.area_sequence?area.area_sequence.trim().split(";"):"99.175,25.12;99.175,25.122;99.176,25.122".split(";")
            let area_pts = []
            area_pts_string.forEach( pt_string => {
                let lat = parseFloat(pt_string.split(',')[1])
                let lng = parseFloat(pt_string.split(',')[0])
                area_pts.push([lat, lng])
            } )
            let area_polygon = L.polygon(area_pts, { ...AREA_CONFIG }).bindPopup(area.area_name)
            this.area.push(area_polygon)
        })
        L.layerGroup(this.area).addTo(this.map)
    }

    
    areaBlink = (area) => {
        this.map.fitBounds(this.area[area.index].getBounds())
        this.area[area.index].setStyle({ ...AREA_BLINK_CONFIG })
        setTimeout( () => {
            this.area[area.index].setStyle({  ...AREA_CONFIG  })
        }, 1000 )
    }

    onWindowResize = _.throttle(() => {
        this.setState({ tableBodyHeight: window.innerHeight - 200  })
    }, 800)

    componentWillMount() {
        this.columns = this.initColumns()
        this.load_areas()
    }

    componentDidMount() {
        this.initMap()
        this.setState({ tableBodyHeight: window.innerHeight - 200  })
        window.addEventListener('resize', this.onWindowResize)
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowResize)
        this.setState = (state, callback) => {
            return
        }
    }
    render() {
        const { loading, areas, tableBodyHeight } = this.state

        return (
            <div className = "lvqi-row1-col2">
                <div className = "lvqi-col-2">
                    <div className="lvqi-card-title">
                        区域地图
                    </div>
                    <div className="lvqi-card-content" id="map">
                    </div>
                </div>
                <div className = "lvqi-col-2">
                    <div className="lvqi-card-title">
                        区域列表&nbsp;&nbsp;
                        <Icon type="plus" style={{ float:'right' }} onClick={ () => {
                            memoryUtils.area = {}
                            this.props.history.push({ pathname: "/area/add" })
                        } }></Icon>
                    </div>
                    <div className="lvqi-card-content" id="table">
                        <Table 
                            style={{ wordBreak: 'break-all' }}
                            bordered = { true }
                            rowKey = "area_id"
                            columns = { this.columns }
                            dataSource = { areas }
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
