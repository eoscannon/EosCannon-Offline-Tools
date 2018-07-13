/*
 * CreateAccountPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Form, Icon, Input, Button, Alert, notification } from 'antd';
import copy from 'copy-to-clipboard';
import QRCode from 'qrcode.react';
import { onLineAddress, getEos } from '../../utils/utils';
import {
  LayoutContentBox,
  LayoutContent,
  FormComp,
} from '../../components/NodeComp';

const FormItem = Form.Item;
const { TextArea } = Input;

export class CreateAccountPage extends React.Component {
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
      AccountName,
      NewAccountName,
      ActiveKey,
      OwnerKey,
      Bytes,
      StakeNetQuantity,
      StakeCpuQuantity,
      transaction,
    } = values;
    this.setState({
      GetTransactionButtonState:
        jsonInfo &&
        keyProvider &&
        AccountName &&
        NewAccountName &&
        ActiveKey &&
        OwnerKey &&
        Bytes &&
        StakeNetQuantity &&
        StakeCpuQuantity,
    });
    this.setState({
      CopyTransactionButtonState:
        jsonInfo &&
        keyProvider &&
        AccountName &&
        NewAccountName &&
        ActiveKey &&
        OwnerKey &&
        Bytes &&
        StakeNetQuantity &&
        StakeCpuQuantity &&
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
      AccountName,
      NewAccountName,
      ActiveKey,
      OwnerKey,
      Bytes,
      StakeNetQuantity,
      StakeCpuQuantity,
    } = values;
    const actions = [];
    const NewAccountAction = {
      account: 'eosio',
      name: 'newaccount',
      authorization: [
        {
          actor: AccountName,
          permission: 'active',
        },
      ],
      data: {
        creator: AccountName,
        name: NewAccountName,
        owner: OwnerKey,
        active: ActiveKey,
      },
    };
    actions.push(NewAccountAction);
    const BuyRamBytesAction = {
      account: 'eosio',
      name: 'buyrambytes',
      authorization: [
        {
          actor: AccountName,
          permission: 'active',
        },
      ],
      data: {
        payer: AccountName,
        receiver: NewAccountName,
        bytes: Number(Bytes),
      },
    };
    actions.push(BuyRamBytesAction);
    const DelegateBwAction = {
      account: 'eosio',
      name: 'delegatebw',
      authorization: [
        {
          actor: AccountName,
          permission: 'active',
        },
      ],
      data: {
        from: AccountName,
        receiver: NewAccountName,
        stake_net_quantity: `${Number(StakeNetQuantity)
          .toFixed(4)
          .toString()} EOS`,
        stake_cpu_quantity: `${Number(StakeCpuQuantity)
          .toFixed(4)
          .toString()} EOS`,
        transfer: 0,
      },
    };
    actions.push(DelegateBwAction);
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
    const jsonInfoDescription = `请前往 ${onLineAddress} 获取json字段，联网打开网页，即可获得。复制json字段，将其粘贴在下面的输入框中即可。`;
    const transactionInfoDescription = `请将下面的签名报文复制后，前往 ${onLineAddress} 联网后进行播报发送。`;
    return (
      <LayoutContent>
        <LayoutContentBox>
          <FormComp>
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
              {getFieldDecorator('NewAccountName', {
                rules: [
                  {
                    required: true,
                    len: 12,
                    message: '请输入想要创建的账户名，账户名应为12个字母长度',
                  },
                ],
              })(
                <Input
                  prefix={
                    <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder="请输入想要创建的账户名，账户名应为12个字母长度"
                />,
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('ActiveKey', {
                rules: [
                  {
                    required: true,
                    message: '请输入新账号的公钥activeKey',
                  },
                ],
              })(
                <Input
                  prefix={
                    <Icon type="unlock" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder="请输入新账号的公钥activeKey"
                />,
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('OwnerKey', {
                rules: [
                  {
                    required: false,
                    message: '请输入新账号的公钥ownerKey',
                  },
                ],
              })(
                <Input
                  prefix={
                    <Icon type="unlock" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder="请输入新账号的公钥ownerKey"
                />,
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('Bytes', {
                rules: [
                  {
                    required: false,
                    message: '请输入为新账号所购买的内存Bytes数量',
                  },
                ],
              })(
                <Input
                  prefix={
                    <Icon
                      type="pay-circle-o"
                      style={{ color: 'rgba(0,0,0,.25)' }}
                    />
                  }
                  placeholder="请输入为新账号所购买的内存Bytes数量"
                />,
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('StakeNetQuantity', {
                rules: [
                  {
                    required: false,
                    message: '请输入为新账号所质押的Net数量',
                  },
                ],
              })(
                <Input
                  prefix={
                    <Icon
                      type="pay-circle-o"
                      style={{ color: 'rgba(0,0,0,.25)' }}
                    />
                  }
                  placeholder="请输入为新账号所质押的Net数量"
                />,
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('StakeCpuQuantity', {
                rules: [
                  {
                    required: false,
                    message: '请输入为新账号所质押的Cpu数量',
                  },
                ],
              })(
                <Input
                  prefix={
                    <Icon
                      type="pay-circle-o"
                      style={{ color: 'rgba(0,0,0,.25)' }}
                    />
                  }
                  placeholder="请输入为新账号所质押的Cpu数量"
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

CreateAccountPage.propTypes = {
  form: PropTypes.object,
};

const CreateAccountPageForm = Form.create()(CreateAccountPage);

export default CreateAccountPageForm;
