import Script from 'next/script';

const TawkTo = () => {
  return (
    <Script id="tawk-to" strategy="afterInteractive">
      {`
        var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
        (function(){
        var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
        s1.async=true;
        s1.src='https://embed.tawk.to/686bcf7e7f6c5a190cf2f3df/1ivii51sn';
        s1.charset='UTF-8';
        s1.setAttribute('crossorigin','*');
        s0.parentNode.insertBefore(s1,s0);
        })();
      `}
    </Script>
  );
};

export default TawkTo;



// 'use client'

// import Script from 'next/script';
// import { useEffect, useState } from 'react';
// import { createClient } from '@/app/utils/supabase/clients';
// import { User } from '@supabase/supabase-js';

// const TawkTo = () => {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoaded, setIsLoaded] = useState(false);
//   const supabase = createClient();

//   // Fetch user data
//   useEffect(() => {
//     const getUser = async () => {
//       const { data: { user } } = await supabase.auth.getUser();
//       setUser(user);
//     };

//     getUser();
//   }, [supabase]);

//   // Set user attributes when Tawk.to loads and user data is available
//   useEffect(() => {
//     if (isLoaded && user && typeof window !== 'undefined' && window.Tawk_API) {
//       // Set user attributes
//       window.Tawk_API.setAttributes({
//         'name': user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
//         'email': user.email || '',
//         'userId': user.id || '',
//         'loginStatus': 'logged_in'
//       });

//       // You can also add visitor info
//       window.Tawk_API.addEvent('User Login', {
//         'userId': user.id,
//         'email': user.email,
//         'loginTime': new Date().toISOString()
//       });
//     } else if (isLoaded && !user && typeof window !== 'undefined' && window.Tawk_API) {
//       // For non-logged in users
//       window.Tawk_API.setAttributes({
//         'name': 'Guest User',
//         'loginStatus': 'guest'
//       });
//     }
//   }, [user, isLoaded]);

//   const handleScriptLoad = () => {
//     setIsLoaded(true);
    
//     // Additional Tawk.to configuration
//     if (typeof window !== 'undefined' && window.Tawk_API) {
//       window.Tawk_API.onLoad = function() {
//         console.log('Tawk.to chat loaded');
//       };

//       window.Tawk_API.onChatStarted = function() {
//         if (user) {
//           console.log('Chat started by:', user.email);
//         }
//       };
//     }
//   };

//   return (
//     <Script 
//       id="tawk-to" 
//       strategy="afterInteractive"
//       onLoad={handleScriptLoad}
//     >
//       {`
//         var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
//         (function(){
//         var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
//         s1.async=true;
//         s1.src='https://embed.tawk.to/686bcf7e7f6c5a190cf2f3df/1ivii51sn';
//         s1.charset='UTF-8';
//         s1.setAttribute('crossorigin','*');
//         s0.parentNode.insertBefore(s1,s0);
//         })();
//       `}
//     </Script>
//   );
// };

// export default TawkTo;

// "use client"
// import Script from 'next/script';
// import { createClient } from '../utils/supabase/clients';
// import { useEffect, useState } from 'react';

// const TawkTo = () => {
//   const [userName, setUserName] = useState<string>('');

//   useEffect(() => {
//     const supabase = createClient();
    
//     const getUser = async () => {
//       try {
//         const { data: { user }, error } = await supabase.auth.getUser();
        
//         if (error || !user) {
//           return;
//         }

//         // Get display name from user_metadata or email
//         const displayName = user.user_metadata?.full_name || user.email || 'User';
//         setUserName(displayName);

//         // Set Tawk.to visitor metadata if the script is already loaded
//         if (window.Tawk_API) {
//           window.Tawk_API.setAttributes({
//             'username': displayName,
//             'supabase_username': displayName
//           }, function(error){});
//         }
//       } catch (error) {
//         console.error('Error fetching user:', error);
//       }
//     };

//     getUser();
//   }, []);

//   return (
//     <Script id="tawk-to" strategy="afterInteractive">
//       {`
//         var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
//         (function(){
//           var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
//           s1.async=true;
//           s1.src='https://embed.tawk.to/686bcf7e7f6c5a190cf2f3df/1ivii51sn';
//           s1.charset='UTF-8';
//           s1.setAttribute('crossorigin','*');
//           s0.parentNode.insertBefore(s1,s0);
          
//           // Set visitor metadata after Tawk script loads
//           s1.onload = function() {
//             Tawk_API.onLoad = function() {
//               Tawk_API.setAttributes({
//                 'username': '${userName}',
//                 'supabase_username': '${userName}'
//               }, function(error){});
//             };
//           };
//         })();
//       `}
//     </Script>
//   );
// };

// export default TawkTo;