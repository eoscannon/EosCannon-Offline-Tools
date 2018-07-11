import EOS from 'eosjs';

const localChainId =
  'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906';

const onLineAddress = 'https://tool.eoscannon.io/';

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
  getTransactionHeadersFromJsonInfo,
  getChainIdFromJsonInfoOrConfig,
  getEos,
};
