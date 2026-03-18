"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from "../context/CartContext";

export default function CartPage() {
  // const [cart, setCart] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [totlalFirst, setTotlalFirst] = useState(0);
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
  // const [totalAfterMemberCode, setTotalAfterMemberCode] = useState(0);
  const [totalFinal, setTotalFinal] = useState(0);
  const [discountItem, setDiscountItem] = useState([]);
  const [discountItemTotal, setDiscountItemTotal] = useState(0);
  const [discountMember, setDiscountMember] = useState(0);
  // const [discount, setDiscount] = useState(0);
  const [showAlert, setShowAlert] = useState('');
  const [typeAlert, setTypeAlert] = useState(true);

  const { cart, updateQty, removeItem, clearCart } = useCart();

  // const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  // const total = subtotal - discount;

  useEffect(() => {
    processMoney('');
  }, []);

  const processMoney = async (type) => {
    const saved = localStorage.getItem("aroy-lerd-cart");
    let cart_items = JSON.parse(saved);
    // console.log(cart_items);
    if( cart_items.length>0 ){
      let datas = {
        cart_items: cart_items,
        member_code : coupon,
      };

      const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL+ '/process_money', {
        method: 'POST',
        credentials: 'include', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datas),
      });
      const data = await res.json();
      // console.log(data);

      setTotlalFirst(data.total_first);
      setDiscountItemTotal(data.discount_item_total);
      setTotalAfterDiscount(data.total_after_discount);
      setDiscountMember(data.discount_member);
      // setTotalAfterMemberCode(data.total_after_member_code);
      setTotalFinal(data.total_final);

      setDiscountItem(data.discount_item);

      if( type=='applymember' ){
        setShowAlert('');
        if( data.discount_member>0 ){
          setShowAlert('Member Code is Correct');
          setTypeAlert(true);
        }else{
          setShowAlert('Member Code is Incorrect');
          setTypeAlert(false);
        }
      }
      
      

    }else{
      setTotlalFirst(0);
      setDiscountItemTotal(0);
      setTotalAfterDiscount(0);
      setDiscountMember(0);
      // setTotalAfterMemberCode(data.total_after_member_code);
      setTotalFinal(0);

      setDiscountItem([]);
    }
  };

  const applyMember = () => {
    // console.log(coupon);
    processMoney('applymember');
  };

  const handleUpdateQty = async (item_id, item_qty) => {
    await updateQty(item_id, item_qty);
    processMoney('');
  }

  const handleRemoveItem = async (item_id) => {
    await removeItem(item_id);
    processMoney('');
  }

  const handleOrder = async () => 
  {
    const saved = localStorage.getItem("aroy-lerd-cart");
    let cart_items = JSON.parse(saved);
    // console.log(cart_items);
      let datas = {
        cart_items: cart_items,
        member_code : coupon,
      };
      const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL+ '/save_order', {
        method: 'POST',
        credentials: 'include', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datas),
      });
      const data = await res.json();
      // console.log(data);
      setShowAlert(data.message);

      if( data.status===true ){
        setTypeAlert(true);
        clearCart();
      }else{
        setTypeAlert(false);
      }
  }

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      <nav className="pt-6 pr-6 pl-6">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link href="/" className="text-orange-600 hover:bg-orange-50 p-2 rounded-full transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
          </Link>
          <h1 className="text-2xl font-black text-neutral-800">ตะกร้าของฉัน</h1>
        </div>
      </nav>

      {showAlert!='' && (
        <div className="max-w-4xl mx-auto px-4 mt-8">
          {typeAlert===true ? (
          <div className="flex items-center p-4 mb-4 text-emerald-800 rounded-xl bg-emerald-50 border border-emerald-200 shadow-sm" role="alert">
            <svg className="flex-shrink-0 w-5 h-5 text-green-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
            </svg>
            <div className="ms-3 text-sm font-medium">
              {showAlert}
            </div>
            <button 
              onClick={() => setShowAlert('')}
              className="ms-auto -mx-1.5 -my-1.5 bg-emerald-50 text-emerald-500 rounded-lg p-1.5 hover:bg-emerald-100 inline-flex items-center justify-center h-8 w-8 transition"
            >
              <span className="sr-only">ปิด</span>
              <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
              </svg>
            </button>
          </div>
          ) : (
            <div className="flex p-4 mb-4 text-amber-900 rounded-lg bg-amber-50 border border-amber-200" role="alert">
            <div className="ms-3 text-sm font-medium">
              {showAlert}
            </div>
            <button 
              onClick={() => setShowAlert('')}
              className="ms-auto -mx-1.5 -my-1.5 bg-amber-50 text-amber-500 rounded-lg focus:ring-2 focus:ring-amber-400 p-1.5 hover:bg-amber-200 inline-flex items-center justify-center h-8 w-8"
            >
              <span className="sr-only">ปิด</span>
              <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
              </svg>
            </button>
          </div>
          )}
        </div>
      )}
      

      <main className="max-w-4xl mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <div className="md:col-span-2 space-y-4">
          {cart.length === 0 ? (
            <div className="bg-white p-12 rounded-[2rem] text-center shadow-sm border border-neutral-100">
              <p className="text-neutral-400 mb-6">ยังไม่มีอาหารในตะกร้าเลย</p>
              <Link href="/" className="bg-orange-500 text-white px-8 py-3 rounded-xl font-bold">ไปเลือกเมนูอร่อย</Link>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-3xl shadow-sm border border-neutral-100 flex gap-4 items-center">
                <img src={item.image} className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover" alt="" />
                <div className="flex-grow">
                  <h3 className="font-bold text-neutral-800">{item.name}</h3>
                  <p className="text-orange-600 font-bold">{item.price}.-</p>
                  
                  <div className="flex items-center gap-3 mt-2">
                    <button onClick={() => handleUpdateQty(item.id, item.qty - 1)} className="w-8 h-8 rounded-lg border border-neutral-200 flex items-center justify-center hover:bg-orange-50">-</button>
                    <span className="font-bold text-sm">{item.qty}</span>
                    <button onClick={() => handleUpdateQty(item.id, item.qty + 1)} className="w-8 h-8 rounded-lg border border-neutral-200 flex items-center justify-center hover:bg-orange-50">+</button>
                  </div>
                </div>
                <button onClick={() => handleRemoveItem(item.id)} className="text-neutral-300 hover:text-red-500 p-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </div>
            ))
          )}
        </div>

        
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-neutral-100">
            <h4 className="font-bold mb-4 flex items-center gap-2">
               <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM5.884 6.68a1 1 0 101.415-1.414l-.707-.707a1 1 0 00-1.415 1.414l.707.707zm8.232 0l.707-.707a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414zM9 11a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zM11 13a1 1 0 10-2 0v.01a1 1 0 102 0V13zM15 11a1 1 0 11-2 0h-.01a1 1 0 110-2H13a1 1 0 011 1zM5 10a1 1 0 100 2h.01a1 1 0 100-2H5zm3.293-4.293a1 1 0 011.414 0l.293.293a1 1 0 010 1.414l-.293.293a1 1 0 01-1.414 0l-.293-.293a1 1 0 010-1.414l.293-.293z"></path></svg>
               Member Card
            </h4>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder='ใส่ Code "AROYLERD"' 
                value={coupon.toUpperCase()}
                onChange={(e) => setCoupon(e.target.value)}
                className="flex-grow bg-neutral-50 border border-neutral-100 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button 
                onClick={applyMember}
                className="bg-neutral-900 text-white px-4 py-3 rounded-xl text-sm font-bold hover:bg-neutral-800 transition"
              >
                ใช้
              </button>
            </div>
          </div>

          
          <div className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-orange-100/50 border border-orange-50 border-t-4 border-t-orange-500">
            <h4 className="font-bold text-lg mb-6 text-neutral-800">สรุปยอดชำระ</h4>
            <div className="space-y-4 text-sm text-neutral-600">
              <div className="flex justify-between">
                <span>รวมราคาอาหาร</span>
                {/* <span className="font-bold text-neutral-800">{subtotal.toLocaleString()}</span> */}
                <span className="font-bold text-neutral-800">{totlalFirst.toLocaleString()}</span>
              </div>
              {discountItemTotal > 0 && (
                <>
                  <div className="flex justify-between text-green-700 font-medium mb-0">
                    <span>ส่วนลดพิเศษ</span>
                    <span>- {discountItemTotal.toLocaleString()}</span>
                  </div>
                  <div className="py-0.5 px-2 bg-gray-100 border border-solid border-[#ccc] rounded-lg mb-5">
                    { discountItem.Orange!=undefined && discountItem.Orange.discount>0 && (
                      <div className="flex justify-between text-orange-500 font-light text-xs pl-8" style={{marginBottom:0}}>
                        <span></span>
                        <span>Orange &nbsp; - {discountItem.Orange.discount_p}% = {discountItem.Orange.discount.toLocaleString()}</span>
                      </div>
                    )}
                    { discountItem.Pink!=undefined && discountItem.Pink.discount>0 && (
                      <div className="flex justify-between text-pink-500 font-light text-xs pl-8" style={{marginBottom:0}}>
                        <span></span>
                        <span>Pink &nbsp; - {discountItem.Pink.discount_p}% = {discountItem.Pink.discount.toLocaleString()}</span>
                      </div>
                    )}
                    { discountItem.Green!=undefined && discountItem.Green.discount>0 && (
                      <div className="flex justify-between text-green-600 font-light text-xs pl-8" style={{marginBottom:0}}>
                        <span></span>
                        <span>Green &nbsp; - {discountItem.Green.discount_p}% = {discountItem.Green.discount.toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between">
                    <span>ราคาหลังหักส่วนลด</span>
                    {/* <span className="font-bold text-neutral-800">{subtotal.toLocaleString()}</span> */}
                    <span className="font-bold text-neutral-800">{totalAfterDiscount.toLocaleString()}</span>
                  </div>
                </>
              )}
              {discountMember > 0 && (
                <>
                  <div className="flex justify-between text-green-700 font-medium">
                    <span>ส่วนลดสมาชิก (10%)</span>
                    <span>-{discountMember.toLocaleString()}</span>
                  </div>
                  {/* <div className="flex justify-between">
                    <span>ราคาหลังหักส่วนลด</span>
                    <span className="font-bold text-neutral-800">{totalFinal.toLocaleString()}</span>
                  </div> */}
                </>
              )}
              <hr className="border-dashed border-neutral-100" />
              <div className="flex justify-between text-xl font-black text-neutral-900 pt-2">
                <span>ยอดสุทธิ</span>
                <span className="text-orange-600">{totalFinal.toLocaleString()}</span>
              </div>
            </div>
            
            {cart.length>0 && (
              <button 
                onClick={() => handleOrder()}
                className="w-full mt-8 py-5 bg-orange-500 hover:bg-orange-600 text-white rounded-[1.5rem] font-black text-lg shadow-lg shadow-orange-200 transition-all active:scale-95 flex items-center justify-center gap-3"
                disabled={cart.length === 0}
              >
                สั่งอาหารเลย
              </button>
            )}

          </div>
        </div>

      </main>
    </div>
  );
}