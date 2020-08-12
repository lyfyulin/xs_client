import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import SignalSchema from './signal-schema'
import AddSchema from './add'
import UpdateSchema from './update'
import OptimizeSchema from './optimize'
import GenerateSchema from './generate'
import NodeSignalInfo from './node-signal-info'

export default class NodeSignal extends Component {
    render() {
        return (
            <Switch>
                <Route path="/node-signal" exact component={ NodeSignalInfo }/>
                <Route path="/node-signal/schema/:id" component = { SignalSchema }/>
                <Route path="/node-signal/add" component = { AddSchema }/>
                <Route path="/node-signal/update" component = { UpdateSchema }/>
                <Route path="/node-signal/generate" component = { GenerateSchema }/>
                <Route path="/node-signal/optimize" component = { OptimizeSchema }/>
                <Redirect to="/node-signal"/>
            </Switch>
        )
    }
}
