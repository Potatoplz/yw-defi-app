import classNames from "classnames";

type ButtonProps = {
  size?: "small" | "medium" | "large";
  color?: "blue" | "green" | "red";
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
};

const Button: React.FC<ButtonProps> = ({
  size = "medium",
  color = "blue",
  onClick,
  children,
  disabled = false,
}) => {
  const baseStyles =
    "text-white font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-2";
  const sizeStyles = {
    small: "px-2 py-1 text-xs",
    medium: "px-4 py-2 text-sm",
    large: "px-6 py-3 text-lg",
  };
  const colorStyles = {
    blue: "bg-blue-500 hover:bg-blue-600 focus:ring-blue-500",
    green: "bg-green-500 hover:bg-green-600 focus:ring-green-500",
    red: "bg-red-500 hover:bg-red-600 focus:ring-red-500",
  };

  const classes = classNames(baseStyles, sizeStyles[size], colorStyles[color], {
    "opacity-50 cursor-not-allowed": disabled,
  });

  return (
    <button
      className={classes}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      {children}
    </button>
  );
};

export default Button;
