/*
 * FeaturePage Messages
 *
 * This contains all the text for the FeaturePage component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  TransferFromAccountNamePlaceholder: {
    id: 'TransferPage TransferFromAccountNamePlaceholder',
    defaultMessage: '请输入私钥对应的账户名',
  },
  TransferToAccountNamePlaceholder: {
    id: 'TransferPage TransferToAccountNamePlaceholder',
    defaultMessage: '请输入将要转入的账户名',
  },
  TransferContractPlaceholder: {
    id: 'TransferPage TransferContractPlaceholder',
    defaultMessage: '请输入Contract',
  },
  TransferQuantityPlaceholder: {
    id: 'TransferPage TransferQuantityPlaceholder',
    defaultMessage: '请输入转账的数量',
  },
  TransferDigitPlaceholder: {
    id: 'TransferPage TransferDigitPlaceholder',
    defaultMessage: '请输入代币精度',
  },
  TransferSymbolPlaceholder: {
    id: 'TransferPage TransferSymbolPlaceholder',
    defaultMessage: '请输入Symbol',
  },
  TransferMemoPlaceholder: {
    id: 'TransferPage TransferMemoPlaceholder',
    defaultMessage: '请输入Memo，交易所转账必填',
  },
  TransferMemoHelp: {
    id: 'TransferPage TransferMemoHelp',
    defaultMessage: '注：交易所转账必填',
  },
});
