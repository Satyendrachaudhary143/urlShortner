import { ShortUrl } from "../models/ShortUrl.Model.js";


export const AddUrl = async (req, res) => {
  try {
      const { longUrl, customUrl, password } = req.body;
      
    // generate a random string for the shortened URL 
    const generateRandomString = (length) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};


      const randomString = generateRandomString(8); // Generate a random string of length 6
      
      
      // find current user from the token
      const userId = req.id; // Assuming you have middleware to set req.user from the token
      const Curentuser = req.user; // Assuming you have middleware to set req.user from the token
      

    // Validate input
    if (!longUrl) {
      return res.status(400).json({ message: "URL is required" });
    }
    // validate longUrl
    // const longUrlExist = await ShortUrl.findOne({ longUrl , createdBy: userId });
    // if (longUrlExist) {
    //   return res.status(400).json({ message: "URL already exists" });
    // }
    // Create new short URL
      const shortUrl = customUrl ? `${req.protocol}://${req.get("host")}/${customUrl}` : `${req.protocol}://${req.get("host")}/${randomString}`;
      console.log("url",shortUrl);
      
    // Check if URL already exists
      const existingUrl = await ShortUrl.findOne({ shortenedUrl: shortUrl});
    if (existingUrl) {
      return res.status(400).json({ message: "URL already exists" });
      }
      const newUrl = new ShortUrl({ longUrl,shortenedUrl:shortUrl , password, createdBy: userId  });
   const result = await newUrl.save();
    res.status(201).json({ message: "Short URL created successfully", ShortUrl , result, Curentuser});
  } catch (error) {
    res.status(500).json({ message: "Server error by creating short URL" });
    console.log(error);
  }
}
export const GetAllUrls = async (req, res) => {
  try {
    const userId = req.id; // Assuming you have middleware to set req.user from the token
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
    const userId = req.id; // Assuming you have middleware to set req.user from the token
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
    const FullShortUrl =`${req.protocol}://${req.get("host")}/${shortUrl}`
    const url = await ShortUrl.findOne({ shortenedUrl: FullShortUrl });
    if (!url) {
      return res.status(404).json({ message: "URL not found" ,url});
    }
  
    res.redirect(url.longUrl);
  } catch (error) {
    res.status(500).json({ message: "Server error by redirecting URL" });
    console.log(error);
  }
}
