import React from 'react';
import { Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PricingPage: React.FC = () => {
    return (
        <div className="min-h-screen w-full py-16">
            <div className="w-full px-6 lg:px-12 xl:px-20">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold text-gray-900 mb-4">
                        Transparent Pricing
                    </h1>
                    <p className="text-xl text-gray-600">
                        Choose the plan that works best for your job search
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    {/* Free Plan */}
                    <div className="card border-2 border-gray-200 hover:border-primary-300 transition-all">
                        <div className="text-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
                            <div className="mb-4">
                                <span className="text-4xl font-bold text-gray-900">$0</span>
                                <span className="text-gray-600">/month</span>
                            </div>
                            <p className="text-gray-600">Perfect for trying out the service</p>
                        </div>

                        <ul className="space-y-3 mb-8">
                            <Feature included text="5 resume analyses per month" />
                            <Feature included text="Basic skill matching" />
                            <Feature included text="Match score calculation" />
                            <Feature included text="Suggested improvements" />
                            <Feature text="AI cover letter generation" />
                            <Feature text="Analysis history" />
                            <Feature text="Priority support" />
                        </ul>

                        <Link
                            to="/dashboard"
                            className="btn-secondary w-full text-center block"
                        >
                            Resume Tailor
                        </Link>
                    </div>

                    {/* Pro Plan */}
                    <div className="card border-2 border-primary-500 hover:border-primary-600 transition-all relative">

                        <div className="text-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro</h3>
                            <div className="mb-4">
                                <span className="text-4xl font-bold text-gray-900">$19</span>
                                <span className="text-gray-600">/month</span>
                            </div>
                            <p className="text-gray-600">For active job seekers</p>
                        </div>

                        <ul className="space-y-3 mb-8">
                            <Feature included text="50 resume analyses per month" />
                            <Feature included text="Advanced AI matching" />
                            <Feature included text="Detailed skill gap analysis" />
                            <Feature included text="Personalized recommendations" />
                            <Feature included text="AI cover letter generation" />
                            <Feature included text="Analysis history (30 days)" />
                            <Feature included text="Email support" />
                        </ul>

                        <button className="btn-primary w-full cursor-pointer">
                            Upgrade to Pro
                        </button>
                    </div>

                    {/* Premium Plan */}
                    <div className="card border-2 border-gray-200 hover:border-primary-300 transition-all">
                        <div className="text-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium</h3>
                            <div className="mb-4">
                                <span className="text-4xl font-bold text-gray-900">$49</span>
                                <span className="text-gray-600">/month</span>
                            </div>
                            <p className="text-gray-600">For serious professionals</p>
                        </div>

                        <ul className="space-y-3 mb-8">
                            <Feature included text="Unlimited analyses" />
                            <Feature included text="Advanced AI with custom models" />
                            <Feature included text="In-depth skill & experience analysis" />
                            <Feature included text="Industry-specific recommendations" />
                            <Feature included text="Unlimited AI cover letters" />
                            <Feature included text="Full analysis history" />
                            <Feature included text="Priority support & consultation" />
                        </ul>

                        <button className="btn-primary w-full cursor-pointer">
                            Upgrade to Premium
                        </button>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-6">
                        <FAQItem
                            question="Can I cancel my subscription anytime?"
                            answer="Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period."
                        />
                        <FAQItem
                            question="What payment methods do you accept?"
                            answer="We accept PayPal."
                        />
                        <FAQItem
                            question="Is my data secure?"
                            answer="Nah, this still in beta."
                        />
                        <FAQItem
                            question="Can I upgrade or downgrade my plan?"
                            answer="Yes, you can change your plan at any time. Changes take effect immediately, and we'll prorate any charges."
                        />
                        <FAQItem
                            question="Do you offer refunds?"
                            answer="We offer a 14-day money-back guarantee for all paid plans. If you're not satisfied, contact us for a full refund."
                        />
                    </div>
                </div>

                {/* CTA Section */}
                <div className="card bg-linear-to-r from-primary-600 to-rose-600 text-white text-center mt-16">
                    <h2 className="text-3xl font-bold mb-4">
                        Ready to Boost Your Job Search?
                    </h2>
                    <p className="text-xl mb-6 opacity-90">
                        Start analyzing your resume today and land more interviews
                    </p>
                    <Link
                        to="/dashboard"
                        className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors inline-block"
                    >
                        Try It Free Now
                    </Link>
                </div>
            </div>
        </div>
    );
};

const Feature: React.FC<{ included?: boolean; text: string }> = ({
    included = false,
    text,
}) => (
    <li className="flex items-start gap-2">
        {included ? (
            <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
        ) : (
            <X className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
        )}
        <span className={included ? 'text-gray-700' : 'text-gray-400'}>{text}</span>
    </li>
);

const FAQItem: React.FC<{ question: string; answer: string }> = ({
    question,
    answer,
}) => (
    <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{question}</h3>
        <p className="text-gray-600">{answer}</p>
    </div>
);
