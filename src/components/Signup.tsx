import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import apiClient from '@/api/apiClient';
import { apiService } from '@/services/api';
import { Role } from '@/api/apiTypes';

// ROLE_ID will be fetched dynamically from API
const DEFAULT_ROLE_ID = "4f8617f0-a33e-4cc8-9971-704277715354"; // Fallback role ID

interface SignupProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
  onError: (error: string) => void;
  onClearError?: () => void;
}

const Signup = ({ onSuccess, onSwitchToLogin, onError, onClearError }: SignupProps) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string>(DEFAULT_ROLE_ID);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  // Fetch roles on component mount
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const rolesData = await apiService.getRoles();
        setRoles(rolesData);
        // Auto-select the first role if available
        if (rolesData.length > 0) {
          setSelectedRoleId(rolesData[0].id);
        }
      } catch (error) {
        console.error('Error fetching roles:', error);
        // Use default role ID if API fails
        setSelectedRoleId(DEFAULT_ROLE_ID);
      }
    };

    fetchRoles();
  }, []);

  const validateForm = () => {
    const requiredFields = [
      "firstName",
      "lastName", 
      "email",
      "phone",
      "password",
      "confirmPassword",
    ];

    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData].trim()) {
        onError(t("auth.fillAllFields") || "Please fill all fields");
        return false;
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      onError(t("auth.invalidEmail") || "Please enter a valid email address");
      return false;
    }

    // Phone validation (10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phone.replace(/\D/g, ""))) {
      onError(t("auth.invalidPhone") || "Please enter a valid 10-digit phone number");
      return false;
    }

    // Password length validation
    if (formData.password.length < 6) {
      onError(t("auth.passwordTooShort") || "Password must be at least 6 characters long");
      return false;
    }

    // Password match validation
    if (formData.password !== formData.confirmPassword) {
      onError(t("auth.passwordMismatch") || "Passwords do not match");
      return false;
    }

    // Password strength validation (optional but recommended)
    const passwordStrengthRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (!passwordStrengthRegex.test(formData.password)) {
      onError(
        t("auth.weakPassword") || 
        "Password should contain at least one uppercase letter, one lowercase letter, and one number"
      );
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

      const { confirmPassword, ...payload } = formData;

      const response = await apiClient.post(`/auth/register`, {
        ...payload,
        roleId: selectedRoleId,
      });

      console.log("Signup successful:", response.data);
      onSuccess();
      
      // Reset form after successful signup
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });

    } catch (err: any) {
      console.error("Signup error:", err);
      
      let errorMessage = "Registration failed. Please try again.";
      
      // Handle 409 Conflict - User already exists
      if (err?.response?.status === 409) {
        const details = err?.response?.data?.details || err?.details;
        if (details && typeof details === 'string') {
          try {
            const parsedDetails = JSON.parse(details);
            errorMessage = parsedDetails.message || "User already exists with this email or phone number.";
          } catch {
            errorMessage = "User already exists with this email or phone number.";
          }
        } else {
          errorMessage = "User already exists with this email or phone number.";
        }
      } else if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (err?.type === 'NETWORK_ERROR') {
        errorMessage = "Network error. Please check your internet connection.";
      } else if (err?.type === 'SERVER_ERROR') {
        errorMessage = "Server error. Please try again later.";
      } else if (err?.type === 'CORS_ERROR') {
        errorMessage = "Connection error. Please refresh the page and try again.";
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <Input
              placeholder={t("auth.firstName") || "First Name"}
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              className="w-full h-12 sm:h-11 text-base sm:text-sm px-4 py-3 sm:py-2.5"
              autoComplete="given-name"
            />

            <Input
              placeholder={t("auth.lastName") || "Last Name"}
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              className="w-full h-12 sm:h-11 text-base sm:text-sm px-4 py-3 sm:py-2.5"
              autoComplete="family-name"
            />
          </div>

        <Input
          type="email"
          placeholder={t("auth.email") || "Email"}
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
          className="w-full h-12 sm:h-11 text-base sm:text-sm px-4 py-3 sm:py-2.5"
          autoComplete="email"
        />

        <Input
          type="tel"
          placeholder={t("auth.phone") || "Phone"}
          value={formData.phone}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");
            if (value.length <= 10) {
              handleInputChange("phone", value);
            }
          }}
          onKeyPress={handleKeyPress}
          disabled={loading}
          className="w-full h-12 sm:h-11 text-base sm:text-sm px-4 py-3 sm:py-2.5"
          maxLength={10}
          autoComplete="tel"
        />

        {/* Role Selection */}
        <div className="w-full">
          <select
            value={selectedRoleId}
            onChange={(e) => setSelectedRoleId(e.target.value)}
            disabled={loading}
            className="w-full h-12 sm:h-11 text-base sm:text-sm px-4 py-3 sm:py-2.5 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.role} {role.description && `- ${role.description}`}
              </option>
            ))}
          </select>
        </div>

        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder={t("auth.password") || "Password"}
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            className="w-full h-12 sm:h-11 text-base sm:text-sm px-4 py-3 sm:py-2.5 pr-12"
            autoComplete="new-password"
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

        <div className="relative">
          <Input
            type={showConfirmPassword ? "text" : "password"}
            placeholder={t("auth.confirmPassword") || "Confirm Password"}
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            className="w-full h-12 sm:h-11 text-base sm:text-sm px-4 py-3 sm:py-2.5 pr-12"
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
            disabled={loading}
          >
            {showConfirmPassword ? <EyeOff className="h-5 w-5 sm:h-4 sm:w-4" /> : <Eye className="h-5 w-5 sm:h-4 sm:w-4" />}
          </button>
        </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 sm:h-11 bg-red-500 hover:bg-red-600 text-white text-base sm:text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin rounded-full h-5 w-5 sm:h-4 sm:w-4 border-b-2 border-white"></span>
                {t("common.loading") || "Loading..."}
              </span>
            ) : (
              t("auth.signup") || "Sign Up"
            )}
          </Button>
        </div>

        <div className="text-center pt-2">
          <p className="text-sm sm:text-sm text-gray-600">
            {t("auth.alreadyHaveAccount") || "Already have an account?"}{" "}
            <button
              type="button"
              className="text-red-600 underline hover:text-red-700 transition-colors font-medium"
              onClick={onSwitchToLogin}
              disabled={loading}
            >
              {t("auth.login") || "Login"}
            </button>
          </p>
        </div>

        <div className="text-center">
          <p className="text-xs sm:text-xs text-gray-500 leading-relaxed">
            {t("auth.termsAgreement") || "By signing up, you agree to our"}{" "}
            <button 
              type="button" 
              className="text-red-600 underline hover:text-red-700 transition-colors font-medium"
              disabled={loading}
            >
              {t("auth.termsOfService") || "Terms of Service"}
            </button>{" "}
            {t("common.and") || "and"}{" "}
            <button 
              type="button" 
              className="text-red-600 underline hover:text-red-700 transition-colors font-medium"
              disabled={loading}
            >
              {t("auth.privacyPolicy") || "Privacy Policy"}
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Signup;