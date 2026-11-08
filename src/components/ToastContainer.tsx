import React from 'react';
import { X, CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onRemoveToast: (id: number) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemoveToast }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((t) => {
        const isErr = t.type === 'error';
        const isWarn = t.type === 'warning';
        const isSuccess = t.type === 'success';
        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start justify-between gap-3 p-3.5 bg-[#141418] border shadow-2xl ${
              isErr
                ? 'border-[#EF4444]'
                : isWarn
                ? 'border-[#F59E0B]'
                : isSuccess
                ? 'border-[#10B981]'
                : 'border-[#3B82F6]'
            }`}
          >
            <div className="flex items-start gap-2.5">
              {isErr && <XCircle className="w-4 h-4 text-[#EF4444] shrink-0 mt-0.5" />}
              {isWarn && <AlertTriangle className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />}
              {isSuccess && <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />}
              {!isErr && !isWarn && !isSuccess && (
                <Info className="w-4 h-4 text-[#3B82F6] shrink-0 mt-0.5" />
              )}
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-white">{t.title}</div>
                <div className="text-xs text-[#A1A1AA] mt-0.5 leading-relaxed">{t.message}</div>
              </div>
            </div>
            <button
              onClick={() => onRemoveToast(t.id)}
              className="text-[#71717A] hover:text-white p-1 cursor-pointer"
              title="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
