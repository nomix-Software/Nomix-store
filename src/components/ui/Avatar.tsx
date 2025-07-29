import React from "react";
import clsx from "clsx";
import { FaUser } from "react-icons/fa";

interface AvatarProps {
  email?: string;
  size?: "small" | "medium" | "large";
}

const Avatar: React.FC<AvatarProps> = ({ email, size = "small" }) => {
  // Consideramos "logueado" si hay un email y no es el placeholder "?"
  const isLoggedIn = email && email !== "?";
  const initial = isLoggedIn ? email.charAt(0).toUpperCase() : "";

  const sizeStyles = {
    small: {
      container: "w-8 h-8",
      icon: "text-base",
      text: "text-xs",
    },
    medium: {
      container: "w-10 h-10",
      icon: "text-xl",
      text: "text-sm",
    },
    large: {
      container: "w-16 h-16", // Tamaño original
      icon: "text-2xl",
      text: "text-sm",
    },
  };

  const styles = sizeStyles[size];

  return (
    <div className="flex flex-col items-center space-y-1">
      <div
        className={clsx(
          "rounded-full bg-red-400 text-white flex items-center justify-center font-bold",
          styles.container,
          styles.icon
        )}
      >
        {isLoggedIn ? initial : <FaUser />}
      </div>
      <p className={clsx("text-gray-700 break-all text-center", styles.text)}>
        {isLoggedIn ? email : "Iniciar Sesión"}
      </p>
    </div>
  );
};

export default Avatar;
