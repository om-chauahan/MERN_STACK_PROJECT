import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const EventsByOrganizerChart = ({ data }) => {
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
          <p className="mb-0" style={{ color: payload[0].color }}>
            Events Created: {payload[0].value}
          </p>
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
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h5 className="mb-3" style={{ color: textColor }}>
        <i className="fas fa-chart-bar me-2"></i>
        Events Created by Organizers
      </h5>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis 
            dataKey="organizer" 
            tick={{ fill: textColor, fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis tick={{ fill: textColor }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ color: textColor }} />
          <Bar 
            dataKey="eventsCount" 
            fill="#0d6efd"
            name="Events Created"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default EventsByOrganizerChart;
