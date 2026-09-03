import React, { useState, useEffect } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { checkUsernameAvailability } from '../services/mockApiService';
import { accountStepSchema } from '../schemas/formSchemas';
import { 
  User, 
  AtSign, 
  Mail, 
  Lock, 
  Phone, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  Eye, 
  EyeOff, 
  ShieldCheck
} from 'lucide-react';

export const StepAccount = ({ formData, updateFormData, onNext }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Username Debounce & Availability State (Phase 3 Requirement: 500ms Debounce)
  const debouncedUsername = useDebounce(formData.username, 500);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState(null); // { available: boolean, reason: string }

  // Debounced API username availability effect
  useEffect(() => {
    if (!debouncedUsername || debouncedUsername.trim().length < 3) {
      setUsernameStatus(null);
      setCheckingUsername(false);
      return;
    }

    let isMounted = true;
    setCheckingUsername(true);

    checkUsernameAvailability(debouncedUsername).then((res) => {
      if (isMounted) {
        setCheckingUsername(false);
        setUsernameStatus(res);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [debouncedUsername]);

  // Real-time inline field validation handler (Phase 2 & Phase 3)
  const handleInputChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    updateFormData(field, value);

    // Validate using Zod schema
    const result = accountStepSchema.safeParse(updated);
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

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      fullName: true,
      username: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true
    });

    // Validate via Zod Schema boundary
    const result = accountStepSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0];
        fieldErrors[fieldName] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    if (usernameStatus && !usernameStatus.available) {
      setErrors((prev) => ({ ...prev, username: usernameStatus.reason }));
      return;
    }

    onNext();
  };

  // Password strength logic
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: 'None', color: 'bg-slate-200' };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;

    if (score <= 1) return { score: 25, label: 'Weak', color: 'bg-rose-500' };
    if (score === 2) return { score: 50, label: 'Fair', color: 'bg-amber-500' };
    if (score === 3) return { score: 75, label: 'Good', color: 'bg-blue-500' };
    return { score: 100, label: 'Strong (Enterprise Ready)', color: 'bg-emerald-500' };
  };

  const pwdStrength = getPasswordStrength(formData.password);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn">
      <div className="border-b border-slate-200 dark:border-slate-700 pb-3">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" />
          <span>Stage 1: Account Credentials &amp; Identity</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Configure your login profile with RegEx password enforcement and debounced username validation.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
        {/* Full Name */}
        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
            Full Legal Name *
          </label>
          <div className="relative">
            <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              onBlur={() => handleBlur('fullName')}
              placeholder="e.g. Johnathan Vance"
              required
              className={`w-full bg-slate-50 dark:bg-slate-900 border rounded-xl pl-9 pr-8 py-2.5 text-slate-900 dark:text-white focus:outline-none transition-all ${
                touched.fullName && errors.fullName
                  ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                  : touched.fullName && !errors.fullName && formData.fullName
                  ? 'border-emerald-500'
                  : 'border-slate-300 dark:border-slate-700 focus:border-blue-600'
              }`}
            />
            {touched.fullName && !errors.fullName && formData.fullName && (
              <CheckCircle2 className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500" />
            )}
          </div>
          {touched.fullName && errors.fullName && (
            <p className="text-rose-500 text-[11px] font-semibold mt-1 flex items-center gap-1">
              <XCircle className="w-3 h-3" /> {errors.fullName}
            </p>
          )}
        </div>

        {/* Username with 500ms Debounced API Lookup */}
        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
            <span>Username *</span>
            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-mono">500ms Debounced Lookup</span>
          </label>
          <div className="relative">
            <AtSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              onBlur={() => handleBlur('username')}
              placeholder="e.g. jvance_pro"
              required
              className={`w-full bg-slate-50 dark:bg-slate-900 border rounded-xl pl-9 pr-9 py-2.5 text-slate-900 dark:text-white focus:outline-none transition-all ${
                checkingUsername
                  ? 'border-amber-400'
                  : usernameStatus && !usernameStatus.available
                  ? 'border-rose-500'
                  : usernameStatus && usernameStatus.available
                  ? 'border-emerald-500'
                  : 'border-slate-300 dark:border-slate-700'
              }`}
            />

            {/* Debounce Loading Indicator */}
            {checkingUsername && (
              <Loader2 className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-amber-500 animate-spin" />
            )}
            {!checkingUsername && usernameStatus && usernameStatus.available && (
              <CheckCircle2 className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500" />
            )}
            {!checkingUsername && usernameStatus && !usernameStatus.available && (
              <XCircle className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-rose-500" />
            )}
          </div>

          {/* Inline Debounce Availability Status */}
          {checkingUsername && (
            <p className="text-amber-600 dark:text-amber-400 text-[11px] font-semibold mt-1 flex items-center gap-1">
              Checking availability on mock server...
            </p>
          )}
          {!checkingUsername && usernameStatus && (
            <p className={`text-[11px] font-semibold mt-1 flex items-center gap-1 ${usernameStatus.available ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
              {usernameStatus.available ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
              {usernameStatus.reason}
            </p>
          )}
          {touched.username && errors.username && !usernameStatus && (
            <p className="text-rose-500 text-[11px] font-semibold mt-1 flex items-center gap-1">
              <XCircle className="w-3 h-3" /> {errors.username}
            </p>
          )}
        </div>

        {/* Email Address */}
        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
            Work Email Address *
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              placeholder="e.g. john@company.com"
              required
              className={`w-full bg-slate-50 dark:bg-slate-900 border rounded-xl pl-9 pr-8 py-2.5 text-slate-900 dark:text-white focus:outline-none transition-all ${
                touched.email && errors.email
                  ? 'border-rose-500'
                  : touched.email && !errors.email && formData.email
                  ? 'border-emerald-500'
                  : 'border-slate-300 dark:border-slate-700'
              }`}
            />
            {touched.email && !errors.email && formData.email && (
              <CheckCircle2 className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500" />
            )}
          </div>
          {touched.email && errors.email && (
            <p className="text-rose-500 text-[11px] font-semibold mt-1 flex items-center gap-1">
              <XCircle className="w-3 h-3" /> {errors.email}
            </p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
            Phone Number *
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              onBlur={() => handleBlur('phone')}
              placeholder="e.g. +1 555 019 2834"
              required
              className={`w-full bg-slate-50 dark:bg-slate-900 border rounded-xl pl-9 pr-8 py-2.5 text-slate-900 dark:text-white focus:outline-none transition-all ${
                touched.phone && errors.phone
                  ? 'border-rose-500'
                  : touched.phone && !errors.phone && formData.phone
                  ? 'border-emerald-500'
                  : 'border-slate-300 dark:border-slate-700'
              }`}
            />
            {touched.phone && !errors.phone && formData.phone && (
              <CheckCircle2 className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500" />
            )}
          </div>
          {touched.phone && errors.phone && (
            <p className="text-rose-500 text-[11px] font-semibold mt-1 flex items-center gap-1">
              <XCircle className="w-3 h-3" /> {errors.phone}
            </p>
          )}
        </div>

        {/* Password (Phase 2 RegEx Enforcement) */}
        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
            Password * <span className="text-[10px] text-slate-400 font-normal">(Min 8 chars, 1 Uppercase, 1 Special Char)</span>
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              onBlur={() => handleBlur('password')}
              placeholder="e.g. Secret123!"
              required
              className={`w-full bg-slate-50 dark:bg-slate-900 border rounded-xl pl-9 pr-10 py-2.5 text-slate-900 dark:text-white focus:outline-none transition-all ${
                touched.password && errors.password
                  ? 'border-rose-500'
                  : touched.password && !errors.password && formData.password
                  ? 'border-emerald-500'
                  : 'border-slate-300 dark:border-slate-700'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Password Strength Meter */}
          {formData.password && (
            <div className="mt-2 space-y-1">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-slate-500">Strength:</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">{pwdStrength.label}</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-300 ${pwdStrength.color}`} style={{ width: `${pwdStrength.score}%` }} />
              </div>
            </div>
          )}

          {touched.password && errors.password && (
            <p className="text-rose-500 text-[11px] font-semibold mt-1 flex items-center gap-1">
              <XCircle className="w-3 h-3" /> {errors.password}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
            Confirm Password *
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              onBlur={() => handleBlur('confirmPassword')}
              placeholder="Re-enter password..."
              required
              className={`w-full bg-slate-50 dark:bg-slate-900 border rounded-xl pl-9 pr-10 py-2.5 text-slate-900 dark:text-white focus:outline-none transition-all ${
                touched.confirmPassword && errors.confirmPassword
                  ? 'border-rose-500'
                  : touched.confirmPassword && !errors.confirmPassword && formData.confirmPassword
                  ? 'border-emerald-500'
                  : 'border-slate-300 dark:border-slate-700'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {touched.confirmPassword && errors.confirmPassword && (
            <p className="text-rose-500 text-[11px] font-semibold mt-1 flex items-center gap-1">
              <XCircle className="w-3 h-3" /> {errors.confirmPassword}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
        <button
          type="submit"
          className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase shadow-md transition-all flex items-center space-x-2"
        >
          <span>Continue to Professional History</span>
          <ShieldCheck className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
};
