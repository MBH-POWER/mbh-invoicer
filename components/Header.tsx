// Home Page
"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase'; // Adjust this import based on your firebase setup
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import Image from '../public/logo.png'
import Image from 'next/image'

const Header = () => {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log(user)
                setUser(user);
            } else {
                router.push("/signin");
            }
        });
        return () => unsubscribe();
    }, [router]);

    const handleLogout = async () => {
        setUser(null)
        try {
            await signOut(auth);
            router.push("/signout");
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };

    const handleCreate = () => {
        router.push("/create");
    }

    const getAvatarSrc = () => {
        if (user?.photoURL) {
            return user.photoURL;
        }
        // Return the path to your default avatar image
        return "/images/default-avatar.png"; // Adjust this path as needed
    };

    const getAvatarFallback = () => {
        if (user?.email) {
            return user.email.slice(0, 2).toUpperCase();
        }
        return 'U';
    };

    if (!user) {
        return null
    }

    return (
        <header className="bg-green-700 p-4 py-6 shadow-sm">
          <div className="w-[99%] lg:w-[91%] mx-auto flex justify-between items-center">
            <div className="flex align items-center">
            <Image className="relative h-8 w-8 rounded  mr-1"
                src="/logo.png"
                alt="MBH Invoicer Logo"
                width={40}
                height={40}/>
                <Link href="/" className="text-xl -tracking-wider font-extrabold text-green-50 no-underline">
              MBH Invoicer
            </Link>
            </div>
                
            
            
            <div className="flex items-center space-x-4">
              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar>
                        <AvatarImage
                          src={getAvatarSrc()}
                          alt={user.displayName || 'User'}
                        />
                        <AvatarFallback>{getAvatarFallback()}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-green-50 dark:bg-green-800">
                    <DropdownMenuItem onClick={handleCreate} className="text-green-700 hover:bg-green-100 dark:text-green-200 dark:hover:bg-green-600">
                      Create Invoice
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="text-green-700 hover:bg-green-100 dark:text-green-200 dark:hover:bg-green-600">
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </header>
      );
    }
    export default Header;      
