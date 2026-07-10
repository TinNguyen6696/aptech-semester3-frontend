import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { API } from '@/lib/apiendpoint';
import axiosClient from '@/services/axiosClient';
import { useNavigate } from "@tanstack/react-router";
import { toast } from 'react-toastify';

const COOLDOWN_SECONDS = 60;
const COOLDOWN_STORAGE_KEY = 'forgot_pw_cooldown_until';

function readCooldownUntil() {
    return Number(localStorage.getItem(COOLDOWN_STORAGE_KEY) || 0);
}

function writeCooldownUntil() {
    const until = Date.now() + COOLDOWN_SECONDS * 1000;
    localStorage.setItem(COOLDOWN_STORAGE_KEY, String(until));
    return until;
}

function clearCooldown() {
    localStorage.removeItem(COOLDOWN_STORAGE_KEY);
}

function computeRemainingSeconds() {
    const cooldownUntil = readCooldownUntil();
    const diff = Math.ceil((cooldownUntil - Date.now()) / 1000);
    return diff > 0 ? diff : 0;
}

export default function InputSendEmailForm() {
    const navigate = useNavigate();
    const [remainingSeconds, setRemainingSeconds] = useState(() => computeRemainingSeconds());
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const startCountdown = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            const remaining = computeRemainingSeconds();
            setRemainingSeconds(remaining);
            if (remaining <= 0) {
                if (intervalRef.current) clearInterval(intervalRef.current);
                clearCooldown();
            }
        }, 1000);
    };

    // Khi mount (kể cả sau F5), check xem còn cooldown không
    useEffect(() => {
        if (computeRemainingSeconds() > 0) {
            startCountdown();
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email').required('This field is required'),
    });

    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            const req_mail = {
                Email: values.email
            };
            try {
                const res = await axiosClient.post(API.AXIOS_SEND_FORGOT_PW, req_mail);

                if (res.data.isSuccess) {
                    toast.success('Mail has been sent!');
                    resetForm();

                    writeCooldownUntil();
                    setRemainingSeconds(COOLDOWN_SECONDS);
                    startCountdown();
                } else {
                    toast.error(res.data.message || 'Something went wrong, please try again.');
                }
            } catch (error: unknown) {
                if (axios.isAxiosError(error) && error.response) {
                    const message = error.response?.data?.message || 'Something went wrong, please try again.';
                    toast.error(message);
                } else {
                    console.log("Error with no response:", error);
                }
            } finally {
                setSubmitting(false);
            }
        },
    });

    const isCoolingDown = remainingSeconds > 0;

    return (
        <>
            <div className="bg-white p-8 rounded-lg shadow-md w-full">
                <h2 className="text-2xl font-bold mb-1 text-start text-gray-800">Forgot password?</h2>
                <span className="text-xs">Enter your email and we'll send you a reset link</span>
                <form onSubmit={formik.handleSubmit} className="mt-4">
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                        <input
                            name='email'
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                            type="email"
                            placeholder="email@example.com"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.email}
                            disabled={isCoolingDown}
                        />
                        {formik.touched.email && formik.errors.email && (
                            <p className="text-red-500 text-xs">{formik.errors.email}</p>
                        )}
                    </div>
                    <button
                        className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        disabled={formik.isSubmitting || isCoolingDown}
                    >
                        {formik.isSubmitting
                            ? "Sending..."
                            : isCoolingDown
                                ? `Resend in ${remainingSeconds}s`
                                : "Send reset link"}
                    </button>
                    <div className='text-center mt-4'>
                        <a className='cursor-pointer text-sm text-blue-600' onClick={() => navigate({ to: '/login' })}>
                            Back to sign in
                        </a>
                    </div>
                </form>
            </div>
        </>
    )
}