const mongoose = require("mongoose");

const logSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        "LOGIN",
        "LOGOUT",
        "CREATE",
        "UPDATE",
        "DELETE",
        "ACCESS",
        "ERROR",
      ],
    },

    status: {
      type: String,
      enum: ['SUCCESS', 'FAILURE', 'WARNING'],
      required: true
    },

    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  ip: {
      type: String,
      validate: {
          validator: function (v) {
              // --- تعديل هنا: تجاهل التحقق إذا كان IP هو ::1 ---
              if (!v || v === '::1') return true; 
              return /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(v);
          },
          message: props => `${props.value} ليس عنوان IP صالحًا!`
      },
  },
},
  {
    timestamps: true 
  }
);

logSchema.index({ action: 1, createdAt: -1 });

logSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("Log", logSchema);
