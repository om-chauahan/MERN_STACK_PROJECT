import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const EventTrendsChart = ({ data }) => {
  const { isDark } = useTheme();
  
  const textColor = isDark ? '#ffffff' : '#212529';
  const gridColor = isDark ? '#3d3d42' : '#e0e0e0';

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-2 rounded shadow ${isDark ? 'bg-dark border border-secondary' : 'bg-white border'}`}>
          <p className="mb-1 fw-bold" style={{ color: textColor }}>
            {label}
          </p>
          {payload.map((entry, index) => (
            <p key={index} className="mb-0" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      className="chart-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <h5 className="mb-3" style={{ color: textColor }}>
        <i className="fas fa-chart-line me-2"></i>
        Event Creation Trends
      </h5>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis 
            dataKey="month" 
            tick={{ fill: textColor }}
          />
          <YAxis tick={{ fill: textColor }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ color: textColor }} />
          <Line 
            type="monotone" 
            dataKey="events" 
            stroke="#198754" 
            strokeWidth={3}
            dot={{ fill: '#198754', strokeWidth: 2, r: 6 }}
            name="Events Created"
          />
          <Line 
            type="monotone" 
            dataKey="registrations" 
            stroke="#ffc107" 
            strokeWidth={3}
            dot={{ fill: '#ffc107', strokeWidth: 2, r: 6 }}
            name="Total Registrations"
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default EventTrendsChart;
