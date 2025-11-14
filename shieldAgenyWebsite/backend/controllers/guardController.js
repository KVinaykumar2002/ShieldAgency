const Guard = require('../models/guardModel');

// @desc    Get all guards
// @route   GET /api/admin/guards
// @access  Private
exports.getGuards = async (req, res, next) => {
    try {
        const guards = await Guard.find();
        res.status(200).json({ success: true, count: guards.length, data: guards });
    } catch (err) {
        next(err);
    }
};

// @desc    Create a new guard
// @route   POST /api/admin/guards
// @access  Private
exports.createGuard = async (req, res, next) => {
    try {
        const guard = await Guard.create(req.body);
        res.status(201).json({ success: true, data: guard });
    } catch (err) {
        next(err);
    }
};

// @desc    Update a guard
// @route   PUT /api/admin/guards/:id
// @access  Private
exports.updateGuard = async (req, res, next) => {
    try {
        const guard = await Guard.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!guard) {
            return res.status(404).json({ success: false, message: 'Guard not found' });
        }
        res.status(200).json({ success: true, data: guard });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete a guard
// @route   DELETE /api/admin/guards/:id
// @access  Private
exports.deleteGuard = async (req, res, next) => {
    try {
        const guard = await Guard.findByIdAndDelete(req.params.id);
        if (!guard) {
            return res.status(404).json({ success: false, message: 'Guard not found' });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};