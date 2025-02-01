'use client'
import { useState } from 'react'
import Image from 'next/image'
import { WalletButtons } from './WalletButton';
import Link from 'next/link';
import { RxHamburgerMenu } from "react-icons/rx";
import { IoClose } from 'react-icons/io5'

import { useTheme } from '@/context/themecontext';
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { menu } from '@/utils/constants'
import ThemeToggle from './ThemeToggle';
import { usePathname } from 'next/navigation'

const Header = () => {
    const { theme } = useTheme();
    const { connected } = useWallet();
    const [mobileMenu, setMobileMenu] = useState(false);
    
    return (
        <header className={`header py-4 ${theme === 'dark' ? 'bg-dark' : 'bg-gray-900'} text-white transition-all duration-300 shadow-md`}>
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-4">
                        <Link href="/" aria-label="Homepage">
                            <Image 
                                src="/media/logo.png" 
                                alt="logo" 
                                height={40} 
                                width={40} 
                                className="transition-transform duration-300 hover:scale-105"
                            />
                        </Link>
                    </div>

                    <div className="col-8 d-flex justify-content-between align-items-center">
                        <nav className="d-none d-lg-flex align-items-center">
                            {menu.map((item, idx) => (
                                <Link 
                                    href={item.url} 
                                    key={idx} 
                                    className="mx-4 text-lg font-semibold text-white hover:text-primary hover:underline hover:underline-offset-4 transition-all duration-300"
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>

                        <div className="d-flex align-items-center gap-3">
                            <ThemeToggle />
                            <WalletButtons />
                        </div>

                        <button 
                            className="d-lg-none menu-toggle bg-transparent border-0 p-3"
                            onClick={() => setMobileMenu(!mobileMenu)}
                            aria-label="Toggle menu"
                        >
                            {mobileMenu ? <IoClose size={28} /> : <RxHamburgerMenu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`d-lg-none mobile-menu ${mobileMenu ? 'active' : 'inactive'} p-5 mt-3 bg-gray-900 shadow-lg rounded-lg transition-all duration-300`}>
                {menu.map((item, idx) => (
                    <Link 
                        href={item.url} 
                        key={idx} 
                        className="block text-lg font-semibold text-white py-3 hover:text-primary hover:underline hover:underline-offset-4 transition-all duration-300"
                    >
                        {item.name}
                    </Link>
                ))}
            </div>
        </header>
    );
};

export default Header;
