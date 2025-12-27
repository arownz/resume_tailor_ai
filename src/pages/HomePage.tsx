import React from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, FileText, Sparkles, TrendingUp } from 'lucide-react';

export const HomePage: React.FC = () => {
    return (
        <div className="min-h-screen w-full">
            {/* Hero Section */}
            <div className="w-full px-6 lg:px-12 xl:px-20 py-24">
                <div className="text-center mb-24">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                        <span className="bg-linear-to-r from-gray-900 via-rose-800 to-pink-800 bg-clip-text text-transparent">
                            Tailor Your Resume
                        </span>
                        <br />
                        <span className="text-primary-600">Land Your Role</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-700 mb-12 leading-relaxed">
                        AI-powered resume analysis that reference your profile with job requirements.
                        <br />
                        Get actionable insights and boost your chances of getting hired!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/dashboard"
                            className="btn-primary btn-lg inline-flex items-center gap-2 shadow-xl hover:shadow-2xl"

                        >
                            <Sparkles className="w-4 h-4" />
                            Tailor Your Resume
                        </Link>
                        <Link
                            to="/pricing"
                            className="btn-secondary btn-lg inline-flex items-center gap-2 shadow-lg hover:shadow-2xl"
                        >
                            <DollarSign className="w-5 h-5" />
                            View Pricing
                        </Link>
                    </div>
                </div>

                {/* Features Section */}
                <div className="grid md:grid-cols-3 gap-8 mb-20 px-4">
                    <FeatureCard
                        icon={<FileText className="w-12 h-12" />}
                        title="Resume Parsing"
                        description="Upload your resume in PDF, DOCX, or TXT format. Our AI extracts and analyzes all key information automatically."
                    />
                    <FeatureCard
                        icon={<Sparkles className="w-12 h-12" />}
                        title="AI-Powered Matching"
                        description="Advanced algorithms compare your resume against job descriptions to identify matches and gaps."
                    />
                    <FeatureCard
                        icon={<TrendingUp className="w-12 h-12" />}
                        title="Actionable Insights"
                        description="Get specific recommendations on how to improve your resume for each position you apply to."
                    />
                </div>

                {/* How It Works */}
                <div className="mb-20 px-4">
                    <h2 className="text-4xl font-bold text-center mb-4">
                        <span className="bg-linear-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                            How It Works?
                        </span>
                    </h2>
                    <p className="text-center text-gray-600 text-lg mb-16">
                        Four simple steps to transform your resume
                    </p>
                    <div className="space-y-8">
                        <StepCard
                            number={1}
                            title="Upload Your Resume"
                            description="Simply drag and drop your resume or browse to upload. We support multiple formats."
                        />
                        <StepCard
                            number={2}
                            title="Paste Job Description"
                            description="Copy and paste the job description from the listing you're interested in."
                        />
                        <StepCard
                            number={3}
                            title="Get Instant Analysis"
                            description="Receive a detailed match score, skill comparison, and personalized suggestions."
                        />
                        <StepCard
                            number={4}
                            title="Tailor & Apply"
                            description="Use our recommendations to customize your resume and increase your chances."
                        />
                    </div>
                </div>

                {/* CTA Section */}
                <div className="text-center section-spacing bg-linear-to-r from-rose-100 via-pink-100 to-rose-100 rounded-3xl p-16 border-2 border-rose-300 shadow-2xl mx-4">
                    <div className="mb-6">
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        <span className="bg-linear-to-r from-rose-700 to-pink-700 bg-clip-text text-transparent">
                            Ready to Land Your Next Role?
                        </span>
                    </h2>
                    <p className="text-xl text-gray-700 mb-12 max-w-2xl mx-auto leading-relaxed">
                        <br />
                        <span className="font-semibold text-rose-600">Join thousands of job seekers who improved their resumes with AI.</span>
                    </p>
                    <Link
                        to="/dashboard"
                        className="btn-primary btn-lg inline-flex items-center gap-2 shadow-2xl text-xl"
                    >
                        <Sparkles className="w-4 h-4" />Start Analyzing Now
                    </Link>
                </div>
            </div>
        </div>
    );
};

const FeatureCard: React.FC<{
    icon: React.ReactNode;
    emoji?: string;
    title: string;
    description: string;
}> = ({ icon, emoji, title, description }) => (
    <div className="card text-center transition-all bg-linear-to-br from-white to-rose-50 border-2 border-rose-100 hover:border-rose-300 hover:shadow-2xl">
        <div className="relative mb-6">
            <div className="text-primary-600 flex justify-center">{icon}</div>
            {emoji && (
                <div className="absolute -top-2 -right-2 text-4xl">
                    {emoji}
                </div>
            )}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
        <p className="text-gray-700 leading-relaxed">{description}</p>
    </div>
);

const StepCard: React.FC<{
    number: number;
    title: string;
    description: string;
}> = ({ number, title, description }) => (
    <div className="flex gap-6 items-start p-6 rounded-2xl bg-linear-to-br from-white to-rose-50 border-2 border-rose-200 hover:border-rose-400 transition-all hover:shadow-xl">
        <div className="shrink-0 w-16 h-16 bg-linear-to-br from-rose-500 to-pink-500 text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg">
            {number}
        </div>
        <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
            <p className="text-gray-700 text-lg leading-relaxed">{description}</p>
        </div>
    </div>
);