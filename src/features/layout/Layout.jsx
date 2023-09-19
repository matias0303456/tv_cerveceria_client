import Logo from '../../../public/logo.png'

export function Layout({ children }) {
    return (
        <>
            <header>
                <img src={Logo} alt="Logo cerveza Asgardiana" width={130} />
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