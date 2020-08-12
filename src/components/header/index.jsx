import React, { Component } from 'react'

import { Modal, Carousel, Icon, Button } from 'antd'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { logout } from '../../redux/actions'
import { reqWeather } from '../../api'


import { getDateTimeString } from '../../utils/dateUtils'
import LinkButton from '../link-button'
import './index.less'

class Header extends Component {

    state = {
        currentTime: Date.now(),
        dayPictureUrl: '', 
        weather: '',
    }

    logout = ( e ) => {
        // 提示是否删除，删除内存中 user 信息，跳转到 /login 
        Modal.confirm({
            title: "是否退出?",
            onOk: () => {
                // 注销后自动跳转到 /login 
                this.props.logout()
            },
            onCancel: () => {
                console.log("退出登录取消了！")
            },
            okText: "确认",
            cancelText: "取消",
        })
    }

    // 获取页头
    getTitle = () => {
        return this.props.headerTitle
    }

    // 获取天气
    getWeather = async () => {
        const { dayPictureUrl, weather } = await reqWeather("杭州")
        this.setState({
            dayPictureUrl, weather
        })
    }

    componentDidMount() {
        // 启动定时器
        this.intervalId = setInterval(() => {
            this.setState({
                currentTime: Date.now()
            })
        }, 1000)
        // this.getWeather()
    }

    componentWillUnmount = () => {
      clearInterval( this.intervalId )
    };
    

    render() {
        // const user = memoryUtils.user
        const user = this.props.user
        const title = this.getTitle()
        const time = getDateTimeString(this.state.currentTime)
        const { dayPictureUrl, weather } = this.state

        return (
            <div className = "header">
                <div className = "header-top">
                    <div className="header-top-left">
                        <span onClick={ this.props.setCollapsed }><Icon type={ this.props.collapsed? "menu-unfold":"menu-fold" }/></span>
                    </div>
                    <div className="header-top-right">
                        欢迎, { user.username } &nbsp;&nbsp; <LinkButton onClick={this.logout}>退出</LinkButton>
                    </div>
                </div>
                <div className = "header-bottom">
                    <div className = "header-bottom-left">{title}</div>
                    <div className = "header-bottom-right">
                        <span>{time}</span>
                        {/* <img src = {dayPictureUrl} alt = "天气" /> */}
                        {/* <span>{ weather }</span> */}
                    </div>
                </div>
            </div>
        )
    }
}

// 包装之后 可以 直接使用 this.props.history

export default connect(
    state => ({ headerTitle: state.headerTitle, user: state.user }),
    { logout }
)(withRouter( Header ))