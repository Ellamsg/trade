"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { FiPieChart } from "react-icons/fi";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

const SettingsPage = () => {
  const [email, setEmail] = useState("user@example.com");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handlePasswordUpdate = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setMessage({ text: "Passwords do not match", type: "error" });
      setLoading(false);
      return;
    }

    try {
      // First reauthenticate the user
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password: currentPassword,
      });

      if (authError) throw authError;

      // Then update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) throw updateError;

      setMessage({ text: "Password updated successfully!", type: "success" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      if (error instanceof Error) {
        setMessage({ text: error.message, type: "error" });
      } else {
        setMessage({ text: "An unknown error occurred", type: "error" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-4 md:p-6">
      <div className=" mx-auto space-y-6">
        <div className="flex  space-x-4 mb-6">
          <div className="p-3 bg-blue-600/20 rounded-xl border border-blue-500/30">
            <FiPieChart className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="md:text-3xl text-[19px] font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Settings
            </h1>
          </div>
        </div>
        {/* Account Section */}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none backdrop-blur-sm"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none backdrop-blur-sm"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none backdrop-blur-sm"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none backdrop-blur-sm"
              />
            </div>

            {message.text && (
              <div
                className={`p-3 rounded-lg ${
                  message.type === "error"
                    ? "bg-red-500/20 border border-red-500/50"
                    : "bg-green-500/20 border border-green-500/50"
                }`}
              >
                {message.text}
              </div>
            )}

            <button
              onClick={handlePasswordUpdate}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </div>

        {/* Rest of your settings sections... */}
      </div>
    </div>
  );
};

export default SettingsPage;
