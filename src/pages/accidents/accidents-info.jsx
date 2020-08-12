import React, { Component } from 'react'
import LyfItem from '../../components/item/item'
import { Button, TimePicker, Form, TreeSelect, Table, message, Select, Checkbox, Popconfirm } from 'antd'
import moment from 'moment'
import 'moment/locale/zh-cn'
import L from 'leaflet'
import heatlayer from '../../utils/leaflet/heatlayer'
import LinkButton from '../../components/link-button'
import { MAP_CENTER, TMS } from '../../utils/baoshan'
import { reqAccidents, reqDeleteAccident, reqAccidentsSearch } from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import _ from 'lodash'
import { getTodayDateTimeString, getNowDateTimeString, getTimeString, getDateTimeString } from '../../utils/dateUtils'

const Item = Form.Item
const Option = Select.Option
const TreeNode = TreeSelect.TreeNode

class AccidentsInfo extends Component {

    state = {
        accidents: [],
        loading: false,
        tableBodyHeight: 480,
        illegal_behavior: [{
            title: '无违法行为',
            value: '1',
            key: '1',
        },{
            title: '闯红灯',
            value: '2',
            key: '2',
        },{
            title: '机动车',
            value: '机动车',
            key: '机动车',
            disabled: true,
            children: [{
                title: '酒驾醉驾',
                value: '3',
                key: '3',
            },{
                title: '无证驾驶',
                value: '4',
                key: '4',
            },{
                title: '超速行驶',
                value: '5',
                key: '5',
            },{
                title: '违停',
                value: '6',
                key: '6',
            },{
                title: '占用非机动车道',
                value: '7',
                key: '7',
            },{
                title: '占用对向车道',
                value: '8',
                key: '8',
            },{
                title: '占用人行道',
                value: '9',
                key: '9',
            }],
        },
        {
            title: '非机动车',
            value: '非机动车',
            key: '非机动车',
            disabled: true,
            children: [{
                title: '占用机动车道',
                value: '10',
                key: '10',
            },{
                title: '逆行',
                value: '11',
                key: '11',
            }],
        },
        {
            title: '行人',
            value: '行人',
            key: '行人',
            disabled: true,
            children: [{
                title: '随意横穿马路',
                value: '12',
                key: '12',
            }],
        }],
    }

    // 初始化地图
    initMap = () => {
        this.map = L.map('map', {
            center: MAP_CENTER,
            zoom: 14,
            zoomControl: false,
            attributionControl: false,
        })
        this.heat = heatlayer([[0.1, 0.1, 1]])
        L.tileLayer(TMS, { maxZoom: 16 }).addTo(this.map)
        this.map._onResize()
    }

    // 设置表格列
    initColumns = () => {
        this.columns = [{
            title: '序号',
            dataIndex: 'accident_id',
            width: 100,
        },{
            title: '时间',
            dataIndex: 'accident_time',
            width: 200,
        },{
            title: '查看详情',
            width: 200,
            render: accident => (
                <LinkButton onClick = {() => {
                    memoryUtils.accident = accident
                    this.props.history.push( "/accidents/detail/" + accident.accident_id )
                }}>查看详情</LinkButton>
            )
        },{
            title: '删除',
            width: 100,
            render: accident => <Popconfirm 
                title="是否删除?" 
                onConfirm={async() => {
                    const result = await reqDeleteAccident(accident.accident_id)
                    result.code === 1?message.success("删除事故信息成功！"):message.error(result.message)
                    this.loadAccidents()
                } }
            >
                <a href="#">删除</a>
            </Popconfirm>
        }]
    }

    // 加载事故数据
    loadAccidents = async () => {
        this.setState({ loading: true })
        const result = await reqAccidents()
        if(result.code === 1){
            this.setHeat(result.data)
            this.setState({ accidents: result.data, loading: false })
        }else{
            message.error(result.message)
            this.setState({ loading: false })
        }
    }

    // 设置事故热力图
    setHeat = (accidents) => {
        accidents.forEach( accident => {
            let lng_lat = accident.accident_lng_lat
            this.heat.addLatLng([parseFloat(lng_lat.split(',')[1]), parseFloat(lng_lat.split(',')[0])])
        })
        this.heat.addTo(this.map)

        // let heat2 = heatlayer([[25.13, 99.175, 1]]).addTo(this.map);
        // this.map.on("mousemove",  _.throttle( e => heat2.addLatLng([e.latlng.lat, e.latlng.lng]), 100 ))
    }

    // 查询提交
    handleSubmit = ( e ) => {
        e.preventDefault();
        this.props.form.validateFields( async (err, values) => {
            if( !err ){

                let start_time = getDateTimeString(values['start_time'])
                let end_time = getDateTimeString(values['end_time'])
                let accident_type = values['accident_type']
                let road_condition = values['road_condition']
                let climate = values['climate']
                let accident_specific_location = values['accident_specific_location']

                let car_damage = values['car_damage']?2:1
                let people_hurt = values['people_hurt']?1:0
                let illegal_behavior = values['illegal_behavior']
                const result = await reqAccidentsSearch(start_time, end_time, accident_type, road_condition, climate, accident_specific_location, car_damage, people_hurt,illegal_behavior)
            
                result.code === 1?this.setState({ accidents: result.data }):message.error(result.message)

            }
        } )
    }

    onWindowResize = _.throttle(() => {
        this.setState({ tableBodyHeight: window.innerHeight - 200  })
    }, 800)

    componentWillMount() {
        this.initColumns()
    }
    
    componentDidMount() {
        this.initMap()
        this.loadAccidents()
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

        const { accidents, loading, illegal_behavior, tableBodyHeight } = this.state

        const { getFieldDecorator } = this.props.form

        const formLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 17 },
        }

        return (
            <div className="full">
                <Form
                    style={{ height: 120, width:'100%' }}
                    { ...formLayout }
                    onSubmit = { this.handleSubmit }
                >
                    <div className="lyf-center" style={{ width: '100%', height: 60, borderBottom: '1px solid #1DA57A', borderTop: '1px solid #1DA57A' }}>
                        <div className="lyf-col-2 lyf-center">
                            <Item label="起始时间" name="start_time">
                                {
                                    getFieldDecorator("start_time", {
                                        initialValue: moment(getTodayDateTimeString()),
                                    })(
                                        <TimePicker 
                                            style={{ width:'100%' }} 
                                            placeholder="请选择时间" 
                                            size="small"
                                            format = "YYYY-MM-DD HH:mm:ss"
                                        />
                                    )
                                }
                            </Item>
                        </div>
                        <div className="lyf-col-2 lyf-center">
                            <Item label="结束时间" name="end_time">
                                {
                                    getFieldDecorator("end_time", {
                                        initialValue: moment(getNowDateTimeString()),
                                    })(
                                        <TimePicker 
                                            size="small"
                                            style={{ width:'100%' }} 
                                            placeholder="请选择时间" 
                                            size="small"
                                            format = "YYYY-MM-DD HH:mm:ss"
                                        />
                                    )
                                }
                            </Item>
                        </div>
                        <div className="lyf-col-2 lyf-center">
                            <Item label="事故类型" name="accidents_type">
                                {
                                    getFieldDecorator("accident_type", {
                                        initialValue: '1',
                                        rules: [
                                        ]
                                    })(
                                        <TreeSelect
                                            showSearch
                                            style={{ width: '100%' }}
                                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                            size="small"
                                            allowClear
                                            treeDefaultExpandAll
                                        >
                                            <TreeNode value="追尾" title="追尾" disabled>
                                                <TreeNode value="1" title="机动车追尾机动车" />
                                                <TreeNode value="2" title="机动车追尾停驶车辆" />
                                            </TreeNode>
                                            <TreeNode value="刮擦" title="刮擦" disabled>
                                                <TreeNode value="3" title="机动车同向刮擦" />
                                                <TreeNode value="4" title="机动车对向刮擦" />
                                            </TreeNode>
                                            <TreeNode value="碰撞" title="碰撞" disabled>
                                                <TreeNode value="5" title="机动车违反车道行驶发生碰撞" />
                                                <TreeNode value="6" title="机动车正面碰撞" />
                                                <TreeNode value="7" title="机动车直角碰撞" />
                                                <TreeNode value="8" title="机动车撞非机动车" />
                                                <TreeNode value="9" title="机动车撞行人" />
                                                <TreeNode value="10" title="机动车撞固定物" />
                                            </TreeNode>
                                            <TreeNode value="其它" title="其它" disabled>
                                                <TreeNode value="11" title="机动车侧翻" />
                                                <TreeNode value="12" title="多车事故" />
                                                <TreeNode value="13" title="非机动车撞固定物" />
                                                <TreeNode value="14" title="非机动车撞非机动车" />
                                                <TreeNode value="15" title="非机动车撞行人" />
                                                <TreeNode value="16" title="非机动车撞停驶车辆" />
                                                <TreeNode value="17" title="非机动车单车事故" />
                                            </TreeNode>
                                        </TreeSelect>
                                    )
                                }
                            </Item>
                        </div>
                        <div className="lyf-col-2 lyf-center">
                            <Item label="道路条件" name="road_condition">
                                {
                                    getFieldDecorator("road_condition", {
                                        initialValue: '1',
                                        rules: []
                                    })(
                                        <Select
                                            size="small"
                                        >
                                            <Option value="1">普通道路</Option>
                                            <Option value="2">桥梁</Option>
                                            <Option value="3">隧道</Option>
                                            <Option value="4">匝道</Option>
                                            <Option value="5">长下坡</Option>
                                            <Option value="6">陡坡</Option>
                                            <Option value="7">急转弯</Option>
                                            <Option value="8">施工路段</Option>
                                            <Option value="9">结冰路面</Option>
                                            <Option value="10">湿滑路面</Option>
                                            <Option value="11">其他</Option>
                                        </Select>
                                    )
                                }
                            </Item>
                        </div>
                        <div className="lyf-col-2 lyf-center">
                            <Item label="天气" name="climate">
                                {
                                    getFieldDecorator("climate", {
                                        initialValue: '1',
                                        rules: [
                                        ]
                                    })(
                                        <Select
                                            size="small"
                                        >
                                            <Option value="1">晴天</Option>
                                            <Option value="2">阴天</Option>
                                            <Option value="3">雨天</Option>
                                            <Option value="4">雪天</Option>
                                            <Option value="5">大风</Option>
                                            <Option value="6">沙尘</Option>
                                            <Option value="7">冰雹</Option>
                                            <Option value="8">其他</Option>
                                        </Select>    
                                    )
                                }
                            </Item>
                        </div>
                    </div>
                    <div className="lyf-center" style={{ width: '100%', height: 60, borderBottom: '1px solid #1DA57A', borderTop: '1px solid #1DA57A' }}>
                        <div className="lyf-col-1 lyf-center" style={{ textAlign:"center" }}>
                            {
                                getFieldDecorator("people_hurt", {
                                    initialValue: false,
                                })(
                                    <Checkbox style={{ width: '100%' }}>人伤</Checkbox>
                                )
                            }
                        </div>
                        <div className="lyf-col-1 lyf-center" style={{ textAlign:"center" }}>
                            {
                                getFieldDecorator("car_damage", {
                                    initialValue: false,
                                })(
                                    <Checkbox style={{ width: '100%' }}>车损</Checkbox>
                                )
                            }
                        </div>
                        <div className="lyf-col-2 lyf-center">
                            <Item label="具体位置">
                                {
                                    getFieldDecorator("accident_specific_location", {
                                        initialValue: '1',
                                        rules: [
                                        ]
                                    })(
                                        <TreeSelect
                                            showSearch
                                            style={{ width: '100%' }}
                                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                            placeholder="请选择"
                                            size="small"
                                            allowClear
                                            treeDefaultExpandAll
                                        >
                                            <TreeNode value="路口" title="路口" disabled>
                                                <TreeNode value="1" title="路口中央" />
                                                <TreeNode value="2" title="路口进口处" />
                                                <TreeNode value="3" title="路口出口处" />
                                                <TreeNode value="4" title="右转弯处" />
                                            </TreeNode>
                                            <TreeNode value="路段" title="路段" disabled>
                                                <TreeNode value="5" title="机动车道处" />
                                                <TreeNode value="6" title="非机动车道处" />
                                                <TreeNode value="7" title="人行道处" />
                                                <TreeNode value="8" title="单位小区或小支路开口处" />
                                                <TreeNode value="9" title="道路渐变段（100米内车道增加或较少）" />
                                                <TreeNode value="10" title="中央分隔带" />
                                                <TreeNode value="11" title="机非隔离带" />
                                            </TreeNode>
                                            <TreeNode value="其它位置" title="其它位置" disabled>
                                                <TreeNode value="12" title="单位小区内部道路" />
                                                <TreeNode value="13" title="停车场内部" />
                                                <TreeNode value="14" title="村道乡道" />
                                                <TreeNode value="15" title="其他位置" />
                                            </TreeNode>
                                        </TreeSelect>
                                    )
                                }
                            </Item>
                        </div>
                        <div className="lyf-col-3 lyf-center">
                            <Item label="违法行为" name="illegal_behavior">
                                {
                                    getFieldDecorator("illegal_behavior", {
                                        initialValue: '1',
                                        rules: []
                                    })(
                                        <TreeSelect 
                                            treeData = { illegal_behavior }
                                            treeCheckable = {true}
                                        />
                                    )
                                }
                            </Item>
                        </div>
                        <div className="lyf-col-1 lyf-center" style={{ textAlign:"center" }}>
                            <Button size="small" htmlType="submit" >查询事故</Button>
                        </div>
                        <div className="lyf-col-1 lyf-center" style={{ textAlign:"center" }}>
                            <Button size="small" onClick={ () => this.props.history.push("/accidents/add") }>添加事故</Button>
                        </div>
                        <div className="lyf-col-1 lyf-center" style={{ textAlign:"center" }}>
                            <Button size="small" onClick={ () => this.props.history.push("/accidents/eliminate") }>隐患点整治</Button>
                        </div>
                    </div>
                </Form>
                <div style={{ height: "calc(100% - 122px)", display: 'flex' }}>
                    <div style={{ width: "60%", height: '100%', minWidth: 400, minHeight: 400 }} id="map">
                    </div>
                    <div style={{ width: "40%", height: '100%' }}>
                        <Table
                            bordered = { true }
                            rowKey = "accident_id"
                            columns = { this.columns }
                            dataSource = { accidents }
                            loading = { loading }
                            scroll={{ y: tableBodyHeight }}
                        >
                        </Table>
                    </div>
                                
                </div>
                
            </div>
        )
    }
}

export default Form.create()(AccidentsInfo)
