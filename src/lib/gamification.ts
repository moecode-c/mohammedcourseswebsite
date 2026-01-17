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
    userId: string,
    amount: number,
    reason?: string // For logging in the future
): Promise<XPAwardResult | null> {
    const user = await User.findById(userId);
    if (!user) return null;

    const previousLevel = user.level || 1;
    user.xp = (user.xp || 0) + amount;

    const newLevel = calculateLevel(user.xp);

    let levelUp = false;
    if (newLevel > previousLevel) {
        user.level = newLevel;
        levelUp = true;
        // Potentially award badge for reaching level X here
    }

    await user.save();

    return {
        previousLevel,
        newLevel,
        levelUp,
        xpAwarded: amount,
        newTotalXP: user.xp,
    };
}
