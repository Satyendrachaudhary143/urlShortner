import mongoose from "mongoose";

const shortUrlSchema = new mongoose.Schema({
    longUrl: {
        type: String,
        required: true,
    },
    shortenedUrl: {
        type: String,
        unique: true,
        required: true,},

    passord: {
        type: String,
        default: null,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

}, { timestamps: true });

export const ShortUrl = mongoose.model("ShortUrl", shortUrlSchema);