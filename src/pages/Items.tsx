import { useState } from 'react';
import { useItems } from '../hooks/useItems';
import { useSessions } from '../hooks/useSessions';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import type { Item } from '../models/Item';
import './Items.css';

// Preset colors for items
const PRESET_COLORS = [
    '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e',
    '#f97316', '#eab308', '#22c55e', '#14b8a6',
    '#06b6d4', '#3b82f6', '#a855f7', '#d946ef',
];

export function Items() {
    const { items, archivedItems, addItem, updateItem, archiveItem, restoreItem, deleteItem } = useItems();
    const { deleteSessionsByItemId } = useSessions();

    const [showArchived, setShowArchived] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Item | null>(null);
    const [archiveTarget, setArchiveTarget] = useState<Item | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Item | null>(null);

    // Form state
    const [formName, setFormName] = useState('');
    const [formColor, setFormColor] = useState(PRESET_COLORS[0]);
    const [formError, setFormError] = useState<string | null>(null);

    const openAddModal = () => {
        setEditingItem(null);
        setFormName('');
        setFormColor(PRESET_COLORS[items.length % PRESET_COLORS.length]);
        setFormError(null);
        setIsModalOpen(true);
    };

    const openEditModal = (item: Item) => {
        setEditingItem(item);
        setFormName(item.name);
        setFormColor(item.color ?? PRESET_COLORS[0]);
        setFormError(null);
        setIsModalOpen(true);
    };

    const handleSubmit = async () => {
        const name = formName.trim();
        if (!name) {
            setFormError('アイテム名を入力してください');
            return;
        }

        if (editingItem) {
            await updateItem(editingItem.id, { name, color: formColor });
        } else {
            await addItem({ name, color: formColor });
        }

        setIsModalOpen(false);
    };

    const handleConfirmArchive = async () => {
        if (!archiveTarget) return;
        await archiveItem(archiveTarget.id);
        setArchiveTarget(null);
    };

    const handleConfirmDelete = async () => {
        if (!deleteTarget) return;
        await deleteSessionsByItemId(deleteTarget.id);
        await deleteItem(deleteTarget.id);
        setDeleteTarget(null);
        setIsModalOpen(false);
    };

    const displayItems = showArchived ? archivedItems : items;

    return (
        <div className="items-page">
            <div className="items-header">
                <h2 className="page-title">アイテム管理</h2>
                <div className="items-actions">
                    <label className="toggle-label">
                        <input
                            type="checkbox"
                            checked={showArchived}
                            onChange={(e) => setShowArchived(e.target.checked)}
                        />
                        <span>アーカイブを表示</span>
                    </label>
                    <button className="add-button" onClick={openAddModal}>
                        ＋ アイテム追加
                    </button>
                </div>
            </div>

            {displayItems.length === 0 ? (
                <p className="empty-message">
                    {showArchived
                        ? 'アーカイブされたアイテムはありません'
                        : 'アイテムがありません。追加してください。'}
                </p>
            ) : (
                <div className="items-list">
                    {displayItems.map((item) => (
                        <div key={item.id} className="item-card">
                            <div
                                className="item-color"
                                style={{ backgroundColor: item.color ?? 'var(--color-primary)' }}
                            />
                            <span className="item-name">{item.name}</span>
                            <div className="item-actions">
                                {showArchived ? (
                                    <>
                                        <button
                                            className="item-action restore"
                                            onClick={() => restoreItem(item.id)}
                                        >
                                            復元
                                        </button>
                                        <button
                                            className="item-action delete"
                                            onClick={() => setDeleteTarget(item)}
                                        >
                                            削除
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            className="item-action edit"
                                            onClick={() => openEditModal(item)}
                                        >
                                            編集
                                        </button>
                                        <button
                                            className="item-action archive"
                                            onClick={() => setArchiveTarget(item)}
                                        >
                                            アーカイブ
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingItem ? 'アイテム編集' : 'アイテム追加'}
            >
                <form
                    className="item-form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                >
                    <div className="form-group">
                        <label className="form-label">アイテム名</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formName}
                            onChange={(e) => setFormName(e.target.value)}
                            placeholder="例: 簿記論"
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">カラー</label>
                        <div className="color-picker">
                            {PRESET_COLORS.map((color) => (
                                <button
                                    key={color}
                                    type="button"
                                    className={`color-option ${formColor === color ? 'selected' : ''}`}
                                    style={{ backgroundColor: color }}
                                    onClick={() => setFormColor(color)}
                                    aria-label={`色を選択: ${color}`}
                                />
                            ))}
                        </div>
                    </div>

                    {formError && <p className="form-error">{formError}</p>}

                    <div className="form-actions">
                        {editingItem && (
                            <button
                                type="button"
                                className="form-button delete-link"
                                onClick={() => setDeleteTarget(editingItem)}
                            >
                                完全に削除
                            </button>
                        )}
                        <div style={{ flex: 1 }} />
                        <button
                            type="button"
                            className="form-button cancel"
                            onClick={() => setIsModalOpen(false)}
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
                isOpen={archiveTarget !== null}
                title="アイテムをアーカイブしますか？"
                message="アーカイブしても過去のセッションは保持されます。後から復元も可能です。"
                confirmLabel="アーカイブ"
                cancelLabel="キャンセル"
                onConfirm={handleConfirmArchive}
                onCancel={() => setArchiveTarget(null)}
            />

            <ConfirmDialog
                isOpen={deleteTarget !== null}
                title="アイテムを完全に削除しますか？"
                message={`「${deleteTarget?.name}」とその統計データがすべて削除されます。この操作は取り消せません。`}
                confirmLabel="完全に削除する"
                cancelLabel="キャンセル"
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteTarget(null)}
            />
        </div>
    );
}
