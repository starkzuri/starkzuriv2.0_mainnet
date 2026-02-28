import { X, Wallet, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

export function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const handleWalletConnect = () => {
    onLogin();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-[#0f0f1a] border border-[#1F87FC]/40 rounded-2xl p-6 md:p-8 max-w-md w-full relative shadow-[0_0_40px_rgba(31,135,252,0.3)]"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#1F87FC] to-[#00ffcc] flex items-center justify-center">
                  <Wallet className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-foreground text-2xl mb-2">Connect to StarkZuri</h2>
                <p className="text-muted-foreground text-sm">
                  Connect your wallet to start trading predictions
                </p>
              </div>

              {/* Wallet Options */}
              <div className="space-y-3">
                <button
                  onClick={handleWalletConnect}
                  className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-[#1F87FC]/20 to-transparent border border-[#1F87FC]/40 rounded-xl hover:border-[#1F87FC] hover:shadow-[0_0_20px_rgba(31,135,252,0.3)] transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#1F87FC] to-[#00ffcc] flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-foreground">MetaMask</div>
                    <div className="text-xs text-muted-foreground">Connect with MetaMask wallet</div>
                  </div>
                </button>

                <button
                  onClick={handleWalletConnect}
                  className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-[#1F87FC]/20 to-transparent border border-[#1F87FC]/40 rounded-xl hover:border-[#1F87FC] hover:shadow-[0_0_20px_rgba(31,135,252,0.3)] transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#ff3366] to-[#ff6b9d] flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-foreground">WalletConnect</div>
                    <div className="text-xs text-muted-foreground">Scan with mobile wallet</div>
                  </div>
                </button>

                <button
                  onClick={handleWalletConnect}
                  className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-[#1F87FC]/20 to-transparent border border-[#1F87FC]/40 rounded-xl hover:border-[#1F87FC] hover:shadow-[0_0_20px_rgba(31,135,252,0.3)] transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00ff88] to-[#00ccff] flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-foreground">Email Sign Up</div>
                    <div className="text-xs text-muted-foreground">Create account with email</div>
                  </div>
                </button>
              </div>

              {/* Footer */}
              <p className="text-xs text-center text-muted-foreground mt-6">
                By connecting, you agree to our Terms of Service and Privacy Policy
              </p>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
