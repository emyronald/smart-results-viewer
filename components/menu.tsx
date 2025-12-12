"use client";
import Link from "next/link";

import { SignOutButton, SignedIn, SignedOut } from "@clerk/nextjs";

import { House, Users, CalendarDays, File, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";

const Menu = () => {
  const pathname = usePathname();
  return (
    <aside className="md:p-5 p-2 pt-10 gap-20 flex flex-col  ">
      <ul className="flex flex-col gap-6 text-white text-lg">
        <li>
          <SignedIn>
            <Link
              href="/teacher-dashboard"
              className={`flex gap-2 items-center  text-lg ${
                pathname === "/teacher-dashboard" ? "active" : ""
              } hover:bg-gray-300 hover:text-gray-800 font-bold p-2 rounded`}
            >
              <House />
             <span className="hidden md:inline">Home</span>
            </Link>
          </SignedIn>
          <SignedOut>
            <Link
              href="/"
              className={`flex gap-2 items-center  text-lg ${
                pathname === "/teacher-dashboard" ? "active" : ""
              }`}
            >
              <House />
              <span className="hidden md:inline">Home</span>
            </Link>
          </SignedOut>
        </li>
        <li>
          <Link
            href="/teacher-dashboard/students"
            className={`flex gap-2 items-center  text-lg ${
              pathname === "/teacher-dashboard/students" ? "active" : ""
            } hover:bg-gray-300 hover:text-gray-800 font-bold p-2 rounded`}
          >
            <Users />
            <span className="hidden md:inline">Students</span>
          </Link>
        </li>
        
      </ul>
      <div className="flex gap-2 items-center text-lg">
        <SignOutButton>
          <button className="flex gap-2 items-center hover:bg-gray-300 hover:text-gray-800 font-bold p-2 rounded">
            <LogOut />
            <span className="hidden md:inline">Sign Out</span>
          </button>
        </SignOutButton>
      </div>
    </aside>
  );
};

export default Menu;
