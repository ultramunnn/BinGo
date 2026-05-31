export interface Beach {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string | null;
  image_url: string | null;
  created_at: string;
}

export interface BeachReview {
  id: string;
  beach_id: string;
  user_id: string;
  rating: number;
  message: string;
  image_url: string | null;
  created_at: string;
}

export interface BeachWithSummary extends Beach {
  average_rating: number;
  total_reviews: number;
}

export interface BeachDetail extends Beach {
  average_rating: number;
  total_reviews: number;
  reviews: BeachReviewWithUser[];
}

export interface BeachReviewWithUser extends BeachReview {
  user_name: string;
  user_avatar: string | null;
}

export interface BeachReviewCreateInput {
  beach_id: string;
  user_id: string;
  rating: number;
  message: string;
  image_url?: string;
}
