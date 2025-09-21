import { Home, Search, Map, Bot, Users, User, Clock, X } from "lucide-react";

export default function Sidebar({ isOpen, onClose }) {
  const navigationItems = [
    {
      name: "Home",
      icon: Home,
      href: "/",
      color: "#3B82F6",
      darkColor: "#60A5FA",
      isActive: false,
    },
    {
      name: "Explore",
      icon: Map,
      href: "/explore",
      color: "#8B5CF6",
      darkColor: "#A78BFA",
    },
    {
      name: "Search",
      icon: Search,
      href: "/search",
      color: "#EC4899",
      darkColor: "#F472B6",
    },
    {
      name: "Assistant",
      icon: Bot,
      href: "/assistant",
      color: "#06B6D4",
      darkColor: "#22D3EE",
    },
    {
      name: "Community",
      icon: Users,
      href: "/community",
      color: "#10B981",
      darkColor: "#34D399",
    },
    {
      name: "Profile",
      icon: User,
      href: "/profile",
      color: "#F59E0B",
      darkColor: "#FBBF24",
    },
    {
      name: "Updates",
      icon: Clock,
      href: "/updates",
      color: "#EF4444",
      darkColor: "#F87171",
      badge: "Live",
    },
  ];

  const handleNavigation = (href) => {
    window.location.href = href;
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <div
      className={`w-[280px] bg-white dark:bg-[#1E1E1E] shadow-sm border-r border-gray-200 dark:border-gray-700 fixed left-0 top-0 h-full flex flex-col font-inter z-50 transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
    >
      {/* Mobile Close Button */}
      <div className="lg:hidden absolute top-4 right-4 z-10">
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600 transition-colors duration-200"
          aria-label="Close menu"
        >
          <X size={20} className="text-gray-700 dark:text-gray-300" />
        </button>
      </div>

      {/* Brand Row */}
      <div className="pt-6 px-6 pb-8 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center">
          {/* Logo */}
          <div className="w-12 h-12 mr-4 bg-gradient-to-br from-blue-500 to-pink-500 rounded-2xl flex items-center justify-center relative">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-pink-500 rounded-full"></div>
            </div>
          </div>
          <h1 className="text-[28px] font-poppins font-semibold text-black dark:text-white tracking-tight">
            Local Voyage
          </h1>
        </div>
      </div>

      {/* Menu Section */}
      <div className="flex-1 px-6 py-6 overflow-y-auto scrollbar-hide">
        {/* Section Label */}
        <h2 className="text-[14px] font-poppins font-semibold text-black dark:text-white uppercase tracking-[0.02em] mb-4">
          EXPLORE
        </h2>

        {/* Navigation List */}
        <div className="space-y-[14px]">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            const itemColor = item.color;
            const isCurrentPage =
              typeof window !== "undefined" &&
              window.location.pathname === item.href;

            return (
              <div key={item.name}>
                <div
                  className={`
                    flex items-center w-full px-5 py-[10px] rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md
                    ${
                      isCurrentPage
                        ? `bg-white dark:bg-[#262626] shadow-sm border-2`
                        : "bg-white dark:bg-[#262626] shadow-sm border border-transparent hover:shadow-lg active:shadow-sm hover:border-gray-200 dark:hover:border-gray-600"
                    }
                  `}
                  style={{
                    borderColor: isCurrentPage ? itemColor : "transparent",
                    boxShadow: isCurrentPage
                      ? `0 0 0 2px ${itemColor}20`
                      : "0 1px 3px rgba(0, 0, 0, 0.04)",
                  }}
                  onClick={() => handleNavigation(item.href)}
                >
                  {/* Icon Block */}
                  <div
                    className={`
                      w-11 h-11 rounded-xl flex items-center justify-center mr-4 transition-all duration-200
                    `}
                    style={{
                      backgroundColor: isCurrentPage
                        ? itemColor
                        : `${itemColor}20`,
                    }}
                  >
                    <IconComponent
                      size={20}
                      className={isCurrentPage ? "text-white" : "text-current"}
                      style={{ color: isCurrentPage ? "white" : itemColor }}
                    />
                  </div>

                  {/* Text Label */}
                  <span className="text-[15px] font-inter text-black dark:text-white flex-1">
                    {item.name}
                  </span>

                  {/* Badge */}
                  {item.badge && (
                    <span
                      className="px-3 py-1 rounded-full text-[12px] font-inter border"
                      style={{
                        borderColor: itemColor,
                        color: itemColor,
                        backgroundColor: "transparent",
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 p-4 bg-gradient-to-br from-blue-50 to-pink-50 dark:from-blue-900/20 dark:to-pink-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-3">
            Quick Actions
          </h3>
          <div className="space-y-2">
            <button
              onClick={() => handleNavigation("/search")}
              className="w-full text-left text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              Find nearby attractions
            </button>
            <button
              onClick={() => handleNavigation("/assistant")}
              className="w-full text-left text-sm text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 transition-colors"
            >
              Plan your itinerary
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600&family=Inter:wght@400;500&display=swap');
        
        .font-poppins {
          font-family: 'Poppins', sans-serif;
        }
        
        .font-inter {
          font-family: 'Inter', sans-serif;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
