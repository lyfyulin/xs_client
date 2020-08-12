import React, { Component } from 'react'

import {
    Card,
    Icon,
    List,
} from 'antd'

import LinkButton from '../../components/link-button'
import { reqStrategyById } from '../../api'
import { BASE_IMG } from '../../utils/ConstantUtils'
import memoryUtils from '../../utils/memoryUtils'
import { STRATEGY_TYPE } from '../../utils/baoshan'
const { Item } = List

export default class StrategyDetail extends Component {

    state = {
        strategy: memoryUtils.strategy,
    }

    async componentDidMount() {
        let strategy = this.state.strategy
        if( strategy.strategy_id ){

        } else {
            const id = this.props.match.params.id
            const result = await reqStrategyById( id )
            if(result.code === 1){
                strategy = result.data
                this.setState({
                    strategy
                })
            }
        }
    }

    render() {
        const strategy =  this.state.strategy
        const title = (
            <span>
                <LinkButton onClick={ () => this.props.history.goBack() }>
                    <Icon type="arrow-left"></Icon>
                </LinkButton>
                &nbsp;&nbsp;
                <span>安全策略详情</span>
            </span>
        )
        return (
            <Card title = {title} className = "detail">
                <List>
                    <Item>
                        <span className = "detail-item-left">策略名称：</span>
                        <span className = "detail-item-right">{strategy.strategy_summary}</span>
                    </Item>
                    <Item>
                        <span className = "detail-item-left">策略描述：</span>
                        <span className = "detail-item-right">{strategy.create_time}</span>
                    </Item>
                    <Item>
                        <span className = "detail-item-left">策略图片：</span>
                        <span className = "detail-item-right">
                        {
                            strategy.strategy_images_url?strategy.strategy_images_url.split(';').map( (image_url, index) => 
                                <img key={index} className = "detail-img" src = { BASE_IMG + image_url } alt = { image_url }  />
                            ):""
                        }
                        </span>
                    </Item>
                    <Item>
                        <span className = "detail-item-left">策略类型：</span>
                        <span className = "detail-item-right">
                        {
                            STRATEGY_TYPE[strategy.strategy_type - 1]
                        }
                        </span>
                    </Item>
                    <Item>
                        <span className = "detail-item-left">策略详情：</span>
                        <span className = "detail-item-right" dangerouslySetInnerHTML={ { __html: strategy.strategy_content } } >
                        </span>
                    </Item>
                </List>
            </Card>
        )
    }
}