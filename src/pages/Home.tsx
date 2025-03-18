import React, { useState, useRef } from 'react';
import { Mail, CheckCircle, XCircle, ArrowRight, AlertCircle, Info } from 'lucide-react';

interface ValidationResponse {
  result: string;
  reason: string;
  disposable: string;
  accept_all: string;
  role: string;
  free: string;
  email: string;
  user: string;
  domain: string;
  mx_record: string;
  mx_domain: string;
  safe_to_send: string;
  did_you_mean: string;
  success: string;
  message: string;
}

function Home() {
  const [email, setEmail] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResponse | null>(null);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOTP] = useState(['', '', '', '', '', '']);
  const otpRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const handleOTPChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOTP = [...otp];
      newOTP[index] = value;
      setOTP(newOTP);

      // Move to next input if value is entered
      if (value !== '' && index < 5) {
        otpRefs[index + 1].current?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const validateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsValidating(true);
    setValidationResult(null);

    try {
      const response = await fetch('http://localhost:5000/api/v1/admin/emailvalidator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setValidationResult(data);
      setShowOTP(true); // Show OTP input after validation
    } catch (error) {
      console.error('Error validating email:', error);
    } finally {
      setIsValidating(false);
    }
  };

  const verifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    // Add your OTP verification logic here
    console.log('Verifying OTP:', otpValue);
  };

  const getStatusColor = (result: string) => {
    switch (result) {
      case 'valid':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
      case 'invalid':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      default:
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80"
            alt="Background"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/95 to-gray-900/90" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pt-20 pb-16 sm:pt-32 sm:pb-24">
            <div className="text-center">
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 mb-6">
                Email Validation Made Simple
              </h1>
              <p className="max-w-2xl mx-auto text-xl text-gray-300 mb-12">
                Validate any email address instantly with our powerful validation service.
                Ensure your communications reach real inboxes.
              </p>

              {/* Email Validation Form */}
              <div className="max-w-xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-gray-700">
                <form onSubmit={validateEmail} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter email address"
                      className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isValidating}
                    className="w-full bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center space-x-2 transition duration-200 disabled:opacity-50"
                  >
                    {isValidating ? (
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Validate Email</span>
                        <ArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </button>
                </form>

                {/* OTP Input Section */}
                {showOTP && (
                  <div className="mt-6 pt-6 border-t border-gray-700">
                    <h3 className="text-lg font-medium mb-4">Enter Verification Code</h3>
                    <form onSubmit={verifyOTP}>
                      <div className="flex justify-center gap-2 mb-4">
                        {otp.map((digit, index) => (
                          <input
                            key={index}
                            ref={otpRefs[index]}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOTPChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            className="w-12 h-12 text-center text-xl font-semibold bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200"
                          />
                        ))}
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
                      >
                        Verify Code
                      </button>
                    </form>
                  </div>
                )}

                {validationResult && (
                  <div className="mt-4 space-y-4">
                    {/* Main Status */}
                    <div className={`p-4 rounded-lg border flex items-start space-x-3 ${getStatusColor(validationResult.result)}`}>
                      {validationResult.result === 'valid' ? (
                        <CheckCircle className="h-5 w-5 flex-shrink-0" />
                      ) : validationResult.result === 'invalid' ? (
                        <XCircle className="h-5 w-5 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{validationResult.message}</p>
                        {validationResult.did_you_mean && (
                          <p className="mt-1 text-sm">
                            Did you mean: <strong>{validationResult.did_you_mean}</strong>?
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Detailed Results */}
                    <div className="bg-gray-800/50 rounded-lg border border-gray-700 divide-y divide-gray-700">
                      <div className="p-4">
                        <h3 className="text-lg font-medium mb-2 flex items-center">
                          <Info className="h-5 w-5 mr-2" />
                          Detailed Analysis
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-400">Domain: <span className="text-white">{validationResult.domain}</span></p>
                            <p className="text-gray-400">User: <span className="text-white">{validationResult.user}</span></p>
                            <p className="text-gray-400">Free Provider: <span className="text-white">{validationResult.free === 'true' ? 'Yes' : 'No'}</span></p>
                            <p className="text-gray-400">Role Address: <span className="text-white">{validationResult.role === 'true' ? 'Yes' : 'No'}</span></p>
                          </div>
                          <div>
                            <p className="text-gray-400">Disposable: <span className="text-white">{validationResult.disposable === 'true' ? 'Yes' : 'No'}</span></p>
                            <p className="text-gray-400">Accept All: <span className="text-white">{validationResult.accept_all === 'true' ? 'Yes' : 'No'}</span></p>
                            <p className="text-gray-400">Safe to Send: <span className="text-white">{validationResult.safe_to_send === 'true' ? 'Yes' : 'No'}</span></p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: 'Real-time Validation',
              description: 'Get instant feedback on email validity with our powerful API.',
            },
            {
              title: 'Accurate Results',
              description: 'Advanced algorithms ensure highly accurate validation results.',
            },
            {
              title: 'Simple Integration',
              description: 'Easy to integrate with your existing applications and workflows.',
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-700"
            >
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;