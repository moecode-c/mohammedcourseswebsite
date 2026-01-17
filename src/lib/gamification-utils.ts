export const LEVEL_FORMULA_CONST = 100;

export function calculateLevel(xp: number): number {
    if (xp === 0) return 1;
    const level = Math.pow(xp / LEVEL_FORMULA_CONST, 1 / 1.5);
    return Math.max(1, Math.floor(level));
}

export function xpForLevel(level: number): number {
    return Math.floor(LEVEL_FORMULA_CONST * Math.pow(level, 1.5));
}

export function xpForNextLevel(currentLevel: number): number {
    return xpForLevel(currentLevel + 1);
}

export function getLevelProgress(xp: number) {
    const currentLevel = calculateLevel(xp);
    const nextLevel = currentLevel + 1;
    const xpCurrentLevelStart = xpForLevel(currentLevel);
    const xpNextLevelStart = xpForLevel(nextLevel);

    const xpNeeded = xpNextLevelStart - xpCurrentLevelStart;
    const xpGainedInLevel = xp - xpCurrentLevelStart;

    const percentage = Math.min(100, Math.max(0, (xpGainedInLevel / xpNeeded) * 100));

    return {
        currentLevel,
        nextLevel,
        xpCurrentLevelStart,
        xpNextLevelStart,
        xpNeeded,
        xpGainedInLevel,
        percentage
    };
}
