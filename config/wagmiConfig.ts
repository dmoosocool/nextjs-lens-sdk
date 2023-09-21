import { createConfig, configureChains } from "wagmi";
import { publicProvider } from 'wagmi/providers/public'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { supportedChains } from './supportChains'
import { appInfo } from './appInfo'
const { chains, publicClient, webSocketPublicClient } = configureChains(supportedChains, [jsonRpcProvider({
  rpc: (chain) => {
    const { infura, default: defaultUrls } = chain.rpcUrls;
    const rpc = {
      http: (infura && infura.http[0]) || defaultUrls.http[0],
      webSocket: (infura && infura.webSocket && infura.webSocket[0])
    };
    return rpc
  }
}), publicProvider()])

export const config = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({chains}),
    new CoinbaseWalletConnector({chains, options: {appName: appInfo.title}})
  ],
  publicClient,
  webSocketPublicClient
})
