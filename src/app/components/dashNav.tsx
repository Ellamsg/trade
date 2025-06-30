"use client"
import { FiMenu, FiSearch, FiUser, FiLogOut } from 'react-icons/fi';
import { createClient } from '../utils/supabase/clients';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { signOut } from '../(auth)/login/action';
import Chatbot from './Chatbot';

const Navbar = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    
    const getUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) {
          setLoading(false);
          return;
        }

        setUser(user);

        // Fetch additional user data (name) from profiles table
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();

        // Fallback to user_metadata if profile doesn't exist
        const displayName = profile?.full_name || user.user_metadata?.full_name || user.email || 'User';
        setUserName(displayName);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setUserName('');
      } else if (session?.user) {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white p-4 flex items-center justify-between border-b border-gray-700/50 backdrop-blur-sm shadow-lg">
      {/* Left side - Menu button with rhyme */}
   
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleSidebar}
          className="p-2.5 rounded-xl hover:bg-white/10 transition-all duration-200 hover:scale-105 lg:hidden group"
          aria-label="Toggle navigation"
        >
          <FiMenu size={20} className="group-hover:rotate-12 transition-transform" />
        </button>
        <span className="hidden md:block text-sm text-blue-300 font-medium">
          "Click the menu, don't be shy,<br/>All your options are nearby"
        </span>
      </div>
      
      {/* Center - Search with rhyme */}
      <div className="flex-1 max-w-md mx-4">
        <div className="relative group">
        
          <input
            type="text"
            placeholder="Search  coins, markets, news..."
            className="w-full hidden bg-gray-800/60 backdrop-blur-sm rounded-xl py-3 px-4 pl-10 text-sm 
                     focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-gray-800/80
                     border border-gray-700/50 hover:border-gray-600/50 transition-all duration-200
                     placeholder-gray-400"
            aria-label="Search cryptocurrency"
          />
         
        </div>
      </div>

      {/* Right side - User info and logout with rhymes */}
      <div className="flex items-center space-x-3">
        {loading ? (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-700/50 rounded-full animate-pulse"></div>
            <div className="w-20 h-4 bg-gray-700/50 rounded animate-pulse"></div>
          </div>
        ) : user ? (
          <>
            {/* User Avatar and Name with rhyme */}
            <div className="flex items-center space-x-3 bg-gray-800/40 backdrop-blur-sm rounded-xl px-4 py-2 border border-gray-700/30 group">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center group-hover:rotate-6 transition-transform">
                <FiUser size={16} className="text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="text-sm font-medium text-gray-200">
                  "Welcome back, {userName}
                </span>
                <span className="block text-xs text-blue-300">
                  Ready to trade, don't be tame!
                </span>
              </div>
            </div>

            {/* Logout Button with rhyme */}
            <form>
              <button 
                formAction={signOut}
                className="group flex items-center space-x-2 bg-gradient-to-r from-red-600 to-red-700 
                         hover:from-red-700 hover:to-red-800 px-4 py-2.5 rounded-xl 
                         transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-red-500/25
                         border border-red-500/20 backdrop-blur-sm"
                aria-label="Sign out"
              >
                <FiLogOut size={16} className="group-hover:rotate-12 transition-transform duration-200" />
                <span className="text-sm font-medium hidden sm:block">
                  Log out
                </span>
              </button>
            </form>
          </>
        ) : (
          <div className="flex items-center space-x-2 text-gray-400 bg-gray-800/40 backdrop-blur-sm rounded-xl px-4 py-2 border border-gray-700/30">
            <FiUser size={16} />
            <span className="text-sm">"Not signed in? Begin the spin!"</span>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;