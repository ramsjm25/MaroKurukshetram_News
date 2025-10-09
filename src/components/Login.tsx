import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import apiClient from '@/api/apiClient';
import ForgotPassword from './ForgotPassword';
import VerifyOTP from './VerifyOTP';
import ResetPassword from './ResetPassword';

interface LoginProps {
  onSuccess: (user: any) => void;
  onSwitchToSignup: () => void;
  onError: (error: string) => void;
  onClearError?: () => void;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  token?: string;
}

interface LoginResponse {
  status: number;
  message: string;
  token?: string;
  user?: User;
  result?: User;
  data?: User;
}

const Login = ({ onSuccess, onSwitchToSignup, onError, onClearError }: LoginProps) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
  });
  const [currentStep, setCurrentStep] = useState<'login' | 'forgot' | 'verify' | 'reset'>('login');
  const [forgotPasswordData, setForgotPasswordData] = useState<{
    email: string;
    code: string;
  }>({ email: '', code: '' });

  const validateForm = () => {
    if (!formData.emailOrPhone || !formData.password) {
      onError(t("auth.fillAllFields") || "Please fill all fields");
      return false;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    
    if (!emailRegex.test(formData.emailOrPhone) && !phoneRegex.test(formData.emailOrPhone)) {
      onError(t("auth.invalidEmail") || "Please enter a valid email or 10-digit phone number");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const payload = {
        emailOrPhone: formData.emailOrPhone,
        password: formData.password,
      };

      const res = await apiClient.post<LoginResponse>("/auth/userLogin", payload);
      console.log("Login API response:", res.data);
      
      // Handle different response structures
      let userData: User;
      const responseData = res.data;
      
      if (responseData.user) {
        userData = responseData.user;
      } else if (responseData.result) {
        userData = responseData.result;
      } else if (responseData.data) {
        userData = responseData.data;
      } else {
        userData = responseData as unknown as User;
      }
      
      console.log("Extracted user data:", userData);

      // Store token if available
      if (responseData.token) {
        localStorage.setItem("token", responseData.token);
        console.log("Token stored:", responseData.token);
      } else if (userData.token) {
        localStorage.setItem("token", userData.token);
        console.log("Token stored from userData:", userData.token);
      }

      // Validate that we have required user data
      if (!userData.id || !userData.firstName || !userData.email) {
        throw new Error("Invalid user data received from server");
      }

      // Store user data in localStorage
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("isLoggedIn", "true");
      
      onSuccess(userData);
      setFormData({ emailOrPhone: "", password: "" });

    } catch (err: any) {
      console.error("Login error:", err);
      
      let errorMessage = t("auth.loginFailed");
      
      // Handle different types of errors
      if (err?.response?.status === 401) {
        errorMessage = t("auth.invalidCredentials") || "Invalid email/phone or password";
      } else if (err?.response?.status === 404) {
        errorMessage = t("auth.userNotFound") || "User not found";
      } else if (err?.response?.status === 500) {
        errorMessage = t("errors.serverError");
      } else if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (err?.type === 'NETWORK_ERROR') {
        errorMessage = t("errors.connectionIssue");
      } else if (err?.type === 'SERVER_ERROR') {
        errorMessage = t("errors.serverError");
      } else if (err?.type === 'CORS_ERROR') {
        errorMessage = t("errors.connectionIssue");
      }
      
      onError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (onClearError) {
      onClearError();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleForgotPasswordSuccess = (email: string) => {
    setForgotPasswordData(prev => ({ ...prev, email }));
    setCurrentStep('verify');
  };

  const handleVerifyOTPSuccess = (email: string, code: string) => {
    setForgotPasswordData({ email, code });
    setCurrentStep('reset');
  };

  const handleResetPasswordSuccess = () => {
    setCurrentStep('login');
    setForgotPasswordData({ email: '', code: '' });
    // Show success message instead of error
    onError(t("auth.passwordResetSuccess") || "Password reset successfully! Please login with your new password.");
  };

  const handleBackToLogin = () => {
    setCurrentStep('login');
    setForgotPasswordData({ email: '', code: '' });
    if (onClearError) {
      onClearError();
    }
  };

  const handleResendOTP = async () => {
    // This will be handled by the VerifyOTP component
    return Promise.resolve();
  };

  // Render different components based on current step
  if (currentStep === 'forgot') {
    return (
      <ForgotPassword
        onBack={handleBackToLogin}
        onSuccess={handleForgotPasswordSuccess}
      />
    );
  }

  if (currentStep === 'verify') {
    return (
      <VerifyOTP
        email={forgotPasswordData.email}
        onBack={() => setCurrentStep('forgot')}
        onSuccess={handleVerifyOTPSuccess}
        onResend={handleResendOTP}
      />
    );
  }

  if (currentStep === 'reset') {
    return (
      <ResetPassword
        email={forgotPasswordData.email}
        code={forgotPasswordData.code}
        onBack={() => setCurrentStep('verify')}
        onSuccess={handleResetPasswordSuccess}
      />
    );
  }

  // Default login form
  return (
    <div className="w-full max-w-md mx-auto px-4 sm:px-6">
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div className="flex justify-center mb-6 sm:mb-8">
          <img
            src="/lovable-uploads/3b336ab1-e951-42a8-b0c4-758eed877e6a.png"
            alt="App Logo"
            className="h-16 w-28 sm:h-18 sm:w-32"
          />
        </div>

        <div className="space-y-4 sm:space-y-5">
          <Input
            placeholder={t("auth.emailOrPhone") || "Email or Phone"}
            value={formData.emailOrPhone}
            onChange={(e) => handleInputChange("emailOrPhone", e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            className="w-full h-12 sm:h-11 text-base sm:text-sm px-4 py-3 sm:py-2.5"
            autoComplete="username"
          />

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder={t("auth.password") || "Password"}
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              className="w-full h-12 sm:h-11 text-base sm:text-sm px-4 py-3 sm:py-2.5 pr-12"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              disabled={loading}
            >
              {showPassword ? <EyeOff className="h-5 w-5 sm:h-4 sm:w-4" /> : <Eye className="h-5 w-5 sm:h-4 sm:w-4" />}
            </button>
          </div>

          <Button
            type="submit"
            disabled={loading || !formData.emailOrPhone || !formData.password}
            className="w-full h-12 sm:h-11 bg-red-500 hover:bg-red-600 text-white text-base sm:text-sm font-medium rounded-lg transition-colors"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin rounded-full h-5 w-5 sm:h-4 sm:w-4 border-b-2 border-white"></span>
                {t("common.loading") || "Loading..."}
              </span>
            ) : (
              t("auth.login") || "Login"
            )}
          </Button>
        </div>

        <div className="text-center pt-2">
          <p className="text-sm sm:text-sm text-gray-600">
            {t("auth.noAccount") || "Don't have an account?"}{" "}
            <button
              type="button"
              className="text-red-600 underline hover:text-red-700 transition-colors font-medium"
              onClick={onSwitchToSignup}
              disabled={loading}
            >
              {t("auth.signup") || "Sign up"}
            </button>
          </p>
        </div>

        <div className="text-center">
          <button
            type="button"
            className="text-sm sm:text-sm text-red-600 underline hover:text-red-700 transition-colors font-medium"
            onClick={() => setCurrentStep('forgot')}
            disabled={loading}
          >
            {t("auth.forgotPassword") || "Forgot Password?"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;