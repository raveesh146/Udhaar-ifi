"use client"
import React from "react"
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useTheme } from "@/context/themecontext";
import { useKeylessAccounts } from "@/core/useKeylessAccounts";
import {InnerParticlesComponent} from '@/components/Particles'
import { FaWallet } from "react-icons/fa";
import { IoDocumentTextOutline } from "react-icons/io5";
import { MdOutlineLocalOffer } from "react-icons/md";

export default function BorrowLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { activeAccount } = useKeylessAccounts()
    const { connected, isLoading } = useWallet();
    const { theme } = useTheme()
    const paths = [
        {
            name: "My Assets",
            to: "assets",
            icon: <FaWallet size={18} />
        },
        {
            name: "My Loans",
            to: "loans", 
            icon: <IoDocumentTextOutline size={20} />
        },
        {
            name: "Offers",
            to: "offers",
            icon: <MdOutlineLocalOffer size={20} />
        }
    ]

    // Add click handler to prevent event bubbling
    const handleLinkClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <div className="relative" onClick={handleLinkClick}>
            <InnerParticlesComponent id="particles-bg"/>
            <section className={`py-20 ${theme === 'light' ? 'bg-white' : 'bg-gray-900'}`}>
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold mb-4">Unlock Crypto Loans with Your NFTs</h2>
                        <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
                            Leverage your NFTs as collateral and access instant liquidity without selling your digital assets. Get quick, transparent loans today!
                        </p>
                    </div>
                </div>
            </section>
            <section className={`py-12 ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-900'}`}>
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="w-full md:w-64 flex flex-col gap-2 bg-gray-800 bg-opacity-60 backdrop-blur p-4 rounded-lg">
                            {paths.map((path) => (
                                <Link
                                    href={`/borrow/${path.to}`}
                                    key={path.to}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                                        pathname.includes(path.to) 
                                            ? 'bg-gray-700 text-yellow-500' 
                                            : 'hover:bg-gray-700 text-gray-300 hover:text-yellow-500'
                                    }`}
                                >
                                    {path.icon}
                                    {path.name}
                                </Link>
                            ))}
                        </div>
                        <div className="flex-1 bg-gray-800 bg-opacity-40 backdrop-blur p-6 rounded-lg">
                            {connected || activeAccount ? (
                                children
                            ) : (
                                <div className="text-center py-12">
                                    <h3 className="text-xl mb-4">Connect Your Wallet First</h3>
                                    {isLoading ? (
                                        <button className="px-6 py-2 bg-yellow-500 text-gray-900 rounded-lg">
                                            Connecting...
                                        </button>
                                    ) : (
                                        <button 
                                            className="px-6 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-600 transition-colors"
                                            data-bs-toggle="modal" 
                                            data-bs-target="#connectmodal"
                                        >
                                            Connect wallet
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}