import { ShoppingCart, ArrowRight } from "lucide-react";
import Link from "next/link";

interface ShopSimilarFurnitureProps {
  roomType: string;
}

export function ShopSimilarFurniture({ roomType }: ShopSimilarFurnitureProps) {
  // Map specific room types to our internal Shop Category Slugs
  const getCategorySlug = (room: string) => {
    const map: Record<string, string> = {
      living_room: "living-room",
      bedroom: "bedroom",
      kitchen: "kitchen",
      bathroom: "bathroom",
      dining_room: "dining-room",
      home_office: "home-office",
      kids_room: "kids-room",
      studio_apartment: "studio-apartment",
      balcony: "balcony",
      entryway: "entryway"
    };
    return map[room] || room.replace('_', '-');
  };

  const getRoomName = (room: string) => {
    return room.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const slug = getCategorySlug(roomType);
  const roomName = getRoomName(roomType);

  return (
    <div className="mt-12 border-t border-neutral-100 pt-10 pb-6 mb-10">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
          <ShoppingCart className="w-6 h-6" />
        </div>
        <h3 className="text-2xl font-bold text-neutral-900 tracking-tight">Shop This Look</h3>
        <p className="text-neutral-500 text-sm mt-2 max-w-xs">
          Discover curated furniture and decor hand-picked by our studio to match your new {roomName} design.
        </p>
      </div>

      <div className="space-y-4">
        <Link 
          href={`/shop/${slug}`}
          className="group block bg-white border border-neutral-200 p-6 rounded-[2rem] hover:border-blue-500 hover:shadow-xl hover:shadow-blue-50 transition-all duration-300 relative overflow-hidden"
        >
          <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
            <ShoppingCart className="w-32 h-32" />
          </div>
          
          <div className="flex items-center justify-between relative z-10">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 block mb-1">Our Collection</span>
              <h4 className="text-lg font-bold text-neutral-900">Browse {roomName} Essentials</h4>
              <p className="text-neutral-400 text-xs mt-1">Explore items seen in this transformation</p>
            </div>
            <div className="w-12 h-12 bg-neutral-900 text-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </Link>

        <Link 
          href="/shop"
          className="w-full py-4 text-center text-sm font-bold text-neutral-400 hover:text-neutral-900 transition-colors block"
        >
          View Full Catalog
        </Link>
      </div>
    </div>
  );
}
