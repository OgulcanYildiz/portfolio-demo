'use client'

import { useState } from 'react'
import { login, resetPassword } from '@/actions/auth'

export default function LoginPage() {
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [showReset, setShowReset] = useState(false)
    const [resetSent, setResetSent] = useState(false)

    const handleLogin = async (formData: FormData) => {
        setLoading(true)
        setError(null)
        const result = await login(formData)
        if (result?.error) {
            setError(result.error)
        }
        setLoading(false)
    }

    const handleReset = async (formData: FormData) => {
        setLoading(true)
        setError(null)
        const result = await resetPassword(formData)
        if (result?.error) {
            setError(result.error)
        } else if (result?.success) {
            setResetSent(true)
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <a href="/" className="w-16 h-16">
                        <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                    </a>
                </div>

                <div className="bg-zinc-900 rounded-2xl p-8 border border-white/10 shadow-2xl">
                    {!showReset ? (
                        <>
                            <h1 className="text-2xl font-semibold text-white mb-6 text-center">
                                Admin Login
                            </h1>

                            {error && (
                                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                                    {error}
                                </div>
                            )}

                            <form action={handleLogin} className="space-y-4">
                                <div>
                                    <label className="block text-sm text-white/60 mb-2">
                                        Email
                                    </label>
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-purple-500 focus:outline-none transition-colors text-white"
                                        placeholder="admin@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-white/60 mb-2">
                                        Password
                                    </label>
                                    <input
                                        name="password"
                                        type="password"
                                        required
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-purple-500 focus:outline-none transition-colors text-white"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-white font-medium disabled:opacity-50"
                                >
                                    {loading ? 'Signing in...' : 'Sign In'}
                                </button>
                            </form>

                            <div className="mt-6 text-center">
                                <button
                                    onClick={() => setShowReset(true)}
                                    className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                                >
                                    Forgot your password?
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <h1 className="text-2xl font-semibold text-white mb-6 text-center">
                                Reset Password
                            </h1>

                            {resetSent ? (
                                <div className="text-center">
                                    <div className="mb-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400">
                                        Password reset email sent! Check your inbox.
                                    </div>
                                    <button
                                        onClick={() => { setShowReset(false); setResetSent(false); }}
                                        className="text-purple-400 hover:text-purple-300 transition-colors"
                                    >
                                        Back to login
                                    </button>
                                </div>
                            ) : (
                                <>
                                    {error && (
                                        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                                            {error}
                                        </div>
                                    )}

                                    <p className="text-white/60 text-sm mb-4">
                                        Enter your email and we&apos;ll send you a link to reset your password.
                                    </p>

                                    <form action={handleReset} className="space-y-4">
                                        <div>
                                            <label className="block text-sm text-white/60 mb-2">
                                                Email
                                            </label>
                                            <input
                                                name="email"
                                                type="email"
                                                required
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-purple-500 focus:outline-none transition-colors text-white"
                                                placeholder="admin@example.com"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-white font-medium disabled:opacity-50"
                                        >
                                            {loading ? 'Sending...' : 'Send Reset Link'}
                                        </button>
                                    </form>

                                    <div className="mt-6 text-center">
                                        <button
                                            onClick={() => setShowReset(false)}
                                            className="text-sm text-white/40 hover:text-white/60 transition-colors"
                                        >
                                            Back to login
                                        </button>
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </div>

                <p className="text-center text-white/30 text-sm mt-6">
                    <a href="/" className="hover:text-white/50 transition-colors">
                        ← Back to site
                    </a>
                </p>
            </div>
        </div>
    )
}
