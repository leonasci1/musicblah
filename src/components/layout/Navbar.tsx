
import { Link } from "react-router-dom";
import { Bell, Music, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GoHomeFill } from "react-icons/go";
import { CiSearch } from "react-icons/ci";
import { LuUserRound } from "react-icons/lu";
import { IoNotificationsOutline } from "react-icons/io5";
import { FaRegEnvelopeOpen } from "react-icons/fa";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6 ">
        <div className="flex items-center gap-2 ">
          <Link to="/" className="flex items-center gap-2">
          <img src="símbolo roxo@3x.png" alt="" className="h-10 w-10 hover:animate-spin rounded-full hover:bg-muted/50 transition-colors duration-200  hover:bg-purple-950 cursor-pointer" />
            <span className="text-xl font-semibold text-music-light">
                musicblah!  
            </span>
          </Link>
        </div>
        
        <div className="hidden md:flex w-full max-w-sm items-center mx-4 border rounded-full bg-muted/40 hover:bg-muted/50 duration-200">
          <div className="relative w-full border rounded-full bg-muted/40 hover:bg-muted/50 duration-200">
            <CiSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground border-none" />
            <Input
              type="search"
              placeholder="Buscar músicas ou pessoas..."
              className="w-full pl-8 bg-muted/40 text-white border-none rounded-full"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative rounded-full p-2 hover:bg-muted/50 transition-colors duration-200  hover:bg-purple-950 cursor-pointer">
            <IoNotificationsOutline className="h-5 w-5 " />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-music-purple text-[10px] text-white">
              3
            </span>
          </Button>
          
          <Link to="/profile" className="ml-2">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>UM</AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
    </header>
  );
}
