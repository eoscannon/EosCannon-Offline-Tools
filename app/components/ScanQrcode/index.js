/*
 * ScanQrcode
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Input, Alert } from 'antd';
import { BrowserQRCodeReader } from '../../utils/zxing.qrcodereader.min';
import { jsonInfoDescription } from '../../utils/utils';

const FormItem = Form.Item;
const { TextArea } = Input;

export default class ScanQrcode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      VideoElement: null,
      ScanQrcodeButtonDisable: true,
    };
  }
  /**
   * 根据URL地址，重新设置默认菜单选项
   * */
  handleOpenCamera = () => {
    this.setState({
      VideoElement: (
        <FormItem>
          <video id="video" width="500" height="200">
            <track kind="captions" />
          </video>
        </FormItem>
      ),
      ScanQrcodeButtonDisable: false,
    });
    this.handleScanQrcode();
  };

  handleScanQrcode = () => {
    const codeReader = new BrowserQRCodeReader();
    codeReader.getVideoInputDevices().then(videoInputDevices => {
      codeReader
        .decodeFromInputVideoDevice(videoInputDevices[0].deviceId, 'video')
        .then(result => {
          this.props.form.setFieldsValue({
            jsonInfo: result.text,
          });
        });
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <FormItem>
          <Alert
            message="请输入联网获取的json字段"
            description={jsonInfoDescription}
            type="info"
            closable
          />
        </FormItem>
        {this.state.VideoElement}
        <FormItem style={{ textAlign: 'center' }}>
          <Button
            type="primary"
            className="form-button"
            style={{ display: 'inline', marginRight: 5 }}
            onClick={this.handleOpenCamera}
          >
            打开摄像头
          </Button>
          <Button
            type="primary"
            className="form-button"
            style={{ display: 'inline', marginLeft: 5 }}
            onClick={this.handleScanQrcode}
            disabled={this.state.ScanQrcodeButtonDisable}
          >
            扫描二维码
          </Button>
        </FormItem>
        <FormItem>
          {getFieldDecorator('jsonInfo', {
            rules: [{ required: true, message: '请输入联网获取的json字段!' }],
          })(<TextArea placeholder="请输入联网获取的json字段" />)}
        </FormItem>
      </div>
    );
  }
}

ScanQrcode.propTypes = {
  form: PropTypes.object,
};
