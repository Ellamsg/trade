

// 'use client'

// import { useEffect, useState } from 'react'
// import { createClient } from '@/app/utils/supabase/clients'

// type Post = {
//     id: string;
//     name: string;
//     symbol: string;
//     current_price: number;
//     price_change: string;
//     percentage_change: string;
//     is_gain: boolean;
//     created_at?: string;
//     image_url?: string;
//     image_path?: string;
// }

// export default function PostsList() {
//     const [posts, setPosts] = useState<Post[]>([])
//     const [loading, setLoading] = useState(false)
//     const [error, setError] = useState<string | null>(null)
//     const [editingPost, setEditingPost] = useState<Post | null>(null)
//     const [newPost, setNewPost] = useState<Omit<Post, 'id' | 'created_at'>>({ 
//       name: '',
//       symbol: '', 
//       current_price: 0,
//       price_change: '',
//       percentage_change: '',
//       is_gain: true
//     })
//     const [file, setFile] = useState<File | null>(null)
//     const [editFile, setEditFile] = useState<File | null>(null)
//     const supabase = createClient()
  
//     const refreshPosts = async () => {
//       setLoading(true)
//       setError(null)
      
//       try {
//         const { data, error } = await supabase
//           .from('posts')
//           .select('*')
//           .order('created_at', { ascending: false })
        
//         if (error) throw error
        
//         const postsWithUrls = await Promise.all(
//           (data || []).map(async (post) => {
//             if (!post.image_path) return post
            
//             const { data: { publicUrl } } = supabase.storage
//               .from('profile')
//               .getPublicUrl(post.image_path)
            
//             return { ...post, image_url: publicUrl }
//           })
//         )
        
//         setPosts(postsWithUrls)
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'Failed to fetch posts')
//         console.error('Error:', err)
//       } finally {
//         setLoading(false)
//       }
//     }
  
//     const handleInsertPost = async () => {
//       if (!newPost.name || !newPost.symbol || !newPost.current_price) {
//         setError('Name, symbol and current price are required')
//         return
//       }
  
//       setLoading(true)
//       setError(null)
  
//       try {
//         const { data: existingPosts, error: idError } = await supabase
//           .from('posts')
//           .select('id')
//           .order('id', { ascending: false })
//           .limit(1)
        
//         if (idError) throw idError
        
//         const nextId = existingPosts && existingPosts.length > 0 
//           ? existingPosts[0].id + 1 
//           : 1
        
//         let imagePath = ''
//         let imageUrl = ''
        
//         if (file) {
//           const fileExt = file.name.split('.').pop()
//           const fileName = `${Math.random()}.${fileExt}`
//           imagePath = `user_uploads/${fileName}`
          
//           const { error: uploadError } = await supabase.storage
//             .from('profile')
//             .upload(imagePath, file)
          
//           if (uploadError) throw uploadError
          
//           const { data: { publicUrl } } = supabase.storage
//             .from('profile')
//             .getPublicUrl(imagePath)
          
//           imageUrl = publicUrl
//         }
  
//         const { data, error } = await supabase
//           .from('posts')
//           .insert([{ 
//             id: nextId,
//             name: newPost.name,
//             symbol: newPost.symbol,
//             current_price: newPost.current_price,
//             price_change: newPost.price_change,
//             percentage_change: newPost.percentage_change,
//             is_gain: newPost.is_gain,
//             image_url: imageUrl,
//             image_path: imagePath 
//           }])
//           .select()
        
//         if (error) throw error
        
//         await refreshPosts()
//         setNewPost({ name: '', symbol: '', current_price: 0, price_change: '', percentage_change: '', is_gain: true })
//         setFile(null)
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'Failed to create post')
//         console.error('Error:', err)
//       } finally {
//         setLoading(false)
//       }
//     }
  
//     const handleUpdatePost = async () => {
//       if (!editingPost || !editingPost.name || !editingPost.symbol || !editingPost.current_price) {
//         setError('Invalid post data')
//         return
//       }
  
//       setLoading(true)
//       setError(null)
  
//       try {
//         let imagePath = editingPost.image_path || ''
//         let imageUrl = editingPost.image_url || ''
        
//         if (editFile) {
//           if (editingPost.image_path) {
//             await supabase.storage
//               .from('profile')
//               .remove([editingPost.image_path])
//           }
          
//           const fileExt = editFile.name.split('.').pop()
//           const fileName = `${Math.random()}.${fileExt}`
//           imagePath = `user_uploads/${fileName}`
          
//           const { error: uploadError } = await supabase.storage
//             .from('profile')
//             .upload(imagePath, editFile)
          
//           if (uploadError) throw uploadError
          
//           const { data: { publicUrl } } = supabase.storage
//             .from('profile')
//             .getPublicUrl(imagePath)
          
//           imageUrl = publicUrl
//         }
  
//         const { data, error } = await supabase
//           .from('posts')
//           .update({
//             name: editingPost.name,
//             symbol: editingPost.symbol,
//             current_price: editingPost.current_price,
//             price_change: editingPost.price_change,
//             percentage_change: editingPost.percentage_change,
//             is_gain: editingPost.is_gain,
//             image_url: imageUrl,
//             image_path: imagePath
//           })
//           .eq('id', editingPost.id)
//           .select()
        
//         if (error) throw error
        
//         await refreshPosts()
//         setEditingPost(null)
//         setEditFile(null)
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'Failed to update post')
//         console.error('Error:', err)
//       } finally {
//         setLoading(false)
//       }
//     }
  
//     const handleDeletePost = async (postId: string, imagePath?: string) => {
//       if (!window.confirm('Are you sure you want to delete this stock entry?')) return
      
//       setLoading(true)
//       setError(null)
  
//       try {
//         if (imagePath) {
//           await supabase.storage
//             .from('profile')
//             .remove([imagePath])
//         }
        
//         const { error } = await supabase
//           .from('posts')
//           .delete()
//           .eq('id', postId)
        
//         if (error) throw error
        
//         await refreshPosts()
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'Failed to delete post')
//         console.error('Error:', err)
//       } finally {
//         setLoading(false)
//       }
//     }
  
//     useEffect(() => {
//       refreshPosts()
//     }, [])
  
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
//         <div className="max-w-7xl mx-auto px-6 py-8">
//           {/* Header */}
//           <div className="mb-8">
//             <div className="bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-slate-700/20">
//               <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-200 via-blue-300 to-indigo-300 bg-clip-text text-transparent mb-2">
//                 📈 Stock Portfolio Admin
//               </h1>
//               <p className="text-slate-400 text-lg">Manage your stock entries with ease</p>
//             </div>
//           </div>

//           <div className="grid lg:grid-cols-3 gap-8">
//             {/* Add Stock Form */}
//             <div className="lg:col-span-1">
//               <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-slate-700/20 sticky top-8">
//                 <div className="flex items-center gap-3 mb-6">
//                   <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
//                     <span className="text-white font-bold text-lg">+</span>
//                   </div>
//                   <h2 className="text-xl font-bold text-slate-100">Add New Stock</h2>
//                 </div>
                
//                 <div className="space-y-4">
//                   <div className="relative">
//                     <input
//                       type="text"
//                       placeholder="Company Name"
//                       value={newPost.name}
//                       onChange={(e) => setNewPost({...newPost, name: e.target.value})}
//                       className="w-full p-2 border-2 border-slate-700 rounded-xl bg-slate-700/50 backdrop-blur-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 font-medium placeholder-slate-500 text-white"
//                     />
//                   </div>
                  
//                   <div className="relative">
//                     <input
//                       type="text"
//                       placeholder="Stock Symbol"
//                       value={newPost.symbol}
//                       onChange={(e) => setNewPost({...newPost, symbol: e.target.value.toUpperCase()})}
//                       className="w-full p-2 border-2 border-slate-700 rounded-xl bg-slate-700/50 backdrop-blur-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 font-medium placeholder-slate-500 text-white"
//                     />
//                     <div className="absolute right-4 top-4 text-slate-500 text-sm font-medium">
//                       e.g., AAPL
//                     </div>
//                   </div>
                  
//                   <div className="relative">
//                     <div className="absolute left-4 top-4 text-slate-400 font-medium">$</div>
//                     <input
//                       type="number"
//                       step="0.01"
//                       placeholder="Current Price"
//                       value={newPost.current_price || ''}
//                       onChange={(e) => setNewPost({...newPost, current_price: parseFloat(e.target.value) || 0})}
//                       className="w-full p-2 pl-8 border-2 border-slate-700 rounded-xl bg-slate-700/50 backdrop-blur-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 font-medium placeholder-slate-500 text-white"
//                     />
//                   </div>
                  
//                   <input
//                     type="text"
//                     placeholder="Price Change (e.g., +2.34)"
//                     value={newPost.price_change}
//                     onChange={(e) => setNewPost({...newPost, price_change: e.target.value})}
//                     className="w-full p-2 border-2 border-slate-700 rounded-xl bg-slate-700/50 backdrop-blur-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 font-medium placeholder-slate-500 text-white"
//                   />
                  
//                   <input
//                     type="text"
//                     placeholder="Percentage Change (e.g., +1.28%)"
//                     value={newPost.percentage_change}
//                     onChange={(e) => setNewPost({...newPost, percentage_change: e.target.value})}
//                     className="w-full p-2 border-2 border-slate-700 rounded-xl bg-slate-700/50 backdrop-blur-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 font-medium placeholder-slate-500 text-white"
//                   />
                  
//                   <div className="flex gap-3">
//                     <label className="flex-1 cursor-pointer">
//                       <input
//                         type="radio"
//                         name="gain_loss"
//                         checked={newPost.is_gain}
//                         onChange={() => setNewPost({...newPost, is_gain: true})}
//                         className="sr-only"
//                       />
//                       <div className={`p-2 rounded-xl text-center font-semibold transition-all duration-300 ${
//                         newPost.is_gain 
//                           ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg transform scale-105' 
//                           : 'bg-slate-700/50 text-slate-300 border-2 border-slate-600 hover:border-emerald-400'
//                       }`}>
//                         📈 Gain
//                       </div>
//                     </label>
//                     <label className="flex-1 cursor-pointer">
//                       <input
//                         type="radio"
//                         name="gain_loss"
//                         checked={!newPost.is_gain}
//                         onChange={() => setNewPost({...newPost, is_gain: false})}
//                         className="sr-only"
//                       />
//                       <div className={`p-2 rounded-xl text-center font-semibold transition-all duration-300 ${
//                         !newPost.is_gain 
//                           ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg transform scale-105' 
//                           : 'bg-slate-700/50 text-slate-300 border-2 border-slate-600 hover:border-red-400'
//                       }`}>
//                         📉 Loss
//                       </div>
//                     </label>
//                   </div>
                  
//                   <div className="relative">
//                     <input
//                       type="file"
//                       onChange={(e) => setFile(e.target.files?.[0] || null)}
//                       className="w-full p-4 border-2 border-dashed border-slate-600 rounded-xl bg-slate-700/30 backdrop-blur-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:font-medium hover:file:bg-blue-700 transition-all duration-300 text-white"
//                       accept="image/*"
//                     />
//                   </div>
                  
//                   <button
//                     onClick={handleInsertPost}
//                     disabled={loading}
//                     className="w-full p-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed"
//                   >
//                     {loading ? (
//                       <div className="flex items-center justify-center gap-2">
//                         <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//                         Adding...
//                       </div>
//                     ) : (
//                       '✨ Add Stock Entry'
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Main Content */}
//             <div className="lg:col-span-2 space-y-6">
//               {/* Edit Stock Form */}
//               {editingPost && (
//                 <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-slate-700/20 animate-in slide-in-from-top duration-300">
//                   <div className="flex items-center gap-3 mb-6">
//                     <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
//                       <span className="text-white font-bold text-lg">✏️</span>
//                     </div>
//                     <h2 className="text-xl font-bold text-slate-100">Edit Stock Entry</h2>
//                   </div>
                  
//                   <div className="grid md:grid-cols-2 gap-4 mb-6">
//                     <input
//                       type="text"
//                       placeholder="Company Name"
//                       value={editingPost.name}
//                       onChange={(e) => setEditingPost({...editingPost, name: e.target.value})}
//                       className="p-3 border-2 border-slate-700 rounded-xl bg-slate-700/50 backdrop-blur-sm focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 transition-all duration-300 font-medium text-white"
//                     />
//                     <input
//                       type="text"
//                       placeholder="Stock Symbol"
//                       value={editingPost.symbol}
//                       onChange={(e) => setEditingPost({...editingPost, symbol: e.target.value.toUpperCase()})}
//                       className="p-3 border-2 border-slate-700 rounded-xl bg-slate-700/50 backdrop-blur-sm focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 transition-all duration-300 font-medium text-white"
//                     />
//                     <div className="relative">
//                       <div className="absolute left-3 top-3 text-slate-400 font-medium">$</div>
//                       <input
//                         type="number"
//                         step="0.01"
//                         placeholder="Current Price"
//                         value={editingPost.current_price || ''}
//                         onChange={(e) => setEditingPost({...editingPost, current_price: parseFloat(e.target.value) || 0})}
//                         className="w-full p-3 pl-7 border-2 border-slate-700 rounded-xl bg-slate-700/50 backdrop-blur-sm focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 transition-all duration-300 font-medium text-white"
//                       />
//                     </div>
//                     <input
//                       type="text"
//                       placeholder="Price Change"
//                       value={editingPost.price_change}
//                       onChange={(e) => setEditingPost({...editingPost, price_change: e.target.value})}
//                       className="p-3 border-2 border-slate-700 rounded-xl bg-slate-700/50 backdrop-blur-sm focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 transition-all duration-300 font-medium text-white"
//                     />
//                     <input
//                       type="text"
//                       placeholder="Percentage Change"
//                       value={editingPost.percentage_change}
//                       onChange={(e) => setEditingPost({...editingPost, percentage_change: e.target.value})}
//                       className="p-3 border-2 border-slate-700 rounded-xl bg-slate-700/50 backdrop-blur-sm focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 transition-all duration-300 font-medium text-white"
//                     />
//                   </div>
                  
//                   <div className="flex gap-3 mb-4">
//                     <label className="flex-1 cursor-pointer">
//                       <input
//                         type="radio"
//                         name="edit_gain_loss"
//                         checked={editingPost.is_gain}
//                         onChange={() => setEditingPost({...editingPost, is_gain: true})}
//                         className="sr-only"
//                       />
//                       <div className={`p-3 rounded-xl text-center font-semibold transition-all duration-300 ${
//                         editingPost.is_gain 
//                           ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg' 
//                           : 'bg-slate-700/50 text-slate-300 border-2 border-slate-600'
//                       }`}>
//                         📈 Gain
//                       </div>
//                     </label>
//                     <label className="flex-1 cursor-pointer">
//                       <input
//                         type="radio"
//                         name="edit_gain_loss"
//                         checked={!editingPost.is_gain}
//                         onChange={() => setEditingPost({...editingPost, is_gain: false})}
//                         className="sr-only"
//                       />
//                       <div className={`p-3 rounded-xl text-center font-semibold transition-all duration-300 ${
//                         !editingPost.is_gain 
//                           ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg' 
//                           : 'bg-slate-700/50 text-slate-300 border-2 border-slate-600'
//                       }`}>
//                         📉 Loss
//                       </div>
//                     </label>
//                   </div>
                  
//                   <input
//                     type="file"
//                     onChange={(e) => {
//                       if (e.target.files?.[0]) {
//                         setEditFile(e.target.files[0])
//                         setEditingPost({
//                           ...editingPost,
//                           image_url: URL.createObjectURL(e.target.files[0])
//                         })
//                       }
//                     }}
//                     className="w-full p-3 border-2 border-dashed border-slate-600 rounded-xl bg-slate-700/30 backdrop-blur-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-amber-600 file:text-white file:font-medium hover:file:bg-amber-700 transition-all duration-300 mb-4 text-white"
//                     accept="image/*"
//                   />
                  
//                   {editingPost.image_url && (
//                     <div className="flex items-center gap-4 mb-4 p-4 bg-slate-700/50 rounded-xl">
//                       <img 
//                         src={editingPost.image_url} 
//                         alt="Current stock image"
//                         className="w-20 h-20 object-cover rounded-xl shadow-md"
//                       />
//                       <button
//                         onClick={() => {
//                           setEditingPost({
//                             ...editingPost,
//                             image_url: '',
//                             image_path: ''
//                           })
//                           setEditFile(null)
//                         }}
//                         className="px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-lg font-medium hover:from-red-600 hover:to-rose-700 transform hover:scale-105 transition-all duration-300 shadow-md"
//                       >
//                         🗑️ Remove
//                       </button>
//                     </div>
//                   )}
                  
//                   <div className="flex gap-3">
//                     <button
//                       onClick={handleUpdatePost}
//                       disabled={loading}
//                       className="flex-1 p-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-amber-600 hover:to-orange-700 transform hover:scale-105 transition-all duration-300 disabled:opacity-50"
//                     >
//                       {loading ? '🔄 Updating...' : '💾 Update'}
//                     </button>
//                     <button
//                       onClick={() => {
//                         setEditingPost(null)
//                         setEditFile(null)
//                       }}
//                       className="px-6 py-3 bg-slate-600 text-white rounded-xl font-semibold hover:bg-slate-700 transform hover:scale-105 transition-all duration-300 shadow-md"
//                     >
//                       ❌ Cancel
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {/* Controls */}
//               <div className="flex justify-between items-center">
//                 <button 
//                   onClick={refreshPosts}
//                   disabled={loading}
//                   className="px-6 py-3 bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-slate-800 hover:to-slate-900 transform hover:scale-105 transition-all duration-300 disabled:opacity-50"
//                 >
//                   {loading ? (
//                     <div className="flex items-center gap-2">
//                       <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//                       Refreshing...
//                     </div>
//                   ) : (
//                     '🔄 Refresh Data'
//                   )}
//                 </button>
                
//                 <div className="text-slate-400 font-medium">
//                   {posts.length} {posts.length === 1 ? 'entry' : 'entries'}
//                 </div>
//               </div>

//               {/* Error Display */}
//               {error && (
//                 <div className="p-4 bg-gradient-to-r from-red-900/50 to-rose-900/50 border-l-4 border-red-500 rounded-xl shadow-md animate-in slide-in-from-left duration-300">
//                   <div className="flex items-center gap-3">
//                     <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
//                       <span className="text-white font-bold">!</span>
//                     </div>
//                     <div>
//                       <p className="font-semibold text-red-300">Error</p>
//                       <p className="text-red-200">{error}</p>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Stock Entries List */}
//               <div className="space-y-4">
//                 {posts.map((post, index) => (
//                   <div key={post.id} className={`group bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl border border-slate-700/20 transition-all duration-300 hover:transform hover:scale-[1.02] animate-in slide-in-from-bottom duration-300`} style={{ animationDelay: `${index * 100}ms` }}>
//                     <div className="flex justify-between items-start">
//                       <div className="flex-1">
//                         <div className="flex items-center gap-4 mb-4">
//                           <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg ${
//                             post.is_gain 
//                               ? 'bg-gradient-to-r from-emerald-500 to-green-600' 
//                               : 'bg-gradient-to-r from-red-500 to-rose-600'
//                           }`}>
//                             {post.symbol.charAt(0)}
//                           </div>
//                           <div>
//                             <h2 className="text-2xl font-bold text-white">{post.name}</h2>
//                             <div className="flex items-center gap-2">
//                               <span className="text-xl font-bold text-slate-300">{post.symbol}</span>
//                               <span className="text-2xl font-bold text-white">${post.current_price}</span>
//                             </div>
//                           </div>
//                         </div>
                        
//                         <div className="flex items-center gap-6 mb-4">
//                           <div className={`px-4 py-2 rounded-xl font-bold text-lg ${
//                             post.is_gain ? 'text-emerald-400' : 'text-red-400'
//                           }`}>
//                             {post.price_change}
//                           </div>
//                           <div className={`px-4 py-2 rounded-xl font-bold text-lg ${
//                             post.is_gain ? 'text-emerald-400' : 'text-red-400'
//                           }`}>
//                             {post.percentage_change}
//                           </div>
//                           <div className={`px-4 py-2 rounded-xl font-bold text-sm shadow-md ${
//                             post.is_gain 
//                               ? 'bg-gradient-to-r from-emerald-900/50 to-green-900/50 text-emerald-300' 
//                               : 'bg-gradient-to-r from-red-900/50 to-rose-900/50 text-red-300'
//                           }`}>
//                             {post.is_gain ? '📈 GAIN' : '📉 LOSS'}
//                           </div>
//                         </div>
                        
//                         {post.image_url && (
//                           <div className="mb-4">
//                             <img 
//                               src={post.image_url} 
//                               alt={post.symbol}
//                               className="w-64 h-48 object-cover rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
//                             />
//                           </div>
//                         )}
                        
//                         {post.created_at && (
//                           <p className="text-slate-400 font-medium">
//                             📅 {new Date(post.created_at).toLocaleString()}
//                           </p>
//                         )}
//                       </div>
                      
//                       <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
//                         <button
//                           onClick={() => setEditingPost(post)}
//                           className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300"
//                         >
//                           ✏️ Edit
//                         </button>
//                         <button
//                           onClick={() => handleDeletePost(post.id, post.image_path)}
//                           className="px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg hover:from-red-600 hover:to-rose-700 transform hover:scale-105 transition-all duration-300"
//                         >
//                           🗑️ Delete
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Empty State */}
//               {!loading && posts.length === 0 && (
//                 <div className="text-center py-16">
//                   <div className="w-24 h-24 bg-gradient-to-r from-slate-700 to-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
//                     <span className="text-4xl">📊</span>
//                   </div>
//                   <h3 className="text-2xl font-bold text-slate-400 mb-2">No Stock Entries Yet</h3>
//                   <p className="text-slate-500">Add your first stock entry to get started</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     )
// }



// components/Navbar.tsx
"use client";
import React from "react";
import { useState, useEffect } from "react";


// Define navigation links in a single array

export default function Admin() {
  return (
    <div className="padding-2-screen py-[200px]">
       Admin coming soon..........
   
    </div>
  );
}
