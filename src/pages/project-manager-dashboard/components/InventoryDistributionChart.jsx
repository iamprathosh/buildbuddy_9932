import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const InventoryDistributionChart = () => {
  const chartData = [
    { name: 'Concrete & Cement', value: 125000, percentage: 42, color: '#D10D38' },
    { name: 'Steel & Rebar', value: 89000, percentage: 30, color: '#153275' },
    { name: 'Tools & Equipment', value: 47000, percentage: 16, color: '#059669' },
    { name: 'Electrical', value: 23000, percentage: 8, color: '#D97706' },
    { name: 'Other Materials', value: 14000, percentage: 4, color: '#6B7280' }
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-popover-foreground mb-1">{data?.name}</p>
          <p className="text-sm text-primary">
            Value: ${data?.value?.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">
            {data?.percentage}% of total inventory
          </p>
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
            ></div>
            <span className="text-sm text-muted-foreground">{entry?.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Inventory Distribution</h3>
        <p className="text-sm text-muted-foreground">Value distribution by category</p>
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
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {chartData?.slice(0, 4)?.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: item?.color }}
              ></div>
              <span className="text-sm font-medium text-foreground">{item?.name}</span>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-foreground">${(item?.value / 1000)?.toFixed(0)}K</p>
              <p className="text-xs text-muted-foreground">{item?.percentage}%</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventoryDistributionChart;