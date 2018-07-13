/*
 * UpdateAuthPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Form, Icon, Input, Button, Alert, notification } from 'antd';
import copy from 'copy-to-clipboard';
import QRCode from 'qrcode.react';
import ecc from 'eosjs-ecc';
import { onLineAddress, getEos } from '../../utils/utils';
import {
  LayoutContentBox,
  LayoutContent,
  FormComp,
} from '../../components/NodeComp';

const FormItem = Form.Item;
const { TextArea } = Input;

export class UpdateAuthPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      GetTransactionButtonLoading: false, // 点击获取报文时，按钮加载状态
      GetTransactionButtonState: false, // 获取报文按钮可点击状态
      CopyTransactionButtonState: false, // 复制报文按钮可点击状态
      QrCodeValue: '欢迎使用EOS佳能离线工具', // 二维码内容
      GetPrivateKeyButtonLoading: false,
      KeyDescription: '',
      GetCheckPrivateKeyButtonLoading: false,
      GetCheckPrivateKeyButtonState: false,
      CheckDescription: '',
    };
  }
  /**
   * 输入框内容变化时，改变按钮状态
   * */
  componentWillReceiveProps(nextProps) {
    this.onValuesChange(nextProps);
  }
  /**
   * 输入框内容变化时，改变按钮状态
   * */
  onValuesChange = nextProps => {
    const values = nextProps.form.getFieldsValue();
    const {
      CheckKeyProvide,
      jsonInfo,
      keyProvider,
      AccountName,
      ActiveKey,
      OwnerKey,
      transaction,
    } = values;
    this.setState({
      GetCheckPrivateKeyButtonState: !CheckKeyProvide,
    });
    this.setState({
      GetTransactionButtonState:
        jsonInfo && keyProvider && AccountName && (ActiveKey || OwnerKey),
    });
    this.setState({
      CopyTransactionButtonState:
        jsonInfo &&
        keyProvider &&
        AccountName &&
        (ActiveKey || OwnerKey) &&
        transaction,
    });
  };
  /**
   * 校验私钥
   * */
  handleCheckPrivateKey = () => {
    this.setState({
      GetCheckPrivateKeyButtonLoading: true,
    });
    const values = this.props.form.getFieldsValue();
    const { CheckPrivateKey } = values;
    const CheckDescription =
      ecc.isValidPrivate(CheckPrivateKey) === true ? (
        <div>
          <p>私钥 Private Key: {CheckPrivateKey}</p>
          <p>公钥 Public Key: {ecc.privateToPublic(CheckPrivateKey)}</p>
        </div>
      ) : (
        <div>
          <p>您的私钥 Private Key: {CheckPrivateKey} 是不合法的私钥</p>
        </div>
      );
    this.setState({
      CheckDescription,
      GetCheckPrivateKeyButtonLoading: false,
    });
  };
  /**
   * 生成公私钥
   * */
  handleCreatePrivateKey = () => {
    this.setState({
      GetPrivateKeyButtonLoading: true,
    });
    ecc.randomKey().then(privateKey => {
      const KeyDescription = (
        <div>
          <p>公钥 Public Key: {ecc.privateToPublic(privateKey)}</p>
          <p>私钥 Private Key: {privateKey}</p>
          <p>如果使用该公私钥，请记下私钥，请不要在网络上传输私钥。</p>
        </div>
      );
      this.setState({
        KeyDescription,
        GetPrivateKeyButtonLoading: false,
      });
    });
  };
  /**
   * 用户点击生成报文，根据用户输入参数，生成签名报文，并将其赋值到文本框和生成对应的二维码
   * */
  handleGetTransaction = () => {
    if (!this.state.GetTransactionButtonState) {
      return;
    }
    this.setState({
      GetTransactionButtonLoading: true,
    });
    const values = this.props.form.getFieldsValue();
    const eos = getEos(values);
    const { AccountName, ActiveKey, OwnerKey } = values;
    const actions = [];
    if (ActiveKey) {
      const UpdateActiveKeyAction = {
        account: 'eosio.token',
        name: 'updateauth',
        authorization: [
          {
            actor: AccountName,
            permission: 'active',
          },
        ],
        data: {
          account: AccountName,
          permission: 'active',
          parent: 'owner',
          auth: ActiveKey,
        },
      };
      actions.push(UpdateActiveKeyAction);
    }
    if (OwnerKey) {
      const UpdateOwnerKeyAction = {
        account: 'eosio.token',
        name: 'updateauth',
        authorization: [
          {
            actor: AccountName,
            permission: 'owner',
          },
        ],
        data: {
          account: AccountName,
          permission: 'owner',
          parent: '',
          auth: OwnerKey,
        },
      };
      actions.push(UpdateOwnerKeyAction);
    }
    eos
      .transaction({
        actions,
      })
      .then(tr => {
        this.props.form.setFieldsValue({
          transaction: JSON.stringify(tr.transaction),
        });
        this.setState({
          GetTransactionButtonLoading: false,
          QrCodeValue: JSON.stringify(tr.transaction),
        });
        this.openTransactionSuccessNotification();
      })
      .catch(err => {
        this.setState({
          GetTransactionButtonLoading: false,
        });
        this.openTransactionFailNotification(err.name);
      });
  };
  /**
   * 提示用户签名成功
   * */
  openTransactionSuccessNotification = () => {
    notification.success({
      message: '生成签名报文成功',
      description: `请点击下面的复制签名报文按钮或者扫描二维码获取签名报文`,
      duration: 3,
    });
  };
  /**
   * 提示用户签名失败
   * */
  openTransactionFailNotification = what => {
    notification.error({
      message: '生成签名报文失败',
      description: `${what}，请重新获取签名报文`,
      duration: 3,
    });
  };
  /**
   * 用户点击复制签名报文，将报文赋值到剪贴板，并提示用户已复制成功
   * */
  handleCopyTransaction = () => {
    if (!this.state.CopyTransactionButtonState) {
      return;
    }
    const values = this.props.form.getFieldsValue();
    const { transaction } = values;
    copy(transaction);
    this.openNotification();
  };
  /**
   * 提示用户已复制成功
   * */
  openNotification = () => {
    notification.success({
      message: '已复制',
      description: `已将签名报文复制到剪贴板，请前往 ${onLineAddress} 联网将报文播报发送`,
      duration: 3,
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const jsonInfoDescription = `请前往 ${onLineAddress} 获取json字段，联网打开网页，即可获得。复制json字段，将其粘贴在免得输入框中即可。`;
    const transactionInfoDescription = `请将下面的签名报文复制后，前往 ${onLineAddress} 联网后进行播报发送。`;
    return (
      <LayoutContent>
        <LayoutContentBox>
          <FormComp>
            <FormItem>
              <Alert
                message="校验私钥"
                description={this.state.CheckDescription}
                type="info"
              />
            </FormItem>
            <FormItem>
              {getFieldDecorator('CheckPrivateKey', {
                rules: [{ required: true, message: '请输入需要校验的私钥!' }],
              })(
                <Input
                  prefix={
                    <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder="请输入需要校验的私钥"
                />,
              )}
            </FormItem>
            <FormItem>
              <Button
                type="primary"
                className="form-button"
                loading={this.state.GetCheckPrivateKeyButtonLoading}
                disabled={!this.state.GetCheckPrivateKeyButtonState}
                onClick={this.handleCheckPrivateKey}
              >
                校验私钥
              </Button>
            </FormItem>
            <FormItem>
              <Alert
                message="生成公私钥"
                description={this.state.KeyDescription}
                type="info"
              />
            </FormItem>
            <FormItem>
              <Button
                type="primary"
                className="form-button"
                loading={this.state.GetPrivateKeyButtonLoading}
                onClick={this.handleCreatePrivateKey}
              >
                生成公私钥
              </Button>
            </FormItem>
            <FormItem>
              <Alert
                message="请输入联网获取的json字段"
                description={jsonInfoDescription}
                type="info"
                closable
              />
            </FormItem>
            <FormItem>
              {getFieldDecorator('jsonInfo', {
                rules: [
                  { required: true, message: '请输入联网获取的json字段!' },
                ],
              })(<TextArea placeholder="请输入联网获取的json字段" />)}
            </FormItem>
            <FormItem>
              <Alert
                message="请输入为生成签名报文所需的字段"
                description="该页面为离线页面，输入的字段不会向外界泄露，请放心输入。"
                type="info"
                closable
              />
            </FormItem>
            <FormItem>
              {getFieldDecorator('keyProvider', {
                rules: [{ required: true, message: '请输入私钥!' }],
              })(
                <Input
                  prefix={
                    <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder="请输入私钥"
                />,
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('AccountName', {
                rules: [{ required: true, message: '请输入私钥对应的账户名!' }],
              })(
                <Input
                  prefix={
                    <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder="请输入私钥对应的账户名"
                />,
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('ActiveKey', {
                rules: [
                  {
                    required: true,
                    message: '请输入您想要的公钥activeKey',
                  },
                ],
              })(
                <Input
                  prefix={
                    <Icon type="unlock" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder="请输入您想要的公钥activeKey"
                />,
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('OwnerKey', {
                rules: [
                  {
                    required: false,
                    message: '请输入您想要的公钥ownerKey',
                  },
                ],
              })(
                <Input
                  prefix={
                    <Icon type="unlock" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder="请输入您想要的公钥ownerKey"
                />,
              )}
            </FormItem>
            <FormItem>
              <Button
                type="primary"
                className="form-button"
                onClick={this.handleGetTransaction}
                loading={this.state.GetTransactionButtonLoading}
                disabled={!this.state.GetTransactionButtonState}
              >
                生成签名报文
              </Button>
            </FormItem>
            <FormItem>
              <Alert
                message="复制签名报文/扫描二维码"
                description={transactionInfoDescription}
                type="info"
                closable
              />
            </FormItem>
            <FormItem>
              {getFieldDecorator('transaction', {
                rules: [{ required: true, message: '请复制生成的签名报文!' }],
              })(
                <TextArea disabled="true" placeholder="请复制生成的签名报文" />,
              )}
            </FormItem>
            <FormItem>
              <div style={{ textAlign: 'center' }}>
                <QRCode value={this.state.QrCodeValue} size={256} />
              </div>
            </FormItem>
            <FormItem>
              <Button
                type="primary"
                className="form-button"
                disabled={!this.state.CopyTransactionButtonState}
                onClick={this.handleCopyTransaction}
              >
                复制签名报文
              </Button>
            </FormItem>
          </FormComp>
        </LayoutContentBox>
      </LayoutContent>
    );
  }
}

UpdateAuthPage.propTypes = {
  form: PropTypes.object,
};

const UpdateAuthPageForm = Form.create()(UpdateAuthPage);

export default UpdateAuthPageForm;
