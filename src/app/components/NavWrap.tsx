// import { createClient } from "@/app/utils/supabase/servers"
// import NavbarClient from "./dashNav"

// export default async function NavbarWrap() {
//   const supabase = await createClient()
//   const { data: { user } } = await supabase.auth.getUser()

//   const { data: profile } = await supabase
//     .from('profiles')
//     .select('full_name')
//     .eq('id', user?.id)
//     .single()

//   const userName = profile?.full_name || user?.user_metadata?.full_name || user?.email 

//   return <NavbarClient  userName={userName} />
// }