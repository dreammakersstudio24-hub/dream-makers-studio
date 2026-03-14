import { ShoppingCart } from "lucide-react";

interface ShopSimilarFurnitureProps {
  roomType: string;
}

export function ShopSimilarFurniture({ roomType }: ShopSimilarFurnitureProps) {
  // Map specific room types to relevant search queries
  const getSearchTerm = (room: string) => {
    const map: Record<string, string> = {
      living_room: "Modern Living Room Furniture Decoration",
      bedroom: "Cozy Bedroom Furniture Set",
      kitchen: "Kitchen Organization and Decor",
      bathroom: "Luxury Bathroom Accessories",
      dining_room: "Dining Room Table and Chairs",
      office: "Ergonomic Home Office Setup",
      kids_room: "Kids Room Decor and Storage",
      studio: "Space Saving Furniture Studio Appartment",
      balcony: "Outdoor Balcony Furniture Patio",
      entryway: "Entryway Console Table Mirror"
    };
    return map[room] || `${room.replace('_', ' ')} Furniture`;
  };

  const searchTerm = getSearchTerm(roomType);
  const encodedSearch = encodeURIComponent(searchTerm);

  // Example generic affiliate tags (User can replace these with actual tags later)
  const amazonTag = "dreammakers-20"; 
  const amazonLink = `https://www.amazon.com/s?k=${encodedSearch}&tag=${amazonTag}`;
  
  const wayfairLink = `https://www.wayfair.com/keyword.php?keyword=${encodedSearch}`;

  return (
    <div className="mt-8 border-t border-neutral-200 pt-8 pb-4">
      <h3 className="font-bold text-lg mb-4 text-black flex items-center gap-2">
        <ShoppingCart className="w-5 h-5" /> Shop The Look
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {/* Amazon Affiliate Card */}
        <a 
          href={amazonLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-white rounded-3xl p-4 border border-neutral-200 shadow-sm flex flex-col hover:border-blue-500 hover:shadow-md transition-all group"
        >
          <div className="bg-neutral-50 rounded-2xl aspect-[4/3] mb-3 flex flex-col items-center justify-center text-neutral-400">
             <span className="font-bold text-lg text-neutral-800">Amazon</span>
             <span className="text-xs">Partner</span>
          </div>
          <p className="font-bold text-sm line-clamp-2 text-black leading-tight mb-2">
            Find {searchTerm.split(' ')[0]} Items
          </p>
          <button className="mt-auto bg-black text-white text-xs font-bold py-2.5 rounded-xl w-full group-hover:bg-blue-600 transition-colors">
            Shop Amazon
          </button>
        </a>

        {/* Wayfair Affiliate Card */}
        <a 
          href={wayfairLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-white rounded-3xl p-4 border border-neutral-200 shadow-sm flex flex-col hover:border-purple-500 hover:shadow-md transition-all group"
        >
          <div className="bg-neutral-50 rounded-2xl aspect-[4/3] mb-3 flex flex-col items-center justify-center text-neutral-400">
             <span className="font-bold text-lg text-neutral-800">Wayfair</span>
             <span className="text-xs">Partner</span>
          </div>
           <p className="font-bold text-sm line-clamp-2 text-black leading-tight mb-2">
            Explore {searchTerm.split(' ')[0]} Decor
          </p>
          <button className="mt-auto bg-black text-white text-xs font-bold py-2.5 rounded-xl w-full group-hover:bg-purple-600 transition-colors">
            Shop Wayfair
          </button>
        </a>
      </div>
    </div>
  );
}
