import { useLocation, useNavigate } from 'react-router-dom'

import Logo from '../../../public/logo.png'

export function Layout({ children }) {

    const navigate = useNavigate()
    const { pathname } = useLocation()

    return (
        <>
            <header>
                <div id='logo'>
                    <img src={Logo} alt="Logo cerveza Asgardiana" />
                </div>
                <nav>
                    <ul>
                        <li onClick={() => navigate('/')} className={pathname === '/' ? 'currentPage' : ''}>
                            Registros
                        </li>
                        <li onClick={() => navigate('/recipes')} className={pathname === '/recipes' ? 'currentPage' : ''}>
                            Recetas
                        </li>
                        <li onClick={() => navigate('/ingredients')} className={pathname === '/ingredients' ? 'currentPage' : ''}>
                            Ingredientes
                        </li>
                    </ul>
                </nav>
            </header>
            <main>
                {children}
            </main>
            <footer>
                Cerveza Asgardiana &copy; {new Date().getFullYear()}
            </footer>
        </>
    )
}