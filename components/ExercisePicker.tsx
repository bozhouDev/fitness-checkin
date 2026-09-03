"use client";

import { useMemo, useState } from "react";
import { EXERCISE_LIBRARY, BODY_PARTS } from "@/lib/data";

type Props = {
  open: boolean;
  onClose: () => void;
  /** 选中动作名称 */
  onPick: (name: string, part: string) => void;
  /** 已添加的动作名，列表中置灰 */
  existingNames: string[];
};

export default function ExercisePicker({
  open,
  onClose,
  onPick,
  existingNames,
}: Props) {
  const [query, setQuery] = useState("");
  const [part, setPart] = useState<string>("全部");
  const [custom, setCustom] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim();
    return BODY_PARTS.filter((p) => part === "全部" || p === part)
      .map((p) => ({
        part: p,
        items: EXERCISE_LIBRARY[p].filter((n) => !q || n.includes(q)),
      }))
      .filter((g) => g.items.length > 0);
  }, [query, part]);

  if (!open) return null;

  const handlePick = (name: string, p: string) => {
    onPick(name, p);
    setQuery("");
    setCustom("");
    onClose();
  };

  return (
    <>
      <div className="sheet-mask" onClick={onClose} />
      <div className="sheet">
        <div className="sheet-head">
          <span className="sheet-title">选择动作</span>
          <button className="sheet-close" onClick={onClose} aria-label="关闭">
            ✕
          </button>
        </div>
        <div className="sheet-body">
          <input
            className="input"
            placeholder="搜索动作…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <div className="part-tabs">
            {["全部", ...BODY_PARTS].map((p) => (
              <button
                key={p}
                className={`part-tab ${part === p ? "active" : ""}`}
                onClick={() => setPart(p)}
              >
                {p}
              </button>
            ))}
          </div>

          {filtered.map((g) => (
            <div key={g.part}>
              <div className="section-label">{g.part}</div>
              {g.items.map((name) => {
                const added = existingNames.includes(name);
                return (
                  <button
                    key={name}
                    className="ex-option"
                    style={added ? { opacity: 0.4 } : undefined}
                    disabled={added}
                    onClick={() => handlePick(name, g.part)}
                  >
                    <span>{name}</span>
                    <span className="ex-add-icon">{added ? "已添加" : "+"}</span>
                  </button>
                );
              })}
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="empty-state">没有找到匹配的动作，试试自己输入</div>
          )}

          <div className="custom-ex-row">
            <input
              className="input"
              placeholder="没有找到？直接输入新动作"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && custom.trim())
                  handlePick(custom.trim(), "自定义");
              }}
            />
            <button
              className="btn btn-primary"
              disabled={!custom.trim()}
              onClick={() => custom.trim() && handlePick(custom.trim(), "自定义")}
            >
              添加
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
