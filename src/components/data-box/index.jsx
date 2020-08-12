import React, { Component } from 'react'

import './index.less'
import { Icon } from 'antd'

export default class DataBox extends Component {

    render() {
        return (
            <div className="data-box">
                <div className="line-box">
                    <i className="t-l-line"></i> 
                    <i className="l-t-line"></i> 
                </div> 
                <div className="line-box">
                    <i className="t-r-line"></i> 
                    <i className="r-t-line"></i> 
                </div> 
                <div className="line-box">
                    <i className="l-b-line"></i> 
                    <i className="b-l-line"></i> 
                </div> 
                <div className="line-box">
                    <i className="r-b-line"></i> 
                    <i className="b-r-line"></i> 
                </div> 
                <div className="data-head"> <Icon type="caret-right"/>&nbsp;{ this.props.title } </div>
                <div className="data-body">
                    { this.props.children }
                </div>
            </div>
        )
    }
}
