import { Terminal } from 'lucide-react';

export function Login() {
  const handleLogin = () => {
    window.location.href = 'http://localhost:8787/api/auth/login';
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
         <div className="absolute top-10 left-10 w-64 h-64 bg-primary rounded-full blur-[100px]"></div>
         <div className="absolute bottom-10 right-10 w-80 h-80 bg-secondary rounded-full blur-[100px]"></div>
      </div>

      <div className="z-10 text-center space-y-8 max-w-md w-full bg-surface/50 p-10 rounded-2xl border border-gray-800 backdrop-blur-xl">
        <div className="flex justify-center mb-4">
           <div className="p-4 bg-black/40 rounded-full border border-primary/50 shadow-[0_0_15px_rgba(0,184,148,0.3)]">
             <Terminal className="w-12 h-12 text-primary" />
           </div>
        </div>
        
        <div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            TEAM8
          </h1>
          <p className="text-gray-400 mt-2 font-mono text-sm">
            Don't segfault alone.
          </p>
        </div>

        <button
          onClick={handleLogin}
          className="w-full py-4 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-all flex items-center justify-center gap-2 group"
        >
          <img src="https://upload.wikimedia.org/wikipedia/commons/8/8d/42_Logo.svg" className="w-6 h-6" alt="42" />
          <span>Connect with Intra</span>
        </button>
        
        <p className="text-xs text-gray-500 font-mono">
          By connecting, you accept the Blackhole Policy.
        </p>
      </div>
    </div>
  );
}
