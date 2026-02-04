# Milan Telecom Operations Dashboard - Frontend

A modern Next.js dashboard for monitoring and analyzing telecom network operations in Milan, featuring real-time data visualization, anomaly detection, and comprehensive network analytics.

## Architecture

### Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Query (@tanstack/react-query)
- **Authentication**: Keycloak
- **Visualization**: Recharts, OpenLayers
- **Theme**: next-themes (Dark mode)

### Project Structure

```
├── app/
│   ├── layout.tsx              # Root layout (theme + providers)
│   ├── page.tsx                # Landing / login page
│   ├── dashboard/
│   │   ├── layout.tsx          # Dashboard sidebar + header
│   │   ├── page.tsx            # Network overview
│   │   ├── heatmap/
│   │   │   └── page.tsx        # Spatial heatmap view
│   │   ├── alerts/
│   │   │   └── page.tsx        # Network alerts
│   │   ├── cells/
│   │   │   └── page.tsx        # Cell analytics
│   │   ├── mobility/
│   │   │   └── page.tsx        # Mobility patterns
│   │   └── cell/
│   │       └── [id]/page.tsx   # Cell detail view
├── lib/
│   ├── api.ts                  # API client (React Query)
│   ├── keycloak.ts             # Authentication provider
│   └── types.ts                # TypeScript DTOs
├── components/
│   ├── ui/                     # Reusable UI components
│   │   └── KpiCard.tsx
│   ├── dashboard/              # Dashboard-specific components
│   │   ├── KpiGrid.tsx
│   │   ├── HeatmapPreview.tsx
│   │   ├── RecentAlerts.tsx
│   │   └── CellTimeseries.tsx
│   └── layout/                 # Layout components
│       ├── Header.tsx
│       └── Sidebar.tsx
└── styles/
    └── globals.css             # Tailwind + dark theme
```

## Dashboard Methodology (Tamara Munzner)

Following the **Four-Level Nested Model** for visualization design:

1. **Task** → Monitor, predict, alert
2. **Data** → Milan grid CDR (spatial + temporal)
3. **View** → 
   - Spatial: Heatmap (OpenLayers)
   - Temporal: Line charts (Recharts)
   - KPIs: Cards
4. **Encode** → Color saturation = traffic, size = anomaly score

##  Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running (default: http://localhost:8080)
- Keycloak instance (default: http://localhost:8081)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd telecom-operations-dashboard-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your configuration:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8080/api
   NEXT_PUBLIC_KEYCLOAK_URL=http://localhost:8081
   NEXT_PUBLIC_KEYCLOAK_REALM=telecom
   NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=dashboard-client
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

##  Key Dependencies

Install the required packages:

```bash
npm install @tanstack/react-query next-themes keycloak-js recharts ol
```


##  Pages Overview

### Dashboard Home (`/dashboard`)
- Network overview with KPI cards
- Heatmap preview
- Recent alerts
- Cell activity timeline

### Heatmap (`/dashboard/heatmap`)
- Full spatial visualization of network activity
- Interactive map with cell details
- Time-based filtering

### Alerts (`/dashboard/alerts`)
- Active and resolved alerts
- Severity-based filtering
- Alert resolution workflow

### Cell Analytics (`/dashboard/cells`)
- Table view of all cells
- Performance metrics
- Quick access to cell details

### Mobility (`/dashboard/mobility`)
- User movement patterns
- Flow visualization
- Top mobility routes

### Cell Details (`/dashboard/cell/[id]`)
- Detailed metrics for specific cell
- Historical activity timeline
- Associated alerts

##  Development

### Building for Production

```bash
npm run build
npm run start
```

### Linting

```bash
npm run lint
```

### Type Checking

```bash
npx tsc --noEmit
```

##  API Integration

The frontend connects to a backend API with the following endpoints:

- `GET /api/heatmap?timestamp={iso8601}` - Heatmap data
- `GET /api/cells/top?timestamp={iso8601}&limit={n}` - Top cells
- `GET /api/cells/{id}` - Cell details
- `GET /api/cells/{id}/timeseries` - Time series data
- `GET /api/alerts?resolved={boolean}` - Alerts
- `POST /api/alerts/{id}/resolve` - Resolve alert
- `GET /api/mobility?timestamp={iso8601}` - Mobility flows
- `GET /api/stats?timestamp={iso8601}` - Network statistics

##  Design System

### Colors
- **Background**: `slate-900` to `slate-800` gradient
- **Cards**: `slate-800/50` with backdrop blur
- **Borders**: `slate-700`
- **Accents**: `blue-400` to `purple-500` gradient
- **Status**: Red, Orange, Yellow, Blue, Green

### Typography
- **Headings**: Bold, gradient text
- **Body**: `slate-200` to `slate-400`
- **Labels**: `slate-400` uppercase


