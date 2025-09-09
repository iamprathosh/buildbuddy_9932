import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const InventoryTrendsChart = () => {
  const chartData = [
    { month: 'Apr 2024', value: 245000, items: 1250 },
    { month: 'May 2024', value: 268000, items: 1340 },
    { month: 'Jun 2024', value: 289000, items: 1445 },
    { month: 'Jul 2024', value: 312000, items: 1560 },
    { month: 'Aug 2024', value: 298000, items: 1490 },
    { month: 'Sep 2024', value: 325000, items: 1625 }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-popover-foreground mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm text-primary">
              <span className="font-medium">Value:</span> ${payload?.[0]?.value?.toLocaleString()}
            </p>
            <p className="text-sm text-secondary">
              <span className="font-medium">Items:</span> {payload?.[0]?.payload?.items?.toLocaleString()}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">Inventory Trends</h3>
        <p className="text-sm text-muted-foreground">6-month inventory value progression</p>
      </div>
      <div className="w-full h-80" aria-label="Inventory Trends Line Chart">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="month" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${(value / 1000)?.toFixed(0)}K`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="var(--color-primary)" 
              strokeWidth={3}
              dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: 'var(--color-primary)', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default InventoryTrendsChart;