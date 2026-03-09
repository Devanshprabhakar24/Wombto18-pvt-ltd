import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const stepTitles = ['Mother Details', 'Child Information', 'Consent & Review', 'Registration Complete'];

function ProgressBar({ step }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {stepTitles.map((title, i) => (
        <div key={title} className="flex items-center gap-2">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
            i < step ? 'bg-accent-green text-primary-dark' : i === step ? 'bg-primary-dark text-white' : 'bg-accent-green/10 text-accent-green'
          }`}>
            {i < step ? '✓' : i + 1}
            <span className="hidden sm:inline">{title}</span>
          </div>
          {i < stepTitles.length - 1 && <div className={`w-8 h-0.5 ${i < step ? 'bg-primary-bright' : 'bg-accent-green/30'}`} />}
        </div>
      ))}
    </div>
  );
}

function Step1({ register, errors }) {
  return (
    <div className="space-y-5 animate-fadeIn">
      <div>
        <label className="block text-sm font-medium text-text-body mb-1.5">Full Name *</label>
        <input {...register('mother.name', { required: 'Name is required' })} placeholder="Full Name" className="input-field" />
        {errors.mother?.name && <p className="text-red-500 text-xs mt-1">{errors.mother.name.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-text-body mb-1.5">Email *</label>
        <input type="email" {...register('mother.email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })} placeholder="Email" className="input-field" />
        {errors.mother?.email && <p className="text-red-500 text-xs mt-1">{errors.mother.email.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-text-body mb-1.5">Phone Number *</label>
        <input type="tel" {...register('mother.phone', { required: 'Phone is required', minLength: { value: 10, message: 'Min 10 digits' } })} placeholder="Phone Number" className="input-field" />
        {errors.mother?.phone && <p className="text-red-500 text-xs mt-1">{errors.mother.phone.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-text-body mb-1.5">Address</label>
        <input {...register('mother.address')} placeholder="Address" className="input-field" />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-body mb-1.5">State</label>
        <select {...register('mother.state')} className="input-field">
          <option value="">Select State</option>
          <option value="Andhra Pradesh">Andhra Pradesh</option>
          <option value="Arunachal Pradesh">Arunachal Pradesh</option>
          <option value="Assam">Assam</option>
          <option value="Bihar">Bihar</option>
          <option value="Chhattisgarh">Chhattisgarh</option>
          <option value="Goa">Goa</option>
          <option value="Gujarat">Gujarat</option>
          <option value="Haryana">Haryana</option>
          <option value="Himachal Pradesh">Himachal Pradesh</option>
          <option value="Jharkhand">Jharkhand</option>
          <option value="Karnataka">Karnataka</option>
          <option value="Kerala">Kerala</option>
          <option value="Madhya Pradesh">Madhya Pradesh</option>
          <option value="Maharashtra">Maharashtra</option>
          <option value="Manipur">Manipur</option>
          <option value="Meghalaya">Meghalaya</option>
          <option value="Mizoram">Mizoram</option>
          <option value="Nagaland">Nagaland</option>
          <option value="Odisha">Odisha</option>
          <option value="Punjab">Punjab</option>
          <option value="Rajasthan">Rajasthan</option>
          <option value="Sikkim">Sikkim</option>
          <option value="Tamil Nadu">Tamil Nadu</option>
          <option value="Telangana">Telangana</option>
          <option value="Tripura">Tripura</option>
          <option value="Uttar Pradesh">Uttar Pradesh</option>
          <option value="Uttarakhand">Uttarakhand</option>
          <option value="West Bengal">West Bengal</option>
          <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
          <option value="Chandigarh">Chandigarh</option>
          <option value="Dadra and Nagar Haveli and Daman and Diu">Dadra and Nagar Haveli and Daman and Diu</option>
          <option value="Delhi">Delhi</option>
          <option value="Jammu and Kashmir">Jammu and Kashmir</option>
          <option value="Ladakh">Ladakh</option>
          <option value="Lakshadweep">Lakshadweep</option>
          <option value="Puducherry">Puducherry</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-text-body mb-1.5">Password *</label>
        <input type="password" {...register('mother.password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })} placeholder="Password" className="input-field" />
        {errors.mother?.password && <p className="text-red-500 text-xs mt-1">{errors.mother.password.message}</p>}
      </div>
    </div>
  );
}

function Step2({ register, errors, childMode, setChildMode, setValue, clearErrors }) {
  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Choice: Expecting or Born */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => { setChildMode('born'); setValue('maternal.edd', ''); clearErrors('maternal.edd'); }}
          className={`p-4 rounded-xl border-2 transition text-left ${
            childMode === 'born' ? 'border-primary-dark bg-primary-dark/5' : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <p className="text-2xl mb-1">👶</p>
          <p className="text-sm font-semibold text-text-heading">My Child Is Born</p>
          <p className="text-xs text-text-muted mt-0.5">Enter child details</p>
        </button>
        <button
          type="button"
          onClick={() => { setChildMode('expecting'); setValue('child.name', ''); setValue('child.dob', ''); clearErrors(['child.name', 'child.dob']); }}
          className={`p-4 rounded-xl border-2 transition text-left ${
            childMode === 'expecting' ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <p className="text-2xl mb-1">🤰</p>
          <p className="text-sm font-semibold text-text-heading">I'm Expecting</p>
          <p className="text-xs text-text-muted mt-0.5">Enter expected due date</p>
        </button>
      </div>

      {childMode === 'born' && (
        <>
          <div>
            <label className="block text-sm font-medium text-text-body mb-1.5">Child Name *</label>
            <input {...register('child.name', { required: childMode === 'born' ? 'Child name is required' : false })} placeholder="Child Name" className="input-field" />
            {errors.child?.name && <p className="text-red-500 text-xs mt-1">{errors.child.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-text-body mb-1.5">Date of Birth *</label>
            <input type="date" {...register('child.dob', { required: childMode === 'born' ? 'Date of birth is required' : false })} max={new Date().toISOString().split('T')[0]} className="input-field" />
            {errors.child?.dob && <p className="text-red-500 text-xs mt-1">{errors.child.dob.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-text-body mb-2">Gender</label>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" {...register('child.gender')} value="male" className="w-4 h-4 text-primary-dark" />
                <span className="text-sm text-text-body">Male</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" {...register('child.gender')} value="female" className="w-4 h-4 text-primary-dark" />
                <span className="text-sm text-text-body">Female</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-body mb-1.5">Birth Hospital</label>
            <input {...register('child.birthHospital')} placeholder="Birth Hospital" className="input-field" />
          </div>
        </>
      )}

      {childMode === 'expecting' && (
        <>
          <div className="bg-pink-50 border border-pink-200 rounded-xl p-4">
            <p className="text-sm text-pink-700">Your maternal profile and vaccine schedule will be created automatically after registration.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-body mb-1.5">Expected Delivery Date (EDD) *</label>
            <input type="date" {...register('maternal.edd', { required: childMode === 'expecting' ? 'Expected delivery date is required' : false })} min={new Date().toISOString().split('T')[0]} className="input-field" />
            {errors.maternal?.edd && <p className="text-red-500 text-xs mt-1">{errors.maternal.edd.message}</p>}
          </div>
        </>
      )}

      {!childMode && (
        <p className="text-sm text-center text-text-muted py-4">Please select an option above to continue.</p>
      )}
    </div>
  );
}

function Step3({ register, errors }) {
  return (
    <div className="space-y-5 animate-fadeIn">
      <label className="flex items-start gap-3 cursor-pointer">
        <input type="checkbox" {...register('consent', { required: 'Consent is required' })} className="mt-1 w-4 h-4 text-primary-dark rounded" />
        <span className="text-sm text-text-muted">I consent to the collection and processing of health data for my child's vaccination and growth tracking. *</span>
      </label>
      {errors.consent && <p className="text-red-500 text-xs">{errors.consent.message}</p>}
      <label className="flex items-start gap-3 cursor-pointer">
        <input type="checkbox" {...register('privacy', { required: 'You must accept the privacy policy' })} className="mt-1 w-4 h-4 text-primary-dark rounded" />
        <span className="text-sm text-text-muted">I have read and agree to the <a href="#" className="text-primary-dark underline">Privacy Policy</a> and <a href="#" className="text-primary-dark underline">Terms of Service</a>. *</span>
      </label>
      {errors.privacy && <p className="text-red-500 text-xs">{errors.privacy.message}</p>}
    </div>
  );
}

function Step4({ childName, isExpecting }) {
  return (
    <div className="text-center space-y-6 animate-fadeIn py-4">
      <div className="w-20 h-20 bg-accent-green/20 rounded-full flex items-center justify-center mx-auto">
        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div>
        <h3 className="text-xl font-bold text-text-heading mb-2">Welcome to WombTo18!</h3>
        <p className="text-sm text-text-muted max-w-sm mx-auto">
          {isExpecting
            ? 'Your maternal profile has been created. Track your pregnancy journey and vaccines.'
            : childName ? `${childName}'s health profile has been created successfully. You can now track vaccinations, milestones, and more.`
            : "Your child's health profile has been created successfully. You can now track vaccinations, milestones, and more."
          }
        </p>
      </div>
      <div className="bg-green-50 rounded-xl p-4 text-left space-y-3 max-w-sm mx-auto">
        <div className="flex items-center gap-3">
          <span className="text-lg">💉</span>
          <div>
            <p className="text-sm font-semibold text-green-800">Vaccine Schedule Ready</p>
            <p className="text-xs text-gray-500">IAP 2023 immunization schedule auto-generated</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-lg">📊</span>
          <div>
            <p className="text-sm font-semibold text-green-800">Growth Tracking Active</p>
            <p className="text-xs text-gray-500">Milestones from birth to 18 years</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-lg">🔔</span>
          <div>
            <p className="text-sm font-semibold text-green-800">Reminders Enabled</p>
            <p className="text-xs text-gray-500">Email & SMS alerts for upcoming vaccines</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterParent() {
  const { register, handleSubmit, trigger, watch, setValue, clearErrors, formState: { errors } } = useForm({ mode: 'onTouched' });
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [childMode, setChildMode] = useState(null); // 'born' or 'expecting'
  const navigate = useNavigate();
  const { register: authRegister } = useAuth();

  const stepFields = [
    ['mother.name', 'mother.email', 'mother.phone', 'mother.password'],
    childMode === 'expecting' ? ['maternal.edd'] : ['child.name', 'child.dob'],
    ['consent', 'privacy'],
  ];

  const next = async () => {
    if (step === 1 && !childMode) return; // must pick a mode
    const valid = await trigger(stepFields[step]);
    if (valid) setStep(s => s + 1);
  };
  const back = () => setStep(s => s - 1);

  const onSubmit = async (data) => {
    setLoading(true);
    setApiError('');
    try {
      const payload = { ...data };
      if (childMode === 'expecting') {
        delete payload.child;
      } else {
        delete payload.maternal;
      }
      await authRegister(payload);
      setStep(3); // Move to success step
    } catch (err) {
      setApiError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-start justify-center py-10 px-4 md:px-8">
      <div className="w-full max-w-xl">
          <h1 className="text-2xl font-bold text-text-heading mb-1">Register as Parent</h1>
          <ProgressBar step={step} />

          <div className="card">
            {step < 3 && (
              <h2 className="text-lg font-bold text-text-heading mb-5">
                Step {step + 1}: {stepTitles[step]}
              </h2>
            )}

            {step === 3 ? (
              <>
                <Step4 childName={watch('child.name')} isExpecting={childMode === 'expecting'} />
                <div className="flex justify-center mt-6">
                  <button onClick={() => navigate(childMode === 'expecting' ? '/dashboard/maternal' : '/dashboard')} className="btn-accent py-2.5 px-8 text-sm">
                    {childMode === 'expecting' ? 'Go to Maternal Dashboard →' : 'Go to Dashboard →'}
                  </button>
                </div>
              </>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                {step === 0 && <Step1 register={register} errors={errors} />}
                {step === 1 && <Step2 register={register} errors={errors} childMode={childMode} setChildMode={setChildMode} setValue={setValue} clearErrors={clearErrors} />}
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
            )}
          </div>

          {step < 3 && (
            <div className="mt-6 text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 font-semibold hover:underline">
                Sign in
              </Link>
            </div>
          )}
        </div>
      </div>
  );
}
