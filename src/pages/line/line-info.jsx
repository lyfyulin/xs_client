import React, { Component } from 'react'
import { Table, message, Icon, Popconfirm } from 'antd'
import L from 'leaflet'
import LinkButton from '../../components/link-button'
import { TMS, MAP_CENTER, AREA_CONFIG, LINK_CONFIG } from '../../utils/baoshan'
import { reqLines, reqDeleteLine } from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import '../../utils/leaflet/LeafletLegend'
import _ from 'lodash'


export default class LineInfo extends Component {

    state = {
        loading: false,
        lines: [],
        tableBodyHeight: 480,
    }

    // 初始化干线列
    initColumns = () => {
        return [{
            title: '干线编号',
            width: 50,
            dataIndex: 'line_id',
        },{
            title: '干线名称',
            width: 200,
            render: line => <a 
                onClick ={ () => { this.lineBlink(line) } }
            >
                { line.line_name }
            </a>
        },{
            title: '操作',
            width: 100,
            render: line => (
                <span>
                <LinkButton onClick = { () => {
                    memoryUtils.line = line
                    this.props.history.push('/line/detail/' + line.line_id)
                } }>修改</LinkButton>
                <Popconfirm 
                    title="是否删除?" 
                    onConfirm={async() => {
                        let line_id = line.line_id
                        const result = await reqDeleteLine(line_id)
                        result.code === 1?message.success("删除干线成功！"):message.error(result.message)
                        this.load_lines()
                    } }
                >
                    <LinkButton>删除</LinkButton>
                </Popconfirm>
                </span>
                )
        },{
            title: '干线控制',
            width: 100,
            render: line => (<span>
                <LinkButton onClick = { () => {
                    memoryUtils.line = line
                    this.props.history.push("/line/signal-add")
                } }>干线控制</LinkButton>
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

    // 加载干线列表数据
    load_lines = async () => {
        const result = await reqLines()
        if(result.code === 1){
            const lines = result.data.map( (e, index) => ({ index: index, ...e }) )
            this.setLine(lines)
            this.setState({ 
                lines
            })
        }else{
            message.error(result.message)
        }
    }

    // 将干线添加到地图
    setLine = (lines) => {
        this.line && this.line.length > 0?this.map.removeLayer(this.line_layer):console.log()
        this.line = []
        lines.forEach( line => {
            const line_pts_string = line.line_sequence.trim().split(";")
            let line_pts = []
            line_pts_string.forEach( pt_string => {
                let lat = parseFloat(pt_string.split(',')[1])
                let lng = parseFloat(pt_string.split(',')[0])
                line_pts.push([lat, lng])
            } )
            let line_polyline = L.polyline(line_pts, {...LINK_CONFIG}).bindPopup(line.line_name)
            this.line.push(line_polyline)
        })
        this.line_layer = L.layerGroup(this.line)
        this.line_layer.addTo(this.map)
    }
    
    lineBlink = (line) => {
        this.map.fitBounds(this.line[line.index].getBounds())
        setTimeout( () => {
            this.line[line.index].setStyle({  ...LINK_CONFIG  })
        }, 1000 )
    }

    onWindowResize = _.throttle(() => {
        this.setState({ tableBodyHeight: window.innerHeight - 200  })
    }, 800)

    componentWillMount() {
        this.columns = this.initColumns()
        this.load_lines()
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
        const { loading, lines, tableBodyHeight } = this.state

        return (
            <div className = "lvqi-row1-col2">
                <div className = "lvqi-col-2">
                    <div className="lvqi-card-title">
                        干线地图
                    </div>
                    <div className="lvqi-card-content" id="map">
                    </div>
                </div>
                <div className = "lvqi-col-2">
                    <div className="lvqi-card-title">
                        干线列表&nbsp;&nbsp;
                        <Icon type="plus" style={{ float:'right' }} onClick={ () => {
                            memoryUtils.line = {}
                            this.props.history.push({ pathname: "/line/add" })
                        } }></Icon>
                    </div>
                    <div className="lvqi-card-content" id="table">
                        <Table 
                            style={{ wordBreak: 'break-all' }}
                            bordered = { true }
                            rowKey = "line_id"
                            columns = { this.columns }
                            dataSource = { lines }
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
