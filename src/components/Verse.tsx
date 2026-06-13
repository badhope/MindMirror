// 镜心 · 古文-白话 双行排版

type Props = { text: string; gloss?: string };

export function Verse({ text, gloss }: Props) {
  return (
    <div className="jx-verse">
      <span className="ancient">「{text}」</span>
      {gloss && <span className="gloss">—— {gloss}</span>}
    </div>
  );
}
