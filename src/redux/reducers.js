
import storageUtils from '../utils/storageUtils'
import { combineReducers } from 'redux'
import { SET_HEADER_TITLE, RECEIVE_USER, SHOW_ERROR, LOGOUT } from './action-types'


const initHeaderTitle = '首页'
function headerTitle ( state = initHeaderTitle, action ) {
    switch (action.type) {
        case SET_HEADER_TITLE:
            return action.data
        default:
            return state
    }
}

const initUser = storageUtils.getUser()
function user ( state = initUser, action )  {
    switch (action.type) {
        case RECEIVE_USER:
            return action.user
        case SHOW_ERROR:
            return { ...state, errorMsg: action.message }
        case LOGOUT:
            return {}
        default:
            return state
    }
}
/*
    返回的是新的 reducer 函数
    总的 state 结构：
    { 
        headerTitle: '首页', 
        user: {} 
    }
*/
export default combineReducers({ headerTitle, user })

/*
const reducer = combineReducers({headerTitle, user})
export default reducer
*/
