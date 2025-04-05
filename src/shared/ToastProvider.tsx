import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { Snackbar, Alert } from "@mui/material";

// Define toast message type
export type ToastSeverity = "error" | "warning" | "info" | "success";

export interface ToastMessage {
  message: string;
  severity: ToastSeverity;
}

// Create context
interface ToastContextProps {
  showToast: (message: string, severity?: ToastSeverity) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

// Custom hook to use the toast
export const useToast = (): ToastContextProps => {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  
  return context;
};

// Toast provider component
interface ToastProviderProps {
  children: ReactNode;
}

const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<ToastMessage>({
    message: "",
    severity: "info"
  });

  // Function to show toast
  const showToast = (message: string, severity: ToastSeverity = "info") => {
    setToast({ message, severity });
    setOpen(true);
  };

  useEffect(() => {
    const handleGlobalToast = (event: CustomEvent<ToastMessage>) => {
      showToast(event.detail.message, event.detail.severity || "info");
    };

    window.addEventListener("global-toast", handleGlobalToast as EventListener);
    return () => window.removeEventListener("global-toast", handleGlobalToast as EventListener);
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={toast.severity} onClose={handleClose}>
          {toast.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
