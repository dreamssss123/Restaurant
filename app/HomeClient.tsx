"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'
import { useCart } from "./context/CartContext";
// import Link from 'next/link'

export default function HomeClient({ initialItems }) {

  const [menuItems, setItems] = useState(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const openModal = (item) => {
    setSelectedItem(item);
    setQuantity(1);
    setIsModalOpen(true);
  };

  const { addToCart } = useCart();
  const handleConfirmAdd = () => {
    addToCart(selectedItem, quantity);
    setIsModalOpen(false); 
  };

  const router = useRouter()
  const handleConfirmOrder = async () => {
    await addToCart(selectedItem, quantity);
    router.push('/cart')
  };

  return (
    
    <>
      <main className="max-w-6xl mx-auto p-4 py-8 md:py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {menuItems.map((item) => (
            <div key={item.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-neutral-100 hover:shadow-xl hover:shadow-orange-100 transition-all duration-300 group">
              <div className="relative aspect-[4/5]">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-orange-600 shadow-sm">
                    {item.price}.-
                </div>
              </div>
              <div className="p-4 flex flex-col items-center">
                <h3 className="font-bold text-neutral-800 text-center text-sm md:text-lg mb-4 line-clamp-1">{item.name}</h3>
                <button 
                  onClick={() => openModal(item)}
                  className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl text-sm font-bold shadow-md shadow-orange-100 transition-all active:scale-95"
                >
                  สั่งเลย
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="relative h-56">
              <img src={selectedItem?.image} className="w-full h-full object-cover" alt="" />
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white rounded-full p-2 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            <div className="p-8">
              <h3 className="text-2xl font-black text-neutral-800 mb-1">{selectedItem?.name}</h3>
              <p className="text-orange-600 font-bold text-lg mb-8">{selectedItem?.price} บาท</p>
              
              <div className="flex items-center justify-between mb-8">
                <span className="font-bold text-neutral-500 uppercase tracking-widest text-xs">Quantity</span>
                <div className="flex items-center gap-6 bg-neutral-50 border border-neutral-100 rounded-2xl p-1">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-sm border border-neutral-100 text-orange-500 hover:bg-orange-500 hover:text-white transition-all"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M20 12H4"></path></svg>
                  </button>
                  <span className="text-2xl font-black w-4 text-center">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-sm border border-neutral-100 text-orange-500 hover:bg-orange-500 hover:text-white transition-all"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"></path></svg>
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="text-neutral-400 font-medium">ยอดรวม</span>
                <span className="text-3xl font-black text-neutral-900">{(selectedItem?.price * quantity).toLocaleString()}.-</span>
              </div>

              <button 
                onClick={() => handleConfirmAdd(selectedItem, quantity)}
                className="w-full py-5 bg-orange-500 hover:bg-orange-600 text-white rounded-[1.5rem] font-black text-lg shadow-xl shadow-orange-200 transition-all active:scale-95 flex items-center justify-center gap-3 mb-3"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                เพิ่มลงตะกร้า
              </button>

              <button 
                onClick={() => handleConfirmOrder(selectedItem, quantity)}
                className="w-full py-5 bg-red-500 hover:bg-red-600 text-white rounded-[1.5rem] font-black text-lg shadow-xl shadow-orange-200 transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                สั่งซื้อเลย
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}