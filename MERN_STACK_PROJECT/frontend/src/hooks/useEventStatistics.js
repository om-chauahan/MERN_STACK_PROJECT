import { useState, useEffect } from 'react';
import axios from 'axios';

export const useEventStatistics = (currentUser) => {
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalRegistrations: 0,
    myEvents: 0,
    myRegistrations: 0,
    upcomingEvents: 0,
    completedEvents: 0
  });
  
  const [chartData, setChartData] = useState({
    registrationDistribution: [],
    eventsByOrganizer: [],
    eventTrends: []
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (currentUser) {
      fetchStatistics();
    }
  }, [currentUser]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch all events for comprehensive statistics
      const eventsResponse = await axios.get('http://localhost:5001/api/events', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (eventsResponse.data.success) {
        const events = eventsResponse.data.data;
        calculateStatistics(events);
        generateChartData(events);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  const calculateStatistics = (events) => {
    const now = new Date();
    
    const totalEvents = events.length;
    const totalRegistrations = events.reduce((sum, event) => sum + event.attendees.length, 0);
    
    const currentUserId = currentUser.id || currentUser._id;
    
    const myEvents = events.filter(event => {
      const eventOrganizerId = event.organizer?._id || event.organizer;
      return eventOrganizerId === currentUserId;
    }).length;
    
    const myRegistrations = events.filter(event => 
      event.attendees.some(attendee => {
        const attendeeUserId = attendee.user?._id || attendee.user;
        return attendeeUserId === currentUserId;
      })
    ).length;
    
    const upcomingEvents = events.filter(event => {
      const eventDate = new Date(event.dateTime);
      return eventDate > now && event.status === 'published';
    }).length;
    
    const completedEvents = events.filter(event => {
      const eventDate = new Date(event.dateTime);
      const eventEnd = new Date(eventDate.getTime() + (event.duration * 60 * 60 * 1000));
      return eventEnd < now;
    }).length;

    setStats({
      totalEvents,
      totalRegistrations,
      myEvents,
      myRegistrations,
      upcomingEvents,
      completedEvents
    });
  };

  const generateChartData = (events) => {
    // Registration Distribution Data
    const registrationData = events
      .filter(event => event.attendees.length > 0)
      .map(event => ({
        name: event.title.length > 15 ? event.title.substring(0, 15) + '...' : event.title,
        registrations: event.attendees.length,
        capacity: event.capacity
      }))
      .sort((a, b) => b.registrations - a.registrations)
      .slice(0, 8); // Top 8 events

    // Events by Organizer Data
    const organizerMap = {};
    events.forEach(event => {
      const organizerName = event.organizer?.name || 'Unknown';
      if (organizerMap[organizerName]) {
        organizerMap[organizerName]++;
      } else {
        organizerMap[organizerName] = 1;
      }
    });

    const organizerData = Object.entries(organizerMap)
      .map(([organizer, eventsCount]) => ({
        organizer: organizer.length > 12 ? organizer.substring(0, 12) + '...' : organizer,
        eventsCount
      }))
      .sort((a, b) => b.eventsCount - a.eventsCount)
      .slice(0, 10); // Top 10 organizers

    // Event Trends Data (last 6 months)
    const trendsData = generateTrendsData(events);

    setChartData({
      registrationDistribution: registrationData,
      eventsByOrganizer: organizerData,
      eventTrends: trendsData
    });
  };

  const generateTrendsData = (events) => {
    const months = [];
    const now = new Date();
    
    // Generate last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      
      const monthEvents = events.filter(event => {
        const eventDate = new Date(event.dateTime);
        return eventDate.getMonth() === date.getMonth() && 
               eventDate.getFullYear() === date.getFullYear();
      });
      
      const monthRegistrations = monthEvents.reduce((sum, event) => sum + event.attendees.length, 0);
      
      months.push({
        month: monthName,
        events: monthEvents.length,
        registrations: monthRegistrations
      });
    }
    
    return months;
  };

  return {
    stats,
    chartData,
    loading,
    error,
    refreshStats: fetchStatistics
  };
};

export default useEventStatistics;
