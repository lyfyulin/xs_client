import React, { Component } from 'react'
import { Redirect, Switch, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import { Icon, Dropdown, Menu, notification } from 'antd'

import Home from './home'
import Link from './link'
import Inter from './inter'
import './platform.less'
import Device from './device'
import Nonlocal from './nonlocal'
import './platform.less'
import Tongqin from './tongqin'
import { reqWarning } from '../../api'

class Platform extends Component {

    state = {
        menu: [
            { path: "/platform", name: "首页" },
            { path: "/platform/inter", name: "路口" },
            { path: "/platform/link", name: "路段" },
            { path: "/platform/nonlocal", name: "外地车" },
            { path: "/platform/tongqin", name: "通勤车" },
            { path: "/platform/device", name: "设备" },
        ]
    }

    // 警告函数
    openNotification = (type, message, description, goTo) => {
        notification[type]({
            message: message,
            description: description,
            placement: 'topRight',
            duration: 3,
            rtl: true,
            onClick: () => {
                this.props.history.replace(goTo)
            },
        })
    }

    // 加载警告信息
    load_warning = async() => {
        const result = await reqWarning()
        const warning = []

        const {data_transfer, dev_school_time, not_miss_rate, link_state, rdnet_speed} = result

        data_transfer.code === 1?warning.push(["数据传输！", "请检查数据传输模块！", "/platform/device"]):console.log("")        
        dev_school_time.code === 1?warning.push(["设备校时", "请查看校时问题设备: " + dev_school_time.data.slice(0, 2).map( e => e.dev_name ).join(",") + " 等。", "/platform/device"]):console.log("")
        link_state.code === 1?warning.push(["路段状态", "请查看状态较差路段: " + link_state.data.slice(0, 2).map( e => e.link_name ).join(",") + " 等。", "/platform/link"]):console.log("")
        not_miss_rate.code === 1?warning.push(["设备传输", "请查看无数据回传设备: " + not_miss_rate.data.slice(0, 2).map( e => e.dev_name ).join(",") + " 等。", "/platform/device"]):console.log("")
        rdnet_speed.code === 1?warning.push(["路网速度", "路网运行速度较低，为 " + rdnet_speed.data.toFixed(0, 2) + " km/h。", "/platform/link"]):console.log("")
        
        warning.map( (e,i) => {
            setTimeout( () => {
                this.openNotification('warning', e[0], e[1], e[2])
            }, i * 2000 + 2000)
        })
        
    }

    componentDidMount() {
        this.load_warning()
        this.timer = setInterval( this.load_warning, 300000 )
    }

    componentWillUnmount() {
        clearInterval( this.timer )
        this.setState = (state, callback) => {
            return
        }
    }
    
    render() {
        const user = this.props.user
        if(!user.user_id){
            return <Redirect to="/login"/>
        }else{
            const menu = (
                <Menu onClick={ (e) => { this.props.history.replace(e.key) } }>
                {
                    this.state.menu.map( e => (
                        <Menu.Item key={e.path}>{e.name}</Menu.Item>
                    ))
                }
                </Menu>
            )
            return (
                <div className="platform">
                    <div className="header">
                        保山中心城区交通数据研判分析平台&nbsp;&nbsp;
                        <Dropdown overlay={menu}>
                            <a className="ant-dropdown-link" onClick={ e => e.preventDefault()}><Icon type="menu"/></a>
                        </Dropdown>
                    </div>
                    <div className="content lyf-center">
                        <Switch>
                            <Route exact path="/platform" component={ Home }></Route>
                            <Route path="/platform/link" component={ Link }></Route>
                            <Route path="/platform/inter" component={ Inter }></Route>
                            <Route path="/platform/device" component={ Device }></Route>
                            <Route path="/platform/nonlocal" component={ Nonlocal }></Route>
                            <Route path="/platform/tongqin" component={ Tongqin }></Route>
                        </Switch>
                    </div>
                    <div className="footer">Copyright ©2020年 保山交警支队. 版权所有</div>
                </div>
            )
        }
    }
}

export default  connect(
    state => ({ user: state.user }),
    { }
)(Platform)
