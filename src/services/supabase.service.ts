import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { AnalysisResult } from "../types/models";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn(
    "Supabase credentials not configured. Database features will be disabled."
  );
}

export class SupabaseService {
  /**
   * Get the Supabase client instance
   */
  static getClient(): SupabaseClient | null {
    return supabase;
  }

  /**
   * Check if Supabase is configured
   */
  static isConfigured(): boolean {
    return supabase !== null;
  }

  /**
   * Sign up a new user
   */
  static async signUp(email: string, password: string, username?: string) {
    if (!supabase) throw new Error("Supabase not configured");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username || email.split('@')[0],
          display_name: username || email.split('@')[0],
        },
      },
    });

    if (error) throw error;
    return data;
  }

  /**
   * Sign in an existing user
   */
  static async signIn(email: string, password: string) {
    if (!supabase) throw new Error("Supabase not configured");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  }

  /**
   * Sign out the current user
   */
  static async signOut() {
    if (!supabase) throw new Error("Supabase not configured");

    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  /**
   * Sign in with OAuth provider (google, github, etc.)
   */
  static async signInWithProvider(provider: "google" | "github") {
    if (!supabase) throw new Error("Supabase not configured");

    const { data, error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) throw error;
    return data;
  }

  /**
   * Get current user
   */
  static async getCurrentUser() {
    if (!supabase) return null;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  }

  /**
   * Save an analysis result
   */
  static async saveAnalysis(analysis: AnalysisResult) {
    if (!supabase) throw new Error("Supabase not configured");

    const user = await this.getCurrentUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("analyses")
      .insert([
        {
          user_id: user.id,
          resume: analysis.resume,
          job_description: analysis.jobDescription,
          tailored_output: analysis.tailoredOutput,
          score: analysis.tailoredOutput.score,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) throw error;
    return data;
  }

  /**
   * Get user's analysis history
   */
  static async getAnalysisHistory(limit = 10) {
    if (!supabase) throw new Error("Supabase not configured");

    const user = await this.getCurrentUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("analyses")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }

  /**
   * Delete an analysis
   */
  static async deleteAnalysis(analysisId: string) {
    if (!supabase) throw new Error("Supabase not configured");

    const user = await this.getCurrentUser();
    if (!user) throw new Error("User not authenticated");

    const { error } = await supabase
      .from("analyses")
      .delete()
      .eq("id", analysisId)
      .eq("user_id", user.id);

    if (error) throw error;
  }

  /**
   * Update user profile
   */
  static async updateProfile(updates: {
    name?: string;
    subscription?: string;
  }) {
    if (!supabase) throw new Error("Supabase not configured");

    const user = await this.getCurrentUser();
    if (!user) throw new Error("User not authenticated");

    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id);

    if (error) throw error;
  }

  /**
   * Get user profile
   */
  static async getProfile() {
    if (!supabase) throw new Error("Supabase not configured");

    const user = await this.getCurrentUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Increment analysis count for user
   */
  static async incrementAnalysisCount() {
    if (!supabase) return;

    const user = await this.getCurrentUser();
    if (!user) return;

    const { error } = await supabase.rpc("increment_analysis_count", {
      user_id: user.id,
    });

    if (error) console.error("Error incrementing analysis count:", error);
  }
}

/**
 * Database Schema for Supabase:
 *
 * -- Profiles table
 * CREATE TABLE profiles (
 *   id UUID REFERENCES auth.users PRIMARY KEY,
 *   name TEXT,
 *   subscription TEXT DEFAULT 'free',
 *   analysis_count INTEGER DEFAULT 0,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 *   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
 * );
 *
 * -- Analyses table
 * CREATE TABLE analyses (
 *   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 *   user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
 *   resume JSONB NOT NULL,
 *   job_description JSONB NOT NULL,
 *   tailored_output JSONB NOT NULL,
 *   score INTEGER,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
 * );
 *
 * -- Function to increment analysis count
 * CREATE OR REPLACE FUNCTION increment_analysis_count(user_id UUID)
 * RETURNS void AS $$
 * BEGIN
 *   UPDATE profiles
 *   SET analysis_count = analysis_count + 1,
 *       updated_at = NOW()
 *   WHERE id = user_id;
 * END;
 * $$ LANGUAGE plpgsql;
 *
 * -- Enable Row Level Security
 * ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
 * ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;
 *
 * -- Policies for profiles
 * CREATE POLICY "Users can view own profile"
 *   ON profiles FOR SELECT
 *   USING (auth.uid() = id);
 *
 * CREATE POLICY "Users can update own profile"
 *   ON profiles FOR UPDATE
 *   USING (auth.uid() = id);
 *
 * -- Policies for analyses
 * CREATE POLICY "Users can view own analyses"
 *   ON analyses FOR SELECT
 *   USING (auth.uid() = user_id);
 *
 * CREATE POLICY "Users can insert own analyses"
 *   ON analyses FOR INSERT
 *   WITH CHECK (auth.uid() = user_id);
 *
 * CREATE POLICY "Users can delete own analyses"
 *   ON analyses FOR DELETE
 *   USING (auth.uid() = user_id);
 */
