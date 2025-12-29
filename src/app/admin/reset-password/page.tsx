'use client'

import { useState } from 'react'
import { updatePassword } from '@/actions/auth'

export default function ResetPasswordPage() {
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (formData: FormData) => {
        const password = formData.get('password') as string
        const confirmPassword = formData.get('confirmPassword') as string

        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters')
            return
        }

        setLoading(true)
        setError(null)
        const result = await updatePassword(formData)
        if (result?.error) {
            setError(result.error)
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="flex justify-center mb-8">
                    <a href="/" className="w-16 h-16">
                        <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                    </a>
                </div>

                <div className="bg-zinc-900 rounded-2xl p-8 border border-white/10 shadow-2xl">
                    <h1 className="text-2xl font-semibold text-white mb-6 text-center">
                        Set New Password
                    </h1>

                    {error && (
                        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <form action={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm text-white/60 mb-2">
                                New Password
                            </label>
                            <input
                                name="password"
                                type="password"
                                required
                                minLength={6}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-purple-500 focus:outline-none transition-colors text-white"
                                placeholder="••••••••"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-white/60 mb-2">
                                Confirm Password
                            </label>
                            <input
                                name="confirmPassword"
                                type="password"
                                required
                                minLength={6}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-purple-500 focus:outline-none transition-colors text-white"
                                placeholder="••••••••"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-white font-medium disabled:opacity-50"
                        >
                            {loading ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
