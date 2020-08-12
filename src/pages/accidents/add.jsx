import React, { Component } from 'react'
import { Form, Input, Button, Select, Tabs, TreeSelect, Radio, Modal, Icon, message, Tooltip } from 'antd'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import LyfItem from '../../components/item/item'
import LinkButton from '../../components/link-button'
import { TMS, MAP_CENTER } from '../../utils/baoshan'
import memoryUtils from '../../utils/memoryUtils'
import { getNowDateTimeString } from '../../utils/dateUtils'
import { reqInsertAccident } from '../../api'
import { connect } from 'react-redux'

const Item = Form.Item
const Option = Select.Option
const { TreeNode } = TreeSelect
const { TabPane } = Tabs

class AddAccidents extends Component {

    state = {
        accidents_specific_location: [],
        panes: [{
            title: '当事人1', 
            key: '1',
        }],
        activeKey: '1',
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
        accident_location_visible: false,
    }

    initMap = () => {
        const { setFieldsValue }  = this.props.form
        // window.onload = () => {
            if(!this.map){
                this.map = L.map('accident_map', {
                    center: MAP_CENTER,
                    zoom: 14,
                    zoomControl: false,
                    attributionControl: false,
                })
                L.tileLayer(TMS, { maxZoom: 16 }).addTo(this.map)
                this.node_location = L.circle([25.12, 99.175], {radius:20}).addTo(this.map)
                this.map.on("click", (e) => {
                    this.node_location.setLatLng([e.latlng.lat, e.latlng.lng])
                    setFieldsValue({ accident_lng_lat: e.latlng.lng.toFixed(8) + ',' + e.latlng.lat.toFixed(8) })
                })
                this.map._onResize()
            }
        // }
    }

    addObject = () => {
        const { panes } = this.state
        const activeKey = `${panes.length + 1}`
        panes.push({ title: `当事人${panes.length + 1}`, key: panes.length + 1})
        this.setState({ panes, activeKey })
    }

    convertData = (accident) => {
        let accident_info = {}
        const acc_properties = Object.entries(accident)
        let parties = []
        this.state.panes.forEach( party => {
            let party_object = {}
            acc_properties.filter( e => e[0].indexOf("person" + party.key) !== -1 ).forEach(e => party_object[e[0].replace("_person" + party.key, "")] = e[1] )
            parties.push(party_object)
        } )
        acc_properties.filter( e => e[0].indexOf("person") === -1 ).forEach( e => accident_info[e[0]] = e[1] )
        accident_info["parties"] = parties
        accident_info["police_id"] = memoryUtils.user.user_id
        accident_info["accidents_type"] = 1

        return accident_info
    }

    handleSubmit = ( e ) => {
        e.preventDefault();
        this.props.form.validateFields( async (err, values) => {
            if( !err ){
                let accident_info = this.convertData(values)
                const result = await reqInsertAccident(accident_info)
                if(result.code === 1){
                    message.success("事故信息添加成功！")
                    this.props.history.replace("/accidents")
                }else{
                    message.error(result.message)
                }

            }
        } )
    }

    showLocation = () => {
        this.setState({ accident_location_visible: true })
        !this.map||this.map === null ?this.initMap():this.map._onResize()
    }

    componentWillUnmount() {
        this.setState = (state, callback) => {
            return
        }
    }

    render() {

        const user = this.props.user

        const { getFieldDecorator }  = this.props.form

        const { panes, activeKey, illegal_behavior, accident_location_visible } = this.state

        const accident_type_tooltip_imgs = <span>
            <img src={require("../../assets/images/accident_type1.jpg")} alt="事故类型1"/>
            <img src={require("../../assets/images/accident_type2.jpg")} alt="事故类型2"/>
            <img src={require("../../assets/images/accident_type3.jpg")} alt="事故类型3"/>
            <img src={require("../../assets/images/accident_type4.jpg")} alt="事故类型4"/>
            <img src={require("../../assets/images/accident_type5.jpg")} alt="事故类型5"/>
        </span>

        const formLayout = {
            labelCol : { span: 6 } ,
            wrapperCol : { span: 12 },
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
                    <span>事故分析</span>
                </div>
                <div className="lyf-card-content">
                    <Form 
                        { ...formLayout }
                        onSubmit = { this.handleSubmit }
                        style = {{ width: '100%', height: '100%' }}
                    >
                        <div className="full" style={{ height: '90%', display: "flex", flexWrap: 'nowrap' }}>
                            <div className="lyf-col-5">
                            <div className="lyf-row-5">
                                <Item label="负责民警">
                                    {
                                        getFieldDecorator("police_name", {
                                            initialValue: user.username,
                                            rules: []
                                        })(<Input disabled />)
                                    }
                                </Item>
                                <Item label="事故时间">
                                    {
                                        getFieldDecorator("accident_time", {
                                            initialValue: getNowDateTimeString(),
                                            rules: []
                                        })(
                                            <Input />
                                        )
                                    }
                                </Item>
                                <Item label="事故地点">
                                    {
                                        getFieldDecorator("accident_location", {
                                            initialValue: '',
                                            rules: [
                                            ]
                                        })(<Input placeholder="请输入事故地点" />)
                                    }
                                </Item>
                                <Item label="事故经纬度">
                                    {
                                        getFieldDecorator("accident_lng_lat", {
                                            initialValue: '',
                                            rules: [
                                            ]
                                        })(
                                            <Input.Search onSearch = { this.showLocation } enterButton="定位" placeholder="请选择经纬度!" />
                                        )
                                    }
                                    <Modal
                                        title="选择经纬度"
                                        okText = { "确定" }
                                        cancelText = { "取消" }
                                        centered = { true }
                                        forceRender = { true }
                                        visible={ accident_location_visible }
                                        onOk={ () => this.setState({ accident_location_visible: false }) }
                                        onCancel={ () => this.setState({ accident_location_visible: false }) }
                                    >
                                        <div id="accident_map" style = {{width: '100%', height: 300}}></div>
                                    </Modal>
                                </Item>
                                <Item label="事故具体位置">
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
                            <div className="lyf-row-5">
                                <Item label="天气">
                                    {
                                        getFieldDecorator("climate", {
                                            initialValue: '1',
                                            rules: [
                                            ]
                                        })(
                                            <Select>
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
                                <Item label="道路条件">
                                    {
                                        getFieldDecorator("road_condition", {
                                            initialValue: '1',
                                            rules: [
                                            ]
                                        })(
                                            <Select>
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
                                <Item label="事故形态">
                                    {
                                        getFieldDecorator("accident_pattern", {
                                            initialValue: '1',
                                            rules: [
                                            ]
                                        })(
                                            <Select>
                                                <Option key="1" value="1">碰撞运动车辆</Option>
                                                <Option key="2" value="2">碰撞静止车辆</Option>
                                                <Option key="3" value="3">其他车辆事故</Option>
                                                <Option key="4" value="4">刮撞行人</Option>
                                            </Select>
                                        )
                                    }
                                </Item>
                                <Item label="事故类型">
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
                                                placeholder="Please select"
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
                                    <Tooltip color="red" title={ accident_type_tooltip_imgs }>
                                        &nbsp;&nbsp;<Button>事故类型图示</Button>&nbsp;&nbsp;
                                    </Tooltip>
                                </Item>

                                <Item label="照明条件">
                                    {
                                        getFieldDecorator("light_condition", {
                                            initialValue: '1',
                                            rules: [
                                            ]
                                        })(
                                            <Select>
                                                <Option value="1">灯光无影响</Option>
                                                <Option value="2">灯光干扰</Option>
                                                <Option value="3">灯光过暗</Option>
                                            </Select>
                                        )
                                    }
                                </Item>
                                <Item label="标志标线">
                                    {
                                        getFieldDecorator("sign_marking_condition", {
                                            initialValue: '1',
                                            rules: [
                                            ]
                                        })(
                                            <Select>
                                                <Option value="1">标志标线完整清晰</Option>
                                                <Option value="2">标志标线不一致</Option>
                                                <Option value="3">标线残缺模糊</Option>
                                                <Option value="4">标线提醒缺失</Option>
                                            </Select>
                                        )
                                    }
                                </Item>
                            </div>
                            </div>
                            <div className="lyf-col-5">
                                <Button onClick={ this.addObject }>添加当事人</Button>
                                <Tabs 
                                    activeKey={activeKey}
                                    onChange={ activeKey => this.setState({ activeKey }) }
                                >
                                {
                                    panes.map( e => (
                                        <TabPane tab={e.title} key={e.key}>
                                            <LyfItem label="是否在场">
                                                {
                                                    getFieldDecorator("is_presence_person" + e.key, {
                                                        initialValue: '1',
                                                        rules: [
                                                        ]
                                                    })(
                                                        <Radio.Group>
                                                            <Radio value="1">在场</Radio>
                                                            <Radio value="2">不在场</Radio>
                                                        </Radio.Group>
                                                    )
                                                }
                                            </LyfItem>
                                            <LyfItem label="身份证号">
                                                {
                                                    getFieldDecorator("id_card_person" + e.key, {
                                                        initialValue: '',
                                                        rules: [
                                                        ]
                                                    })(
                                                        <Input/>
                                                    )
                                                }
                                            </LyfItem>
                                            <LyfItem label="出行方式">
                                                {
                                                    getFieldDecorator("trip_mode_person" + e.key, {
                                                        initialValue: '1',
                                                        rules: [
                                                        ]
                                                    })(
                                                        <Select>
                                                            <Option value = "1">小轿车</Option>
                                                            <Option value = "2">摩托车</Option>
                                                            <Option value = "3">电瓶车</Option>
                                                            <Option value = "4">自行车</Option>
                                                            <Option value = "5">行人</Option>
                                                            <Option value = "6">大客车</Option>
                                                            <Option value = "7">大货车</Option>
                                                            <Option value = "8">半挂车</Option>
                                                        </Select>
                                                    )
                                                }
                                            </LyfItem>
                                            <LyfItem label="车牌号码">
                                                {
                                                    getFieldDecorator("plate_number_person" + e.key, {
                                                        initialValue: '',
                                                        rules: []
                                                    })(
                                                        <Input />
                                                    )
                                                }
                                            </LyfItem>
                                            <LyfItem label="姓名">
                                                {
                                                    getFieldDecorator("party_name_person" + e.key, {
                                                        initialValue: '',
                                                        rules: []
                                                    })(
                                                        <Input />
                                                    )
                                                }
                                            </LyfItem>
                                            <LyfItem label="车牌是否故障">
                                                {
                                                    getFieldDecorator("is_breakdown_person" + e.key, {
                                                        initialValue: '1',
                                                        rules: [
                                                        ]
                                                    })(
                                                        <Radio.Group>
                                                            <Radio value="1">无故障</Radio>
                                                            <Radio value="2">故障</Radio>
                                                        </Radio.Group>
                                                    )
                                                }
                                            </LyfItem>
                                            <LyfItem label="是否违法">
                                                {
                                                    getFieldDecorator("illegal_behavior_person" + e.key, {
                                                        initialValue: '1',
                                                        rules: [
                                                        ]
                                                    })(
                                                        <TreeSelect 
                                                            treeData = {illegal_behavior}
                                                            treeCheckable = {true}
                                                        />
                                                    )
                                                }
                                            </LyfItem>
                                           <div style={{ display: 'flex' }}>
                                           <div className="lyf-col-5">
                                            <LyfItem label="车损情况">
                                                {
                                                    getFieldDecorator("car_damage_person" + e.key, {
                                                        initialValue: '1',
                                                        rules: []
                                                    })(
                                                        <Select>
                                                            <Option value="1">无车损</Option>
                                                            <Option value="2">轻微车损</Option>
                                                            <Option value="3">严重车损</Option>
                                                        </Select>
                                                    )
                                                }
                                            </LyfItem>
                                            <LyfItem label="轻伤人数">
                                                {
                                                    getFieldDecorator("minor_injure_person" + e.key, {
                                                        initialValue: 0,
                                                        rules: []
                                                    })(
                                                        <Input />
                                                    )
                                                }
                                            </LyfItem>
                                            </div>
                                            <div className="lyf-col-5">
                                            <LyfItem label="重伤人数">
                                                {
                                                    getFieldDecorator("serious_injure_person" + e.key, {
                                                        initialValue: 0,
                                                        rules: []
                                                    })(
                                                        <Input />
                                                    )
                                                }
                                            </LyfItem>
                                            <LyfItem label="死亡人数">
                                                {
                                                    getFieldDecorator("death_person" + e.key, {
                                                        initialValue: 0,
                                                        rules: []
                                                    })(
                                                        <Input />
                                                    )
                                                }
                                            </LyfItem>
                                            </div>
                                           </div>
                                        </TabPane>
                                    ) )
                                }
                                </Tabs>
                            </div>
                        </div>
                        <div className="full lyf-center"  style={{ height: '10%' }}>
                            <Item {...tailLayout}>
                                <Button htmlType="submit" type="primary">提交</Button>
                            </Item>
                        </div>

                    </Form>
                </div>
            </div>
        )
    }
}

// export default Form.create()( AddAccidents )

const AccidentsForm = Form.create()( AddAccidents )

export default connect(
    state => ({ user: state.user }),
    {}
)(AccidentsForm)
