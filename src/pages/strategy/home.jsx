import React, { Component } from 'react'
import{
    Card,
    Button,
    Icon,
    Table,
    message,
    Popconfirm
} from 'antd'

import { reqStrategies, reqUsers, reqDeleteStrategy } from '../../api'
import LinkButton from '../../components/link-button'
import memoryUtils from '../../utils/memoryUtils'
import { throttle } from 'lodash'
import { STRATEGY_TYPE } from '../../utils/baoshan'

export default class StrategyHome extends Component {

    state = {
        loading: false,
        strategies: [],
        users: {},
    }

    initColumns = () => {
        this.strategy_columns = [
            {
                title: '策略名称',
                dataIndex: 'strategy_summary'
            },
            {
                title: '策略内容',
                dataIndex: 'strategy_content',
                render: strategy_content => strategy_content.length>20?(strategy_content.replace("<p>", "").replace("</p>", "").slice(0, 20) + "..."):strategy_content.replace("<p>", "").replace("</p>", "")
            },
            {
                title: '用户',
                dataIndex: 'user_id',
                render: user_id => this.state.users[user_id]
            },
            {
                title: '策略类型',
                dataIndex: 'strategy_type',
                render: strategy_type => {return STRATEGY_TYPE[strategy_type - 1]}
            },
            {
                title: '操作',
                width: 200,
                render: strategy => (
                    <span>
                        <LinkButton 
                            onClick = { () => {
                                memoryUtils.strategy = strategy
                                this.props.history.push("/strategy/detail/" + strategy.strategy_id)
                            } }
                        >
                            详情
                        </LinkButton>
                        <LinkButton
                            onClick = { () => {
                                memoryUtils.strategy = strategy
                                this.props.history.replace( "/strategy/addupdate" )
                            }}
                        >修改</LinkButton>
                        <Popconfirm 
                            title="是否删除?" 
                            onConfirm={async() => {
                                let strategy_id = strategy.strategy_id
                                const result = await reqDeleteStrategy(strategy_id)
                                result.code === 1?message.success("删除安全策略成功！"):message.error(result.message)
                                this.load_strategies()
                            } }
                        >
                            <LinkButton>删除</LinkButton>
                        </Popconfirm>
                    </span>
                )
            },
        ]
    }

    load_strategies = async () => {
        let result = await reqStrategies()
        if( result.code === 1 ){
            this.setState({
                strategies: result.data,
            })
        }
    }

    load_users = async () => {
        const result = await reqUsers()
        if( result.code === 1 ){
            let users = {}
            result.data.forEach( e => {
                users[e.user_id] = e.username
            })
            this.setState({ users })
        }
    }

    componentDidMount() {
        this.load_users()
        this.initColumns()
        this.load_strategies()
    }

    componentWillUnmount() {
        this.setState = (state, callback) => {
          return
        }
    }

    render() {
        const { loading, strategies } = this.state
        const title = (<span>
            {/* <Button type="primary" onClick = { () => { 
                console.log('abc')
             }} >abc</Button> */}
        </span>)
        const extra = (<Button type = "primary" onClick = { () => {
            memoryUtils.strategy = {}
            this.props.history.push( "/strategy/addupdate" )
        } }>
            <Icon type = "plus"/>添加策略
        </Button>)
        return (
            <Card title={title} extra = {extra}>
                <Table
                    bordered = { true }
                    rowKey = "strategy_id"
                    columns = { this.strategy_columns }
                    dataSource = { strategies }
                    loading = { loading }
                    // pagination = {{ current:  this.pageNum, total, defaultPageSize: PAGE_SIZE, showQuickJumper: true, onChange: this.getGoods }}
                >
                </Table>
            </Card>
        )
    }
}




