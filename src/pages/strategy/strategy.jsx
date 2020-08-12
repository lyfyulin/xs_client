import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import StrategyHome from './home'
import StrategyDetail from './detail'
import StrategyAddUpdate from './add-update'

import './strategy.less'

export default class Strategy extends Component {
    render() {
        return (
            <Switch>
                <Route path="/strategy" exact component = {StrategyHome}/>
                <Route path="/strategy/detail/:id" component = { StrategyDetail }/>
                <Route path="/strategy/addupdate" component = { StrategyAddUpdate }/>
                <Redirect to = "/strategy" />
            </Switch>
        )
    }
}
