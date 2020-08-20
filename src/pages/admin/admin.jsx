import React, { Component } from 'react'
import { Redirect, Switch, Route } from 'react-router-dom'
import { Layout } from 'antd' 
import { connect } from 'react-redux'

import LeftNav from '../../components/left-nav'
import Header from '../../components/header'
import Home from '../home/home'
import Role from '../role/role'
import User from '../user/user'
import Accidents from '../accidents/accidents'
import SearchData from '../search/search-data'
import Strategy from '../strategy/strategy'
import Od from '../od/od'
import Device from '../device/device'
import Tongqin from '../tongqin/tongqin'
import Vn from '../vn/vn'
import State from '../state/state'
import { system } from '../../config/menuConfig'

const { Content, Footer, Sider } = Layout

class Admin extends Component {

    state = {
        collapsed: false,
    }

    setCollapsed = () =>{
        this.setState({
            collapsed: !this.state.collapsed
        })
    }

    render() {
        // 读取保存的user信息，不存在则跳到登录界面
        const user = this.props.user
        const { collapsed } = this.state
        if(!user.user_id){
            return <Redirect to="/login"/>
        }
        return (
            <Layout style={{ height: '100%' }}>
                <Sider collapsible collapsed={ collapsed }>
                    <LeftNav collapsed={ collapsed } title={ system.title }/>
                </Sider>
                <Layout>
                    <Header setCollapsed = { this.setCollapsed } collapsed={ collapsed }/>
                    <Content 
                        id = "content"
                        style={{ height:'calc(100% - 80px)', padding: 0, margin: 0 }}
                    >
                        <Switch>
                            <Route path="/home" component={ Home }></Route>
                            <Route path="/state" component={ State }></Route>
                            <Route path="/vn" component={ Vn }></Route>
                            <Route path="/tongqin" component={ Tongqin }></Route>
                            <Route path="/device" component={ Device }></Route>
                            <Route path="/od" component={ Od }></Route>
                            <Route path="/role" component={ Role }></Route>
                            <Route path="/user" component={ User }></Route>
                            <Route path="/search" component={ SearchData }></Route>
                            <Route path="/accidents" component={ Accidents }></Route>
                            <Route path="/strategy" component={ Strategy }></Route>
                            <Redirect to="/home" />
                        </Switch>
                    </Content>
                    {/* <Footer style={{ height: 40, backgroundColor: '#0003', textAlign: 'center', padding: '10px 10px' }} >Copyright (c) 2019-2020 杭州绿启交通科技有限公司 </Footer> */}
                </Layout>
            </Layout>
        )
    }
}

export default  connect(
    state => ({ user: state.user }),
    { }
)(Admin)
