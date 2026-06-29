"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = exports.requireAuth = void 0;
const clerk_sdk_node_1 = require("@clerk/clerk-sdk-node");
exports.requireAuth = (0, clerk_sdk_node_1.ClerkExpressRequireAuth)();
const requireAdmin = (req, res, next) => {
    const role = req.auth?.sessionClaims?.metadata?.role;
    if (role !== "admin") {
        return res.status(403).json({ error: "Admin access denied" });
    }
    next();
};
exports.requireAdmin = requireAdmin;
//# sourceMappingURL=auth.js.map