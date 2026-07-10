// @/components/ui/Form/VerifyMaill/resendMailCard.tsx

import { Mail } from 'lucide-react';
import { useState } from 'react';
import { API } from '@/lib/apiendpoint';
import axiosClient from '@/services/axiosClient';
import axios from 'axios';

interface ResendMailCardProps {
    email: string;
}

export default function ResendMailCard({ email }: ResendMailCardProps) {
    const [isSending, setIsSending] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const startCooldown = (seconds: number) => {
        setCooldown(seconds);
        const interval = setInterval(() => {
            setCooldown((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleResend = async () => {
        if (isSending || cooldown > 0) return;

        setIsSending(true);
        setFeedback(null);

        try {
            const res = await axiosClient.post(API.AXIOS_RESEND_VERIFY_EMAIL, { email });

            if (res.data.isSuccess) {
                setFeedback({ type: 'success', message: 'Verification email has been resent!' });
                startCooldown(60);
            } else {
                setFeedback({ type: 'error', message: res.data.message || 'Failed to send email.' });
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message;
                setFeedback({ type: 'error', message: message || 'Something went wrong. Please try again.' });
            } else {
                setFeedback({ type: 'error', message: 'Something went wrong. Please try again.' });
            }
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm text-center">
            <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-5">
                <Mail className="w-7 h-7 text-amber-500" strokeWidth={2} />
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-2">Email not verified</h2>

            <p className="text-sm text-gray-500 mb-1">
                Your account
            </p>
            <p className="text-sm font-semibold text-gray-800 mb-4">{email}</p>

            <p className="text-sm text-gray-500 mb-4">
                has not been verified yet. Please check your inbox and click the verification link to log in.
            </p>

            <button
                onClick={handleResend}
                disabled={isSending || cooldown > 0}
                className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition duration-300"
            >
                {isSending
                    ? 'Sending...'
                    : cooldown > 0
                    ? `Resend in ${cooldown}s`
                    : 'Resend verification email'}
            </button>

            {feedback && (
                <p
                    className={`text-xs mt-3 ${
                        feedback.type === 'success' ? 'text-green-600' : 'text-red-500'
                    }`}
                >
                    {feedback.message}
                </p>
            )}
        </div>
    );
}