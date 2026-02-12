'use client'
import { useState, useEffect } from 'react';
import { requestOtp, verifyOtp } from '@/lib/api-client';
import { useToast } from './ToastContext';

interface VerificationProps {
  onSuccess: () => void;
}

export default function Verification({ onSuccess }: VerificationProps) {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'email' | 'otp' | 'verified'>('email');
  const [loading, setLoading] = useState(false);

  // Check if user is already verified on page load (Session persistence)
  useEffect(() => {
    const isVerified = sessionStorage.getItem('is_verified');
    if (isVerified === 'true') setStep('verified');
  }, []);

  const handleSendOtp = async () => {
    setLoading(true);
    try {
      const { token } = await requestOtp(email);
      sessionStorage.setItem('otp_token', token);
      setStep('otp');
    } catch (err) {
      alert("Failed to send OTP. Check console.");
    } finally {
      setLoading(false);
    }
  };

  const { showToast } = useToast();

  const handleVerify = async () => {
    setLoading(true);
    const token = sessionStorage.getItem('otp_token');
    try {
      const response = await verifyOtp(otp, token!);
      if (response.success) {
        // Persist a longer-lived auth token so reply-to can be set to this user
        if (response.token) {
          localStorage.setItem('emailToken', response.token);
        }
        sessionStorage.setItem('is_verified', 'true');
        setStep('verified');
        showToast({ type: 'success', title: 'Verified', message: 'Your email is verified' });
        onSuccess();
      }
    } catch (err) {
      alert("Invalid Code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      {/* STEP 0: EMAIL ENTRY */}
      {step === 'email' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Verify your identity</h2>
          <input 
            type="email" 
            placeholder="Enter your email"
            className="w-full p-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button 
            onClick={handleSendOtp}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            {loading ? 'Sending...' : 'Send Verification Code'}
          </button>
        </div>
      )}

      {/* STEP 1: OTP CHALLENGE */}
      {step === 'otp' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Enter Code</h2>
          <p className="text-sm text-gray-500">Sent to {email}</p>
          <input 
            type="text" 
            maxLength={6}
            placeholder="000000"
            className="w-full p-2 text-center text-2xl tracking-widest border rounded"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button 
            onClick={handleVerify}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            {loading ? 'Verifying...' : 'Verify & Continue'}
          </button>
          <button onClick={() => setStep('email')} className="text-sm text-blue-500 w-full text-center">
            Change Email
          </button>
        </div>
      )}

      {/* STEP 2: THE WORKSPACE */}
      {step === 'verified' && (
        <div className="animate-in fade-in duration-500">
          <div className="bg-green-50 text-green-700 p-3 rounded mb-4 text-center">
            ✓ Identity Verified
          </div>
          {/* PLACE YOUR AI INPUT FORM HERE */}
          <p className="text-gray-600">You are now ready to generate and send emails.</p>
        </div>
      )}
    </div>
  );
}