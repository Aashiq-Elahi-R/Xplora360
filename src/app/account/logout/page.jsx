import { useEffect } from "react";
import useAuth from "@/utils/useAuth";

export default function LogoutPage() {
  const { signOut } = useAuth();

  useEffect(() => {
    const handleSignOut = async () => {
      await signOut({
        callbackUrl: "/",
        redirect: true,
      });
    };
    handleSignOut();
  }, [signOut]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50 dark:from-blue-900 dark:to-pink-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-xl p-8 text-center">
        {/* Logo */}
        <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-pink-500 rounded-2xl flex items-center justify-center">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-pink-500 rounded-full"></div>
          </div>
        </div>

        <h1 className="text-2xl font-poppins font-bold text-gray-800 dark:text-white mb-4">
          Signing You Out
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Thanks for using Local Voyage. You'll be redirected shortly.
        </p>

        {/* Loading animation */}
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        
        .font-poppins {
          font-family: 'Poppins', sans-serif;
        }
      `}</style>
    </div>
  );
}