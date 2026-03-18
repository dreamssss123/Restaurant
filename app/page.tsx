import HomeClient from './HomeClient';

async function getMenus() {
  const res = await fetch('http://localhost:3001/menu/get', { cache: 'no-store' });
  return res.json();
}

export default async function Page() {
  const initialData = await getMenus();

  return (
    <main>
      <div className="min-h-screen bg-stone-50 text-neutral-800">

        <div className="max-w-6xl mx-auto px-4 pt-8">
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-4xl font-extrabold text-neutral-900 mb-2">เมนูอร่อยวันนี้ 👨‍🍳</h1>
            <p className="text-neutral-500">เลือกสรรความอร่อย ส่งตรงถึงหน้าบ้านคุณ</p>
          </div>
        </div>


        <HomeClient initialItems={initialData} />
        
      </div>
    </main>
  );
}