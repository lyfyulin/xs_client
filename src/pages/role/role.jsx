import React, { Component } from 'react'
import {
    Card,
    Table,
    Button,
    Modal,
    message,
} from 'antd'
import AddForm from './add-form'
import AuthForm from './auth-form'
import { reqRoles, reqAddRole, reqUpdateRole } from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import { BASE_MENU } from '../../utils/ConstantUtils'
import { getDateTimeString, getNowDateTimeString } from '../../utils/dateUtils'
import LinkButton from '../../components/link-button'
import _ from 'lodash'

export default class Role extends Component {

    state = {
        isShowAdd: false,
        isShowAuth: false,
        roles: [],
        tableBodyHeight: 480,
    }

    constructor(props) {
        super(props)
        this.authRef = React.createRef()
    }

    initColumns = () => {
        this.columns = [{
            title: '角色名称',
            dataIndex: 'role_name',
            width: 100,
        },{
            title: '创建时间',
            dataIndex: 'create_time',
            render: getDateTimeString,
            width: 100,
        },{
            title: '授权时间',
            dataIndex: 'auth_time',
            render: getDateTimeString,
            width: 100,
        },{
            title: '授权人',
            dataIndex: 'auth_name',
            width: 100,
        },{
            title: '操作',
            render: role => <LinkButton onClick = { () => { this.showAuth(role) } } >设置权限</LinkButton>,
            width: 100,
        }]
    }
    
    showAuth = (role) => {
        this.role = role
        this.setState({
            isShowAuth: true,
        })
    }

    getRoles = async () => {
        const result = await reqRoles()
        if( result.code === 1 ){
            const roles = result.data
            this.setState({
                roles
            })
        }else{
            message.error("获取角色信息失败！")
        }
    }

    addRole = async () => {

        this.form.validateFields( async ( error, values ) => {
            if(!error){
                this.setState({ isShowAdd: false })
                const result = await reqAddRole( { role_name: values.role_name, auth_name: memoryUtils.user.username, menu : BASE_MENU } )
                if( result.code === 1 ){
                    message.success( "角色添加成功！" )
                    this.getRoles()
                }else{
                    message.error("角色添加失败！")
                }
            }
        } )
        this.getRoles()
    }


    updateRole = async () => {

        this.setState({ isShowAuth: false })

        let {role } = this
        role.menu = this.authRef.current.getMenus().join(";")
        role.auth_name = memoryUtils.user.username
        role.auth_time = getDateTimeString(new Date().getTime())

        const result = await reqUpdateRole( role )
        if(result.code === 1){
            message.success("设置权限成功！")
        } else {
            message.error(result.message)
        }
        this.getRoles()
    }

    componentDidMount() {
        this.initColumns()
        this.getRoles()
        this.setState({ tableBodyHeight: window.innerHeight - 260 })
        window.addEventListener('resize', this.onWindowResize)
    }

    onWindowResize = _.throttle(() => {
        this.setState({ tableBodyHeight: window.innerHeight - 260  })
    }, 800)

    componentWillUnmount = () => {
        window.removeEventListener('resize', this.onWindowResize)
        this.setState = (state, callback) => {
            return
        }
    }

    render() {

        const { isShowAdd, isShowAuth, roles, tableBodyHeight } = this.state

        const role = this.role || {}

        const title = (
            <span>
                <Button type="primary" onClick = { () => { this.setState({ isShowAdd: true }) } } >创建角色</Button>
            </span>
        )

        return (
            <Card title = { title } >
                <Table
                    columns = { this.columns }
                    dataSource = { roles }
                    rowKey = "role_id"
                    pagination = { false }
                    scroll={{ y: tableBodyHeight }}
                >

                </Table>

                <Modal 
                    title = "添加角色"
                    visible = { isShowAdd }
                    onOk = { this.addRole }
                    onCancel = { () => { this.setState({ isShowAdd: false }) } }
                >
                    <AddForm setForm = { ( form ) => { this.form = form } }  />
                </Modal>
                <Modal
                    title = "设置角色权限"
                    visible = { isShowAuth }
                    onCancel = { () => { this.setState({ isShowAuth: false }) } }
                    onOk = { this.updateRole }
                >
                    <AuthForm 
                        role = { role } 
                        ref = { this.authRef }
                    />
                </Modal>
            </Card>
        )
    }
}
