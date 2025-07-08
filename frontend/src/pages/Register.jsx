import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { motion } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff, UserPlus } from "lucide-react";
import { authAPI } from "../services/api";

const RegisterContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);

  @media (min-width: 640px) {
    padding: 2rem;
  }
`;

const RegisterCard = styled(motion.div)`
  background: rgba(30, 41, 59, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 2rem;
  padding: 2rem;
  width: 100%;
  max-width: 450px;
  border: 1px solid rgba(148, 163, 184, 0.1);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);

  @media (min-width: 640px) {
    padding: 3rem;
  }
`;

const RegisterHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const RegisterTitle = styled.h1`
  font-size: 2rem;
  font-weight: 900;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #06b6d4 0%, #2563eb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const RegisterSubtitle = styled.p`
  color: #94a3b8;
  font-size: 0.9rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border-radius: 1rem;
  border: 2px solid rgba(148, 163, 184, 0.2);
  background: rgba(15, 23, 42, 0.5);
  color: #fff;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;
  box-sizing: border-box;
  min-height: 3rem;

  &:focus {
    border-color: #06b6d4;
    box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
  }

  &::placeholder {
    color: #64748b;
  }

  @media (max-width: 640px) {
    font-size: 16px; /* Prevents zoom on iOS */
    padding: 0.875rem 1rem 0.875rem 2.75rem;
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
  z-index: 1;

  @media (max-width: 640px) {
    left: 0.875rem;
  }
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  z-index: 1;
  padding: 0.25rem;

  &:hover {
    color: #06b6d4;
  }

  @media (max-width: 640px) {
    right: 0.875rem;
  }
`;

const RegisterButton = styled.button`
  width: 100%;
  padding: 1rem;
  border-radius: 1rem;
  border: none;
  background: linear-gradient(135deg, #06b6d4 0%, #2563eb 100%);
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(6, 182, 212, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  color: #64748b;
  font-size: 0.9rem;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: rgba(148, 163, 184, 0.2);
  }

  span {
    padding: 0 1rem;
  }
`;

const GoogleButton = styled.button`
  width: 100%;
  padding: 1rem;
  border-radius: 1rem;
  border: 2px solid rgba(148, 163, 184, 0.2);
  background: rgba(15, 23, 42, 0.5);
  color: #e2e8f0;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    border-color: #06b6d4;
    color: #06b6d4;
  }
`;

const Footer = styled.div`
  text-align: center;
  margin-top: 2rem;
  color: #94a3b8;
  font-size: 0.9rem;
`;

const FooterLink = styled(Link)`
  color: #06b6d4;
  text-decoration: none;
  font-weight: 600;

  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.div`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #fca5a5;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const SuccessMessage = styled.div`
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  color: #86efac;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const PasswordStrength = styled.div`
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: ${(props) => {
    if (props.strength === "weak") return "#fca5a5";
    if (props.strength === "medium") return "#fbbf24";
    if (props.strength === "strong") return "#86efac";
    return "#64748b";
  }};
`;

const PasswordRequirements = styled.div`
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: #64748b;
`;

const Requirement = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-bottom: 0.25rem;

  &.met {
    color: #86efac;
  }

  &.unmet {
    color: #fca5a5;
  }
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(""); // Clear error when user types
  };

  const getPasswordStrength = (password) => {
    if (password.length === 0) return "";

    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;

    if (score < 3) return "weak";
    if (score < 5) return "medium";
    return "strong";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    // Check password complexity requirements
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (!passwordRegex.test(formData.password)) {
      setError(
        "Password must contain at least one lowercase letter, one uppercase letter, and one number"
      );
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      setSuccess("Account created successfully! Redirecting to login...");

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    // TODO: Implement Google OAuth
    console.log("Google register clicked");
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <RegisterContainer>
      <RegisterCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <RegisterHeader>
          <RegisterTitle>Join ReelDeal</RegisterTitle>
          <RegisterSubtitle>
            Create your account to get started
          </RegisterSubtitle>
        </RegisterHeader>

        <Form onSubmit={handleSubmit}>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}

          <FormGroup>
            <InputIcon>
              <User size={20} />
            </InputIcon>
            <Input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <InputIcon>
              <Mail size={20} />
            </InputIcon>
            <Input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <InputWrapper>
              <InputIcon>
                <Lock size={20} />
              </InputIcon>
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </PasswordToggle>
            </InputWrapper>
            {formData.password && (
              <>
                <PasswordStrength strength={passwordStrength}>
                  Password strength: {passwordStrength}
                </PasswordStrength>
                <PasswordRequirements>
                  <Requirement
                    className={formData.password.length >= 6 ? "met" : "unmet"}
                  >
                    {formData.password.length >= 6 ? "✓" : "✗"} At least 6
                    characters
                  </Requirement>
                  <Requirement
                    className={
                      /[a-z]/.test(formData.password) ? "met" : "unmet"
                    }
                  >
                    {/[a-z]/.test(formData.password) ? "✓" : "✗"} One lowercase
                    letter
                  </Requirement>
                  <Requirement
                    className={
                      /[A-Z]/.test(formData.password) ? "met" : "unmet"
                    }
                  >
                    {/[A-Z]/.test(formData.password) ? "✓" : "✗"} One uppercase
                    letter
                  </Requirement>
                  <Requirement
                    className={/\d/.test(formData.password) ? "met" : "unmet"}
                  >
                    {/\d/.test(formData.password) ? "✓" : "✗"} One number
                  </Requirement>
                </PasswordRequirements>
              </>
            )}
          </FormGroup>

          <FormGroup>
            <InputWrapper>
              <InputIcon>
                <Lock size={20} />
              </InputIcon>
              <Input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </PasswordToggle>
            </InputWrapper>
          </FormGroup>

          <RegisterButton type="submit" disabled={loading}>
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Creating account...
              </>
            ) : (
              <>
                <UserPlus size={20} />
                Create Account
              </>
            )}
          </RegisterButton>
        </Form>

        <Divider>
          <span>or</span>
        </Divider>

        <GoogleButton onClick={handleGoogleRegister}>
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </GoogleButton>

        <Footer>
          Already have an account? <FooterLink to="/login">Sign in</FooterLink>
        </Footer>
      </RegisterCard>
    </RegisterContainer>
  );
}

export default Register;
