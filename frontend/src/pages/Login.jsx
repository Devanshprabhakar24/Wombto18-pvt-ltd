import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { sendOtp, verifyOtp, adminVerify, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') navigate('/admin', { replace: true });
      else navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const [step, setStep] = useState('email'); // 'email' | 'otp' | 'admin-password'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [adminPassword, setAdminPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await sendOtp(email);
      setStep('otp');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value && !/^\d$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (paste.length === 6) {
      setOtp(paste.split(''));
      inputRefs.current[5]?.focus();
      e.preventDefault();
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter the full 6-digit OTP.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const result = await verifyOtp(email, otpString);
      if (result.requireAdminVerify) {
        setStep('admin-password');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminVerify = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await adminVerify(email, adminPassword);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid admin password.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setOtp(['', '', '', '', '', '']);
    try {
      await sendOtp(email);
      setError(''); // clear any old errors
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP.');
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary-dark rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">W</span>
          </div>
          <h1 className="text-2xl font-bold text-text-heading">Welcome Back</h1>
          <p className="text-sm text-text-muted mt-1">Sign in to access your child's health dashboard</p>
        </div>

        <div className="card">
          {step === 'admin-password' ? (
            <form onSubmit={handleAdminVerify} className="space-y-5">
              <div className="text-center">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-red-600 text-lg">🔒</span>
                </div>
                <p className="text-sm font-semibold text-gray-800">Admin Verification [password: admin123]</p>
                <p className="text-xs text-gray-500 mt-1">Enter your admin password to continue</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Admin Password</label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Enter sword"
                  className="input-field"
                  required
                  autoFocus
                />
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg">{error}</div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full text-sm disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify & Sign In as Admin'}
              </button>

              <button type="button" onClick={() => { setStep('email'); setAdminPassword(''); setError(''); }} className="w-full text-sm text-gray-500 hover:text-gray-700">
                ← Back to login
              </button>
            </form>
          ) : step === 'email' ? (
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-field"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg">{error}</div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full text-sm disabled:opacity-50"
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>

              <p className="text-xs text-center text-gray-400 mt-2">Test mode — OTP is <span className="font-mono font-bold">123456</span></p>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="text-center">
                <p className="text-sm text-gray-600">Enter the 6-digit OTP sent to</p>
                <p className="text-sm font-semibold text-gray-800">{email}</p>
              </div>

              <div className="flex justify-center gap-2" onPaste={handleOtpPaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={el => inputRefs.current[i] = el}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="w-11 h-12 text-center text-lg font-bold border-2 rounded-lg focus:border-primary-600 focus:outline-none transition"
                    autoFocus={i === 0}
                  />
                ))}
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg">{error}</div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full text-sm disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify & Sign In'}
              </button>

              <div className="flex justify-between items-center text-sm">
                <button type="button" onClick={() => { setStep('email'); setOtp(['','','','','','']); setError(''); }} className="text-gray-500 hover:text-gray-700">
                  ← Change email
                </button>
                <button type="button" onClick={handleResend} className="text-primary-600 font-semibold hover:underline">
                  Resend OTP
                </button>
              </div>

              <p className="text-xs text-center text-gray-400">Test mode — OTP is <span className="font-mono font-bold">123456</span></p>
            </form>
          )}

          <div className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 font-semibold hover:underline">
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
