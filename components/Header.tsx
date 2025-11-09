import { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button } from './ui/Button';
import { Logo } from './Logo';
import { Menu, X, User, LayoutDashboard, Image, CreditCard, LogOut } from 'lucide-react';

export default function Header() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'API', href: '/api-docs' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Free Tools', href: '/website-screenshot' },
    { name: 'Contact', href: '/contact' },
  ];

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <>
      {/* PROFESSIONAL HEADER - Desktop First */}
      <header className="bg-white/95 backdrop-blur border-b border-secondary-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            {/* Left: Brand */}
            <Logo size="md" />

            {/* Center: Primary navigation */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-colors border-b-2 ${
                    router.pathname === item.href
                      ? 'text-primary-700 border-primary-600'
                      : 'text-secondary-700 border-transparent hover:text-primary-700 hover:border-primary-200'
                  } pb-1`}
                >
                  {item.name}
                </Link>
              ))}
              {/* Free Tools dropdown */}
              <div className="relative group">
                <button className={`text-sm font-medium text-secondary-700 hover:text-primary-700 border-b-2 border-transparent pb-1`}>More</button>
                <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-150 absolute left-1/2 -translate-x-1/2 mt-3 w-56 bg-white border border-secondary-200 rounded-lg shadow-lg p-2">
                  <Link href="/website-screenshot" className="block px-3 py-2 text-sm rounded hover:bg-secondary-50">Website Screenshot</Link>
                  <Link href="/how-it-works" className="block px-3 py-2 text-sm rounded hover:bg-secondary-50">How it works</Link>
                </div>
              </div>
            </nav>

            {/* Right: CTAs & avatar */}
            <div className="hidden lg:flex items-center space-x-3">
              {status === 'loading' ? (
                <div className="w-8 h-8 animate-pulse bg-secondary-200 rounded-full"></div>
              ) : session ? (
                <div className="flex items-center space-x-3">
                  <Link href="/dashboard">
                    <Button variant="outline" size="sm">
                      Dashboard
                    </Button>
                  </Link>
                  
                  <div className="relative" ref={dropdownRef}>
                    <button 
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-secondary-50 transition-colors border border-secondary-200"
                    >
                      {session.user?.image ? (
                        <img
                          src={session.user.image}
                          alt={session.user.name || 'User'}
                          className="w-7 h-7 rounded-full"
                        />
                      ) : (
                        <div className="w-7 h-7 bg-primary-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {session.user?.name?.charAt(0) || 'U'}
                          </span>
                        </div>
                      )}
                      <span className="text-sm font-medium text-secondary-900 max-w-[100px] truncate">
                        {session.user?.name}
                      </span>
                    </button>
                    
                    {/* Desktop Dropdown Menu */}
                    {dropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-secondary-200 py-1">
                        <div className="px-4 py-3 border-b border-secondary-100">
                          <p className="text-sm font-medium text-secondary-900 truncate">{session.user?.name}</p>
                          <p className="text-xs text-secondary-600 truncate">{session.user?.email}</p>
                        </div>
                        
                        <div className="py-1">
                          <Link
                            href="/dashboard"
                            className="flex items-center px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50 transition-colors"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <LayoutDashboard className="w-4 h-4 mr-3 text-secondary-500" />
                            Dashboard
                          </Link>
                          <Link
                            href="/dashboard/screenshots"
                            className="flex items-center px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50 transition-colors"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <Image className="w-4 h-4 mr-3 text-secondary-500" />
                            My Screenshots
                          </Link>
                          <Link
                            href="/dashboard/api-builder"
                            className="flex items-center px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50 transition-colors"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <Image className="w-4 h-4 mr-3 text-secondary-500" />
                            API builder
                          </Link>
                          <Link
                            href="/dashboard/profile"
                            className="flex items-center px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50 transition-colors"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <Image className="w-4 h-4 mr-3 text-secondary-500" />
                            Profile
                          </Link>
                          <Link
                            href="/dashboard/plans"
                            className="flex items-center px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50 transition-colors"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <CreditCard className="w-4 h-4 mr-3 text-secondary-500" />
                            Plans
                          </Link>
                          <Link
                            href="/dashboard/invoices"
                            className="flex items-center px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50 transition-colors"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <CreditCard className="w-4 h-4 mr-3 text-secondary-500" />
                            Invoices
                          </Link>
                          <Link
                            href="/dashboard/custom-error-images"
                            className="flex items-center px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50 transition-colors"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <Image className="w-4 h-4 mr-3 text-secondary-500" />
                            Custom error images
                          </Link>
                          <Link
                            href="/dashboard/settings"
                            className="flex items-center px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50 transition-colors"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <Image className="w-4 h-4 mr-3 text-secondary-500" />
                            Settings
                          </Link>
                          <Link
                            href="/how-it-works"
                            className="flex items-center px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50 transition-colors"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <Image className="w-4 h-4 mr-3 text-secondary-500" />
                            How it works
                          </Link>
                          <Link
                            href="/dashboard/delete-account"
                            className="flex items-center px-4 py-2 text-sm text-error-600 hover:bg-error-50 transition-colors"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <LogOut className="w-4 h-4 mr-3" />
                            Delete account
                          </Link>
                        </div>
                        
                        <div className="border-t border-secondary-100 pt-1">
                          <button
                            onClick={() => {
                              handleSignOut();
                              setDropdownOpen(false);
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-error-600 hover:bg-error-50 transition-colors"
                          >
                            <LogOut className="w-4 h-4 mr-3" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link href="/auth/signin">
                    <Button variant="ghost" size="sm">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button size="sm">
                      Get Started Free
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-secondary-900/50" onClick={() => setMobileMenuOpen(false)} />
          
          <div className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white shadow-xl">
            <div className="flex items-center justify-between px-4 py-4 border-b border-secondary-200">
              <Logo size="sm" href="/" />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-4 py-6 overflow-y-auto max-h-[calc(100vh-80px)]">
              {/* Mobile Navigation */}
              <nav className="space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block px-3 py-2 text-base font-medium text-secondary-700 hover:text-secondary-900 hover:bg-secondary-50 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>

              {/* Mobile Auth */}
              <div className="mt-6 pt-6 border-t border-secondary-200">
                {session ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 px-3 py-2 bg-secondary-50 rounded-lg">
                      {session.user?.image ? (
                        <img
                          src={session.user.image}
                          alt={session.user.name || 'User'}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium">
                            {session.user?.name?.charAt(0) || 'U'}
                          </span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-secondary-900 truncate">{session.user?.name}</p>
                        <p className="text-xs text-secondary-600 truncate">{session.user?.email}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <Link
                        href="/dashboard"
                        className="flex items-center px-3 py-2 text-sm font-medium text-secondary-700 hover:text-secondary-900 hover:bg-secondary-50 rounded-lg"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <LayoutDashboard className="w-4 h-4 mr-3 text-secondary-500" />
                        Dashboard
                      </Link>
                      <Link
                        href="/dashboard/screenshots"
                        className="flex items-center px-3 py-2 text-sm font-medium text-secondary-700 hover:text-secondary-900 hover:bg-secondary-50 rounded-lg"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Image className="w-4 h-4 mr-3 text-secondary-500" />
                        My Screenshots
                      </Link>
                      <button
                        onClick={() => {
                          handleSignOut();
                          setMobileMenuOpen(false);
                        }}
                        className="flex items-center w-full px-3 py-2 text-sm font-medium text-error-600 hover:bg-error-50 rounded-lg"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link
                      href="/auth/signin"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button variant="outline" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                    <Link
                      href="/auth/signup"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button className="w-full">
                        Get Started Free
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
