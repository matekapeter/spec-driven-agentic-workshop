# Aurora Music Dashboard - Implementation Details

## Overview
This document provides comprehensive implementation details for the Aurora Music Dashboard based on the existing codebase structure and environment configuration. It fills in the missing technical specifics needed to complete the application.

## Technology Stack Implementation

### Frontend Architecture (Angular 17)
- **Framework**: Angular 17 with TypeScript 5.2
- **UI Library**: Angular Material 17.3 with CDK
- **Styling**: Angular Material theming + custom CSS with aurora design
- **State Management**: RxJS Observables and Angular Services
- **HTTP Client**: Angular HttpClient with interceptors
- **Routing**: Angular Router with lazy loading
- **Build Tool**: Angular CLI with Webpack
- **Animation**: Angular Animations API + CSS keyframes
- **Forms**: Angular Reactive Forms with validation
- **Testing**: Jasmine and Karma

### Backend Architecture (Spring Boot 3.2)
- **Framework**: Spring Boot 3.2.1 with Java 17
- **Database**: PostgreSQL with Spring Data JPA
- **Authentication**: OAuth 2.0 with Spring Security
- **API**: RESTful endpoints with Spring Web
- **Documentation**: Spring Boot Actuator for health checks
- **Caching**: Spring Cache abstraction
- **Validation**: Bean Validation (Jakarta Validation)
- **Development**: Spring DevTools for hot reload
- **Testing**: Spring Boot Test with TestContainers

## Environment Configuration

### Spotify API Credentials
```bash
# Environment Variables (.env file)
S_CLIENT_ID=
S_CLIENT_SECRET=
```

### Spring Boot Application Configuration
```properties
# backend/src/main/resources/application.properties
spring.application.name=aurora-music-dashboard
server.port=8080

# Database Configuration
spring.datasource.url=${DATABASE_URL:jdbc:postgresql://localhost:5432/aurora_music}
spring.datasource.username=${DB_USERNAME:postgres}
spring.datasource.password=${DB_PASSWORD:password}
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect

# Spotify API Configuration
spotify.client.id=${S_CLIENT_ID}
spotify.client.secret=${S_CLIENT_SECRET}
spotify.redirect.uri=${SPOTIFY_REDIRECT_URI:http://localhost:4200/callback}

# CORS Configuration
cors.allowed.origins=${CORS_ORIGINS:http://localhost:4200}
cors.allowed.methods=GET,POST,PUT,DELETE,OPTIONS
cors.allowed.headers=*

# Security Configuration
jwt.secret=${JWT_SECRET:your-secret-key}
jwt.expiration=86400000
```

### Angular Environment Configuration
```typescript
// frontend/src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  spotifyAuthUrl: 'http://localhost:8080/api/auth/spotify'
};

// frontend/src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: '/api',
  spotifyAuthUrl: '/api/auth/spotify'
};
```

## Aurora Animation Implementation

### CSS Custom Properties
```css
:root {
  /* Aurora Colors */
  --aurora-green: hsl(149 100% 50%);
  --aurora-green-soft: hsl(142 71% 45%);
  --aurora-blue: hsl(199 89% 48%);
  --aurora-purple: hsl(262 83% 58%);
  --aurora-cyan: hsl(188 78% 41%);
  
  /* Glass Effect */
  --glass-bg: hsla(0 0% 100% / 0.05);
  --glass-border: hsla(0 0% 100% / 0.1);
  --glass-backdrop: blur(10px);
}
```

### Aurora Background Animation
```css
.aurora-bg {
  background: linear-gradient(-45deg, #0a0a0a, #111111, #0a0a0a, #1a1a1a);
  background-size: 400% 400%;
  animation: aurora 20s ease-in-out infinite;
}

.aurora-overlay {
  background: 
    radial-gradient(ellipse at top, hsla(149 100% 50% / 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at bottom right, hsla(199 89% 48% / 0.1) 0%, transparent 50%),
    radial-gradient(ellipse at bottom left, hsla(262 83% 58% / 0.1) 0%, transparent 50%),
    radial-gradient(ellipse at center, hsla(188 78% 41% / 0.05) 0%, transparent 50%);
  animation: aurora 25s ease-in-out infinite reverse;
}

@keyframes aurora {
  0%, 100% { 
    background-position: 0% 50%;
    transform: rotate(0deg) scale(1);
  }
  25% { 
    background-position: 100% 50%;
    transform: rotate(1deg) scale(1.05);
  }
  50% { 
    background-position: 50% 100%;
    transform: rotate(-1deg) scale(1.02);
  }
  75% { 
    background-position: 0% 0%;
    transform: rotate(0.5deg) scale(1.03);
  }
}
```

### Glass Morphism Implementation
```css
.glass-card {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-backdrop);
  border: 1px solid var(--glass-border);
}
```

## Angular Component Implementation Details

### Current Playback Component Structure
```typescript
// frontend/src/app/components/current-playback/current-playback.component.ts
@Component({
  selector: 'app-current-playback',
  templateUrl: './current-playback.component.html',
  styleUrls: ['./current-playback.component.scss'],
  animations: [
    trigger('albumGlow', [
      state('playing', style({ boxShadow: '0 0 40px rgba(34, 197, 94, 0.6)' })),
      state('paused', style({ boxShadow: '0 0 20px rgba(34, 197, 94, 0.3)' })),
      transition('* => *', animate('300ms ease-in-out'))
    ])
  ]
})
export class CurrentPlaybackComponent implements OnInit, OnDestroy {
  currentPlayback$: Observable<CurrentPlayback | null>;
  private destroy$ = new Subject<void>();

  constructor(
    private playbackService: PlaybackService,
    private audioFeaturesService: AudioFeaturesService
  ) {
    this.currentPlayback$ = this.playbackService.currentPlayback$;
  }

  ngOnInit(): void {
    // Start real-time updates every 10 seconds
    this.playbackService.startPolling();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.playbackService.stopPolling();
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  getKeyName(key: number): string {
    const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    return keys[key] || 'Unknown';
  }
}
```

### Aurora Background Component
```typescript
// frontend/src/app/components/aurora-background/aurora-background.component.ts
@Component({
  selector: 'app-aurora-background',
  template: `
    <div class="aurora-background" data-testid="aurora-background">
      <div class="aurora-layer aurora-layer-1" [@aurora]="'active'"></div>
      <div class="aurora-layer aurora-layer-2" [@aurora]="'active'"></div>
      <div class="aurora-layer aurora-layer-3" [@aurora]="'active'"></div>
    </div>
  `,
  styleUrls: ['./aurora-background.component.scss'],
  animations: [
    trigger('aurora', [
      state('active', style({ transform: 'translateX(0) translateY(0)' })),
      transition('* => *', animate('20000ms ease-in-out', keyframes([
        style({ transform: 'translateX(0%) translateY(0%)', offset: 0 }),
        style({ transform: 'translateX(25%) translateY(-10%)', offset: 0.25 }),
        style({ transform: 'translateX(-20%) translateY(15%)', offset: 0.5 }),
        style({ transform: 'translateX(15%) translateY(-5%)', offset: 0.75 }),
        style({ transform: 'translateX(0%) translateY(0%)', offset: 1.0 })
      ])))
    ])
  ]
})
export class AuroraBackgroundComponent {
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    // Adjust animation based on screen size if needed
  }
}
```

### Angular Material Theming with Aurora Colors
```scss
// frontend/src/styles.scss
@use '@angular/material' as mat;

// Define aurora color palette
$aurora-primary: mat.define-palette((
  50: #e8f5f0,
  100: #c6e7da,
  200: #a1d7c2,
  300: #7bc7aa,
  400: #5fbb97,
  500: #22c55e, // Aurora green
  600: #16a34a,
  700: #15803d,
  800: #166534,
  900: #14532d,
  A100: #bbf7d0,
  A200: #86efac,
  A400: #4ade80,
  A700: #22c55e,
  contrast: (
    50: rgba(black, 0.87),
    100: rgba(black, 0.87),
    200: rgba(black, 0.87),
    300: rgba(black, 0.87),
    400: rgba(black, 0.87),
    500: rgba(white, 0.87),
    600: rgba(white, 0.87),
    700: rgba(white, 0.87),
    800: rgba(white, 0.87),
    900: rgba(white, 0.87),
    A100: rgba(black, 0.87),
    A200: rgba(black, 0.87),
    A400: rgba(black, 0.87),
    A700: rgba(white, 0.87)
  )
));

$aurora-accent: mat.define-palette((
  50: #ecfeff,
  100: #cffafe,
  200: #a5f3fc,
  300: #67e8f9,
  400: #22d3ee,
  500: #0891b2, // Aurora cyan
  600: #0e7490,
  700: #155e75,
  800: #164e63,
  900: #0c4a6e,
  A100: #80deea,
  A200: #40c4ff,
  A400: #00b0ff,
  A700: #0091ea
));

// Create the theme
$aurora-theme: mat.define-dark-theme((
  color: (
    primary: $aurora-primary,
    accent: $aurora-accent,
    warn: mat.define-palette(mat.$red-palette),
  )
));

@include mat.all-component-themes($aurora-theme);
```

## Database Schema Implementation

### Spring Boot JPA Entity Implementation
```java
// backend/src/main/java/com/workshop/entity/User.java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(name = "spotify_id", unique = true, nullable = false)
    private String spotifyId;
    
    @Column(name = "display_name", nullable = false)
    private String displayName;
    
    @Column(name = "email", unique = true)
    private String email;
    
    @Column(name = "profile_image")
    private String profileImage;
    
    @Column(name = "follower_count")
    private Integer followerCount;
    
    @Column(name = "country")
    private String country;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "subscription_type")
    private SubscriptionType subscriptionType;
    
    @Column(name = "access_token")
    private String accessToken;
    
    @Column(name = "refresh_token")
    private String refreshToken;
    
    @Column(name = "token_expires_at")
    private LocalDateTime tokenExpiresAt;
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Getters and setters...
}

// backend/src/main/java/com/workshop/entity/Track.java
@Entity
@Table(name = "tracks")
public class Track {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(name = "spotify_id", unique = true, nullable = false)
    private String spotifyId;
    
    @Column(name = "name", nullable = false)
    private String name;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "artist_id")
    private Artist artist;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "album_id")
    private Album album;
    
    @Column(name = "duration_ms")
    private Integer durationMs;
    
    @Column(name = "popularity")
    private Integer popularity;
    
    @Column(name = "preview_url")
    private String previewUrl;
    
    @Column(name = "explicit")
    private Boolean explicit;
    
    @OneToOne(mappedBy = "track", cascade = CascadeType.ALL)
    private AudioFeatures audioFeatures;
    
    // Getters and setters...
}

// backend/src/main/java/com/workshop/entity/AudioFeatures.java
@Entity
@Table(name = "audio_features")
public class AudioFeatures {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "track_id")
    private Track track;
    
    @Column(name = "danceability")
    private Float danceability;
    
    @Column(name = "energy")
    private Float energy;
    
    @Column(name = "key_signature")
    private Integer key;
    
    @Column(name = "loudness")
    private Float loudness;
    
    @Column(name = "mode")
    private Integer mode;
    
    @Column(name = "speechiness")
    private Float speechiness;
    
    @Column(name = "acousticness")
    private Float acousticness;
    
    @Column(name = "instrumentalness")
    private Float instrumentalness;
    
    @Column(name = "liveness")
    private Float liveness;
    
    @Column(name = "valence")
    private Float valence;
    
    @Column(name = "tempo")
    private Float tempo;
    
    @Column(name = "time_signature")
    private Integer timeSignature;
    
    // Getters and setters...
}
```

## API Endpoints Implementation

### Spring Boot REST Controller Implementation
```java
// backend/src/main/java/com/workshop/controller/AuthController.java
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "${cors.allowed.origins}")
public class AuthController {
    
    @Autowired
    private SpotifyAuthService spotifyAuthService;
    
    @GetMapping("/spotify")
    public ResponseEntity<AuthUrlResponse> getSpotifyAuthUrl() {
        String authUrl = spotifyAuthService.generateAuthorizationUrl();
        return ResponseEntity.ok(new AuthUrlResponse(authUrl));
    }
    
    @PostMapping("/spotify/callback")
    public ResponseEntity<AuthTokenResponse> handleCallback(@RequestBody AuthCallbackRequest request) {
        try {
            AuthTokenResponse tokenResponse = spotifyAuthService.exchangeCodeForToken(
                request.getCode(), 
                request.getCodeVerifier()
            );
            return ResponseEntity.ok(tokenResponse);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new AuthTokenResponse(null, "Authentication failed: " + e.getMessage()));
        }
    }
}

// backend/src/main/java/com/workshop/controller/PlaybackController.java
@RestController
@RequestMapping("/api/playback")
@CrossOrigin(origins = "${cors.allowed.origins}")
public class PlaybackController {
    
    @Autowired
    private SpotifyApiService spotifyApiService;
    
    @GetMapping("/current/{userId}")
    public ResponseEntity<CurrentPlaybackDto> getCurrentPlayback(@PathVariable UUID userId) {
        try {
            CurrentPlaybackDto playback = spotifyApiService.getCurrentPlayback(userId);
            return playback != null ? 
                ResponseEntity.ok(playback) : 
                ResponseEntity.noContent().build();
        } catch (SpotifyApiException e) {
            return ResponseEntity.status(e.getStatusCode())
                .body(new CurrentPlaybackDto(null, e.getMessage()));
        }
    }
    
    @GetMapping("/recent/{userId}")
    public ResponseEntity<List<RecentTrackDto>> getRecentTracks(
        @PathVariable UUID userId,
        @RequestParam(defaultValue = "20") int limit
    ) {
        try {
            List<RecentTrackDto> recentTracks = spotifyApiService.getRecentTracks(userId, limit);
            return ResponseEntity.ok(recentTracks);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}

// backend/src/main/java/com/workshop/controller/UserController.java
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "${cors.allowed.origins}")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @GetMapping("/{userId}")
    public ResponseEntity<UserDto> getUser(@PathVariable UUID userId) {
        Optional<UserDto> user = userService.findById(userId);
        return user.map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/{userId}/top-artists")
    public ResponseEntity<List<ArtistDto>> getTopArtists(
        @PathVariable UUID userId,
        @RequestParam(defaultValue = "medium_term") String timeRange,
        @RequestParam(defaultValue = "20") int limit
    ) {
        try {
            List<ArtistDto> topArtists = spotifyApiService.getTopArtists(userId, timeRange, limit);
            return ResponseEntity.ok(topArtists);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
```

### Global Exception Handling
```java
// backend/src/main/java/com/workshop/config/GlobalExceptionHandler.java
@ControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(SpotifyApiException.class)
    public ResponseEntity<ErrorResponse> handleSpotifyApiException(SpotifyApiException e) {
        ErrorResponse error = new ErrorResponse(
            "SPOTIFY_API_ERROR", 
            e.getMessage(), 
            Instant.now()
        );
        return ResponseEntity.status(e.getStatusCode()).body(error);
    }
    
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleUserNotFound(UserNotFoundException e) {
        ErrorResponse error = new ErrorResponse(
            "USER_NOT_FOUND", 
            e.getMessage(), 
            Instant.now()
        );
        return ResponseEntity.notFound().build();
    }
    
    @ExceptionHandler(TokenExpiredException.class)
    public ResponseEntity<ErrorResponse> handleTokenExpired(TokenExpiredException e) {
        ErrorResponse error = new ErrorResponse(
            "TOKEN_EXPIRED", 
            "Please re-authenticate with Spotify", 
            Instant.now()
        );
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }
    
    @ExceptionHandler(RateLimitExceededException.class)
    public ResponseEntity<ErrorResponse> handleRateLimit(RateLimitExceededException e) {
        ErrorResponse error = new ErrorResponse(
            "RATE_LIMIT_EXCEEDED", 
            "Too many requests. Please try again later.", 
            Instant.now()
        );
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
            .header("Retry-After", e.getRetryAfter().toString())
            .body(error);
    }
}
```

## Real-time Updates Strategy

### Angular Service with RxJS Polling Implementation
```typescript
// frontend/src/app/services/playback.service.ts
@Injectable({
  providedIn: 'root'
})
export class PlaybackService {
  private currentPlayback$ = new BehaviorSubject<CurrentPlayback | null>(null);
  private pollingSubscription?: Subscription;
  private readonly POLLING_INTERVAL = 10000; // 10 seconds

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  get currentPlayback(): Observable<CurrentPlayback | null> {
    return this.currentPlayback$.asObservable();
  }

  startPolling(): void {
    if (this.pollingSubscription) {
      this.stopPolling();
    }

    // Initial fetch
    this.fetchCurrentPlayback().subscribe();

    // Set up polling
    this.pollingSubscription = interval(this.POLLING_INTERVAL)
      .pipe(
        switchMap(() => this.fetchCurrentPlayback()),
        catchError(error => {
          console.error('Playback polling error:', error);
          return EMPTY;
        })
      )
      .subscribe();
  }

  stopPolling(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
      this.pollingSubscription = undefined;
    }
  }

  private fetchCurrentPlayback(): Observable<CurrentPlayback> {
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      return EMPTY;
    }

    return this.http.get<CurrentPlayback>(`${environment.apiUrl}/playback/current/${userId}`)
      .pipe(
        tap(playback => this.currentPlayback$.next(playback)),
        retry(3),
        catchError(error => {
          if (error.status === 401) {
            this.authService.redirectToLogin();
          }
          return throwError(() => error);
        })
      );
  }
}
```

### Progress Bar Updates
```typescript
// CSS-based smooth transitions
.progress-bar {
  background: linear-gradient(90deg, var(--aurora-green), var(--aurora-blue));
  transition: width 1s ease-out;
}

// Dynamic width calculation
style={{ width: `${((progress || 0) / duration) * 100}%` }}
```

## Responsive Design Implementation

### CSS Grid Layout
```css
/* Main content grid */
.grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
}

@media (min-width: 1280px) {
  .xl\:grid-cols-3 {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Current playback responsive */
.grid-cols-1.lg\:grid-cols-2 {
  grid-template-columns: repeat(1, 1fr);
}

@media (min-width: 1024px) {
  .lg\:grid-cols-2 {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

### Mobile Breakpoints
```css
/* Mobile-first approach */
.glass-card {
  padding: 1rem;
}

@media (min-width: 768px) {
  .glass-card {
    padding: 2rem;
  }
}
```

## Audio Analysis Visualization

### Audio Features Display
```tsx
// 2x2 grid for audio features preview
<div className="grid grid-cols-2 gap-4">
  <div className="glass-card rounded-xl p-4">
    <div className="flex items-center space-x-3">
      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
      <div>
        <p className="text-sm text-gray-400">Energy</p>
        <p className="font-medium">{audioFeatures.energy?.toFixed(2)}</p>
      </div>
    </div>
  </div>
  // ... other features
</div>
```

### Radar Chart Implementation (Future)
```tsx
// Using Recharts for radar visualization
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

const audioData = [
  { feature: 'Energy', value: audioFeatures.energy * 100 },
  { feature: 'Danceability', value: audioFeatures.danceability * 100 },
  { feature: 'Valence', value: audioFeatures.valence * 100 },
  // ... other features
];
```

## Development Workflow

### Development Server
```bash
# Start both client and server
npm run dev

# Backend server on :3000
# Frontend served through Vite
```

### Build Process
```bash
# Production build
npm run build

# Builds client assets and server bundle
# Outputs to dist/ directory
```

### Database Migration
```bash
# Push schema changes
npm run db:push

# Generates and applies database schema
```

## Performance Optimizations

### Image Loading Strategy
```tsx
// Lazy loading with fallback images
<img
  src={album?.image || artist.image || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop"}
  alt="Album cover"
  loading="lazy"
  className="w-full aspect-square rounded-2xl"
/>
```

### Bundle Optimization
```typescript
// Vite configuration for optimal bundling
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  }
});
```

## Testing Strategy

### Component Testing
```tsx
// Test IDs for reliable testing
data-testid="current-playback"
data-testid="album-artwork"
data-testid="play-status"
data-testid="progress-bar"
```

### API Testing
```typescript
// Express route testing structure
describe('/api/playback/:userId', () => {
  it('should return current playback data', async () => {
    // Test implementation
  });
});
```

## Deployment Configuration

### Environment Setup
```bash
# Production environment
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://...

# Spotify API configuration
S_CLIENT_ID=your_client_id
S_CLIENT_SECRET=your_client_secret
```

### Static Asset Serving
```typescript
// Express static file serving
app.use('/assets', express.static(path.join(__dirname, 'assets')));
```

## Security Implementation

### CORS Configuration
```typescript
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] 
    : ['http://localhost:5173'],
  credentials: true
}));
```

### Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               connect-src 'self' https://api.spotify.com; 
               img-src 'self' https://*.unsplash.com https://*.scdn.co data:; 
               style-src 'self' 'unsafe-inline';">
```

## Spotify Web API Integration (Official Documentation)

### Authorization Flows

#### Recommended: Authorization Code with PKCE Flow
```typescript
// For client applications where client secret cannot be safely stored
const authConfig = {
  clientId: process.env.S_CLIENT_ID,
  redirectUri: 'http://localhost:3000/callback',
  scope: [
    'user-read-currently-playing',
    'user-read-recently-played', 
    'user-read-private',
    'user-top-read',
    'user-library-read',
    'playlist-read-private'
  ].join(' '),
  state: generateRandomString(16),
  codeChallenge: generateCodeChallenge(),
  codeChallengeMethod: 'S256'
};

// Authorization URL
const authUrl = 'https://accounts.spotify.com/authorize?' + new URLSearchParams({
  response_type: 'code',
  client_id: authConfig.clientId,
  scope: authConfig.scope,
  redirect_uri: authConfig.redirectUri,
  state: authConfig.state,
  code_challenge: authConfig.codeChallenge,
  code_challenge_method: authConfig.codeChallengeMethod
});
```

#### Token Exchange
```typescript
// Exchange authorization code for access token
async function exchangeCodeForToken(authCode: string, codeVerifier: string) {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: authCode,
      redirect_uri: process.env.REDIRECT_URI,
      client_id: process.env.S_CLIENT_ID,
      code_verifier: codeVerifier,
    }),
  });

  const tokens = await response.json();
  return {
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    expires_in: tokens.expires_in
  };
}
```

### Spotify API Endpoints (Official Specifications)

#### Get Currently Playing Track
```typescript
// Endpoint: GET /v1/me/player/currently-playing
// Required Scope: user-read-currently-playing
async function getCurrentlyPlaying(accessToken: string) {
  const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing?market=US&additional_types=episode', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    }
  });

  if (response.status === 204) {
    return null; // No content - nothing playing
  }

  const data = await response.json();
  return {
    device: data.device,
    repeat_state: data.repeat_state, // 'off', 'track', 'context'
    shuffle_state: data.shuffle_state,
    context: data.context,
    timestamp: data.timestamp,
    progress_ms: data.progress_ms,
    is_playing: data.is_playing,
    item: data.item, // Track or Episode object
    currently_playing_type: data.currently_playing_type // 'track', 'episode', 'ad', 'unknown'
  };
}
```

#### Get Recently Played Tracks
```typescript
// Endpoint: GET /v1/me/player/recently-played
// Required Scope: user-read-recently-played
// Note: Currently doesn't support podcast episodes
async function getRecentlyPlayed(accessToken: string, limit: number = 20) {
  const response = await fetch(`https://api.spotify.com/v1/me/player/recently-played?limit=${limit}&market=US`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    }
  });

  const data = await response.json();
  return {
    items: data.items, // Array of play history objects
    next: data.next,   // URL for next page
    cursors: data.cursors, // Before/after cursors for pagination
    limit: data.limit,
    href: data.href
  };
}
```

#### Get Track Audio Features
```typescript
// Endpoint: GET /v1/audio-features/{id}
// Returns detailed audio analysis for a track
async function getAudioFeatures(accessToken: string, trackId: string) {
  const response = await fetch(`https://api.spotify.com/v1/audio-features/${trackId}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    }
  });

  const features = await response.json();
  return {
    acousticness: features.acousticness,     // 0.0-1.0
    danceability: features.danceability,     // 0.0-1.0
    energy: features.energy,                 // 0.0-1.0
    instrumentalness: features.instrumentalness, // 0.0-1.0
    key: features.key,                       // 0-11 (C, C#, D, etc.)
    liveness: features.liveness,             // 0.0-1.0
    loudness: features.loudness,             // typically -60 to 0 dB
    mode: features.mode,                     // 0 (minor) or 1 (major)
    speechiness: features.speechiness,       // 0.0-1.0
    tempo: features.tempo,                   // BPM
    time_signature: features.time_signature, // 3-7
    valence: features.valence               // 0.0-1.0 (musical positiveness)
  };
}
```

#### Get User's Top Items
```typescript
// Endpoint: GET /v1/me/top/{type}
// Required Scope: user-top-read
// type: 'artists' or 'tracks'
async function getTopItems(accessToken: string, type: 'artists' | 'tracks', timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term') {
  const response = await fetch(`https://api.spotify.com/v1/me/top/${type}?time_range=${timeRange}&limit=20&offset=0`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    }
  });

  return await response.json();
}
```

### Rate Limiting and Error Handling

#### Rate Limit Handling
```typescript
class SpotifyAPIClient {
  private async makeRequest(url: string, options: RequestInit) {
    const response = await fetch(url, options);
    
    // Handle rate limiting (429)
    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After');
      const delay = retryAfter ? parseInt(retryAfter) * 1000 : 1000;
      
      await new Promise(resolve => setTimeout(resolve, delay));
      return this.makeRequest(url, options); // Retry
    }
    
    // Handle authentication errors (401)
    if (response.status === 401) {
      await this.refreshToken();
      return this.makeRequest(url, options); // Retry with new token
    }
    
    // Handle forbidden (403) - insufficient scopes
    if (response.status === 403) {
      throw new Error('Insufficient permissions. Check required scopes.');
    }
    
    return response;
  }
}
```

#### Token Refresh Implementation
```typescript
async function refreshAccessToken(refreshToken: string) {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: process.env.S_CLIENT_ID,
    }),
  });

  const tokens = await response.json();
  return {
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token || refreshToken, // May not return new refresh token
    expires_in: tokens.expires_in
  };
}
```

### Required OAuth Scopes

```typescript
const REQUIRED_SCOPES = [
  'user-read-currently-playing',  // Current playback information
  'user-read-recently-played',    // Recently played tracks (no podcasts)
  'user-read-private',           // User profile information
  'user-library-read',           // User's saved tracks and albums
  'user-top-read',               // User's top artists and tracks
  'playlist-read-private',       // User's private playlists
  'playlist-read-collaborative'   // User's collaborative playlists
];
```

### Spotify Content Policy Compliance

#### Important Restrictions
```typescript
// Content usage restrictions per Spotify Developer Policy
const POLICY_COMPLIANCE = {
  // ❌ PROHIBITED
  commercialStreaming: false,     // Cannot use for commercial streaming
  contentDownload: false,         // Cannot download or permanently store content  
  contentSynchronization: false,  // Cannot sync content with visual media
  mlTraining: false,              // Cannot train ML/AI models with content
  contentBroadcasting: false,     // Cannot broadcast Spotify content
  
  // ✅ ALLOWED
  personalDashboard: true,        // Personal music analytics dashboard
  playbackControl: true,          // Control user's Spotify playback
  metadataDisplay: true,          // Display track/artist/album metadata
  audioAnalysis: true,            // Show audio features and analysis
  userInsights: true              // Provide listening insights and statistics
};
```

### Production Deployment Considerations

#### App Registration Requirements
```typescript
// Required for Spotify Developer Dashboard app setup
const SPOTIFY_APP_CONFIG = {
  name: "Aurora Music Dashboard",
  description: "Personal music analytics and visualization dashboard",
  website: "https://yourdomain.com",
  redirectUris: [
    "https://yourdomain.com/callback",
    "http://localhost:3000/callback" // Development only
  ],
  apiUsage: "Web API",
  commercialUse: "No", // Important: Not for commercial streaming
  needsClientSecret: false // Using PKCE flow
};
```

#### Environment Variables for Production
```bash
# Production environment
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://...

# Spotify API configuration (from Developer Dashboard)
S_CLIENT_ID=your_actual_client_id
S_CLIENT_SECRET=your_actual_client_secret # Optional for PKCE flow
SPOTIFY_REDIRECT_URI=https://yourdomain.com/callback

# Security
SESSION_SECRET=your_session_secret_key
CORS_ORIGIN=https://yourdomain.com
```

### Integration Architecture

#### Data Flow Diagram
```
User Authentication Flow:
[User] → [Authorization Request] → [Spotify OAuth] → [Authorization Code] 
→ [Token Exchange] → [Access Token] → [API Requests] → [Dashboard Data]

Real-time Updates:
[Spotify Playback] ← [Polling Every 10s] ← [React Query] ← [Dashboard Components]
```

#### Error Boundary Implementation
```tsx
class SpotifyErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (error.message.includes('401')) {
      // Token expired - redirect to login
      window.location.href = '/auth/spotify';
    } else if (error.message.includes('403')) {
      // Insufficient permissions - show upgrade message
      this.setState({ showPermissionError: true });
    } else if (error.message.includes('429')) {
      // Rate limited - show retry message
      this.setState({ showRateLimitError: true });
    }
  }
}
```

This comprehensive Spotify Web API integration guide ensures full compliance with official documentation and provides production-ready implementation patterns for the Aurora Music Dashboard.