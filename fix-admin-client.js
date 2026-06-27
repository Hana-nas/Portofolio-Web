const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

// 1. Update src/lib/supabase/server.ts
const serverTsPath = path.join(srcDir, 'lib', 'supabase', 'server.ts');
let serverTs = fs.readFileSync(serverTsPath, 'utf8');

// Replace createAdminClient with createAdminDbClient and use standard supabase-js
if (serverTs.includes('export async function createAdminClient')) {
  // Add import if missing
  if (!serverTs.includes('@supabase/supabase-js')) {
    serverTs = "import { createClient as createSupabaseClient } from '@supabase/supabase-js'\n" + serverTs;
  }
  
  const adminClientRegex = /\/\/ Admin client using service role key[\s\S]*export async function createAdminClient\(\) \{[\s\S]*?\n\}/;
  
  const newAdminClient = `// Admin client using service role key – bypasses RLS
export function createAdminDbClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}`;

  serverTs = serverTs.replace(adminClientRegex, newAdminClient);
  fs.writeFileSync(serverTsPath, serverTs);
  console.log('Updated server.ts');
}

// 2. Update all API routes
const apiDir = path.join(srcDir, 'app', 'api');

function traverseAndFix(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      traverseAndFix(fullPath);
    } else if (file === 'route.ts') {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;

      // Change imports
      if (content.includes('createAdminClient')) {
        content = content.replace(/createAdminClient/g, 'createAdminDbClient');
        if (!content.includes('createClient')) {
          content = content.replace(/import \{.*?createAdminDbClient.*?\} from '@\/lib\/supabase\/server'/, "import { createClient, createAdminDbClient } from '@/lib/supabase/server'");
        }
        changed = true;
      }

      // We need to fix the auth check and db client instances
      // Old:
      // const supabase = await createAdminDbClient()
      // const { data: { user } } = await supabase.auth.getUser()
      
      // New:
      // const supabaseAuth = await createClient()
      // const { data: { user } } = await supabaseAuth.auth.getUser()
      // const supabaseAdmin = createAdminDbClient()

      if (changed) {
        // Find every occurrences of createAdminDbClient being called for auth
        // Usually it's:
        // const supabase = await createAdminDbClient()
        // ... supabase.auth.getUser()
        
        // This regex is a bit simplistic, but since I know the exact pattern I wrote...
        // I will replace `const supabase = await createAdminDbClient()` with:
        // const supabaseAuth = await createClient()
        // const { data: { user } } = await supabaseAuth.auth.getUser()
        // const supabase = createAdminDbClient()
        
        content = content.replace(/const supabase = await createAdminDbClient\(\)\s*const \{ data: \{ user \} \} = await supabase\.auth\.getUser\(\)/g, 
          `const supabaseAuth = await createClient()\n  const { data: { user } } = await supabaseAuth.auth.getUser()\n  const supabase = createAdminDbClient()`);
        
        // Sometimes it's a GET request that uses admin client directly:
        // const supabase = await createAdminDbClient()
        // Here we just remove await, since createAdminDbClient is sync
        content = content.replace(/const supabase = await createAdminDbClient\(\)/g, "const supabase = createAdminDbClient()");
        
        fs.writeFileSync(fullPath, content);
        console.log('Updated ' + fullPath);
      }
    }
  }
}

traverseAndFix(apiDir);
