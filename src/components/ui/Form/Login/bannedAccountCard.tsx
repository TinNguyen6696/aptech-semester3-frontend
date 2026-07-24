// @/components/ui/Form/Login/bannedAccountCard.tsx

import { Ban } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

interface BannedAccountCardProps {
    email: string;
}

export default function BannedAccountCard({ email }: BannedAccountCardProps) {
    const navigate = useNavigate();

    return (
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm text-center">
            <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-5">
                <Ban className="w-7 h-7 text-red-500" strokeWidth={2} />
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-2">Account deactivated</h2>

            {email && (
                <>
                    <p className="text-sm text-gray-500 mb-1">Your account</p>
                    <p className="text-sm font-semibold text-gray-800 mb-4">{email}</p>
                </>
            )}

            <p className="text-sm text-gray-500 mb-6">
                has been deactivated by an administrator. If you believe this is a mistake, please contact support.
            </p>

            <button
                onClick={() => navigate({ to: '/login' })}
                className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
            >
                Back to login
            </button>
        </div>
    );
}
