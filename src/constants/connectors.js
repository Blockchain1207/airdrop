
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { FortmaticConnector } from '@web3-react/fortmatic-connector';
import { InjectedConnector } from '@web3-react/injected-connector';
import { BscConnector } from '@binance-chain/bsc-connector'

const POLLING_INTERVAL = 12000

const rpcConfig = {
  RPC_URL_1: 'https://mainnet.infura.io/v3/4aaf5b5c3d5540f3a3b13459cf748ec8',
  RPC_URL_4: 'https://rinkeby.infura.io/v3/4aaf5b5c3d5540f3a3b13459cf748ec8',
  RPC_URL_56: 'https://bsc-dataseed1.ninicoin.io',
}

const RPC_URLS = {
  1: rpcConfig.RPC_URL_1,
  4: rpcConfig.RPC_URL_4,
  56:rpcConfig.RPC_URL_56,
}

export const walletconnect = new WalletConnectConnector({
  rpc: {
    1: { 1: RPC_URLS[1], 4: RPC_URLS[4], 56:RPC_URLS[56] },
    bridge: 'https://bridge.walletconnect.org',
  },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: POLLING_INTERVAL
})

export const bscConnector = new BscConnector({ supportedChainIds: [56
  // ,97
  ] })

export const injected = new InjectedConnector({ supportedChainIds: [1
  // , 29, 97
] })

export const fortmatic = new FortmaticConnector({ apiKey: 'pk_test_D58C7F46E173BEDB', chainId: 4, pollingInterval: 15000 })

//Test Rinkeby, Kovan, Ropsten : pk_test_D58C7F46E173BEDB
//Production localhost : pk_live_724ABCF7B9489C5C