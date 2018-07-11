import EOS from 'eosjs';

const localChainId =
  'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906';
// const chainId =
//   '038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca';

const onLineAddress = 'https://tool.eoscannon.io/';

const getTransactionHeadersFromJsonInfo = jsonInfo => {
  const { refBlockNum, refBlockPrefix, expiration } = JSON.parse(jsonInfo);
  const transactionHeaders = {
    expiration,
    ref_block_num: refBlockNum,
    ref_block_prefix: refBlockPrefix,
  };
  return transactionHeaders;
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
  const eos = EOS({
    httpEndpoint: null,
    chainId,
    keyProvider,
    transactionHeaders,
  });
  return eos;
};
export {
  onLineAddress,
  getTransactionHeadersFromJsonInfo,
  getChainIdFromJsonInfoOrConfig,
  getEos,
};
