import storageUtils from "./storageUtils";
/**
 *  将数据保存到内存中去， 只有初始化时去 localStorage 读取一次 user 变量。
 */
const user = storageUtils.getUser()
export default {
    user,           // 用来存储登录用户信息
    accident: {},
    node: {},
    link: {},
    area: {},
    line: {},
    device: {},
    strategy: {},
}

