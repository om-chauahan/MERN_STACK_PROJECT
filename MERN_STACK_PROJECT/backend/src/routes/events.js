const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Event = require('../models/Event');
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route   GET /api/events
// @desc    Get all published events (public)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, city, search, page = 1, limit = 10 } = req.query;
    
    // Build query
    let query = { status: 'published' };
    
    if (category) {
      query.category = category;
    }
    
    if (city) {
      query['location.city'] = new RegExp(city, 'i');
    }
    
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }

    // Execute query with pagination
    const events = await Event.find(query)
      .populate('organizer', 'name email')
      .sort({ dateTime: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Event.countDocuments(query);

    res.json({
      success: true,
      data: events,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/events/:id
// @desc    Get single event by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name email')
      .populate('attendees.user', 'name email');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Get event error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/events
// @desc    Create new event
// @access  Private (Organizer/Admin only)
router.post('/', [
  auth,
  [
    body('title', 'Title is required').notEmpty().trim().isLength({ max: 100 }),
    body('description', 'Description is required').notEmpty().trim().isLength({ max: 1000 }),
    body('category', 'Category is required').isIn(['Conference', 'Workshop', 'Seminar', 'Networking', 'Social', 'Sports', 'Cultural', 'Other']),
    body('dateTime', 'Valid date and time is required').isISO8601().custom(value => {
      if (new Date(value) <= new Date()) {
        throw new Error('Event date must be in the future');
      }
      return true;
    }),
    body('duration', 'Duration must be between 0.5 and 24 hours').isFloat({ min: 0.5, max: 24 }),
    body('location.venue', 'Venue is required').notEmpty().trim(),
    body('location.address', 'Address is required').notEmpty().trim(),
    body('location.city', 'City is required').notEmpty().trim(),
    body('capacity', 'Capacity must be between 1 and 10,000').isInt({ min: 1, max: 10000 }),
    body('price', 'Price must be 0 or positive').optional().isFloat({ min: 0 })
  ]
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Check if user is organizer or admin
    if (req.user.role !== 'organizer' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only organizers and admins can create events.' });
    }

    const {
      title,
      description,
      category,
      dateTime,
      duration,
      location,
      capacity,
      price = 0,
      tags = [],
      imageUrl,
      requirements
    } = req.body;

    const event = new Event({
      title,
      description,
      category,
      dateTime,
      duration,
      location,
      capacity,
      price,
      organizer: req.user.id,
      tags,
      imageUrl,
      requirements
    });

    await event.save();

    // Populate organizer info
    await event.populate('organizer', 'name email');

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/events/:id
// @desc    Update event
// @access  Private (Organizer of the event or Admin)
router.put('/:id', [
  auth,
  [
    body('title', 'Title is required').optional().notEmpty().trim().isLength({ max: 100 }),
    body('description', 'Description is required').optional().notEmpty().trim().isLength({ max: 1000 }),
    body('category', 'Category is required').optional().isIn(['Conference', 'Workshop', 'Seminar', 'Networking', 'Social', 'Sports', 'Cultural', 'Other']),
    body('dateTime', 'Valid date and time is required').optional().isISO8601().custom(value => {
      if (new Date(value) <= new Date()) {
        throw new Error('Event date must be in the future');
      }
      return true;
    }),
    body('duration', 'Duration must be between 0.5 and 24 hours').optional().isFloat({ min: 0.5, max: 24 }),
    body('capacity', 'Capacity must be between 1 and 10,000').optional().isInt({ min: 1, max: 10000 }),
    body('price', 'Price must be 0 or positive').optional().isFloat({ min: 0 })
  ]
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is the organizer or admin
    if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. You can only update your own events.' });
    }

    // Update event
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        event[key] = req.body[key];
      }
    });

    await event.save();
    await event.populate('organizer', 'name email');

    res.json({
      success: true,
      message: 'Event updated successfully',
      data: event
    });
  } catch (error) {
    console.error('Update event error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/events/:id
// @desc    Delete event
// @access  Private (Organizer of the event or Admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is the organizer or admin
    if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. You can only delete your own events.' });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Delete event error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/events/:id/register
// @desc    Register for an event
// @access  Private
router.post('/:id/register', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.status !== 'published') {
      return res.status(400).json({ message: 'Cannot register for unpublished event' });
    }

    // Check if event is full
    if (event.attendees.length >= event.capacity) {
      return res.status(400).json({ message: 'Event is full' });
    }

    // Check if user is already registered
    const alreadyRegistered = event.attendees.find(
      attendee => attendee.user.toString() === req.user.id
    );

    if (alreadyRegistered) {
      return res.status(400).json({ message: 'You are already registered for this event' });
    }

    // Add user to attendees
    event.attendees.push({
      user: req.user.id,
      registeredAt: new Date(),
      status: 'registered'
    });

    await event.save();

    res.json({
      success: true,
      message: 'Successfully registered for event',
      data: event
    });
  } catch (error) {
    console.error('Event registration error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/events/:id/register
// @desc    Cancel event registration
// @access  Private
router.delete('/:id/register', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Find and remove user from attendees
    const attendeeIndex = event.attendees.findIndex(
      attendee => attendee.user.toString() === req.user.id
    );

    if (attendeeIndex === -1) {
      return res.status(400).json({ message: 'You are not registered for this event' });
    }

    event.attendees.splice(attendeeIndex, 1);
    await event.save();

    res.json({
      success: true,
      message: 'Registration cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel registration error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/events/my/created
// @desc    Get events created by the authenticated user
// @access  Private (Organizer/Admin)
router.get('/my/created', auth, async (req, res) => {
  try {
    if (req.user.role !== 'organizer' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied.' });
    }

    const events = await Event.find({ organizer: req.user.id })
      .sort({ createdAt: -1 })
      .populate('organizer', 'name email');

    res.json({
      success: true,
      data: events
    });
  } catch (error) {
    console.error('Get my events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/events/my/registered
// @desc    Get events the authenticated user is registered for
// @access  Private
router.get('/my/registered', auth, async (req, res) => {
  try {
    const events = await Event.find({
      'attendees.user': req.user.id,
      status: 'published'
    })
      .sort({ dateTime: 1 })
      .populate('organizer', 'name email');

    res.json({
      success: true,
      data: events
    });
  } catch (error) {
    console.error('Get registered events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/events/cleanup/attendee-events
// @desc    Delete events created by attendees (admin only)
// @access  Private (Admin only)
router.delete('/cleanup/attendee-events', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    // Find all users who are attendees
    const attendees = await User.find({ role: 'attendee' });
    const attendeeIds = attendees.map(user => user._id);

    // Delete events created by attendees
    const result = await Event.deleteMany({ organizer: { $in: attendeeIds } });

    res.json({
      success: true,
      message: `Deleted ${result.deletedCount} events created by attendees`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Cleanup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/events/my/stats
// @desc    Get event statistics for the authenticated user
// @access  Private
router.get('/my/stats', auth, async (req, res) => {
  try {
    const counts = await Event.getEventCounts(req.user.id, req.user.role);
    
    res.json({
      success: true,
      data: counts
    });
  } catch (error) {
    console.error('Get event stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
