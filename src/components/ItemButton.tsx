import './ItemButton.css';

interface ItemButtonProps {
    name: string;
    color?: string;
    isActive: boolean;
    onClick: () => void;
    onDelete?: () => void;
}

export function ItemButton({ name, color, isActive, onClick, onDelete }: ItemButtonProps) {
    const buttonStyle = color
        ? { '--item-color': color } as React.CSSProperties
        : undefined;

    return (
        <div className="item-button-wrapper">
            <button
                className={`item-button ${isActive ? 'active' : ''}`}
                style={buttonStyle}
                onClick={onClick}
            >
                <span className="item-name">{name}</span>
                {isActive && (
                    <span className="item-indicator">
                        <span className="pulse"></span>
                        稼働中
                    </span>
                )}
            </button>
            {onDelete && (
                <button
                    className="item-delete-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}
                    aria-label="削除"
                >
                    ×
                </button>
            )}
        </div>
    );
}
