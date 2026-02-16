import Link from "next/link";
import Navbar from "../components/Navbar";

export default function NotFound() {
  return (
    <div>
      <Navbar />
      <div
        className="absolute inset-0 mask-t-from-80% mask-b-from-50% -z-20 bg-cover bg-center bg-no-repeat opacity-60 md:opacity-100"
        style={{
          backgroundImage: `url(/minimal-globe-technology-business-background2.webp)`,
        }}
      />
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6 text-center gap-y-4">
        <span className="text-[100px] sm:text-[150px] md:text-[220px] font-bold leading-none select-none order-1 md:order-3">
          404
        </span>
        <span className="w-full md:w-2/4 text-[18px] md:text-[28px] text-neutral-100 leading-relaxed order-2">
          {`Oops! The page you're looking for doesn't exist or may have been moved.`}
        </span>
        <Link
          href={"/"}
          className="bg-main hover:bg-main/90 active:scale-[0.95] text-white shadow-lg shadow-main/20 px-8 py-3 rounded-three mt-4 md:mt-5 transition-all font-bold order-3 md:order-2"
        >
          Back to Homepage
        </Link>
      </div>
    </div>
  );
}
