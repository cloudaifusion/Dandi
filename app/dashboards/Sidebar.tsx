import Link from "next/link";

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
  collapsed?: boolean;
  setCollapsed?: (collapsed: boolean) => void;
}

const navLinks = [
  { name: "Overview", href: "/dashboards", icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ) },
  { name: "Research Assistant", href: "#", icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M6.05 17.95l-1.414 1.414M17.95 17.95l-1.414-1.414M6.05 6.05L4.636 7.464" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ) },
  { name: "Research Reports", href: "#", icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M7 8h10M7 12h4m1 8H6a2 2 0 01-2-2V6a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ) },
  { name: "API Playground", href: "/playground", icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M16 18v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2m16-10V6a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m0 0v2m0-2h6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ) },
  { name: "Invoices", href: "#", icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M12 11c0-1.104.896-2 2-2s2 .896 2 2-.896 2-2 2-2-.896-2-2zm0 0V7m0 4v4m0 0h4m-4 0H8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ) },
  { name: "Documentation", href: "#", icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M15 12h2a2 2 0 002-2V7a2 2 0 00-2-2h-2m-6 0H7a2 2 0 00-2 2v3a2 2 0 002 2h2m6 0v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M19 19l-2-2m0 0l-2 2m2-2v6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ), external: true },
];

export default function Sidebar({ open = false, onClose, collapsed = false, setCollapsed }: SidebarProps) {
  // Only show collapse/expand on desktop
  const handleCollapse = () => setCollapsed && setCollapsed(!collapsed);
  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity md:hidden ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`fixed z-50 top-0 left-0 h-full bg-white border-r flex flex-col transform transition-transform duration-200
          ${open ? 'translate-x-0' : '-translate-x-full'}
          ${collapsed ? 'md:w-16' : 'md:w-64'} w-64 px-6 py-8 md:px-2 md:py-8
        `}
        style={{ minWidth: collapsed ? '4rem' : '16rem' }}
      >
        {/* Close button for mobile */}
        <button
          className="absolute top-4 right-4 md:hidden p-2 rounded hover:bg-gray-100"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <div className={`mb-10 flex flex-col items-center justify-center`}>
          {collapsed ? (
            <>
              <span className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 text-2xl font-bold">D</span>
              {typeof setCollapsed === 'function' && (
                <button
                  className="mt-2 p-2 rounded hover:bg-gray-100"
                  onClick={handleCollapse}
                  aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </>
          ) : (
            <>
              <span className="text-2xl font-bold tracking-tight transition-all duration-200">Dandi <span className="text-indigo-600">AI</span></span>
              {typeof setCollapsed === 'function' && (
                <button
                  className="hidden md:block absolute top-4 right-2 p-2 rounded hover:bg-gray-100"
                  onClick={handleCollapse}
                  aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
            </>
          )}
        </div>
        {/* Navigation */}
        <nav className="flex-1">
          <ul className="space-y-2">
            {navLinks.map(link => (
              <li key={link.name}>
                <Link href={link.href} className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition group ${collapsed ? 'justify-center' : ''}`}>
                  <span className="text-gray-500 group-hover:text-indigo-600">{link.icon}</span>
                  {!collapsed && <span className="font-medium text-gray-900 group-hover:text-indigo-600">{link.name}</span>}
                  {link.external && !collapsed && (
                    <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path d="M18 13v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h6" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M15 3h6v6" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M10 14L21 3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {/* User avatar */}
        <div className={`mt-auto flex items-center gap-3 pt-8 ${collapsed ? 'justify-center' : ''}`}>
          <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" className="w-8 h-8 rounded-full border" />
          {!collapsed && <span className="font-medium text-gray-900 text-sm">Eden Marco</span>}
        </div>
      </aside>
    </>
  );
}
