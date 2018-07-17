/*
 * FeaturePage Messages
 *
 * This contains all the text for the FeaturePage component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  SwitchCheckedName: {
    id: 'BuyRamBytesPage SwitchCheckedName',
    defaultMessage: '购买',
  },
  SwitchUnCheckedName: {
    id: 'BuyRamBytesPage SwitchUnCheckedName',
    defaultMessage: '出售',
  },
  BuyPayerAccountNamePlaceholder: {
    id: 'BuyRamBytesPage BuyPayerAccountNamePlaceholder',
    defaultMessage: '请输入用于支付购买内存的账户名',
  },
  SellPayerAccountNamePlaceholder: {
    id: 'BuyRamBytesPage SellPayerAccountNamePlaceholder',
    defaultMessage: '请输入用于出售内存的账户名',
  },
  ReceiverAccountNamePlaceholder: {
    id: 'BuyRamBytesPage ReceiverAccountNamePlaceholder',
    defaultMessage: '请输入用于接受所购买内存的账户名！不填，则默认为支付账户',
  },
  BytesQuantityPlaceholder: {
    id: 'BuyRamBytesPage BytesQuantityPlaceholder',
    defaultMessage: '请输入购买内存的数量bytes',
  },
});
