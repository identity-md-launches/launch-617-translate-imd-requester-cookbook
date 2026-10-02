import { describe, expect, it } from 'vitest';
import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App.tsx';
import { SITE, errors, limits, recipes } from './content/index.ts';
import { routeFromHash } from './lib/router.ts';

function go(hash: string) {
  act(() => {
    window.location.hash = hash;
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  });
}

describe('router', () => {
  it('maps hashes to routes and ignores in-page anchors', () => {
    expect(routeFromHash('')).toBe('');
    expect(routeFromHash('#/')).toBe('');
    expect(routeFromHash('#/job-open')).toBe('job-open');
    expect(routeFromHash('#/errors/')).toBe('errors');
    expect(routeFromHash('#main')).toBeNull();
    expect(routeFromHash('#s-check')).toBeNull();
  });
});

describe('app', () => {
  it('shows the experimental banner, the overview and one nav link per page', () => {
    render(<App />);
    expect(screen.getByRole('note', { name: '实验声明' })).toHaveTextContent(SITE.banner);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(SITE.name);
    const nav = screen.getByRole('navigation', { name: '页面' });
    for (const r of recipes) expect(within(nav).getByRole('link', { name: r.action })).toBeInTheDocument();
    expect(within(nav).getByRole('link', { name: 'llms.txt' })).toHaveAttribute('href', 'llms.txt');
    expect(screen.getByText('通过 IMD 智能体群付费请求委托制作。')).toBeInTheDocument();
  });

  it('navigates to every recipe by hash and renders its stamp and body', () => {
    render(<App />);
    for (const r of recipes) {
      go(`#/${r.slug}`);
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(r.title);
      const stamp = screen.getByRole('group', { name: '示例版本与日期' });
      expect(stamp).toHaveTextContent(r.version);
      expect(stamp).toHaveTextContent(r.checkedOn);
      const nav = screen.getByRole('navigation', { name: '页面' });
      expect(within(nav).getByRole('link', { name: r.action })).toHaveAttribute('aria-current', 'page');
      expect(document.title).toContain(r.title);
      // the body is on the page as JSON
      const json = JSON.stringify({ action: r.action, input: r.body }, null, 2);
      expect(screen.getAllByText((_, el) => el?.tagName === 'CODE' && el.textContent === json).length).toBeGreaterThan(0);
      // every page links the docs
      expect(screen.getAllByRole('link', { name: r.docs[0].label })[0]).toHaveAttribute('href', r.docs[0].href);
    }
  });

  it('keeps the route when the skip link sets an in-page anchor', () => {
    render(<App />);
    go('#/limits');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(limits.title);
    go('#main');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(limits.title);
  });

  it('shows a not-found page for an unknown route', () => {
    render(<App />);
    go('#/nope');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('没有对应页面');
    expect(screen.getByRole('link', { name: '返回概览' })).toHaveAttribute('href', '#/');
  });

  it('copies a recipe body and announces it', async () => {
    // userEvent installs a working clipboard stub on navigator.clipboard
    const user = userEvent.setup();
    render(<App />);
    go('#/schedule-topup');
    const btn = screen.getByRole('button', { name: '复制 JSON, schedule.topup 输入' });
    await user.click(btn);
    const expected = JSON.stringify({ action: 'schedule.topup', input: recipes.find((r) => r.slug === 'schedule-topup')!.body }, null, 2);
    expect(await navigator.clipboard.readText()).toBe(expected);
    expect(screen.getAllByRole('status').some((s) => s.textContent === '已复制')).toBe(true);
    expect(btn).toHaveTextContent('已复制');
    expect(btn).toHaveAccessibleName('已复制, schedule.topup 输入');
  });

  it('filters the error catalog by text and place, and offers a way out of an empty result', async () => {
    const user = userEvent.setup();
    render(<App />);
    go('#/errors');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('错误目录');
    expect(screen.getByRole('status')).toHaveTextContent(`共 ${errors.length} 个错误码`);
    for (const code of ['invalid_input', 'protected_path', 'payer_not_owner', 'evaluation_unavailable', 'launch_token']) {
      expect(screen.getByRole('heading', { level: 3, name: code })).toBeInTheDocument();
    }
    await user.type(screen.getByLabelText('查找错误码'), 'protected');
    expect(screen.getByRole('heading', { level: 3, name: 'protected_path' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 3, name: 'invalid_input' })).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent(`显示 1 个，共 ${errors.length} 个错误码`);

    await user.selectOptions(screen.getByLabelText('出现阶段'), 'submit');
    expect(screen.getByText(/没有匹配的错误码/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '清除筛选' }));
    expect(screen.getByRole('status')).toHaveTextContent(`共 ${errors.length} 个错误码`);
    expect(screen.getByLabelText('查找错误码')).toHaveValue('');
  });
});
