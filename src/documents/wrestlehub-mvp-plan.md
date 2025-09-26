# WrestleHub - Complete Wrestling Database & Admin System

## 🎯 **Refined Concept: WrestleHub v1.0**

A comprehensive wrestling database where fans can explore rosters, titles, championships, feuds, and events across WWE, AEW, and indie promotions. As the admin, you'll have a powerful backend to manage all content (CRUD operations), while fans get a beautiful, searchable interface to explore wrestling history.

**Key Differentiator:** Unlike Wikipedia or other sites, this will have:
- **Structured, relational data** (wrestler → feuds → titles → events)
- **Rich filtering and search** (find all champions from 2020, all feuds involving a wrestler, etc.)
- **Timeline visualizations** for wrestler careers, title reigns, and feuds
- **Clean, modern UI** that wrestling sites desperately need

---

## 📋 **MVP Feature Breakdown**

### **Public Features (Fan-Facing)**
1. **Wrestler Database**
   - Browse all wrestlers with filters (promotion, status, brand, weight class)
   - Individual wrestler profile pages showing:
     - Bio, stats, debut date, finishing moves
     - Championship history timeline
     - Feuds/rivalries
     - Notable matches/events
   - Search functionality (name, nickname, promotion)

2. **Championships/Titles**
   - List all titles by promotion
   - Title history page showing all reigns chronologically
   - Current champions highlighted
   - Longest reigns, most reigns statistics

3. **Events**
   - Upcoming and past events calendar
   - Event detail pages with match cards
   - Filter by promotion, year, event type

4. **Feuds/Storylines**
   - Browse notable feuds/rivalries
   - Feud detail pages showing:
     - Wrestlers involved
     - Timeline/duration
     - Key matches
     - Outcome

5. **Search & Filters**
   - Global search across wrestlers, titles, events
   - Advanced filters (by promotion, year, championship tier)

### **Admin Features (Your CMS)**
1. **Admin Dashboard**
   - Quick stats (total wrestlers, titles, upcoming events)
   - Recent activity feed
   - Quick actions panel

2. **Wrestler Management (CRUD)**
   - Create/Edit/Delete wrestlers
   - Rich form: name, ring name, bio, debut date, status (active/retired), promotion, brand, image upload
   - Assign championships and feuds

3. **Championship Management (CRUD)**
   - Create titles (name, promotion, tier, established date)
   - Manage title reigns (wrestler, start/end date, days held)
   - Mark current champions

4. **Event Management (CRUD)**
   - Create events (name, date, promotion, venue, type)
   - Build match cards (assign wrestlers, stipulations, outcomes)

5. **Feud Management (CRUD)**
   - Create feuds (wrestlers involved, start/end date, description)
   - Link to related matches/events

6. **Media Management**
   - Upload wrestler photos, event posters
   - Manage image library

---

## 🗄️ **Database Schema (Supabase PostgreSQL)**

```sql
-- Core Tables

-- Promotions
CREATE TABLE promotions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  abbreviation text,
  founded_year integer,
  logo_url text,
  created_at timestamp DEFAULT now()
);

-- Wrestlers
CREATE TABLE wrestlers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  ring_name text,
  bio text,
  debut_date date,
  birth_date date,
  birthplace text,
  height text,
  weight text,
  finishing_move text,
  image_url text,
  status text DEFAULT 'active', -- 'active', 'retired', 'released', 'injured'
  promotion_id uuid REFERENCES promotions(id),
  brand text, -- 'Raw', 'SmackDown', 'NXT', etc.
  created_at timestamp DEFAULT now()
);

-- Championships/Titles
CREATE TABLE championships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  promotion_id uuid REFERENCES promotions(id),
  tier text, -- 'world', 'secondary', 'tag', 'women', 'cruiserweight'
  established_date date,
  current_champion_id uuid REFERENCES wrestlers(id),
  image_url text,
  created_at timestamp DEFAULT now()
);

-- Title Reigns
CREATE TABLE title_reigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  championship_id uuid REFERENCES championships(id),
  wrestler_id uuid REFERENCES wrestlers(id),
  reign_number integer,
  won_date date,
  lost_date date,
  days_held integer,
  won_location text,
  notes text,
  created_at timestamp DEFAULT now()
);

-- Events
CREATE TABLE events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  event_date date,
  promotion_id uuid REFERENCES promotions(id),
  venue text,
  city text,
  country text,
  event_type text, -- 'ppv', 'tv', 'house_show'
  poster_url text,
  created_at timestamp DEFAULT now()
);

-- Matches (for event match cards)
CREATE TABLE matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id),
  match_type text, -- 'singles', 'tag', 'triple_threat', etc.
  stipulation text, -- 'cage match', 'ladder match', etc.
  championship_id uuid REFERENCES championships(id), -- nullable
  match_order integer,
  winner_id uuid REFERENCES wrestlers(id),
  notes text,
  created_at timestamp DEFAULT now()
);

-- Match Participants (many-to-many)
CREATE TABLE match_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid REFERENCES matches(id),
  wrestler_id uuid REFERENCES wrestlers(id),
  team text, -- for tag matches
  created_at timestamp DEFAULT now()
);

-- Feuds/Storylines
CREATE TABLE feuds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  start_date date,
  end_date date,
  promotion_id uuid REFERENCES promotions(id),
  created_at timestamp DEFAULT now()
);

-- Feud Participants (many-to-many)
CREATE TABLE feud_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  feud_id uuid REFERENCES feuds(id),
  wrestler_id uuid REFERENCES wrestlers(id),
  role text, -- 'face', 'heel'
  created_at timestamp DEFAULT now()
);

-- Admin Users (for auth)
CREATE TABLE admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text,
  role text DEFAULT 'editor', -- 'super_admin', 'editor'
  created_at timestamp DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE wrestlers ENABLE ROW LEVEL SECURITY;
ALTER TABLE championships ENABLE ROW LEVEL SECURITY;
ALTER TABLE title_reigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE feuds ENABLE ROW LEVEL SECURITY;
ALTER TABLE feud_participants ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Public read, Admin write
CREATE POLICY "Public read access" ON wrestlers FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin full access" ON wrestlers FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
);

-- Repeat similar policies for all tables
```

---

## 🏗️ **MVP Tech Stack**

### **Frontend**
- **Framework:** Next.js 14+ (App Router)
- **UI Library:** shadcn/ui (modern, customizable components built on Radix UI)
- **Styling:** Tailwind CSS
- **Forms:** React Hook Form + Zod for validation
- **State Management:** Zustand (lightweight, perfect for this scale)
- **Data Fetching:** Tanstack Query (React Query)
- **Date Handling:** date-fns
- **Image Upload:** React Dropzone
- **Rich Text Editor:** TipTap (for wrestler bios, feud descriptions)
- **Tables:** TanStack Table (for admin data tables with sorting/filtering)
- **Icons:** Lucide React
- **Animations:** Framer Motion

### **Backend**
- **Database:** Supabase PostgreSQL
- **Auth:** Supabase Auth (for admin login)
- **Storage:** Supabase Storage (for images)
- **Row Level Security (RLS):**
  - Public read access for all wrestling data
  - Admin-only write access

### **Deployment**
- **Frontend:** Vercel
- **Database/Backend:** Supabase (generous free tier)

---

## 🚀 **MVP Build Plan (3-4 Weeks)**

### **Week 1: Foundation & Database**

#### **Days 1-2: Setup & Theme Definition**

**Technical Setup:**
- [ ] Initialize Next.js 14+ project with TypeScript
  ```bash
  npx create-next-app@latest wrestlehub --typescript --tailwind --app
  ```
- [ ] Install core dependencies
  ```bash
  npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
  npm install @tanstack/react-query zustand
  npm install react-hook-form @hookform/resolvers zod
  npm install date-fns lucide-react
  ```
- [ ] Setup shadcn/ui
  ```bash
  npx shadcn-ui@latest init
  ```
- [ ] Create Supabase project and setup environment variables
- [ ] Configure Supabase client in `/lib/supabase`

**Theme & Design System Definition:**

**Color Palette:**
```javascript
// tailwind.config.ts
{
  theme: {
    extend: {
      colors: {
        // Primary (Wrestling Red/Gold energy)
        primary: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444', // Main brand color
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        // Secondary (Championship Gold)
        secondary: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308', // Gold accent
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        },
        // Neutral (Dark theme base)
        dark: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712', // Deep black background
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Bebas Neue', 'Impact', 'sans-serif'], // For headlines
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'display-xl': ['4.5rem', { lineHeight: '1', fontWeight: '700' }],
        'display-lg': ['3.5rem', { lineHeight: '1.1', fontWeight: '700' }],
        'display-md': ['2.5rem', { lineHeight: '1.2', fontWeight: '700' }],
      },
      boxShadow: {
        'glow': '0 0 20px rgba(239, 68, 68, 0.4)',
        'glow-lg': '0 0 40px rgba(239, 68, 68, 0.6)',
      }
    }
  }
}
```

**Design Principles:**
1. **Dark Mode First** - Wrestling content looks better on dark backgrounds
2. **Bold Typography** - Large, impactful headlines for wrestler names and titles
3. **High Contrast** - Red/Gold accents on dark backgrounds for readability
4. **Card-Based Layout** - Modern card design for wrestlers, events, and titles
5. **Motion & Energy** - Subtle animations to convey the dynamic nature of wrestling
6. **Responsive Grid System** - Mobile-first approach with breakpoints at 640px, 768px, 1024px, 1280px

**Key UI Components to Setup:**
- [ ] Wrestling-themed button styles (primary, secondary, ghost variants)
- [ ] Card component with hover effects and glow
- [ ] Badge component for wrestler status, title tiers
- [ ] Navigation bar with logo and dark theme
- [ ] Footer with promotion logos
- [ ] Loading skeletons with pulse animation
- [ ] Toast notifications for admin actions

**Typography Scale:**
- Display (Bebas Neue): Wrestler names, event titles, page headers
- Body (Inter): Descriptions, bios, general content
- Mono (JetBrains Mono): Stats, dates, technical info

**File Structure Setup:**
```
src/
├── app/
│   ├── (public)/          # Public routes
│   │   ├── page.tsx       # Homepage
│   │   ├── wrestlers/
│   │   ├── championships/
│   │   ├── events/
│   │   └── feuds/
│   ├── admin/             # Protected admin routes
│   │   ├── layout.tsx
│   │   ├── dashboard/
│   │   ├── wrestlers/
│   │   ├── championships/
│   │   ├── events/
│   │   └── feuds/
│   └── api/
├── components/
│   ├── ui/                # shadcn components
│   ├── admin/             # Admin-specific components
│   ├── public/            # Public-facing components
│   └── shared/            # Shared components
├── lib/
│   ├── supabase/
│   ├── hooks/
│   ├── utils/
│   └── types/
└── styles/
```

---

#### **Days 3-5: Admin Authentication**
- [ ] Build login/logout system
- [ ] Create protected admin routes with middleware
- [ ] Admin dashboard layout with navigation sidebar
- [ ] Setup authentication context/hooks

**Pages to Create:**
- `/admin/login` - Login form with Supabase Auth
- `/admin/dashboard` - Main dashboard with stats
- Create middleware for route protection

---

#### **Days 6-7: Wrestler CRUD (Admin)**
- [ ] Create wrestler form (add/edit) with React Hook Form
- [ ] Wrestler list table with search/filter (TanStack Table)
- [ ] Delete functionality with confirmation dialog
- [ ] Image upload to Supabase Storage
- [ ] Form validation with Zod schema

**Components:**
- `WrestlerForm.tsx` - Add/Edit form
- `WrestlerTable.tsx` - Data table with actions
- `WrestlerImageUpload.tsx` - Drag & drop image upload

---

### **Week 2: Core Admin Features**

#### **Days 8-9: Championship CRUD**
- [ ] Create championship management pages
- [ ] Title reign management (add reigns to wrestlers)
- [ ] Current champion assignment
- [ ] Championship image upload

**Pages:**
- `/admin/championships` - List view
- `/admin/championships/new` - Create championship
- `/admin/championships/[id]/edit` - Edit championship
- `/admin/championships/[id]/reigns` - Manage title reigns

---

#### **Days 10-11: Event CRUD**
- [ ] Event creation form with date picker
- [ ] Event list with calendar view
- [ ] Basic match card builder
- [ ] Event poster upload

**Components:**
- `EventForm.tsx` - Event creation/editing
- `MatchCardBuilder.tsx` - Add matches to events
- `EventCalendar.tsx` - Calendar view of events

---

#### **Days 12-14: Feud CRUD & Polish**
- [ ] Feud creation and management
- [ ] Link wrestlers to feuds (many-to-many)
- [ ] Admin dashboard stats widget
- [ ] Recent activity feed on dashboard
- [ ] Admin navigation improvements

---

### **Week 3: Public-Facing Pages**

#### **Days 15-16: Wrestler Pages**
- [ ] Wrestler list page with filters/search
- [ ] Individual wrestler profile pages
- [ ] Championship history timeline component
- [ ] Responsive card grid layout

**Pages:**
- `/wrestlers` - Filterable list
- `/wrestlers/[id]` - Profile page with tabs (Bio, Championships, Feuds, Matches)

---

#### **Days 17-18: Championships & Events**
- [ ] Championship list grouped by promotion
- [ ] Title history timeline visualization
- [ ] Event list with filters (past/upcoming)
- [ ] Event detail pages with match cards

**Pages:**
- `/championships` - All titles
- `/championships/[id]` - Title history page
- `/events` - Event list/calendar
- `/events/[id]` - Event detail with match card

---

#### **Days 19-21: Feuds & Search**
- [ ] Feud browsing pages with filters
- [ ] Feud detail pages showing wrestlers and timeline
- [ ] Global search functionality (wrestlers, titles, events)
- [ ] Navigation menu with dropdowns
- [ ] Homepage with featured content

**Pages:**
- `/feuds` - List of feuds
- `/feuds/[id]` - Feud detail
- `/search` - Global search results

---

### **Week 4: Polish & Launch**

#### **Days 22-24: UI/UX Enhancement**
- [ ] Responsive design testing and fixes
- [ ] Loading states and skeletons
- [ ] Error handling and error pages
- [ ] Image optimization with Next.js Image
- [ ] Animations and transitions with Framer Motion
- [ ] Toast notifications for user actions

---

#### **Days 25-26: Data Population**
- [ ] Add initial promotions (WWE, AEW, NJPW, Impact)
- [ ] Add sample wrestlers (10-20 major stars)
- [ ] Create sample championships (5-10 major titles)
- [ ] Add upcoming events
- [ ] Create sample feuds
- [ ] Test all CRUD operations thoroughly

---

#### **Days 27-28: Testing & Deployment**
- [ ] Bug fixing and edge case handling
- [ ] SEO optimization (metadata, Open Graph tags)
- [ ] Generate sitemap
- [ ] Performance optimization (Lighthouse audit)
- [ ] Deploy to Vercel
- [ ] Setup custom domain (optional)
- [ ] Final production testing
- [ ] Create README with screenshots

---

## 🎨 **Key Pages Structure**

### **Public Site Routes**
```
/ (homepage with featured wrestlers, upcoming events)
/wrestlers (list with filters)
/wrestlers/[id] (profile page)
/championships (list by promotion)
/championships/[id] (title history)
/events (calendar view)
/events/[id] (event detail with match card)
/feuds (list of notable feuds)
/feuds/[id] (feud detail)
/search (global search results)
```

### **Admin Routes**
```
/admin/login
/admin/dashboard
/admin/wrestlers (CRUD table)
/admin/wrestlers/new
/admin/wrestlers/[id]/edit
/admin/championships (CRUD table)
/admin/championships/new
/admin/championships/[id]/edit
/admin/events (CRUD table)
/admin/events/new
/admin/events/[id]/edit
/admin/feuds (CRUD table)
/admin/feuds/new
/admin/feuds/[id]/edit
```

---

## 💡 **Recruiter Appeal Highlights**

This MVP showcases:

✅ **Full-Stack Architecture** - Next.js frontend + Supabase backend with complex relational data  
✅ **Admin/CMS Development** - Complete content management system from scratch  
✅ **Complex Data Relationships** - Many-to-many relationships, foreign keys, joins  
✅ **Authentication & Authorization** - Role-based access control (admin vs public)  
✅ **CRUD Mastery** - Create, Read, Update, Delete across multiple entities  
✅ **Advanced Filtering/Search** - Complex queries with PostgreSQL  
✅ **Image Management** - Upload, storage, and optimization  
✅ **Responsive Design** - Mobile-first approach  
✅ **Database Design** - Normalized schema with proper relationships  
✅ **State Management** - Global state, server state, form state  
✅ **TypeScript** - Type-safe development throughout  
✅ **Modern UI/UX** - Contemporary design with animations and interactions  
✅ **Performance Optimization** - Image optimization, lazy loading, caching

---

## 📦 **Quick Start Commands**

```bash
# 1. Create Next.js project
npx create-next-app@latest wrestlehub --typescript --tailwind --app

# 2. Install dependencies
cd wrestlehub
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
npm install @tanstack/react-query @tanstack/react-table zustand
npm install react-hook-form @hookform/resolvers zod
npm install date-fns lucide-react framer-motion
npm install react-dropzone

# 3. Setup shadcn/ui
npx shadcn-ui@latest init

# 4. Install shadcn components (as needed)
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add form
npx shadcn-ui@latest add table
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add toast

# 5. Run development server
npm run dev
```

---

## 🔑 **Environment Variables (.env.local)**

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

---

## 📝 **Next Steps**

1. **Setup Supabase Project:**
   - Create new project at supabase.com
   - Run the database schema SQL
   - Setup Storage bucket for images
   - Configure authentication settings

2. **Initialize Next.js Project:**
   - Follow Quick Start Commands
   - Setup environment variables
   - Configure Supabase client

3. **Start with Theme:**
   - Implement color palette in tailwind.config.ts
   - Create base layout with dark theme
   - Setup global styles

4. **Build Admin First:**
   - Authentication system
   - Protected routes
   - First CRUD entity (Wrestlers)

5. **Then Public Pages:**
   - Homepage
   - Wrestler list/profiles
   - Search functionality

---

## 🎯 **Success Metrics**

By the end of the MVP, you should have:
- ✅ Full admin CMS for managing all wrestling data
- ✅ Beautiful, responsive public website
- ✅ At least 20 wrestlers in the database
- ✅ 5+ championships with title history
- ✅ 3+ upcoming events
- ✅ Working search and filters
- ✅ Deployed to production on Vercel
- ✅ Ready to showcase in portfolio

---

## 🚀 **Future Enhancements (Post-MVP)**

- User accounts for fans to create watchlists
- Fantasy league/prediction game
- Match ratings and reviews
- Social features (comments, discussions)
- Email notifications for events
- Mobile app (React Native)
- API for third-party integrations
- Advanced analytics dashboard
- Multi-language support

---

This project perfectly demonstrates your full-stack capabilities and will absolutely stand out to recruiters. The combination of complex data modeling, admin system, and beautiful public interface shows you can build complete, production-ready applications. 💪🏆