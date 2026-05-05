import { supabase, supabaseAdmin } from '../config/supabase';
import bcrypt from 'bcrypt';

export interface User {
  id: string;
  email: string;
  password_hash: string;
  full_name: string | null;
  role: 'user' | 'admin';
  photo_url: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface UserCreateInput {
  email: string;
  password: string;
  full_name?: string;
}

export interface UserResponse {
  id: string;
  email: string;
  full_name: string | null;
  role: 'user' | 'admin';
  photo_url: string | null;
  created_at: Date;
}

class UserModel {
  // Find user by email
  async findByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) return null;
    console.log('Query result:', { user: data, error });
    return data as User;
  }

  // Find user by ID
  async findById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return data as User;
  }

  // Create new user
  async create(userData: UserCreateInput): Promise<UserResponse | null> {
    const { email, password, full_name } = userData;
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabaseAdmin
      .from('users')
      .insert({
        email,
        password_hash: hashedPassword,
        full_name: full_name || null,
        role: 'user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select('id, email, full_name, role, photo_url, created_at')
      .single();

    if (error) {
      console.error('Error creating user:', error);
      return null;
    }

    return data as UserResponse;
  }

  // Check if email exists
  async emailExists(email: string): Promise<boolean> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (error) return false;
    return !!data;
  }

  // Update user data
  async update(id: string, updates: Partial<User>): Promise<UserResponse | null> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('id, email, full_name, role, photo_url, created_at')
      .single();

    if (error) return null;
    return data as UserResponse;
  }

  // Verify user password
  async verifyPassword(user: User, password: string): Promise<boolean> {
    return await bcrypt.compare(password, user.password_hash);
  }

  // Get user by ID (sanitized, without password)
  async getSanitizedUser(id: string): Promise<UserResponse | null> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('id, email, full_name, role, photo_url, created_at')
      .eq('id', id)
      .single();

    if (error) return null;
    return data as UserResponse;
  }
}

export default new UserModel();