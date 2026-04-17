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
  const base = 'rounded-2xl border transition-all duration-200';

  const variants = {
    default:  'bg-white border-gray-100 shadow-card',
    elevated: 'bg-white border-gray-100 shadow-card-hover',
    flat:     'bg-white border-gray-100 shadow-none',
  };

  const hoverStyles = hover
    ? 'hover:shadow-card-hover hover:-translate-y-0.5 cursor-pointer'
    : '';

  return (
    <div
      onClick={onClick}
      className={twMerge(base, variants[variant], padding, hoverStyles, className)}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
