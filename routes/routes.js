var express = require('express');
const router = express.Router();
const { PrismaClient, Prisma } = require('@prisma/client')
const prisma = new PrismaClient();

// Feedback create
router.route('/learner/feedback/create/:id').post((req, res) => {
    const data = {
        feedback: req.body.feedback,
        userId: req.body.userId,
        courseId: req.params.id,
    }
    try {
        prisma.feedback.create({ data })
            .then((data) => {
                if (data) {
                    res.status(201).json({ status: true, message: "Feedback created successfully", data, code: "201" });
                } else {
                    res.status(400).json({ status: false, message: "Error creating feedback", code: "400" });
                }
                console.log("Feedback Created", data);
            })
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).json({ status: false, message: "New feedback cannot be created", code: "500" });
    }

});

// Get all feedbacks
router.route('/learner/feedback/getAll').get((req, res) => {
    try {
        prisma.feedback.findMany({
            include: {
                user: true,
                course: true
            },
        }).then((data) => {
            res.status(200)
                .json({ status: true, message: "Feedbacks retrieved successful", data, code: "200" });
        })
    } catch (error) {
        console.error("Error finding Feedbacks:", error);
        res.status(500).json({ status: false, message: "Internal Server Error", code: 500 });
    }
})

// Function for Retreive only the specific feedback based on the id
router.route('/learner/feedback/get/:id').get((req, res) => {
    const _id = req.params.id
    try {
        prisma.feedback.findUnique({
            where: {
                id: _id,
            },
            include: {
                user: true,
                course: true
            }
        }).then((data) => {
            if (data) {
                res.status(200).json({ status: true, message: "User found", user: data, role: data.Role, code: "200" })
            } else {
                res.status(404).json({ status: false, message: "User not found", code: "404" });
            }
        });

    } catch (error) {
        res.status(500).json({ status: false, message: "Error while fetching user", code: "500" });
        console.log("Error while fetching user", error);
    }
});

// Function for Retreive only the specific Courses based on the userid
router.route('/learner/course/get/:id').get((req, res) => {
    const userId = req.params.id;
    try {
        prisma.enrollment.findMany({
            where: {
                userId: userId,
            },
            include: {
                course: true
            }
        }).then((enrollments) => {
            if (enrollments.length > 0) {
                // Extract courses from enrollments
                const courses = enrollments.map(enrollment => enrollment.course);
                res.status(200).json({ status: true, message: "Courses found", courses: courses, code: "200" });
            } else {
                res.status(404).json({ status: false, message: "Courses not found", code: "404" });
            }
        });

    } catch (error) {
        res.status(500).json({ status: false, message: "Error while fetching courses", code: "500" });
        console.log("Error while fetching course", error);
    }
});


module.exports = router;