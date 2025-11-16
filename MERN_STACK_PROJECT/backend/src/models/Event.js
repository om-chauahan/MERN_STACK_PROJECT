const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Event category is required'],
    enum: ['Conference', 'Workshop', 'Seminar', 'Networking', 'Social', 'Sports', 'Cultural', 'Other']
  },
  dateTime: {
    type: Date,
    required: [true, 'Event date and time is required'],
    validate: {
      validator: function(value) {
        return value > new Date();
      },
      message: 'Event date must be in the future'
    }
  },
  duration: {
    type: Number,
    required: [true, 'Event duration is required'],
    min: [0.5, 'Duration must be at least 30 minutes'],
    max: [24, 'Duration cannot exceed 24 hours']
  },
  location: {
    venue: {
      type: String,
      required: [true, 'Venue is required'],
      trim: true
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    }
  },
  capacity: {
    type: Number,
    required: [true, 'Event capacity is required'],
    min: [1, 'Capacity must be at least 1'],
    max: [10000, 'Capacity cannot exceed 10,000']
  },
  price: {
    type: Number,
    default: 0,
    min: [0, 'Price cannot be negative']
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  attendees: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    registeredAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['registered', 'attended', 'cancelled'],
      default: 'registered'
    }
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'live', 'completed', 'cancelled'],
    default: 'published'
  },
  tags: [{
    type: String,
    trim: true
  }],
  imageUrl: {
    type: String,
    trim: true
  },
  requirements: {
    type: String,
    maxlength: [500, 'Requirements cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

// Virtual for available spots
eventSchema.virtual('availableSpots').get(function() {
  return this.capacity - this.attendees.length;
});

// Virtual for formatted date
eventSchema.virtual('formattedDate').get(function() {
  return this.dateTime.toLocaleDateString();
});

// Virtual for formatted time
eventSchema.virtual('formattedTime').get(function() {
  return this.dateTime.toLocaleTimeString();
});

// Virtual for event status based on current time
eventSchema.virtual('currentStatus').get(function() {
  const now = new Date();
  const eventStart = new Date(this.dateTime);
  const eventEnd = new Date(eventStart.getTime() + (this.duration * 60 * 60 * 1000));
  
  if (this.status === 'cancelled') return 'cancelled';
  if (now < eventStart) return 'upcoming';
  if (now >= eventStart && now <= eventEnd) return 'live';
  if (now > eventEnd) return 'completed';
  return this.status;
});

// Method to get event counts by status for a user
eventSchema.statics.getEventCounts = async function(userId, role) {
  const now = new Date();
  
  let query = {};
  if (role === 'organizer') {
    query.organizer = userId;
  } else {
    query['attendees.user'] = userId;
  }
  
  const events = await this.find(query);
  
  const counts = {
    upcoming: 0,
    live: 0,
    completed: 0,
    total: events.length
  };
  
  events.forEach(event => {
    const eventStart = new Date(event.dateTime);
    const eventEnd = new Date(eventStart.getTime() + (event.duration * 60 * 60 * 1000));
    
    if (event.status === 'cancelled') return;
    if (now < eventStart) counts.upcoming++;
    else if (now >= eventStart && now <= eventEnd) counts.live++;
    else if (now > eventEnd) counts.completed++;
  });
  
  return counts;
};

eventSchema.index({ title: 'text', description: 'text', category: 1, status: 1 });
eventSchema.index({ dateTime: 1, status: 1 });

module.exports = mongoose.model('Event', eventSchema);
