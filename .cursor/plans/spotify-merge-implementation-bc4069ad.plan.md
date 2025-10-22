<!-- bc4069ad-6828-4550-9a24-86d4c86ccab3 841741d0-a2ef-4e2b-bb83-865a5c5dab9a -->
# Spotify Merge - Full Implementation Plan

## Phase 1: Environment Setup & Configuration

**Backend Setup:**

- Install dependencies: `@nestjs/config`, `@nestjs/schedule`, `spotify-web-api-node`, `express-session`, `@types/express-session`
- Configure NestJS to run on port 3001 with CORS enabled for `http://localhost:3000`
- Set up ConfigModule for environment variables
- Create `.env.example` template with Spotify credentials placeholders

**Frontend Setup:**

- No additional dependencies needed initially
- Configure Next.js to proxy API calls to backend at `http://localhost:3001`

**Project Files:**

- Create comprehensive `.gitignore` for both frontend/backend (include `.env`, `node_modules`, etc.)
- Update root `README.md` with project overview, setup instructions, and Spotify Developer setup guide
- Add `.editorconfig` for consistent code style
- Create `merge-config.json` template for storing playlist merge configuration

## Phase 2: Spotify OAuth2 Authentication

**Backend Implementation:**

- Create `AuthModule` with `AuthController` and `AuthService`
- Implement session management with `express-session` in `main.ts`
- Create endpoints:
  - `GET /auth/login` - Initiates Spotify OAuth flow
  - `GET /auth/callback` - Handles OAuth callback, exchanges code for tokens
  - `GET /auth/me` - Returns current user profile (protected)
  - `POST /auth/logout` - Clears session
- Store access token, refresh token, and expiry in server-side session
- Implement token refresh logic in `AuthService`

**Frontend Implementation:**

- Create login page at `/login` with "Connect to Spotify" button
- Create callback handler (redirects to main app after auth)
- Add auth state management (check if user is authenticated)
- Display user profile info on successful login

**Key Files:**

- `backend/src/auth/auth.module.ts`
- `backend/src/auth/auth.controller.ts`
- `backend/src/auth/auth.service.ts`
- `backend/src/main.ts` (session config)
- `frontend/src/app/login/page.tsx`

## Phase 3: Playlist Retrieval

**Backend Implementation:**

- Create `SpotifyModule` with `SpotifyService` and `SpotifyController`
- Implement `SpotifyService` using `spotify-web-api-node`
- Create endpoint `GET /spotify/playlists` - fetches user's playlists with authentication
- Add session guard/middleware to protect endpoints

**Frontend Implementation:**

- Create playlists page at `/playlists`
- Fetch and display user's playlists with checkboxes for selection
- Show playlist name, track count, and Spotify ID
- Add loading states and error handling

**Key Files:**

- `backend/src/spotify/spotify.module.ts`
- `backend/src/spotify/spotify.service.ts`
- `backend/src/spotify/spotify.controller.ts`
- `frontend/src/app/playlists/page.tsx`

## Phase 4: Playlist Merge Logic

**Backend Implementation:**

- Add endpoint `POST /spotify/merge` accepting:
  - `playlistIds: string[]` - playlists to merge
  - `targetPlaylistName: string` - name for merged playlist
  - `targetPlaylistId?: string` - optional existing playlist to update
- Implement merge logic in `SpotifyService`:

  1. Fetch all tracks from selected playlists
  2. Deduplicate using track URIs (Set)
  3. Check if target playlist exists, create if not
  4. Get existing tracks from target playlist
  5. Filter out tracks already in target
  6. Add new tracks in batches (Spotify API limit: 100 tracks per request)
  7. Return summary: tracks added, total tracks, playlist URL

- Save merge configuration to `merge-config.json` for cron use

**Frontend Implementation:**

- Add merge form to playlists page:
  - Checkboxes for playlist selection
  - Input field for merged playlist name
  - Submit button
- Display merge results (success message, track count, playlist link)
- Show merge history/status

**Key Files:**

- `backend/src/spotify/spotify.service.ts` (merge logic)
- `backend/src/spotify/spotify.controller.ts` (POST endpoint)
- `backend/src/spotify/dto/merge-playlist.dto.ts`
- `frontend/src/app/playlists/page.tsx` (enhanced with form)

## Phase 5: Automation with Cron

**Backend Implementation:**

- Configure `@nestjs/schedule` in `AppModule`
- Create `CronService` in `SpotifyModule`
- Implement cron job with `@Cron('0 * * * *')` (every hour)
- Read merge configuration from `merge-config.json`
- Execute merge logic for configured playlists
- Log results to console with timestamp and track count
- Handle token refresh automatically
- Add graceful error handling (don't crash on API errors)

**Configuration File (`merge-config.json`):**

```json
{
  "userId": "spotify_user_id",
  "merges": [
    {
      "sourcePlaylistIds": ["id1", "id2", "id3"],
      "targetPlaylistName": "Global Playlist",
      "targetPlaylistId": "merged_id"
    }
  ]
}
```

**Key Files:**

- `backend/src/spotify/cron.service.ts`
- `backend/src/app.module.ts` (ScheduleModule import)
- `merge-config.json`

## Phase 6: Polish & Best Practices

**Security & Configuration:**

- Move all secrets to `.env`: `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REDIRECT_URI`, `SESSION_SECRET`, `FRONTEND_URL`
- Add environment validation using `@nestjs/config` with Joi
- Implement proper error responses with HTTP status codes
- Add request logging middleware

**Code Quality:**

- Create DTOs for all API requests/responses
- Add proper TypeScript types throughout
- Implement auth guards using NestJS guards
- Add comments for complex logic
- Follow NestJS and Next.js best practices

**User Experience:**

- Add loading spinners for API calls
- Show clear error messages
- Add success notifications
- Create a simple, clean UI with basic styling

## Phase 7: Deployment

**Frontend Deployment (Vercel):**

- Add `vercel.json` with environment variable requirements
- Update `SPOTIFY_REDIRECT_URI` to production URL
- Deploy via Vercel CLI or GitHub integration
- Set environment variables in Vercel dashboard

**Backend Deployment (Render/Railway):**

- Create `Dockerfile` for containerized deployment
- Add `render.yaml` or `railway.json` configuration
- Configure environment variables in platform dashboard
- Ensure cron keeps running (Railway auto-restarts, Render needs persistent instance)
- Set up health check endpoint `GET /health`

**Documentation:**

- Update `README.md` with:
  - Spotify Developer app setup instructions
  - Local development setup
  - Environment variables reference
  - Deployment instructions
  - Usage guide
- Add deployment verification checklist

**Key Files:**

- `backend/Dockerfile`
- `backend/render.yaml` or `railway.json`
- `frontend/vercel.json`
- `README.md` (comprehensive update)

## Testing Strategy

- Test OAuth flow end-to-end
- Verify token refresh works correctly
- Test merge with various playlist combinations
- Verify deduplication logic
- Test cron execution (reduce interval for testing)
- Ensure proper error handling for rate limits and API errors

### To-dos

- [ ] Install backend dependencies and configure NestJS for port 3001 with CORS and session management
- [ ] Create .gitignore, .editorconfig, .env.example, and update README with Spotify Developer setup guide
- [ ] Implement OAuth2 authentication backend (AuthModule, session storage, token refresh logic)
- [ ] Create login page and authentication flow in Next.js frontend
- [ ] Create SpotifyService with playlist retrieval endpoint and session guards
- [ ] Build playlists page with selection UI and merge form
- [ ] Implement playlist merge logic with deduplication and batch adding
- [ ] Set up cron job for hourly automatic merging with config file integration
- [ ] Add environment validation, error handling, DTOs, and auth guards
- [ ] Create Dockerfile, deployment configs, health check endpoint, and deployment documentation