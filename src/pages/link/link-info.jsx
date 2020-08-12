import React, { Component } from 'react'
import { Table, message, Icon, Popconfirm } from 'antd'
import L from 'leaflet'
import LinkButton from '../../components/link-button'
import { TMS, MAP_CENTER, LINK_CONFIG } from '../../utils/baoshan'
import { reqLinks, reqDeleteLink } from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import '../../utils/leaflet/LeafletLegend'
import _ from 'lodash'
import './link.less'

export default class LinkInfo extends Component {

    state = {
        loading: false,
        links: [],
        tableBodyHeight: 480,
    }

    // 初始化路段列
    initColumns = () => {
        return [{
            title: '路段名称',
            width: 200,
            dataIndex: 'link_name',
        },{
            title: '操作',
            width: 100,
            render: link => (<span>
                <LinkButton onClick = { () => {
                    memoryUtils.link = link
                    this.props.history.push({ pathname: "/link/detail/" + link.link_id })
                } }>修改</LinkButton>
                <Popconfirm 
                    title="是否删除?" 
                    onConfirm={async() => {
                        let link_id = link.link_id
                        const result = await reqDeleteLink(link_id)
                        result.code === 1?message.success("删除路段成功！"):message.error(result.message)
                        this.load_links()
                    } }
                >
                    <LinkButton>删除</LinkButton>
                </Popconfirm>
            </span>)
        },{
            title: '交通参数',
            width: 100,
            render: link => (<span>
                <LinkButton onClick = { () => {
                    this.props.history.push("/link/param")
                } }>查看参数</LinkButton>
            </span>)
        },]
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

    // 加载路段列表数据
    load_links = async () => {
        const result = await reqLinks()
        if(result.code === 1){
            this.setLink(result.data)
            this.setState({ 
                links: result.data
            })
        }else{
            message.error(result.message)
        }
    }

    // 将路段添加到地图
    setLink = (links) => {
        this.link = []
        links.forEach( link => {
            const link_pts_string = link.link_sequence?link.link_sequence.trim().split(";"):"25.12,99.175;25.122,99.175".split(";")
            let link_pts = []
            link_pts_string.forEach( pt_string => {
                let lat = parseFloat(pt_string.split(',')[0])
                let lng = parseFloat(pt_string.split(',')[1])
                link_pts.push([lat, lng])
            } )
            let link_polyline = L.polyline(link_pts, {...LINK_CONFIG}).bindPopup(link.link_name)
            this.link.push(link_polyline)
        })
        L.layerGroup(this.link).addTo(this.map)
    }

    onWindowResize = _.throttle(() => {
        this.setState({ tableBodyHeight: window.innerHeight - 200  })
    }, 800)

    componentWillMount() {
        this.columns = this.initColumns()
        this.load_links()
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
        const { loading, links, tableBodyHeight } = this.state

        return (
            <div className = "lvqi-row1-col2">
                <div className = "lvqi-col-2">
                    <div className="lvqi-card-title">
                        路段地图
                    </div>
                    <div className="lvqi-card-content" id="map">
                    </div>
                </div>
                <div className = "lvqi-col-2">
                    <div className="lvqi-card-title">
                        路段列表&nbsp;&nbsp;
                        <Icon type="plus" style={{ float:'right' }} onClick={ () => {
                            memoryUtils.link = {}
                            this.props.history.push({ pathname: "/link/add" })
                        } }></Icon>
                    </div>
                    <div className="lvqi-card-content" id="table">
                        <Table 
                            style={{ wordBreak: 'break-all' }}
                            bordered = { true }
                            rowKey = "link_id"
                            columns = { this.columns }
                            dataSource = { links }
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
