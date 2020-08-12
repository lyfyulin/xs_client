import React, { Component } from 'react'
import { intersection_titles } from '../../config/chartsTitle'
import './charts.less'

export default class InterState extends Component {

    state ={
    }

    componentWillMount(){
       
    }

    render() {
        return (
            <div className = "lvqi-row2-col2">
                <div className = "lvqi-row-2">
                    <div className = "lvqi-col-2">
                        <div className = "lvqi-chart-title">
                            { intersection_titles[0] }
                        </div>
                        <div className = "lvqi-chart-content">

                        </div>
                    </div>
                    <div className = "lvqi-col-2">
                        <div className = "lvqi-chart-title">
                            { intersection_titles[1] }
                        </div>
                        <div className = "lvqi-chart-content">
  
                        </div>
                    </div>
                </div>
                <div className = "lvqi-row-2">
                    <div className = "lvqi-col-2">
                        <div className = "lvqi-chart-title">
                            { intersection_titles[2] }
                        </div>
                        <div className = "lvqi-chart-content">

                        </div>
                    </div>
                    <div className = "lvqi-col-2">
                        <div className = "lvqi-chart-title">
                            { intersection_titles[3] }
                        </div>
                        <div className = "lvqi-chart-content">

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
