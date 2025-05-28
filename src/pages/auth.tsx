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

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login, register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

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
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1.5"
                    placeholder="Enter your email"
                  />
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
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1.5"
                    placeholder="Enter your password"
                  />
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
                  onClick={() => setIsLogin(!isLogin)}
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