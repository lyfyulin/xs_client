/*
    入口文件
*/
import React from "react"
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store from './redux/store'

import { LocaleProvider } from 'antd'
import zh_CN from 'antd/lib/locale-provider/zh_CN'


import App from './App'
import './api'

ReactDOM.render( 
    (<Provider store = {store}>
        <LocaleProvider locale={ zh_CN }>
            <App/>
        </LocaleProvider>
    </Provider>
), document.getElementById('root') )


