import { Loader2 } from "lucide-react";

const Loader = ({ text = "Loading..." }) => {
    return (
        <div className="flex flex-col items-center justify-center h-screen gap-3 bg-gray-50">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
            <p className="text-sm text-gray-600">{text}</p>
        </div>
    );
};

export default Loader;
