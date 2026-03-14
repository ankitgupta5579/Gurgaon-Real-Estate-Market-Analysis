import React, { useMemo } from 'react';
import { usePropertyData } from './hooks/usePropertyData';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Home, IndianRupee, MapPin, Building, Trophy, TrendingUp, CheckCircle2, Factory } from 'lucide-react';

function StatCard({ title, value, subtitle, icon: Icon, colorClass }: any) {
  return (
    <div className={`p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col items-start gap-4 transition-transform hover:scale-[1.02] duration-300`}>
      <div className={`p-3 rounded-xl ${colorClass}`}>
        <Icon size={24} className="text-white" />
      </div>
      <div>
        <h3 className="text-white/60 text-sm font-medium mb-1">{title}</h3>
        <p className="text-xl md:text-2xl font-bold text-white mb-1 break-words">{value}</p>
        {subtitle && <p className="text-white/40 text-xs">{subtitle}</p>}
      </div>
    </div>
  );
}

function App() {
  const { 
    loading, 
    costliestFlat, 
    highestAvgPriceLocality, 
    highestRateLocality,
    readyToMoveAvgPrice,
    underConstructionAvgPrice,
    reraApprovedAvgPrice,
    notReraApprovedAvgPrice,
    mostExpensiveBhk,
    costliestPropertyType,
    topBuilders,
    rawData
  } = usePropertyData();

  const scatterData = useMemo(() => {
    // Take a sample to prevent chart lag if too many points
    return rawData.slice(0, 1000).map(d => ({
      x: d.area,
      y: d.price,
      rate: d.rate_per_sqft,
      name: d.property_name || 'Property'
    }));
  }, [rawData]);

  const formatPrice = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} Lac`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#121214]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6366f1]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <header className="flex flex-col gap-2">
          <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 w-fit text-indigo-400 text-sm font-semibold mb-2">
            Market Analysis Update 2026
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-normal bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            Gurgaon Real Estate
          </h1>
          <p className="text-white/50 max-w-2xl text-lg">
            Interactive insights and deep analysis of property prices, builder trends, and locality rates based on the latest dataset.
          </p>
        </header>

        {/* Top Highlight - Q1 */}
        {costliestFlat && (
           <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/10 border border-indigo-500/20 relative overflow-hidden rounded-3xl p-8 md:p-10">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Trophy size={160} />
              </div>
              <div className="relative z-10 max-w-3xl">
                <h2 className="text-indigo-400 font-semibold mb-4 flex items-center gap-2">
                  <Trophy size={20} /> Q1. Costliest Property in the Market
                </h2>
                <h3 className="text-3xl md:text-5xl font-bold mb-4">{formatPrice(costliestFlat.price)}</h3>
                <p className="text-lg md:text-xl text-white/80 leading-relaxed">
                  The costliest flat is located in <span className="text-white font-semibold">{costliestFlat.locality}</span> with an area of <span className="text-white font-semibold">{costliestFlat.area} sqft</span>, 
                  and has a remarkable rate of <span className="text-white font-semibold">₹{costliestFlat.rate_per_sqft.toLocaleString('en-IN')} per sqft</span>.
                  It is currently <span className="text-white font-semibold capitalize">{costliestFlat.status}</span> and RERA approved: <span className="text-white font-semibold">{costliestFlat.rera_approval ? 'Yes' : 'No'}</span>.
                </p>
              </div>
           </div>
        )}

        {/* Q2, Q3, Q7, Q8 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Q2. Highest Avg Price Locality" 
            value={highestAvgPriceLocality} 
            icon={MapPin} 
            colorClass="bg-blue-500/20" 
          />
          <StatCard 
            title="Q3. Highest Rate/Sqft Locality" 
            value={highestRateLocality} 
            icon={TrendingUp} 
            colorClass="bg-red-500/20" 
          />
          <StatCard 
            title="Q7. Most Expensive BHK" 
            value={mostExpensiveBhk.split(' ')[0] + ' BHK'} 
            subtitle={mostExpensiveBhk.split('(')[1].replace(')','')}
            icon={Home} 
            colorClass="bg-emerald-500/20" 
          />
          <StatCard 
            title="Q8. Costliest Property Type" 
            value={costliestPropertyType.split('(')[0].trim().substring(0,60) + (costliestPropertyType.length > 60 ? '...' : '')} 
            subtitle={costliestPropertyType.split('(')[1]?.replace(')','')}
            icon={Building} 
            colorClass="bg-amber-500/20" 
          />
        </div>

        {/* Comparisons Q4 & Q5 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Q4 */}
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col justify-between">
             <div className="mb-6">
                <h2 className="text-white/80 font-semibold mb-2 flex items-center gap-2">
                  <Factory size={20} className="text-purple-400" /> Q4. Ready to Move vs Under Construction
                </h2>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {readyToMoveAvgPrice > underConstructionAvgPrice ? 'Ready-to-move costs more.' : 'Under-construction costs more.'}
                </h3>
             </div>
             <div className="flex gap-4 items-end justify-between">
                <div>
                  <p className="text-white/40 text-sm mb-1">Ready to Move Avg</p>
                  <p className="text-xl font-semibold">{formatPrice(readyToMoveAvgPrice)}</p>
                </div>
                <div className="h-12 w-px bg-white/10"></div>
                <div>
                  <p className="text-white/40 text-sm mb-1">Under Construction Avg</p>
                  <p className="text-xl font-semibold">{formatPrice(underConstructionAvgPrice)}</p>
                </div>
             </div>
          </div>

          {/* Q5 */}
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col justify-between">
             <div className="mb-6">
                <h2 className="text-white/80 font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle2 size={20} className="text-emerald-400" /> Q5. Premium for RERA Approval
                </h2>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  {reraApprovedAvgPrice > notReraApprovedAvgPrice ? 'RERA-approved properties command a premium.' : 'No premium for RERA-approved properties.'}
                </h3>
             </div>
             <div className="flex gap-4 items-end justify-between">
                <div>
                  <p className="text-white/40 text-sm mb-1">RERA Approved Avg</p>
                  <p className="text-xl font-semibold">{formatPrice(reraApprovedAvgPrice)}</p>
                </div>
                <div className="h-12 w-px bg-white/10"></div>
                <div>
                  <p className="text-white/40 text-sm mb-1">Not Approved Avg</p>
                  <p className="text-xl font-semibold">{formatPrice(notReraApprovedAvgPrice)}</p>
                </div>
             </div>
          </div>
        </div>

        {/* Charts Q6, Q9, Q10 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           {/* Q6 */}
           <div className="p-6 md:p-8 rounded-3xl bg-white/5 border border-white/10 flex flex-col">
              <h2 className="text-xl font-semibold mb-6">Q6. Area (sqft) impact on Property Price</h2>
              <div className="h-[300px] w-full mt-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 50 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis type="number" dataKey="x" name="Area" unit=" sqft" stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)'}} />
                    <YAxis type="number" dataKey="y" name="Price" unit="₹" stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)'}} tickFormatter={(v) => `${v/10000000}Cr`} dx={-5} />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={(val: number, name: string) => name === 'Price' ? formatPrice(val) : val} contentStyle={{ backgroundColor: '#1e1e24', border: 'none', borderRadius: '12px', color: '#fff' }} />
                    <Scatter name="Properties" data={scatterData} fill="#6366f1" opacity={0.6} />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
           </div>

           {/* Q10 */}
           <div className="p-6 md:p-8 rounded-3xl bg-white/5 border border-white/10 flex flex-col">
              <h2 className="text-xl font-semibold mb-6">Q10. Area (sqft) vs Rate Per Sqft</h2>
              <p className="text-white/50 text-sm mb-4">Are larger homes always more expensive per square foot?</p>
              <div className="h-[300px] w-full mt-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 50 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis type="number" dataKey="x" name="Area" unit=" sqft" stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)'}} />
                    <YAxis type="number" dataKey="rate" name="Rate" stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)'}} tickFormatter={(v) => `₹${v/1000}k`} dx={-5} />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#1e1e24', border: 'none', borderRadius: '12px', color: '#fff' }} />
                    <Scatter name="Properties" data={scatterData} fill="#ec4899" opacity={0.6} />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
           </div>

           {/* Q9 */}
           <div className="col-span-1 lg:col-span-2 p-6 md:p-8 rounded-3xl bg-white/5 border border-white/10 flex flex-col">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <IndianRupee size={20} className="text-yellow-400" /> Q9. Top 5 Builders Consistently Pricing Higher
              </h2>
              <div className="h-[400px] w-full mt-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topBuilders} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.8)'}} angle={-45} textAnchor="end" height={80} interval={0} />
                    <YAxis stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)'}} tickFormatter={(v) => `₹${v/1000}k`} />
                    <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} formatter={(val: number) => [`₹${Math.round(val).toLocaleString('en-IN')}/sqft`, 'Avg Rate']} contentStyle={{ backgroundColor: '#1e1e24', border: 'none', borderRadius: '12px', color: '#fff' }} />
                    <Bar dataKey="rate" name="Average Rate/Sqft" fill="#facc15" radius={[6,6,0,0]} barSize={50} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

export default App;
