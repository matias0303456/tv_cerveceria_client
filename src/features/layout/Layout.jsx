import Logo from '../../../public/logo.png'

export function Layout({ children }) {
    return (
        <>
            <header>
                <img src={Logo} alt="Logo cerveza Asgardiana" />
                <nav>
                    <ul>
                        <li>Inicio</li>
                        <li>Registros</li>
                        <li>Recetas</li>
                        <li>Ingredientes</li>
                        <li>Alarmas</li>
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