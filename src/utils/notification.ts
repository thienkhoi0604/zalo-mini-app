import { SnackbarType } from "zmp-ui/snackbar-provider";

export type NotificationType = "success" | "error" | "warning" | "info";

// Global snackbar instance - set by SnackbarProvider wrapper
let globalSnackbar: {
  openSnackbar: (options: {
    text?: string;
    type?: SnackbarType;
    duration?: number;
    position?: keyof { top: "top"; bottom: "bottom" };
  }) => void;
} | null = null;

export function setGlobalSnackbar(snackbar: typeof globalSnackbar) {
  globalSnackbar = snackbar;
}

export function showNotification(message: string, type: NotificationType = "info") {
  if (!globalSnackbar) {
    console.warn("Snackbar not initialized. Make sure SnackbarProvider is in the component tree.");
    return;
  }

  const typeMap: Partial<Record<NotificationType, SnackbarType>> = {
    success: "success" as SnackbarType,
    error: "error" as SnackbarType,
    warning: "warning" as SnackbarType,
    info: "info" as SnackbarType,
  };

  globalSnackbar.openSnackbar({
    text: message,
    type: typeMap[type],
    duration: 3000,
    position: "top",
  });
}
