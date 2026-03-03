import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const stepTitles = ['Mother Details', 'Child Information', 'Consent & Review'];

function ProgressBar({ step }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {stepTitles.map((title, i) => (
        <div key={title} className="flex items-center gap-2">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
            i < step ? 'bg-accent-100 text-accent-700' : i === step ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-400'
          }`}>
            {i < step ? '✓' : i + 1}
            <span className="hidden sm:inline">{title}</span>
          </div>
          {i < stepTitles.length - 1 && <div className={`w-8 h-0.5 ${i < step ? 'bg-accent-400' : 'bg-gray-200'}`} />}
        </div>
      ))}
    </div>
  );
}

function Step1({ register, errors }) {
  return (
    <div className="space-y-5 animate-fadeIn">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
        <input {...register('mother.name', { required: 'Name is required' })} placeholder="Full Name" className="input-field" />
        {errors.mother?.name && <p className="text-red-500 text-xs mt-1">{errors.mother.name.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
        <input type="email" {...register('mother.email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })} placeholder="Email" className="input-field" />
        {errors.mother?.email && <p className="text-red-500 text-xs mt-1">{errors.mother.email.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number *</label>
        <input type="tel" {...register('mother.phone', { required: 'Phone is required', minLength: { value: 10, message: 'Min 10 digits' } })} placeholder="Phone Number" className="input-field" />
        {errors.mother?.phone && <p className="text-red-500 text-xs mt-1">{errors.mother.phone.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">State</label>
          <select {...register('mother.state')} className="input-field">
            <option value="">Select State</option>
            <option value="Delhi">Delhi</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
            <option value="Gujarat">Gujarat</option>
            <option value="Rajasthan">Rajasthan</option>
            <option value="West Bengal">West Bengal</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Sex</label>
          <select {...register('mother.sex')} className="input-field">
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Password *</label>
        <input type="password" {...register('mother.password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })} placeholder="Password" className="input-field" />
        {errors.mother?.password && <p className="text-red-500 text-xs mt-1">{errors.mother.password.message}</p>}
      </div>
    </div>
  );
}

function Step2({ register, errors }) {
  return (
    <div className="space-y-5 animate-fadeIn">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Child Name *</label>
        <input {...register('child.name', { required: 'Child name is required' })} placeholder="Child Name" className="input-field" />
        {errors.child?.name && <p className="text-red-500 text-xs mt-1">{errors.child.name.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Date of Birth *</label>
        <input type="date" {...register('child.dob', { required: 'Date of birth is required' })} className="input-field" />
        {errors.child?.dob && <p className="text-red-500 text-xs mt-1">{errors.child.dob.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" {...register('child.gender')} value="male" className="w-4 h-4 text-primary-600" />
            <span className="text-sm text-gray-700">Male</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" {...register('child.gender')} value="female" className="w-4 h-4 text-primary-600" />
            <span className="text-sm text-gray-700">Female</span>
          </label>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Birth Hospital</label>
        <input {...register('child.birthHospital')} placeholder="Birth Hospital" className="input-field" />
      </div>
    </div>
  );
}

function Step3({ register, errors }) {
  return (
    <div className="space-y-5 animate-fadeIn">
      <label className="flex items-start gap-3 cursor-pointer">
        <input type="checkbox" {...register('consent', { required: 'Consent is required' })} className="mt-1 w-4 h-4 text-primary-600 rounded" />
        <span className="text-sm text-gray-600">I consent to the collection and processing of health data for my child's vaccination and growth tracking. *</span>
      </label>
      {errors.consent && <p className="text-red-500 text-xs">{errors.consent.message}</p>}
      <label className="flex items-start gap-3 cursor-pointer">
        <input type="checkbox" {...register('privacy', { required: 'You must accept the privacy policy' })} className="mt-1 w-4 h-4 text-primary-600 rounded" />
        <span className="text-sm text-gray-600">I have read and agree to the <a href="#" className="text-primary-600 underline">Privacy Policy</a> and <a href="#" className="text-primary-600 underline">Terms of Service</a>. *</span>
      </label>
      {errors.privacy && <p className="text-red-500 text-xs">{errors.privacy.message}</p>}
    </div>
  );
}

const stepFields = [
  ['mother.name', 'mother.email', 'mother.phone', 'mother.password'],
  ['child.name', 'child.dob'],
  ['consent', 'privacy'],
];

export default function RegisterParent() {
  const { register, handleSubmit, trigger, formState: { errors } } = useForm({ mode: 'onTouched' });
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();
  const { register: authRegister } = useAuth();

  const next = async () => {
    const valid = await trigger(stepFields[step]);
    if (valid) setStep(s => s + 1);
  };
  const back = () => setStep(s => s - 1);

  const onSubmit = async (data) => {
    setLoading(true);
    setApiError('');
    try {
      await authRegister(data);
      navigate('/dashboard');
    } catch (err) {
      setApiError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-start justify-center py-10 px-4 md:px-8">
      <div className="w-full max-w-xl">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Register as Parent</h1>
          <ProgressBar step={step} />

          <div className="card">
            <h2 className="text-lg font-bold text-gray-800 mb-5">
              Step {step + 1}: {stepTitles[step]}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              {step === 0 && <Step1 register={register} errors={errors} />}
              {step === 1 && <Step2 register={register} errors={errors} />}
              {step === 2 && <Step3 register={register} errors={errors} />}

              {apiError && <p className="text-red-500 text-sm mt-3">{apiError}</p>}

              <div className="flex justify-between mt-8">
                {step > 0 ? (
                  <button type="button" onClick={back} className="btn-outline py-2 px-5 text-sm">Back</button>
                ) : <span />}
                {step < 2 ? (
                  <button type="button" onClick={next} className="btn-accent py-2 px-6 text-sm">Next →</button>
                ) : (
                  <button type="submit" disabled={loading} className="btn-accent py-2 px-6 text-sm disabled:opacity-50">
                    {loading ? 'Submitting...' : 'Submit'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
  );
}
