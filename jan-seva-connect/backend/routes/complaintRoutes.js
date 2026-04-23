const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaint");

// ✅ Import upload (Cloudinary + multer)
const upload = require("../config/multer");


// 🔥 CREATE complaint (WITH IMAGE UPLOAD)
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const complaint = new Complaint({
      title: req.body.title,
      description: req.body.description,
      image: req.file ? req.file.path : "", // Cloudinary URL
      location: {
        lat: req.body.lat,
        lng: req.body.lng,
      },
    });

    await complaint.save();
    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ✅ GET all complaints
router.get("/", async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ✅ UPDATE complaint status
router.put("/:id", async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    complaint.status = req.body.status || complaint.status;

    const updatedComplaint = await complaint.save();
    res.json(updatedComplaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ✅ DELETE complaint
router.delete("/:id", async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    await complaint.deleteOne();
    res.json({ message: "Complaint deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;