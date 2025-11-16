import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const EmptyState = ({ 
  icon, 
  title, 
  message, 
  actionText, 
  actionLink, 
  onAction 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center py-5"
    >
      <div className="mb-4">
        <i className={`${icon} fs-1 text-muted`}></i>
      </div>
      <h4 className="mb-3">{title}</h4>
      <p className="text-muted mb-4">{message}</p>
      {(actionText && (actionLink || onAction)) && (
        <div>
          {actionLink ? (
            <Link to={actionLink} className="btn btn-primary">
              {actionText}
            </Link>
          ) : (
            <button onClick={onAction} className="btn btn-primary">
              {actionText}
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
};

// Specific Empty State Components
export const NoEventsCreated = () => (
  <EmptyState
    icon="bi bi-calendar-plus"
    title="No Events Created Yet"
    message="You haven't created any events yet. Click 'Create Event' to get started and share your amazing events with the world!"
    actionText="Create Event"
    actionLink="/create-event"
  />
);

export const NoRegistrations = () => (
  <EmptyState
    icon="bi bi-bookmark-x"
    title="No Event Registrations"
    message="You haven't registered for any events yet. Browse our exciting events and register now to secure your spot!"
    actionText="Browse Events"
    actionLink="/events"
  />
);

export const NoEventsAvailable = () => (
  <EmptyState
    icon="bi bi-calendar-x"
    title="No Events Available"
    message="No events are currently available. Encourage organizers to create exciting events for the community!"
    actionText="Refresh Page"
    onAction={() => window.location.reload()}
  />
);

export const NoAdminEvents = () => (
  <EmptyState
    icon="bi bi-gear"
    title="No Events to Manage"
    message="No events available for management. Encourage organizers to create events that will engage the community."
  />
);

export const NoSearchResults = ({ searchTerm }) => (
  <EmptyState
    icon="bi bi-search"
    title="No Results Found"
    message={`No events found matching "${searchTerm}". Try adjusting your search criteria or browse all events.`}
    actionText="View All Events"
    actionLink="/events"
  />
);

export const LoadingError = ({ onRetry }) => (
  <EmptyState
    icon="bi bi-exclamation-triangle"
    title="Something Went Wrong"
    message="We're having trouble loading the content. Please try again or contact support if the problem persists."
    actionText="Try Again"
    onAction={onRetry}
  />
);

export default EmptyState;
