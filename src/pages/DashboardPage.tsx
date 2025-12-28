import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileUpload } from '../components/FileUpload';
import { JobDescriptionForm } from '../components/JobDescriptionForm';
import { AnalysisResults } from '../components/AnalysisResults';
import { ScoreCard } from '../components/ScoreCard';
import { ResumeEditor } from '../components/ResumeEditor';
import { ResumeParser } from '../utils/resumeParser';
import { TailoringService } from '../services/tailoring.service';
import { PDFService, THEME_COLORS, type ThemeColor } from '../services/pdf.service';
import { DocxService } from '../services/docx.service';
import { useAuth } from '../contexts/AuthContext';
import type { Resume, JobDescription, TailoredOutput } from '../types/models';
import { Loader2, AlertCircle, Download, FileText, Edit3, Sparkles, Lock, FileType } from 'lucide-react';

type ViewMode = 'analysis' | 'editor' | 'preview';

export const DashboardPage: React.FC = () => {
    const navigate = useNavigate();
    const { user, canAnalyze, guestUsageCount, guestUsageLimit, incrementGuestUsage } = useAuth();
    
    const [resume, setResume] = useState<Resume | null>(null);
    const [originalResume, setOriginalResume] = useState<Resume | null>(null);
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [analysisResults, setAnalysisResults] = useState<TailoredOutput | null>(null);
    const [modifiedResumePdf, setModifiedResumePdf] = useState<Blob | null>(null);
    const [jobDescription, setJobDescription] = useState<JobDescription | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<ViewMode>('analysis');
    const [themeColor, setThemeColor] = useState<ThemeColor>(THEME_COLORS[0]);

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
            console.log('[DashboardPage] Extracted text length:', text.length);
            console.log('[DashboardPage] First 500 chars:', text.substring(0, 500));

            // If the user cancelled while parsing, ignore the result
            if (processIdRef.current !== myProcessId) return;

            // Use AI-enhanced extraction for better results with formatted resumes
            const extractedData = await ResumeParser.extractStructuredDataWithAI(text);
            console.log('[DashboardPage] Extracted data:', extractedData);

            if (!ResumeParser.validateResume(extractedData)) {
                console.warn('[DashboardPage] Validation failed, extracted data:', extractedData);
                throw new Error('Unable to extract valid resume data. Please check your file format.');
            }

            // Ensure still the active process
            if (processIdRef.current === myProcessId) {
                const resumeData = extractedData as Resume;
                setResume(resumeData);
                setOriginalResume(JSON.parse(JSON.stringify(resumeData)));
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
        setOriginalResume(null);
        setResumeFile(null);
        setAnalysisResults(null);
        setError(null);
        setViewMode('analysis');
    };

    const handleJobDescriptionSubmit = async (jobDesc: JobDescription) => {
        if (!resume) {
            setError('Please upload a resume first');
            return;
        }

        // Check guest usage limit
        if (!canAnalyze) {
            setError(`You've reached the free limit of ${guestUsageLimit} analyses. Please sign in for unlimited access.`);
            return;
        }

        setIsProcessing(true);
        setError(null);

        try {
            // Analyze resume against job description
            const results = await TailoringService.analyzeResume(resume, jobDesc);
            setAnalysisResults(results);
            setJobDescription(jobDesc);

            // Increment guest usage after successful analysis
            incrementGuestUsage();

            // Update resume with tailored version if available
            if (results.tailoredResume) {
                setResume(results.tailoredResume);
            }

            // Generate modified resume PDF
            const pdfBlob = await PDFService.generateModifiedResume(
                results.tailoredResume || resume, 
                results,
                themeColor
            );
            setModifiedResumePdf(pdfBlob);

            // Scroll to results
            setTimeout(() => {
                document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to analyze resume');
            setAnalysisResults(null);
            setModifiedResumePdf(null);
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
                        <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-red-900">Error</h3>
                            <p className="text-red-700">{error}</p>
                            {!canAnalyze && !user && (
                                <button
                                    onClick={() => navigate('/auth')}
                                    className="mt-2 btn-primary text-sm"
                                >
                                    Sign In Now
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Guest Usage Banner */}
                {!user && (
                    <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
                        <Lock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-amber-900">Guest Mode</h3>
                                <span className="text-sm font-medium text-amber-700">
                                    {guestUsageCount} / {guestUsageLimit} free analyses used
                                </span>
                            </div>
                            <p className="text-amber-700 text-sm mt-1">
                                {canAnalyze 
                                    ? `You have ${guestUsageLimit - guestUsageCount} free ${guestUsageLimit - guestUsageCount === 1 ? 'analysis' : 'analyses'} remaining. Sign in for unlimited access.`
                                    : 'You\'ve used all free analyses. Sign in to continue using Resume Tailor AI.'
                                }
                            </p>
                            {!canAnalyze && (
                                <button
                                    onClick={() => navigate('/auth')}
                                    className="mt-2 btn-primary text-sm"
                                >
                                    Sign In for Unlimited Access
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-2 gap-8 mb-8">
                    {/* Left Column - Resume Upload */}
                    <div className="space-y-6">
                        <div className="card">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                Step 1: Upload Resume/CV
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

                        {/* View Mode Toggle */}
                        <div className="flex justify-center">
                            <div className="inline-flex rounded-lg bg-gray-100 p-1">
                                <button
                                    onClick={() => setViewMode('analysis')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                        viewMode === 'analysis'
                                            ? 'bg-white text-rose-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    <Sparkles className="w-4 h-4" />
                                    Analysis
                                </button>
                                <button
                                    onClick={() => setViewMode('editor')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                        viewMode === 'editor'
                                            ? 'bg-white text-rose-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    <Edit3 className="w-4 h-4" />
                                    Edit Resume
                                </button>
                            </div>
                        </div>

                        {/* Analysis View */}
                        {viewMode === 'analysis' && (
                            <AnalysisResults
                                results={analysisResults}
                                resumeName={resumeFile?.name}
                            />
                        )}

                        {/* Editor View */}
                        {viewMode === 'editor' && resume && (
                            <ResumeEditor
                                resume={resume}
                                tailoredResume={analysisResults.tailoredResume}
                                onChange={(updatedResume) => {
                                    setResume(updatedResume);
                                    // Regenerate PDF when resume is edited
                                    PDFService.generateModifiedResume(updatedResume, analysisResults, themeColor)
                                        .then(setModifiedResumePdf)
                                        .catch(console.error);
                                }}
                                onRevert={() => {
                                    if (originalResume) {
                                        setResume(JSON.parse(JSON.stringify(originalResume)));
                                    }
                                }}
                                isModified={!!analysisResults.tailoredResume}
                                themeColor={themeColor}
                                onThemeChange={(newTheme) => {
                                    setThemeColor(newTheme);
                                    // Regenerate PDF with new theme
                                    if (resume && analysisResults) {
                                        PDFService.generateModifiedResume(resume, analysisResults, newTheme)
                                            .then(setModifiedResumePdf)
                                            .catch(console.error);
                                    }
                                }}
                            />
                        )}

                        {/* Action Buttons */}
                        <div className="card">
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={() => {
                                        setAnalysisResults(null);
                                        setResume(null);
                                        setOriginalResume(null);
                                        setResumeFile(null);
                                        setModifiedResumePdf(null);
                                        setJobDescription(null);
                                        setViewMode('analysis');
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className="btn-secondary cursor-pointer"
                                >
                                    Analyze Another Resume
                                </button>

                                {/* Download Modified Resume PDF */}
                                {modifiedResumePdf && (
                                    <button
                                        onClick={() => {
                                            PDFService.downloadPDF(
                                                modifiedResumePdf,
                                                `tailored-resume-${Date.now()}.pdf`
                                            );
                                        }}
                                        className="btn-primary flex items-center gap-2 justify-center cursor-pointer"
                                    >
                                        <Download className="w-4 h-4 " />
                                        Download PDF
                                    </button>
                                )}

                                {/* Download as DOCX (Editable Word Document) */}
                                {resume && (
                                    <button
                                        onClick={async () => {
                                            try {
                                                const themeHex = themeColor.name === 'None' 
                                                    ? '000000' 
                                                    : themeColor.primary.map(c => c.toString(16).padStart(2, '0')).join('');
                                                const docxBlob = await DocxService.generateResume(resume, themeHex);
                                                DocxService.downloadDocx(
                                                    docxBlob,
                                                    `tailored-resume-${Date.now()}.docx`
                                                );
                                            } catch (err) {
                                                setError(err instanceof Error ? err.message : 'Failed to generate DOCX');
                                            }
                                        }}
                                        className="btn-secondary flex items-center gap-2 justify-center cursor-pointer"
                                    >
                                        <FileType className="w-4 h-4" />
                                        Download DOCX
                                    </button>
                                )}

                                {/* Download Analysis Report */}
                                {resume && jobDescription && (
                                    <button
                                        onClick={async () => {
                                            try {
                                                const reportBlob = await PDFService.generateComparisonPDF(
                                                    resume,
                                                    analysisResults!,
                                                    {
                                                        title: jobDescription.title,
                                                        company: jobDescription.company || 'N/A'
                                                    }
                                                );
                                                PDFService.downloadPDF(
                                                    reportBlob,
                                                    `analysis-report-${Date.now()}.pdf`
                                                );
                                            } catch (err) {
                                                setError(err instanceof Error ? err.message : 'Failed to generate report');
                                            }
                                        }}
                                        className="btn-secondary flex items-center gap-2 justify-center cursor-pointer"
                                    >
                                        <FileText className="w-4 h-4" />
                                        Download Analysis Report
                                    </button>
                                )}
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
