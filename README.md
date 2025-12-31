<div align="center">

<!-- Animated Header -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=300&section=header&text=Roamly&fontSize=90&animation=fadeIn&fontAlignY=38&desc=Your%20Next%20Adventure%20Awaits%20|%20A%20Full-Stack%20MERN%20Application&descAlignY=55&descAlign=50" width="100%"/>

<!-- Typing Animation -->
<a href="https://git.io/typing-svg"><img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=28&duration=3000&pause=1000&color=FF385C&center=true&vCenter=true&multiline=true&repeat=true&width=800&height=100&lines=Welcome+to+Roamly+%F0%9F%8F%A1;Explore+%7C+Book+%7C+Experience+%7C+Review;Built+with+React+%2B+Node.js+%2B+MongoDB+%2B+Socket.IO" alt="Typing SVG" /></a>

<!-- Animated Badges -->
<p align="center">
  <img src="https://img.shields.io/badge/React-18.0-61DAFB?style=for-the-badge&logo=react&logoColor=white&labelColor=20232A" alt="React"/>
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white&labelColor=1a1a1a" alt="Node.js"/>
  <img src="https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white&labelColor=1a1a1a" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/Socket.IO-Realtime-010101?style=for-the-badge&logo=socket.io&logoColor=white&labelColor=1a1a1a" alt="Socket.IO"/>
  <img src="https://img.shields.io/badge/Redux-Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=white&labelColor=1a1a1a" alt="Redux"/>
</p>

<!-- Live Demo -->
<p align="center">
  <a href="https://your-vercel-app.vercel.app"><img src="https://img.shields.io/badge/🌐_Live_Demo-Vercel-000000?style=for-the-badge" alt="Live Demo"/></a>
  <a href="https://your-render-app.onrender.com"><img src="https://img.shields.io/badge/⚙️_API-Render-46E3B7?style=for-the-badge" alt="API"/></a>
</p>

<!-- Animated Divider -->
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

### 🌟 A modern full-stack travel booking platform
*Explore properties • Book stays • Write reviews • Real-time support*

<p align="center">
  <a href="#-key-features">Features</a> •
  <a href="#-live-demo">Demo</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-getting-started">Getting Started</a>
</p>

</div>

---

## ✨ Key Features

<div align="center">

<!-- Feature Cards with SVG Icons -->
<table>
<tr>
<td align="center" width="25%">
<img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Desktop%20Computer.png" width="80" height="80"/>
<h3>🏠 Property Experience</h3>
<p align="left">
• 🏡 Browse stunning properties<br>
• 📍 Global destinations<br>
• 🔍 Detailed property views<br>
• 📅 Easy date booking<br>
• ⭐ Rate & review system<br>
• ❤️ Save to favorites<br>
• 🖼️ HD image galleries
</p>
</td>
<td align="center" width="25%">
<img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Locked%20with%20Key.png" width="80" height="80"/>
<h3>🔐 Secure Authentication</h3>
<p align="left">
• 🎨 Beautiful auth UI<br>
• 📱 Single device login<br>
• 🎫 JWT authentication<br>
• 🔒 Session management<br>
• 🌙 Dark mode support<br>
• 👤 User profiles<br>
• 🛡️ Bcrypt encryption
</p>
</td>
<td align="center" width="25%">
<img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Speaking%20Head.png" width="80" height="80"/>
<h3>💬 Real-Time Chat</h3>
<p align="left">
• 🔴 Live support chat<br>
• ⚡ Socket.IO powered<br>
• 👮 Admin dashboard<br>
• 📝 Message history<br>
• ✅ Read receipts<br>
• 🔔 Instant notifications<br>
• 🎯 Multi-room support
</p>
</td>
<td align="center" width="25%">
<img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Gear.png" width="80" height="80"/>
<h3>⚙️ Admin Panel</h3>
<p align="left">
• 📊 Dashboard stats<br>
• 🏨 Manage properties<br>
• 👥 User management<br>
• 💬 Support tickets<br>
• ➕ Add properties<br>
• ✏️ Edit/Delete CRUD<br>
• 📈 Analytics view
</p>
</td>
</tr>
</table>

</div>

<!-- Animated Divider -->
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

## 🔄 User Authentication Flow

<div align="center">

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'primaryColor':'#FF385C','primaryTextColor':'#fff','primaryBorderColor':'#E31C5F','lineColor':'#FF385C','secondaryColor':'#00A699','tertiaryColor':'#fff'}}}%%
sequenceDiagram
    participant U as 👤 User
    participant C as ⚛️ Client
    participant S as 🖥️ Server
    participant DB as 🗄️ MongoDB

    Note over U,DB: 🔐 Single Device Login Flow
    
    U->>C: Enter credentials
    C->>S: POST /api/user/signin
    S->>DB: Validate user & password
    DB-->>S: User found ✓
    S->>DB: Store activeSessionToken
    S-->>C: JWT Token + User data
    C->>C: Store in localStorage
    C-->>U: Redirect to dashboard

    Note over U,DB: 📱 Login from New Device
    
    U->>C: Login from Device B
    C->>S: POST /api/user/signin
    S->>DB: Update activeSessionToken
    S-->>C: New JWT Token
    
    Note over U,DB: ❌ Old Session Invalidated
    
    C->>S: Request from Device A
    S->>DB: Check activeSessionToken
    DB-->>S: Token mismatch!
    S-->>C: 401 Session Expired
    C->>C: Auto logout + notify
```

</div>

<!-- Animated Divider -->
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

## 📅 Booking & Review System

<div align="center">

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'primaryColor':'#00A699','primaryTextColor':'#fff','primaryBorderColor':'#008489','lineColor':'#00A699','secondaryColor':'#FF385C','tertiaryColor':'#fff'}}}%%
flowchart LR
    subgraph BROWSE["🔍 Browse"]
        A[View Properties] --> B[Property Details]
    end
    
    subgraph BOOK["📅 Book"]
        B --> C{Logged In?}
        C -->|No| D[Sign In Modal]
        D --> C
        C -->|Yes| E[Select Dates]
        E --> F[Confirm Booking]
    end
    
    subgraph MANAGE["📋 Manage"]
        F --> G[My Bookings]
        G --> H[View Details]
        H --> I[Cancel/Modify]
    end
    
    subgraph REVIEW["⭐ Review"]
        G --> J[Write Review]
        J --> K[Rate 1-5 Stars]
        K --> L[Submit Review]
        L --> M[Review Published]
    end
    
    style A fill:#FF385C,color:#fff
    style F fill:#00A699,color:#fff
    style L fill:#FFB400,color:#fff
    style M fill:#484848,color:#fff
```

</div>

<!-- Animated Divider -->
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

## 💬 Real-Time Chat Architecture

<div align="center">

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'primaryColor':'#7C3AED','primaryTextColor':'#fff','primaryBorderColor':'#5B21B6','lineColor':'#7C3AED','secondaryColor':'#EC4899','tertiaryColor':'#fff'}}}%%
flowchart TB
    subgraph CLIENT["⚛️ React Client"]
        U1[👤 User] --> SC1[Socket Connection]
        A1[👮 Admin] --> SC2[Socket Connection]
    end
    
    subgraph SERVER["🖥️ Node.js Server"]
        IO[Socket.IO Server]
        R1[Room: user_123]
        R2[Room: user_456]
    end
    
    subgraph DATABASE["🗄️ MongoDB"]
        CH[(Chat History)]
        MSG[(Messages)]
    end
    
    SC1 <-->|join_room| IO
    SC2 <-->|join_room| IO
    IO --> R1
    IO --> R2
    IO <-->|send_message| MSG
    MSG --> CH
    
    IO -->|new_message| SC1
    IO -->|new_message| SC2
    IO -->|new_support_request| A1
    
    style U1 fill:#FF385C,color:#fff
    style A1 fill:#00A699,color:#fff
    style IO fill:#7C3AED,color:#fff
    style CH fill:#47A248,color:#fff
```

</div>

<!-- Animated Divider -->
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

## 🏗️ System Architecture

<div align="center">

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'primaryColor':'#667eea','primaryTextColor':'#fff','primaryBorderColor':'#764ba2','lineColor':'#f093fb','secondaryColor':'#764ba2','tertiaryColor':'#fff'}}}%%
graph TB
    subgraph FRONTEND["🎨 Frontend - Vercel"]
        R[⚛️ React App]
        RD[🗃️ Redux Store]
        AX[📡 Axios Client]
        SK[🔌 Socket.IO Client]
    end
    
    subgraph BACKEND["⚙️ Backend - Render"]
        EX[🚀 Express Server]
        MW[🛡️ Middleware]
        CT[🎮 Controllers]
        IO[📡 Socket.IO Server]
    end
    
    subgraph DATABASE["🗄️ MongoDB Atlas"]
        US[(👤 Users)]
        PR[(🏠 Properties)]
        BK[(📅 Bookings)]
        RV[(⭐ Reviews)]
        CH[(💬 Chats)]
    end
    
    R <--> RD
    R <--> AX
    R <--> SK
    
    AX <-->|HTTPS| EX
    SK <-->|WebSocket| IO
    
    EX --> MW
    MW --> CT
    
    CT <--> US
    CT <--> PR
    CT <--> BK
    CT <--> RV
    IO <--> CH
    
    style R fill:#61DAFB,color:#000
    style EX fill:#339933,color:#fff
    style US fill:#47A248,color:#fff
```

</div>

<!-- Animated Divider -->
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

## 🧰 Tech Stack

<div align="center">

### 💻 Frontend Technologies

<p>
  <img src="https://skillicons.dev/icons?i=react,redux,materialui,styledcomponents,vite" alt="Frontend Stack" />
</p>

| Technology | Purpose | Version |
|------------|---------|---------|
| <img src="https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB"/> | UI Library | 18.x |
| <img src="https://img.shields.io/badge/Redux_Toolkit-593D88?style=flat&logo=redux&logoColor=white"/> | State Management | Latest |
| <img src="https://img.shields.io/badge/Material--UI-0081CB?style=flat&logo=mui&logoColor=white"/> | Component Library | v5 |
| <img src="https://img.shields.io/badge/styled--components-DB7093?style=flat&logo=styled-components&logoColor=white"/> | CSS-in-JS | Latest |
| <img src="https://img.shields.io/badge/Socket.IO_Client-010101?style=flat&logo=socket.io&logoColor=white"/> | Real-time Chat | v4 |
| <img src="https://img.shields.io/badge/React_Router-CA4245?style=flat&logo=react-router&logoColor=white"/> | Routing | v6 |

### ⚙️ Backend Technologies

<p>
  <img src="https://skillicons.dev/icons?i=nodejs,express,mongodb" alt="Backend Stack" />
</p>

| Technology | Purpose | Version |
|------------|---------|---------|
| <img src="https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white"/> | Runtime | Latest |
| <img src="https://img.shields.io/badge/Express.js-404D59?style=flat&logo=express"/> | Framework | Latest |
| <img src="https://img.shields.io/badge/Socket.IO-010101?style=flat&logo=socket.io&logoColor=white"/> | Real-time | v4 |
| <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white"/> | Database | Atlas |
| <img src="https://img.shields.io/badge/JWT-black?style=flat&logo=JSON%20web%20tokens"/> | Authentication | Latest |
| <img src="https://img.shields.io/badge/bcrypt-003A70?style=flat&logo=letsencrypt&logoColor=white"/> | Password Hash | Latest |

</div>

<!-- Animated Divider -->
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

## 📱 Pages & Routes

<div align="center">

| 🎯 Page | 🛤️ Route | 📝 Description |
|---------|---------|----------------|
| <img src="https://img.shields.io/badge/Home-FF385C?style=for-the-badge"/> | `/` | Landing page with hero, search & featured properties |
| <img src="https://img.shields.io/badge/Properties-00A699?style=for-the-badge"/> | `/properties` | Browse all available properties with filters |
| <img src="https://img.shields.io/badge/Details-484848?style=for-the-badge"/> | `/properties/:id` | Full-screen hero image, booking & reviews |
| <img src="https://img.shields.io/badge/Bookings-7C3AED?style=for-the-badge"/> | `/bookings` | User's booking history & management |
| <img src="https://img.shields.io/badge/Favorites-EC4899?style=for-the-badge"/> | `/favourite` | Saved properties collection |
| <img src="https://img.shields.io/badge/Live_Chat-10B981?style=for-the-badge"/> | `/concierge` | Real-time support chat |
| <img src="https://img.shields.io/badge/Admin-F59E0B?style=for-the-badge"/> | `/admin` | Admin dashboard & management |
| <img src="https://img.shields.io/badge/Blogs-3B82F6?style=for-the-badge"/> | `/blogs` | Travel tips & articles |
| <img src="https://img.shields.io/badge/Contact-8B5CF6?style=for-the-badge"/> | `/contact` | Contact form |

</div>

<!-- Animated Divider -->
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

## 🚀 Getting Started

<div align="center">

<table>
<tr>
<td width="50%">

### 1️⃣ Clone & Install

```bash
# Clone the repository
git clone https://github.com/krishbhuva03/airbnb.git
cd airbnb

# Install client dependencies
cd client && npm install

# Install server dependencies
cd ../server && npm install
```

</td>
<td width="50%">

### 2️⃣ Configure Environment

**Server `.env`:**
```env
MONGODB_URL=your_mongodb_atlas_url
JWT=your_jwt_secret_key
PORT=8080
CORS_ORIGINS=http://localhost:3000
```

**Client `.env`:**
```env
REACT_APP_BASE_URL=http://localhost:8080/api/
```

</td>
</tr>
</table>

</div>

### 🎯 Run Development Servers

<div align="center">

| Server | Command | Port |
|--------|---------|------|
| 🎨 **Frontend** | `cd client && npm start` | [localhost:3000](http://localhost:3000) |
| ⚙️ **Backend** | `cd server && npm start` | [localhost:8080](http://localhost:8080) |

</div>

<!-- Animated Divider -->
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

## 🌐 Deployment

<div align="center">

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'primaryColor':'#000','primaryTextColor':'#fff','lineColor':'#46E3B7'}}}%%
flowchart LR
    subgraph LOCAL["💻 Local Development"]
        GH[📂 GitHub Repo]
    end
    
    subgraph VERCEL["▲ Vercel"]
        FE[⚛️ React Frontend]
    end
    
    subgraph RENDER["🔄 Render"]
        BE[🖥️ Node.js Backend]
    end
    
    subgraph ATLAS["☁️ MongoDB Atlas"]
        DB[(🗄️ Database)]
    end
    
    GH -->|Auto Deploy| FE
    GH -->|Auto Deploy| BE
    FE <-->|API Calls| BE
    BE <-->|Data| DB
    
    style FE fill:#000,color:#fff
    style BE fill:#46E3B7,color:#000
    style DB fill:#47A248,color:#fff
```

### Environment Variables for Production

| Platform | Variable | Value |
|----------|----------|-------|
| **Render** | `CORS_ORIGINS` | `https://your-app.vercel.app` |
| **Render** | `MONGODB_URL` | Your MongoDB Atlas connection string |
| **Render** | `JWT` | Your secret key |
| **Vercel** | `REACT_APP_BASE_URL` | `https://your-api.onrender.com/api/` |

</div>

<!-- Animated Divider -->
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

## 🛡️ Security Features

<div align="center">

<table>
<tr>
<td align="center" width="33%">
<img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Shield.png" width="100"/>
<h3>🔒 Authentication</h3>
<p align="left">
✅ JWT token authentication<br>
✅ Single device login<br>
✅ Bcrypt password hashing<br>
✅ Session invalidation<br>
✅ Protected routes<br>
✅ Auto logout on expiry
</p>
</td>
<td align="center" width="33%">
<img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Gear.png" width="100"/>
<h3>⚡ API Security</h3>
<p align="left">
✅ CORS protection<br>
✅ Rate limiting ready<br>
✅ Input validation<br>
✅ Error handling<br>
✅ Environment variables<br>
✅ Middleware guards
</p>
</td>
<td align="center" width="33%">
<img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Symbols/Check%20Box%20with%20Check.png" width="100"/>
<h3>✨ Data Integrity</h3>
<p align="left">
✅ MongoDB ObjectId validation<br>
✅ Duplicate review prevention<br>
✅ User-specific data access<br>
✅ Admin role verification<br>
✅ Booking date validation<br>
✅ Mongoose schema validation
</p>
</td>
</tr>
</table>

</div>

<!-- Animated Divider -->
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

## 🤝 Contributing

<div align="center">

<img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Hand%20gestures/Handshake.png" width="150"/>

### We Love Contributions! 💖

```bash
# Fork the repo and clone
git clone https://github.com/yourusername/airbnb.git

# Create a new branch
git checkout -b feature/amazing-feature

# Make your changes and commit
git commit -m "✨ Add amazing feature"

# Push to your fork
git push origin feature/amazing-feature

# Open a Pull Request 🎉
```

<p>
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge" alt="PRs Welcome"/>
  <img src="https://img.shields.io/badge/Made%20with-❤️-red.svg?style=for-the-badge" alt="Made with Love"/>
  <img src="https://img.shields.io/badge/License-ISC-blue.svg?style=for-the-badge" alt="License"/>
</p>

</div>

<!-- Animated Divider -->
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif">

## 👨‍💻 Author

<div align="center">

<a href="https://github.com/krishbhuva03">
  <img src="https://img.shields.io/badge/GitHub-krishbhuva03-181717?style=for-the-badge&logo=github" alt="GitHub"/>
</a>

</div>

<!-- Animated Footer -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=150&section=footer&text=Made%20with%20%E2%9D%A4%EF%B8%8F%20by%20Krish%20Bhuva&fontSize=30&fontAlignY=70&animation=twinkling" width="100%"/>

</div>