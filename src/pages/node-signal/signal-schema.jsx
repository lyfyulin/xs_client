import React, { Component } from 'react'

import PropTypes from 'prop-types'
import { PHASE_SCHEMA } from '../../utils/ConstantUtils'
import './signal.less'

export default class SignalSchema extends Component {
    
    static props = {
        data : PropTypes.array.isRequired,
        inter_type: PropTypes.number.isRequired,
    }

    render() {
        const { data } = this.props
        let phase_data
        let rowClass
        switch(data.length){
            case 0:
                rowClass = ['display-none', 'display-none', 'display-none']
                phase_data = [[],[],[]]
                break;
            case 1:
                rowClass = ['full flex-div', 'display-none', 'display-none']
                phase_data = [[data[0]],[],[]]
                break;
            case 2:
                rowClass = ['full flex-div', 'display-none', 'display-none']
                phase_data = [[data[0], data[1]],[],[]]
                break; 
            case 3:
                rowClass = ['full flex-div', 'display-none', 'display-none']
                phase_data = [[data[0], data[1], data[2]],[],[]]
                break;
            case 4:
                rowClass = ['lyf-row-5 flex-div', 'lyf-row-5 flex-div', 'display-none']
                phase_data = [[data[0], data[1]], [data[2], data[3]], []]
                break;
            case 5:
                rowClass = ['lyf-3-row flex-div', 'lyf-3-row flex-div', 'display-none']
                phase_data = [[data[0], data[1], data[2]], [data[3], data[4]], []]
                break; 
            case 6:
                rowClass = ['lyf-3-row flex-div', 'lyf-3-row flex-div', 'display-none']
                phase_data = [[data[0], data[1], data[2]], [data[3], data[4], data[5]], []]
                break;
            case 7:
                rowClass = ['lyf-3-row flex-div', 'lyf-3-row flex-div', 'lyf-3-row flex-div']
                phase_data = [[data[0], data[1], data[2]], [data[3], data[4], data[5]], [data[6]]]
                break;
            case 8:
                rowClass = ['lyf-3-row flex-div', 'lyf-3-row flex-div', 'lyf-3-row flex-div']
                phase_data = [[data[0], data[1], data[2]], [data[3], data[4], data[5]], [data[6], data[7]]]
                break;
            case 9:
                rowClass = ['lyf-3-row flex-div', 'lyf-3-row flex-div', 'lyf-3-row flex-div']
                phase_data = [[data[0], data[1], data[2]], [data[3], data[4], data[5]], [data[6], data[7], data[8]]]
                break;
            default:
                rowClass = ['lyf-3-row flex-div', 'lyf-3-row flex-div', 'lyf-3-row flex-div'] 
                phase_data = [[data[0], data[1], data[2]], [data[3], data[4], data[5]], [data[6], data[7], data[8]]]
        }

        return (
            <div className="full lyf-center">
                <div className="lyf-row-2 lyf-font-3 lyf-center">
                    信号阶段
                </div>
                <div className="lyf-row-8">
                    <div className={rowClass[0]}>
                        {
                            phase_data[0].length > 0? phase_data[0].map( (item, index) =>(
                                <div key={index} className="flex-item">
                                    <div className="flex-item-content lyf-center">
                                        <img className="phase-img" src={require(`../../assets/images/${this.props.inter_type}/phase-${item.phase_schema}.png`)} alt={ PHASE_SCHEMA[item.phase_schema] }/>
                                    </div>
                                    <div className="flex-item-title">
                                        <div className="lyf-row-5 lyf-center">{ '阶段' + item.phase_index }</div>
                                        <div className="lyf-row-5 lyf-center">{ PHASE_SCHEMA[item.phase_schema] + " : " + item.phase_time + 's' }</div>
                                    </div>
                                </div>
                            )):(<></>)
                        }
                    </div>
                    <div className={rowClass[1]}>
                        {
                            phase_data[1].length > 0? phase_data[1].map( (item, index) =>(
                                <div key={index} className="flex-item">
                                    <div className="flex-item-content lyf-center">
                                        <img className="phase-img" src={require(`../../assets/images/${this.props.inter_type}/phase-${item.phase_schema}.png`)} alt={ PHASE_SCHEMA[item.phase_schema] }/>
                                    </div>
                                    <div className="flex-item-title lyf-center">
                                        <div className="lyf-row-5 lyf-center">{ '阶段' + item.phase_index }</div>
                                        <div className="lyf-row-5 lyf-center">{ PHASE_SCHEMA[item.phase_schema] + " : " + item.phase_time + 's' }</div>
                                    </div>
                                </div>
                            )):(<></>)
                        }
                    </div>
                    <div className={rowClass[2]}>
                        {
                            phase_data[2].length > 0? phase_data[2].map( (item, index) =>(
                                <div key={index} className="flex-item">
                                    <div className="flex-item-content lyf-center">
                                        <img className="phase-img" src={require(`../../assets/images/phase-${item.phase_schema}.png`)} alt={ PHASE_SCHEMA[item.phase_schema] }/>
                                    </div>
                                    <div className="flex-item-title lyf-center">
                                        <div className="lyf-row-5 lyf-center">{ '相位' + item.phase_index }</div>
                                        <div className="lyf-row-5 lyf-center">{ PHASE_SCHEMA[item.phase_schema] + " : " + item.phase_time + 's' }</div>
                                    </div>
                                </div>
                            )):(<></>)
                        }
                    </div>
                </div>
            </div>
        )
    }
}
