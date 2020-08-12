import React, { Component } from 'react'
import './home.less'
import { Icon, notification, Popconfirm } from 'antd'

export default class Home extends Component {


    state = {
        pop: false,
    }

    render() {
        return (
            <div className="home">
                <div className="lvqi-col-3">
                    <div className = "lvqi-card">
                        <div className = "lvqi-card-content">
                            {/* <img src={require("./images/home_img1.png")} alt="产品特点1" /> */}
                            <Icon type="table"/>
                        </div>
                        <div className = "lvqi-card-title">
                            <h1>交通态势感知</h1>
                            <p>实时感知路网宏观、微观运行状况，监控设备运行质量，分析主题车辆运行特征。</p>
                        </div>
                    </div>
                </div>
                <div className="lvqi-col-3">
                    <div className = "lvqi-card">
                        <div className = "lvqi-card-content">
                            <Icon type="car"/>
                            {/* <img src={require("./images/home_img2.png")} alt="产品特点2" /> */}
                        </div>
                        <div className = "lvqi-card-title">
                            <h1>信号辅助优化</h1>
                            <p>结合路口渠化和视频结构化数据统计交通流量, 优化、评价<b> 单点、干线、区域 </b>配时优化方案。</p>
                        </div>
                    </div>
                </div>
                <div className="lvqi-col-3">
                    <div className = "lvqi-card">
                        <div className = "lvqi-card-content">
                            <Icon type="area-chart"/>
                            {/* <img src={require("./images/home_img3.png")} alt="产品特点3" /> */}
                        </div>
                        <div className = "lvqi-card-title">
                            <h1>安全隐患防控</h1>
                            <p>录入事故信息，阶段性分析事故隐患点，构建防控策略库，为隐患点推荐防控策略。</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
