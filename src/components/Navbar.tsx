import React from "react";
import SignupDialog from "./SignupDialog";
import { LogOut, Plane, User, Clock, MessageSquare, MapPin, XCircle, TrendingUp, Brain } from "lucide-react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { clearUser } from "@/store";
import { useRouter } from "next/navigation";
const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user.user);
  const router = useRouter();
  const logout = () => {
    dispatch(clearUser());
  };
  return (
    <header className=" backdrop-blur-md py-4 sticky top-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-white">
          <Plane className="w-8 h-8 text-red-500" />
          <Link href="/" className="text-2xl font-bold text-black hover:text-gray-700">
            MakeMyTour
          </Link>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            href="/flight-status" 
            className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
          >
            <Clock className="w-4 h-4" />
            <span>Flight Status</span>
          </Link>
          <Link 
            href="/reviews-demo" 
            className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Reviews</span>
          </Link>
          <Link 
            href="/seat-selection-demo" 
            className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
          >
            <MapPin className="w-4 h-4" />
            <span>Seat Selection</span>
          </Link>
          <Link 
            href="/cancellation-demo" 
            className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors"
          >
            <XCircle className="w-4 h-4" />
            <span>Cancellation</span>
          </Link>
          <Link 
            href="/pricing-demo" 
            className="flex items-center space-x-1 text-gray-700 hover:text-green-600 transition-colors"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Dynamic Pricing</span>
          </Link>
          <Link 
            href="/recommendations-demo" 
            className="flex items-center space-x-1 text-gray-700 hover:text-purple-600 transition-colors"
          >
            <Brain className="w-4 h-4" />
            <span>AI Recommendations</span>
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              {user.role === "ADMIN" && (
                <Button variant="default" onClick={() => router.push("/admin")}>
                  ADMIN
                </Button>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {user?.firstName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.firstName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/recommendations")}>
                    <Brain className="mr-2 h-4 w-4" />
                    <span>AI Recommendations</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/cancellation")}>
                    <XCircle className="mr-2 h-4 w-4" />
                    <span>My Bookings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => logout()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <SignupDialog
              trigger={
                <Button
                  variant="outline"
                  className="bg-blue-600  text-white hover:bg-blue-700"
                >
                  Sign Up
                </Button>
              }
            />
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
