import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ztsppsuxtlyoxgefprmx.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0c3Bwc3V4dGx5b3hnZWZwcm14Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTMyNjkxNTYsImV4cCI6MjAwODg0NTE1Nn0.0aBT1bT8uF4LiCUIZTqQOC9xdJFRfGGmUF4lt4eHsP8";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
