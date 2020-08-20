import React, { Component } from 'react'
import { Form, Input, Tree } from 'antd'
import PropTypes from 'prop-types'
import { menuList } from '../../config/menuConfig'

const Item = Form.Item

export default class AuthForm extends Component {

    static propTypes = {
        role: PropTypes.object
    }

    state = {
        checkedKeys: []
    }

    getMenus = () => this.state.checkedKeys

    onCheck = (checkedKeys) => {
        this.setState({
            checkedKeys
        })
    }

    componentWillMount() {
        const checkedKeys = this.props.role.menu.split(";")
        this.setState({
            checkedKeys: checkedKeys
        })
    }

    // 组件接收新标签属性时就会执行 (初始显示时不会调用，父组件传入数据 刷新)
    // nextProps: 接收到的新的属性对象
    componentWillReceiveProps (nextProps) {

        const menu = nextProps.role.menu.split(";")
        this.setState({
            checkedKeys: menu
        })
    }


    render() {
        const { role } = this.props
        const { checkedKeys } = this.state
        return (
            <Form>
                <Item>
                    <Input disabled value = { role.name } /> 
                </Item>
                <Item>
                    <Tree
                        checkable
                        defaultExpandAll
                        checkedKeys={ checkedKeys }
                        treeData = { menuList || {} }
                        onCheck = { this.onCheck }
                    />
                </Item>
            </Form>
        )
    }
}

