import React from 'react';
import type { TailoredOutput } from '../types/models';
import { CheckCircle, XCircle, Lightbulb, TrendingUp } from 'lucide-react';

interface AnalysisResultsProps {
    results: TailoredOutput;
    resumeName?: string;
    jobTitle?: string;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({
    results,
    resumeName,
    jobTitle,
}) => {
    return (
        <div className="space-y-6">
            {/* Header */}
            {(resumeName || jobTitle) && (
                <div className="card bg-linear-to-r from-primary-50 to-blue-50 border border-primary-200">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Analysis Results
                    </h2>
                    {resumeName && (
                        <p className="text-sm text-gray-600">Resume: {resumeName}</p>
                    )}
                    {jobTitle && (
                        <p className="text-sm text-gray-600">Position: {jobTitle}</p>
                    )}
                </div>
            )}

            {/* Matched Skills */}
            {results.matchedSkills.length > 0 && (
                <div className="card border-l-4 border-green-500">
                    <div className="flex items-start gap-3">
                        <CheckCircle className="w-6 h-6 text-green-600 shrink-0 mt-1" />
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                Matched Skills ({results.matchedSkills.length})
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {results.matchedSkills.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Missing Skills */}
            {results.missingSkills.length > 0 && (
                <div className="card border-l-4 border-red-500">
                    <div className="flex items-start gap-3">
                        <XCircle className="w-6 h-6 text-red-600 shrink-0 mt-1" />
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                Missing Skills ({results.missingSkills.length})
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {results.missingSkills.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                            <p className="mt-3 text-sm text-gray-600">
                                Consider adding these skills to your resume if you have experience with them.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Recommendations */}
            {results.recommendations && results.recommendations.length > 0 && (
                <div className="card border-l-4 border-blue-500">
                    <div className="flex items-start gap-3">
                        <TrendingUp className="w-6 h-6 text-blue-600 shrink-0 mt-1" />
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                Recommendations
                            </h3>
                            <ul className="space-y-2">
                                {results.recommendations.map((recommendation, index) => (
                                    <li key={index} className="flex items-start gap-2 text-gray-700">
                                        <span className="text-blue-600 mt-1">•</span>
                                        <span>{recommendation}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* Suggested Edits */}
            {results.suggestedEdits.length > 0 && (
                <div className="card border-l-4 border-yellow-500">
                    <div className="flex items-start gap-3">
                        <Lightbulb className="w-6 h-6 text-yellow-600 shrink-0 mt-1" />
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                Suggested Improvements
                            </h3>
                            <ul className="space-y-3">
                                {results.suggestedEdits.map((edit, index) => (
                                    <li key={index} className="p-3 bg-yellow-50 rounded-lg text-gray-700">
                                        {edit}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* Cover Letter Draft */}
            {results.coverLetterDraft && (
                <div className="card border-l-4 border-purple-500">
                    <div className="flex items-start gap-3">
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                Cover Letter Draft
                            </h3>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-gray-700 whitespace-pre-wrap">
                                    {results.coverLetterDraft}
                                </p>
                            </div>
                            <p className="mt-2 text-xs text-gray-500">
                                This is an AI-generated draft. Please review and customize it before use.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
