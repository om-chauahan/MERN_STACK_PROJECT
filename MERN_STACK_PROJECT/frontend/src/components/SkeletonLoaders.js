import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useTheme } from '../context/ThemeContext';

// Event Card Skeleton
export const EventCardSkeleton = () => {
  const { theme } = useTheme();
  
  return (
    <SkeletonTheme 
      baseColor={theme === 'dark' ? '#2d2d30' : '#ebebeb'} 
      highlightColor={theme === 'dark' ? '#3d3d42' : '#f5f5f5'}
    >
      <div className="col-md-6 col-lg-4 mb-4">
        <div className="card h-100">
          <Skeleton height={200} />
          <div className="card-body">
            <h5 className="card-title">
              <Skeleton height={24} />
            </h5>
            <p className="card-text">
              <Skeleton count={3} />
            </p>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <Skeleton width={80} height={20} />
              <Skeleton width={100} height={20} />
            </div>
            <Skeleton width={120} height={38} />
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

// Dashboard Stats Skeleton
export const DashboardStatsSkeleton = () => {
  const { theme } = useTheme();
  
  return (
    <SkeletonTheme 
      baseColor={theme === 'dark' ? '#2d2d30' : '#ebebeb'} 
      highlightColor={theme === 'dark' ? '#3d3d42' : '#f5f5f5'}
    >
      <div className="row mb-4">
        {[1, 2, 3, 4].map((index) => (
          <div key={index} className="col-md-3 mb-3">
            <div className="card">
              <div className="card-body text-center">
                <Skeleton circle height={40} width={40} className="mb-2" />
                <h3><Skeleton width={60} /></h3>
                <p className="mb-0"><Skeleton width={100} /></p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SkeletonTheme>
  );
};

// Event List Skeleton
export const EventListSkeleton = ({ count = 6 }) => {
  const { theme } = useTheme();
  
  return (
    <SkeletonTheme 
      baseColor={theme === 'dark' ? '#2d2d30' : '#ebebeb'} 
      highlightColor={theme === 'dark' ? '#3d3d42' : '#f5f5f5'}
    >
      <div className="row">
        {Array(count).fill(0).map((_, index) => (
          <EventCardSkeleton key={index} />
        ))}
      </div>
    </SkeletonTheme>
  );
};

// Table Row Skeleton
export const TableRowSkeleton = ({ columns = 4 }) => {
  const { theme } = useTheme();
  
  return (
    <SkeletonTheme 
      baseColor={theme === 'dark' ? '#2d2d30' : '#ebebeb'} 
      highlightColor={theme === 'dark' ? '#3d3d42' : '#f5f5f5'}
    >
      <tr>
        {Array(columns).fill(0).map((_, index) => (
          <td key={index}>
            <Skeleton height={20} />
          </td>
        ))}
      </tr>
    </SkeletonTheme>
  );
};

// Chart Skeleton
export const ChartSkeleton = ({ height = 300 }) => {
  const { theme } = useTheme();
  
  return (
    <SkeletonTheme 
      baseColor={theme === 'dark' ? '#2d2d30' : '#ebebeb'} 
      highlightColor={theme === 'dark' ? '#3d3d42' : '#f5f5f5'}
    >
      <div className="chart-container">
        <Skeleton height={height} />
      </div>
    </SkeletonTheme>
  );
};
