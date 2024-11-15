import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Assuming you have an Avatar component
import { Button } from "@/components/ui/button"; // Assuming you have a Button component
import { useState, useEffect } from "react";

export default function UserDropdown() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Retrieve user data from localStorage (assuming it was stored on login)
        const userData = JSON.parse(localStorage.getItem("user") || '');
        setUser(userData?.user);
    }, []);

    const handleLogout = () => {
        // Clear user data from localStorage and reload the page or redirect
        localStorage.removeItem("user");
        window.location.reload();
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center" style={{border: 'none'}}>
                    <Avatar className=" h-10 w-10">
                        <AvatarImage src={user?.avatarUrl} alt="User Avatar" />
                        <AvatarFallback>{user?.email?.charAt(0) ?? "U"}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-fit">
                {user ? (
                    <>
                        <DropdownMenuItem className="font-semibold">{user?.email || 'N/A'}</DropdownMenuItem>
                        <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                            Logout
                        </DropdownMenuItem>
                    </>
                ) : (
                    <DropdownMenuItem>Loading...</DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
