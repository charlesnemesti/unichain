import './style.css';
import * as THREE from 'three';

// ═══════════════════════════════════════════════════════════════════════════
// THREE.JS — HERO LANDING (animation groups)
// Based on: three.js/examples/misc_animation_groups.html
// ═══════════════════════════════════════════════════════════════════════════

/** @type {THREE.Scene} */
let heroScene;
/** @type {THREE.PerspectiveCamera} */
let heroCamera;
/** @type {THREE.WebGLRenderer} */
let heroRenderer;
/** @type {THREE.AnimationMixer} */
let heroMixer;
/** @type {THREE.Clock} */
let heroClock;
/** @type {HTMLElement | null} */
let heroContainer = null;
/** @type {number | null} */
let heroAnimationId = null;

function initHeroAnimationGroups() {
  heroContainer = document.getElementById('hero-canvas');
  if (!heroContainer) return;

  heroScene = new THREE.Scene();
  heroScene.background = new THREE.Color(0x000000);

  heroCamera = new THREE.PerspectiveCamera(40, 1, 1, 1000);
  heroCamera.position.set(50, 50, 100);
  heroCamera.lookAt(heroScene.position);

  heroRenderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance',
  });
  heroRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  heroContainer.appendChild(heroRenderer.domElement);

  // All meshes share one animation state via AnimationObjectGroup
  const animationGroup = new THREE.AnimationObjectGroup();
  const geometry = new THREE.BoxGeometry(5, 5, 5);
  const material = new THREE.MeshBasicMaterial({
    transparent: true,
    color: 0x000000,
    opacity: 0.85,
  });

  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      const mesh = new THREE.Mesh(geometry, material.clone());
      mesh.position.x = 32 - 16 * i;
      mesh.position.y = 0;
      mesh.position.z = 32 - 16 * j;
      heroScene.add(mesh);
      animationGroup.add(mesh);
    }
  }

  const xAxis = new THREE.Vector3(1, 0, 0);
  const qInitial = new THREE.Quaternion().setFromAxisAngle(xAxis, 0);
  const qFinal = new THREE.Quaternion().setFromAxisAngle(xAxis, Math.PI);

  const quaternionKF = new THREE.QuaternionKeyframeTrack(
    '.quaternion',
    [0, 1, 2],
    [
      qInitial.x, qInitial.y, qInitial.z, qInitial.w,
      qFinal.x, qFinal.y, qFinal.z, qFinal.w,
      qInitial.x, qInitial.y, qInitial.z, qInitial.w,
    ],
  );

  // Fluor yellow → white → black (UniHash palette)
  const colorKF = new THREE.ColorKeyframeTrack(
    '.material.color',
    [0, 1, 2],
    [
      0.875, 1, 0,   // #DFFF00 fluor
      1, 1, 1,       // white
      0.05, 0.05, 0, // near-black
    ],
    THREE.InterpolateDiscrete,
  );

  const opacityKF = new THREE.NumberKeyframeTrack(
    '.material.opacity',
    [0, 1, 2],
    [0.95, 0.35, 0.9],
  );

  const clip = new THREE.AnimationClip('unihash-hero', 3, [quaternionKF, colorKF, opacityKF]);

  heroMixer = new THREE.AnimationMixer(animationGroup);
  heroMixer.clipAction(clip).play();

  heroClock = new THREE.Clock();

  window.addEventListener('resize', onHeroResize);
  onHeroResize();
  animateHero();
}

function onHeroResize() {
  if (!heroContainer || !heroCamera || !heroRenderer) return;

  const width = heroContainer.clientWidth;
  const height = heroContainer.clientHeight;

  heroCamera.aspect = width / height;
  heroCamera.updateProjectionMatrix();
  heroRenderer.setSize(width, height, false);
}

function animateHero() {
  heroAnimationId = requestAnimationFrame(animateHero);

  const delta = heroClock.getDelta();
  heroMixer?.update(delta);
  heroRenderer?.render(heroScene, heroCamera);
}

function disposeHeroAnimation() {
  if (heroAnimationId !== null) cancelAnimationFrame(heroAnimationId);
  window.removeEventListener('resize', onHeroResize);

  heroMixer?.stopAllAction();
  heroRenderer?.dispose();

  heroScene?.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      object.geometry?.dispose();
      object.material?.dispose();
    }
  });

  heroRenderer?.domElement?.remove();
}

// ═══════════════════════════════════════════════════════════════════════════
// WEB3 UI — SIMULATED WALLET + MINT FLOW
// (Replace stubs with real contract calls via window.ethereum)
// ═══════════════════════════════════════════════════════════════════════════

const state = {
  connected: false,
  address: null,
  quantity: 1,
  minting: false,
  sealing: false,
  // Simulated on-chain reads — replace with contract calls
  hashBalance: 0,
  hashesOwned: 0,
  spawnBlock: null,
};

const MIN_QTY = 1;
const MAX_QTY = 10;

const $ = (id) => document.getElementById(id);

const btnConnectHeader = $('btn-connect-header');
const btnConnectWallet = $('btn-connect-wallet');
const btnSeal = $('btn-seal');
const btnSpawn = $('btn-spawn');
const btnQtyMinus = $('btn-qty-minus');
const btnQtyPlus = $('btn-qty-plus');
const qtyDisplay = $('qty-display');
const statusText = $('status-text');
const walletTerminalLine = $('wallet-terminal-line');
const walletStatus = $('wallet-status');
const statBalance = $('stat-balance');
const statOwned = $('stat-owned');
const statSpawnBlock = $('stat-spawn-block');

function setStatus(message, tone = 'neutral') {
  const tones = {
    neutral: 'text-white',
    success: 'text-fluor',
    error: 'text-fluor',
    warn: 'text-fluor',
  };

  statusText.className = tones[tone] ?? tones.neutral;
  statusText.textContent = message;
}

function truncateAddress(address) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatNumber(n) {
  return n.toLocaleString('en-US');
}

function updateUI() {
  const busy = state.minting || state.sealing;
  const connectLabel = state.connected && state.address
    ? truncateAddress(state.address)
    : 'Connect';

  btnConnectHeader.textContent = connectLabel;
  btnConnectWallet.textContent = state.connected ? 'Connected' : 'Connect';

  btnConnectHeader.disabled = busy;
  btnConnectWallet.disabled = busy || state.connected;
  btnSpawn.disabled = !state.connected || busy;
  btnSeal.disabled = !state.connected || busy || state.hashesOwned === 0;

  qtyDisplay.textContent = String(state.quantity);
  btnQtyMinus.disabled = busy || state.quantity <= MIN_QTY;
  btnQtyPlus.disabled = busy || state.quantity >= MAX_QTY;

  if (state.connected) {
    walletTerminalLine.textContent = `> connected: ${state.address}`;
    walletTerminalLine.className = 'mb-8 font-mono text-sm text-fluor';
    statBalance.textContent = formatNumber(state.hashBalance);
    statOwned.textContent = String(state.hashesOwned);
    statSpawnBlock.textContent = state.spawnBlock ? `#${state.spawnBlock}` : '·';
    walletStatus.textContent = busy ? 'Processing' : 'Active';
    walletStatus.className = 'text-fluor';
  } else {
    walletTerminalLine.textContent = '> awaiting connection…';
    walletTerminalLine.className = 'mb-8 font-mono text-sm text-white';
    statBalance.textContent = '·';
    statOwned.textContent = '·';
    statSpawnBlock.textContent = '·';
    walletStatus.textContent = 'Idle';
    walletStatus.className = 'text-white';
  }
}

/**
 * Connect wallet — stub.
 *
 * TODO: Replace with real Web3 provider logic:
 *
 *   if (!window.ethereum) throw new Error('No wallet detected');
 *   const accounts = await window.ethereum.request({
 *     method: 'eth_requestAccounts',
 *   });
 *   const provider = new ethers.BrowserProvider(window.ethereum);
 *   const signer = await provider.getSigner();
 *   const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
 */
async function connectWallet() {
  if (state.connected) return;

  setStatus('Requesting wallet connection...', 'warn');
  walletStatus.textContent = 'Connecting';

  try {
    // Simulated delay — remove when wiring real provider
    await new Promise((resolve) => setTimeout(resolve, 900));

    // TODO: const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    // TODO: state.hashBalance = await contract.balanceOf(accounts[0]);
    // TODO: state.hashesOwned = await nftContract.balanceOf(accounts[0]);
    const mockAddress = '0xC0FFEE' + Math.random().toString(16).slice(2, 10).padEnd(8, '0');

    state.connected = true;
    state.address = mockAddress;
    state.hashBalance = 6240;
    state.hashesOwned = 2;
    state.spawnBlock = 19_842_103;

    setStatus(`Connected. Ready to spawn ${state.quantity} $HASH.`, 'success');
    updateUI();
  } catch (error) {
    console.error('[UniHash] Wallet connection failed:', error);
    setStatus('Connection rejected. Retry when ready.', 'error');
    walletStatus.textContent = 'Idle';
  }
}

/**
 * Mint / spawn tokens — stub.
 *
 * TODO: Replace simulation with on-chain mint:
 *
 *   const tx = await contract.mint(state.address, state.quantity, {
 *     value: parseEther(String(state.quantity * MINT_PRICE)),
 *   });
 *   setStatus('Transaction pending...', 'warn');
 *   const receipt = await tx.wait();
 *   setStatus(`Spawned ${state.quantity} $HASH at block ${receipt.blockNumber}.`, 'success');
 */
async function spawnTokens() {
  if (!state.connected || state.minting || state.sealing) return;

  state.minting = true;
  updateUI();
  setStatus(`Spawning ${state.quantity} $HASH on-chain...`, 'warn');

  try {
    // Simulated mint latency — remove when wiring contract.mint()
    await new Promise((resolve) => setTimeout(resolve, 2200));

    setStatus(
      `Success. ${state.quantity} token${state.quantity > 1 ? 's' : ''} spawned. Tx: 0x${Math.random().toString(16).slice(2, 10)}...`,
      'success',
    );
  } catch (error) {
    console.error('[UniHash] Mint failed:', error);
    setStatus('Spawn failed. Check gas and retry.', 'error');
  } finally {
    state.minting = false;
    updateUI();
  }
}

/**
 * Seal Hash — stub.
 *
 * TODO: Replace with on-chain seal call:
 *   const tx = await nftContract.seal(tokenId);
 *   await tx.wait();
 */
async function sealHash() {
  if (!state.connected || state.sealing || state.hashesOwned === 0) return;

  state.sealing = true;
  updateUI();
  setStatus('Sealing Hash — freezing tokenURI on-chain...', 'warn');

  try {
    await new Promise((resolve) => setTimeout(resolve, 1800));
    setStatus('Hash sealed. tokenURI frozen permanently.', 'success');
  } catch (error) {
    console.error('[UniHash] Seal failed:', error);
    setStatus('Seal failed. Retry when ready.', 'error');
  } finally {
    state.sealing = false;
    updateUI();
  }
}

function changeQuantity(delta) {
  if (state.minting || state.sealing) return;

  state.quantity = Math.min(MAX_QTY, Math.max(MIN_QTY, state.quantity + delta));

  if (state.connected) {
    setStatus(`Ready to spawn ${state.quantity} $HASH.`, 'success');
  }

  updateUI();
}

// ═══════════════════════════════════════════════════════════════════════════
// LIVE HERO STATS — animated counters (replace with on-chain reads)
// ═══════════════════════════════════════════════════════════════════════════

function initHeroStats() {
  const targets = {
    'stat-hashes': 1284,
    'stat-holders': 412,
    'stat-spawned': 89_204,
  };

  Object.entries(targets).forEach(([id, target]) => {
    const el = $(id);
    if (!el) return;

    let current = 0;
    const step = Math.ceil(target / 60);

    const tick = () => {
      current = Math.min(current + step, target);
      el.textContent = formatNumber(current);
      if (current < target) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  });
}

function initWeb3UI() {
  btnConnectHeader.addEventListener('click', connectWallet);
  btnConnectWallet.addEventListener('click', connectWallet);
  btnSeal.addEventListener('click', sealHash);
  btnSpawn.addEventListener('click', spawnTokens);
  btnQtyMinus.addEventListener('click', () => changeQuantity(-1));
  btnQtyPlus.addEventListener('click', () => changeQuantity(1));

  // TODO: Listen for account/network changes from wallet provider
  // window.ethereum?.on('accountsChanged', handleAccountsChanged);
  // window.ethereum?.on('chainChanged', () => window.location.reload());

  initHeroStats();
  updateUI();
}

// ═══════════════════════════════════════════════════════════════════════════
// BOOT
// ═══════════════════════════════════════════════════════════════════════════

initHeroAnimationGroups();
initWeb3UI();

// Optional cleanup if hot-reloaded in dev
if (import.meta.hot) {
  import.meta.hot.dispose(() => disposeHeroAnimation());
}
