/*
 * AirgrabPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Form, Icon, Input, Button, Alert, Table, notification } from 'antd';
import EOS from 'eosjs';
import copy from 'copy-to-clipboard';
import QRCode from 'qrcode.react';
import { chainId, onLineAddress } from '../../utils/config';
import {
  LayoutContentBox,
  LayoutContent,
  FormComp,
} from '../../components/NodeComp';
import arigrabs from './airgrabs.json';
import poormantoken from './poormantoken.json';
import ridlridlcoin from './ridlridlcoin.json';
import trybenetwork from './trybenetwork.json';
import wizznetwork1 from './wizznetwork1.json';
import eosatidiumio from './eosatidiumio.json';
import defaultAbi from '../TransferPage/abi';
const FormItem = Form.Item;
const { TextArea } = Input;

export class AirgrabPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      GetTransactionButtonState: false, // 获取报文按钮可点击状态
      CopyTransactionButtonState: false, // 复制报文按钮可点击状态
      QrCodeValue: '欢迎使用EOS佳能离线工具', // 二维码内容
      tableData: [],
      tableColumns: [],
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
    const { jsonInfo, AccountName, transaction } = values;
    this.setState({
      GetTransactionButtonState: !!jsonInfo && !!AccountName,
    });
    this.setState({
      CopyTransactionButtonState: !!jsonInfo && !!AccountName && !!transaction,
    });
  };
  componentWillMount() {
    this.setState({
      tableData: arigrabs || [],
      tableColumns: [
        {
          title: 'symbol',
          dataIndex: 'symbol',
          key: 'symbol',
          align: 'center',
          width: '60%',
          render: (text, record) => (
            <a href={record.url} target="_blank">
              {text}
            </a>
          ),
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          render: (text, record) => (
            <span>
              <Button
                disabled={!this.state.GetTransactionButtonState}
                type="primary"
                size="small"
                onClick={() => this.handleGetTransaction(record)}
              >
                领取空投
              </Button>
            </span>
          ),
        },
      ],
    });
  }
  /**
   * 根据用户输入的报头：jsonInfo生成eos
   * */
  getEos = () => {
    const values = this.props.form.getFieldsValue();
    const { jsonInfo } = values;
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
      transactionHeaders,
    });
    return eos;
  };
  /**
   * 用户点击生成报文，根据用户输入参数，生成签名报文，并将其赋值到文本框和生成对应的二维码
   * */
  handleGetTransaction = record => {
    if (!this.state.GetTransactionButtonState) {
      return;
    }
    const eos = this.getEos();
    const values = this.props.form.getFieldsValue();
    const { AccountName } = values;
    const options = { sign: false };
    let abi = null;
    switch (record.account) {
      case 'poormantoken':
        abi = poormantoken;
        break;
      case 'ridlridlcoin':
        abi = ridlridlcoin;
        break;
      case 'trybenetwork':
        abi = trybenetwork;
        break;
      case 'wizznetwork1':
        abi = wizznetwork1;
        break;
      case 'eosatidiumio':
        abi = eosatidiumio;
        break;
      default:
        abi = defaultAbi;
    }
    eos.fc.abiCache.abi(record.account, abi[0]);
    const data =
      record.method === 'signup'
        ? { owner: AccountName, quantity: `0.0000 ${record.symbol}` }
        : { claimer: AccountName };
    eos
      .transaction(
        {
          actions: [
            {
              account: record.account,
              name: record.method,
              authorization: [
                {
                  actor: AccountName,
                  permission: 'active',
                },
              ],
              data,
            },
          ],
        },
        options,
      )
      .then(tr => {
        this.props.form.setFieldsValue({
          transaction: JSON.stringify(tr.transaction),
        });
        this.setState({
          QrCodeValue: JSON.stringify(tr.transaction),
        });
        this.openTransactionSuccessNotification();
      })
      .catch(err => {
        this.openTransactionFailNotification(err);
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
                message="请输入为生成待签名报文所需的字段"
                description="该页面为离线页面，输入的字段不会向外界泄露，请放心输入。"
                type="info"
                closable
              />
            </FormItem>
            <FormItem>
              {getFieldDecorator('AccountName', {
                rules: [{ required: true, message: '请输入领取空投的账户' }],
              })(
                <Input
                  prefix={
                    <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder="请输入领取空投的账户"
                />,
              )}
            </FormItem>
            <FormItem>
              <Table
                columns={this.state.tableColumns}
                dataSource={this.state.tableData}
                pagination={false}
                size="middle"
              />
            </FormItem>
            <FormItem>
              {getFieldDecorator('transaction', {
                rules: [{ required: true, message: '请复制生成的待签名报文!' }],
              })(
                <TextArea
                  disabled="true"
                  placeholder="请复制生成的待签名报文"
                />,
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
                复制报文
              </Button>
            </FormItem>
          </FormComp>
        </LayoutContentBox>
      </LayoutContent>
    );
  }
}

AirgrabPage.propTypes = {
  form: PropTypes.object,
};

const AirgrabPageForm = Form.create()(AirgrabPage);

export default AirgrabPageForm;
