import { Alert, Platform } from "react-native";

type AlertButton = {
  text: string;
  style?: "default" | "cancel" | "destructive";
  onPress?: () => void;
};

export const showAlert = (
  title: string,
  message: string,
  buttons?: AlertButton[],
  options?: { cancelable?: boolean }
) => {
  if (Platform.OS === "web") {
    if (buttons && buttons.length > 0) {
      const hasCancel = buttons.some((b) => b.style === "cancel");
      
      if (hasCancel && buttons.length === 2) {
        const confirmButton = buttons.find((b) => b.style !== "cancel");
        const cancelButton = buttons.find((b) => b.style === "cancel");
        
        if (window.confirm(`${title}\n\n${message}`)) {
          confirmButton?.onPress?.();
        } else {
          cancelButton?.onPress?.();
        }
      } else {
        window.alert(`${title}\n\n${message}`);
        buttons.forEach((button) => {
          if (button.style !== "cancel") {
            button.onPress?.();
          }
        });
      }
    } else {
      window.alert(`${title}\n\n${message}`);
    }
  } else {
    Alert.alert(title, message, buttons, options);
  }
};

export const showError = (message: string) => {
  showAlert("Error", message);
};

export const showSuccess = (message: string, onPress?: () => void) => {
  showAlert("Success", message, [{ text: "OK", onPress }]);
};
