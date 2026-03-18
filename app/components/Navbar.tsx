"use client";

import Link from 'next/link'
import { useState, useEffect } from 'react';
import { useCart } from "../context/CartContext";

export default function Navbar() {

    interface itemColor {
        id: number;
        name: string;
        price: number;
        image: string;
        qty: number;
    }

    const { cart, clearCart } = useCart();
    // console.log(cart.length);

    const totalItems = cart.reduce((sum:number, item:itemColor) => sum + item.qty, 0);
    // console.log(totalItems);

    return (
        <div className="bg-stone-50 text-neutral-800">
      
            <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-orange-100 shadow-sm">
                <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
                    <div className="text-3xl font-black text-orange-600 tracking-tighter">
                        อร่อย<span className="bg-orange-500 text-white px-2 py-1 rounded-xl ml-1 shadow-orange-200 shadow-lg">เลิศ</span>
                    </div>
                    
                    <div className="flex items-center gap-5">

                        <Link href="/" className="text-xs font-bold text-black-400 hover:text-red-500">
                            หน้าหลัก
                        </Link>
                        
                        {cart.length > 0 && (
                            <button onClick={clearCart} className="text-xs font-bold text-neutral-400 hover:text-red-500 transition-colors">
                                ล้างตะกร้า
                            </button>
                        )}
                        <Link href="/cart" className="relative cursor-pointer group">
                        <div className="p-3 bg-orange-50 rounded-2xl group-hover:bg-orange-500 transition-all duration-300">
                            <svg className="w-6 h-6 text-orange-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                            </svg>
                        </div>
                        { totalItems > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[11px] font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
                            {totalItems}
                            </span>
                        )}
                        </Link>
                    </div>
                </div>
            </nav>
        </div>
    )
}