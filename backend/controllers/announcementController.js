const connectDB = require('../config/database');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

const getAnnouncements = asyncHandler(async (req, res) => {
  const { type, page = 1, limit = 10 } = req.query;
  const connection = await connectDB();

  let query = `
    SELECT id, title, content, type, createdAt, postedBy, isPinned
    FROM announcements
    WHERE isActive = true
    AND (expiresAt IS NULL OR expiresAt > NOW())
    AND targetAudience IN ('all', ?)
  `;
  const params = [req.user.role === 'student' ? 'students' : 'faculty'];

  if (type) {
    query += ' AND type = ?';
    params.push(type);
  }

  // Get total count
  const countQuery = query.replace(/SELECT .+ FROM/, 'SELECT COUNT(*) as total FROM');
  const [countResult] = await connection.query(countQuery, params);
  const total = countResult[0].total;

  // Add pagination and ordering
  const skip = (page - 1) * limit;
  query += ' ORDER BY isPinned DESC, createdAt DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), skip);

  const [announcements] = await connection.query(query, params);

  res.json({
    success: true,
    count: announcements.length,
    total,
    pages: Math.ceil(total / limit),
    data: announcements,
  });
});

const getAnnouncement = asyncHandler(async (req, res) => {
  const connection = await connectDB();

  const [rows] = await connection.query(
    'SELECT id, title, content, type, createdAt, postedBy FROM announcements WHERE id = ?',
    [req.params.id]
  );

  if (rows.length === 0) {
    throw new AppError('Announcement not found', 404);
  }

  res.json({ success: true, data: rows[0] });
});

const createAnnouncement = asyncHandler(async (req, res) => {
  const { title, content, type, targetAudience, expiresAt } = req.body;

  if (!title || !content) {
    throw new AppError('Title and content are required', 400);
  }

  const connection = await connectDB();

  const [result] = await connection.query(
    'INSERT INTO announcements (title, content, type, targetAudience, postedBy, isActive, expiresAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [
      title,
      content,
      type || null,
      targetAudience || 'all',
      req.user.id,
      true,
      expiresAt || null,
    ]
  );

  const [newAnnouncement] = await connection.query(
    'SELECT id, title, content, type, targetAudience, postedBy, isActive, createdAt FROM announcements WHERE id = ?',
    [result.insertId]
  );

  res.status(201).json({ success: true, data: newAnnouncement[0] });
});

const updateAnnouncement = asyncHandler(async (req, res) => {
  const connection = await connectDB();

  // Check if exists
  const [existing] = await connection.query(
    'SELECT id FROM announcements WHERE id = ?',
    [req.params.id]
  );

  if (existing.length === 0) {
    throw new AppError('Announcement not found', 404);
  }

  // Build dynamic update
  const updates = req.body;
  const updateFields = Object.keys(updates)
    .map((key) => `${key} = ?`)
    .join(', ');
  const updateValues = Object.values(updates);

  if (!updateFields) {
    throw new AppError('No fields to update', 400);
  }

  updateValues.push(req.params.id);

  await connection.query(`UPDATE announcements SET ${updateFields} WHERE id = ?`, updateValues);

  const [updated] = await connection.query(
    'SELECT id, title, content, type, targetAudience, postedBy, isActive, createdAt FROM announcements WHERE id = ?',
    [req.params.id]
  );

  res.json({ success: true, data: updated[0] });
});

const deleteAnnouncement = asyncHandler(async (req, res) => {
  const connection = await connectDB();

  const [existing] = await connection.query(
    'SELECT id FROM announcements WHERE id = ?',
    [req.params.id]
  );

  if (existing.length === 0) {
    throw new AppError('Announcement not found', 404);
  }

  await connection.query('DELETE FROM announcements WHERE id = ?', [req.params.id]);

  res.json({ success: true, message: 'Announcement deleted' });
});

module.exports = {
  getAnnouncements,
  getAnnouncement,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
};