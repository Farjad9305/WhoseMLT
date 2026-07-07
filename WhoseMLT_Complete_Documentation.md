# WhoseMLT — Complete Project Documentation

> **A Beginner's Guide to Understanding Every Single File, How They Work Together, and How to Modify Them**

---

## Table of Contents

1. [What is WhoseMLT?](#1-what-is-whosemlt)
2. [The Big Picture — How a Web App Works](#2-the-big-picture)
3. [Technologies Used (and Why)](#3-technologies-used)
4. [Project File Map](#4-project-file-map)
5. [The Database Layer — Where Data Lives](#5-the-database-layer)
6. [The Backend Layer — The Brain](#6-the-backend-layer)
7. [The Real-Time Layer — The Nervous System](#7-the-real-time-layer)
8. [The Frontend Layer — What Players See](#8-the-frontend-layer)
9. [How Everything Connects](#9-how-everything-connects)
10. [The Complete Game Flow](#10-the-complete-game-flow)
11. [How to Modify Things](#11-how-to-modify-things)
12. [Configuration Files](#12-configuration-files)
13. [Glossary of Terms](#13-glossary-of-terms)

---

## 1. What is WhoseMLT?

WhoseMLT (short for "Whose Most Likely To") is a **real-time multiplayer party game** that runs entirely in a web browser. One person creates a room, shares a code with friends, and everyone votes on fun "Most Likely To..." questions like *"Who is most likely to survive a zombie apocalypse?"*

### Key Features:
- **Real-time multiplayer**: Everyone sees votes, chat messages, and game events instantly — no page refreshing needed.
- **Room-based**: Each game happens in a private room protected by a password.
- **Host controls**: The room creator (host) controls game settings like number of rounds, voting time, and question sets.
- **Live chat**: Players can chat with each other during the game.
- **Custom questions**: Players can add their own "Most Likely To" questions.
- **Kick players**: The host can remove disruptive players.
- **Results & confetti**: At the end, a leaderboard shows who got voted the most, complete with confetti animations.

---

## 2. The Big Picture — How a Web App Works

> **Kid-friendly analogy**: Think of a web application like a restaurant.
> - The **Frontend** is the dining area — the menus, tables, decorations, and everything the customer (user) sees and touches.
> - The **Backend** is the kitchen — where the actual cooking (logic and processing) happens. Customers never see the kitchen.
> - The **Database** is the pantry/fridge — where all the ingredients (data) are stored permanently so the kitchen can use them whenever needed.
> - The **Real-time layer** (Pusher) is like the waiter who runs back and forth between the kitchen and ALL the tables simultaneously, instantly telling every table when their food is ready.

In our project:

| Layer | What it does | Files involved |
|-------|-------------|----------------|
| **Frontend** | What players see and click on | All `.tsx` files in `src/components/` and `src/app/` |
| **Backend** | Processes actions (create room, vote, etc.) | All `route.ts` files inside `src/app/api/` |
| **Database** | Stores rooms, players, votes, messages permanently | `prisma/schema.prisma` and `src/lib/prisma.ts` |
| **Real-time** | Pushes live updates to all players instantly | `src/lib/pusher.ts`, `src/lib/pusher-client.ts`, `src/hooks/useRoom.ts` |

---

## 3. Technologies Used (and Why)

### Core Framework: **Next.js** (version 15)
- **File type**: The entire project structure follows Next.js conventions.
- **What it is**: Next.js is a **framework** (a pre-built skeleton that gives you a head start) built on top of React. Think of React as LEGO bricks, and Next.js as a LEGO instruction manual that tells you how to arrange those bricks into a house.
- **Why we use it**: Next.js lets us write BOTH the frontend (what users see) AND the backend (the server logic) in the SAME project, in the SAME programming language (TypeScript). Without it, we would need two completely separate projects — one for the website and one for the server.
- **Special feature — "App Router"**: Next.js uses a system where the *folder structure* of your files automatically becomes the URL structure of your website. For example, a file at `src/app/room/[roomId]/page.tsx` automatically becomes the URL `yourwebsite.com/room/ABC123`.

### Programming Language: **TypeScript** (`.ts` and `.tsx` files)
- **What it is**: TypeScript is JavaScript with **type safety**. JavaScript is the language that makes websites interactive (buttons that click, animations that move, etc.). TypeScript adds a layer of protection on top — it forces you to declare what *type* of data each variable holds (is it a number? a word? a list?).
- **Why we use it**: It catches mistakes early. If you accidentally try to use a player's name as a number, TypeScript will scream at you *before* the code even runs, saving you hours of debugging.
- **`.ts` vs `.tsx`**: Files ending in `.ts` contain pure logic (no visual elements). Files ending in `.tsx` contain logic *mixed with* HTML-like visual code called **JSX** (JavaScript XML). JSX is a syntax that lets you write HTML directly inside JavaScript, like `<button>Click me</button>`.

### UI Library: **React** (version 19)
- **What it is**: React is a library (a collection of pre-written code) for building user interfaces. It breaks your UI into reusable **components** — independent, self-contained pieces of the screen.
- **Why we use it**: Instead of writing one massive HTML file for the entire game, we break it into small, manageable pieces: `PlayerList`, `ChatPanel`, `GamePanel`, etc. Each component manages its own logic and appearance. If we need to change how the chat looks, we only touch `ChatPanel.tsx` — nothing else breaks.

> **Kid-friendly analogy**: Components are like LEGO pieces. A `PlayerList` is one LEGO piece, a `ChatPanel` is another. You snap them together to build the full game screen (`GameRoom`). If one piece breaks, you just fix that one piece without taking apart the whole thing.

### Styling: **Tailwind CSS** (version 4)
- **File type**: Utility classes used directly in `.tsx` files, with base styles defined in `globals.css`.
- **What it is**: Tailwind CSS is a **utility-first CSS framework**. Instead of writing traditional CSS in a separate file (like `color: red; font-size: 20px;`), you apply tiny pre-built class names directly on HTML elements (like `text-red-500 text-xl`).
- **Why we use it**: It's incredibly fast. You never leave your component file to style something. Every visual change is made right where the HTML is written.
- **Example**: `className="bg-black/40 text-white font-bold rounded-xl px-4 py-2"` means: *dark semi-transparent background, white text, bold font, rounded corners, horizontal padding of 1rem, vertical padding of 0.5rem*.

### Database: **PostgreSQL** + **Prisma ORM**
- **PostgreSQL**: A powerful, free, open-source **relational database** (a database that stores data in tables with rows and columns, like an Excel spreadsheet). Our data (rooms, players, votes, chat messages) lives here permanently.
- **Prisma ORM**: An **ORM** (Object-Relational Mapper) is a translator between your TypeScript code and the database. Instead of writing raw database queries in SQL (a special database language like `SELECT * FROM rooms WHERE id = 'ABC123'`), Prisma lets you write clean TypeScript code like `prisma.room.findUnique({ where: { id: 'ABC123' } })`. It translates your TypeScript into SQL behind the scenes.
- **File type**: Prisma uses a special `.prisma` file format for defining the database structure.

> **Kid-friendly analogy**: PostgreSQL is a massive filing cabinet. Prisma is the secretary who knows exactly which drawer to open and what form to fill out. You just tell the secretary "find me the room with code ABC123" and she handles all the paperwork.

### Real-Time Communication: **Pusher**
- **What it is**: Pusher is a third-party service that enables **WebSocket** connections. WebSockets are a special kind of internet connection that stays "open" between the user's browser and the server, allowing the server to *push* data to the browser instantly without the browser having to ask for it.
- **Why we use it**: In a normal website, the browser has to keep asking the server "anything new? anything new?" (this is called **polling**). With Pusher, the server can shout "HEY! Someone just voted!" and every player's browser hears it immediately. This is what makes the game feel "live".

> **Kid-friendly analogy**: Normal websites work like sending letters — you send a question, wait for a reply. Pusher works like a phone call — once connected, both sides can talk instantly, anytime.

### Additional Libraries:
- **`canvas-confetti`**: Creates the confetti explosion animation on the results screen.
- **`bcrypt-style hashing`**: Used to securely scramble room passwords so they can't be read if someone hacks the database.

---

## 4. Project File Map

Here is every file in the project, organized by folder, with its purpose:

```
WhoseMLT/
│
├── 📄 package.json              ← Project manifest (lists all dependencies)
├── 📄 tsconfig.json             ← TypeScript configuration
├── 📄 next.config.ts            ← Next.js configuration
├── 📄 postcss.config.mjs        ← PostCSS config (needed by Tailwind)
├── 📄 eslint.config.mjs         ← Code style checker configuration
├── 📄 .env                      ← Secret keys (database URL, Pusher keys)
│
├── 📁 prisma/                   ← DATABASE LAYER
│   └── 📄 schema.prisma         ← Database table definitions
│
├── 📁 src/                      ← ALL SOURCE CODE
│   │
│   ├── 📁 app/                  ← PAGES + BACKEND API ROUTES
│   │   ├── 📄 layout.tsx        ← Master page wrapper (fonts, colors, viewport)
│   │   ├── 📄 globals.css       ← Global CSS styles (gradient background, glass effects)
│   │   ├── 📄 page.tsx          ← Home page (renders LandingScreen)
│   │   │
│   │   ├── 📁 room/[roomId]/
│   │   │   └── 📄 page.tsx      ← Game room page (renders GameRoom)
│   │   │
│   │   └── 📁 api/              ← BACKEND API ROUTES (the "kitchen")
│   │       ├── 📁 rooms/        ← Create room, fetch room, update settings
│   │       ├── 📁 join/         ← Join an existing room
│   │       ├── 📁 players/      ← Rename player, kick/leave room
│   │       ├── 📁 game/         ← Start game, advance phases, reset game
│   │       ├── 📁 vote/         ← Cast a vote
│   │       ├── 📁 votes/        ← Fetch all votes for a round
│   │       ├── 📁 chat/         ← Send/fetch chat messages + typing indicators
│   │       └── 📁 questions/    ← Add/edit/delete custom questions
│   │
│   ├── 📁 components/           ← FRONTEND UI PIECES (the "dining area")
│   │   ├── 📄 LandingScreen.tsx ← Home screen (create/join room forms)
│   │   ├── 📄 GameRoom.tsx      ← Main game layout (3-column structure)
│   │   ├── 📄 LobbyPanel.tsx    ← Lobby settings (rounds, sets, custom Qs)
│   │   ├── 📄 GamePanel.tsx     ← Voting screen (question + player cards)
│   │   ├── 📄 ResultsPanel.tsx  ← End-of-game leaderboard + confetti
│   │   ├── 📄 PlayerList.tsx    ← Left sidebar (player names, edit, kick)
│   │   ├── 📄 ChatPanel.tsx     ← Right sidebar (live chat)
│   │   └── 📁 ui/
│   │       ├── 📄 Chip.tsx      ← Small selectable pill button (for "10s", "Classic", etc.)
│   │       └── 📄 Toggle.tsx    ← On/off switch component
│   │
│   ├── 📁 hooks/                ← CONNECTORS (wires between frontend and backend)
│   │   ├── 📄 useRoom.ts       ← Fetches room data + listens for real-time updates
│   │   └── 📄 useVotes.ts      ← Manages vote state + sends vote API calls
│   │
│   ├── 📁 lib/                  ← SHARED UTILITIES (used by both frontend and backend)
│   │   ├── 📄 types.ts         ← TypeScript type definitions (data shapes)
│   │   ├── 📄 game-logic.ts    ← Question sets + game helper functions
│   │   ├── 📄 prisma.ts        ← Database connection (Prisma client singleton)
│   │   ├── 📄 pusher.ts        ← Server-side Pusher (sends events TO browsers)
│   │   ├── 📄 pusher-client.ts ← Client-side Pusher (receives events IN browsers)
│   │   └── 📄 sounds.ts        ← Sound effect utilities (currently unused)
│   │
│   └── 📁 generated/            ← AUTO-GENERATED Prisma client code (don't touch!)
```

---

## 5. The Database Layer — Where Data Lives

> **Kid-friendly analogy**: The database is like a school's filing system. There's a cabinet for "Rooms", another for "Players", another for "Votes", etc. Each cabinet has folders (rows) with specific information written on forms (columns).

### File: `prisma/schema.prisma`
- **File type**: `.prisma` — a special format understood only by Prisma ORM. It's not TypeScript or JavaScript.
- **Purpose**: This file is the **blueprint** of your entire database. It defines what tables exist, what columns each table has, and how tables relate to each other.
- **When to modify**: Whenever you want to add a new type of data to the game (e.g., adding player avatars, or a "reactions" feature).

#### The Tables (called "Models" in Prisma):

**1. Room** — Stores each game room.
| Column | Type | What it stores |
|--------|------|---------------|
| `id` | String | The 8-character room code (e.g., "S2UW3965") |
| `passwordHash` | String | The scrambled (hashed) version of the room password |
| `hostId` | String | The player ID of whoever created the room |
| `hostName` | String | The display name of the host |
| `phase` | String | Current game state: "lobby", "pre_round", "voting", or "game_end" |
| `round` | Int | Which round the game is currently on (starts at 0) |
| `phaseStart` | DateTime? | When the current phase started (used to calculate the countdown timer). The `?` means this field is optional — it can be empty. |
| `version` | Int | A counter that goes up by 1 every time the phase changes. Used to prevent duplicate phase advances. |
| `settings` | Json | All game settings stored as a single JSON blob (voting time, rounds, sets, etc.) |
| `questions` | Json | The list of questions selected for this game, stored as JSON |
| `createdAt` | DateTime | When the room was created |

**Relationships**: A Room has many Players, many Votes, many ChatMessages, and many CustomQuestions. This is indicated by `Player[]`, `Vote[]`, etc. in the schema.

**2. Player** — Stores each player in a room.
| Column | Type | What it stores |
|--------|------|---------------|
| `id` | String | A unique player ID (generated when they join) |
| `name` | String | Their display name |
| `roomId` | String | Which room they belong to |
| `joinedAt` | DateTime | When they joined |

**`onDelete: Cascade`**: This is a safety rule. It means: "If the Room is deleted, automatically delete all Players in that room too." Without this, you'd have orphan player records floating around in the database with no room to belong to.

**3. Vote** — Stores each vote cast during the game.
| Column | Type | What it stores |
|--------|------|---------------|
| `id` | String | Unique vote ID (auto-generated) |
| `roomId` | String | Which room this vote belongs to |
| `round` | Int | Which round this vote was cast in |
| `voterId` | String | Who cast the vote |
| `targetId` | String | Who they voted for |

**`@@unique([roomId, round, voterId, targetId])`**: This is a **uniqueness constraint**. It means: "In a given room, in a given round, a voter can only vote for a specific target ONCE." This prevents someone from voting for the same person 100 times.

**4. ChatMessage** — Stores chat messages.
| Column | Type | What it stores |
|--------|------|---------------|
| `id` | String | Unique message ID |
| `roomId` | String | Which room |
| `pid` | String? | Player ID of who sent it (null for system messages) |
| `name` | String? | Display name of sender |
| `text` | String | The actual message text |
| `isSystem` | Boolean | `true` if it's a system message like "Player joined the room" |
| `sentAt` | DateTime | When it was sent |

**5. CustomQuestion** — Stores player-created questions.
| Column | Type | What it stores |
|--------|------|---------------|
| `id` | String | Unique question ID |
| `roomId` | String | Which room |
| `ownerId` | String | Which player created it |
| `text` | String | The question text |

### File: `src/lib/prisma.ts`
- **File type**: `.ts` (TypeScript)
- **Purpose**: This is the **database connector**. It creates a single, shared connection to the database that every backend API route uses.
- **Why it's written this way**: During development, Next.js restarts your code frequently (called "hot reloading"). Without this file's special singleton pattern (storing the connection on the global object), every restart would create a NEW database connection, eventually overwhelming the database with too many open connections. This file ensures only ONE connection ever exists.
- **When to modify**: Almost never. This file is "set it and forget it."

### File: `.env`
- **File type**: Environment file (no extension, just `.env`)
- **Purpose**: Stores **secret keys** and **configuration values** that should NEVER be committed to GitHub (like your database URL, Pusher API keys, etc.).
- **Contains**:
  - `DATABASE_URL` — The full connection string to your PostgreSQL database.
  - `PUSHER_APP_ID`, `PUSHER_SECRET` — Secret keys for the Pusher service (server-side only).
  - `NEXT_PUBLIC_PUSHER_KEY`, `NEXT_PUBLIC_PUSHER_CLUSTER` — Public keys for Pusher (the `NEXT_PUBLIC_` prefix means these are safe to expose to the browser).

---

## 6. The Backend Layer — The Brain

> **Kid-friendly analogy**: The backend API routes are like the kitchen staff at a restaurant. Each route is a different cook with a specific specialty. The "rooms" cook only knows how to create and manage rooms. The "vote" cook only knows how to process votes. A customer (the frontend) sends an order (an HTTP request) to the right cook, and the cook prepares the response.

All backend files live inside `src/app/api/`. In Next.js, any file named `route.ts` inside the `api/` folder automatically becomes an **API endpoint** (a URL that the frontend can send requests to).

### What is an API Endpoint?

An **API endpoint** is a specific URL on your server that accepts requests and sends back responses. Think of it like a drive-through window — the car (frontend) pulls up, shouts an order through the speaker (sends a request), and the window hands back food (response data).

Each endpoint responds to specific **HTTP methods** (types of requests):
- **GET**: "Give me data" (like reading a book)
- **POST**: "Create something new" (like writing a new page)
- **PATCH**: "Update something existing" (like editing a page)
- **DELETE**: "Remove something" (like tearing out a page)

### File: `src/app/api/rooms/route.ts`
- **URL**: `POST /api/rooms`
- **Purpose**: **Creates a new game room.**
- **What it does step-by-step**:
  1. Receives the host's display name and chosen password from the frontend.
  2. Validates that the name is at least 2 characters and password at least 3.
  3. Generates a unique 8-character room code (e.g., "S2UW3965") using `generateRoomId()` from `game-logic.ts`.
  4. Generates a unique player ID for the host using `generatePlayerId()`.
  5. Hashes (scrambles) the password using `hashPassword()` so the real password is never stored in the database.
  6. Creates the Room in the database with default settings (30s voting time, 10 rounds, "Classic" set selected).
  7. Also creates the host as the first Player in that room.
  8. Also creates a system chat message: "PlayerName created the room ✨".
  9. Sends back the room data and the host's player ID.

### File: `src/app/api/rooms/[roomId]/route.ts`
- **URL**: `GET /api/rooms/ABC123` and `PATCH /api/rooms/ABC123`
- **The `[roomId]` is a dynamic segment** — it's a placeholder. Whatever value appears in the URL becomes accessible as a variable. So `/api/rooms/S2UW3965` means `roomId = "S2UW3965"`.
- **GET**: Fetches all data about a specific room (room details, players, settings).
- **PATCH**: Updates the room's settings. Only the host can do this. After updating, it broadcasts the changes to all players via Pusher so their screens update instantly.

### File: `src/app/api/join/route.ts`
- **URL**: `POST /api/join`
- **Purpose**: **Lets a player join an existing room.**
- **What it does**:
  1. Receives the player's name, room ID, and password.
  2. Looks up the room in the database.
  3. Checks if the room exists, if the password matches (by hashing the input and comparing it to the stored hash), and if the game hasn't already ended.
  4. Creates a new Player record in the database.
  5. Creates a system chat message: "PlayerName joined the room".
  6. **Broadcasts via Pusher**: Sends a `player-joined` event to the room channel so ALL existing players' screens instantly show the new player in their player list.
  7. Returns the room data and the new player's ID.

### File: `src/app/api/players/[roomId]/route.ts`
- **URL**: `PATCH /api/players/ABC123`
- **Purpose**: **Renames a player.**
- **What it does**:
  1. Receives the player ID and new name.
  2. Updates the player's name in the database.
  3. If the player is the host, also updates the room's `hostName`.
  4. Broadcasts a `player-renamed` event via Pusher so everyone sees the new name immediately.

### File: `src/app/api/players/[roomId]/leave/route.ts`
- **URL**: `DELETE /api/players/ABC123/leave`
- **Purpose**: **Handles a player leaving or being kicked.**
- **What it does**:
  1. Deletes the player from the database.
  2. Deletes all custom questions that player had added.
  3. Broadcasts a `player-left` event via Pusher. On the kicked player's browser, this event triggers an automatic redirect to the home screen.
  4. If the player who left had custom questions, broadcasts an updated `customQTotal` count so the lobby settings update.
  5. If the room is now empty, deletes the entire room.
  6. If the person who left was the host, promotes the next player to be the new host (**host migration**).

### File: `src/app/api/game/route.ts`
- **URL**: `POST /api/game` (start game) and `PATCH /api/game` (advance phase)
- **Purpose**: **Controls the game's lifecycle** — starting the game and advancing through phases.

**POST (Start Game)**:
1. Only the host can trigger this.
2. Calls `selectQuestions()` from `game-logic.ts` to pick the right number of questions from the selected sets.
3. Saves the selected questions to the room.
4. Changes the room's phase from "lobby" to "pre_round".
5. Sets `phaseStart` to the current time (this starts the countdown timer).
6. Broadcasts `game-started` and `phase-changed` events via Pusher.

**PATCH (Advance Phase)**:
1. This is called automatically when a timer runs out. ANY player's browser can trigger this (whoever's timer hits zero first).
2. Uses a **version check** to prevent duplicate advances. The request includes the `knownVersion` — if it doesn't match the room's current version, the request is ignored (another player already advanced it).
3. Phase transitions: `pre_round` → `voting` → (next round's) `pre_round` → ... → `game_end`.
4. Increments the version counter.
5. Broadcasts the `phase-changed` event.

### File: `src/app/api/game/reset/route.ts`
- **URL**: `POST /api/game/reset`
- **Purpose**: **Resets the game back to the lobby** (after a game ends, so you can play again).
- **What it does**: Clears all votes, resets phase to "lobby", round to 0, and clears the selected questions. Custom questions are intentionally preserved so they can be reused.

### File: `src/app/api/vote/route.ts`
- **URL**: `POST /api/vote`
- **Purpose**: **Processes a player's vote.**
- **What it does**:
  1. Validates that the room exists and is currently in the "voting" phase.
  2. If **single vote mode**: Deletes any previous vote by this player in this round, then creates the new vote.
  3. If **multiple votes mode**: Toggles the vote — if the player already voted for this target, it removes the vote; otherwise, it adds the vote.
  4. Fetches ALL votes for the current round and broadcasts them via Pusher (`votes-synced`) so every player's screen updates with the latest vote counts.

### File: `src/app/api/chat/[roomId]/route.ts`
- **URL**: `GET /api/chat/ABC123` (fetch messages) and `POST /api/chat/ABC123` (send message)
- **Purpose**: **Handles chat messages.**
- **GET**: Returns all chat messages for the room.
- **POST**: Creates a new chat message, saves it to the database, and broadcasts it via Pusher so it appears instantly on everyone's chat panel.

### File: `src/app/api/chat/typing/route.ts`
- **URL**: `POST /api/chat/typing`
- **Purpose**: **Broadcasts typing indicators.** When a player types in the chat box, this sends a `user-typing` event via Pusher so other players see "PlayerName is typing...".

### File: `src/app/api/questions/route.ts`
- **URL**: `GET`, `POST`, `PATCH`, `DELETE /api/questions`
- **Purpose**: **Manages custom questions.**
- **GET**: Fetches a specific player's custom questions.
- **POST**: Adds a new custom question. Broadcasts updated `customQTotal` count.
- **PATCH**: Edits an existing custom question (only the owner can edit their own).
- **DELETE**: Deletes a custom question. Broadcasts updated `customQTotal` count.

### File: `src/lib/game-logic.ts`
- **File type**: `.ts` (TypeScript)
- **Purpose**: Contains **all the built-in question sets** and **helper functions** used by the backend.
- **What's inside**:
  - `QUESTION_SETS`: A massive object containing 5 sets of 25 questions each: Classic, Chaos, Awkward, Polarizing, and Dirty. Each question has an `id`, `text`, and `src` (which set it belongs to).
  - `generateRoomId()`: Creates random 8-character alphanumeric room codes.
  - `generatePlayerId()`: Creates unique player IDs.
  - `hashPassword()`: Scrambles passwords for secure storage.
  - `selectQuestions()`: The algorithm that picks the right questions based on the host's settings (which sets are selected, how many from each, whether to include custom questions, etc.).
- **When to modify**: Whenever you want to add, change, or remove questions from the built-in sets.

---

## 7. The Real-Time Layer — The Nervous System

> **Kid-friendly analogy**: Imagine you're in a classroom. Without Pusher, every student would have to keep raising their hand and asking "Did the teacher write anything new on the board?" every second. WITH Pusher, the teacher has a megaphone — whenever she writes something new, she announces it to the whole class at once. No one needs to ask.

### How Pusher Works in This Project

Pusher uses a concept called **channels** and **events**:
- **Channel**: A named communication pipeline. Each room gets its own channel named `room-{roomId}` (e.g., `room-S2UW3965`). Only players in that room subscribe to (listen on) that channel.
- **Event**: A named message sent through a channel. For example, `player-joined`, `vote-updated`, `chat-message`, `phase-changed`, etc.

### File: `src/lib/pusher.ts` (Server-Side Pusher)
- **Purpose**: Used by the BACKEND to **send** events TO players' browsers.
- **How it works**: When the backend processes an action (e.g., someone votes), it calls `pusher.trigger('room-S2UW3965', 'votes-synced', voteData)` to instantly push the updated vote data to every browser that is subscribed to that room's channel.
- **When to modify**: Almost never. Only if you change Pusher providers or configuration.

### File: `src/lib/pusher-client.ts` (Client-Side Pusher)
- **Purpose**: Used by the FRONTEND to **receive** events FROM the server.
- **How it works**: When a player's browser loads the game room, it subscribes to the room's channel. Then it listens for events like `player-joined`, `vote-updated`, etc. When an event arrives, the browser updates the screen accordingly.
- **The `typeof window !== 'undefined'` check**: This is a safety guard. Since Next.js can run code on BOTH the server and the browser, this check ensures the Pusher client is only created in the browser (because the server doesn't have a "window" — only browsers do).

### All Pusher Events Used:

| Event Name | Triggered When | What the Frontend Does |
|------------|---------------|----------------------|
| `player-joined` | A new player joins the room | Adds the player to the player list |
| `player-left` | A player leaves or gets kicked | Removes them from the list; if it's YOU, redirects to home |
| `player-renamed` | A player changes their name | Updates the name in the player list |
| `room-updated` | Host changes settings | Updates the lobby settings on everyone's screen |
| `game-started` | Host clicks "Start Game" | Loads the questions and transitions to the game view |
| `phase-changed` | Timer runs out, game advances | Updates the phase (pre_round → voting → next round) |
| `votes-synced` | Someone casts or changes a vote | Updates the vote counts on everyone's voting cards |
| `chat-message` | Someone sends a chat message | Adds the message to everyone's chat panel |
| `user-typing` | Someone is typing in the chat | Shows "PlayerName is typing..." |

---

## 8. The Frontend Layer — What Players See

> **Kid-friendly analogy**: The frontend is like the face of a clock. You see the hands moving and the numbers on the dial, but all the complex gear mechanisms are hidden behind the face (that's the backend). The frontend's job is to look pretty and respond when you tap it.

### Pages (what URLs show):

#### File: `src/app/layout.tsx`
- **Purpose**: The **master wrapper** for the entire website. Every single page on the site is wrapped inside this file's HTML structure.
- **What it does**:
  - Loads two Google Fonts: **Syne** (used for headings and display text) and **DM Sans** (used for body text).
  - Sets the page title ("WhoseMLT — Most Likely To") and meta description for SEO (Search Engine Optimization — how Google finds and describes your site).
  - Configures the **viewport** to force mobile browsers to render at 1280px width (simulating a desktop view).
  - Applies global styles: background color, text color, font, minimum height.
- **When to modify**: To change fonts, the page title, the viewport width (for mobile), or global body styles.

#### File: `src/app/globals.css`
- **File type**: `.css` (Cascading Style Sheets — the language that controls how HTML elements look: colors, sizes, spacing, animations, etc.)
- **Purpose**: Contains **global styles** that apply across the entire website.
- **What's inside**:
  - The animated 4-color gradient background (`linear-gradient` with animation).
  - The `glass-panel` class (semi-transparent frosted glass effect using `backdrop-blur`).
  - The `glass-button` class (translucent button style).
  - Glow effects (`glow-primary`, `glow-accent`, `glow-success`).
  - Custom scrollbar styling (thin, translucent scrollbars).
  - The floating emoji animation (`float-emoji` keyframes).
- **When to modify**: To change the background gradient colors, glass panel transparency, glow colors, or animation speeds.

#### File: `src/app/page.tsx`
- **URL**: `yourwebsite.com/` (the home page)
- **Purpose**: Renders the `LandingScreen` component. This is the entry point — the first thing users see.
- **This file is tiny** — it just imports and displays `LandingScreen`. All the actual logic and visuals are in the component.

#### File: `src/app/room/[roomId]/page.tsx`
- **URL**: `yourwebsite.com/room/S2UW3965`
- **Purpose**: Renders the `GameRoom` component for a specific room. The `[roomId]` in the folder name is a **dynamic route parameter** — Next.js automatically extracts the room code from the URL and passes it to the component.

### Components (reusable UI pieces):

#### File: `src/components/LandingScreen.tsx`
- **Purpose**: The **home screen** — the first thing players see.
- **What it contains**:
  - The animated floating emojis in the background (🤔, 🎯, 👀, 🔥, 💀, 🤡, 🤫, 🍻, 😈, 😂).
  - A **tabbed form** with two tabs: "Create Room" and "Join Room".
  - Create Room: Takes display name + password → calls `POST /api/rooms`.
  - Join Room: Takes display name + room code + password → calls `POST /api/join`.
  - On success, stores the player ID and room ID in **sessionStorage** (a browser-side storage that persists until you close the tab) and redirects to `/room/{roomId}`.
  - The "How to Play" card explaining the rules.
- **When to modify**: To change the home screen design, add new form fields, change the emojis, or update the "How to Play" instructions.

#### File: `src/components/GameRoom.tsx`
- **Purpose**: The **main game layout** — the container that holds the entire 3-column game interface.
- **What it contains**:
  - **Security check**: On load, verifies the player has a valid session. If not, redirects to home.
  - **Three-column layout**: Left (PlayerList), Center (LobbyPanel/GamePanel/ResultsPanel depending on phase), Right (ChatPanel).
  - **Mobile tab navigation**: On small screens (which we force to desktop width anyway), shows tabs to switch between Players/Game/Chat.
  - **Handler functions**: `handleRename`, `handleStartGame`, `handleNewGame`, `handleLeaveRoom`, `handleKick` — each makes an API call to the corresponding backend route.
  - Uses the `useRoom` and `useVotes` hooks to get live data.
- **When to modify**: To add new sidebar sections, change the column layout, or add new game actions.

#### File: `src/components/LobbyPanel.tsx`
- **Purpose**: The **lobby/settings screen** shown before the game starts.
- **What it contains**:
  - Room Code display with the "Copy" button.
  - **Voting Time** selector (10s, 15s, 20s, 30s).
  - **Number of Rounds** selector (5, 10, 15, 20).
  - **Allow Multiple Votes** toggle.
  - **Question Sets** selection (Classic, Chaos, Awkward, Polarizing, Dirty) with FIFO logic (max 2 sets; selecting a 3rd deselects the first).
  - **Equal Distribution** toggle and custom distribution **slider** (when 2 sets are selected).
  - **Custom Questions** section: Add, edit, delete your own questions.
  - **Use Only Custom Questions** toggle (only available when enough custom questions exist).
  - **Start Game** button (host only, requires 2+ players).
- **When to modify**: To add new game settings, change how question selection works, or modify the lobby UI.

#### File: `src/components/GamePanel.tsx`
- **Purpose**: The **active game screen** shown during `pre_round` and `voting` phases.
- **What it contains**:
  - Round counter ("Round 3 / 10").
  - Phase indicator ("GET READY" or "VOTING OPEN").
  - The question card with the "Most Likely To..." prompt.
  - **Timer bar** with color-coded countdown (changes color when under 5 seconds).
  - **"Voting begins in"** text during the reading phase.
  - **Player voting cards**: Each player's name is displayed as a clickable card. Clicking votes for that player. Vote counts are shown as progress bars filling behind each card.
- **When to modify**: To change the voting UI, timer design, or add new game mechanics.

#### File: `src/components/ResultsPanel.tsx`
- **Purpose**: The **end-of-game results screen** with leaderboard and confetti.
- **What it contains**:
  - Per-question breakdown: For each round, shows the question and who received the most votes.
  - Overall leaderboard: Ranks all players by total votes received across all rounds.
  - Trophy/medal emojis for top 3 players.
  - **Confetti animation**: Uses `canvas-confetti` to trigger a massive burst of colorful confetti.
  - **"Back to Lobby"** button (host only) to reset the game.
- **When to modify**: To change how results are displayed, add new stats, or change the confetti behavior.

#### File: `src/components/PlayerList.tsx`
- **Purpose**: The **left sidebar** showing all players in the room.
- **What it contains**:
  - Player names with a crown emoji (👑) for the host and "(You)" label for yourself.
  - **Edit Name** button (only visible in the lobby phase).
  - **Leave Room** button.
  - **Kick** button (visible only to the host, next to other players' names).
- **When to modify**: To add player avatars, online status indicators, or change the kick UI.

#### File: `src/components/ChatPanel.tsx`
- **Purpose**: The **right sidebar** with live chat functionality.
- **What it contains**:
  - Scrollable message list with auto-scroll to latest message.
  - System messages styled differently (centered, yellow, italic).
  - Player messages with colored names.
  - **Typing indicators**: Shows "PlayerName is typing..." when someone is actively typing.
  - Message input with "Send" button.
- **When to modify**: To change chat styling, add emoji reactions, or modify the typing indicator behavior.

#### Files: `src/components/ui/Chip.tsx` and `src/components/ui/Toggle.tsx`
- **Purpose**: Tiny, reusable UI building blocks.
- **Chip**: A small pill-shaped button used for selecting options (like "10s", "Classic", "5 rounds"). Has an active/inactive state.
- **Toggle**: An on/off switch used for boolean settings (like "Allow Multiple Votes").
- **When to modify**: To change the look of all chips or toggles across the entire app at once.

### Hooks (the wiring between frontend and backend):

> **What is a Hook?** In React, a "hook" is a special function that lets components "hook into" React's features like state management and side effects. Custom hooks (like `useRoom`) are reusable functions that encapsulate complex logic so components stay clean and simple.

#### File: `src/hooks/useRoom.ts`
- **Purpose**: The **most important connector file** in the entire project. It bridges the frontend components with both the backend API and the real-time Pusher events.
- **What it does**:
  1. **Fetches initial data**: When the game room loads, it makes API calls to get the room data and chat history.
  2. **Subscribes to Pusher**: Connects to the room's Pusher channel and listens for ALL real-time events (player joined, player left, votes synced, chat messages, phase changes, typing indicators, etc.).
  3. **Manages the countdown timer**: Calculates how many seconds are left in the current phase by comparing the `phaseStart` timestamp with the current time. When the timer hits zero, it calls the backend to advance to the next phase.
  4. **Provides helper functions**: `updateSettings()` (sends setting changes to the backend), `sendChat()` (sends a chat message to the backend), `advancePhase()` (triggers a phase transition).
  5. **Fallback polling**: Every 5 seconds, it re-fetches the room data from the backend as a safety net. If Pusher misses an event (network glitch), the polling catches the discrepancy.
- **When to modify**: To add new real-time event listeners, change the timer logic, or add new data streams.

#### File: `src/hooks/useVotes.ts`
- **Purpose**: Manages **voting state** for the current round.
- **What it does**:
  - Tracks which players you've voted for (`myVotes`).
  - Calculates vote counts per player (`voteCounts`).
  - Provides a `castVote()` function that sends your vote to the backend API.
  - Syncs with the `votes-synced` Pusher event to keep counts accurate across all players.
- **When to modify**: To change voting logic (e.g., limiting max votes per round, adding vote categories).

### Shared Utilities:

#### File: `src/lib/types.ts`
- **Purpose**: Defines the **shapes of all data** used throughout the project.
- **What it contains**: TypeScript **interfaces** — blueprints that describe what fields an object should have and what types those fields are. For example:
  - `RoomSettings`: Describes the shape of game settings (voting_time is a number, sets is a list of strings, etc.).
  - `PlayerData`: Describes a player (id, name, roomId, joinedAt).
  - `RoomData`: Describes a full room with all its properties.
  - `ChatMessageData`: Describes a chat message.
  - `VoteData`: Describes a vote.
  - `PusherEvent`: Describes all possible real-time events.
- **When to modify**: Whenever you add a new field to any data structure (e.g., adding an `avatar` field to `PlayerData`).

---

## 9. How Everything Connects

Here is the complete data flow for three key actions:

### Flow 1: Player Joins a Room

```
Player types name, room code, password → clicks "Join Room"
        │
        ▼
LandingScreen.tsx sends POST request to /api/join
        │
        ▼
Backend (join/route.ts) receives the request
   ├── Validates the inputs
   ├── Checks room exists in database (via prisma.ts → PostgreSQL)
   ├── Verifies password hash matches
   ├── Creates new Player record in database
   ├── Creates system chat message in database
   ├── Sends "player-joined" event via Pusher (pusher.ts)
   └── Returns room data + player ID
        │
        ▼
LandingScreen.tsx receives the response
   ├── Stores playerId in sessionStorage
   └── Redirects browser to /room/{roomId}
        │
        ▼
GameRoom.tsx loads → useRoom.ts hook activates
   ├── Fetches room data via GET /api/rooms/{roomId}
   └── Subscribes to Pusher channel "room-{roomId}"
        │
        ▼
Meanwhile, on EXISTING players' screens:
   └── useRoom.ts receives "player-joined" Pusher event
       └── Adds the new player to their PlayerList automatically
```

### Flow 2: Player Casts a Vote

```
Player clicks on a player card during voting phase
        │
        ▼
GamePanel.tsx calls castVote() from useVotes.ts
        │
        ▼
useVotes.ts sends POST request to /api/vote
        │
        ▼
Backend (vote/route.ts) receives the request
   ├── Validates room exists and phase is "voting"
   ├── Creates/toggles the Vote record in database
   ├── Fetches ALL votes for this round from database
   └── Broadcasts "votes-synced" event via Pusher
        │
        ▼
On ALL players' screens:
   └── useRoom.ts receives "votes-synced" event
       └── useVotes.ts updates voteCounts
           └── GamePanel.tsx re-renders with updated vote bars
```

### Flow 3: Timer Runs Out → Phase Advances

```
useRoom.ts timer ticks every second
   └── Calculates: timeLeft = duration - elapsed seconds
       │
       ▼ (when timeLeft hits 0)
useRoom.ts calls PATCH /api/game with knownVersion
        │
        ▼
Backend (game/route.ts) receives the request
   ├── Checks if knownVersion matches current version (prevents duplicates)
   ├── Determines next phase (pre_round → voting → next pre_round → ... → game_end)
   ├── Updates room in database (new phase, new round, incremented version)
   └── Broadcasts "phase-changed" event via Pusher
        │
        ▼
On ALL players' screens:
   └── useRoom.ts receives "phase-changed" event
       └── Updates room state → GamePanel.tsx or ResultsPanel.tsx renders accordingly
```

---

## 10. The Complete Game Flow

Here is every phase of the game from start to finish:

```
┌──────────────────────────────────────────┐
│              HOME SCREEN                 │
│  Player creates or joins a room          │
└────────────────┬─────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────┐
│               LOBBY                      │
│  Host configures settings                │
│  Players add custom questions            │
│  Host clicks "Start Game"                │
│  Phase: "lobby"                          │
└────────────────┬─────────────────────────┘
                 │  POST /api/game
                 ▼
┌──────────────────────────────────────────┐
│          PRE-ROUND (Reading)             │
│  Question appears on screen              │
│  "Voting begins in 15..." countdown      │
│  Players read the question               │
│  Phase: "pre_round"                      │
└────────────────┬─────────────────────────┘
                 │  Timer hits 0 → PATCH /api/game
                 ▼
┌──────────────────────────────────────────┐
│              VOTING                      │
│  Players click to vote for someone       │
│  Vote counts update in real-time         │
│  Timer counts down (10-30 seconds)       │
│  Phase: "voting"                         │
└────────────────┬─────────────────────────┘
                 │  Timer hits 0 → PATCH /api/game
                 ▼
          ┌──────┴──────┐
     More rounds?    Last round?
          │              │
          ▼              ▼
   Back to PRE-ROUND   ┌─────────────────────────────┐
   (next question)     │          GAME END            │
                       │  Leaderboard + confetti       │
                       │  Per-question vote breakdown   │
                       │  Host can click "Back to Lobby"│
                       │  Phase: "game_end"             │
                       └───────────────┬───────────────┘
                                       │  POST /api/game/reset
                                       ▼
                                  Back to LOBBY
```

---

## 11. How to Modify Things

### Want to change how the game LOOKS?

| What to change | Which file to edit |
|----------------|-------------------|
| Background gradient colors | `src/app/globals.css` (the `linear-gradient` in `body`) |
| Glass panel transparency | `src/app/globals.css` (the `.glass-panel` class) |
| Fonts | `src/app/layout.tsx` (the font imports at the top) |
| Page title | `src/app/layout.tsx` (the `metadata` object) |
| Mobile viewport width | `src/app/layout.tsx` (the `viewport` object, change `1280`) |
| Game board max height | `src/components/GameRoom.tsx` (the `md:max-h-[850px]` class) |
| Floating emojis | `src/components/LandingScreen.tsx` (the emoji `<div>` elements) |
| Room code size | `src/components/LobbyPanel.tsx` (the `text-4xl md:text-5xl` on the `<h1>`) |
| Copy button text/symbol | `src/components/LobbyPanel.tsx` (the word "Copy" inside the `<button>`) |
| Any component's colors | The respective component `.tsx` file (search for `#` hex codes or Tailwind color classes) |

### Want to change the game RULES/LOGIC?

| What to change | Which file to edit |
|----------------|-------------------|
| Add/edit/remove questions | `src/lib/game-logic.ts` (the `QUESTION_SETS` object) |
| Change default settings | `src/app/api/rooms/route.ts` (the `defaultSettings` object) |
| Change reading time (pre-round) | `src/hooks/useRoom.ts` (the number `15` in the timer logic) |
| Add/remove voting time options | `src/components/LobbyPanel.tsx` (the `[10, 15, 20, 30]` array) |
| Add/remove round options | `src/components/LobbyPanel.tsx` (the `[5, 10, 15, 20]` array) |
| Change max question sets | `src/components/LobbyPanel.tsx` (the `newSets.length >= 2` check) |
| Change voting behavior | `src/app/api/vote/route.ts` |
| Change what happens on game reset | `src/app/api/game/reset/route.ts` |

### Want to change the DATABASE structure?

1. Edit `prisma/schema.prisma` to add/modify/remove tables or columns.
2. Run `npx prisma migrate dev --name describe_your_change` in the terminal to apply the changes.
3. Run `npx prisma generate` to regenerate the Prisma client.
4. Update `src/lib/types.ts` to match the new data shapes.
5. Update any API routes that interact with the changed tables.
6. Update any frontend components that display the changed data.

---

## 12. Configuration Files

These are the files at the root of the project that configure various tools:

### `package.json`
- **What it is**: The project's **identity card and shopping list**. It tells Node.js (the JavaScript runtime) what this project is called, what commands you can run, and what libraries (dependencies) it needs.
- **Key sections**:
  - `scripts`: Shortcut commands. `npm run dev` starts the development server. `npm run build` creates the production version.
  - `dependencies`: Libraries the app NEEDS to work (React, Next.js, Prisma, Pusher, etc.).
  - `devDependencies`: Libraries only needed DURING development (TypeScript compiler, linter, Tailwind CSS).

### `tsconfig.json`
- **What it is**: Configuration for the **TypeScript compiler**. Tells TypeScript how strict to be, where to find files, and how to resolve imports.
- **The `@/` alias**: The `paths` section maps `@/*` to `./src/*`, so instead of writing `import { prisma } from '../../../../lib/prisma'`, you can write `import { prisma } from '@/lib/prisma'`. Much cleaner!

### `next.config.ts`
- **What it is**: Configuration for **Next.js** itself. Currently minimal — just enables default settings.

### `postcss.config.mjs`
- **What it is**: Configuration for **PostCSS**, a CSS processing tool. Tailwind CSS runs as a PostCSS plugin, so this file tells PostCSS to use the Tailwind plugin.

### `eslint.config.mjs`
- **What it is**: Configuration for **ESLint**, a tool that checks your code for common mistakes, style violations, and potential bugs. Think of it as a grammar checker for code.

### `.gitignore`
- **What it is**: Tells **Git** (the version control system) which files to NOT upload to GitHub. Things like `node_modules/` (the massive folder of downloaded libraries), `.env` (secret keys), and `.next/` (build output) should never be committed.

---

## 13. Glossary of Terms

| Term | Simple Explanation |
|------|--------------------|
| **API** | Application Programming Interface — a set of URLs your frontend can call to ask the backend to do things |
| **API Endpoint** | A specific URL on the server that accepts requests (like a drive-through window) |
| **Backend** | The server-side code that runs on a computer in the cloud. Users never see it directly |
| **Broadcast** | Sending a message to multiple recipients at the same time |
| **Channel** | A named communication pipeline in Pusher. Only people subscribed to a channel receive its messages |
| **Client** | The user's browser. "Client-side" means "runs in the browser" |
| **Component** | A reusable, self-contained piece of the user interface (like a LEGO brick) |
| **CRUD** | Create, Read, Update, Delete — the four basic operations on data |
| **CSS** | Cascading Style Sheets — the language that controls how HTML looks (colors, sizes, fonts, layouts) |
| **Database** | A structured system for storing data permanently (like a giant organized filing cabinet) |
| **Dependency** | An external library your project relies on to work |
| **Deploy** | To put your code on a server so real users on the internet can access it |
| **Dynamic Route** | A URL pattern with a variable part, like `/room/[roomId]` where `[roomId]` changes for each room |
| **Environment Variable** | A secret value stored outside the code (in `.env`) to keep it safe |
| **Event** | A named message sent through a Pusher channel (like "player-joined" or "vote-updated") |
| **Framework** | A pre-built code skeleton that provides structure and common features so you don't build from scratch |
| **Frontend** | The visual part of the app that users see and interact with in their browser |
| **Hash** | A one-way scrambling of data. You can turn a password into a hash, but you can't turn a hash back into a password |
| **Hook** | A special React function that lets components access features like state management and side effects |
| **Hot Reloading** | When the dev server automatically updates your running app as you save code changes |
| **HTML** | HyperText Markup Language — the language that defines the structure of web pages |
| **HTTP** | HyperText Transfer Protocol — the rules for how browsers and servers communicate |
| **HTTP Method** | The type of request: GET (read), POST (create), PATCH (update), DELETE (remove) |
| **Interface** | In TypeScript, a blueprint describing the shape of an object (what fields it has and their types) |
| **JSON** | JavaScript Object Notation — a format for structuring data as key-value pairs: `{ "name": "Farjad", "age": 20 }` |
| **JSX** | JavaScript XML — a syntax that lets you write HTML-like code directly inside JavaScript/TypeScript |
| **Library** | A collection of pre-written code that you can use in your project (like a toolbox) |
| **Middleware** | Code that runs between receiving a request and sending a response (like a security checkpoint) |
| **Migration** | A versioned change to your database structure (adding/removing tables or columns) |
| **Node.js** | A runtime that lets you run JavaScript outside of a browser (on a server) |
| **npm** | Node Package Manager — a tool for downloading and managing JavaScript libraries |
| **ORM** | Object-Relational Mapper — a translator between your code and the database |
| **Polling** | Repeatedly asking the server "is there anything new?" at regular intervals |
| **PostgreSQL** | A powerful, free, open-source relational database system |
| **Prisma** | An ORM that lets you interact with your database using clean TypeScript instead of raw SQL |
| **Pusher** | A third-party service that enables real-time, bidirectional communication between server and browsers |
| **React** | A JavaScript library for building user interfaces using reusable components |
| **Real-time** | Data that updates instantly for all users without refreshing the page |
| **Render** | To display a component on the screen (convert code into visible pixels) |
| **REST** | Representational State Transfer — a standard way of designing API endpoints |
| **Route** | A URL pattern that maps to a specific page or API handler |
| **Schema** | The structure/blueprint of a database — what tables exist and what columns they have |
| **SEO** | Search Engine Optimization — techniques to make your site rank higher on Google |
| **Server** | A computer in the cloud that runs your backend code and serves your website to users |
| **Session Storage** | Browser-side storage that keeps data until the tab is closed |
| **Singleton** | A design pattern ensuring only ONE instance of something exists (like one database connection) |
| **SQL** | Structured Query Language — the language for communicating with relational databases |
| **State** | Data that a component keeps track of and can change over time (like a counter or a list of players) |
| **Subscribe** | To sign up to receive messages from a Pusher channel |
| **Tailwind CSS** | A utility-first CSS framework that uses pre-built class names for styling |
| **TypeScript** | JavaScript with added type safety — catches data type errors before the code runs |
| **Vercel** | A cloud platform for deploying Next.js websites (where your live site is hosted) |
| **Viewport** | The visible area of a web page in the browser window |
| **WebSocket** | A persistent two-way connection between browser and server for instant communication |

---

*This document was generated for the WhoseMLT project — a real-time multiplayer party game built with Next.js, React, TypeScript, Prisma, PostgreSQL, Pusher, and Tailwind CSS.*
