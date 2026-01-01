import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { getStats } from '@/lib/cms-store';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  ClipboardCheck, 
  BarChart3, 
  Upload, 
  LogOut,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';

const navItems = [
  { path: '/rat-control/cms/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/rat-control/cms/promises', label: 'Promises', icon: ClipboardCheck },
  { path: '/rat-control/cms/indicators', label: 'Indicators', icon: BarChart3 },
  { path: '/rat-control/cms/import', label: 'Import CSV', icon: Upload },
];

const CMSLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isCmsUser, isLoading, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState<ReturnType<typeof getStats> | null>(null);

  useEffect(() => {
    // Redirect to login if not authenticated or not a CMS user
    if (!isLoading && (!user || !isCmsUser)) {
      navigate('/rat-control/cms/admin');
    }
  }, [user, isCmsUser, isLoading, navigate]);

  useEffect(() => {
    setStats(getStats());
  }, [location.pathname]);

  const handleLogout = async () => {
    await signOut();
    navigate('/rat-control/cms/admin');
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!user || !isCmsUser) {
    return null;
  }

  // Generate breadcrumbs
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const breadcrumbs = pathSegments.slice(2).map((segment, index) => ({
    label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
    path: '/' + pathSegments.slice(0, index + 3).join('/'),
    isLast: index === pathSegments.length - 3,
  }));

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-foreground/20 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-cms-sidebar transform transition-transform duration-200 lg:translate-x-0 flex flex-col",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-semibold text-sm">MT</span>
            </div>
            <div>
              <span className="text-cms-sidebar-foreground font-semibold text-sm">Mamdani Tracker</span>
              <span className="block text-cms-sidebar-muted text-xs">CMS</span>
            </div>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-cms-sidebar-muted hover:text-cms-sidebar-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-thin">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path !== '/rat-control/cms/dashboard' && location.pathname.startsWith(item.path));
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors",
                  isActive 
                    ? "bg-cms-sidebar-accent text-cms-sidebar-foreground" 
                    : "text-cms-sidebar-muted hover:text-cms-sidebar-foreground hover:bg-cms-sidebar-accent/50"
                )}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
                {item.label === 'Promises' && stats && (
                  <span className="ml-auto text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded">
                    {stats.totalPromises}
                  </span>
                )}
                {item.label === 'Indicators' && stats && (
                  <span className="ml-auto text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded">
                    {stats.totalIndicators}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User/Logout */}
        <div className="p-3 border-t border-sidebar-border">
          <div className="px-3 py-2 mb-2">
            <p className="text-xs text-cms-sidebar-muted truncate">{user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-sm text-cms-sidebar-muted hover:text-cms-sidebar-foreground hover:bg-cms-sidebar-accent/50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 border-b flex items-center justify-between px-4 lg:px-6 bg-card">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-muted-foreground hover:text-foreground"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Breadcrumbs */}
            <nav className="hidden sm:flex items-center gap-1 text-sm">
              {breadcrumbs.map((crumb, index) => (
                <div key={crumb.path} className="flex items-center gap-1">
                  {index > 0 && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                  {crumb.isLast ? (
                    <span className="font-medium text-foreground">{crumb.label}</span>
                  ) : (
                    <Link 
                      to={crumb.path}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            {stats && stats.draftPromises > 0 && (
              <span className="text-xs bg-status-draft text-status-draft-foreground px-2 py-1 rounded-full font-medium">
                {stats.draftPromises} draft{stats.draftPromises !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="p-4 lg:p-6 animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default CMSLayout;
