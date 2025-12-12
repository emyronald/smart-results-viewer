import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

import { Button } from "./ui/button";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full h-16 flex items-center px-4 black-bg text-white border-b border-gray-700 fixed z-1">
      <SignedIn>
      <Link href="/teacher-dashboard">
        <div className="text-lg font-bold">
          Edu<span className="text-sky-600 text-2xl">X</span>
        </div>
      </Link>
      </SignedIn>

      <SignedOut>
      <Link href="/">
        <div className="text-lg font-bold">
          Edu<span className="text-sky-600 text-2xl">X</span>
        </div>
      </Link>
      </SignedOut>
      <div className="ml-auto space-x-4">
        <SignedOut>
          <SignInButton >
            <Button className="bg-gray-700 ">Sign In</Button>
          </SignInButton>
          <SignUpButton>
            <Button className="bg-sky-600 ">Sign Up</Button>
          </SignUpButton>
        </SignedOut>

        <SignedIn>
          <UserButton/>
        </SignedIn>
      </div>
    </nav>
  );
}
