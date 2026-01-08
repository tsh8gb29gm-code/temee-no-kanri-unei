import './ItemButton.css';

interface ItemButtonProps {
    name: string;
    color?: string;
    isActive: boolean;
    onClick: () => void;
}

export function ItemButton({ name, color, isActive, onClick }: ItemButtonProps) {
    const buttonStyle = color
        ? { '--item-color': color } as React.CSSProperties
        : undefined;

    return (
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
    );
}
