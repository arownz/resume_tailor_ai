import React, { useState, useCallback } from 'react';
import type { Resume, TailoredResume, ExperienceEntry, EducationEntry } from '../types/models';
import { THEME_COLORS, type ThemeColor } from '../services/pdf.service';
import { 
    User, 
    Mail, 
    Phone, 
    MapPin, 
    Briefcase, 
    GraduationCap, 
    Code, 
    FolderOpen, 
    Award,
    Edit3,
    Check,
    X,
    Plus,
    Trash2,
    Sparkles,
    RotateCcw,
    Palette
} from 'lucide-react';

interface ResumeEditorProps {
    resume: Resume;
    tailoredResume?: TailoredResume;
    onChange: (updatedResume: Resume) => void;
    onRevert?: () => void;
    isModified?: boolean;
    themeColor?: ThemeColor;
    onThemeChange?: (theme: ThemeColor) => void;
}

// Editable text field component
const EditableField: React.FC<{
    value: string;
    onChange: (value: string) => void;
    multiline?: boolean;
    placeholder?: string;
    className?: string;
    isHighlighted?: boolean;
}> = ({ value, onChange, multiline = false, placeholder, className = '', isHighlighted = false }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(value);

    const handleSave = () => {
        onChange(editValue);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditValue(value);
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !multiline) {
            e.preventDefault();
            handleSave();
        } else if (e.key === 'Enter' && multiline && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            handleSave();
        } else if (e.key === 'Escape') {
            handleCancel();
        }
    };

    if (isEditing) {
        return (
            <div className="flex items-start gap-2">
                {multiline ? (
                    <textarea
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 p-2 border border-rose-300 rounded-lg resize-none focus:ring-2 focus:ring-rose-400 focus:border-transparent"
                        rows={3}
                        autoFocus
                        placeholder="Press Ctrl+Enter to save"
                    />
                ) : (
                    <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 p-2 border border-rose-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-transparent"
                        autoFocus
                        placeholder="Press Enter to save"
                    />
                )}
                <button onClick={handleSave} className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="Save (Enter)">
                    <Check className="w-4 h-4" />
                </button>
                <button onClick={handleCancel} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Cancel (Esc)">
                    <X className="w-4 h-4" />
                </button>
            </div>
        );
    }

    return (
        <div
            onClick={() => setIsEditing(true)}
            className={`group cursor-pointer p-2 rounded-lg hover:bg-rose-50 transition-colors ${className} ${isHighlighted ? 'bg-green-50 border-l-4 border-green-400' : ''}`}
        >
            <span className={value ? '' : 'text-gray-400'}>{value || placeholder}</span>
            <Edit3 className="w-4 h-4 ml-2 text-gray-400 opacity-0 group-hover:opacity-100 inline transition-opacity" />
        </div>
    );
};

// Skills editor with add/remove capability
const SkillsEditor: React.FC<{
    skills: string[];
    matchedSkills?: string[];
    missingSkills?: string[];
    onChange: (skills: string[]) => void;
}> = ({ skills, matchedSkills = [], missingSkills = [], onChange }) => {
    const [newSkill, setNewSkill] = useState('');

    const addSkill = () => {
        if (newSkill.trim() && !skills.includes(newSkill.trim())) {
            onChange([...skills, newSkill.trim()]);
            setNewSkill('');
        }
    };

    const removeSkill = (skillToRemove: string) => {
        onChange(skills.filter(s => s !== skillToRemove));
    };

    const isMatched = (skill: string) => 
        matchedSkills.some(m => m.toLowerCase() === skill.toLowerCase());

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                    <span
                        key={index}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                            isMatched(skill)
                                ? 'bg-green-100 text-green-800 border border-green-300'
                                : 'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}
                    >
                        {skill}
                        <button
                            onClick={() => removeSkill(skill)}
                            className="ml-1 hover:text-red-600 transition-colors"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </span>
                ))}
            </div>
            
            {/* Add missing skills suggestions */}
            {missingSkills.length > 0 && (
                <div className="mt-4">
                    <p className="text-sm text-amber-700 font-medium mb-2">
                        <Sparkles className="w-4 h-4 inline mr-1" />
                        Suggested skills from job description:
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {missingSkills.slice(0, 8).map((skill, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    if (!skills.includes(skill)) {
                                        onChange([...skills, skill]);
                                    }
                                }}
                                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-colors"
                            >
                                <Plus className="w-3 h-3" />
                                {skill}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Add custom skill */}
            <div className="flex gap-2 mt-3">
                <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                    placeholder="Add a skill..."
                    className="flex-1 px-3 py-2 border border-rose-200 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-transparent"
                />
                <button
                    onClick={addSkill}
                    className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

// Experience entry editor
const ExperienceEditor: React.FC<{
    experience: ExperienceEntry;
    onChange: (updated: ExperienceEntry) => void;
    onDelete: () => void;
}> = ({ experience, onChange, onDelete }) => {
    return (
        <div className={`p-4 border rounded-lg ${experience.isModified ? 'border-green-300 bg-green-50/50' : 'border-rose-200'}`}>
            <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                    <EditableField
                        value={experience.title}
                        onChange={(title) => onChange({ ...experience, title, isModified: true })}
                        className="font-semibold text-lg"
                        placeholder="Job Title"
                    />
                    <div className="flex gap-4 text-sm text-gray-600">
                        <EditableField
                            value={experience.company || ''}
                            onChange={(company) => onChange({ ...experience, company, isModified: true })}
                            placeholder="Company Name"
                        />
                        <EditableField
                            value={experience.duration || ''}
                            onChange={(duration) => onChange({ ...experience, duration, isModified: true })}
                            placeholder="Duration"
                        />
                    </div>
                </div>
                <button
                    onClick={onDelete}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
            <EditableField
                value={experience.description}
                onChange={(description) => onChange({ ...experience, description, isModified: true })}
                multiline
                placeholder="Describe your responsibilities and achievements..."
                isHighlighted={experience.isModified}
            />
        </div>
    );
};

// Main Resume Editor Component
export const ResumeEditor: React.FC<ResumeEditorProps> = ({
    resume,
    tailoredResume,
    onChange,
    onRevert,
    isModified = false,
    themeColor,
    onThemeChange
}) => {
    const [activeSection, setActiveSection] = useState<string>('all');
    const [showColorPicker, setShowColorPicker] = useState(false);

    const currentTheme = themeColor || THEME_COLORS[0];

    const updateResume = useCallback((updates: Partial<Resume>) => {
        onChange({ ...resume, ...updates });
    }, [resume, onChange]);

    const addExperience = () => {
        const newExp: ExperienceEntry = {
            id: Math.random().toString(36).substring(2, 11),
            title: 'New Position',
            description: '',
            isModified: true
        };
        updateResume({ experience: [...resume.experience, newExp] });
    };

    const updateExperience = (index: number, updated: ExperienceEntry) => {
        const newExperience = [...resume.experience];
        newExperience[index] = updated;
        updateResume({ experience: newExperience });
    };

    const deleteExperience = (index: number) => {
        updateResume({ experience: resume.experience.filter((_, i) => i !== index) });
    };

    const addEducation = () => {
        const newEdu: EducationEntry = {
            id: Math.random().toString(36).substring(2, 11),
            degree: 'New Degree',
        };
        updateResume({ education: [...resume.education, newEdu] });
    };

    const modifications = tailoredResume?.modifications;

    // Get header style based on theme
    const getHeaderStyle = () => {
        if (currentTheme.name === 'None') {
            return { backgroundColor: '#f9fafb', color: '#111827' };
        }
        return {
            backgroundColor: `rgb(${currentTheme.primary[0]}, ${currentTheme.primary[1]}, ${currentTheme.primary[2]})`,
            color: `rgb(${currentTheme.text[0]}, ${currentTheme.text[1]}, ${currentTheme.text[2]})`
        };
    };

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Editor Header */}
            <div className="p-4" style={getHeaderStyle()}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Edit3 className="w-6 h-6" />
                        <div>
                            <h2 className="text-xl font-bold">Resume Editor</h2>
                            <p className="text-sm opacity-80">
                                {isModified ? 'AI-tailored • Click any field to edit' : 'Click any field to edit'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Theme Color Picker */}
                        <div className="relative">
                            <button
                                onClick={() => setShowColorPicker(!showColorPicker)}
                                className="flex items-center gap-2 px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                                title="Change theme color"
                            >
                                <Palette className="w-4 h-4" />
                                <span className="text-sm hidden sm:inline">Theme</span>
                            </button>
                            {showColorPicker && (
                                <div className="absolute right-0 top-full mt-2 p-3 bg-white rounded-lg shadow-xl border border-gray-200 z-50 min-w-[200px]">
                                    <p className="text-xs text-gray-500 mb-2 font-medium">Select Theme Color</p>
                                    <div className="grid grid-cols-4 gap-2">
                                        {THEME_COLORS.map((color) => (
                                            <button
                                                key={color.name}
                                                onClick={() => {
                                                    onThemeChange?.(color);
                                                    setShowColorPicker(false);
                                                }}
                                                className={`w-10 h-10 rounded-lg border-2 transition-all hover:scale-110 ${
                                                    currentTheme.name === color.name 
                                                        ? 'border-gray-800 ring-2 ring-offset-1 ring-gray-400' 
                                                        : 'border-gray-200'
                                                }`}
                                                style={{
                                                    backgroundColor: color.name === 'None' 
                                                        ? '#f9fafb' 
                                                        : `rgb(${color.primary[0]}, ${color.primary[1]}, ${color.primary[2]})`
                                                }}
                                                title={color.name}
                                            >
                                                {color.name === 'None' && (
                                                    <span className="text-xs text-gray-400">∅</span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-400 mt-2">
                                        {currentTheme.name} theme selected
                                    </p>
                                </div>
                            )}
                        </div>
                        {onRevert && isModified && (
                            <button
                                onClick={onRevert}
                                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                            >
                                <RotateCcw className="w-4 h-4" />
                                Revert Changes
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Section Navigation */}
            <div className="border-b border-rose-100 px-4">
                <nav className="flex gap-1 overflow-x-auto">
                    {['all', 'contact', 'summary', 'experience', 'education', 'skills'].map((section) => (
                        <button
                            key={section}
                            onClick={() => setActiveSection(section)}
                            className={`px-4 py-3 text-sm font-medium capitalize whitespace-nowrap transition-colors ${
                                activeSection === section
                                    ? 'text-rose-600 border-b-2 border-rose-500'
                                    : 'text-gray-500 hover:text-rose-500'
                            }`}
                        >
                            {section}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Editor Content */}
            <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto">
                {/* Contact Section */}
                {(activeSection === 'all' || activeSection === 'contact') && (
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <User className="w-5 h-5 text-rose-500" />
                            <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <EditableField
                                    value={resume.name}
                                    onChange={(name) => updateResume({ name })}
                                    placeholder="Your full name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <Mail className="w-4 h-4 inline mr-1" />Email
                                </label>
                                <EditableField
                                    value={resume.email || ''}
                                    onChange={(email) => updateResume({ email })}
                                    placeholder="email@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <Phone className="w-4 h-4 inline mr-1" />Phone
                                </label>
                                <EditableField
                                    value={resume.phone || ''}
                                    onChange={(phone) => updateResume({ phone })}
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <MapPin className="w-4 h-4 inline mr-1" />Location
                                </label>
                                <EditableField
                                    value={resume.location || ''}
                                    onChange={(location) => updateResume({ location })}
                                    placeholder="City, State"
                                />
                            </div>
                        </div>
                    </section>
                )}

                {/* Summary Section */}
                {(activeSection === 'all' || activeSection === 'summary') && (
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="w-5 h-5 text-rose-500" />
                            <h3 className="text-lg font-semibold text-gray-900">Professional Summary</h3>
                            {modifications?.modifiedSummary && (
                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">AI Modified</span>
                            )}
                        </div>
                        <EditableField
                            value={resume.summary || ''}
                            onChange={(summary) => updateResume({ summary })}
                            multiline
                            placeholder="Write a compelling summary of your professional background..."
                            isHighlighted={!!modifications?.modifiedSummary}
                        />
                    </section>
                )}

                {/* Experience Section */}
                {(activeSection === 'all' || activeSection === 'experience') && (
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-rose-500" />
                                <h3 className="text-lg font-semibold text-gray-900">Work Experience</h3>
                            </div>
                            <button
                                onClick={addExperience}
                                className="flex items-center gap-1 px-3 py-1.5 text-sm bg-rose-100 text-rose-700 rounded-lg hover:bg-rose-200 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Add Position
                            </button>
                        </div>
                        <div className="space-y-4">
                            {resume.experience.map((exp, index) => (
                                <ExperienceEditor
                                    key={exp.id}
                                    experience={exp}
                                    onChange={(updated) => updateExperience(index, updated)}
                                    onDelete={() => deleteExperience(index)}
                                />
                            ))}
                            {resume.experience.length === 0 && (
                                <p className="text-gray-500 text-center py-8">
                                    No experience entries yet. Click "Add Position" to get started.
                                </p>
                            )}
                        </div>
                    </section>
                )}

                {/* Education Section */}
                {(activeSection === 'all' || activeSection === 'education') && (
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <GraduationCap className="w-5 h-5 text-rose-500" />
                                <h3 className="text-lg font-semibold text-gray-900">Education</h3>
                            </div>
                            <button
                                onClick={addEducation}
                                className="flex items-center gap-1 px-3 py-1.5 text-sm bg-rose-100 text-rose-700 rounded-lg hover:bg-rose-200 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Add Education
                            </button>
                        </div>
                        <div className="space-y-3">
                            {resume.education.map((edu, index) => (
                                <div key={edu.id} className="p-4 border border-rose-200 rounded-lg">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <EditableField
                                                value={edu.degree}
                                                onChange={(degree) => {
                                                    const newEdu = [...resume.education];
                                                    newEdu[index] = { ...edu, degree };
                                                    updateResume({ education: newEdu });
                                                }}
                                                className="font-semibold"
                                                placeholder="Degree"
                                            />
                                            <div className="flex gap-4 text-sm text-gray-600">
                                                <EditableField
                                                    value={edu.institution || ''}
                                                    onChange={(institution) => {
                                                        const newEdu = [...resume.education];
                                                        newEdu[index] = { ...edu, institution };
                                                        updateResume({ education: newEdu });
                                                    }}
                                                    placeholder="Institution"
                                                />
                                                <EditableField
                                                    value={edu.year || ''}
                                                    onChange={(year) => {
                                                        const newEdu = [...resume.education];
                                                        newEdu[index] = { ...edu, year };
                                                        updateResume({ education: newEdu });
                                                    }}
                                                    placeholder="Year"
                                                />
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => updateResume({ education: resume.education.filter((_, i) => i !== index) })}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Skills Section */}
                {(activeSection === 'all' || activeSection === 'skills') && (
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <Code className="w-5 h-5 text-rose-500" />
                            <h3 className="text-lg font-semibold text-gray-900">Skills</h3>
                            {modifications?.addedSkills && modifications.addedSkills.length > 0 && (
                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                    +{modifications.addedSkills.length} added
                                </span>
                            )}
                        </div>
                        <SkillsEditor
                            skills={resume.skills}
                            matchedSkills={tailoredResume?.modifications?.addedSkills || []}
                            missingSkills={[]} // Will be populated from analysis
                            onChange={(skills) => updateResume({ skills })}
                        />
                    </section>
                )}

                {/* Projects Section */}
                {(activeSection === 'all') && resume.projects && resume.projects.length > 0 && (
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <FolderOpen className="w-5 h-5 text-rose-500" />
                            <h3 className="text-lg font-semibold text-gray-900">Projects</h3>
                        </div>
                        <div className="space-y-2">
                            {resume.projects.map((project, index) => (
                                <div key={index} className="p-3 border border-rose-200 rounded-lg">
                                    <EditableField
                                        value={project}
                                        onChange={(newProject) => {
                                            const newProjects = [...resume.projects];
                                            newProjects[index] = newProject;
                                            updateResume({ projects: newProjects });
                                        }}
                                        multiline
                                    />
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Certifications Section */}
                {(activeSection === 'all') && resume.certifications && resume.certifications.length > 0 && (
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <Award className="w-5 h-5 text-rose-500" />
                            <h3 className="text-lg font-semibold text-gray-900">Certifications</h3>
                        </div>
                        <div className="space-y-2">
                            {resume.certifications.map((cert, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <span className="text-rose-500">•</span>
                                    <EditableField
                                        value={cert}
                                        onChange={(newCert) => {
                                            const newCerts = [...(resume.certifications || [])];
                                            newCerts[index] = newCert;
                                            updateResume({ certifications: newCerts });
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default ResumeEditor;
