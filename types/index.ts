export type Gender = "male" | "female" | "non_binary" | "prefer_not_to_say";
export type BookingStatus = "pending" | "confirmed" | "cancelled" | "refunded";
export type EventStatus = "draft" | "published" | "cancelled" | "completed";

export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  gender: Gender;
  date_of_birth: string;
  age?: number;
  bio: string | null;
  interests: string[];
  availability: string[];
  avatar_url: string | null;
  phone: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  short_description: string;
  image_url: string | null;
  event_date: string;
  event_end_date: string | null;
  location: string;
  location_details: string | null;
  capacity: number;
  price: number; // in pence/cents
  currency: string;
  status: EventStatus;
  tags: string[];
  created_by: string;
  created_at: string;
  updated_at: string;
  // computed
  bookings_count?: number;
  spots_remaining?: number;
}

export interface Booking {
  id: string;
  event_id: string;
  user_id: string;
  status: BookingStatus;
  payment_intent_id: string | null;
  amount_paid: number;
  currency: string;
  stripe_session_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // relations
  event?: Event;
  profile?: Profile;
}

export interface CreateEventInput {
  title: string;
  description: string;
  short_description: string;
  image_url?: string;
  event_date: string;
  event_end_date?: string;
  location: string;
  location_details?: string;
  capacity: number;
  price: number;
  currency?: string;
  tags?: string[];
}

export interface CreateProfileInput {
  full_name: string;
  gender: Gender;
  date_of_birth: string;
  bio?: string;
  interests: string[];
  availability: string[];
  phone?: string;
}
