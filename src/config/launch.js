import { isAddress } from 'viem';
import { UNIHASH_CA } from './deployed.js';

/** When false, UI uses placeholders instead of on-chain reads. Auto-enabled when a valid CA is configured. */
export const liveDataEnabled =
  import.meta.env.VITE_LIVE_DATA === 'true' ||
  (import.meta.env.VITE_LIVE_DATA !== 'false' && isAddress(UNIHASH_CA));

export const LAUNCH_TERMINAL_MESSAGE = 'live on ethereum mainnet';
