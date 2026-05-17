import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Trophy, LogOut, ChevronDown } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/useAppStore';
import { logout } from '../store/slices/authSlice';
import { Avatar, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setUserMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg transition-transform group-hover:scale-110">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hidden sm:block">Forum Diskusi</span>
        </Link>

        <div className="hidden md:flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Button variant="default" size="sm" asChild>
                <Link to="/create" className="gap-2">
                  Add Thread
                </Link>
              </Button>

              <Button variant="ghost" size="sm" asChild>
                <Link to="/leaderboard" className="gap-2">
                  <Trophy className="h-4 w-4" />
                  Leaderboard
                </Link>
              </Button>

              <div className="relative ml-2">
                <button type="button" onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-2 rounded-full p-1 hover:bg-accent transition-colors">
                  <Avatar size="sm">{user?.avatar && <AvatarImage src={user.avatar} alt={user.name} />}</Avatar>
                  <span className="hidden sm:block text-sm font-medium">{user?.name}</span>
                  <ChevronDown className={cn('h-4 w-4 transition-transform duration-200 hidden sm:block', userMenuOpen && 'rotate-180')} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-lg border bg-popover py-1 shadow-lg animate-in fade-in-0 zoom-in-95">
                    <div className="px-3 py-2 border-b sm:hidden">
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                    <button type="button" onClick={handleLogout} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors">
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button variant="default" asChild>
                <Link to="/register">Register</Link>
              </Button>
            </>
          )}
        </div>

        <button type="button" className="md:hidden rounded-lg p-2 hover:bg-accent transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background animate-in slide-in-from-top-2">
          <div className="container px-4 py-4 space-y-3">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                  <Avatar size="md">{user?.avatar && <AvatarImage src={user.avatar} alt={user.name} />}</Avatar>
                  <div>
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
                <Link to="/create" className="flex items-center gap-2 p-3 rounded-lg hover:bg-muted transition-colors" onClick={() => setMobileMenuOpen(false)}>
                  Add Thread
                </Link>
                <Link to="/leaderboard" className="flex items-center gap-2 p-3 rounded-lg hover:bg-muted transition-colors" onClick={() => setMobileMenuOpen(false)}>
                  <Trophy className="h-5 w-5" />
                  Leaderboard
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 p-3 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block p-3 rounded-lg hover:bg-muted transition-colors" onClick={() => setMobileMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="block p-3 rounded-lg bg-primary text-primary-foreground text-center hover:bg-primary/90 transition-colors" onClick={() => setMobileMenuOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
