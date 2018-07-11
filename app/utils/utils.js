import EOS from 'eosjs';
import { localChainId, onLineAddress } from './config';

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

const getOnLineAddress = () => onLineAddress;

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
  getTransactionHeadersFromJsonInfo,
  getChainIdFromJsonInfoOrConfig,
  getOnLineAddress,
  getEos,
};
