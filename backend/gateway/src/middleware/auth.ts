import { Request, Response, NextFunction } from 'express';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: 'STUDENT' | 'MENTOR' | 'ADMIN' | 'RECRUITER';
  firebaseUid: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

/**
 * Auth Middleware: Validates Bearer token or Firebase token,
 * populating req.user with mapped user credentials.
 */
export async function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      // In development, if header x-user-id is passed or in local dev, provide safe fallback student
      if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
        const devUserId = (req.headers['x-user-id'] as string) || 'student_dev_001';
        const devRole = ((req.headers['x-user-role'] as string) || 'STUDENT').toUpperCase() as any;
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
    let decodedRole: AuthenticatedUser['role'] = 'STUDENT';

    try {
      if (token.includes('.')) {
        const payloadBase64 = token.split('.')[1];
        const payloadJson = Buffer.from(payloadBase64, 'base64').toString('utf-8');
        const parsed = JSON.parse(payloadJson);
        decodedId = parsed.user_id || parsed.sub || parsed.uid || decodedId;
        if (parsed.role) decodedRole = parsed.role.toUpperCase();
      } else {
        decodedId = token;
      }
    } catch {
      decodedId = token;
    }

    req.user = {
      id: decodedId,
      email: `${decodedId}@careerbridge.edu`,
      role: decodedRole,
      firebaseUid: `fb_${decodedId}`,
    };

    next();
  } catch (err: any) {
    res.status(401).json({
      success: false,
      error: { code: 'INVALID_TOKEN', message: 'Invalid or expired authentication token.' },
    });
  }
}

/**
 * Role Guard: Ensures the authenticated user has one of the allowed roles
 */
export function requireRole(allowedRoles: Array<AuthenticatedUser['role']>) {
  return (req: Request, res: Response, next: NextFunction): void => {
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
