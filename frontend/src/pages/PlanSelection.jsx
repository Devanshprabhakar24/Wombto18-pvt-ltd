import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const PLAN_CARDS = [
  {
    key: 'FREE',
    name: 'Free',
    price: 0,
    color: 'gray',
    features: ['Basic maternal tracking', 'Masked vaccine details', 'Limited reminders'],
  },
  {
    key: 'PREMIUM',
    name: 'Premium',
    price: 349,
    color: 'blue',
    popular: true,
    features: ['Full vaccine schedule', 'Email + SMS reminders', 'Go Green dashboard badge', 'Partner referral access', 'MRN + CRN tracking'],
  },
  {
    key: 'ULTRA',
    name: 'Ultra',
    price: 999,
    color: 'purple',
    features: ['Everything in Premium', 'Tree plantation (Go Green)', 'Geo-tagged certificate', 'Priority support', 'Family sharing (coming soon)'],
  },
];

export default function PlanSelection() {
  const { user, refreshUser } = useAuth();
  const [coupon, setCoupon] = useState('');
  const [couponResult, setCouponResult] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [plans, setPlans] = useState(PLAN_CARDS);

  useEffect(() => {
    api.get('/payments/plans').then(res => {
      if (res.data?.plans?.length) {
        setPlans(prev => prev.map(p => {
          const remote = res.data.plans.find(r => r.key === p.key);
          return remote ? { ...p, price: remote.base, gst: remote.gst, total: remote.total } : p;
        }));
      }
    }).catch(() => {});
  }, []);

  const applyCoupon = async (planKey) => {
    if (!coupon.trim()) return;
    try {
      const res = await api.post('/payments/create-order', { plan: planKey, couponCode: coupon });
      setCouponResult({
        plan: planKey,
        discount: res.data.discount || 0,
        finalAmount: res.data.finalAmount ?? (res.data.amount != null ? (res.data.amount / 100) : 0),
        orderId: res.data.orderId,
        fullyWaived: res.data.payment?.status === 'paid' || res.data.finalAmount === 0,
      });
    } catch (err) {
      alert(err.response?.data?.message || 'Invalid coupon');
      setCouponResult(null);
    }
  };

  const handleUpgrade = async (planKey) => {
    if (planKey === 'FREE') return;
    setProcessing(true);
    try {
      const res = await api.post('/payments/create-order', { plan: planKey, couponCode: coupon || undefined });
      const orderData = res.data;

      // Full coupon waiver — plan already activated by backend
      if (orderData.payment?.status === 'paid' || orderData.amount === 0) {
        alert('Plan activated successfully!');
        if (refreshUser) refreshUser();
        return;
      }

      // Test mode: auto-simulate payment verification
      const amountInRupees = (orderData.amount / 100).toFixed(2);
      const confirmed = confirm(`Test Mode: Simulate payment of ₹${amountInRupees} for ${planKey} plan?\n\nOrder ID: ${orderData.orderId}`);
      if (confirmed) {
        await api.post('/payments/verify', { orderId: orderData.orderId });
        alert(`${planKey} plan activated successfully!`);
        if (refreshUser) refreshUser();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Choose Your Plan</h1>
        <p className="text-sm text-gray-500 mt-1">Unlock full maternal + child tracking features</p>
        {user?.plan_type && (
          <span className="inline-block mt-2 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-semibold">Current: {user.plan_type}</span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map(plan => {
          const isCurrentPlan = user?.plan_type === plan.key;
          return (
            <div key={plan.key} className={`card relative ${plan.popular ? 'ring-2 ring-blue-500' : ''}`}>
              {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-blue-500 text-white text-xs font-bold rounded-full">Popular</div>}
              <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
              <div className="mt-2 mb-4">
                <span className="text-3xl font-extrabold text-gray-900">{plan.price === 0 ? 'Free' : `₹${plan.price}`}</span>
                {plan.gst > 0 && <span className="text-xs text-gray-400 ml-1">+ ₹{plan.gst} GST</span>}
              </div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-green-500 mt-0.5">✓</span>{f}
                  </li>
                ))}
              </ul>
              {isCurrentPlan ? (
                <button disabled className="w-full py-2.5 bg-gray-100 text-gray-500 rounded-lg text-sm font-semibold">Current Plan</button>
              ) : plan.key === 'FREE' ? (
                <div className="text-center text-sm text-gray-400">Included by default</div>
              ) : (
                <button onClick={() => handleUpgrade(plan.key)} disabled={processing} className="btn-accent w-full py-2.5">
                  {processing ? 'Processing...' : `Upgrade to ${plan.name}`}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Coupon section */}
      <div className="card mt-8">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Have a Coupon?</h3>
        <div className="flex gap-2">
          <input value={coupon} onChange={e => setCoupon(e.target.value)} placeholder="Enter coupon code" className="input-field flex-1" />
          <button onClick={() => applyCoupon('PREMIUM')} className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-semibold hover:bg-primary-700 transition">Apply</button>
        </div>
        {couponResult && (
          <div className="mt-2 text-sm">
            {couponResult.fullyWaived ? (
              <p className="text-green-600 font-semibold">🎉 Coupon applied! Plan fully activated — no payment needed.</p>
            ) : (
              <p className="text-green-600">
                Discount applied! {couponResult.discount > 0 && <span>Saved ₹{couponResult.discount}. </span>}Final amount: <span className="font-bold">₹{couponResult.finalAmount}</span>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
