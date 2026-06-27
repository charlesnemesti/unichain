/** UniChain mainnet deployment (Ethereum L1). */
export const UNIHASH_CA = '0x5F08C79b4cDb36e2F70576c885d7C56AfbC64d16';

export const UNICHAIN_HOOK_CA = '0x4FEF97B09b6e2be7ee62331eF47F5fC1BeF1a0c4';

export const UNISWAP_V4_POOL_MANAGER = '0x000000000004444c5dc75cB358380D2e3dE08A90';

export const TOKEN_INITIAL_SUPPLY = 137_000;
export const TOKEN_DECIMALS = 18;
export const BUY_FEE_BPS = 100;
export const SELL_FEE_BPS = 500;

export const UNISWAP_BUY_URL =
  'https://app.uniswap.org/swap?chain=mainnet&inputCurrency=ETH&outputCurrency=0x5F08C79b4cDb36e2F70576c885d7C56AfbC64d16';

export const ETHERSCAN_TOKEN_URL = `https://etherscan.io/address/${UNIHASH_CA}`;
export const ETHERSCAN_HOOK_URL = `https://etherscan.io/address/${UNICHAIN_HOOK_CA}`;

export function shortenCa(address) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}
