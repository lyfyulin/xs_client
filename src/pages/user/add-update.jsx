import React, { Component } from 'react'
import { Form, Input, Select } from 'antd'
import PropTypes from 'prop-types'
const Item = Form.Item
const Option = Select.Option
class AddUpdateUser extends Component {

    static propTypes = {
        roles: PropTypes.array,
        user: PropTypes.object,
    }

    componentWillMount() {
        this.props.setForm( this.props.form )
    }

    render() {

        const { getFieldDecorator } = this.props.form

        const { user, roles } = this.props

        let rolesSelect

        if(roles){
            rolesSelect = roles.map( item => (<Option key={item.role_id} value={item.role_id}>{item.role_name}</Option>) )
        }

        const formLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 17 },
        }

        return (
            <Form
                { ...formLayout }
            >
                <Item label="用户名">
                    {
                        getFieldDecorator("username", {
                            initialValue: user.username || '',
                            rules: [
                                { required: true, message: '必须输入用户名' },
                                { max: 12, message: '最大输入12位' }
                            ]
                        })( <Input placeholder = "请输入用户名" /> )
                    }
                </Item>
                <Item label="密码">
                    {
                        getFieldDecorator("password", {
                            initialValue: user.password || '',
                            rules: [
                                { required: true, message: '必须输入密码' },
                                { max: 12, message: '最大输入12位密码' }
                            ]
                        })( <Input type = "text" placeholder = "请输入密码" /> )
                    }
                </Item>
                <Item label="姓名">
                    {
                        getFieldDecorator("name", {
                            initialValue: user.name || '',
                            rules: [
                                { required: true, message: '必须输入姓名' },
                                { min: 1, message: '最大输入1位' }
                            ]
                        })( <Input placeholder = "请输入姓名" /> )
                    }
                </Item>
                <Item label="用户详情">
                    {
                        getFieldDecorator("info", {
                            initialValue: user.info || '',
                            rules: []
                        })( <Input placeholder = "请输入用户详情" /> )
                    }
                </Item>
                <Item label="电话号">
                    {
                        getFieldDecorator("phone_number", {
                            initialValue: user.phone_number || '',
                            rules: [
                                { required: true, message: '必须输入电话号' },
                                { max: 12, message: '最大输入12位' }
                            ]
                        })( <Input placeholder = "请输入电话号" /> )
                    }
                </Item>
                <Item label="角色名称">
                    {
                        getFieldDecorator("role_id", {
                            initialValue: user.role_id || '',
                            rules: [
                                { required: true, message: '必须输入角色' },
                            ]
                        })( <Select>
                            <Option value = "">请选择</Option>
                            { rolesSelect }
                        </Select> )
                    }
                </Item>
            </Form>
        )
    }
}

export default Form.create()(AddUpdateUser)
