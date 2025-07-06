

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiPieChart, FiList, FiSettings, FiLogOut } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { signOut } from '../(auth)/login/action';
import { createClient } from '../utils/supabase/clients';
import { RiAdminLine } from "react-icons/ri";
import { User } from '@supabase/supabase-js';
const Sidebar = ({ closeSidebar }: { closeSidebar?: () => void }) => {
  const pathname = usePathname();
  const [isClosing, setIsClosing] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  // Fetch user data
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();
  }, []);

  const navItems = [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: <FiHome />,
      rhyme: "Track your Stocks, watch them shine"
    },
    { 
      name: 'Portfolio', 
      href: '/dashboard/portfolio', 
      icon: <FiPieChart />,
      rhyme: "Count your gains, feel divine"
    },
    { 
      name: 'Watchlist', 
      href: '/dashboard/waitlist', 
      icon: <FiList />,
      rhyme: "Orders wait, don't be late"
    },
    { 
      name: 'Trends', 
      href: '/dashboard/trend', 
      icon: <FiList />,
      rhyme: "Check the latest stocks"
    },
    { 
      name: 'Settings', 
      href: '/dashboard/settings', 
      icon: <FiSettings />,
      rhyme: "Tweak and tune, make it prime"
    },
    { 
      name: 'Admin', 
      href: '/dashboard/admin', 
      icon: <RiAdminLine />,
      rhyme: "For Admin Only"
    },
  ];

   // Filter nav items based on user
   const filteredNavItems = navItems.filter(item => {
    if (item.name === 'Admin') {
      return user?.email === process.env.NEXT_PUBLIC_AUTHORIZED_EMAIL;
    }
    return true;
  });


  const handleLinkClick = () => {
    if (closeSidebar) {
      setIsClosing(true);
      setTimeout(() => {
        closeSidebar();
        setIsClosing(false);
      }, 300); // Matches the transition duration
    }
  };

  return (
    <div className={`
      flex flex-col h-full bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 border-r border-gray-700/50 backdrop-blur-sm
      lg:static lg:translate-x-0 lg:w-64
      ${closeSidebar ? 
        (isClosing ? 'animate-slide-out-left' : 'animate-slide-in-left') : 
        ''}
    `}>
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
         <div className='pb-9'>
         <Link href="/" className="text-2xl  font-bold text-white md:py-0 ">
            <img className="" src="/assets/pentalogo4.png" alt="main-log" />
          </Link>

         </div>

          <nav>
            <ul className="space-y-3">
              {filteredNavItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={handleLinkClick}
                    className={`group flex flex-col p-4 rounded-xl transition-all duration-200 ${
                      pathname === item.href
                        ? 'bg-blue-600/30 border border-blue-500/30 shadow-lg shadow-blue-500/10'
                        : 'text-gray-300 hover:bg-gray-800/50 border border-transparent hover:border-gray-700/50'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className={`mr-3 text-lg ${
                        pathname === item.href 
                          ? 'text-blue-300' 
                          : 'text-gray-400 group-hover:text-white'
                      }`}>
                        {item.icon}
                      </span>
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <span className={`mt-1 text-xs ${
                      pathname === item.href 
                        ? 'text-blue-200' 
                        : 'text-gray-500 group-hover:text-gray-300'
                    }`}>
                      {item.rhyme}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
      <div className="p-6 border-t border-gray-700/50">
        <button 
          className="flex items-center w-full p-4 text-gray-300 hover:bg-gray-800/50 rounded-xl transition-all duration-200 group border border-transparent hover:border-gray-700/50"
          onClick={handleLinkClick}
        >
          <FiLogOut className="mr-3 text-lg text-gray-400 group-hover:text-red-400" />
          <div className="flex flex-col">
            <form action={signOut}>
            <button className='cursor-pointer'>
            <span className="font-medium">Logout</span>
              </button>
            </form>
         

            <p>{user && (
          
                <p className="text-xs text-gray-500 group-hover:text-red-300">{user.email}</p>
               
            
          )}</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;