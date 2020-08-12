import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import DeviceInfo from './device-info'
import DeviceDetail from './device-detail'
import './device.less'

export default class Device extends Component {
    render() {
        return (
            <Switch>
                <Route path="/device" exact component={ DeviceInfo }/>
                <Route path="/device/detail/:id" component = { DeviceDetail }/>
                <Route path="/device/add" component = { DeviceDetail }/>
                <Redirect to="/device"/>
            </Switch>
        )
    }
}
