import React, { Component } from 'react'
import { Form, Input, Button, Select, Tabs, TreeSelect, Radio, Modal, Icon, message, Table } from 'antd'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import LyfItem from '../../components/item/item'
import LinkButton from '../../components/link-button'
import { TMS, MAP_CENTER } from '../../utils/baoshan'
import memoryUtils from '../../utils/memoryUtils'
import { getNowDateTimeString } from '../../utils/dateUtils'
import { reqInsertAccident } from '../../api'
import { connect } from 'react-redux'

const Item = Form.Item
const Option = Select.Option
const { TreeNode } = TreeSelect
const { TabPane } = Tabs


export default class AccidentsEliminate extends Component {

    state = {}

    initMap = () => {
        if(!this.map){
            this.map = L.map('map', {
                center: MAP_CENTER,
                zoom: 14,
                zoomControl: false,
                attributionControl: false,
            })
            L.tileLayer(TMS, { maxZoom: 16 }).addTo(this.map)
            this.map._onResize()
        }
    }

    componentDidMount() {
        this.initMap()
    }
    
    render() {

        return (
            <div className="lyf-card">
                <div className="lyf-card-title">
                    <LinkButton onClick={ () => this.props.history.goBack() }>
                        <Icon type="arrow-left"></Icon>
                    </LinkButton>
                    &nbsp;&nbsp;
                    <span>事故分析</span>
                </div>
                <div className="lyf-card-content">
                    <div className="lyf-col-5">
                        <div className="lyf-row-5" id="map">
                        </div>
                        <div className="lyf-row-5">
                            <Table

                            />
                        </div>
                    </div>
                    <div className="lyf-col-5">
                        <div className="lyf-row-5">
                            <div className="lyf-row-1 lyf-center lyf-font-4">事故原因</div>
                        </div>
                        <div className="lyf-row-5">
                            <div className="lyf-row-1 lyf-center lyf-font-4">防控策略</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
    
