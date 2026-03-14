import { useState, useEffect } from 'react';
import Papa from 'papaparse';

export interface PropertyData {
  property_name: string;
  property_type: string;
  society: string;
  price: number;
  area: number;
  locality: string;
  rate_per_sqft: number;
  status: string;
  rera_approval: boolean;
  bhk_count: number;
  builder_name: string;
}

export interface DashboardMetrics {
  costliestFlat: PropertyData | null;
  highestAvgPriceLocality: string;
  highestRateLocality: string;
  readyToMoveAvgPrice: number;
  underConstructionAvgPrice: number;
  reraApprovedAvgPrice: number;
  notReraApprovedAvgPrice: number;
  mostExpensiveBhk: string;
  costliestPropertyType: string;
  topBuilders: { name: string; rate: number }[];
  rawData: PropertyData[];
  loading: boolean;
}

export function usePropertyData() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    costliestFlat: null,
    highestAvgPriceLocality: '',
    highestRateLocality: '',
    readyToMoveAvgPrice: 0,
    underConstructionAvgPrice: 0,
    reraApprovedAvgPrice: 0,
    notReraApprovedAvgPrice: 0,
    mostExpensiveBhk: '',
    costliestPropertyType: '',
    topBuilders: [],
    rawData: [],
    loading: true,
  });

  useEffect(() => {
    Papa.parse('/data.csv', {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        let rawData: any[] = results.data;
        
        // Data cleaning mirroring main.py
        let cleaned: PropertyData[] = rawData.map(row => {
          // normalize columns spaces and lowercasing mapping assumption
          const props: any = {};
          Object.keys(row).forEach(k => {
            const cleanKey = k.trim().toLowerCase().replace(/ /g, '_');
            props[cleanKey] = row[k];
          });
          return props;
        }).map(row => {
          return {
            ...row,
            price: parseFloat((row.price || '0').replace(/,/g, '')),
            area: parseInt((row.area || '0').replace(/,/g, ''), 10),
            rate_per_sqft: parseInt((row.rate_per_sqft || '0').replace(/,/g, ''), 10),
            status: (row.status || '').trim().toLowerCase(),
            rera_approval: (row.rera_approval || '').trim().toLowerCase() === 'approved by rera',
            bhk_count: parseInt(row.bhk_count || '0', 10),
          };
        }).filter(row => row.bhk_count <= 10 && !isNaN(row.price));

        // Question 1: Costliest flat
        const costliestFlat = cleaned.reduce((max, obj) => obj.price > max.price ? obj : max, cleaned[0]);

        // Helper for averages
        const getAverageByGroup = (data: PropertyData[], groupKey: keyof PropertyData, avgKey: keyof PropertyData) => {
          const map = new Map<string, { sum: number; count: number }>();
          data.forEach(item => {
            const val = String(item[groupKey]);
            if (!val || val === 'undefined') return;
            const current = map.get(val) || { sum: 0, count: 0 };
            current.sum += Number(item[avgKey]);
            current.count += 1;
            map.set(val, current);
          });
          const avgMap = new Map<string, number>();
          map.forEach((val, key) => avgMap.set(key, val.sum / val.count));
          return avgMap;
        };

        // Question 2 & 3: Highest locality average price & rate
        const localityPriceAvg = getAverageByGroup(cleaned, 'locality', 'price');
        const localityRateAvg = getAverageByGroup(cleaned, 'locality', 'rate_per_sqft');
        
        const highestAvgPriceLocality = [...localityPriceAvg.entries()].reduce((a, b) => b[1] > a[1] ? b : a)[0];
        const highestRateLocality = [...localityRateAvg.entries()].reduce((a, b) => b[1] > a[1] ? b : a)[0];

        // Question 4: Status price differences
        const readyToMove = cleaned.filter(r => r.status === 'ready to move');
        const underConstruction = cleaned.filter(r => r.status === 'under construction');
        const rtmAvg = readyToMove.reduce((sum, item) => sum + item.price, 0) / (readyToMove.length || 1);
        const ucAvg = underConstruction.reduce((sum, item) => sum + item.price, 0) / (underConstruction.length || 1);

        // Question 5: RERA approx 
        const reraApproved = cleaned.filter(r => r.rera_approval === true);
        const reraNotApproved = cleaned.filter(r => r.rera_approval === false);
        const reraAvg = reraApproved.reduce((sum, item) => sum + item.price, 0) / (reraApproved.length || 1);
        const noReraAvg = reraNotApproved.reduce((sum, item) => sum + item.price, 0) / (reraNotApproved.length || 1);

        // Question 7: Most exp bhk
        const bhkAvgRates = getAverageByGroup(cleaned, 'bhk_count', 'rate_per_sqft');
        const mostExpBhkEntry = [...bhkAvgRates.entries()].reduce((a, b) => b[1] > a[1] ? b : a);

        // Question 8: Costliest property type
        const propertyTypeAvg = getAverageByGroup(cleaned, 'property_type', 'price');
        const costliestPropEntry = [...propertyTypeAvg.entries()].reduce((a, b) => b[1] > a[1] ? b : a);

        // Question 9: Builder averages
        const builderAvgRate = getAverageByGroup(cleaned, 'builder_name', 'rate_per_sqft');
        const topBuilders = [...builderAvgRate.entries()]
          .map(([name, rate]) => ({ name, rate }))
          .sort((a, b) => b.rate - a.rate)
          .slice(0, 5)
          .filter(b => b.name && b.name.toLowerCase() !== 'nan');

        setMetrics({
          costliestFlat,
          highestAvgPriceLocality,
          highestRateLocality,
          readyToMoveAvgPrice: rtmAvg,
          underConstructionAvgPrice: ucAvg,
          reraApprovedAvgPrice: reraAvg,
          notReraApprovedAvgPrice: noReraAvg,
          mostExpensiveBhk: `${mostExpBhkEntry[0]} BHK (₹${mostExpBhkEntry[1].toFixed(2)}/sqft)`,
          costliestPropertyType: `${costliestPropEntry[0]} (₹${costliestPropEntry[1].toFixed(2)})`,
          topBuilders,
          rawData: cleaned,
          loading: false,
        });
      }
    });
  }, []);

  return metrics;
}
