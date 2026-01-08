import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useItems } from '../hooks/useItems';
import { useSessions } from '../hooks/useSessions';
import { formatDuration } from '../hooks/useAggregation';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import type { Session } from '../models/Session';
import './History.css';

export function History() {
    const { allItems, getItemById } = useItems();
    const { sessions, updateSession, deleteSession } = useSessions();

    const [editingSession, setEditingSession] = useState<Session | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Session | null>(null);
    const [filterItemId, setFilterItemId] = useState<string>('');

    // Edit form state
    const [editItemId, setEditItemId] = useState('');
    const [editStartAt, setEditStartAt] = useState('');
    const [editEndAt, setEditEndAt] = useState('');
    const [editError, setEditError] = useState<string | null>(null);

    const filteredSessions = useMemo(() => {
        if (!filterItemId) return sessions;
        return sessions.filter((s) => s.itemId === filterItemId);
    }, [sessions, filterItemId]);

    const openEditModal = (session: Session) => {
        setEditingSession(session);
        setEditItemId(session.itemId);
        setEditStartAt(session.startAt.slice(0, 16)); // Format for datetime-local
        setEditEndAt(session.endAt ? session.endAt.slice(0, 16) : '');
        setEditError(null);
    };

    const handleSaveEdit = async () => {
        if (!editingSession) return;

        const startDate = new Date(editStartAt);
        const endDate = editEndAt ? new Date(editEndAt) : null;

        if (endDate && endDate < startDate) {
            setEditError('終了時刻は開始時刻より後にしてください');
            return;
        }

        await updateSession(editingSession.id, {
            itemId: editItemId,
            startAt: startDate.toISOString(),
            endAt: endDate ? endDate.toISOString() : null,
        });

        setEditingSession(null);
    };

    const handleConfirmDelete = async () => {
        if (!deleteTarget) return;
        await deleteSession(deleteTarget.id);
        setDeleteTarget(null);
    };

    const formatDateTime = (isoString: string): string => {
        return format(new Date(isoString), 'M/d HH:mm', { locale: ja });
    };

    const getSessionDuration = (session: Session): number => {
        const start = new Date(session.startAt).getTime();
        const end = session.endAt ? new Date(session.endAt).getTime() : Date.now();
        return Math.floor((end - start) / 1000);
    };

    return (
        <div className="history">
            <div className="history-header">
                <h2 className="page-title">履歴</h2>
                <div className="history-filter">
                    <select
                        value={filterItemId}
                        onChange={(e) => setFilterItemId(e.target.value)}
                        className="filter-select"
                    >
                        <option value="">すべてのアイテム</option>
                        {allItems.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {filteredSessions.length === 0 ? (
                <p className="empty-message">セッションがありません</p>
            ) : (
                <div className="sessions-list">
                    {filteredSessions.map((session) => {
                        const item = getItemById(session.itemId);
                        return (
                            <div key={session.id} className="session-card">
                                <div
                                    className="session-color-bar"
                                    style={{ backgroundColor: item?.color ?? 'var(--color-primary)' }}
                                />
                                <div className="session-content">
                                    <div className="session-main">
                                        <span className="session-item-name">
                                            {item?.name ?? '不明'}
                                            {!session.endAt && <span className="running-badge">稼働中</span>}
                                        </span>
                                        <span className="session-duration">
                                            {formatDuration(getSessionDuration(session))}
                                        </span>
                                    </div>
                                    <div className="session-time">
                                        {formatDateTime(session.startAt)}
                                        {' → '}
                                        {session.endAt ? formatDateTime(session.endAt) : '進行中'}
                                    </div>
                                </div>
                                <div className="session-actions">
                                    <button
                                        className="action-button edit"
                                        onClick={() => openEditModal(session)}
                                    >
                                        編集
                                    </button>
                                    <button
                                        className="action-button delete"
                                        onClick={() => setDeleteTarget(session)}
                                    >
                                        削除
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <Modal
                isOpen={editingSession !== null}
                onClose={() => setEditingSession(null)}
                title="セッション編集"
            >
                <form
                    className="edit-form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSaveEdit();
                    }}
                >
                    <div className="form-group">
                        <label className="form-label">アイテム</label>
                        <select
                            className="form-select"
                            value={editItemId}
                            onChange={(e) => setEditItemId(e.target.value)}
                        >
                            {allItems.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">開始時刻</label>
                        <input
                            type="datetime-local"
                            className="form-input"
                            value={editStartAt}
                            onChange={(e) => setEditStartAt(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">終了時刻</label>
                        <input
                            type="datetime-local"
                            className="form-input"
                            value={editEndAt}
                            onChange={(e) => setEditEndAt(e.target.value)}
                        />
                        <small className="form-hint">空欄の場合は進行中となります</small>
                    </div>

                    {editError && <p className="form-error">{editError}</p>}

                    <div className="form-actions">
                        <button
                            type="button"
                            className="form-button cancel"
                            onClick={() => setEditingSession(null)}
                        >
                            キャンセル
                        </button>
                        <button type="submit" className="form-button primary">
                            保存
                        </button>
                    </div>
                </form>
            </Modal>

            <ConfirmDialog
                isOpen={deleteTarget !== null}
                title="セッションを削除しますか？"
                message="この操作は取り消せません。"
                confirmLabel="削除"
                cancelLabel="キャンセル"
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteTarget(null)}
                variant="danger"
            />
        </div>
    );
}
