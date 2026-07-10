import { ArrowLeftIcon } from "lucide-react";


export default function BackHomeBtn(){
    return(
        <>
            <a href="/" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
                <ArrowLeftIcon size={16} /> Back to home
            </a>
        </>
    )
}