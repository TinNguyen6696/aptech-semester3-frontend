import { Mail } from 'lucide-react';

interface VerifyEmailCardProps {
    email?: string;
}

export default function  VerifyEmailCard({ email }: VerifyEmailCardProps) {
    return (
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-5">
                <Mail className="w-6 h-6 text-blue-500" strokeWidth={2} />
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-2">Verify your email</h2>

            <p className="text-sm text-gray-500">
                We've sent a verification link to
            </p>
            <p className="text-sm font-semibold text-gray-800 mb-4">
                {email || 'your email'}
            </p>

            <p className="text-sm text-gray-500 mb-1">
                Click the link in that email to activate your account.
            </p>

            <p className="text-sm text-gray-500 mb-4">
                Didn't get it?{' '}
                <button
                    type="button"
                    className="text-blue-500 font-medium hover:underline"
                >
                    Resend email
                </button>
            </p>

            <div className="border-t border-gray-200 pt-4">
                <button
                    type="button"
                    className="text-xs text-gray-400 underline hover:text-gray-600"
                >
                    [Prototype: simulate clicking the email link →]
                </button>
            </div>
        </div>
    );
}
