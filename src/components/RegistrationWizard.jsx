import React, { useState } from 'react';
import { StepAccount } from './StepAccount';
import { StepProfessional } from './StepProfessional';
import { StepPayment } from './StepPayment';
import { StepReview } from './StepReview';
import { 
  User, 
  Briefcase, 
  CreditCard, 
  CheckCircle2, 
  ShieldCheck, 
  Cpu, 
  Terminal
} from 'lucide-react';

const INITIAL_FORM_DATA = {
  account: {
    fullName: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  },
  professional: {
    jobTitle: '',
    industry: '',
    companyName: '',
    yearsExperience: '',
    skills: ['React.js', 'TypeScript'],
    portfolioUrl: ''
  },
  payment: {
    planTier: 'professional',
    paymentMethod: 'card',
    cardHolder: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    billingAddress: ''
  }
};

export const RegistrationWizard = () => {
  // Finite State Machine: Step 1 -> Step 2 -> Step 3 -> Step 4
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [showFsmInspector, setShowFsmInspector] = useState(false);
  const [isWizardSubmitted, setIsWizardSubmitted] = useState(false);

  // Update specific step state while preserving all local FSM state
  const updateStepData = (stepKey, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [stepKey]: {
        ...prev[stepKey],
        [field]: value
      }
    }));
  };

  const handleNextStep = () => {
    setCurrentStep((prev) => Math.min(4, prev + 1));
  };

  const handleBackStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleResetFsm = () => {
    setFormData(INITIAL_FORM_DATA);
    setCurrentStep(1);
    setIsWizardSubmitted(false);
  };

  const steps = [
    { num: 1, title: 'Account Details', icon: User, key: 'account' },
    { num: 2, title: 'Professional History', icon: Briefcase, key: 'professional' },
    { num: 3, title: 'Payment Setup', icon: CreditCard, key: 'payment' },
    { num: 4, title: 'Review & Submit', icon: ShieldCheck, key: 'review' }
  ];

  // Intuitive progress calculation:
  // Step 1 (not filled yet) = 0% completed
  // Step 2 (Step 1 done) = 25% completed
  // Step 3 (Step 1 & 2 done) = 50% completed
  // Step 4 (Step 1, 2 & 3 done) = 75% completed
  // Final Submission = 100% completed
  const progressPct = isWizardSubmitted 
    ? 100 
    : Math.round(((currentStep - 1) / 4) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Wizard Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-800 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider">
            <Cpu className="w-4 h-4" /> Prodesk IT • Sprint 07 Onboarding Wizard
          </div>
          <button
            onClick={() => setShowFsmInspector(!showFsmInspector)}
            className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-[11px] font-mono flex items-center gap-1.5"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>{showFsmInspector ? 'Hide FSM Debug' : 'FSM State Inspector'}</span>
          </button>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Enterprise Multi-Step Registration Infrastructure
        </h1>
        <p className="text-xs sm:text-sm text-blue-100 max-w-2xl leading-relaxed">
          Architected as a Finite State Machine with 100% controlled components, RegEx password rules, Zod schema boundary validation, and 500ms debounced username API checks.
        </p>

        {/* Progress Bar Indicator */}
        <div className="pt-2 space-y-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-blue-200">WIZARD PROGRESS</span>
            <span className="text-amber-400 font-bold">{progressPct}% COMPLETED</span>
          </div>
          <div className="w-full bg-blue-950/80 h-2.5 rounded-full overflow-hidden p-0.5 border border-blue-600/40">
            <div className="bg-amber-400 h-full rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }} />
          </div>
        </div>
      </div>

      {/* Step Indicator Badges Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {steps.map((s) => {
          const isActive = currentStep === s.num;
          const isDone = currentStep > s.num || isWizardSubmitted;

          return (
            <div
              key={s.num}
              onClick={() => {
                if (isDone) setCurrentStep(s.num);
              }}
              className={`p-3 rounded-xl border transition-all text-left flex items-center space-x-3 ${
                isDone ? 'cursor-pointer' : 'cursor-default'
              } ${
                isActive
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md font-bold'
                  : isDone
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                isActive ? 'bg-amber-400 text-slate-950' : isDone ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
              }`}>
                {isDone ? <CheckCircle2 className="w-4 h-4" /> : s.num}
              </div>
              <div className="truncate">
                <div className="text-[10px] uppercase font-bold tracking-wider opacity-80">Step 0{s.num}</div>
                <div className="text-xs font-semibold truncate leading-tight">{s.title}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* FSM State Inspector Debug Panel */}
      {showFsmInspector && (
        <div className="bg-slate-950 text-emerald-400 font-mono p-4 rounded-xl text-xs space-y-2 border border-slate-800 shadow-inner">
          <div className="flex items-center justify-between text-slate-400 text-[11px] border-b border-slate-800 pb-1">
            <span className="flex items-center gap-1"><Terminal className="w-3.5 h-3.5" /> LIVE FSM STATE INSPECTOR</span>
            <span>Current Step: {currentStep} / 4 | Progress: {progressPct}%</span>
          </div>
          <pre className="overflow-x-auto text-[11px] max-h-48 custom-scrollbar">
            {JSON.stringify({ currentStep, progressPct, formData }, null, 2)}
          </pre>
        </div>
      )}

      {/* Main Active Step Component Render Container */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 sm:p-8 shadow-sm">
        {currentStep === 1 && (
          <StepAccount
            formData={formData.account}
            updateFormData={(field, val) => updateStepData('account', field, val)}
            onNext={handleNextStep}
          />
        )}

        {currentStep === 2 && (
          <StepProfessional
            formData={formData.professional}
            updateFormData={(field, val) => updateStepData('professional', field, val)}
            onNext={handleNextStep}
            onBack={handleBackStep}
          />
        )}

        {currentStep === 3 && (
          <StepPayment
            formData={formData.payment}
            updateFormData={(field, val) => updateStepData('payment', field, val)}
            onNext={handleNextStep}
            onBack={handleBackStep}
          />
        )}

        {currentStep === 4 && (
          <StepReview
            formData={formData}
            onBack={handleBackStep}
            onReset={handleResetFsm}
            onSubmitted={() => setIsWizardSubmitted(true)}
          />
        )}
      </div>
    </div>
  );
};
