interface AlertProps {
  children: React.ReactNode;
  className?: string;
}

export function Alert({ children, className = "" }: AlertProps) {
  return (
    <div className={`bg-yellow-50 border border-yellow-200 rounded-lg p-4 ${className}`}>
      {children}
    </div>
  );
}

export function AlertDescription({ children }: { children: React.ReactNode }) {
  return <div className="text-sm text-yellow-800">{children}</div>;
} 