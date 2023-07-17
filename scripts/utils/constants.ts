import { v2 } from '@0xsequence/core'

export const V2_WALLET_CONTEXT = {
  version: 2,
  factory: '0xFaA5c0b14d1bED5C888Ca655B9a8A5911F78eF4A',
  mainModule: '0xfBf8f1A5E00034762D928f46d438B947f5d4065d',
  mainModuleUpgradable: '0x4222dcA3974E39A8b41c411FeDDE9b09Ae14b911',
  guestModule: '0xfea230Ee243f88BC698dD8f1aE93F8301B6cdfaE',
  sequenceUtils: '0xdbbFa3cB3B087B64F4ef5E3D20Dda2488AA244e6',
  walletCreationCode:
    '0x603a600e3d39601a805130553df3363d3d373d3d3d363d30545af43d82803e903d91601857fd5bf3',
}

export const V2_CODERS = {
  signature: v2.signature.SignatureCoder,
  config: v2.config.ConfigCoder,
}
