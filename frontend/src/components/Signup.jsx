import { useState, useEffect, useRef } from "react";
import { FiUser, FiMail, FiLock, FiRefreshCw } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const Signup = () => {
  const navigate = useNavigate();

  const {
    register,
    verifyOtp,
    resendOtp,
    tempEmail,
    step,
    loading,
    resetSignupFlow,
  } = useAuthStore();


  /* ================= FORM STATE ================= */
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  /* ================= OTP STATE ================= */
  const [otp, setOtp] = useState(Array(6).fill(""));
  const otpRefs = useRef([]);

  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(30);

  /* ================= OTP COUNTDOWN ================= */
  useEffect(() => {
    if (!resendDisabled) return;

    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c === 1) {
          clearInterval(timer);
          setResendDisabled(false);
          return 30;
        }
        return c - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [resendDisabled]);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* REGISTER */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await register(formData);
    if (success) setResendDisabled(true);
  };

  /* OTP INPUT HANDLER */
  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  /* VERIFY OTP */
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    const code = otp.join("");
    if (code.length !== 6) return;

    const success = await verifyOtp({
      email: tempEmail,
      otp: code,
    });

    if (success) {
      resetSignupFlow();                 // ✅ MOST IMPORTANT LINE
      navigate("/login", { replace: true });
    }
  };


  /* RESEND OTP */
  const handleResendOtp = async () => {
    const success = await resendOtp(tempEmail);
    if (success) setResendDisabled(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          {step === 1 ? "Create Account" : "Verify Email"}
        </h2>

        {step === 1 && (
          <p className="text-center text-sm text-gray-500 mt-2">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 font-medium">
              Sign in
            </Link>
          </p>
        )}

        {/* ================= STEP 1 ================= */}
        {step === 1 ? (
          <form onSubmit={handleSubmit} className="space-y-5 mt-6">
            <Input
              label="Full Name"
              icon={<FiUser />}
              name="name"
              value={formData.name}
              onChange={handleChange}
            />

            <Input
              label="Email Address"
              icon={<FiMail />}
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />

            <Input
              label="Password"
              icon={<FiLock />}
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              helper="Minimum 8 characters"
            />

            <button
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition disabled:opacity-70"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
        ) : (
            /* ================= STEP 2 ================= */
            <form onSubmit={handleVerifyOtp} className="mt-6 space-y-6">
              <p className="text-sm text-gray-600 text-center">
                OTP sent to <b>{tempEmail}</b>
              </p>

              {/* OTP BOXES */}
              <div className="flex justify-center gap-1 sm:gap-2 md:gap-3">
                {otp.map((digit, i) => (
                  <input
      key={i}
      ref={(el) => (otpRefs.current[i] = el)}
      value={digit}
      onChange={(e) => handleOtpChange(e.target.value, i)}
      onKeyDown={(e) => handleOtpKeyDown(e, i)}
      maxLength={1}
      inputMode="numeric"
      className="
        w-9 h-9 text-base
        sm:w-11 sm:h-11 sm:text-lg
        md:w-12 md:h-12 md:text-xl
        lg:w-14 lg:h-14
        text-center
        border rounded-lg
        text-gray-900
        focus:ring-2 focus:ring-indigo-500
        focus:outline-none
        transition
      "
    />
  ))}
              </div>


              {/* RESEND */}
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendDisabled || loading}
                className={`flex items-center justify-center gap-2 text-sm font-medium mx-auto
                ${resendDisabled
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-indigo-600 hover:text-indigo-700"
                  }
              `}
              >
                <FiRefreshCw />
                {resendDisabled ? `Resend in ${countdown}s` : "Resend OTP"}
              </button>

              <button
                disabled={loading}
                className="w-full py-2.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
          </form>
        )}
      </div>
    </div>
  );
};

/* ================= REUSABLE INPUT ================= */
const Input = ({ label, icon, helper, ...props }) => (
  <div>
    <label className="text-sm font-medium text-gray-600">{label}</label>
    <div className="relative mt-1">
      <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
        {icon}
      </span>
      <input
        {...props}
        required
        className="w-full pl-10 py-2.5 border rounded-lg text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
      />
    </div>
    {helper && <p className="text-xs text-gray-400 mt-1">{helper}</p>}
  </div>
);

export default Signup;
