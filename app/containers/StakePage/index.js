/*
 * StakePage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Form, Icon, Input, Button, Alert, Switch, notification } from 'antd';
import EOS from 'eosjs';
import copy from 'copy-to-clipboard';
import { chainId, onLineAddress } from '../../utils/config';
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
      isDelegatebw: true,
      GetTransactionButtonLoading: false,
      GetTransactionButtonState: false,
      CopyTransactionButtonState: false,
    };
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    this.onValuesChange(nextProps);
  }

  onSwitchChange = checked => {
    this.setState({
      isDelegatebw: checked,
    });
  };

  onValuesChange = nextProps => {
    const values = nextProps.form.getFieldsValue();
    const {
      jsonInfo,
      keyProvider,
      accountName,
      stakeNetQuantity,
      stakeCpuQuantity,
      transaction,
    } = values;
    this.setState({
      GetTransactionButtonState:
        jsonInfo &&
        keyProvider &&
        accountName &&
        stakeNetQuantity &&
        stakeCpuQuantity,
    });
    this.setState({
      CopyTransactionButtonState:
        jsonInfo &&
        keyProvider &&
        accountName &&
        stakeNetQuantity &&
        stakeCpuQuantity &&
        transaction,
    });
  };

  getEos = () => {
    const values = this.props.form.getFieldsValue();
    const { keyProvider, jsonInfo } = values;
    const newJsonInfo = jsonInfo
      .replace('ref_block_num', 'refBlockNum')
      .replace('ref_block_prefix', 'refBlockPrefix');
    const { refBlockNum, refBlockPrefix, expiration } = JSON.parse(newJsonInfo);
    const transactionHeaders = {
      expiration,
      ref_block_num: refBlockNum,
      ref_block_prefix: refBlockPrefix,
    };
    const eos = EOS({
      httpEndpoint: null,
      chainId,
      keyProvider,
      transactionHeaders,
    });
    return eos;
  };

  handleGetTransaction = () => {
    if (!this.state.GetTransactionButtonState) {
      return;
    }
    this.setState({
      GetTransactionButtonLoading: true,
    });
    const eos = this.getEos();
    const values = this.props.form.getFieldsValue();
    const { accountName, stakeNetQuantity, stakeCpuQuantity } = values;
    if (this.state.isDelegatebw) {
      eos
        .delegatebw({
          from: accountName,
          receiver: accountName,
          stake_net_quantity: `${stakeNetQuantity} SYS`,
          stake_cpu_quantity: `${stakeCpuQuantity} SYS`,
          transfer: 0,
        })
        .then(tr => {
          this.props.form.setFieldsValue({
            transaction: JSON.stringify(tr.transaction),
          });
          this.setState({
            GetTransactionButtonLoading: false,
          });
        });
    } else {
      eos
        .undelegatebw({
          from: accountName,
          receiver: accountName,
          unstake_net_quantity: `${stakeNetQuantity} SYS`,
          unstake_cpu_quantity: `${stakeCpuQuantity} SYS`,
        })
        .then(tr => {
          this.props.form.setFieldsValue({
            transaction: JSON.stringify(tr.transaction),
          });
          this.setState({
            GetTransactionButtonLoading: false,
          });
        });
    }
  };

  handleCopyTransaction = () => {
    if (!this.state.CopyTransactionButtonState) {
      return;
    }
    const values = this.props.form.getFieldsValue();
    const { transaction } = values;
    copy(transaction);
    this.openNotification();
  };

  openNotification = () => {
    notification.open({
      message: '已复制',
      description: `已将签名报文复制到剪贴板，请前往 ${onLineAddress} 联网将报文播报发送`,
      duration: null,
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
              {getFieldDecorator('accountName', {
                rules: [{ required: true, message: '请输入账户名!' }],
              })(
                <Input
                  prefix={
                    <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder="请输入账户名"
                />,
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('stakeNetQuantity', {
                rules: [{ required: true, message: '请输入质押的Net数量!' }],
              })(
                <Input
                  prefix={
                    <Icon
                      type="pay-circle-o"
                      style={{ color: 'rgba(0,0,0,.25)' }}
                    />
                  }
                  placeholder="请输入质押的Net数量"
                />,
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('stakeCpuQuantity', {
                rules: [{ required: true, message: '请输入质押的Cpu数量!' }],
              })(
                <Input
                  prefix={
                    <Icon
                      type="pay-circle-o"
                      style={{ color: 'rgba(0,0,0,.25)' }}
                    />
                  }
                  placeholder="请输入质押的Cpu数量"
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
                message="复制签名报文"
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
