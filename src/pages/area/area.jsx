import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import AreaInfo from './area-info'
import AreaDetail from './area-detail'

export default class Area extends Component {
    render() {
        return (
            <Switch>
                <Route path="/area" exact component={ AreaInfo }/>
                <Route path="/area/detail/:id" component = { AreaDetail }/>
                <Route path="/area/add" component = { AreaDetail }/>
                <Redirect to="/area"/>
            </Switch>
        )
    }
}
