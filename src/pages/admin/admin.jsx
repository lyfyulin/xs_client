import React, { Component } from 'react'
import { Redirect, Switch, Route } from 'react-router-dom'
import { Layout } from 'antd' 
import { connect } from 'react-redux'

import LeftNav from '../../components/left-nav'
import Header from '../../components/header'
import Home from '../home/home'
import Role from '../role/role'
import User from '../user/user'
import RoadState from '../charts/roadstate'
import InterState from '../charts/interstate'
import AreaState from '../charts/areastate'
import Link from '../link/link'
import Accidents from '../accidents/accidents'
import Area from '../area/area'
import Device from '../device/device'
import SearchData from '../search/search-data'
import Node from '../node/node'
import Trajectory from '../trajectory/trajectory'
import NodeSignal from '../node-signal/node-signal'
import Line from '../line/line'
import Strategy from '../strategy/strategy'

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
        // console.log(this.props.location.pathname);
        return (
            <Layout style={{ height: '100%' }}>
                <Sider collapsible collapsed={ collapsed }>
                    <LeftNav collapsed={ collapsed }/>
                </Sider>
                <Layout>
                    <Header setCollapsed = { this.setCollapsed } collapsed={ collapsed }/>
                    <Content 
                        id = "content"
                        style={{ height:'calc(100% - 80px)', backgroundColor: '#ccc', padding: 0, margin: 0 }}
                    >
                        <Switch>
                            <Route path="/home" component={ Home }></Route>
                            <Route path="/strategy" component={ Strategy }></Route>
                            <Route path="/role" component={ Role }></Route>
                            <Route path="/user" component={ User }></Route>
                            {/* <Route path="/charts/roadstate" component={ RoadState }></Route> */}
                            {/* <Route path="/charts/interstate" component={ InterState }></Route> */}
                            {/* <Route path="/charts/areastate" component={ AreaState }></Route> */}
                            <Route path="/node" component={ Node }></Route>
                            <Route path="/link" component={ Link }></Route>
                            <Route path="/device" component={ Device }></Route>
                            <Route path="/search" component={ SearchData }></Route>
                            <Route path="/node-signal" component={ NodeSignal }></Route>
                            <Route path="/line" component={ Line }></Route>
                            <Route path="/accidents" component={ Accidents }></Route>
                            <Route path="/area" component={ Area }></Route>
                            <Route path="/trajectory" component={ Trajectory }></Route>
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
