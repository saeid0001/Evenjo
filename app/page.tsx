import Link from "next/link";

export default function Home() {
  return (
    <div>
      <main>
        <h1 className=" text-brand-900 text-6xl">Start Evnjo Concert Order</h1>
        <div className=" light_back">
          {/* <SeatMap data={lasVegasData as any} /> */}
        </div>
        <div className="gradient-cool cursor-pointer text-white w-fit p-4 rounded-2xl border border-tint-2 ">
          <Link href={"/home"}>Home</Link>
        </div>
        <div className="gradient-cool cursor-pointer text-white w-fit p-4 rounded-2xl border border-tint-2 ">
          <Link href={"/concerts"}>Concerts</Link>
        </div>
      </main>
    </div>
  );
}
