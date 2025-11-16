import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const EventRegistrationChart = ({ data }) => {
  const { isDark } = useTheme();
  
  const COLORS = [
    '#0d6efd', '#198754', '#ffc107', '#dc3545', 
    '#6f42c1', '#20c997', '#fd7e14', '#e83e8c'
  ];

  const textColor = isDark ? '#ffffff' : '#212529';

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-2 rounded shadow ${isDark ? 'bg-dark border border-secondary' : 'bg-white border'}`}>
          <p className="mb-1 fw-bold" style={{ color: textColor }}>
            {payload[0].payload.name}
          </p>
          <p className="mb-0" style={{ color: payload[0].color }}>
            Registrations: {payload[0].value}
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
      transition={{ duration: 0.5 }}
    >
      <h5 className="mb-3" style={{ color: textColor }}>
        <i className="fas fa-chart-pie me-2"></i>
        Event Registrations Distribution
      </h5>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="registrations"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ color: textColor }}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default EventRegistrationChart;
