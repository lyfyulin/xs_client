
import React, { PureComponent } from 'react'
import { Form, Input } from 'antd'
import PropTypes from 'prop-types'

class AddForm extends PureComponent {

    static propTypes = {
        setForm: PropTypes.func.isRequired
    }

    componentWillMount() {
        this.props.setForm( this.props.form )
    }

    render() {
        const { getFieldDecorator } = this.props.form
        return (
            <Form
                onSubmit = { this.handleOk }
            >
                {
                    getFieldDecorator("role_name", {
                        initialValue: '',
                        rules: [
                            { required: true, message: "请输入角色名称" }
                        ]
                    })( <Input type = "text" placeholder = "请输入角色名称" /> )
                }
            </Form>
        )
    }
}

export default Form.create()(AddForm)

