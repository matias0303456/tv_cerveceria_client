import { useNavigate } from 'react-router-dom'

import Logo from '../../../public/logo.png'

export function Layout({ children }) {

    const navigate = useNavigate()

    return (
        <>
            <header>
                <div id='logo'>
                    <img src={Logo} alt="Logo cerveza Asgardiana" />
                </div>
                <nav>
                    <ul>
                        <li onClick={() => navigate('/')}>Registros</li>
                        <li onClick={() => navigate('/recipes')}>Recetas</li>
                        <li onClick={() => navigate('/ingredients')}>Ingredientes</li>
                        <li onClick={() => navigate('/alarms')}>Alarmas</li>
                    </ul>
                </nav>
            </header>
            <main>
                {children}
            </main>
            <footer>
                Asgardiana &copy; {new Date().getFullYear()}
            </footer>
        </>
    )
}