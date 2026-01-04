import { ShortUrl } from "../models/ShortUrl.Model.js";



/* ================= CREATE SHORT URL ================= */
export const AddUrl = async (req, res) => {
  try {
    const { longUrl, customUrl } = req.body;
    const userId = req.user._id; // auth middleware se aa raha hai

    /* ---------- validation ---------- */
    if (!longUrl) {
      return res.status(400).json({ message: "Long URL is required" });
    }

    /* ---------- helper: random string ---------- */
    const generateRandomString = (length = 8) => {
      const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let result = "";
      for (let i = 0; i < length; i++) {
        result += chars[Math.floor(Math.random() * chars.length)];
      }
      return result;
    };

    /* ---------- short code decide ---------- */
    const shortCode = customUrl || generateRandomString();

    const shortenedUrl = `${req.protocol}://${req.get("host")}/${shortCode}`;

    /* ---------- duplicate check (same user) ---------- */
    const urlExists = await ShortUrl.findOne({
      shortenedUrl,
      createdBy: userId,
    });

    if (urlExists) {
      return res
        .status(400)
        .json({ message: "This short URL already exists " });
    }

    /* ---------- save ---------- */
    const newUrl = await ShortUrl.create({
      longUrl,
      shortenedUrl,
      createdBy: userId,
    });

    return res.status(201).json({
      message: "Short URL created successfully",
      data: newUrl,
    });
  }
  catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "This short URL already exists for you",
      });
    }

    console.error(error);
    res.status(500).json({ message: "Server error" });
  }


};

export const GetAllUrls = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming you have middleware to set req.user from the token
    const urls = await ShortUrl.find({ createdBy: userId });
    res.status(200).json({ urls });
  } catch (error) {
    res.status(500).json({ message: "Server error by fetching URLs" });
    console.log(error);
  }
}

export const DeleteUrl = async (req, res) => {
  try {
    const { id } = req.body;
    const userId = req.user._id; // Assuming you have middleware to set req.user from the token
    const deletedUrl = await ShortUrl.findOneAndDelete({ _id: id, createdBy: userId });
    if (!deletedUrl) {
      return res.status(404).json({ message: "URL not found" });
    }
    res.status(200).json({ message: "URL deleted successfully", deletedUrl });
  } catch (error) {
    res.status(500).json({ message: "Server error by deleting URL" });
    console.log(error);
  }
}

export const RedirectUrl = async (req, res) => {
  try {
    const { shortUrl } = req.params;
    const shortenedUrl = `${req.protocol}://${req.get("host")}/${shortUrl}`;

    const url = await ShortUrl.findOne({ shortenedUrl });
    if (!url) {
      return res.status(404).json({ message: "URL not found" ,url});
    }
  
    res.redirect(url.longUrl);
  } catch (error) {
    res.status(500).json({ message: "Server error by redirecting URL" });
    console.log(error);
  }
}
