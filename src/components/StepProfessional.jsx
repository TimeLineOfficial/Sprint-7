import React, { useState } from 'react';
import { professionalStepSchema } from '../schemas/formSchemas';
import { 
  Briefcase, 
  Building2, 
  Layers, 
  Calendar, 
  Code, 
  Globe, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft, 
  ArrowRight,
  Plus,
  X
} from 'lucide-react';

const SKILL_OPTIONS = [
  'React.js', 'Node.js', 'Python', 'TypeScript', 'Docker',
  'AWS', 'Kubernetes', 'GraphQL', 'Tailwind CSS', 'SQL',
  'System Architecture', 'Product Management', 'DevOps'
];

export const StepProfessional = ({ formData, updateFormData, onNext, onBack }) => {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleInputChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    updateFormData(field, value);

    const result = professionalStepSchema.safeParse(updated);
    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0];
        fieldErrors[fieldName] = issue.message;
      });
      setErrors(fieldErrors);
    } else {
      setErrors({});
    }
  };

  const handleSkillToggle = (skill) => {
    const currentSkills = formData.skills || [];
    let updatedSkills;
    if (currentSkills.includes(skill)) {
      updatedSkills = currentSkills.filter(s => s !== skill);
    } else {
      updatedSkills = [...currentSkills, skill];
    }
    handleInputChange('skills', updatedSkills);
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setTouched({
      jobTitle: true,
      industry: true,
      companyName: true,
      yearsExperience: true,
      skills: true,
      portfolioUrl: true
    });

    const result = professionalStepSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0];
        fieldErrors[fieldName] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn">
      <div className="border-b border-slate-200 dark:border-slate-700 pb-3">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-blue-600" />
          <span>Stage 2: Professional History &amp; Technical Capabilities</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Provide your enterprise role, industry experience, and technical skill verification.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
        {/* Job Title */}
        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
            Current Job Title / Role *
          </label>
          <div className="relative">
            <Briefcase className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={formData.jobTitle}
              onChange={(e) => handleInputChange('jobTitle', e.target.value)}
              onBlur={() => handleBlur('jobTitle')}
              placeholder="e.g. Senior Staff Software Engineer"
              required
              className={`w-full bg-slate-50 dark:bg-slate-900 border rounded-xl pl-9 pr-8 py-2.5 text-slate-900 dark:text-white focus:outline-none transition-all ${
                touched.jobTitle && errors.jobTitle
                  ? 'border-rose-500'
                  : touched.jobTitle && !errors.jobTitle && formData.jobTitle
                  ? 'border-emerald-500'
                  : 'border-slate-300 dark:border-slate-700'
              }`}
            />
            {touched.jobTitle && !errors.jobTitle && formData.jobTitle && (
              <CheckCircle2 className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500" />
            )}
          </div>
          {touched.jobTitle && errors.jobTitle && (
            <p className="text-rose-500 text-[11px] font-semibold mt-1 flex items-center gap-1">
              <XCircle className="w-3 h-3" /> {errors.jobTitle}
            </p>
          )}
        </div>

        {/* Company Name */}
        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
            Company / Organization Name *
          </label>
          <div className="relative">
            <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => handleInputChange('companyName', e.target.value)}
              onBlur={() => handleBlur('companyName')}
              placeholder="e.g. Prodesk IT Solutions"
              required
              className={`w-full bg-slate-50 dark:bg-slate-900 border rounded-xl pl-9 pr-8 py-2.5 text-slate-900 dark:text-white focus:outline-none transition-all ${
                touched.companyName && errors.companyName
                  ? 'border-rose-500'
                  : touched.companyName && !errors.companyName && formData.companyName
                  ? 'border-emerald-500'
                  : 'border-slate-300 dark:border-slate-700'
              }`}
            />
            {touched.companyName && !errors.companyName && formData.companyName && (
              <CheckCircle2 className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500" />
            )}
          </div>
          {touched.companyName && errors.companyName && (
            <p className="text-rose-500 text-[11px] font-semibold mt-1 flex items-center gap-1">
              <XCircle className="w-3 h-3" /> {errors.companyName}
            </p>
          )}
        </div>

        {/* Industry Sector Dropdown */}
        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
            Industry Sector *
          </label>
          <div className="relative">
            <Layers className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              value={formData.industry}
              onChange={(e) => handleInputChange('industry', e.target.value)}
              onBlur={() => handleBlur('industry')}
              required
              className={`w-full bg-slate-50 dark:bg-slate-900 border rounded-xl pl-9 pr-8 py-2.5 text-slate-900 dark:text-white focus:outline-none transition-all ${
                touched.industry && errors.industry
                  ? 'border-rose-500'
                  : 'border-slate-300 dark:border-slate-700'
              }`}
            >
              <option value="">-- Select Industry --</option>
              <option value="Information Technology">Information Technology &amp; SaaS</option>
              <option value="Financial Services">Financial Services &amp; Banking</option>
              <option value="Healthcare">Healthcare &amp; Biotechnology</option>
              <option value="E-Commerce">E-Commerce &amp; Retail</option>
              <option value="Education">Education &amp; EdTech</option>
              <option value="Consulting">Professional Consulting</option>
            </select>
          </div>
          {touched.industry && errors.industry && (
            <p className="text-rose-500 text-[11px] font-semibold mt-1 flex items-center gap-1">
              <XCircle className="w-3 h-3" /> {errors.industry}
            </p>
          )}
        </div>

        {/* Years of Experience Dropdown */}
        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
            Years of Professional Experience *
          </label>
          <div className="relative">
            <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              value={formData.yearsExperience}
              onChange={(e) => handleInputChange('yearsExperience', e.target.value)}
              onBlur={() => handleBlur('yearsExperience')}
              required
              className={`w-full bg-slate-50 dark:bg-slate-900 border rounded-xl pl-9 pr-8 py-2.5 text-slate-900 dark:text-white focus:outline-none transition-all ${
                touched.yearsExperience && errors.yearsExperience
                  ? 'border-rose-500'
                  : 'border-slate-300 dark:border-slate-700'
              }`}
            >
              <option value="">-- Select Experience --</option>
              <option value="0-1">Less than 1 Year (Junior)</option>
              <option value="1-3">1 - 3 Years (Mid-Level)</option>
              <option value="3-5">3 - 5 Years (Senior)</option>
              <option value="5-10">5 - 10 Years (Lead / Staff)</option>
              <option value="10+">10+ Years (Executive / Principal)</option>
            </select>
          </div>
          {touched.yearsExperience && errors.yearsExperience && (
            <p className="text-rose-500 text-[11px] font-semibold mt-1 flex items-center gap-1">
              <XCircle className="w-3 h-3" /> {errors.yearsExperience}
            </p>
          )}
        </div>
      </div>

      {/* Portfolio / LinkedIn URL */}
      <div className="text-xs">
        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
          Portfolio / GitHub / LinkedIn URL (Optional)
        </label>
        <div className="relative">
          <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="url"
            value={formData.portfolioUrl}
            onChange={(e) => handleInputChange('portfolioUrl', e.target.value)}
            onBlur={() => handleBlur('portfolioUrl')}
            placeholder="e.g. https://github.com/username"
            className={`w-full bg-slate-50 dark:bg-slate-900 border rounded-xl pl-9 pr-8 py-2.5 text-slate-900 dark:text-white focus:outline-none transition-all ${
              touched.portfolioUrl && errors.portfolioUrl
                ? 'border-rose-500'
                : 'border-slate-300 dark:border-slate-700'
            }`}
          />
        </div>
        {touched.portfolioUrl && errors.portfolioUrl && (
          <p className="text-rose-500 text-[11px] font-semibold mt-1 flex items-center gap-1">
            <XCircle className="w-3 h-3" /> {errors.portfolioUrl}
          </p>
        )}
      </div>

      {/* Primary Technical Skills Tag Picker */}
      <div className="text-xs space-y-2">
        <label className="block font-bold text-slate-700 dark:text-slate-300">
          Select Primary Technical Skills * <span className="text-[10px] text-slate-400 font-normal">(Pick at least 1)</span>
        </label>
        
        <div className="flex flex-wrap gap-2">
          {SKILL_OPTIONS.map((skill) => {
            const isSelected = (formData.skills || []).includes(skill);
            return (
              <button
                key={skill}
                type="button"
                onClick={() => handleSkillToggle(skill)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <span>{skill}</span>
                {isSelected ? <X className="w-3.5 h-3.5 ml-1" /> : <Plus className="w-3.5 h-3.5 ml-1" />}
              </button>
            );
          })}
        </div>

        {touched.skills && errors.skills && (
          <p className="text-rose-500 text-[11px] font-semibold mt-1 flex items-center gap-1">
            <XCircle className="w-3 h-3" /> {errors.skills}
          </p>
        )}
      </div>

      {/* Footer Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="submit"
          className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase shadow-md transition-all flex items-center space-x-2"
        >
          <span>Continue to Payment Setup</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
};
