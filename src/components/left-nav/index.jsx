import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Menu, Icon, message } from 'antd'
import { connect } from 'react-redux'
import { setHeaderTitle } from '../../redux/actions'
import menuList from '../../config/menuConfig'
import logo from '../../assets/images/logo.png'
import './index.less'

const { SubMenu } = Menu

class LeftNav extends Component {

  state = {
    collapsed: true,
  }

  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed
    })
  }

  /*
    判断当前用户是否有此权限
  */
  hasAuth = (item) => {
    // 得到当前用户所有权限
    const user = this.props.user
    const menu = user.menu.split(";")
    const path = this.props.location.pathname

    if(user.menu.indexOf(path) === -1){
      this.props.history.push("/")
    }
    
    // 1.管理员用户 全部访问
    // 2.item.public为true  则任何人都可以访问
    // 3.当前用户有此item的权限
    if(user.username === 'admin' || item.public || menu.indexOf(item.key)!== -1 ){
      return true
    }else if( item.children ) {
      const cItem = item.children.find( cItem => menu.indexOf(cItem.key) !== -1 )
      if(cItem){
        return !!cItem
      }
    }
    return false
  }

  /*
  根据指定菜单数据列表产生<Menu>的子节点数组
  使用 reduce() + 递归
  */
  getMenuNodes = (menuList) => {

    // 得到当前请求的path
    const path = this.props.location.pathname

    return menuList.reduce((pre, item) => {
        // 添加<Menu.Item></Menu.Item>
        // 如果 path 和 item.key 
        if(item.key === path || path.indexOf(item.key) === 0){
          this.props.setHeaderTitle(item.title)
        }

        if( this.hasAuth( item ) ){
          if (!item.children) {
            pre.push((
                <Menu.Item key = {item.key}>
                  <Link to = {item.key} onClick = { () => this.props.setHeaderTitle(item.title) } >
                      <Icon type = {item.icon} />
                      <span>{item.title}</span>
                  </Link>
                </Menu.Item>
            ))
        } else { // 添加<SubMenu></SubMenu>
            // 如果当前请求路由与当前菜单的某个子菜单的key匹配, 将菜单的key保存为openKey
            const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
            if (cItem) {
                this.openKey = item.key
            }
            pre.push((
                <SubMenu
                key={item.key}
                title={
                    <span>
                    <Icon type={item.icon} />
                    <span>{item.title}</span>
                    </span>
                }
                >
                {this.getMenuNodes(item.children)}
                </SubMenu>
            ))
          }
        }
        return pre
    }, [])
  }

  /**
   *    第一次执行 render() 之前
   *    第一次 render() 之前需要做的准备工作
   */
  componentWillMount() {
    this.menuNodes = this.getMenuNodes(menuList)
  }

  componentWillUnmount = () => {
    this.setState = (state,callback)=>{
      return ;
    }
  }
  

  render() {
    let selectKey = '/' + this.props.location.pathname.split('/').slice(1)[0]
    
    const { collapsed }  = this.state
    return (
      <div className="left-nav">
        <Link className="left-nav-link" to="/home">
            <img src={logo} alt="logo"/>
            <h1>保山平台</h1>
        </Link>
        <Menu
          selectedKeys={[selectKey]}
          defaultOpenKeys={[this.openKey]}
          inlineCollapsed={ collapsed }
          mode="inline"
          theme="dark"
        >
          {
            this.menuNodes
          }
        </Menu>
      </div>
    )
  }
}

// 高阶组件包装路由组件，形成新组件
// 新组件 传递 3 个特别属性：history / location / match
export default connect(
  state => ({ user: state.user }),
  { setHeaderTitle }
)( withRouter( LeftNav ) )
/**
 * 默认选择对应的 menuItem
 * 有可能需要打开某个 SubMenu：访问的是某个二级菜单
 */