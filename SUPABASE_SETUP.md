# ☁️ How to Set Up Supabase for Opentunes

Opentunes uses **Supabase** (an open-source Firebase alternative) to handle:
1.  **Authentication** (Sign In / Sign Up).
2.  **Database** (Syncing your Library across devices).
3.  **Storage** (Backing up your MP3s).

Follow this guide to get your cloud keys. It is free for personal use.

---

## Step 1: Create a Project
1.  Go to [https://supabase.com](https://supabase.com) and click **"Start your project"**.
2.  Sign in with GitHub.
3.  Click **"New Project"**.
4.  **Name**: `Opentunes` (or anything you like).
5.  **Database Password**: Generate a strong password and save it (you won't need it for this app, but good to have).
6.  **Region**: Choose a region close to you (e.g., US East).
7.  Click **"Create new project"**.
    *   *Wait about 1-2 minutes for the database to provision.*

## Step 2: Get Your API Keys
Once the project is "Active":
1.  Look at the left sidebar dashboard.
2.  Click on **Settings** (the Cog/Gear icon at the bottom).
3.  Click on **API**.
4.  You will see `Project URL` and `Project API keys`.
    *   **URL**: Copy this. It looks like `https://xyzabc.supabase.co`.
    *   **anon public**: Copy this. It is a long string starting with `ey...`.

## Step 3: Configure Authentication
1.  Click on the **Authentication** icon in the sidebar (looks like a Users group).
2.  Click on **Providers**.
3.  Ensure **Email** is "Enabled".
    *   (Optional) You can also enable Google/GitHub login here, but Email Magic Link works out of the box.

## Step 4: Connect Opentunes
1.  Go to your local `acestep_studio` directory.
2.  Create a new file named `.env.local`.
3.  Paste your keys in the following format:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

4.  **Restart the App**:
    *   Stop the frontend terminal (Ctrl+C).
    *   Run `npm run dev` again.

## Step 5: Verify
1.  Open [http://localhost:7865](http://localhost:7865).
2.  The "Local Mode" badge in the top right should now be a **"Sign In / Sync"** button.
3.  Click it and enter your email.
4.  Check your email for the Magic Link to log in!

---

## (Advanced) Database & Storage Setup
Later in Horizon 3, we will set up the database.

### Enable Cloud Storage (For MP3 Backup)
1.  Go to **Storage** in Supabase Dashboard.
2.  Create a new Bucket named `music`.
3.  Make it **Public**.
4.  (Or run the SQL in `supabase_schema.sql`).
