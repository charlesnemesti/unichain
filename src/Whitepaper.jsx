import { useEffect, useState } from 'react';
import { Logo } from './Logo.jsx';
import { ETHERSCAN_HOOK_URL, ETHERSCAN_TOKEN_URL, TOKEN_DECIMALS, TOKEN_INITIAL_SUPPLY, UNICHAIN_HOOK_CA, UNIHASH_CA, UNISWAP_BUY_URL, UNISWAP_V4_POOL_MANAGER, shortenCa } from './config/deployed.js';
import { initCaStrip } from './ca-strip.js';

const NAV_ITEMS = [
  { id: 'overview', label: 'ABSTRACT' },
  { id: 'signal-001', label: 'ERC20 CORE' },
  { id: 'signal-002', label: 'BURN HOOK' },
  { id: 'signal-003', label: 'SUPPLY' },
  { id: 'signal-004', label: 'POOL FLOW' },
  { id: 'signal-005', label: 'NFT ADD-ON' },
  { id: 'signal-006', label: 'MOLECULAR ART' },
  { id: 'signal-007', label: 'CONTRACTS' },
  { id: 'signal-008', label: 'PARAMETERS' },
];

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  history.replaceState(null, '', `#${id}`);
}

function SignalBadge({ children }) {
  return (
    <span className="mb-4 inline-block border border-fluor px-2 py-1 text-xs text-fluor">
      {children}
    </span>
  );
}

function CardTitle({ children }) {
  return (
    <h2
      className="mb-4 text-3xl uppercase text-fluor"
      style={{ fontFamily: "'VT323', monospace" }}
    >
      {children}
    </h2>
  );
}

function DocCard({ id, badge, title, children }) {
  return (
    <div
      id={id}
      className="mb-8 border border-zinc-800 bg-zinc-900/40 p-8"
      style={{ scrollMarginTop: '6rem' }}
    >
      {badge ? <SignalBadge>{badge}</SignalBadge> : null}
      {title ? <CardTitle>{title}</CardTitle> : null}
      {children}
    </div>
  );
}

function GridItem({ children }) {
  return (
    <div className="flex items-center gap-3 border border-zinc-800 bg-zinc-950 p-4 text-sm">
      <div className="h-2 w-2 shrink-0 bg-fluor" aria-hidden="true" />
      <span className="uppercase tracking-wide text-zinc-200">{children}</span>
    </div>
  );
}

function ItemGrid({ items }) {
  return (
    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
      {items.map((item) => (
        <GridItem key={item}>{item}</GridItem>
      ))}
    </div>
  );
}

function SpecGrid({ specs }) {
  return (
    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
      {specs.map(({ label, value }) => (
        <div
          key={label}
          className="border border-zinc-800 bg-zinc-950 p-4"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{label}</p>
          <p className="mt-2 text-sm uppercase tracking-wide text-fluor">{value}</p>
        </div>
      ))}
    </div>
  );
}

function CodeBlock({ children }) {
  return (
    <pre className="mt-6 overflow-x-auto border border-zinc-800 bg-black p-4 text-xs leading-relaxed text-fluor">
      {children}
    </pre>
  );
}

function Accent({ children }) {
  return <span className="text-fluor">{children}</span>;
}

function SidebarLink({ id, label, isActive, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick(id)}
      className={`w-full py-2 text-left text-xs uppercase tracking-[0.18em] transition-colors hover:text-fluor ${
        isActive ? 'text-fluor' : 'text-zinc-500'
      }`}
    >
      {isActive ? '> ' : ''}
      {label}
    </button>
  );
}

export default function Whitepaper() {
  const [activeId, setActiveId] = useState('overview');

  useEffect(() => {
    const sections = NAV_ITEMS.map((item) => document.getElementById(item.id)).filter(Boolean);
    if (!sections.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-25% 0px -60% 0px', threshold: [0, 0.25, 0.5, 1] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    initCaStrip();
  }, []);

  const handleNav = (id) => {
    setActiveId(id);
    scrollToSection(id);
  };

  return (
    <>
      <div className="sticky top-0 z-50">
      <header className="border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
          <a href="/" className="site-logo shrink-0">
            <Logo />
          </a>
          <div className="flex shrink-0 items-center gap-3">
            <a
              href="https://x.com/UniChainV4"
              className="btn-twitter"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow UniChain on X"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href={UNISWAP_BUY_URL}
              className="hidden border border-fluor bg-fluor px-4 py-2 text-xs uppercase tracking-widest text-black sm:inline-flex"
              target="_blank"
              rel="noopener noreferrer"
            >
              Buy $CHAIN ↗
            </a>
            <a
              href="/"
              className="border border-zinc-700 px-4 py-2 text-xs uppercase tracking-widest text-zinc-300 transition-colors hover:border-fluor hover:text-fluor"
            >
              ← Home
            </a>
          </div>
        </div>
      </header>

      <div className="ca-strip" id="ca-strip" aria-label="Token contract address">
        <div className="ca-strip-glow" aria-hidden="true" />
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-2.5">
          <div className="ca-strip-meta min-w-0 flex-1">
            <p className="ca-strip-label">&gt; contract_address · $CHAIN</p>
            <code className="ca-strip-address" id="ca-address-display" title="UniChain token contract" />
          </div>
          <div className="ca-strip-actions flex shrink-0 items-center gap-2">
            <a
              id="ca-explorer-link"
              href={ETHERSCAN_TOKEN_URL}
              className="ca-strip-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Etherscan
            </a>
            <button type="button" className="ca-copy-btn" id="ca-copy-btn">
              Copy CA
            </button>
          </div>
        </div>
      </div>
      </div>

      <div className="flex min-h-screen bg-zinc-950 font-mono text-zinc-300">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 overflow-y-auto border-r border-zinc-800 p-6 lg:block">
        <div className="mb-6 flex items-center gap-2">
          <img src="/logo.svg" alt="" width="24" height="24" className="site-logo-mark" aria-hidden="true" />
          <p className="text-xs uppercase tracking-[0.28em] text-fluor">Docs</p>
        </div>
        <nav className="flex flex-col gap-1" aria-label="Section navigation">
          {NAV_ITEMS.map((item) => (
            <SidebarLink
              key={item.id}
              id={item.id}
              label={item.label}
              isActive={activeId === item.id}
              onClick={handleNav}
            />
          ))}
        </nav>
        <div className="mt-8 border-t border-zinc-800 pt-6">
          <a
            href="/"
            className="text-xs uppercase tracking-[0.18em] text-zinc-500 transition-colors hover:text-fluor"
          >
            ← Back to landing
          </a>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <nav
          className="mb-6 flex gap-2 overflow-x-auto border border-zinc-800 bg-zinc-900/40 p-3 lg:hidden"
          aria-label="Mobile section navigation"
        >
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNav(item.id)}
              className={`shrink-0 px-3 py-1 text-[10px] uppercase tracking-[0.14em] transition-colors hover:text-fluor ${
                activeId === item.id ? 'text-fluor' : 'text-zinc-500'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mx-auto max-w-4xl">
          <DocCard
            id="overview"
            badge="// 00 · abstract"
            title="Abstract"
          >
            <p className="text-sm leading-relaxed text-zinc-400">
              UniChain is deployed on Ethereum mainnet at <Accent>{UNIHASH_CA}</Accent>. The core contract
              exposes balances, allowances, transfers, public burns and a one-time hook assignment. The molecular
              Chain NFTs remain part of the project, but as a separate external contract layer rather than
              native logic inside this ERC-20.
            </p>
            <SpecGrid
              specs={[
                { label: 'Network', value: 'Ethereum L1' },
                { label: 'Initial supply', value: `${TOKEN_INITIAL_SUPPLY.toLocaleString('en-US')} $CHAIN` },
                { label: 'Model', value: 'ERC-20 + v4 burn hook' },
              ]}
            />
          </DocCard>

          <DocCard id="signal-001" badge="// 01 · erc20 core" title="ERC20 core">
            <p className="text-sm leading-relaxed text-zinc-400">
              The token is not DN404 and does not expose ERC-721 mint, ownerOf or tokenURI functions. It is
              a compact ERC-20 implementation with <Accent>name</Accent>, <Accent>symbol</Accent>,{' '}
              <Accent>decimals</Accent>, <Accent>totalSupply</Accent>, <Accent>balanceOf</Accent>, approvals
              and transfers. It also exposes <Accent>burn(amount)</Accent> for direct supply reduction.
            </p>
            <ItemGrid
              items={[
                'contract name: UniChain',
                `symbol: $CHAIN · decimals: ${TOKEN_DECIMALS}`,
                `initial supply: ${TOKEN_INITIAL_SUPPLY.toLocaleString('en-US')}`,
                'public burn function reduces circulating supply',
              ]}
            />
          </DocCard>

          <DocCard id="signal-002" badge="// 02 · burn hook" title="Burn hook">
            <p className="text-sm leading-relaxed text-zinc-400">
              UniChain points to <Accent>UniChainHook</Accent> at <Accent>{UNICHAIN_HOOK_CA}</Accent>. The
              token can set this hook once; after it is set, attempts to set another hook revert. The hook is
              the active protocol logic around trading flow.
            </p>
            <ItemGrid
              items={[
                'buy fee: 1% (100 / 10,000 bps)',
                'sell fee: 5% (500 / 10,000 bps)',
                'tracks burned-from-buys and burned-from-sells separately',
                'records total burned, last burn amount, timestamp and direction',
              ]}
            />
          </DocCard>

          <DocCard id="signal-003" badge="// 03 · supply" title="Supply mechanics">
            <p className="text-sm leading-relaxed text-zinc-400">
              The live deployment uses an initial supply of{' '}
              <Accent>{TOKEN_INITIAL_SUPPLY.toLocaleString('en-US')} $CHAIN</Accent>. Current supply is read from{' '}
              <Accent>totalSupply()</Accent> and falls below initial supply whenever burns have occurred.
              Hook stats split burn activity across buy and sell flow.
            </p>
            <ItemGrid
              items={[
                `initial supply: ${TOKEN_INITIAL_SUPPLY.toLocaleString('en-US')}`,
                'current supply is dynamic and read from totalSupply()',
                'burns are permanent ERC-20 supply reductions',
                'no native dividends, staking or reward-claim function in the token',
              ]}
            />
          </DocCard>

          <DocCard id="signal-004" badge="// 04 · pool flow" title="Pool flow">
            <p className="text-sm leading-relaxed text-zinc-400">
              The hook is built for Uniswap v4. Its constructor links the Ethereum Uniswap v4 PoolManager and
              the UniChain token. It validates canonical pool flow and emits <Accent>Burned</Accent> events
              with direction, swapper, ETH spent, $CHAIN burned and the new total supply.
            </p>
            <ItemGrid
              items={[
                `pool manager: ${UNISWAP_V4_POOL_MANAGER}`,
                `hook contract: ${UNICHAIN_HOOK_CA}`,
                'exact-output swaps are marked unsupported by the hook ABI',
                'the hook is protocol logic; the token remains simple ERC-20 state',
              ]}
            />
          </DocCard>

          <DocCard id="signal-005" badge="// 05 · nft add-on" title="NFT add-on">
            <p className="text-sm leading-relaxed text-zinc-400">
              The NFT plan should stay, but it should be described as a modular expansion. A future external
              ERC-721 contract can read $CHAIN ownership, burn stats or other eligibility rules without
              pretending that the current token mints NFTs by itself.
            </p>
            <ItemGrid
              items={[
                'do not remove the molecular Chain NFT system',
                'keep NFTs as a separate contract/module',
                'avoid claiming auto-mint, auto-burn or native tokenURI from $CHAIN',
                'future NFT contract can map 10 molecules × 10 color patterns',
              ]}
            />
          </DocCard>

          <DocCard id="signal-006" badge="// 06 · molecular art" title="Molecular art">
            <p className="text-sm leading-relaxed text-zinc-400">
              The front-end art layer remains valuable: real PDB structures, interactive Three.js rendering
              and a 100-unit visual catalog. This should be presented as the upcoming Chain collection rather
              than as behavior already inside the $CHAIN contract.
            </p>
            <ItemGrid
              items={[
                '10 real PDB molecular structures',
                '10 color-pattern identities',
                '100 total Chain visual units',
                'external contract will own the final mint/metadata rules',
              ]}
            />
            <CodeBlock>{`{
  "name": "Chain #0042",
  "description": "UniChain molecular NFT expansion for $CHAIN",
  "image": "ipfs://... or data:... from the external NFT contract",
  "attributes": ["molecule", "colorPattern", "burnEpoch"]
}`}</CodeBlock>
          </DocCard>

          <DocCard id="signal-007" badge="// 07 · contracts" title="The contracts">
            <p className="text-sm leading-relaxed text-zinc-400">
              Planned contracts:
            </p>
            <ItemGrid
              items={[
                'UniChain · ERC-20 token, burn(), setHook(), hook()',
                'UniChainHook · Uniswap v4 burn hook and burn-stat ledger',
                'Molecular Chain NFT · planned external contract, not yet native to token',
              ]}
            />
            <div className="mt-6 flex flex-wrap gap-4">
              <a href={ETHERSCAN_TOKEN_URL} className="border border-zinc-700 px-5 py-3 text-xs uppercase tracking-widest text-zinc-300 transition-colors hover:border-fluor hover:text-fluor" target="_blank" rel="noopener noreferrer">
                Token · {shortenCa(UNIHASH_CA)}
              </a>
              <a href={ETHERSCAN_HOOK_URL} className="border border-zinc-700 px-5 py-3 text-xs uppercase tracking-widest text-zinc-300 transition-colors hover:border-fluor hover:text-fluor" target="_blank" rel="noopener noreferrer">
                Hook · {shortenCa(UNICHAIN_HOOK_CA)}
              </a>
            </div>
          </DocCard>

          <DocCard id="signal-008" badge="// 08 · parameters" title="Parameters">
            <SpecGrid
              specs={[
                { label: 'Initial supply', value: TOKEN_INITIAL_SUPPLY.toLocaleString('en-US') },
                { label: 'Buy / sell fee', value: '1% / 5%' },
                { label: 'NFT contract', value: 'External add-on' },
              ]}
            />
            <ItemGrid
              items={[
                'token: standard ERC-20 with direct burn',
                'hook: records buy/sell burn stats',
                'hook can only be assigned once on the token',
                'no native reward distributor in current token ABI',
                'no native ERC-721 functions in current token ABI',
              ]}
            />
            <CodeBlock>{`UniChain token        ${UNIHASH_CA}
UniChain hook         ${UNICHAIN_HOOK_CA}
Token explorer        ${ETHERSCAN_TOKEN_URL}
Hook explorer         ${ETHERSCAN_HOOK_URL}`}</CodeBlock>
            <p className="mt-6 text-sm leading-relaxed text-zinc-400">
              The site should lead with $CHAIN as the live burn-token primitive, then introduce molecular
              Chains as the NFT expansion that can be connected by a separate contract.
            </p>
            <p className="mt-6 border-t border-zinc-800 pt-6 text-xs leading-relaxed text-zinc-500">
              Live UniChain deployment on Ethereum mainnet. Technical specification only — not financial or
              legal advice.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <a
                href="/"
                className="border border-zinc-700 px-5 py-3 text-xs uppercase tracking-widest text-zinc-300 transition-colors hover:border-fluor hover:text-fluor"
              >
                ← Back to landing
              </a>
              <a
                href="/#wallet"
                className="border border-fluor bg-fluor px-5 py-3 text-xs uppercase tracking-widest text-black transition-opacity hover:opacity-90"
              >
                Connect wallet ↗
              </a>
            </div>
          </DocCard>
        </div>

        <footer className="mx-auto mt-4 max-w-4xl border-t border-zinc-800 py-8 text-center text-[10px] uppercase tracking-[0.3em] text-fluor">
          © 2026 UniChain · on-chain &amp; verifiable · $CHAIN
        </footer>
      </main>
      </div>
    </>
  );
}
