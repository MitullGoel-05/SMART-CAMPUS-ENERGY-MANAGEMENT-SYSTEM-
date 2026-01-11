# Energy Dashboard Demo Guide

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:5173`

## 🎯 Key Features to Explore

### Dashboard Page (`/`)
- **Summary Cards**: Hover over the metric cards to see smooth animations
- **Real-time Chart**: Interactive energy usage graph with hover tooltips
- **Peak Demand Chart**: Compare actual vs predicted energy consumption
- **Quick Stats**: View peak hours, lowest usage, and efficiency metrics

### Reports Page (`/reports`)
- **Filter Panel**: Use date range, department, and system filters
- **Historical Chart**: Interactive time-series visualization
- **Cost Analysis**: Pie chart showing cost breakdown by system
- **Download Report**: Click to download filtered data as JSON

### Alerts & Recommendations
- **Alert Bell**: Click the bell icon in the top navigation
- **Alert Types**: View critical (red), warning (orange), and info (green) alerts
- **AI Recommendations**: Switch to the "AI Tips" tab for optimization suggestions
- **Dismiss Alerts**: Click the X button to dismiss individual alerts

## 🎨 Design Features

### Responsive Design
- **Desktop**: Full-width layout with sidebar filters
- **Tablet**: Optimized grid layouts
- **Mobile**: Full-screen alert panel with backdrop

### Animations & Interactions
- **Hover Effects**: Cards scale and change colors on hover
- **Smooth Transitions**: All state changes have smooth animations
- **Loading States**: Skeleton loaders and spinners
- **Live Indicators**: Pulsing dots show real-time data status

### Color Coding
- **Green**: Positive trends, info alerts, success states
- **Red**: Critical alerts, negative trends, high priority
- **Orange**: Warnings, medium priority, cost savings
- **Blue**: Secondary actions, predictions, system info

## 🔧 Technical Features

### State Management
- **Context API**: Global state for filters, alerts, and UI state
- **Local Storage**: Persistent filter preferences
- **Real-time Updates**: Simulated live data updates

### Chart Interactions
- **Hover Tooltips**: Detailed information on chart hover
- **Responsive Charts**: Automatically resize based on container
- **Smooth Animations**: 2-second chart rendering animations
- **Interactive Legends**: Click to show/hide data series

### Accessibility
- **ARIA Labels**: Screen reader support
- **Keyboard Navigation**: Full keyboard accessibility
- **Focus Management**: Proper focus indicators
- **Color Contrast**: WCAG compliant color combinations

## 📱 Mobile Experience

- **Touch-Friendly**: Large touch targets for mobile devices
- **Swipe Gestures**: Natural mobile interactions
- **Full-Screen Panels**: Alert panel takes full screen on mobile
- **Responsive Typography**: Text scales appropriately

## 🎯 Demo Scenarios

### Scenario 1: Energy Manager Morning Check
1. Open the dashboard
2. Review summary cards for overnight consumption
3. Check the real-time chart for current usage patterns
4. Open alerts panel to see any overnight issues
5. Review AI recommendations for the day

### Scenario 2: Historical Analysis
1. Navigate to Reports page
2. Set date range to last 7 days
3. Filter by specific systems (HVAC, Lighting)
4. Analyze cost breakdown in the pie chart
5. Download the report for further analysis

### Scenario 3: Alert Management
1. Click the alert bell to open the panel
2. Review critical alerts first
3. Dismiss resolved alerts
4. Switch to AI Tips tab
5. Review high-priority recommendations

## 🛠️ Customization

### Adding New Metrics
Edit `src/data/mockData.js` to add new summary metrics:
```javascript
export const summaryMetrics = {
  // Add your custom metrics here
  newMetric: {
    value: 100,
    unit: 'units',
    change: '+5%',
    trend: 'up'
  }
};
```

### Styling Changes
Modify `tailwind.config.js` to update the color palette:
```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom colors
      }
    }
  }
}
```

### Chart Customization
Update chart options in individual chart components:
- `src/components/dashboard/EnergyUsageChart.jsx`
- `src/components/dashboard/PeakDemandChart.jsx`
- `src/components/reports/HistoricalChart.jsx`
- `src/components/reports/CostAnalysisPie.jsx`

## 🚀 Production Deployment

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Preview the build:**
   ```bash
   npm run preview
   ```

3. **Deploy to your hosting platform:**
   - Vercel, Netlify, or any static hosting service
   - Upload the `dist` folder contents

## 📊 Data Integration

The dashboard currently uses mock data. To integrate with real data:

1. Replace mock data in `src/data/mockData.js`
2. Add API calls in components
3. Implement real-time data fetching
4. Add error handling and loading states

## 🎉 Enjoy Exploring!

This dashboard demonstrates modern React development practices with:
- Component-based architecture
- Responsive design principles
- Interactive data visualizations
- Professional UI/UX patterns
- Accessibility best practices





