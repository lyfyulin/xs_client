import React, { Component } from 'react'
import { List } from 'antd'
import { LINK_NAME, INTER_INFO } from '../../utils/baoshan'

export default class LvqiTable extends Component { 
    
    state = {
        listMarginTop: "0",
        animate: true,
        itemHeight: 0,
    }

    scrollUp = e =>{

        let data = this.props.data||[]
        let { itemHeight } = this.state
        data.push( data[0] )

        let oDiv = document.getElementById("scrollList")

        let rowNum = this.props.rowNum || 3

        if( oDiv && oDiv.getElementsByTagName("li") && oDiv.getElementsByTagName("li").length > 0){

            if( itemHeight !== document.getElementById("list").clientHeight / 3 ){
                this.setState({ itemHeight: document.getElementById("list").clientHeight / rowNum })
            }
            
            let height = oDiv.getElementsByTagName("li")[0].scrollHeight + 1
            this.setState({ 
                animate: true,
                listMarginTop: `-${height}px`
            })

            this.timer = setTimeout(() => { 
                data.shift()
                this.setState({ 
                    animate: false,
                    listMarginTop: "0",
                })
                this.forceUpdate()
            }, (this.props.timer / 2) || 2000 )

        }

    }

    componentDidMount() {
        let { itemHeight } = this.state
        let rowNum = this.props.rowNum || 3
        
        if( itemHeight !== document.getElementById("list").clientHeight / rowNum ){
            this.setState({ itemHeight: document.getElementById("list").clientHeight / rowNum })
        }
        this.interval1 = setInterval( this.scrollUp, this.props.timer || 4000 )
    }

    componentWillUnmount() {
        if(this.interval1) clearInterval(this.interval1)
        if(this.timer) clearTimeout(this.timer)
    }
  
    render () {
        
        let data = this.props.data || []
        let dataType = this.props.dataType || ""
        
        const { animate, itemHeight } = this.state
        return (
            <div className = "full" id = "list" style = {{ overflow: 'hidden' }}>
                <List
                    itemLayout = "horizontal"
                    id = "scrollList"
                    style = {{ marginTop:this.state.listMarginTop, overflow: 'hidden' }}
                    className = { animate ? "animate" : '' }
                >
                    {
                        dataType === "link"?(
                            data.length>0 && data[0]?(data.map( (e, i) => (
                                <List.Item key={ i } style={{ height: itemHeight }} >
                                    <div className="full lyf-center">
                                        <div className="lyf-col-6 lyf-center lyf-font-1"> { LINK_NAME[e.link_id - 1] } </div>
                                        <div className="lyf-col-4 lyf-center lyf-font-2"> { e.speed } km/h </div>
                                    </div>
                                </List.Item>
                            ))):(<></>)
                        ):dataType === "inter"?(
                            data.length>0 && data[0]?(data.map( (e, i) => (
                                <List.Item key={ i } style={{ height: itemHeight }} >
                                    <div className="full lyf-center">
                                        <div className="lyf-col-6 lyf-center lyf-font-1"> { INTER_INFO[e.inter_id - 1][1] } </div>
                                        <div className="lyf-col-4 lyf-center lyf-font-2"> { e.avg_delay } s </div>
                                    </div>
                                </List.Item>
                            ))):(<></>)
                        ):(
                            data.length>0 && data[0]?(data.map( (e, i) => (
                                <List.Item key={ i } style={{ height: itemHeight }} >
                                    <div className="full lyf-center">
                                        <div className="lyf-col-6 lyf-center lyf-font-1"> { e.name } </div>
                                        <div className="lyf-col-4 lyf-center lyf-font-2"> { e.value } </div>
                                    </div>
                                </List.Item>
                            ))):(<></>) 
                        )
                    }
                </List>
            </div>
        )
    }
} 