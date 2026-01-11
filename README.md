# Energy Usage and Optimization System Dashboard

A modern, professional web dashboard for monitoring and optimizing energy consumption across facilities. Built with React, Chart.js, and Tailwind CSS.

## Features

### 🎯 Visualization Dashboard
- Real-time energy usage graphs with smooth animations
- Peak demand prediction charts (actual vs predicted)
- Summary cards showing total energy, carbon footprint, and cost savings
- Interactive hover effects and transitions

### 📊 Historical Reports
- Interactive time-series graphs for past energy usage
- Advanced filtering by date range, department, and system type
- Cost analysis pie charts with detailed breakdowns
- Downloadable reports in JSON format

### 🚨 Alerts and Recommendations
- Collapsible right-side alert panel
- Color-coded notifications (red=critical, orange=warning, green=info)
- AI-based optimization recommendations
- Priority-based organization of suggestions

### 🎨 Design Features
- Eco-friendly color palette (greens, blues, whites)
- Modern minimal style inspired by Grafana and Material Design
- Responsive layout for desktop and tablet screens
- Professional enterprise-grade appearance
- Smooth animations and micro-interactions

## Tech Stack

- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS with custom eco-friendly theme
- **Charts**: Chart.js with react-chartjs-2
- **Icons**: React Icons
- **Routing**: React Router DOM
- **State Management**: React Context API
- **CSV Parsing**: PapaParse

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd energy-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/
│   ├── layout/          # Navigation and layout components
│   ├── dashboard/       # Dashboard-specific components
│   ├── reports/         # Reports page components
│   ├── alerts/          # Alert and recommendation components
│   └── common/          # Common reusable components
├── pages/               # Main page components
├── data/                # Mock data and configurations
├── context/             # React Context for state management
├── services/             # Data services (CSV parsing, etc.)
└── App.jsx              # Main application component
public/
└── data.csv             # Live CSV data file (auto-updated)
```

## Key Components

### Dashboard Components
- `SummaryCard` - Reusable metric cards with trend indicators
- `EnergyUsageChart` - Real-time energy consumption visualization
- `PeakDemandChart` - Actual vs predicted energy usage comparison

### Reports Components
- `FilterPanel` - Advanced filtering sidebar
- `HistoricalChart` - Interactive time-series visualization
- `CostAnalysisPie` - Cost breakdown by system type

### Alert Components
- `AlertPanel` - Collapsible notification panel
- `AlertCard` - Individual alert notifications
- `RecommendationCard` - AI-powered optimization suggestions

## Customization

### Color Theme
The dashboard uses a custom eco-friendly color palette defined in `tailwind.config.js`:
- Primary Green: `#10b981`
- Secondary Blue: `#3b82f6`
- Background: `#f0fdf4`
- Critical Red: `#ef4444`
- Warning Orange: `#f59e0b`
- Info Green: `#22c55e`

### CSV Data Integration
The dashboard automatically reads live data from a CSV file located in the `public` folder:

- **File Location**: `public/data.csv`
- **Required Columns**: `timestamp`, `temperature`, `humidity`, `current`, `predicted_energy`
- **Auto-refresh**: The dashboard polls the CSV file every 5 seconds for live updates
- **Format**: CSV file should have headers in the first row

#### CSV File Format
```csv
timestamp,temperature,humidity,current,predicted_energy
2024-01-15T08:00:00Z,22.5,65.2,15.3,45.8
2024-01-15T08:15:00Z,23.1,64.8,16.1,48.2
...
```

The CSV data is automatically:
- Parsed and validated on load
- Transformed for chart visualization
- Updated in real-time via polling
- Displayed in both Energy Usage and Peak Demand charts

If the CSV file is not available or has errors, the dashboard falls back to mock data.

### Mock Data
Sample data is provided in `src/data/mockData.js` including:
- Real-time energy usage data
- Historical consumption patterns
- Alert notifications
- AI recommendations
- User profile information

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Acknowledgments

- Chart.js for powerful charting capabilities
- Tailwind CSS for utility-first styling
- React Icons for comprehensive icon library
- Material Design for design inspiration







