import EOS from 'eosjs';
import producers from './producers.json';

const localChainId =
  'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906';

const onLineAddress = 'https://tool.eoscannon.io/';
const jsonInfoDescription = `请前往 ${onLineAddress} 获取json字段，联网打开网页，扫描二维码即可获得。`;
const transactionInfoDescription = `请将下面的签名报文复制后，前往 ${onLineAddress} 联网后进行播报发送。`;

const voteNodes = [];
producers.forEach(item => {
  voteNodes.push(item.owner);
});

const getTransactionHeadersFromJsonInfo = jsonInfo => {
  const { refBlockNum, refBlockPrefix, expiration } = JSON.parse(jsonInfo);
  return {
    expiration,
    ref_block_num: refBlockNum,
    ref_block_prefix: refBlockPrefix,
  };
};

const getChainIdFromJsonInfoOrConfig = jsonInfo => {
  let { chainId } = JSON.parse(jsonInfo);
  chainId = chainId || localChainId;
  return chainId;
};

const getEos = values => {
  const { keyProvider, jsonInfo } = values;
  const transactionHeaders = getTransactionHeadersFromJsonInfo(jsonInfo);
  const chainId = getChainIdFromJsonInfoOrConfig(jsonInfo);
  return EOS({
    httpEndpoint: null,
    chainId,
    keyProvider,
    transactionHeaders,
  });
};
export {
  onLineAddress,
  voteNodes,
  jsonInfoDescription,
  transactionInfoDescription,
  getTransactionHeadersFromJsonInfo,
  getChainIdFromJsonInfoOrConfig,
  getEos,
};
