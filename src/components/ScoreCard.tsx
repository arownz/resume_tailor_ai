import React from 'react';

interface ScoreCardProps {
    score: number;
    title?: string;
    subtitle?: string;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({
    score,
    title = 'Match Score',
    subtitle = 'Overall compatibility with job requirements',
}) => {
    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreBackground = (score: number) => {
        if (score >= 80) return 'bg-green-50 border-green-200';
        if (score >= 60) return 'bg-yellow-50 border-yellow-200';
        return 'bg-red-50 border-red-200';
    };

    const getScoreGradient = (score: number) => {
        if (score >= 80) return 'from-green-500 to-green-600';
        if (score >= 60) return 'from-yellow-500 to-yellow-600';
        return 'from-red-500 to-red-600';
    };

    return (
        <div className={`card border-2 ${getScoreBackground(score)}`}>
            <div className="text-center space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>

                <div className="relative w-40 h-40 mx-auto">
                    {/* Background circle */}
                    <svg className="w-full h-full transform -rotate-90">
                        <circle
                            cx="80"
                            cy="80"
                            r="70"
                            stroke="currentColor"
                            strokeWidth="10"
                            fill="none"
                            className="text-gray-200"
                        />
                        {/* Progress circle */}
                        <circle
                            cx="80"
                            cy="80"
                            r="70"
                            stroke="url(#gradient)"
                            strokeWidth="10"
                            fill="none"
                            strokeDasharray={`${(score / 100) * 440} 440`}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out"
                        />
                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" className={`${getScoreGradient(score).split(' ')[0].replace('from-', '')}`} />
                                <stop offset="100%" className={`${getScoreGradient(score).split(' ')[1].replace('to-', '')}`} />
                            </linearGradient>
                        </defs>
                    </svg>

                    {/* Score text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-5xl font-bold ${getScoreColor(score)}`}>
                            {score}
                        </span>
                        <span className="text-gray-600 text-sm">out of 100</span>
                    </div>
                </div>

                <p className="text-sm text-gray-600">{subtitle}</p>
            </div>
        </div>
    );
};
