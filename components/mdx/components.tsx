import Link from "next/link";
import { Quiz } from "./quiz";
import { Callout } from "./callout";
import { Pre } from "./pre";

export const mdxComponents = {
  Quiz,
  Callout,
  pre: Pre,
  a: ({
    href,
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    if (href?.startsWith("/")) {
      return (
        <Link href={href} {...props}>
          {children}
        </Link>
      );
    }
    return (
      <a href={href} rel="noreferrer" target={href?.startsWith("http") ? "_blank" : undefined} {...props}>
        {children}
      </a>
    );
  },
};
