// @/components/ui/Form/VerifyMaill/verifyMailErrorCard.tsx

import { X } from 'lucide-react';
import { Link } from '@tanstack/react-router';

interface VerifyErrorCardProps {
    message?: string;
}

export default function VerifyErrorCard({ message }: VerifyErrorCardProps) {
    return (
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <X className="w-7 h-7 text-red-500" strokeWidth={3} />
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-2">Verification failed</h2>

            <p className="text-sm text-gray-500 mb-6">
                {message || 'Your verification link is invalid or has expired. Please try again.'}
            </p>

            <Link
                to="/login"
                className="block w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
            >
                Back to login
            </Link>
        </div>
    );
}