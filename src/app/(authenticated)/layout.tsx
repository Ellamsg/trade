

"use client"
import { useState } from 'react';
import Sidebar from '../components/dashsSide';
import Navbar from '../components/dashNav';
import { AnimatePresence, motion } from 'framer-motion';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    
    <div className="flex h-[100vh] bg-gray-900 text-white">
      {/* Sidebar - Desktop */}
      <aside className="hidden fixed top-0 md:static  lg:flex lg:w-64 bg-gray-900 border-r border-gray-800 flex-col">
        <Sidebar />
      </aside>

      {/* Sidebar - Mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 lg:hidden bg-gray-900"
              onClick={closeSidebar}
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'tween' }}
              className="fixed inset-y-0 left-0 w-64 z-50"
            >
              <Sidebar closeSidebar={closeSidebar} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar toggleSidebar={toggleSidebar} />
       

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}