import React, { Component } from 'react'
import { Input, DatePicker, Form, TimePicker, Cascader, message, Button, Select, Table, Icon, Tooltip, Tabs } from 'antd'
import { reqNodes, reqLinks, reqDevices, reqExportCsv, reqVnSearch, reqLines, reqAreas, reqSearchData } from '../../api'
import { SEARCH_TYPE, SEARCH_TIPS, ROAD_NAME, PROVINCE, SEARCH_TYPE_TITLE } from '../../utils/baoshan'

import { getNowDateTimeString, getDateString, getTimeString } from '../../utils/dateUtils'
import OptionalChart from './optional_chart'
import _ from 'lodash'
import moment from 'moment'
import 'moment/locale/zh-cn'
import './search.less'

const Item = Form.Item
const Option = Select.Option

class SearchData extends Component {

    state = {
        node_list: [],
        link_list: [],
        line_list: [],
        area_list: [],
        road_list: ROAD_NAME,
        device_list: [],
        changeItem: [],
        search_data: [],
        search_type: "",
        chart_option: {},
    }

    // 定义搜索列表
    initSearchType = () => {
        this.options = SEARCH_TYPE_TITLE
    }

    // 加载基础数据
    load_data = async () => {
        let result = await reqNodes()
        result.code === 1? this.setState({ node_list: result.data }):message.error(result.message)
        result = await reqLinks()
        result.code === 1? this.setState({ link_list: result.data }):message.error(result.message)
        result = await reqDevices()
        result.code === 1? this.setState({ device_list: result.data }):message.error(result.message)
        result = await reqLines()
        result.code === 1? this.setState({ line_list: result.data }):message.error(result.message)
        result = await reqAreas()
        result.code === 1? this.setState({ area_list: result.data }):message.error(result.message)
    }

    onSearchTypeChange = (value, selectedOptions) => {
        const search_type = value.join("/")
        const changeItem = SEARCH_TYPE[search_type]
        this.setState({ changeItem, search_type })
    }
    
    filter = (inputValue, path) => {
        return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
    }

    // 下拉框数据过滤
    handleFilter = (inputValue, option) => {
        if(!/[a-zA-Z]/.test(inputValue)){
            return option.props.children.indexOf(inputValue) === -1?false:true
        }
    }

    handleSearch = (e) => {
        e.preventDefault()
        this.props.form.validateFields( async (error, values) => {
            if( !error ){
                let { search_type, start_date, end_date, start_time, end_time } = values
                if( search_type.length < 1 ){
                    message.error("请选择下载数据类型！")
                }else{
                    // 数据封装
                    search_type = search_type.join("/")
                    start_date = getDateString(values['start_date'])
                    end_date = getDateString(values['end_date'])
                    start_time = getTimeString(values['start_time'])
                    end_time = getTimeString(values['end_time'])
                    const search_keys = { ...values, search_type, start_date, end_date, start_time, end_time }
                    
                    // 数据请求
                    const result = await reqSearchData(search_keys)

                    // 数据包装
                    if(result.code === 1){
                        const search_data = result.data.map( (e, key) => ({key: key + 1, ...e}) )
                        let keys = Object.keys(search_data[0])
                        this.columns = keys.map( e => ({ title: e, dataIndex: e, width: 100 }))
                        this.setState({ search_data })
                    }else{
                        message.error(result.message)
                    }
                }
            }else{
                message.error("数据输入不完整！")
            }
        } )
    }

    downloadCsv = () => {
        
        const { search_data, search_type } = this.state
        let keys = Object.keys(search_data[0])
        let data = [keys.join(",")]
        search_data.forEach( e => {
            let tmp = Object.values(e)
            data.push(tmp.join(","))
        })
        const blob = new Blob(['\uFEFF' + data.join("\n")], {type: "text/plain"})
        const link = document.createElement("a")
        link.href = URL.createObjectURL(blob)
        link.download = search_type + "_" + getNowDateTimeString() + ".csv"
        link.click()
        URL.revokeObjectURL(link.href)
    }

    // 下载
    handleDownload = async () => {

        if(this.state.search_data.length < 1){
            message.error("请先查询数据！")
        }else{
            this.downloadCsv()
        }
    }

    onWindowResize = _.throttle(() => {
        this.setState({ tableBodyHeight: window.innerHeight -206  })
    }, 800)

    componentWillMount() {
        this.initSearchType()
        this.load_data()
        this.columns = null
    }
    
    componentDidMount() {
        window.addEventListener('resize', this.onWindowResize)
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowResize)
        this.setState = (state, callback) => {
            return
        }
    }

    render() {
        
        const { changeItem, node_list, link_list, road_list, device_list, line_list, area_list, search_data, search_type } = this.state

        const { getFieldDecorator } = this.props.form

        const formLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 17 },
        }
    
        return (
            <div className="full">
                <Form
                    style={{ height: 80 }}
                    { ...formLayout }
                    onSubmit = { this.handleSearch }
                >
                    <div className="lyf-center" style={{ height: 40 }}>
                        <div className="lyf-col-3 lyf-center">
                            <Item label="数据类型">
                                {
                                    getFieldDecorator("search_type", {
                                        initialValue: [],
                                        rules: []
                                    })(
                                        <Cascader
                                            size="small"
                                            options = { this.options }
                                            onChange = { this.onSearchTypeChange }
                                            placeholder = "选择检索数据"
                                            showSearch = {this.filter}
                                        />
                                    )
                                }
                            </Item>
                            
                        </div>
                        <Tooltip title={SEARCH_TIPS[search_type] || "数据下载"}>
                            &nbsp;&nbsp;<Icon type="info"/>&nbsp;&nbsp;
                        </Tooltip>
                        <div className="lyf-col-2 lyf-center">
                            {
                                changeItem.length > 0?changeItem.map( item =>
                                    <Item key={ item.name } label={ item.title } name={ item.name }>
                                        {
                                            getFieldDecorator(item.name, {
                                                initialValue: "",
                                            })(
                                                <Select
                                                    showSearch
                                                    filterOption={ this.handleFilter } 
                                                >
                                                    {
                                                        item.name === "node_id"? node_list.map( e => <Option key={e.node_id} value={e.node_id}>{ e.node_name }</Option>):
                                                        item.name === "dev_id"? device_list.map( e => <Option key={e.dev_id} value={e.dev_id}>{ e.dev_name }</Option>):
                                                        item.name === "link_id"? link_list.map( e => <Option key={e.link_id} value={e.link_id}>{ e.link_name }</Option>):
                                                        item.name === "road_name"? road_list.map( (e,i) => <Option key={ i } value={ e }>{ e }</Option>):
                                                        item.name === "line_id"? line_list.map( e => <Option key={e.line_id} value={e.line_id}>{ e.line_name }</Option>):
                                                        item.name === "province"? PROVINCE.map( (e,i) => <Option key={ i } value={ e }>{ e }</Option>):
                                                        item.name === "area_id"? area_list.map( e => <Option key={e.area_id} value={e.area_id}>{ e.area_name }</Option>):(<></>)
                                                    }
                                                </Select>
                                            )
                                        }
                                    </Item>
                                ):(<></>)
                            }
                        </div>
                    </div>
                    <div className="lyf-center" style={{ height: 40, borderBottom: '1px solid #1DA57A', borderTop: '1px solid #1DA57A' }}>
                        <div className="lyf-col-2 lyf-center">
                            <Item label="起始日期">
                                {
                                    getFieldDecorator("start_date", {
                                        initialValue: moment(),
                                    })(
                                        <DatePicker 
                                            placeholder="请选择日期" 
                                            size="small"
                                            format = "YYYY-MM-DD"
                                        />
                                    )
                                }
                            </Item>
                        </div>
                        <div className="lyf-col-2 lyf-center">
                            <Item label="结束日期" name="end_date">
                                {
                                    getFieldDecorator("end_date", {
                                        initialValue: moment(),
                                    })(
                                        <DatePicker 
                                            placeholder="请选择日期" 
                                            size="small"
                                            format = "YYYY-MM-DD"
                                        />
                                    )
                                }
                            </Item>
                        </div>
                        <div className="lyf-col-2 lyf-center">
                            <Item label="起始时间" name="start_time">
                                {
                                    getFieldDecorator("start_time", {
                                        initialValue: moment("2020-01-01 00:00:00"),
                                    })(
                                        <TimePicker 
                                            size="small"
                                            placeholder="请选择时间" 
                                            size="small"
                                            format = "HH:mm:00"
                                        />
                                    )
                                }
                            </Item>
                        </div>
                        <div className="lyf-col-2 lyf-center">
                            <Item label="结束时间" name="end_time">
                                {
                                    getFieldDecorator("end_time", {
                                        initialValue: moment("2020-01-01 23:59:59"),
                                    })(
                                        <TimePicker 
                                            size="small"
                                            placeholder="请选择时间" 
                                            size="small"
                                            format = "HH:mm:00"
                                        />
                                    )
                                }
                            </Item>
                        </div>
                        <div className="lyf-col-1 lyf-center">
                            <Item>
                                <Button htmlType="submit">查询</Button>
                            </Item>
                        </div>
                        <div className="lyf-col-1 lyf-center">
                            <Item>
                                <Button onClick={ this.handleDownload }>下载</Button>
                            </Item>
                        </div>
                    </div>
                </Form>
                <div style={{ backgroundColor:'#fff', height: 'calc(100% - 82px)' }}>
                    <Tabs defaultActiveKey="1" className="full">
                        <Tabs.TabPane tab="列表" key="1" style={{ height: window.innerHeight - 216 }}>
                            <Table
                                style={{ wordBreak: 'break-all' }}
                                rowKey = "key"
                                columns = { this.columns }
                                dataSource = { search_data }
                                pagination = { false }
                                scroll={{ y: window.innerHeight - 280 }}
                            />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="图表" key="2">
                            <OptionalChart data = { search_data } search_type={ search_type }/>
                        </Tabs.TabPane>
                    </Tabs>
                </div>
            </div>
        )
    }
}


export default Form.create()(SearchData)
