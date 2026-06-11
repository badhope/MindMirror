// 镜心 · i18n 入口
// useT() 返回当前 locale 的字典
// 用法：const t = useT(); t.ui.appName / t.path.start / t.way.finishTitle(3)

import { useStore } from '../store';
import { zh, type Dict } from './zh';
import { en } from './en';

const DICTS: Record<'zh' | 'en', Dict> = { zh, en };

export function useT(): Dict {
  const locale = useStore(s => s.locale);
  return DICTS[locale];
}

export type { Dict };
