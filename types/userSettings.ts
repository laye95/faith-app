export interface UserSettings {
  id: string;
  user_id: string;
  settings: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}
