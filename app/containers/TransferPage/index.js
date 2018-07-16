/*
 * TransferPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Form, Icon, Input, Select, Button, Alert, notification } from 'antd';
import copy from 'copy-to-clipboard';
import QRCode from 'qrcode.react';
import eosioAbi from './abi';
import eosIqAbi from './iqAbi';
import {
  onLineAddress,
  transactionInfoDescription,
  getEos,
} from '../../utils/utils';
import {
  LayoutContentBox,
  LayoutContent,
  FormComp,
} from '../../components/NodeComp';
import ScanQrcode from '../../components/ScanQrcode';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

export class TransferPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      GetTransactionButtonLoading: false, // 点击获取报文时，按钮加载状态
      GetTransactionButtonState: false, // 获取报文按钮可点击状态
      CopyTransactionButtonState: false, // 复制报文按钮可点击状态
      QrCodeValue: '欢迎使用EOS佳能离线工具', // 二维码内容
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
      jsonInfo,
      keyProvider,
      FromAccountName,
      ToAccountName,
      transferContract,
      transferPrecision,
      transferQuantity,
      transferDigit,
      transferSymbol,
      transaction,
    } = values;
    this.setState({
      GetTransactionButtonState:
        jsonInfo &&
        keyProvider &&
        FromAccountName &&
        ToAccountName &&
        transferContract &&
        transferPrecision &&
        transferQuantity &&
        transferDigit &&
        transferSymbol,
    });
    this.setState({
      CopyTransactionButtonState:
        jsonInfo &&
        keyProvider &&
        FromAccountName &&
        ToAccountName &&
        transferContract &&
        transferPrecision &&
        transferQuantity &&
        transferDigit &&
        transferSymbol &&
        transaction,
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
    const {
      FromAccountName,
      ToAccountName,
      transferContract,
      transferPrecision,
      transferQuantity,
      transferDigit,
      transferMemo,
      transferSymbol,
    } = values;
    if (transferContract !== 'eosio' && transferContract !== 'eosio.token') {
      if (transferContract.toUpperCase() === 'EVERIPEDIAIQ') {
        eos.fc.abiCache.abi(transferContract, eosIqAbi);
      } else {
        eos.fc.abiCache.abi(transferContract, eosioAbi);
      }
    }
    eos
      .transaction({
        actions: [
          {
            account: transferContract,
            name: 'transfer',
            authorization: [
              {
                actor: FromAccountName,
                permission: 'active',
              },
            ],
            data: {
              from: FromAccountName,
              to: ToAccountName,
              quantity: `${Number(transferQuantity).toFixed(
                Number(transferDigit),
              )} ${transferSymbol.toUpperCase()}`,
              memo: transferMemo || '',
            },
          },
        ],
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
    return (
      <LayoutContent>
        <LayoutContentBox>
          <FormComp>
            <ScanQrcode form={this.props.form} />
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
              {getFieldDecorator('FromAccountName', {
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
              {getFieldDecorator('ToAccountName', {
                rules: [{ required: true, message: '请输入将要转入的账户名!' }],
              })(
                <Input
                  prefix={
                    <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder="请输入将要转入的账户名"
                />,
              )}
            </FormItem>
            <FormItem help="">
              {getFieldDecorator('transferContract', {
                initialValue: 'eosio.token',
                rules: [{ required: false, message: '请输入Contract!' }],
              })(
                <Input
                  prefix={
                    <Icon
                      type="pay-circle-o"
                      style={{ color: 'rgba(0,0,0,.25)' }}
                    />
                  }
                  placeholder="请输入Contract!"
                />,
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('transferPrecision', {
                initialValue: '4',
                rules: [{ required: true, message: '请输入代币精度!' }],
              })(
                <Input
                  prefix={
                    <Icon
                      type="pay-circle-o"
                      style={{ color: 'rgba(0,0,0,.25)' }}
                    />
                  }
                  placeholder="请输入代币精度"
                />,
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('transferQuantity', {
                rules: [{ required: true, message: '请输入转账的数量!' }],
              })(
                <Input
                  prefix={
                    <Icon
                      type="pay-circle-o"
                      style={{ color: 'rgba(0,0,0,.25)' }}
                    />
                  }
                  placeholder="请输入转账的数量"
                />,
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('transferDigit', {
                rules: [
                  {
                    required: true,
                    message: '请输入币的小数保留位数！',
                  },
                ],
                initialValue: '4',
              })(
                <Select
                  style={{ width: '100%' }}
                  placeholder="请输入币的小数保留位数！"
                >
                  <Option key="4" value="4">
                    4位小数
                  </Option>
                  <Option key="3" value="3">
                    3位小数
                  </Option>
                </Select>,
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('transferSymbol', {
                initialValue: 'EOS',
                rules: [{ required: false, message: '请输入Symbol!' }],
              })(
                <Input
                  prefix={
                    <Icon
                      type="pay-circle-o"
                      style={{ color: 'rgba(0,0,0,.25)' }}
                    />
                  }
                  placeholder="请输入Symbol!"
                />,
              )}
            </FormItem>
            <FormItem help="注：交易所转账必填">
              {getFieldDecorator('transferMemo', {
                rules: [
                  { required: false, message: '请输入Memo，交易所转账必填!' },
                ],
              })(
                <Input
                  prefix={
                    <Icon
                      type="pay-circle-o"
                      style={{ color: 'rgba(0,0,0,.25)' }}
                    />
                  }
                  placeholder="请输入Memo，交易所转账必填!"
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

TransferPage.propTypes = {
  form: PropTypes.object,
};

const TransferPageForm = Form.create()(TransferPage);

export default TransferPageForm;
