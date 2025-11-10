import React, { useState } from 'react';
import type { JobDescription } from '../types/models';
import { Briefcase } from 'lucide-react';

interface JobDescriptionFormProps {
    onSubmit: (jobDescription: JobDescription) => void;
    disabled?: boolean;
}

export const JobDescriptionForm: React.FC<JobDescriptionFormProps> = ({
    onSubmit,
    disabled = false,
}) => {
    const [formData, setFormData] = useState<JobDescription>({
        title: '',
        company: '',
        responsibilities: [],
        qualifications: [],
        keywords: [],
        rawText: '',
    });

    const [responsibilitiesText, setResponsibilitiesText] = useState('');
    const [qualificationsText, setQualificationsText] = useState('');
    const [keywordsText, setKeywordsText] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const jobDescription: JobDescription = {
            ...formData,
            responsibilities: responsibilitiesText
                .split('\n')
                .filter(line => line.trim()),
            qualifications: qualificationsText
                .split('\n')
                .filter(line => line.trim()),
            keywords: keywordsText
                .split(',')
                .map(k => k.trim())
                .filter(k => k),
        };

        onSubmit(jobDescription);
    };

    return (
        <form onSubmit={handleSubmit} className="card space-y-6">
            <div className="flex items-center gap-3 mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Job Description</h2>
            </div>

            {/* Job Title */}
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title *
                </label>
                <input
                    type="text"
                    id="title"
                    required
                    disabled={disabled}
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="input-field"
                    placeholder="e.g., Senior Software Engineer"
                />
            </div>

            {/* Company */}
            <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                    Company (Optional)
                </label>
                <input
                    type="text"
                    id="company"
                    disabled={disabled}
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="input-field"
                    placeholder="e.g., Tech Corp"
                />
            </div>

            {/* Responsibilities */}
            <div>
                <label htmlFor="responsibilities" className="block text-sm font-medium text-gray-700 mb-2">
                    Key Responsibilities * <span className="text-gray-500">(one per line)</span>
                </label>
                <textarea
                    id="responsibilities"
                    required
                    disabled={disabled}
                    rows={5}
                    value={responsibilitiesText}
                    onChange={(e) => setResponsibilitiesText(e.target.value)}
                    className="input-field"
                    placeholder="Design and implement scalable web applications&#10;Lead technical discussions and code reviews&#10;Mentor junior developers"
                />
            </div>

            {/* Qualifications */}
            <div>
                <label htmlFor="qualifications" className="block text-sm font-medium text-gray-700 mb-2">
                    Required Qualifications * <span className="text-gray-500">(one per line)</span>
                </label>
                <textarea
                    id="qualifications"
                    required
                    disabled={disabled}
                    rows={5}
                    value={qualificationsText}
                    onChange={(e) => setQualificationsText(e.target.value)}
                    className="input-field"
                    placeholder="5+ years of experience with React&#10;Strong knowledge of TypeScript&#10;Experience with cloud platforms (AWS/Azure)"
                />
            </div>

            {/* Keywords */}
            <div>
                <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 mb-2">
                    Keywords <span className="text-gray-500">(comma-separated)</span>
                </label>
                <input
                    type="text"
                    id="keywords"
                    disabled={disabled}
                    value={keywordsText}
                    onChange={(e) => setKeywordsText(e.target.value)}
                    className="input-field"
                    placeholder="React, TypeScript, AWS, Agile, REST API"
                />
            </div>

            {/* Raw Text (Optional) */}
            <div>
                <label htmlFor="rawText" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Job Description <span className="text-gray-500">(optional)</span>
                </label>
                <textarea
                    id="rawText"
                    disabled={disabled}
                    rows={6}
                    value={formData.rawText}
                    onChange={(e) => setFormData({ ...formData, rawText: e.target.value })}
                    className="input-field"
                    placeholder="Paste the complete job description here for more accurate analysis..."
                />
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={disabled}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {disabled ? 'Upload Your Resume' : 'Analyze Resume Match'}
            </button>
        </form>
    );
};
