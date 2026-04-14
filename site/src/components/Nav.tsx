import { NavLink } from 'react-router-dom'
import { navLinks } from '../content/nav'
import Logo from './Logo'

export default function Nav() {
  return (
    <>
      {/* Sidebar — medium screens and up */}
      <aside className="hidden md:flex flex-col fixed top-0 left-0 h-screen w-48 p-6 border-r border-gray-800 bg-[#1a1714]">
        <NavLink to="/" className="mb-6 flex justify-center">
          <Logo size={40} />
        </NavLink>
        <div className="border-b border-[#e8d44d] mb-6" />
        <nav className="flex flex-col gap-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                isActive ? 'group' : 'group opacity-60 hover:opacity-100 transition-all duration-200'
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`font-medium block text-sm transition-colors duration-200 ${isActive ? 'text-[#e8d44d]' : 'text-white group-hover:text-[#5fbcd3]'}`}>
                    {link.label}
                  </span>
                  <span className="text-xs text-gray-500 group-hover:text-[#5fbcd3] transition-colors duration-200">{link.description}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Top bar — mobile only */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-black">
        <NavLink to="/" className="font-bold text-white tracking-widest uppercase text-sm">Justin Hanson</NavLink>
        <nav className="flex gap-4 text-sm">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                isActive ? 'text-[#e8d44d]' : 'text-gray-400 hover:text-white transition-colors'
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </header>
    </>
  )
}
