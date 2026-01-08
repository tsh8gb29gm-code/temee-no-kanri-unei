import './KPICard.css';

interface KPICardProps {
    label: string;
    value: string;
    icon?: string;
    accent?: string;
}

export function KPICard({ label, value, icon, accent }: KPICardProps) {
    return (
        <div className="kpi-card" style={accent ? { '--accent-color': accent } as React.CSSProperties : undefined}>
            {icon && <span className="kpi-icon">{icon}</span>}
            <div className="kpi-content">
                <span className="kpi-label">{label}</span>
                <span className="kpi-value">{value}</span>
            </div>
        </div>
    );
}
