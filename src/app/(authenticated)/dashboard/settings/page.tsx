const SettingsPage = () => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Settings
          </h1>
          
          {/* Account Section - Rhyme 1 */}
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
              Account Details, Keep Them Handy
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-slate-400 mb-1">Email</label>
                <input
                  type="email"
                  defaultValue="user@example.com"
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none backdrop-blur-sm"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none backdrop-blur-sm"
                />
              </div>
              <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-blue-500/30">
                Update Account, Make It Right
              </button>
            </div>
          </div>
  
          {/* Security Section - Rhyme 2 */}
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
              Security First, Keep Your Data Tight
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                <div>
                  <h3 className="font-medium text-white">Two-Factor Authentication</h3>
                  <p className="text-slate-400 text-sm">Add an extra layer of security</p>
                </div>
                <button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 py-2 rounded-lg transition-all duration-200 border border-purple-500/30">
                  Enable
                </button>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                <div>
                  <h3 className="font-medium text-white">Connected Devices</h3>
                  <p className="text-slate-400 text-sm">3 devices active</p>
                </div>
                <button className="text-blue-400 hover:text-blue-300 bg-blue-500/10 px-4 py-2 rounded-lg border border-blue-500/20 transition-colors">
                  Manage
                </button>
              </div>
            </div>
          </div>
  
          {/* Notification Section - Rhyme 3 */}
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              Notifications, Keep Them In Sight
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                <div>
                  <h3 className="font-medium text-white">Email Alerts</h3>
                  <p className="text-slate-400 text-sm">Get important updates</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                <div>
                  <h3 className="font-medium text-white">Price Alerts</h3>
                  <p className="text-slate-400 text-sm">When your assets move</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default SettingsPage;