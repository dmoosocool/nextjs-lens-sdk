import { LensConfig, production } from '@lens-protocol/react-web'
import { bindings as wagmiBindings } from '@lens-protocol/wagmi'

export const lensConfig: LensConfig = {
  bindings: wagmiBindings(),
  environment: production
}
