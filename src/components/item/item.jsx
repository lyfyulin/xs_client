import React, { Component } from 'react'

import './item.less'

export default class LyfItem extends Component {
    render() {
        const { label } = this.props
        return (
            <div className="lyf-item">
                <div className='lyf-item-label'>{ label + "：" }&nbsp;</div>
                <div className='lyf-item-body'>
                    {
                        this.props.children
                    }
                </div>
            </div>
        )
    }
}
