const Guard = require('../models/guardModel');
const Application = require('../models/applicationModel');
const Enquiry = require('../models/enquiryModel');
const Certification = require('../models/certificationModel');
const GalleryItem = require('../models/galleryItemModel');

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard/stats
// @access  Private
exports.getDashboardStats = async (req, res, next) => {
    try {
        // Get counts from all collections
        const [
            totalGuards,
            activeGuards,
            totalApplications,
            totalEnquiries,
            totalCertifications,
            totalGalleryItems
        ] = await Promise.all([
            Guard.countDocuments(),
            Guard.countDocuments({ status: 'Active' }),
            Application.countDocuments(),
            Enquiry.countDocuments(),
            Certification.countDocuments(),
            GalleryItem.countDocuments()
        ]);

        // Get recent applications count (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentApplications = await Application.countDocuments({
            submittedAt: { $gte: thirtyDaysAgo }
        });

        // Get previous period for comparison (30-60 days ago)
        const sixtyDaysAgo = new Date();
        sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
        const previousApplications = await Application.countDocuments({
            submittedAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo }
        });

        // Calculate percentage change for applications
        let applicationChange = '0';
        let applicationChangeType = 'neutral';
        if (previousApplications > 0) {
            const change = ((recentApplications - previousApplications) / previousApplications) * 100;
            applicationChange = change > 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
            applicationChangeType = change > 0 ? 'increase' : change < 0 ? 'decrease' : 'neutral';
        } else if (recentApplications > 0) {
            applicationChange = '+100%';
            applicationChangeType = 'increase';
        }

        // Get recent enquiries count (last 30 days)
        const recentEnquiries = await Enquiry.countDocuments({
            submittedAt: { $gte: thirtyDaysAgo }
        });

        const previousEnquiries = await Enquiry.countDocuments({
            submittedAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo }
        });

        // Calculate percentage change for enquiries
        let enquiryChange = '0';
        let enquiryChangeType = 'neutral';
        if (previousEnquiries > 0) {
            const change = ((recentEnquiries - previousEnquiries) / previousEnquiries) * 100;
            enquiryChange = change > 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
            enquiryChangeType = change > 0 ? 'increase' : change < 0 ? 'decrease' : 'neutral';
        } else if (recentEnquiries > 0) {
            enquiryChange = '+100%';
            enquiryChangeType = 'increase';
        }

        // Calculate guards change (compare active vs total)
        const guardsOnLeave = totalGuards - activeGuards;
        let guardChange = '0';
        let guardChangeType = 'neutral';
        if (totalGuards > 0) {
            const activePercentage = (activeGuards / totalGuards) * 100;
            guardChange = `${activePercentage.toFixed(1)}%`;
            guardChangeType = activePercentage >= 80 ? 'increase' : 'decrease';
        }

        res.status(200).json({
            success: true,
            data: {
                totalGuards: {
                    value: totalGuards.toLocaleString(),
                    change: guardChange,
                    changeType: guardChangeType
                },
                activeGuards: {
                    value: activeGuards.toLocaleString(),
                    change: guardsOnLeave > 0 ? `${guardsOnLeave} on leave` : 'All active',
                    changeType: 'neutral'
                },
                totalApplications: {
                    value: totalApplications.toLocaleString(),
                    change: applicationChange,
                    changeType: applicationChangeType
                },
                totalEnquiries: {
                    value: totalEnquiries.toLocaleString(),
                    change: enquiryChange,
                    changeType: enquiryChangeType
                },
                totalCertifications: {
                    value: totalCertifications.toLocaleString(),
                    change: '0',
                    changeType: 'neutral'
                },
                totalGalleryItems: {
                    value: totalGalleryItems.toLocaleString(),
                    change: '0',
                    changeType: 'neutral'
                }
            }
        });
    } catch (err) {
        next(err);
    }
};

