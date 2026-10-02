import { renderInline } from '../lib/inline.tsx';
import type { Recipe } from '../content/types.ts';
import { SITE } from '../content/index.ts';
import { CodeBlock, DocsLinks, SectionView } from '../components/Blocks.tsx';

function curlFor(action: string, input: unknown, route: 'check' | 'quote'): string {
  const payload = route === 'check' ? { action, input } : { requestKey: 'REQUEST_KEY', action, input };
  const auth = route === 'quote' ? `  -H "Authorization: Bearer $IMD_PAID_TOKEN" \\\n` : '';
  return `curl --fail-with-body -X POST "${SITE.api}/requests/${route}" \\\n${auth}  -H 'Content-Type: application/json' \\\n  --data-binary @- <<'EOF'\n${JSON.stringify(payload, null, 2)}\nEOF`;
}

export function RecipeView({ recipe }: { recipe: Recipe }) {
  const quoteBody = { action: recipe.action, input: recipe.body };
  return (
    <article>
      <header className="page-head">
        <h1>{recipe.title}</h1>
        <p className="lead">{renderInline(recipe.lead)}</p>
        <dl className="stamp" role="group" aria-label="示例版本与日期">
          <div>
            <dt>操作</dt>
            <dd>
              <code>{recipe.action}</code>
            </dd>
          </div>
          <div>
            <dt>版本</dt>
            <dd>
              <code>{recipe.version}</code>
            </dd>
          </div>
          <div>
            <dt>价格</dt>
            <dd className="num">{recipe.price}</dd>
          </div>
          <div>
            <dt>检查日期</dt>
            <dd className="num">{recipe.checkedOn}</dd>
          </div>
          <div>
            <dt>控制平面</dt>
            <dd>
              <code>{SITE.controlPlaneCommit}</code>
            </dd>
          </div>
        </dl>
        <DocsLinks docs={recipe.docs} />
      </header>

      <section aria-labelledby="s-body">
        <h2 id="s-body">{recipe.checkBody ? '请求体' : '通过检查的请求体'}</h2>
        {recipe.checkBody ? (
          <>
            <p>
              检查接收简写形式，请发送至 <code>POST /requests/check</code>:
            </p>
            <CodeBlock lang="json" title="检查输入" code={JSON.stringify({ action: recipe.action, input: recipe.checkBody }, null, 2)} />
            <p>
              将检查返回的完整请求体发送至 <code>POST /requests/quote</code>:
            </p>
            <CodeBlock lang="json" title="报价输入" code={JSON.stringify(quoteBody, null, 2)} />
          </>
        ) : (
          <CodeBlock lang="json" title={`${recipe.action} 输入`} code={JSON.stringify(quoteBody, null, 2)} />
        )}
        <details className="disclosure">
          <summary>使用 curl 运行</summary>
          <CodeBlock lang="bash" title="免费检查" code={curlFor(recipe.action, recipe.checkBody ?? recipe.body, 'check')} />
          <CodeBlock lang="bash" title="报价（需要请求令牌和新的 UUID）" code={curlFor(recipe.action, recipe.body, 'quote')} />
        </details>
        <aside className="note">
          <p>
            <strong>{recipe.checkedOn} 的检查结果。</strong> {renderInline(recipe.checkResult)}
          </p>
        </aside>
      </section>

      {recipe.sections.map((s) => (
        <SectionView key={s.id} section={s} />
      ))}
    </article>
  );
}
