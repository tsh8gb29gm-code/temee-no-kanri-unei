import { NavLink } from 'react-router-dom';
import './Header.css';

export function Header() {
    return (
        <header className="header">
            <h1 className="header-title">てめえの管理運営</h1>
            <nav className="header-nav">
                <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    ダッシュボード
                </NavLink>
                <NavLink to="/history" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    履歴
                </NavLink>
                <NavLink to="/items" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    アイテム
                </NavLink>
                <NavLink to="/settings" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    設定
                </NavLink>
            </nav>
        </header>
    );
}
