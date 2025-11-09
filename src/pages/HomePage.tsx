import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Sparkles, TrendingUp, Zap, CheckCircle } from 'lucide-react';

export const HomePage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-50">
            {/* Hero Section */}
            <div className="container mx-auto px-4 py-16">
                <div className="text-center max-w-4xl mx-auto mb-16">
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                        Tailor Your Resume Based on Job Description to
                        <span className="text-primary-600"> Land Your Role</span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-8">
                        AI-powered resume analysis that matches your reference with job requirements.
                        Get actionable insights and boost your chances of getting hired.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/dashboard"
                            className="btn-primary text-lg px-8 py-4 inline-block"
                        >
                            Get Started Free
                        </Link>
                        <Link
                            to="/pricing"
                            className="btn-secondary text-lg px-8 py-4 inline-block"
                        >
                            View Pricing
                        </Link>
                    </div>
                </div>

                {/* Features Section */}
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    <FeatureCard
                        icon={<FileText className="w-12 h-12" />}
                        title="Smart Resume Parsing"
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
                <div className="max-w-4xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                        How It Works
                    </h2>
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

                {/* Benefits Section */}
                <div className="card max-w-4xl mx-auto bg-gradient-to-r from-primary-600 to-blue-600 text-white">
                    <h2 className="text-3xl font-bold text-center mb-8">
                        Why Resumay Tailor Swift?
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <BenefitItem text="Do it lazily but swiftly" />
                        <BenefitItem text="Identify requirement before applying swiftly" />
                        <BenefitItem text="Track what needed swiftly" />
                        <BenefitItem text="AI-generated cover letter drafts swiftly" />
                    </div>
                </div>

                {/* CTA Section */}
                <div className="text-center mt-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Ready to Land Your Next Role?
                    </h2>
                    <p className="text-xl text-gray-600 mb-8">
                        Join thousands of job seekers who improved their resumes with AI.
                    </p>
                    <Link
                        to="/dashboard"
                        className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2"
                    >
                        <Zap className="w-5 h-5" />
                        Start Analyzing Now
                    </Link>
                </div>
            </div>
        </div>
    );
};

const FeatureCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    description: string;
}> = ({ icon, title, description }) => (
    <div className="card text-center hover:shadow-lg transition-shadow">
        <div className="text-primary-600 mb-4 flex justify-center">{icon}</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600">{description}</p>
    </div>
);

const StepCard: React.FC<{
    number: number;
    title: string;
    description: string;
}> = ({ number, title, description }) => (
    <div className="flex gap-4 items-start">
        <div className="flex-shrink-0 w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
            {number}
        </div>
        <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600">{description}</p>
        </div>
    </div>
);

const BenefitItem: React.FC<{ text: string }> = ({ text }) => (
    <div className="flex items-center gap-3">
        <CheckCircle className="w-6 h-6 flex-shrink-0" />
        <span className="text-lg">{text}</span>
    </div>
);
