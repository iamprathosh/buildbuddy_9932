import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const InventoryDistributionChart = () => {
  const chartData = [
    { name: 'Concrete & Cement', value: 125000, percentage: 38.5, color: '#D10D38' },
    { name: 'Steel & Rebar', value: 89000, percentage: 27.4, color: '#153275' },
    { name: 'Tools & Equipment', value: 56000, percentage: 17.2, color: '#059669' },
    { name: 'Electrical Supplies', value: 32000, percentage: 9.8, color: '#D97706' },
    { name: 'Plumbing Materials', value: 23000, percentage: 7.1, color: '#DC2626' }
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-popover-foreground mb-2">{data?.name}</p>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="font-medium">Value:</span> ${data?.value?.toLocaleString()}
            </p>
            <p className="text-sm">
              <span className="font-medium">Share:</span> {data?.percentage}%
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload?.map((entry, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry?.color }}
            />
            <span className="text-xs text-muted-foreground">{entry?.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">Inventory Distribution</h3>
        <p className="text-sm text-muted-foreground">Value breakdown by category</p>
      </div>
      <div className="w-full h-80" aria-label="Inventory Distribution Pie Chart">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry?.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-6 pt-6 border-t border-border">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {chartData?.slice(0, 4)?.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: item?.color }}
                />
                <span className="text-sm text-muted-foreground">{item?.name}</span>
              </div>
              <span className="text-sm font-medium text-foreground">
                ${(item?.value / 1000)?.toFixed(0)}K
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InventoryDistributionChart;