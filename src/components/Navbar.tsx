
import { useState } from 'react';
import { Book, BookOpen, Home, BarChart2, Download } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Início', path: '/', icon: <Home className="h-5 w-5" /> },
    { name: 'Livros', path: '/books', icon: <Book className="h-5 w-5" /> },
    { name: 'HQs', path: '/comics', icon: <BookOpen className="h-5 w-5" /> },
    { name: 'Estatísticas', path: '/stats', icon: <BarChart2 className="h-5 w-5" /> },
    { name: 'Exportar', path: '/export', icon: <Download className="h-5 w-5" /> },
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <BookOpen className="h-8 w-8 text-book-primary" />
                <span className="ml-2 text-xl font-serif font-bold text-book-primary">
                  MeuAcervo
                </span>
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`${
                      location.pathname === item.path
                        ? 'bg-book-accent text-book-primary'
                        : 'text-gray-600 hover:bg-book-background hover:text-book-primary'
                    } px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 transition-colors`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Menu principal"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-900 shadow-lg rounded-b-lg">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`${
                  location.pathname === item.path
                    ? 'bg-book-accent text-book-primary'
                    : 'text-gray-600 hover:bg-book-background hover:text-book-primary'
                } block px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2`}
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
