import Link from "next/link";
import { TRACK_LIST } from "@/lib/content/tracks";
import { SearchCommand } from "./search-command";
import { ThemeToggle } from "./theme-toggle";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const LINKS = [
  { href: "/roadmaps", label: "Roadmaps" },
  { href: "/labs", label: "Labs" },
  { href: "/interview", label: "Interview" },
  { href: "/daily", label: "Daily" },
  { href: "/tools", label: "Tools" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-3 px-4">
        <Link href="/" className="font-heading text-sm font-semibold tracking-tight">
          StackAtlas
        </Link>
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Tracks</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[520px] grid-cols-2 gap-1 p-2">
                  {TRACK_LIST.map((track) => (
                    <li key={track.id}>
                      <NavigationMenuLink render={<Link href={track.href} />}>
                        <span className="font-medium">{track.shortTitle}</span>
                        <span className="line-clamp-2 text-xs text-muted-foreground">{track.summary}</span>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <nav className="hidden items-center gap-3 text-sm md:flex" aria-label="Primary">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-muted-foreground hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <SearchCommand />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
