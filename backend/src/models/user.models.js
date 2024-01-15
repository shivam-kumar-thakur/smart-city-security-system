import mongoose from "mongoose";
import jwt from "jsonwebtoken"; 
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    number: {
        type: Integer,
        required: true,  
        index: true,
        trim: true,
        unique: true,
        min:10,
        max:10
    },
    password: {
        type: String,
        required: true
    },
    userDetails: {
        [type: mongoose.Schema.Types.ObjectId,
        ref: "GatheredData"]
    },
    refreshToken: {
        type: String
    }
}, { timestamps: true });

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordValid = function (password) {
    if (password) {
        try {
            return bcrypt.compare(password, this.password);
        } catch (error) {
            throw new Error('Password incorrect');
        }
    }
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        _id: this._id,
        number: this.number
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    });
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    );
};

export const User = mongoose.model("User", userSchema);
