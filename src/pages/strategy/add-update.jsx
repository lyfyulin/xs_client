import React, { Component } from 'react'
import { 
    Card, 
    Icon,
    Form,
    Input,
    Select,
    Button,
    message,  
} from 'antd'
import { connect } from 'react-redux'
import LinkButton from '../../components/link-button'
import PictureWall from './picture-wall'
import { reqUsers, reqUpdateStrategy, reqInsertStrategy } from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import RichTextEditor from './rich-text-editor'
import { STRATEGY_TYPE } from '../../utils/baoshan'

const Option = Select.Option
const Item = Form.Item

class StrategyAddUpdate extends Component {

    state = {
        strategy: memoryUtils.strategy||{},
        users: [],
    }

    constructor(props) {
        super(props)
        // 创建 Ref 容器，并保存到组件对象
        this.picWallRef = React.createRef()
        this.editorRef = React.createRef()
    }
    
    /*

    load_users = async () => {
        const result = await reqUsers()
        const { strategy } = this.state
        if( result.code === 1 ){

            if(this.isUpdate){
                let username = result.data.filter( e => e.user_id === strategy.user_id )[0].username
                strategy.username = username
                this.setState({ strategy })
            }
        }
    }
    */

    validatePrice = ( rule, value, callback ) => {
        const res = parseInt( value.trim(), 10 )
        if( isNaN( res ) ){
            callback( "价格必须输入大于0的值！" )
        } else if( res <= 0 ){
            callback( "价格必须大于0！" )
        }else{
            callback()
        }
    }

    handleSubmit = ( e ) => {
        e.preventDefault();
        this.props.form.validateFields( async ( err, values ) => {
            if( !err ){

                let strategy_images_url = this.picWallRef.current.getImages()

                strategy_images_url = !strategy_images_url? '': strategy_images_url.join(";")

                const strategy_content = this.editorRef.current.getDetail()

                let strategy = { ...values, user_id:this.props.user.user_id, strategy_images_url, strategy_content }

                if( this.isUpdate ){
                    strategy.strategy_id = this.state.strategy.strategy_id
                }

                const result = this.isUpdate ? await reqUpdateStrategy(strategy): await reqInsertStrategy(strategy)

                if(result.code === 1){
                    message.success( `${this.isUpdate?'修改':'添加'}策略成功！` )
                    this.props.history.replace('/strategy')
                }else{

                    message.error( `${this.isUpdate?'修改':'添加'}策略失败！` )
                }
                
            }
        } )
    }

    componentDidMount() {
        const { strategy } = this.state
        this.isUpdate = !!strategy.strategy_id
        // this.load_users()
    }


    render() {
        const { strategy } = this.state
        const isUpdate = this.isUpdate

        const { getFieldDecorator }  = this.props.form

        const title = (
            <span>
                <LinkButton onClick = { () => { this.props.history.replace("/strategy") } } >
                    <Icon type = "arrow-left" />
                </LinkButton>
                <span> { isUpdate ? "更新策略" : "添加策略" } </span>
            </span>
        )

        // form 的所有 item 的布局
        const formLayout = {
            labelCol : { span: 2 } ,
            wrapperCol : { span: 10 },
        }
        return (
            <Card title = {title} >
                <Form
                    {...formLayout}
                    onSubmit = { this.handleSubmit }
                >
                    <Item label = "策略名称">
                        {
                            getFieldDecorator("strategy_summary", {
                                initialValue: strategy.strategy_summary||"",
                                rules: [
                                    { required: true, message: "必须输入策略名称！" },
                                ]
                            })( <Input type = "text" placeholder = "请输入策略名称" /> )
                        }
                    </Item>
                    <Item label = "添加用户">
                        {
                            getFieldDecorator("username", {
                                initialValue: strategy.username || this.props.user.username,
                                rules: [
                                    { required: true, message: "必须输入用户名称！" },
                                ]
                            })( <Input type = "text" disabled /> )
                        }
                    </Item>
                    <Item label = "策略类型">
                        {
                            getFieldDecorator("strategy_type", {
                                initialValue: strategy.strategy_type,
                                rules: [
                                    { required: true, message: "必须选择策略类型！" },
                                ]
                            })( 
                                <Select >
                                    <Option value = "">未选择</Option>
                                    {
                                        STRATEGY_TYPE.map( (e, i) => (<Option key = { i } value = { i + 1 }>{ e }</Option>) )
                                    }
                                </Select>
                             )
                        }
                    </Item>
                    <Item label = "策略图片">
                        <PictureWall ref = { this.picWallRef } images = { strategy.strategy_images_url }/>
                    </Item>
                    <Item label = "货物详情" wrapperCol = {{ span: 20 }} >
                        <RichTextEditor detail = { strategy.strategy_content } ref = { this.editorRef } />
                    </Item>
                    <Item>
                        <Button type = "primary" htmlType = "submit"> 提交 </Button>
                    </Item>
                </Form>

            </Card>
        )
    }
}

const StrategyForm = Form.create()( StrategyAddUpdate )

export default connect(
    state => ({ user: state.user }),
    {}
)(StrategyForm)

