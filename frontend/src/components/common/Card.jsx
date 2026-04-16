import { twMerge } from 'tailwind-merge';

const Card = ({
  children,
  className = '',
  padding = 'p-6',
  variant = 'default',
  hover = false,
  onClick,
  ...props
}) => {
  const base =
    'rounded-2xl border backdrop-blur-xl transition-all duration-200';

  const variants = {
    default:
      'bg-white/5 border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.3)]',
    elevated:
      'bg-white/10 border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.4)]',
    flat:
      'bg-transparent border-white/10 shadow-none',
  };

  const hoverStyles = hover
    ? 'hover:shadow-[0_12px_50px_rgba(0,0,0,0.5)] hover:-translate-y-1 cursor-pointer'
    : '';

  return (
    <div
      onClick={onClick}
      className={twMerge(
        base,
        variants[variant],
        padding,
        hoverStyles,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;