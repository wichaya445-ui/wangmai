import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = 'https://umxaihrutlqhtkfnhsfb.supabase.co';
const supabaseKey = 'sb_publishable_ynyO8UxEMLHHMiFs3hYmpw_6XRsp8o8';

export const supabase = createClient(supabaseUrl, supabaseKey);