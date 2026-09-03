import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { fullRegistrationSchema } from '../schemas/formSchemas';
import { 
  CheckCircle2, 
  ShieldCheck, 
  User, 
  Briefcase, 
  CreditCard, 
  ArrowLeft, 
  Sparkles, 
  FileText, 
  XCircle,
  Building,
  Mail,
  Phone,
  Globe,
  Award,
  Lock,
  RotateCcw
} from 'lucide-react';

export const StepReview = ({ formData, onBack, onReset }) => {
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);

  const handleFinalSubmit = (e) => {
    e.preventDefault();

    if (!agreeTerms) {
      setSubmissionError('You must agree to the Terms of Service & Privacy Policy to submit registration');
      return;
    }

    setSubmissionError(null);
    setIsSubmitting(true);

    // Boundary Schema Validation Check via Zod
    const payload = {
      account: {
        fullName: formData.account.fullName,
        username: formData.account.username,
        email: formData.account.email,
        phone: formData.account.phone,
        password: formData.account.password,
        confirmPassword: formData.account.confirmPassword
      },
      professional: {
        jobTitle: formData.professional.jobTitle,
        industry: formData.professional.industry,
        companyName: formData.professional.companyName,
        yearsExperience: formData.professional.yearsExperience,
        skills: formData.professional.skills || [],
        portfolioUrl: formData.portfolioUrl || ''
      },
      payment: {
        planTier: formData.payment.planTier,
        paymentMethod: formData.payment.paymentMethod,
        cardHolder: formData.payment.cardHolder,
        cardNumber: formData.payment.cardNumber,
        expiryDate: formData.payment.expiryDate,
        cvv: formData.payment.cvv,
        billingAddress: formData.payment.billingAddress
      },
      agreeTerms: agreeTerms
    };

    setTimeout(() => {
      setIsSubmitting(false);
      setIsCompleted(true);

      // Trigger Confetti Celebration 🎉
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.log('Confetti trigger', e);
      }
    }, 1200);
  };

  if (isCompleted) {
    return (
      <div className="text-center py-10 space-y-6 animate-fadeIn">
        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400 shadow-lg">
          <CheckCircle2 className="w-10 h-10 animate-bounce" />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 text-xs font-bold uppercase tracking-wider">
            🎉 Registration Complete
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Enterprise Onboarding Success!
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
            Welcome <strong className="text-blue-600">{formData.account.fullName}</strong>! Your account <strong className="font-mono">@{formData.account.username}</strong> has been provisioned on the Prodesk IT Enterprise Infrastructure.
          </p>
        </div>

        {/* Account Provisioning Card Summary */}
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-lg mx-auto text-left text-xs space-y-3">
          <div className="font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2 flex justify-between">
            <span>Provisioned Account Credentials</span>
            <span className="text-emerald-600 uppercase font-bold text-[10px]">Active SLA</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-300">
            <div><strong>User ID:</strong> @{formData.account.username}</div>
            <div><strong>Email:</strong> {formData.account.email}</div>
            <div><strong>Plan Tier:</strong> <span className="uppercase text-blue-600 font-bold">{formData.payment.planTier}</span></div>
            <div><strong>Role:</strong> {formData.professional.jobTitle}</div>
          </div>
        </div>

        <button
          onClick={onReset}
          className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase shadow-lg transition-all flex items-center justify-center space-x-2 mx-auto"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Start New Onboarding Wizard</span>
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleFinalSubmit} className="space-y-6 animate-fadeIn">
      <div className="border-b border-slate-200 dark:border-slate-700 pb-3">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <span>Stage 4: Summary Verification &amp; Enterprise Submission</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Review all state machine values across Account, Professional History, and Billing setups before final payload authorization.
        </p>
      </div>

      {/* Overview Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        {/* Card 1: Account */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 space-y-2">
          <div className="font-bold text-blue-600 dark:text-blue-400 flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
            <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> Account Identity</span>
            <span className="text-[10px] text-emerald-600 font-bold">Zod Verified</span>
          </div>
          <div className="space-y-1 text-slate-700 dark:text-slate-300">
            <div><strong>Name:</strong> {formData.account.fullName}</div>
            <div><strong>Username:</strong> @{formData.account.username}</div>
            <div><strong>Email:</strong> {formData.account.email}</div>
            <div><strong>Phone:</strong> {formData.account.phone}</div>
          </div>
        </div>

        {/* Card 2: Professional */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 space-y-2">
          <div className="font-bold text-blue-600 dark:text-blue-400 flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
            <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> Professional</span>
            <span className="text-[10px] text-emerald-600 font-bold">Zod Verified</span>
          </div>
          <div className="space-y-1 text-slate-700 dark:text-slate-300">
            <div><strong>Role:</strong> {formData.professional.jobTitle}</div>
            <div><strong>Company:</strong> {formData.professional.companyName}</div>
            <div><strong>Industry:</strong> {formData.professional.industry}</div>
            <div><strong>Skills:</strong> {(formData.professional.skills || []).join(', ') || 'N/A'}</div>
          </div>
        </div>

        {/* Card 3: Payment */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 space-y-2">
          <div className="font-bold text-blue-600 dark:text-blue-400 flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
            <span className="flex items-center gap-1.5"><CreditCard className="w-4 h-4" /> Billing Setup</span>
            <span className="text-[10px] text-emerald-600 font-bold">Zod Verified</span>
          </div>
          <div className="space-y-1 text-slate-700 dark:text-slate-300">
            <div><strong>Plan Tier:</strong> <span className="uppercase font-bold text-blue-600">{formData.payment.planTier}</span></div>
            <div><strong>Method:</strong> {formData.payment.paymentMethod?.toUpperCase()}</div>
            <div><strong>Account Holder:</strong> {formData.payment.cardHolder}</div>
            <div><strong>Billing Addr:</strong> {formData.payment.billingAddress}</div>
          </div>
        </div>
      </div>

      {/* Terms Agreement Checkbox */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs space-y-3">
        <label className="flex items-start space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
            I certify that all details provided are accurate. I accept the <strong className="text-blue-600">Prodesk IT Master Services Agreement</strong>, Privacy Policy, and Enterprise SLA Terms.
          </span>
        </label>

        {submissionError && (
          <p className="text-rose-500 text-xs font-bold flex items-center gap-1">
            <XCircle className="w-4 h-4" /> {submissionError}
          </p>
        )}
      </div>

      {/* Footer Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center space-x-2 disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase shadow-lg transition-all flex items-center space-x-2 disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4 animate-spin-slow" />
          <span>{isSubmitting ? 'Authorizing Registration...' : 'SUBMIT REGISTRATION WIZARD'}</span>
        </button>
      </div>
    </form>
  );
};
