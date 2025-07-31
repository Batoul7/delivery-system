const Log = require("../models/Log");

const logger = {
  log: async (action, options = {}) => {
    try {
      const logEntry = new Log({
        action,
        user: options.user || null,
        details: options.details || {},
        ip: options.ip === '::1' ? '127.0.0.1' : options.ip || "",
        status: (options.status || 'SUCCESS').toUpperCase(),
        affectedResource: options.resource || null,
        affectedResourceId: options.resourceId || null,
      });

      return await logEntry.save();
    } catch (error) {
      console.error("Failed to save log:", error);
      return null;
    }
  },

  logLogin: async (user, ip, status = "SUCCESS") => {
    return logger.log("LOGIN", { user, ip, status });
  },

  logDataChange: async (
    user,
    resource,
    resourceId,
    action,
    details = {},
    ip = ""
  ) => {
    return logger.log(action.toUpperCase(), {
      user,
      ip,
      resource,
      resourceId,
      details,
    });
  },

  logError: async (error, user = null, ip = "") => {
    return logger.log("ERROR", {
      user,
      ip,
      status: "FAILURE",
      details: {
        message: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
    });
  },
};

module.exports = logger;