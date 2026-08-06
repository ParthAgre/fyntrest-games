import { supabase } from '../lib/supabase';
import { SupabaseLeaderboardRow, InsertScoreDTO } from '../types/game';

export class LeaderboardService {
  static async submitScore(score: InsertScoreDTO): Promise<SupabaseLeaderboardRow | null> {
    if (!supabase) return null;
    
    try {
      const { data, error } = await supabase
        .from('leaderboard')
        .insert([score])
        .select()
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error submitting score to Supabase:', error);
      return null;
    }
  }

  static async getTopScores(limit: number = 10): Promise<SupabaseLeaderboardRow[]> {
    if (!supabase) return [];
    
    try {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .order('score', { ascending: false })
        .limit(limit);
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching top scores from Supabase:', error);
      return [];
    }
  }

  static async getTopScoresByGame(game: string, limit: number = 10): Promise<SupabaseLeaderboardRow[]> {
    if (!supabase) return [];
    
    try {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .eq('game', game)
        .order('score', { ascending: false })
        .limit(limit);
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error(`Error fetching top scores for game ${game}:`, error);
      return [];
    }
  }

  static async getRecentScores(limit: number = 20): Promise<SupabaseLeaderboardRow[]> {
    if (!supabase) return [];
    
    try {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching recent scores:', error);
      return [];
    }
  }

  static async deleteScore(id: string): Promise<boolean> {
    if (!supabase) return false;
    
    try {
      const { error } = await supabase
        .from('leaderboard')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting score:', error);
      return false;
    }
  }

  static async deleteScores(ids: string[]): Promise<boolean> {
    if (!supabase) return false;
    if (ids.length === 0) return true;
    
    try {
      const { error } = await supabase
        .from('leaderboard')
        .delete()
        .in('id', ids);
        
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting scores:', error);
      return false;
    }
  }

  static async clearLeaderboard(): Promise<boolean> {
    if (!supabase) return false;
    
    try {
      const { error } = await supabase
        .from('leaderboard')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Naive clear all strategy
        
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error clearing leaderboard:', error);
      return false;
    }
  }

  static subscribeToUpdates(callback: () => void) {
    if (!supabase) return { unsubscribe: () => {} };
    
    const channel = supabase
      .channel('leaderboard_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leaderboard' }, () => {
        callback();
      })
      .subscribe();
      
    return {
      unsubscribe: () => {
        supabase?.removeChannel(channel);
      }
    };
  }
}
