/*
 * StakePage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Form, Icon, Input, Button, Alert, Switch, notification } from 'antd';
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

export class StakePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDelegatebw: true, // true：质押；false：解质押
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
   * 用户选择质押/解质押
   * */
  onSwitchChange = checked => {
    this.setState({
      isDelegatebw: checked,
    });
  };
  /**
   * 输入框内容变化时，改变按钮状态
   * */
  onValuesChange = nextProps => {
    const values = nextProps.form.getFieldsValue();
    const {
      jsonInfo,
      keyProvider,
      FromAccountName,
      stakeNetQuantity,
      stakeCpuQuantity,
      transaction,
    } = values;
    this.setState({
      GetTransactionButtonState:
        jsonInfo &&
        keyProvider &&
        FromAccountName &&
        stakeNetQuantity &&
        stakeCpuQuantity,
    });
    this.setState({
      CopyTransactionButtonState:
        jsonInfo &&
        keyProvider &&
        FromAccountName &&
        stakeNetQuantity &&
        stakeCpuQuantity &&
        transaction,
    });
  };
  /**
   * 用户点击生成报文，根据用户输入参数、选择的质押/解质押，生成签名报文，并将其赋值到文本框和生成对应的二维码
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
      ReceiverAccountName,
      stakeNetQuantity,
      stakeCpuQuantity,
    } = values;
    if (this.state.isDelegatebw) {
      eos
        .delegatebw({
          from: FromAccountName,
          receiver: ReceiverAccountName || FromAccountName,
          stake_net_quantity: `${Number(stakeNetQuantity).toFixed(4)} EOS`,
          stake_cpu_quantity: `${Number(stakeCpuQuantity).toFixed(4)} EOS`,
          transfer: 0,
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
          this.openTransactionFailNotification(err.error.what);
        });
    } else {
      eos
        .undelegatebw({
          from: FromAccountName,
          receiver: ReceiverAccountName,
          unstake_net_quantity: `${Number(stakeNetQuantity).toFixed(4)} EOS`,
          unstake_cpu_quantity: `${Number(stakeCpuQuantity).toFixed(4)} EOS`,
        })
        .then(tr => {
          this.props.form.setFieldsValue({
            transaction: JSON.stringify(tr.transaction),
          });
          this.setState({
            GetTransactionButtonLoading: false,
          });
          this.openTransactionSuccessNotification();
        })
        .catch(err => {
          this.setState({
            GetTransactionButtonLoading: false,
          });
          this.openTransactionFailNotification(err.error.what);
        });
    }
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
    const FromAccountNamePlaceholder = this.state.isDelegatebw
      ? '请输入用于质押的账户名'
      : '请输入用于解质押的账户名';
    const ReceiverAccountNamePlaceholder = this.state.isDelegatebw
      ? '请输入接受质押的账户名，不填，则默认使用用于质押的账户名'
      : '请输入接受解质押的账户名，不填，则默认使用用于解质押的账户名';
    const StakeNetQuantityPlaceholder = this.state.isDelegatebw
      ? '请输入质押的Net数量'
      : '请输入解质押的Net数量';
    const StakeCpuQuantityPlaceholder = this.state.isDelegatebw
      ? '请输入质押的Cpu数量'
      : '请输入解质押的Cpu数量';
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
              <Switch
                checkedChildren="质押"
                unCheckedChildren="解质押"
                defaultChecked={this.state.isDelegatebw}
                onChange={this.onSwitchChange}
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
                rules: [
                  { required: true, message: FromAccountNamePlaceholder },
                ],
              })(
                <Input
                  prefix={
                    <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder={FromAccountNamePlaceholder}
                />,
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('ReceiverAccountName', {
                rules: [
                  {
                    required: true,
                    message: ReceiverAccountNamePlaceholder,
                  },
                ],
              })(
                <Input
                  prefix={
                    <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder={ReceiverAccountNamePlaceholder}
                />,
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('stakeNetQuantity', {
                rules: [
                  {
                    required: true,
                    message: StakeNetQuantityPlaceholder,
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
                  placeholder={StakeNetQuantityPlaceholder}
                />,
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('stakeCpuQuantity', {
                rules: [
                  {
                    required: true,
                    message: StakeCpuQuantityPlaceholder,
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
                  placeholder={StakeCpuQuantityPlaceholder}
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

StakePage.propTypes = {
  form: PropTypes.object,
};

const StakePageForm = Form.create()(StakePage);

export default StakePageForm;
