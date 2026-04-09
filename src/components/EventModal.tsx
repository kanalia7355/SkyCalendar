import { useState, useEffect, type FormEvent } from 'react';
import type { CalendarEvent } from '../types/weather';

const COLORS = [
  { value: '#F44336', label: '赤' },
  { value: '#FF9800', label: 'オレンジ' },
  { value: '#4CAF50', label: '緑' },
  { value: '#2196F3', label: '青' },
  { value: '#9C27B0', label: '紫' },
  { value: '#E91E63', label: 'ピンク' },
  { value: '#009688', label: 'ティール' },
  { value: '#607D8B', label: 'グレー' },
];

interface Props {
  initialDate?: string;
  event?: CalendarEvent;
  onSave: (event: CalendarEvent) => void;
  onDelete?: (id: string) => void;
  onClose: () => void;
}

export function EventModal({ initialDate, event, onSave, onDelete, onClose }: Props) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [notes, setNotes] = useState('');
  const [color, setColor] = useState(COLORS[3].value);

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDate(event.date);
      setStartTime(event.startTime ?? '');
      setEndTime(event.endTime ?? '');
      setNotes(event.notes ?? '');
      setColor(event.color);
    } else {
      setDate(initialDate ?? '');
    }
  }, [event, initialDate]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !date) return;
    onSave({
      id: event?.id ?? crypto.randomUUID(),
      title: title.trim(),
      date,
      startTime: startTime || undefined,
      endTime: endTime || undefined,
      notes: notes || undefined,
      color,
    });
    onClose();
  }

  function handleDelete() {
    if (event && onDelete) {
      onDelete(event.id);
      onClose();
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header" style={{ borderTopColor: color }}>
          <h2 className="modal-title">{event ? '予定を編集' : '予定を追加'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          {/* Color picker */}
          <div className="color-picker">
            {COLORS.map(c => (
              <button
                key={c.value}
                type="button"
                className={`color-swatch${color === c.value ? ' selected' : ''}`}
                style={{ background: c.value }}
                title={c.label}
                onClick={() => setColor(c.value)}
              />
            ))}
          </div>

          <div className="form-group">
            <label className="form-label">タイトル <span className="required">*</span></label>
            <input
              className="form-input"
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="予定のタイトル"
              autoFocus
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">日付 <span className="required">*</span></label>
            <input
              className="form-input"
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">開始時刻</label>
              <input
                className="form-input"
                type="time"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">終了時刻</label>
              <input
                className="form-input"
                type="time"
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">メモ</label>
            <textarea
              className="form-input form-textarea"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="メモを入力"
              rows={3}
            />
          </div>

          <div className="modal-actions">
            {event && onDelete && (
              <button type="button" className="btn-delete" onClick={handleDelete}>
                削除
              </button>
            )}
            <div className="modal-actions-right">
              <button type="button" className="btn-cancel" onClick={onClose}>
                キャンセル
              </button>
              <button type="submit" className="btn-save" style={{ background: color }}
                disabled={!title.trim() || !date}>
                保存
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
