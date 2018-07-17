/*
 * FeaturePage Messages
 *
 * This contains all the text for the FeaturePage component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  CreatorAccountNamePlaceholder: {
    id: 'CreateAccountPage CreatorAccountNamePlaceholder',
    defaultMessage: '请输入私钥对应的账户名',
  },
  NewAccountNamePlaceholder: {
    id: 'CreateAccountPage NewAccountNamePlaceholder',
    defaultMessage:
      '请输入想要创建的账户名，账户名应为12位字符，仅限小写字母a-z以及数字1-5',
  },
  NewAccountNameHelp: {
    id: 'CreateAccountPage NewAccountNameHelp',
    defaultMessage: '注：账户名应为12位字符，仅限小写字母a-z以及数字1-5',
  },
  OwnerKeyPlaceholder: {
    id: 'CreateAccountPage OwnerKeyPlaceholder',
    defaultMessage: '请输入新账号的公钥ownerKey',
  },
  ActiveKeyPlaceholder: {
    id: 'CreateAccountPage ActiveKeyPlaceholder',
    defaultMessage: '请输入新账号的公钥activeKey',
  },
  BytesHelp: {
    id: 'CreateAccountPage BytesHelp',
    defaultMessage: '注：内存Bytes数量至少为4kb，即所填最小数值为：4096',
  },
  BytesPlaceholder: {
    id: 'CreateAccountPage BytesPlaceholder',
    defaultMessage: '请输入为新账号所购买的内存Bytes数量',
  },
  StakeNetQuantityPlaceholder: {
    id: 'CreateAccountPage StakeNetQuantityPlaceholder',
    defaultMessage: '请输入为新账号所质押的Net数量',
  },
  StakeCpuQuantityPlaceholder: {
    id: 'CreateAccountPage StakeCpuQuantityPlaceholder',
    defaultMessage: '请输入为新账号所质押的Cpu数量',
  },
});
