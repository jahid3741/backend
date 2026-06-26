import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import { Request, Response, NextFunction, RequestHandler } from "express";

// Middleware 1: Requires any valid logged-in user.
// The "as RequestHandler" part tells TypeScript to stop panicking
// and accept that this is a perfectly valid Express middleware function!
export const requireAuth = ClerkExpressRequireAuth() as any;

// Middleware 2: Requires the user to have the "admin" role
export const requireAdmin = (req: any, res: Response, next: NextFunction) => {
  // We grab the role from the token Clerk attached to the request
  const role = req.auth?.sessionClaims?.metadata?.role;
  if (role !== "admin") {
    return res.status(403).json({ error: "Admin access denied" });
  }
  next(); // Pass them through!
};
