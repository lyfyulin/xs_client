import { SET_HEADER_TITLE, RECEIVE_USER, SHOW_ERROR, LOGOUT } from './action-types'

import { reqLogin } from '../api'
import storageUtils from '../utils/storageUtils'


export const setHeaderTitle = ( headerTitle ) => ({ type: SET_HEADER_TITLE, data: headerTitle  })

export const receiveUser = ( user ) => ({ type: RECEIVE_USER, user })

export const showError = ( message ) => ({ type: SHOW_ERROR, message })



export const logout = () => {
    storageUtils.removeUser()
    return { type: LOGOUT }
}

// 登录的异步action
export function login ( username, password ) {
    return async dispatch => {
        // 1.发送登录异步action
        const result = await reqLogin( username, password )

        // 2.请求结束，分发同步action
        // 2.1 登录成功
        // 2.2 登录失败
        if( result.code === 1 ){
            const user = result.data
            storageUtils.saveUser(user)
            dispatch( receiveUser( user ) )
        }else{
            const message = result.message
            dispatch( showError( message ) )
        }
        
    }
}

