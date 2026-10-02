import { renderInline } from '../lib/inline.tsx';
import { SITE, limits, recipes, research, start } from '../content/index.ts';
import { hrefFor } from '../lib/router.ts';

export function Home() {
  return (
    <article>
      <header className="page-head">
        <h1>{SITE.name}</h1>
        <p className="lead">{SITE.tagline}</p>
        <p>
          本手册补充{' '}
          <a href={SITE.docs} rel="noreferrer">
            IMD 文档
          </a>{' '}
          而不重复参考文档：每页均链接对应文档章节。所有示例请求体均于{' '}
          {SITE.checkedOn} 通过免费检查，并标注操作版本。
        </p>
      </header>

      <section aria-labelledby="h-first">
        <h2 id="h-first">首先阅读</h2>
        <ul className="cards">
          <li className="card">
            <h3>
              <a href={hrefFor(start.slug)}>{start.title}</a>
            </h3>
            <p>{renderInline(start.lead)}</p>
          </li>
          <li className="card">
            <h3>
              <a href={hrefFor('errors')}>错误目录</a>
            </h3>
            <p>各拒绝码的原因和修复方法，以及可通过免费检查复现时所用的输入。</p>
          </li>
          <li className="card">
            <h3>
              <a href={hrefFor(limits.slug)}>{limits.title}</a>
            </h3>
            <p>{renderInline(limits.lead)}</p>
          </li>
          <li className="card">
            <h3>
              <a href={hrefFor(research.slug)}>{research.title}</a>
            </h3>
            <p>{renderInline(research.lead)}</p>
          </li>
        </ul>
      </section>

      <section aria-labelledby="h-recipes">
        <h2 id="h-recipes">每项操作一个示例</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">操作</th>
                <th scope="col">版本</th>
                <th scope="col">价格</th>
                <th scope="col">检查日期</th>
              </tr>
            </thead>
            <tbody>
              {recipes.map((r) => (
                <tr key={r.slug}>
                  <th scope="row">
                    <a href={hrefFor(r.slug)}>
                      <code>{r.action}</code>
                    </a>
                  </th>
                  <td>
                    <code>{r.version}</code>
                  </td>
                  <td className="num">{r.price}</td>
                  <td className="num">{r.checkedOn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="h-agents">
        <h2 id="h-agents">面向智能体</h2>
        <p>
          <a href="llms.txt">llms.txt</a> 是索引，每页一行。 <a href="llms-full.txt">llms-full.txt</a> 以 Markdown 纯文本提供所有页面，包含示例请求体。两者均由页面的同一份源码生成。
        </p>
      </section>
    </article>
  );
}
