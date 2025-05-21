import axios from "axios"
import { useEffect, useState } from "react"
import { FiLock, FiMail, FiRefreshCw } from "react-icons/fi"
import { useNavigate } from "react-router-dom"


function ForgotePass() {
    const [email, setEmail] = useState('')
    const [otp, setOtp] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [step, setStep] = useState(1) // 1 for email, 2 for OTP, 3 successfull reset
    const [loading, setLoading] = useState(false);
    const [resendDisabled, setResendDisabled] = useState(false);
    const [countdown, setCountdown] = useState(30);
      const [error, setError] = useState('');
  const Navigate = useNavigate();


     // Countdown timer for OTP resend
     useEffect(() => {
        if (resendDisabled && countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0) {
            setResendDisabled(false);
        }
    }, [resendDisabled, countdown]);

    // Step 1: Send OTP
    const handleSendOtp = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await axios.post('/api/v1/user/forgot-password/request', { email });
            setStep(2); // Move to OTP step
            setResendDisabled(true);
            setCountdown(30);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOtp = async () => {
        setLoading(true);
        setError('');
        try {
            await axios.post('/api/v1/user/forgot-password/verify', { email, otp });
            setStep(4); // Move to password reset step
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to verify OTP');
        } finally {
            setLoading(false);
        }
    };

    // Step 3: Reset Password
    const handleResetPassword = async () => {
        setLoading(true);
        setError('');
        try {
            await axios.post('/api/v1/user/forgot-password/reset', { email, otp, newPassword });
            setStep(3); // Move to success step
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-2xl font-bold mb-4 text-gray-600">
                {step === 1 && 'Forgot Password'}
                {step === 2 && 'Verify OTP'}
                {step === 4 && 'Reset Password'}
            </h1>
            {error && <div className="text-red-500 mb-2">{error}</div>}
            {step === 1 && (
                <>
                    <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email address
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiMail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          value={email}
                          onChange={(e)=>setEmail(e.target.value)}
                          className="py-2 pl-10 block w-full border text-gray-800 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="you@example.com" />
                  </div>
                    </div>
                    {/* <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        New  Password
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FiLock className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                              id="password"
                              name="password"
                              type="password"
                              autoComplete="new-password"
                              required
                              minLength="8"
                              value={newPassword}
                              onChange={(e)=>setNewPassword(e.target.value)}
                              onFocus={() => setError('')}
                              className="py-2 pl-10 block w-full text-gray-800 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                              placeholder="••••••••" />
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                          Minimum 8 characters
                      </p>
                  </div> */}
                    <button
                        onClick={handleSendOtp}
                        disabled={loading}
                        className="bg-blue-500 text-white p-2 rounded mt-3"
                    >
                        {loading ? 'Loading...' : 'Send OTP'}
                    </button>
                </>
            )}
            {step === 2 && (
                <div className="w-full max-w-xs">
                    <input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="border border-gray-300 p-2 text-gray-800 rounded mb-4 w-full"
                    />
                    <div className="flex items-center justify-between">
                        <button
                            type="button"
                            onClick={handleSendOtp}
                            disabled={resendDisabled || loading}
                            className="text-sm font-medium text-white mb-4 bg-blue-500 hover:text-gray-400 flex items-center"
                        >
                            <FiRefreshCw className={`mr-1 ${resendDisabled ? 'opacity-50' : ''}`} />
                            {resendDisabled ? `Resend in ${countdown}s` : 'Resend OTP'}
                        </button>
                    </div>
                    <button
                        onClick={handleVerifyOtp}
                        className="text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 w-full"
                    >
                        {loading ? 'Verifying...' : 'Verify OTP'}
                    </button>
                </div>
            )}
            {step === 4 && (
                <div className="w-full max-w-xs">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        New Password
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiLock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            required
                            minLength="8"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            onFocus={() => setError('')}
                            className="py-2 pl-10 block w-full text-gray-800 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        onClick={handleResetPassword}
                        className="text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 w-full mt-4"
                    >
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </div>
            )}
            {step === 3 && (
                <div className="w-full max-w-xs">
                    <h2 className="text-lg font-bold mb-4 text-green-500 text-center">Password Reset Successful</h2>
                    <p className="text-gray-600 mb-4">You can now log in with your new password.</p>
                </div>
            )}
            <div className="mt-4">
                <button
                    onClick={() => Navigate('/login')}
                    className="text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                >
                    Back to Login
                </button>
            </div>
        </div>
    );
}

export default ForgotePass;
