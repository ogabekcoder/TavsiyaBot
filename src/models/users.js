const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        fullName: {
            type: String,
        },
        tgInfo: {
            type: Object,
        },
        channels: [
            {
                name: {
                    type: String,
                },
                id: {
                    type: String,
                },
            },
        ],
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
)

const User = mongoose.model("User", userSchema)

module.exports = User
