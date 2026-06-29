"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = exports.requireAuth = void 0;
const clerk_sdk_node_1 = require("@clerk/clerk-sdk-node");
// Middleware 1: Requires any valid logged-in user.
// The "as RequestHandler" part tells TypeScript to stop panicking
// and accept that this is a perfectly valid Express middleware function!
exports.requireAuth = (0, clerk_sdk_node_1.ClerkExpressRequireAuth)();
// Middleware 2: Requires the user to have the "admin" role
const requireAdmin = (req, res, next) => {
    // We grab the role from the token Clerk attached to the request
    const role = req.auth?.sessionClaims?.metadata?.role;
    if (role !== "admin") {
        return res.status(403).json({ error: "Admin access denied" });
    }
    next(); // Pass them through!
};
exports.requireAdmin = requireAdmin;
