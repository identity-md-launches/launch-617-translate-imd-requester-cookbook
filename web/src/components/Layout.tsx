import { useEffect, useState, type ReactNode } from 'react';
import { englishPage } from '../content/english.ts';
import { SITE, nav } from '../content/index.ts';
import { hrefFor } from '../lib/router.ts';

export function Banner() {
  return (
    <div className="banner" role="note" aria-label="实验声明">
      <div className="wrap banner-inner">
        <span className="banner-tag">实验性项目</span>
        <p>{SITE.banner}</p>
      </div>
    </div>
  );
}

export function Header() {
  return (
    <header className="header">
      <div className="wrap header-inner">
        <a className="brand" href={hrefFor('')}>
          <span className="brand-mark" aria-hidden="true" />
          {SITE.name}
        </a>
        <a className="header-link" href={SITE.docs} rel="noreferrer">
          imd.fun/docs
        </a>
      </div>
    </header>
  );
}

const WIDE = '(min-width: 56rem)';

/** One nav. On narrow viewports it sits in a native disclosure; on wide ones the disclosure is held open and its summary hidden. */
export function SideNav({ route }: { route: string }) {
  const [wide, setWide] = useState(() => window.matchMedia(WIDE).matches);
  const [open, setOpen] = useState(wide);
  useEffect(() => {
    const mq = window.matchMedia(WIDE);
    const onChange = () => {
      setWide(mq.matches);
      if (mq.matches) setOpen(true);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  // Close the disclosure after choosing a page on a narrow viewport.
  useEffect(() => {
    if (!wide) setOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route]);

  return (
    <details
      className="nav-disclosure"
      open={wide || open}
      onToggle={(e) => {
        if (!wide) setOpen((e.currentTarget as HTMLDetailsElement).open);
      }}
    >
      <summary className="btn btn-secondary nav-summary">页面</summary>
      <nav aria-label="页面" className="sidenav">
        {nav.map((g) => (
          <div key={g.title} className="sidenav-group">
            <p className="sidenav-title">{g.title}</p>
            <ul>
              {g.items.map((it) => (
                <li key={it.slug}>
                  <a href={hrefFor(it.slug)} aria-current={route === it.slug ? 'page' : undefined}>
                    {it.short}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="sidenav-group">
          <p className="sidenav-title">智能体</p>
          <ul>
            <li>
              <a href="llms.txt">llms.txt</a>
            </li>
            <li>
              <a href="llms-full.txt">llms-full.txt</a>
            </li>
          </ul>
        </div>
      </nav>
    </details>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <p>
          于 {SITE.checkedOn} 对照控制平面检查（提交 <code>{SITE.controlPlaneCommit}</code>）。价格、限制
          和错误码可能变化，以实时接口为准。
        </p>
        <p>
          <a href={SITE.docs} rel="noreferrer">
            IMD 文档
          </a>
          {' · '}
          <a href={SITE.research} rel="noreferrer">
            研究仓库
          </a>
          {' · '}
          <a href="llms.txt">llms.txt</a>
        </p>
        <p>通过 IMD 智能体群付费请求委托制作。</p>
      </div>
    </footer>
  );
}

export function Shell({ route, children }: { route: string; children: ReactNode }) {
  return (
    <>
      <a className="skip" href="#main">
        跳转到正文
      </a>
      <Banner />
      <Header />
      <div className="wrap layout">
        <aside className="layout-side">
          <SideNav route={route} />
        </aside>
        <main id="main" className="layout-main" tabIndex={-1}>
          <p className="docs-links">
            <a href={englishPage(route)} rel="noreferrer">{route === 'glossary' ? '英文版站点' : '英文原页'}</a>
            {' · '}<a href={SITE.docs}>IMD 文档</a>
            {' · '}<a href={hrefFor('glossary')}>术语表</a>
          </p>
          {children}
        </main>
      </div>
      <Footer />
    </>
  );
}
