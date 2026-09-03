import React, { useState } from 'react';
import { paymentStepSchema } from '../schemas/formSchemas';
import { 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft, 
  ArrowRight,
  Zap,
  Building,
  Lock,
  Calendar,
  User,
  MapPin,
  QrCode
} from 'lucide-react';

const PLAN_TIERS = [
  {
    id: 'starter',
    name: 'Starter Tier',
    price: '$29',
    period: '/month',
    desc: 'Basic developer workspace & single team member access',
    badge: 'Standard'
  },
  {
    id: 'professional',
    name: 'Professional Pro',
    price: '$99',
    period: '/month',
    desc: 'Advanced API access, priority support & 10 team seats',
    badge: 'Popular'
  },
  {
    id: 'enterprise',
    name: 'Enterprise Scale',
    price: '$299',
    period: '/month',
    desc: 'Dedicated SLA, custom SSO security & unlimited seats',
    badge: 'Enterprise'
  }
];

export const StepPayment = ({ formData, updateFormData, onNext, onBack }) => {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleInputChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    updateFormData(field, value);

    const result = paymentStepSchema.safeParse(updated);
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

    setTouched({
      planTier: true,
      paymentMethod: true,
      cardHolder: true,
      cardNumber: true,
      expiryDate: true,
      cvv: true,
      billingAddress: true
    });

    const result = paymentStepSchema.safeParse(formData);
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
          <CreditCard className="w-5 h-5 text-blue-600" />
          <span>Stage 3: Subscription Plan &amp; Billing Infrastructure</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Select your enterprise tier and configure secure billing credentials.
        </p>
      </div>

      {/* Plan Tier Cards */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
          Select Subscription Plan Tier *
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PLAN_TIERS.map((tier) => {
            const isSelected = formData.planTier === tier.id;
            return (
              <div
                key={tier.id}
                onClick={() => handleInputChange('planTier', tier.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-600 shadow-md ring-2 ring-blue-500/20'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-400'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white text-xs">{tier.name}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      tier.id === 'professional' ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}>
                      {tier.badge}
                    </span>
                  </div>
                  <div className="text-xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">
                    {tier.price} <span className="text-xs font-normal text-slate-400">{tier.period}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{tier.desc}</p>
                </div>

                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300'}`}>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
              </div>
            );
          })}
        </div>
        {touched.planTier && errors.planTier && (
          <p className="text-rose-500 text-[11px] font-semibold flex items-center gap-1">
            <XCircle className="w-3 h-3" /> {errors.planTier}
          </p>
        )}
      </div>

      {/* Payment Method Switcher */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
          Select Payment Method *
        </label>
        <div className="flex flex-wrap gap-2 text-xs font-semibold">
          {[
            { id: 'card', label: 'Credit / Debit Card', icon: CreditCard },
            { id: 'upi', label: 'UPI / Direct Bank Transfer', icon: QrCode },
            { id: 'paypal', label: 'PayPal Checkout', icon: Zap }
          ].map((method) => {
            const IconComp = method.icon;
            const isSelected = formData.paymentMethod === method.id;
            return (
              <button
                key={method.id}
                type="button"
                onClick={() => handleInputChange('paymentMethod', method.id)}
                className={`px-4 py-2.5 rounded-xl border flex items-center space-x-2 transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <IconComp className="w-4 h-4" />
                <span>{method.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Card Details Form */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        {/* Cardholder Name */}
        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
            Cardholder / Account Name *
          </label>
          <div className="relative">
            <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={formData.cardHolder}
              onChange={(e) => handleInputChange('cardHolder', e.target.value)}
              onBlur={() => handleBlur('cardHolder')}
              placeholder="e.g. Johnathan Vance"
              required
              className={`w-full bg-slate-50 dark:bg-slate-900 border rounded-xl pl-9 pr-8 py-2.5 text-slate-900 dark:text-white focus:outline-none transition-all ${
                touched.cardHolder && errors.cardHolder
                  ? 'border-rose-500'
                  : 'border-slate-300 dark:border-slate-700'
              }`}
            />
          </div>
          {touched.cardHolder && errors.cardHolder && (
            <p className="text-rose-500 text-[11px] font-semibold mt-1 flex items-center gap-1">
              <XCircle className="w-3 h-3" /> {errors.cardHolder}
            </p>
          )}
        </div>

        {/* Card Number */}
        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
            Card / Account Number *
          </label>
          <div className="relative">
            <CreditCard className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={formData.cardNumber}
              onChange={(e) => handleInputChange('cardNumber', e.target.value)}
              onBlur={() => handleBlur('cardNumber')}
              placeholder="e.g. 4532 8920 1289 4012"
              required
              className={`w-full bg-slate-50 dark:bg-slate-900 border rounded-xl pl-9 pr-8 py-2.5 text-slate-900 dark:text-white focus:outline-none transition-all ${
                touched.cardNumber && errors.cardNumber
                  ? 'border-rose-500'
                  : 'border-slate-300 dark:border-slate-700'
              }`}
            />
          </div>
          {touched.cardNumber && errors.cardNumber && (
            <p className="text-rose-500 text-[11px] font-semibold mt-1 flex items-center gap-1">
              <XCircle className="w-3 h-3" /> {errors.cardNumber}
            </p>
          )}
        </div>

        {/* Expiry Date */}
        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
            Expiration Date (MM/YY) *
          </label>
          <div className="relative">
            <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={formData.expiryDate}
              onChange={(e) => handleInputChange('expiryDate', e.target.value)}
              onBlur={() => handleBlur('expiryDate')}
              placeholder="e.g. 12/28"
              required
              className={`w-full bg-slate-50 dark:bg-slate-900 border rounded-xl pl-9 pr-8 py-2.5 text-slate-900 dark:text-white focus:outline-none transition-all ${
                touched.expiryDate && errors.expiryDate
                  ? 'border-rose-500'
                  : 'border-slate-300 dark:border-slate-700'
              }`}
            />
          </div>
          {touched.expiryDate && errors.expiryDate && (
            <p className="text-rose-500 text-[11px] font-semibold mt-1 flex items-center gap-1">
              <XCircle className="w-3 h-3" /> {errors.expiryDate}
            </p>
          )}
        </div>

        {/* CVV */}
        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
            CVV / CVC Code *
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="password"
              maxLength={4}
              value={formData.cvv}
              onChange={(e) => handleInputChange('cvv', e.target.value)}
              onBlur={() => handleBlur('cvv')}
              placeholder="e.g. 842"
              required
              className={`w-full bg-slate-50 dark:bg-slate-900 border rounded-xl pl-9 pr-8 py-2.5 text-slate-900 dark:text-white focus:outline-none transition-all ${
                touched.cvv && errors.cvv
                  ? 'border-rose-500'
                  : 'border-slate-300 dark:border-slate-700'
              }`}
            />
          </div>
          {touched.cvv && errors.cvv && (
            <p className="text-rose-500 text-[11px] font-semibold mt-1 flex items-center gap-1">
              <XCircle className="w-3 h-3" /> {errors.cvv}
            </p>
          )}
        </div>
      </div>

      {/* Billing Address */}
      <div className="text-xs">
        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
          Billing Street Address *
        </label>
        <div className="relative">
          <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={formData.billingAddress}
            onChange={(e) => handleInputChange('billingAddress', e.target.value)}
            onBlur={() => handleBlur('billingAddress')}
            placeholder="e.g. 742 Evergreen Terrace, Suite 400"
            required
            className={`w-full bg-slate-50 dark:bg-slate-900 border rounded-xl pl-9 pr-8 py-2.5 text-slate-900 dark:text-white focus:outline-none transition-all ${
              touched.billingAddress && errors.billingAddress
                ? 'border-rose-500'
                : 'border-slate-300 dark:border-slate-700'
            }`}
          />
        </div>
        {touched.billingAddress && errors.billingAddress && (
          <p className="text-rose-500 text-[11px] font-semibold mt-1 flex items-center gap-1">
            <XCircle className="w-3 h-3" /> {errors.billingAddress}
          </p>
        )}
      </div>

      {/* Security Banner */}
      <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl text-xs text-blue-900 dark:text-blue-300 flex items-center gap-2">
        <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0" />
        <span>256-Bit SSL Encrypted Enterprise Payment Gate. No charges levied during trial onboarding.</span>
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
          <span>Continue to Final Review</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
};
