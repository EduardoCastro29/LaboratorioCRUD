import { Link } from 'react-router' //Esto permite importar la libreria para ocupar react-Router

const Nav = () => {
  return (
    <nav className="bg-[#E7F0C7] text-black shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-center items-center">
        {/* Se usa una lista horizontal para los enlaces de navegación. */}
        <ul className="flex space-x-4">
          <li>
            <Link to="/home" className="hover:text-orange-400 ">
              Inicio
            </Link>
          </li>
          <li>
            <Link to="/products" className="hover:text-orange-400">
              Libros
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Nav
