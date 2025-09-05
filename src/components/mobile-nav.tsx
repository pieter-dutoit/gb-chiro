"use client";

import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState, type PropsWithChildren } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

export default function MobileNav({ children }: PropsWithChildren) {
  const [open, setOpen] = useState(false);
  const path = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [path]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="lg:hidden">
        <Menu className="text-primary" size={30} />
      </SheetTrigger>
      <SheetContent side="top" className="rounded-b-lg">
        <SheetHeader className="sr-only">
          <SheetTitle>GB Chiropractic</SheetTitle>
          <SheetDescription>Select an option from the meu</SheetDescription>
        </SheetHeader>

        {children}
      </SheetContent>
    </Sheet>
  );
}
