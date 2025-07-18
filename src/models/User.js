const mongoose = require('mongoose');
const aragon2 = require('aragon2');


const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true, 
        unique: true
    },
    role: {
        type: String,
        enum: ['Client', 'Driver', 'Admin'],
        default: 'Client'
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [Longitude, Latitude]
            index: '2dsphere' // لتحسين أداء الاستعلامات الجغرافية
        }
    },
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    }
}, {
    timestamps: true
});

UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        this.password = await aragon2.hash(this.password);
        next();
    } catch (error) {
        next(error);
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;