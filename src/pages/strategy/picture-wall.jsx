import React, { Component } from 'react'
import { Upload, Modal, Icon, message } from 'antd'
import PropTypes from 'prop-types'
import { IMG_THRESHOLD, BASE_IMG } from '../../utils/ConstantUtils'
import { reqDeleteImage } from '../../api';

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

export default class PictureWall extends Component {

    static propTypes = {
        images: PropTypes.string
    }

    state = {
        previewVisible: false,      // 是否显示大图预览 ( 用 modal 显示 )
        previewImage: '',           // 大图的 url 或者 base64 编码
        fileList: [
            //   文件信息对象
            // uid      唯一标识
            // name     文件名
            // status   状态有: uploading   done    error    removed
            // url      图片 url
            
        ],
    };
    
    // 获取所有已上传图片文件名的数组       父组件需要调用这个方法！！！
    getImages = () => this.state.fileList.map( file => file.name )

    handleCancel = () => this.setState({ previewVisible: false });

    // 大图预览的回调函数
    handlePreview = async file => {
        if (!file.url && !file.preview) {       // 如果没有 url ， 进行一次 base64 处理来显示图片
            file.preview = await getBase64(file.originFileObj)
        }

        this.setState({
            previewImage: file.url || file.preview,     // 设置 url 或者 base64 
            previewVisible: true,
        });
    };

    // file 状态发生改变的监听回调
    // file 当前操作(上传/删除)的file
    handleChange = async ({ fileList, file  }) => {
        // file 对象 和 fileList 数组对象中的最后一张图片是同一张图片，但不是同一个对象（一个图片的两个对象）
        // console.log(file === fileList[fileList.length - 1]);
        if(file.status === "done"){     // 完成
            // 将数组中最后一个 file 保存到 file 变量
            file = fileList[fileList.length - 1]
            const res = file.response
            if(res.code === 1){
                // 取出响应数据中的文件名和 url 
                const { image_name, image_url } = res.data
                file.name = image_name
                file.url = image_url
            }
        } else if ( file.status === "removed" ){
            const result = await reqDeleteImage( file.name )
            
            if( result.code === 1 ){
                message.success(" 删除图片成功！ ")
            } else {
                message.error( "删除图片失败！" )
            }
        }
        this.setState({ fileList })     // 更新状态
    }

    componentWillMount() {
        const images = this.props.images
        const imgs = images?images.split(";"):''
        if( imgs && imgs !== '' ){
            const fileList = imgs.map( (img, index) => ({
                uid: -index,
                name: img,
                status: 'done',
                url: BASE_IMG + img
            }) )
            this.setState( { fileList } )
        }
    }

    render() {
        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
            <div>
            <Icon type = "plus"/>
            <div className="ant-upload-text">Upload</div>
            </div>
        );
        return (
            <div className="clearfix">
                <Upload
                    action = "http://192.122.2.196:3005/upload/image"              // 上传 url
                    name = "image"                  // 图片文件 的参数名
                    listType="picture-card"              // 显示风格   picture    picture-card
                    fileList={fileList}             // 文件信息对象的数组
                    onPreview={this.handlePreview}  // 点击页面中图片的小图标时调用该函数
                    onChange={this.handleChange}
                >
                    {
                        fileList.length >= IMG_THRESHOLD ? null : uploadButton
                    }
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        );
    }
}
