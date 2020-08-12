import React, { Component } from 'react'
import ReactEcharts from "echarts-for-react"

export default class LineChart extends Component {

    render() {
        return (
            <ReactEcharts
                option = { this.props.option }
                // showLoading = { loading }
                notMerge={true}
                lazyUpdate={true}
                style={{ height:'100%', width:'100%' }}
            />
        )
    }
}
