import User, { IUser } from "@/models/User";
import { calculateLevel, LEVEL_FORMULA_CONST } from "./gamification-utils";

export { calculateLevel, LEVEL_FORMULA_CONST };

export function xpForNextLevel(currentLevel: number): number {
    return Math.floor(LEVEL_FORMULA_CONST * Math.pow(currentLevel + 1, 1.5));
}

export interface XPAwardResult {
    previousLevel: number;
    newLevel: number;
    levelUp: boolean;
    xpAwarded: number;
    newTotalXP: number;
}

export async function awardXP(
    userOrId: string | IUser,
    amount: number,
    reason?: string
): Promise<XPAwardResult | null> {
    let user: IUser | null;

    if (typeof userOrId === 'string') {
        user = await User.findById(userOrId);
    } else {
        user = userOrId;
    }

    if (!user) return null;

    const previousLevel = user.level || 1;
    user.xp = (user.xp || 0) + amount;

    const newLevel = calculateLevel(user.xp);

    let levelUp = false;
    if (newLevel > previousLevel) {
        user.level = newLevel;
        levelUp = true;
    }

    // Only save if we fetched the user by ID locally
    if (typeof userOrId === 'string') {
        await user.save();
    }

    return {
        previousLevel,
        newLevel,
        levelUp,
        xpAwarded: amount,
        newTotalXP: user.xp,
    };
}
