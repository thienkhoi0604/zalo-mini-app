import { showToast } from "zmp-ui";

export type NotificationType = "success" | "error" | "warning" | "info";

export function showNotification(message: string, type: NotificationType = "info") {
  const iconMap: Record<NotificationType, string> = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ",
  };

  showToast({
    message,
    type: type === "success" ? "success" : type === "error" ? "error" : "default",
    icon: iconMap[type],
  });
}
