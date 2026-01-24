
type RateLimitInfo = {
    count: number;
    reset: number;
};

const rateLimits = new Map<string, RateLimitInfo>();

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

export const rateLimit = {
    check: (ip: string) => {
        const now = Date.now();
        const info = rateLimits.get(ip);

        if (!info) {
            return {
                limited: false,
                remainingAttempts: MAX_ATTEMPTS,
                resetTime: now + WINDOW_MS
            };
        }

        if (now > info.reset) {
            // Window expired, reset
            rateLimits.delete(ip);
            return {
                limited: false,
                remainingAttempts: MAX_ATTEMPTS,
                resetTime: now + WINDOW_MS
            };
        }

        if (info.count >= MAX_ATTEMPTS) {
            return {
                limited: true,
                remainingAttempts: 0,
                resetTime: info.reset
            };
        }

        return {
            limited: false,
            remainingAttempts: MAX_ATTEMPTS - info.count,
            resetTime: info.reset
        };
    },

    increment: (ip: string) => {
        const now = Date.now();
        const info = rateLimits.get(ip);

        if (!info || now > info.reset) {
            rateLimits.set(ip, {
                count: 1,
                reset: now + WINDOW_MS
            });
        } else {
            rateLimits.set(ip, {
                ...info,
                count: info.count + 1
            });
        }
    },

    clear: (ip: string) => {
        rateLimits.delete(ip);
    }
};
