export function getTimeString(time){
    if(!time) return ''
    let data = new Date(time)
    return '' + (data.getHours() + '').padStart(2, '0') + ':'+ (data.getMinutes() + '').padStart(2, '0') + ':'+ (data.getSeconds() + '').padStart(2, '0')
}

export function getDateTimeString(time){
    if(!time) return ''
    let data = new Date(time)
    return data.getFullYear() + '-' + ((data.getMonth() + 1) + '').padStart(2, '0') + '-' + (data.getDate() + '').padStart(2, '0') + ' ' + (data.getHours() + '').padStart(2, '0') + ':'+ (data.getMinutes() + '').padStart(2, '0') + ':'+ (data.getSeconds() + '').padStart(2, '0')
}

export function getDateString(time){
    if(!time) return ''
    let data = new Date(time)
    return data.getFullYear() + '-' + ((data.getMonth() + 1) + '').padStart(2, '0') + '-' + (data.getDate() + '').padStart(2, '0')
}

export function getNowTimeString(){
    let data = new Date()
    return '' + (data.getHours() + '').padStart(2, '0') + ':'+ (data.getMinutes() + '').padStart(2, '0') + ':'+ (data.getSeconds() + '').padStart(2, '0')
}

export function getNowDateTimeString(){
    let data = new Date()
    return data.getFullYear() + '-' + ((data.getMonth() + 1) + '').padStart(2, '0') + '-' + (data.getDate() + '').padStart(2, '0') + ' ' + (data.getHours() + '').padStart(2, '0') + ':'+ (data.getMinutes() + '').padStart(2, '0') + ':'+ (data.getSeconds() + '').padStart(2, '0')
}

export function getNowDateString(){
    let data = new Date()
    return data.getFullYear() + '-' + ((data.getMonth() + 1) + '').padStart(2, '0') + '-' + (data.getDate() + '').padStart(2, '0')
}

export function getTodayDateString() {
    let data = new Date()
    return data.getFullYear() + '-' + ((data.getMonth() + 1) + '').padStart(2, '0') + '-' + (data.getDate() + '').padStart(2, '0')
}


export function getLastNDayDateString(n) {
    let now = new Date()
    let data = new Date(now - 86400 * 1000 * n)
    return data.getFullYear() + '-' + ((data.getMonth() + 1) + '').padStart(2, '0') + '-' + (data.getDate() + '').padStart(2, '0')
}

export function getNextNDayDateString(n) {
    let now = new Date()
    let data = new Date(now + 86400 * 1000 * n)
    return data.getFullYear() + '-' + ((data.getMonth() + 1) + '').padStart(2, '0') + '-' + (data.getDate() + '').padStart(2, '0')
}


export function getTodayDateTimeString() {
    let data = new Date()
    return data.getFullYear() + '-' + ((data.getMonth() + 1) + '').padStart(2, '0') + '-' + (data.getDate() + '').padStart(2, '0') + " 00:00:00"
}

export function getTodayTimeString() {
    return "00:00:00"
}

export function getFutureDateString() {
    return '2300-01-01'
}

export function getFutureTimeString() {
    return '00:00:00'
}

export function getFutureDateTimeString() {
    return '2300-01-01 00:00:00'
}
