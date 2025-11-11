import React, { useState, useRef } from 'react';
import { FileUpload } from '../components/FileUpload';
import { JobDescriptionForm } from '../components/JobDescriptionForm';
import { AnalysisResults } from '../components/AnalysisResults';
import { ScoreCard } from '../components/ScoreCard';
import { ResumeParser } from '../utils/resumeParser';
import { TailoringService } from '../services/tailoring.service';
import type { Resume, JobDescription, TailoredOutput } from '../types/models';
import { Loader2, AlertCircle } from 'lucide-react';

export const DashboardPage: React.FC = () => {
    const [resume, setResume] = useState<Resume | null>(null);
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [analysisResults, setAnalysisResults] = useState<TailoredOutput | null>(null);
    const [error, setError] = useState<string | null>(null);

    // use a process id to ignore results from stale/aborted operations
    const processIdRef = useRef(0);

    const handleFileSelect = async (file: File) => {
        const myProcessId = ++processIdRef.current;
        setResumeFile(file);
        setError(null);
        setIsProcessing(true);

        try {
            // Parse the resume file
            const text = await ResumeParser.parseFile(file);

            // If the user cancelled while parsing, ignore the result
            if (processIdRef.current !== myProcessId) return;

            const extractedData = ResumeParser.extractStructuredData(text);

            if (!ResumeParser.validateResume(extractedData)) {
                throw new Error('Unable to extract valid resume data. Please check your file.');
            }

            // Ensure still the active process
            if (processIdRef.current === myProcessId) {
                setResume(extractedData as Resume);
            }
        } catch (err) {
            // If this process was cancelled, do not override outer state
            if (processIdRef.current !== myProcessId) return;

            setError(err instanceof Error ? err.message : 'Failed to process resume');
            setResume(null);
        } finally {
            // Only clear processing if this is still the active process
            if (processIdRef.current === myProcessId) {
                setIsProcessing(false);
            }
        }
    };

    const handleCancel = () => {
        // Invalidate any ongoing parse/analyze processes and clear UI state
        processIdRef.current += 1; // bump to invalidate
        setIsProcessing(false);
        setResume(null);
        setResumeFile(null);
        setAnalysisResults(null);
        setError(null);
    };

    const handleJobDescriptionSubmit = async (jobDescription: JobDescription) => {
        if (!resume) {
            setError('Please upload a resume first');
            return;
        }

        setIsProcessing(true);
        setError(null);

        try {
            // Analyze resume against job description
            const results = await TailoringService.analyzeResume(resume, jobDescription);
            setAnalysisResults(results);

            // Scroll to results
            setTimeout(() => {
                document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to analyze resume');
            setAnalysisResults(null);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen w-full py-8">
            <div className="w-full px-6 lg:px-12 xl:px-20">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Resume Analysis
                    </h1>
                    <p className="text-gray-600">
                        Upload your resume and job description to get AI-powered insights
                    </p>
                </div>
                {/* Global player is mounted in App.tsx */}

                {/* Error Alert */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-red-900">Error</h3>
                            <p className="text-red-700">{error}</p>
                        </div>
                    </div>
                )}

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-2 gap-8 mb-8">
                    {/* Left Column - Resume Upload */}
                    <div className="space-y-6">
                        <div className="card">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                Step 1: Upload Resume
                            </h2>
                            <FileUpload
                                onFileSelect={handleFileSelect}
                                onCancel={handleCancel}
                                disabled={isProcessing}
                                label="Currently max 5 MB file."
                            />

                            {isProcessing && !analysisResults && (
                                <div className="mt-4 flex items-center gap-2 text-primary-600">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Processing your resume...</span>
                                </div>
                            )}

                            {resume && !isProcessing && (
                                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                                    <h3 className="font-semibold text-green-900 mb-2">
                                        Resume Processed Successfully
                                    </h3>
                                    <div className="text-sm text-green-700 space-y-1">
                                        <p>Name: {resume.name}</p>
                                        {resume.contact && <p>Contact: {resume.contact}</p>}
                                        <p>Skills: {resume.skills.length} found</p>
                                        <p>Experience: {resume.experience.length} entries</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Job Description */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Step 2: Enter Job Description
                        </h2>
                        <JobDescriptionForm
                            onSubmit={handleJobDescriptionSubmit}
                            disabled={!resume || isProcessing}
                        />

                        {isProcessing && analysisResults === null && resume && (
                            <div className="mt-4 flex items-center justify-center gap-2 text-primary-600">
                                <Loader2 className="w-6 h-6 animate-spin" />
                                <span>Analyzing your resume match...</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Analysis Results */}
                {analysisResults && (
                    <div id="results" className="space-y-8">
                        {/* Score Card */}
                        <div className="flex justify-center">
                            <div className="w-full max-w-md">
                                <ScoreCard score={analysisResults.score} />
                            </div>
                        </div>

                        {/* Detailed Results */}
                        <AnalysisResults
                            results={analysisResults}
                            resumeName={resumeFile?.name}
                        />

                        {/* Action Buttons */}
                        <div className="card">
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={() => {
                                        setAnalysisResults(null);
                                        setResume(null);
                                        setResumeFile(null);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className="btn-secondary"
                                >
                                    Analyze Another Resume
                                </button>
                                <button
                                    onClick={() => {
                                        const resultsText = JSON.stringify(analysisResults, null, 2);
                                        const blob = new Blob([resultsText], { type: 'application/json' });
                                        const url = URL.createObjectURL(blob);
                                        const a = document.createElement('a');
                                        a.href = url;
                                        a.download = `resume-analysis-${Date.now()}.json`;
                                        a.click();
                                    }}
                                    className="btn-primary"
                                >
                                    Download Results
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Help Section */}
                {!analysisResults && (
                    <div className="card bg-blue-50 border border-blue-200 mt-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                            Tips for Best Results
                        </h3>
                        <ul className="space-y-2 text-gray-700">
                            <li>• Ensure your resume is well-formatted and up-to-date</li>
                            <li>• Include all relevant skills, even if they seem basic</li>
                            <li>• Copy the complete job description for more accurate analysis</li>
                            <li>• List each responsibility and qualification on a separate line</li>
                            <li>• Use the keywords from the job posting in your inputs</li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};
