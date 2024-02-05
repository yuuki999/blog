import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://hfcpryabstusfimdbwpi.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmY3ByeWFic3R1c2ZpbWRid3BpIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTUzODQ4MDcsImV4cCI6MjAxMDk2MDgwN30.7-s8By3uEqemF0byKF0WxWAWI4tTsuZ4V_pxRjsBBFc";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function downloadFileFromSupabase(filePath: string) {
  const { data, error } = await supabase.storage.from('test_movie_buket').download(filePath);
  console.log("supaからダウンロードしたデータ")
  console.log(data)
  if (error) {
    throw error;
  }
  const buffer = Buffer.from(await data.arrayBuffer());
  return buffer;
}
