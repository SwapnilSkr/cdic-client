/**
 * @see https://tailwindcss.com/docs/guides/accessibility#screen-readers
 */
export const VisuallyHidden = ({ children }: { children: React.ReactNode }) => (
  <span className="sr-only">{children}</span>
);
