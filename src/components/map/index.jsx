import React, { Component } from 'react'
import L from 'leaflet'
import '../../utils/leaflet/LeafletLegend'
import PropTypes from 'prop-types'
import { LINK_INFO, LINK_COLOR, INTER_INFO, TMS, MAP_CENTER, FIX_TMS } from '../../utils/baoshan'
import { bd09togcj02 } from '../../utils/lnglatUtils'

export default class LvqiMap extends Component {

    static props = {
        data : PropTypes.array.isRequired,
    }
    
    state = {
        firstRender: true,
        firstInit: true,
    }

    initLink = () => {
        this.link = []
        for(let i = 0; i < LINK_INFO.length; i++){
            let line
            line = L.polyline(LINK_INFO[i], {color: 'grey'})
            this.link.push(line)
        }
        L.layerGroup(this.link).addTo(this.map)
        // 添加图例
        L.control.linkLegend({position: 'topright'}).addTo(this.map)

        /*
        // 自定义label
        let Icon1 = L.divIcon({
            html: "<div style='color:#f00;transform:rotate(20deg)'>狗子</div>",
            className: 'my-div-icon',
            iconSize:30
        });
        L.marker(MAP_CENTER, { icon: Icon1 }).addTo(this.map);
        */
        
    }

    initInter = () => {
        this.inter = []
        for(let i = 0; i < INTER_INFO.length; i++){
            let lng = bd09togcj02(INTER_INFO[i][2], INTER_INFO[i][3])[0]
            let lat = bd09togcj02(INTER_INFO[i][2], INTER_INFO[i][3])[1]
            this.inter.push( L.circle([lat, lng], {color: 'grey', fillOpacity: 1, radius: 30}) )
        }
        L.layerGroup(this.inter).addTo(this.map)
    }

    setLink = (link_state) => {
        link_state.forEach( (e, i) => {
            this.link[i]?this.link[i].setStyle({ color: LINK_COLOR[parseInt(e.stateindex / 2)] }):console.log()
        })
    }

    setInter = (inter_state) => {

        inter_state.forEach( (e, i) => {
            if( e.avg_delay > 120 ){
                this.inter[i].setStyle({ color: LINK_COLOR[4] })
            }else if( e.avg_delay > 90 ){
                this.inter[i].setStyle({ color: LINK_COLOR[3] })
            }else if( e.avg_delay > 60 ){
                this.inter[i].setStyle({ color: LINK_COLOR[2] })
            }else if( e.avg_delay > 30 ){
                this.inter[i].setStyle({ color: LINK_COLOR[1] })
            }else{
                this.inter[i].setStyle({ color: LINK_COLOR[0] })
            }
        })
    }

    initMap = async() => {
        let { firstRender } = this.state

        if( firstRender ){
            this.setState({ firstRender: false })
            this.map = L.map('map', {
                center: MAP_CENTER, 
                zoom: 12, 
                zoomControl: false, 
                attributionControl: false, 
            })
            L.tileLayer(TMS, { maxZoom: 16, minZoom: 9 }).addTo(this.map)
        }
        this.map._onResize()
    }

    componentWillReceiveProps = (nextProps) => {
        let { data } = nextProps

        if(this.state.firstInit){
            this.initMap()
            if(this.props.dataType === "link"){
                this.initLink()
            }else if(this.props.dataType === "inter"){
                this.initInter()
            }
            this.setState({ firstInit: false })
        }

        if(this.props.dataType === "link"){
            this.setLink(data)
        }else if(this.props.dataType === "inter"){
            this.setInter(data)
        }
    }
    
    render() {
        return (
            <div className="full" id="map">
            </div>
        )
    }
}
