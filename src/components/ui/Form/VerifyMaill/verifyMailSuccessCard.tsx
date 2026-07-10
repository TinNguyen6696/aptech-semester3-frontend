import { Check } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export default function VerifySuccessCard() {
    return (
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm text-center">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <Check className="w-7 h-7 text-green-500" strokeWidth={3} />
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-2">Thank you for verifying!</h2>

            <p className="text-sm text-gray-500 mb-6">
                Your account is ready. Welcome to Spotlight — time to share your talent with the world.
            </p>

            <Link
                to="/login"
                className="block w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
            >
                Click here to log in
            </Link>
        </div>
    );
}