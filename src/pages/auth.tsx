"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Logo } from "@/components/ui/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { Receipt } from "lucide-react"
import { ThemeAwareAddButton } from "@/components/ui/custom-theme-components"
import { useNavigate } from "react-router-dom"

interface ValidationErrors {
  email?: string;
  password?: string;
}


export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
  const { login, register } = useAuth()
  const navigate = useNavigate()

  const validateEmail = (email: string): string | undefined => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) return "Email is required"
    if (!emailRegex.test(email)) return "Please enter a valid email address"
    return undefined
  }

  const validatePassword = (password: string): string | undefined => {
    if (!password) return "Password is required"
    
    // Only apply strict validation during registration
    if (!isLogin) {
      if (password.length < 8) return "Password must be at least 8 characters long"
      if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter"
      if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter"
      if (!/[0-9]/.test(password)) return "Password must contain at least one number"
      if (!/[!@#$%^&*]/.test(password)) return "Password must contain at least one special character (!@#$%^&*)"
    }
    
    return undefined
  }

  const validateForm = (): boolean => {
    const emailError = validateEmail(email)
    const passwordError = validatePassword(password)
    
    setValidationErrors({
      email: emailError,
      password: passwordError
    })

    return !emailError && !passwordError
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setValidationErrors({})

    if (!validateForm()) {
      return
    }

    try {
      if (isLogin) {
        await login(email, password)
        
        navigate("/")
      } else {
        await register(email, password)
        navigate("/")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="w-full flex flex-col">
        <div className="absolute top-6 left-6">
          <Logo showTagline={true} />
        </div>
        <div className="absolute top-6 right-6">
          <ThemeToggle />
        </div>
        
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md space-y-8 rounded-xl shadow-lg p-8 backdrop-blur-sm">
            <div className="text-center">
              <h2 className="text-2xl font-bold tracking-tight">
                {isLogin ? "Welcome back" : "Create your account"}
              </h2>
              <p className="text-sm text-muted-foreground mt-2">
                {isLogin 
                  ? "Enter your credentials to access your account"
                  : "Fill in your details to get started"}
              </p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setValidationErrors(prev => ({ ...prev, email: undefined }))
                    }}
                    className={`mt-1.5 ${validationErrors.email ? 'border-red-500' : ''}`}
                    placeholder="Enter your email"
                  />
                  {validationErrors.email && (
                    <p className="mt-1 text-sm text-red-500">{validationErrors.email}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete={isLogin ? "current-password" : "new-password"}
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setValidationErrors(prev => ({ ...prev, password: undefined }))
                    }}
                    className={`mt-1.5 ${validationErrors.password ? 'border-red-500' : ''}`}
                    placeholder="Enter your password"
                  />
                  {validationErrors.password && (
                    <p className="mt-1 text-sm text-red-500">{validationErrors.password}</p>
                  )}
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm text-center">
                  {error}
                </div>
              )}

              <div className="flex justify-center w-full">
                <ThemeAwareAddButton onClick={handleSubmit}>
                  {isLogin ? "Sign in" : "Create account"}
                </ThemeAwareAddButton>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                  onClick={() => {
                    setIsLogin(!isLogin)
                    setValidationErrors({})
                    setError("")
                  }}
                >
                  {isLogin
                    ? "Don't have an account? Sign up"
                    : "Already have an account? Sign in"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
} 