import Notice from "../models/Notice.js";

// ================= CREATE NOTICE =================

export const createNotice = async (req, res) => {
  try {
    const { title, message } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        message: "Title and message are required",
      });
    }

    const notice = new Notice({
      title,
      message,
    });

    await notice.save();

    res.status(201).json({
      message: "Notice created successfully",
      notice,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create notice",
      error: error.message,
    });
  }
};

// ================= GET ALL NOTICES =================

export const getAllNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({
      createdAt: -1,
    });

    res.status(200).json(notices);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch notices",
      error: error.message,
    });
  }
};

// ================= DELETE NOTICE =================

export const deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);

    if (!notice) {
      return res.status(404).json({
        message: "Notice not found",
      });
    }

    res.status(200).json({
      message: "Notice deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete notice",
      error: error.message,
    });
  }
};
