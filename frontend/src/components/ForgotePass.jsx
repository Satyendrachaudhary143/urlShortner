import { useEffect } from "react";
import { FiMail, FiLock, FiRefreshCw } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useForgotPasswordStore } from "../store/forgotPasswordStore";

const ForgotPassword = () => {
    const navigate = useNavigate();

    const {
        email,
        otp,
        newPassword,
        step,
        loading,
        error,
        resendDisabled,
        countdown,
        setField,
        sendOtp,
        verifyOtp,
        resetPassword,
        tick,
    } = useForgotPasswordStore();

    /* OTP countdown */
    useEffect(() => {
        if (resendDisabled) {
            const timer = setInterval(tick, 1000);
            return () => clearInterval(timer);
        }
    }, [resendDisabled, tick]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    {step === 1 && "Forgot Password"}
                    {step === 2 && "Verify OTP"}
                    {step === 4 && "Reset Password"}
                    {step === 3 && "Success 🎉"}
                </h2>

                {error && (
                    <div className="mb-4 p-3 text-sm bg-red-50 border border-red-200 text-red-600 rounded-lg">
                        {error}
                    </div>
                )}

                {/* STEP 1 */}
                {step === 1 && (
                    <>
                        <label className="text-sm font-medium text-gray-700">
                            Email Address
                        </label>
                        <div className="relative mt-1 mb-5">
                            <FiMail className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setField("email", e.target.value)}
                                className="w-full pl-10 py-2 border text-black rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="you@example.com"
                            />
                      </div>

                        <button
                            onClick={sendOtp}
                            disabled={loading}
                            className="w-full py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                        >
                            {loading ? "Sending OTP..." : "Send OTP"}
                        </button>
                    </>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                    <>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setField("otp", e.target.value)}
                            placeholder="Enter OTP"
                            className="w-full py-2 px-3 border rounded-lg mb-4 text-black"
                        />

                        <button
                            onClick={verifyOtp}
                            className="w-full py-2 mb-3 rounded-lg bg-blue-600 text-white"
                        >
                            {loading ? "Verifying..." : "Verify OTP"}
                        </button>

                        <button
                            onClick={sendOtp}
                            disabled={resendDisabled}
                            className="text-sm text-blue-600 flex items-center justify-center gap-2"
                        >
                            <FiRefreshCw />
                            {resendDisabled ? `Resend in ${countdown}s` : "Resend OTP"}
                        </button>
                    </>
                )}

                {/* STEP 4 */}
                {step === 4 && (
                    <>
                        <label className="text-sm font-medium text-gray-700">
                            New Password
                        </label>
                        <div className="relative mt-1 mb-5">
                            <FiLock className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setField("newPassword", e.target.value)}
                                className="w-full pl-10 py-2 border rounded-lg text-black"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            onClick={resetPassword}
                            className="w-full py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                        >
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </>
                )}

                {/* STEP 3 */}
                {step === 3 && (
                    <div className="text-center">
                        <p className="text-green-600 font-semibold mb-4">
                            Password reset successful 🎉
                        </p>
                        <button
                            onClick={() => navigate("/login")}
                            className="w-full py-2 rounded-lg bg-blue-600 text-white"
                        >
                            Back to Login
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
