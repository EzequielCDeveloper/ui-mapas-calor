'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Dumbbell, Lock, Mail } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/context/AuthContext'
import { extractError } from '@/lib/api'

const schema = z.object({
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  password: z.string().optional(),
  remember: z.boolean().optional(),
})

type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const { login, loginDemo, isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  })

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace('/dashboard')
    }
  }, [isAuthenticated, authLoading, router])

  const onSubmit = async (data: FormData) => {
    if (!data.email || !data.password) {
      setLoginError('Por favor ingresa email y contraseña')
      return
    }
    setLoginError(null)
    setIsSubmitting(true)
    try {
      await login(data.email, data.password)
    } catch (err) {
      setLoginError(extractError(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-black-900 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-gold-400/5 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full bg-gold-400/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gold-400/[0.02] blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gold-gradient shadow-gold-lg mb-5">
            <Dumbbell size={36} className="text-black-900" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-widest bg-gold-gradient bg-clip-text text-transparent mb-1">
            CHAPITOS
          </h1>
          <p className="text-text-muted text-sm uppercase tracking-[0.3em] font-medium">
            Gym Management
          </p>
        </div>

        {/* Card */}
        <div className="bg-black-700 rounded-2xl border border-border shadow-card p-8">
          <h2 className="text-xl font-semibold text-white mb-1">Iniciar sesión</h2>
          <p className="text-text-muted text-sm mb-7">Ingresa tus credenciales para continuar</p>

          {loginError && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-danger/10 border border-danger/30 text-danger text-sm flex items-start gap-2">
              <Lock size={14} className="mt-0.5 flex-shrink-0" />
              {loginError}
            </div>
          )}

          <Button
            onClick={loginDemo}
            isLoading={isSubmitting}
            className="w-full h-11 text-base mb-4"
            size="lg"
          >
            Entrar como demo
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-black-700 px-2 text-text-muted">O</span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Email"
              type="email"
              placeholder="tu@correo.com"
              autoComplete="email"
              error={errors.email?.message}
              leftIcon={<Mail size={16} />}
              {...register('email')}
            />

            <div>
              <Input
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="current-password"
                error={errors.password?.message}
                leftIcon={<Lock size={16} />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-text-muted hover:text-white transition-colors"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
                {...register('password')}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                id="remember"
                type="checkbox"
                className="w-4 h-4 rounded border-border bg-black-600 text-gold-400 focus:ring-gold-400/50 cursor-pointer"
                {...register('remember')}
              />
              <label htmlFor="remember" className="text-sm text-text-secondary cursor-pointer">
                Recordarme
              </label>
            </div>

            <Button
              type="submit"
              isLoading={isSubmitting}
              className="w-full h-11 text-base"
              size="lg"
              variant="outline"
            >
              Iniciar sesión
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-text-disabled mt-6">
          © {new Date().getFullYear()} Chapitos Gym · Sistema de Membresías
        </p>
      </div>
    </div>
  )
}
