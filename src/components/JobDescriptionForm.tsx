import React, { useState } from 'react';
import type { JobDescription } from '../types/models';

interface JobDescriptionFormProps {
    onSubmit: (jobDescription: JobDescription) => void;
    disabled?: boolean;
}

// Rich text area component with line-by-line formatting
const RichTextArea: React.FC<{
    id: string;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    rows?: number;
    disabled?: boolean;
    required?: boolean;
    hint?: string;
}> = ({ id, value, onChange, placeholder, rows = 5, disabled, required, hint }) => {
    const lines = value.split('\n').filter(l => l.trim());
    
    return (
        <div className="space-y-2">
            <div className="relative">
                <textarea
                    id={id}
                    required={required}
                    disabled={disabled}
                    rows={rows}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="input-field font-mono text-sm pl-10 leading-relaxed"
                    placeholder={placeholder}
                />
            </div>
            {hint && (
                <p className="text-xs text-gray-500 flex items-center gap-1">
                    {hint}
                </p>
            )}
            {lines.length > 0 && (
                <div className="text-xs text-rose-600 font-medium">
                    {lines.length} item{lines.length !== 1 ? 's' : ''} entered
                </div>
            )}
        </div>
    );
};

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
                    Key Responsibilities *
                </label>
                <RichTextArea
                    id="responsibilities"
                    required
                    disabled={disabled}
                    rows={5}
                    value={responsibilitiesText}
                    onChange={setResponsibilitiesText}
                    hint="Enter one responsibility per line. Press Enter to add a new item."
                    placeholder="Design and implement scalable web applications&#10;Lead technical discussions and code reviews&#10;Mentor junior developers"
                />
            </div>

            {/* Qualifications */}
            <div>
                <label htmlFor="qualifications" className="block text-sm font-medium text-gray-700 mb-2">
                    Required Qualifications *
                </label>
                <RichTextArea
                    id="qualifications"
                    required
                    disabled={disabled}
                    rows={5}
                    value={qualificationsText}
                    onChange={setQualificationsText}
                    hint="Enter one qualification per line. Press Enter to add a new item."
                    placeholder="5+ years of experience with React&#10;Strong knowledge of TypeScript&#10;Experience with cloud platforms (AWS/Azure)"
                />
            </div>

            {/* Keywords */}
            <div>
                <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 mb-2">
                    Keywords
                </label>
                <div className="relative">
                    <input
                        type="text"
                        id="keywords"
                        disabled={disabled}
                        value={keywordsText}
                        onChange={(e) => setKeywordsText(e.target.value)}
                        className="input-field pl-10"
                        placeholder="React, TypeScript, AWS, Agile, REST API"
                    />
                    
                </div>
                <p className="text-xs text-gray-500 mt-1">Separate keywords with commas</p>
                {keywordsText && (
                    <div className="flex flex-wrap gap-1 mt-2">
                        {keywordsText.split(',').filter(k => k.trim()).map((keyword, i) => (
                            <span key={i} className="px-2 py-0.5 bg-rose-100 text-rose-700 text-xs rounded-full">
                                {keyword.trim()}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Raw Text (Optional) */}
            <div>
                <label htmlFor="rawText" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Job Description <span className="text-gray-500">(optional)</span>
                </label>
                <div className="relative">
                    <textarea
                        id="rawText"
                        disabled={disabled}
                        rows={6}
                        value={formData.rawText}
                        onChange={(e) => setFormData({ ...formData, rawText: e.target.value })}
                        className="input-field pl-10"
                        placeholder="Paste the complete job description here for more accurate analysis..."
                    />
                    <div className="absolute left-3 top-3 text-rose-400">
                    </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Paste the full job posting for AI to extract additional context</p>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={disabled}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
                {disabled ? 'Upload Your Resume' : 'Analyze Resume Match'}
            </button>
        </form>
    );
};
