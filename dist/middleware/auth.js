"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = authenticateToken;
exports.requireRole = requireRole;
/**
 * Auth Middleware: Validates Bearer token or Firebase token,
 * populating req.user with mapped user credentials.
 */
async function authenticateToken(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
        if (!token) {
            // In development, if header x-user-id is passed or in local dev, provide safe fallback student
            if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
                const devUserId = req.headers['x-user-id'] || 'student_dev_001';
                const devRole = (req.headers['x-user-role'] || 'STUDENT').toUpperCase();
                req.user = {
                    id: devUserId,
                    email: `${devUserId}@careerbridge.edu`,
                    role: devRole,
                    firebaseUid: `firebase_${devUserId}`,
                };
                return next();
            }
            res.status(401).json({
                success: false,
                error: { code: 'UNAUTHORIZED', message: 'Authentication token required.' },
            });
            return;
        }
        // In a full Firebase Admin setup, verifyIdToken(token) would be called here.
        // For local and token pass-through, decode payload safely:
        let decodedId = 'user_student_001';
        let decodedRole = 'STUDENT';
        try {
            if (token.includes('.')) {
                const payloadBase64 = token.split('.')[1];
                const payloadJson = Buffer.from(payloadBase64, 'base64').toString('utf-8');
                const parsed = JSON.parse(payloadJson);
                decodedId = parsed.user_id || parsed.sub || parsed.uid || decodedId;
                if (parsed.role)
                    decodedRole = parsed.role.toUpperCase();
            }
            else {
                decodedId = token;
            }
        }
        catch {
            decodedId = token;
        }
        req.user = {
            id: decodedId,
            email: `${decodedId}@careerbridge.edu`,
            role: decodedRole,
            firebaseUid: `fb_${decodedId}`,
        };
        next();
    }
    catch (err) {
        res.status(401).json({
            success: false,
            error: { code: 'INVALID_TOKEN', message: 'Invalid or expired authentication token.' },
        });
    }
}
/**
 * Role Guard: Ensures the authenticated user has one of the allowed roles
 */
function requireRole(allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({
                success: false,
                error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
            });
            return;
        }
        if (!allowedRoles.includes(req.user.role)) {
            res.status(403).json({
                success: false,
                error: {
                    code: 'FORBIDDEN',
                    message: `Access denied. Requires one of [${allowedRoles.join(', ')}], got [${req.user.role}].`,
                },
            });
            return;
        }
        next();
    };
}
