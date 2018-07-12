import EOS from 'eosjs';
// import producers from './producers.json';

const localChainId =
  'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906';

const onLineAddress = 'https://tool.eoscannon.io/';

const voteNodes = [
  'acryptolions',
  'lioninjungle',
  'ohtigertiger',
  'bohdanjungle',
  'junglemorpho',
];

// const voteNodes = [];
// producers.forEach(item => {
//   voteNodes.push(item.owner);
// });

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
  getTransactionHeadersFromJsonInfo,
  getChainIdFromJsonInfoOrConfig,
  getEos,
};
