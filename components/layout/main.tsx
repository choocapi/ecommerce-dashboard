import { cn } from "@/lib/utils";

type MainProps = React.HTMLAttributes<HTMLElement> & {
  fluid?: boolean;
  ref?: React.Ref<HTMLElement>;
};

export function Main({ className, fluid, ...props }: MainProps) {
  return (
    <main
      data-layout={"auto"}
      className={cn(
        "px-4 py-6",

        // If layout is not fluid, set the max-width
        !fluid && "@7xl/content:mx-auto @7xl/content:w-full @7xl/content:max-w-7xl",
        className,
      )}
      {...props}
    />
  );
}
