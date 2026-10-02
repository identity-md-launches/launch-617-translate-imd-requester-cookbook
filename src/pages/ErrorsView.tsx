import { useId, useMemo, useState } from 'react';
import { SITE, errors } from '../content/index.ts';
import type { ErrorEntry } from '../content/types.ts';
import { DocsLinks } from '../components/Blocks.tsx';
import { renderInline } from '../lib/inline.tsx';

const WHERE: { value: ErrorEntry['where'] | 'all'; label: string }[] = [
  { value: 'all', label: '所有阶段' },
  { value: 'check', label: '检查或报价时' },
  { value: 'quote', label: '仅报价时' },
  { value: 'submit', label: '提交（付款）时' },
  { value: 'read', label: '公开读取时' },
  { value: 'run', label: '工作运行期间' },
];

function matches(e: ErrorEntry, q: string, where: string): boolean {
  if (where !== 'all' && e.where !== where) return false;
  if (!q) return true;
  const hay = `${e.code} ${e.cause} ${e.fix} ${e.observed}`.toLowerCase();
  return hay.includes(q);
}

export function ErrorsView() {
  const [query, setQuery] = useState('');
  const [where, setWhere] = useState('all');
  const qId = useId();
  const wId = useId();
  const q = query.trim().toLowerCase();
  const shown = useMemo(() => errors.filter((e) => matches(e, q, where)), [q, where]);
  const required = shown.filter((e) => e.required);
  const rest = shown.filter((e) => !e.required);
  const filtered = q !== '' || where !== 'all';

  return (
    <article>
      <header className="page-head">
        <h1>错误目录</h1>
        <p className="lead">
          列出请求者可能遇到的拒绝码、原因和修复方法。通过免费检查和公开读取探测的日期为{' '}
          {SITE.checkedOn}；对于需要付款才会出现的代码，各条目明确注明未复现。
        </p>
        <DocsLinks
          docs={[
            { label: '错误', href: `${SITE.docs}#errors` },
            { label: '付费请求的错误与限制', href: `${SITE.docs}#paid` },
          ]}
        />
      </header>

      <form className="filters" role="search" aria-label="筛选错误目录" onSubmit={(e) => e.preventDefault()}>
        <div className="field">
          <label htmlFor={qId}>查找错误码</label>
          <input
            id={qId}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="invalid_plan"
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <div className="field">
          <label htmlFor={wId}>出现阶段</label>
          <select id={wId} value={where} onChange={(e) => setWhere(e.target.value)}>
            {WHERE.map((w) => (
              <option key={w.value} value={w.value}>
                {w.label}
              </option>
            ))}
          </select>
        </div>
        <p role="status" className="filters-status">
          {shown.length === errors.length ? `共 ${errors.length} 个错误码` : `显示 ${shown.length} 个，共 ${errors.length} 个错误码`}
        </p>
      </form>

      {shown.length === 0 ? (
        <div className="empty">
          <p className="empty-title">没有匹配的错误码： {query ? `"${query}"` : '所选阶段'}</p>
          <p>根据错误码名称、原因、修复方法和观察记录进行匹配。</p>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setQuery('');
              setWhere('all');
            }}
          >
            清除筛选
          </button>
        </div>
      ) : (
        <>
          {required.length > 0 && (
            <section aria-labelledby="s-required">
              <h2 id="s-required">原任务指定的错误码</h2>
              {required.map((e) => (
                <ErrorCard key={e.code} entry={e} />
              ))}
            </section>
          )}
          {rest.length > 0 && (
            <section aria-labelledby="s-other">
              <h2 id="s-other">其他常见错误码</h2>
              {rest.map((e) => (
                <ErrorCard key={e.code} entry={e} />
              ))}
            </section>
          )}
          {filtered && (
            <p>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setQuery('');
                  setWhere('all');
                }}
              >
                清除筛选
              </button>
            </p>
          )}
        </>
      )}
    </article>
  );
}

function ErrorCard({ entry }: { entry: ErrorEntry }) {
  const id = `e-${entry.code.replace(/[^a-z0-9_]/gi, '-')}`;
  return (
    <article className="error" aria-labelledby={`${id}-h`} id={id}>
      <h3 id={`${id}-h`}>
        <code>{entry.code}</code>
      </h3>
      <p className="error-where">
        <span className="pill">{WHERE.find((w) => w.value === entry.where)?.label}</span> {entry.status}
      </p>
      <dl className="error-body">
        <dt>原因</dt>
        <dd>{renderInline(entry.cause)}</dd>
        <dt>修复</dt>
        <dd>{renderInline(entry.fix)}</dd>
        <dt>观察记录</dt>
        <dd>{renderInline(entry.observed)}</dd>
      </dl>
      <p className="error-docs">
        <a href={`${SITE.docs}#${entry.docs}`} rel="noreferrer">
          阅读 {entry.code} 对应的文档章节
        </a>
      </p>
    </article>
  );
}
