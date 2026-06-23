/** Live mainnet deployment — used when VITE_UNIHASH is unset (e.g. Vercel). */
export const UNIHASH_CA = '0xaA6E6fAa951Cd0800739Fa2d66018702d18bc044';

export const UNISWAP_BUY_URL =
  `https://app.uniswap.org/swap?chain=mainnet&inputCurrency=ETH&outputCurrency=${UNIHASH_CA}`;

export const ETHERSCAN_TOKEN_URL = `https://etherscan.io/address/${UNIHASH_CA}`;
