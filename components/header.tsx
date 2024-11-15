"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import DragDrop from "@/components/DragDrop";
import Export from "@/components/Export";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCheckoutContext } from "@/components/CheckoutContext";
import { useState, useEffect } from "react";
import UserDropdown from "../components/UserDropdown";
import {
  DatabaseIcon,
  FishIcon,
  SearchIcon,
  ListIcon,
  UploadIcon,
  DownloadIcon,
  MenuIcon,
} from "lucide-react";

const NavButton = ({ icon: Icon, label, onClick, isActive }) => (
  <Button
    variant={isActive ? "default" : "ghost"}
    size="sm"
    onClick={onClick}
    className="flex items-center"
  >
    <Icon className="mr-2 h-4 w-4" />
    {label}
  </Button>
);

export default function Header({ setView, view }) {
  const [counts, setCounts] = useState(null);
  const { totalCount, setTotalCount, accessToken } = useCheckoutContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await fetch("/api/processing-count", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setCounts(data.rows);
        setTotalCount(data.total);
      } catch (error) {
        console.error("Error fetching count:", error);
      }
    };

    fetchCount();
    const interval = setInterval(fetchCount, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [setTotalCount]);

  const navItems = [
    { icon: SearchIcon, label: "Search", view: "dataTable" },
    { icon: ListIcon, label: "View List", view: "SelectedPeopleView" },
    { icon: FishIcon, label: "Go Fishing", view: "GoFishing" },
  ];

  return (
    <header className="bg-background shadow-md p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link
            href="/"
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <Image
              src="/nowadays-logo.png"
              alt="Dashboard Logo"
              width={50}
              height={50}
              className="rounded-md"
            />
            <span className="text-xl font-bold">Nowadays</span>
          </Link>
          <div className="text-sm font-medium text-gray-500 hidden sm:block">
            Total Active: {totalCount}
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-4">
          {navItems.map((item) => (
            <NavButton
              key={item.view}
              icon={item.icon}
              label={item.label}
              onClick={() => setView(item.view)}
              isActive={view === item.view}
            />
          ))}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center">
                <DatabaseIcon className="mr-2 h-4 w-4" />
                DB Status
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-fit">
              {counts ? (
                counts.map((item) => (
                  <DropdownMenuItem key={item.platform}>
                    <b>{item.platform}</b>: {item.count}
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem>Loading...</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center">
                <UploadIcon className="mr-2 h-4 w-4" />
                Upload CSV
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload CSV</DialogTitle>
                <DialogDescription>
                  Upload a CSV file to add prospects to the Ocean. When you drop
                  the csv in, it will automatically upload.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DragDrop />
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Export>
            {(onClick) => (
              <Button
                variant="outline"
                size="sm"
                onClick={onClick}
                className="flex items-center"
              >
                <DownloadIcon className="mr-2 h-4 w-4" />
                Download CSV
              </Button>
            )}
          </Export>

          <UserDropdown />
        </nav>

        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <MenuIcon className="h-6 w-6" />
        </Button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden mt-4">
          <nav className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <NavButton
                key={item.view}
                icon={item.icon}
                label={item.label}
                onClick={() => {
                  setView(item.view);
                  setIsMenuOpen(false);
                }}
                isActive={view === item.view}
              />
            ))}
            {/* Add other menu items here */}
          </nav>
        </div>
      )}
    </header>
  );
}
