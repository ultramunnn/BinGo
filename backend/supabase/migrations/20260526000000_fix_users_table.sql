-- Remove role column (system only uses 'user' role, no admin needed)
ALTER TABLE users DROP COLUMN IF EXISTS role;

-- Add INSERT policy (was missing — service role bypasses RLS, but this is needed for anon key)
DROP POLICY IF EXISTS "Service role can insert users" ON users;
CREATE POLICY "Service role can insert users"
  ON users FOR INSERT
  WITH CHECK (true);

-- Add DELETE policy for users to delete own account
DROP POLICY IF EXISTS "Users can delete own profile" ON users;
CREATE POLICY "Users can delete own profile"
  ON users FOR DELETE
  USING (auth.uid() = id);
