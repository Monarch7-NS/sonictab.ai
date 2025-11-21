# LISTIC Data Visualizer

**LISTIC** is a high-performance, interactive data visualization dashboard built with React, TypeScript, and Tailwind CSS. It features advanced graphing capabilities including 3D scatter plots, force-directed network graphs, and multi-dimensional radar charts, all wrapped in a polished, responsive UI with a robust Dark/Light mode system.

## 🚀 Features

### 📊 Advanced Visualizations
*   **Network Topology Map**: An interactive D3.js force-directed graph.
    *   *Interactions*: Zoom, Pan, Drag nodes, Click links to reveal specific latency/protocol labels.
    *   *Controls*: Includes a "Reset View" button to restore layout.
*   **3D Spatial Lab**: A custom HTML5 Canvas implementation of a 3D Scatter Plot.
    *   *Interactions*: Click and drag to rotate the dataset in 3D space.
*   **Analytical Charts**:
    *   **Volume Chart**: Real-time traffic area chart with gradient fills.
    *   **Distribution (Camembert)**: Interactive Pie chart with "exploded" view on selection.
    *   **Multi-Metric Radar**: Hexagonal radar chart for system performance metrics.

### 🎨 UI/UX
*   **Immersive Landing Page**: Animated entry screen with usage statistics and "glassmorphism" effects.
*   **Theme Engine**: Complete Light and Dark mode support that dynamically updates all charts, backgrounds, and typography.
*   **Responsive Design**: Collapsible sidebar for desktop and a mobile-optimized header.
*   **Dashboard Context**: Clicking graph elements updates the global context state (e.g., "User selected Cluster B").

## 🛠️ Tech Stack

*   **Framework**: React 19
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS
*   **Visualization Libraries**:
    *   `d3` (Data-Driven Documents) for Network graphs.
    *   `recharts` for statistical charts.
    *   Native `<canvas>` for high-performance 3D rendering.
*   **Icons**: Lucide React

## 📂 Project Structure

```
/
├── components/
│   ├── charts/
│   │   ├── DistributionChart.tsx   # Interactive Pie Chart
│   │   ├── NetworkVisualizer.tsx   # D3 Force Directed Graph
│   │   ├── RadarMetricChart.tsx    # System Metrics Radar
│   │   ├── Scatter3D.tsx           # Canvas-based 3D Plot
│   │   └── VolumeChart.tsx         # Area Chart
│   ├── DashboardCard.tsx           # Reusable UI container
│   └── LandingPage.tsx             # Entry screen
├── services/
│   └── geminiService.ts            # (Optional) AI Integration service
├── App.tsx                         # Main Application Logic & Layout
├── index.tsx                       # Entry Point
├── types.ts                        # TypeScript Interfaces
└── index.html                      # HTML Template & Tailwind Config
```

## 📦 Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/listic.git
    cd listic
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Run the Development Server**
    ```bash
    npm start
    # or
    npm run dev
    ```

4.  **Build for Production**
    ```bash
    npm run build
    ```

## 🎮 Usage Guide

1.  **Navigation**:
    *   Start at the **Landing Page**. Click "Access Dashboard" to enter.
    *   Use the **Sidebar** (Desktop) or **Menu** (Mobile) to switch between Overview, Network, Analytics, and 3D Lab tabs.
    *   Click the **LISTIC Logo** in the sidebar/header to return to the Landing Page.

2.  **Interacting with Graphs**:
    *   **Network Map**: Scroll to zoom. Drag background to pan. Drag nodes to rearrange. Click a line to see the protocol label (e.g., "TCP 45ms"). Click the "Refresh/Reset" icon in the top right of the card to reset.
    *   **3D Scatter**: Click and drag inside the box to rotate the view.
    *   **Theme**: Toggle the Sun/Moon icon in the top right header to switch themes.

## 📝 License

MIT License - Free for personal and commercial use.
