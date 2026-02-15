import React, { useMemo } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import { useNationalStats } from '../../hooks/useNationalStats';

// India TopoJSON URL (public domain)
const INDIA_TOPO_JSON = "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/india/india-states.json";

const NationalHeatmap: React.FC = () => {
  const { data, loading, error } = useNationalStats();

  const colorScale = scaleLinear<string>()
    .domain([0, 50]) // 0 to 50% breach rate
    .range(["#10b981", "#ef4444"]); // Green to Red

  const statsByState = useMemo(() => {
    if (!data) return {};
    return data.states.reduce((acc, state) => {
      acc[state.state] = state;
      return acc;
    }, {} as Record<string, any>);
  }, [data]);

  if (loading) return <div className="p-8 text-center">Loading National Justice Data...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">National Pendency Heatmap</h2>
          <p className="text-slate-500">Real-time SLA breach monitoring across 36 States/UTs</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-blue-600">{data?.total_cases.toLocaleString()}</div>
          <div className="text-sm text-slate-500">Total Active Cases</div>
        </div>
      </div>

      <div className="flex">
        {/* Map Visualization */}
        <div className="w-2/3 h-[500px] border rounded-lg bg-slate-50 relative overflow-hidden">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              scale: 1000,
              center: [78.9629, 22.5937]
            }}
            className="w-full h-full"
          >
            <ZoomableGroup>
              <Geographies geography={INDIA_TOPO_JSON}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const stateName = geo.properties.NAME_1 || geo.properties.name;
                    const stateData = statsByState[stateName];
                    const breachRate = stateData ? stateData.sla_breach_rate : 0;

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={stateData ? colorScale(breachRate) : "#e5e7eb"}
                        stroke="#ffffff"
                        strokeWidth={0.5}
                        style={{
                          default: { outline: "none" },
                          hover: { fill: "#3b82f6", outline: "none", cursor: "pointer" },
                          pressed: { outline: "none" },
                        }}
                        onMouseEnter={() => {
                          // Tooltip logic could go here
                        }}
                      />
                    );
                  })
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>

          <div className="absolute bottom-4 right-4 bg-white/90 p-2 rounded text-xs shadow">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>&lt; 10% Breach</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>&gt; 50% Breach</span>
            </div>
          </div>
        </div>

        {/* Sidebar Stats */}
        <div className="w-1/3 pl-6 space-y-4 overflow-y-auto h-[500px]">
          <h3 className="font-semibold text-slate-700">Critical States (High Breaches)</h3>
          {data?.states
            .filter(s => s.sla_breach_rate > 10)
            .sort((a, b) => b.sla_breach_rate - a.sla_breach_rate)
            .map((state) => (
              <div key={state.state} className="p-3 bg-red-50 border border-red-100 rounded-lg">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-red-900">{state.state}</span>
                  <span className="text-red-700 font-bold">{state.sla_breach_rate}%</span>
                </div>
                <div className="w-full bg-red-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-red-500 h-full"
                    style={{ width: `${Math.min(state.sla_breach_rate, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-red-600 mt-1">
                  <span>{state.pending_cases.toLocaleString()} Pending</span>
                  <span>{state.sla_breaches.toLocaleString()} Breached</span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default NationalHeatmap;
