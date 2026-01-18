"use client";

import { useState } from "react";
import { GameButton } from "@/components/ui/GameButton";
import { CheckCircle, XCircle, Play, RotateCcw } from "lucide-react";

interface Question {
    questionText: string;
    options: string[];
    correctOptionIndex: number;
}

interface QuizViewProps {
    sectionId: string;
    questions: Question[];
    answeredQuestions: string[];
    onXPGain: (amount: number) => void;
    onAnswerCorrect: (answerId: string) => void;
}

export function QuizView({ sectionId, questions, answeredQuestions, onXPGain, onAnswerCorrect }: QuizViewProps) {
    const [quizStarted, setQuizStarted] = useState(false);
    const [results, setResults] = useState<{ [key: number]: { isCorrect: boolean, selected: number, correctIndex: number } }>({});
    const [loading, setLoading] = useState<number | null>(null);

    // Ensure everything is treated as a string for robust matching
    const sId = String(sectionId);
    const allAnswered = (answeredQuestions || []).map(String);

    // Check if ALL questions in this quiz have been answered before (including this session)
    const allQuestionsAnsweredBefore = questions.length > 0 && questions.every((_, qIdx) =>
        allAnswered.includes(`${sId}-${qIdx}`)
    );
    const anyQuestionAnsweredBefore = questions.some((_, qIdx) =>
        allAnswered.includes(`${sId}-${qIdx}`)
    );

    const handleAnswer = async (qIdx: number, optionIdx: number) => {
        // Prevent re-answering if already answered correctly in this session
        if (results[qIdx]?.isCorrect) return;
        if (loading === qIdx) return;

        setLoading(qIdx);

        try {
            const res = await fetch("/api/quiz/answer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sectionId,
                    questionIndex: qIdx,
                    selectedOptionIndex: optionIdx
                })
            });
            const data = await res.json();

            if (data.success) {
                setResults(prev => ({
                    ...prev,
                    [qIdx]: {
                        isCorrect: data.isCorrect,
                        selected: optionIdx,
                        correctIndex: data.correctOptionIndex
                    }
                }));

                // Track answered questions for this session via parent state
                if (data.isCorrect) {
                    const answerId = `${sId}-${qIdx}`;
                    onAnswerCorrect(answerId);
                }

                if (data.xpAwarded > 0) {
                    onXPGain(data.xpAwarded);
                }
            }
        } catch (e) {
            console.error(e);
        }
        setLoading(null);
    };

    // Quiz Start Screen
    if (!quizStarted) {
        return (
            <div className="max-w-2xl mx-auto text-center py-12">
                <div className="bg-slate-900/50 border border-slate-800 p-10 rounded">
                    <div className="text-6xl mb-6">🧠</div>
                    <h3 className="text-3xl font-heading text-primary mb-4">QUIZ CHALLENGE</h3>
                    <p className="font-mono text-slate-400 mb-2">
                        {questions.length} question{questions.length !== 1 ? 's' : ''} await you.
                    </p>

                    {allQuestionsAnsweredBefore ? (
                        <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded mb-6 mt-6">
                            <p className="text-yellow-400 font-mono text-sm">
                                ⚠️ You have already completed this quiz. No XP will be awarded for retaking.
                            </p>
                        </div>
                    ) : anyQuestionAnsweredBefore ? (
                        <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded mb-6 mt-6">
                            <p className="text-blue-400 font-mono text-sm">
                                ℹ️ Some questions were previously answered. XP only for new correct answers.
                            </p>
                        </div>
                    ) : (
                        <p className="font-mono text-slate-500 mb-6">
                            Earn <span className="text-yellow-400 font-bold">10 XP</span> for each correct answer!
                        </p>
                    )}

                    <GameButton
                        size="lg"
                        onClick={() => setQuizStarted(true)}
                        className="mt-4"
                    >
                        {allQuestionsAnsweredBefore ? (
                            <><RotateCcw className="w-5 h-5 mr-2" /> RETAKE QUIZ</>
                        ) : (
                            <><Play className="w-5 h-5 mr-2" /> START QUIZ</>
                        )}
                    </GameButton>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-3xl mx-auto">
            <div className="bg-slate-900/50 border border-slate-800 p-6 rounded text-center mb-8">
                <h3 className="text-2xl font-heading text-primary mb-2">QUIZ MODE ACTIVE</h3>
                <p className="font-mono text-slate-400">
                    {allQuestionsAnsweredBefore
                        ? "Retake mode - No XP available"
                        : <>Answer correctly to earn <span className="text-yellow-400 font-bold">10 XP</span> per question.</>
                    }
                </p>
            </div>

            {questions && questions.map((q, qIdx) => {
                const result = results[qIdx];
                const isAnsweredThisSession = !!result;
                const previouslyAnswered = answeredQuestions.includes(`${sectionId}-${qIdx}`);
                const isCorrect = result?.isCorrect;
                const isLocked = isAnsweredThisSession && isCorrect; // Lock after correct answer

                return (
                    <div key={qIdx} className="bg-slate-950 border border-slate-800 p-6 rounded relative overflow-hidden group">
                        {/* Status Bar */}
                        <div className={`absolute top-0 left-0 w-1 h-full ${isCorrect ? "bg-green-500" : result && !isCorrect ? "bg-red-500" : previouslyAnswered ? "bg-blue-500" : "bg-slate-700"
                            }`} />

                        <h4 className="text-xl font-bold text-white mb-6 pl-4 flex items-start gap-3">
                            <span className="text-slate-500">#{qIdx + 1}</span>
                            {q.questionText}
                            {previouslyAnswered && !isAnsweredThisSession && (
                                <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded ml-auto">Previously Answered</span>
                            )}
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4">
                            {q.options.map((opt, oIdx) => {
                                let btnClass = "justify-start text-left font-mono text-sm h-auto py-3 px-4 ";

                                if (isAnsweredThisSession) {
                                    if (oIdx === result.correctIndex) {
                                        // Always show correct answer in green after submission
                                        btnClass += "bg-green-500/20 border-green-500 text-green-500 hover:bg-green-500/20";
                                    } else if (oIdx === result.selected && !isCorrect) {
                                        // Wrong selection in red
                                        btnClass += "bg-red-500/20 border-red-500 text-red-500 hover:bg-red-500/20";
                                    } else {
                                        btnClass += "bg-slate-900/50 border-slate-800 text-slate-600 opacity-50";
                                    }
                                } else {
                                    btnClass += "bg-slate-900 border-slate-700 hover:border-primary hover:text-primary";
                                }

                                return (
                                    <GameButton
                                        key={oIdx}
                                        variant="ghost"
                                        className={btnClass}
                                        onClick={() => handleAnswer(qIdx, oIdx)}
                                        disabled={loading === qIdx || isLocked}
                                    >
                                        <span className="mr-3 opacity-50 text-xs uppercase border border-current w-6 h-6 flex items-center justify-center rounded">
                                            {String.fromCharCode(65 + oIdx)}
                                        </span>
                                        {opt}
                                    </GameButton>
                                )
                            })}
                        </div>

                        {/* Feedback Area */}
                        {isAnsweredThisSession && (
                            <div className={`mt-6 ml-4 p-4 rounded border ${isCorrect ? "bg-green-900/10 border-green-900/30 text-green-400" : "bg-red-900/10 border-red-900/30 text-red-400"
                                }`}>
                                <div className="flex items-center gap-2 font-bold mb-1">
                                    {isCorrect ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                                    {isCorrect ? "CORRECT!" : "INCORRECT"}
                                </div>
                                {!isCorrect && (
                                    <p className="text-sm opacity-80">
                                        The correct answer is highlighted in green. Try the next question!
                                    </p>
                                )}
                                {isCorrect && previouslyAnswered && (
                                    <p className="text-xs opacity-70 mt-1">
                                        (Already completed previously - No XP awarded)
                                    </p>
                                )}
                                {isCorrect && !previouslyAnswered && (
                                    <p className="text-xs text-yellow-500 font-bold mt-1">
                                        +10 XP GAINED!
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
