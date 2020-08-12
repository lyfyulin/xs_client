import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import LineSignalInfo from './line-signal-info'
import LineSignalAdd from './line-signal-add'
import LineInfo from './line-info'
import LineDetail from './line-detail'

export default class Line extends Component {
    render() {
        return (
            <Switch>
                <Route path="/line" exact component={ LineInfo }/>
                <Route path="/line/detail/:id" component={ LineDetail }/>
                <Route path="/line/add" component={ LineDetail }/>
                <Route path="/line/signal" component={ LineSignalInfo }/>
                <Route path="/line/signal-add" component = { LineSignalAdd }/>
                <Redirect to="/line"/>
            </Switch>
        )
    }
}
