import * as LeaderboardModel from "../models/leaderboard.model";

export interface LeaderboardUser {
  rank: number;
  name: string;
  photo_url: string | null;
  score: number;
}

export interface LeaderboardBeach {
  rank: number;
  name: string;
  image_url: string | null;
  score: number;
}

export interface CurrentUserRank {
  rank: number;
  scan_count: number;
}

export interface LeaderboardData {
  users: LeaderboardUser[];
  beaches: LeaderboardBeach[];
  currentUser: CurrentUserRank | null;
}

/**
 * Get full leaderboard data (top 10 users + top 10 beaches + current user rank).
 */
export async function getLeaderboard(userId?: string): Promise<LeaderboardData> {
  const [topUsers, topBeaches, currentUser] = await Promise.all([
    LeaderboardModel.getTopUsers(),
    LeaderboardModel.getTopBeaches(),
    userId ? LeaderboardModel.getCurrentUserRank(userId) : Promise.resolve(null),
  ]);

  return {
    users: topUsers.map((u, i) => ({
      rank: i + 1,
      name: u.full_name,
      photo_url: u.photo_url,
      score: u.scan_count,
    })),
    beaches: topBeaches.map((b, i) => ({
      rank: i + 1,
      name: b.name,
      image_url: b.image_url,
      score: b.avg_rating,
    })),
    currentUser,
  };
}
