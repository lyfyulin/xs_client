import React, { Component } from 'react'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import _ from 'lodash'
import PropTypes from 'prop-types'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'


export default class RichTextEditor extends Component {

    static propTypes = {
        detail: PropTypes.string
    }

    state = {
        editorState: EditorState.createEmpty(),
    }

    // 防抖 包装
    onEditorStateChange = _.debounce( (editorState) => {
        this.setState({
            editorState,
        })
    }, 100 )

    getDetail = () => {
        const { editorState } = this.state
        return draftToHtml(convertToRaw(editorState.getCurrentContent()))
    }


    uploadImageCallBack = (file) => {
        return new Promise(
            (resolve, reject) => {        // 执行器，执行异步任务。
                const xhr = new XMLHttpRequest()
                xhr.open('POST', '/upload/image')
                xhr.setRequestHeader('Authorization', 'Client-ID XXXXX')
                const data = new FormData()
                data.append('image', file)
                xhr.send(data)
                xhr.addEventListener('load', () => {
                    const response = JSON.parse(xhr.responseText)           // 调整返回数据结构，传入
                    resolve({data: { link: response.data.image_url } })
                })
                xhr.addEventListener('error', () => {
                    const error = JSON.parse(xhr.responseText)
                    reject(error)
                })
            }
        )
    }

    componentWillMount() {
        const detail = this.props.detail
        if( detail ){
            const contentBlock = htmlToDraft( detail )
            // if (contentBlock) {
                const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
                const editorState = EditorState.createWithContent(contentState)
                this.setState( {
                    editorState
                })
            // }
        }
    }


    render() {
        const { editorState } = this.state;
        return (
            <div>
            <Editor
                editorState={editorState}
                editorStyle = {{ height: 150, border: '1px solid black', paddingLeft: 10 }}
                onEditorStateChange={this.onEditorStateChange}
                toolbar={{
                    image: { uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: true } },
                }}
            />
            {
                /* <textarea
                disabled
                value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
            /> */
            }
            </div>
        );
    }
}