import React, { Component } from 'react'
import { Card, Icon } from 'antd'
import LinkButton from '../../components/link-button'

export default class LinkParam extends Component {
    render() {
        const title = (
            <span>
                <LinkButton onClick={ () => this.props.history.goBack() }>
                    <Icon type="arrow-left"></Icon>
                </LinkButton>
                &nbsp;&nbsp;
                <span>路段</span>
            </span>
        )

        return (
            <Card title={title} >

            </Card>
        )
    }
}
