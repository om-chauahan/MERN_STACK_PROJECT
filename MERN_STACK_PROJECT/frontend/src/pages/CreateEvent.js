import React from 'react';
import { useNavigate } from 'react-router-dom';
import EventForm from '../components/EventForm';

const CreateEvent = () => {
  const navigate = useNavigate();

  const handleEventCreated = () => {
    // Redirect to events page after successful creation
    navigate('/events');
  };

  return (
    <div>
      <EventForm onEventCreated={handleEventCreated} />
    </div>
  );
};

export default CreateEvent;
