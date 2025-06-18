import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

interface Airport {
  icao: string;
  name: string;
  city: string;
  country: string;
  similarity?: number;
}

interface IcaoAutocompleteProps {
  value: string;
  onChange: (value: string) => void | Promise<void>;
  placeholder?: string;
  className?: string;
}

export default function IcaoAutocomplete({ 
  value, 
  onChange, 
  placeholder = "Enter ICAO code",
  className = ""
}: IcaoAutocompleteProps) {
  const [airports, setAirports] = useState<Airport[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = async (searchTerm: string) => {
    onChange(searchTerm.toUpperCase());
    
    if (searchTerm.length >= 2) {
      setLoading(true);
      try {
        const response = await fetch(`/api/airports/search?q=${encodeURIComponent(searchTerm)}`);
        if (response.ok) {
          const data = await response.json();
          setAirports(data);
          setOpen(true);
        }
      } catch (error) {
        console.error('Error searching airports:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setAirports([]);
      setOpen(false);
    }
  };

  const handleSelect = (airport: Airport) => {
    onChange(airport.icao);
    setOpen(false);
    setAirports([]);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setOpen(false);
    };

    if (open) {
      document.addEventListener('click', handleClickOutside);
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [open]);

  return (
    <div className="relative">
      <Input
        value={value}
        onChange={(e) => handleInputChange(e.target.value)}
        onFocus={() => value.length >= 2 && setOpen(true)}
        placeholder={placeholder}
        className={className}
        maxLength={4}
      />
      {open && airports.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-slate-800 border border-slate-600 rounded-md shadow-lg max-h-60 overflow-auto">
          {airports.map((airport) => (
            <div
              key={airport.icao}
              onClick={() => handleSelect(airport)}
              className="px-3 py-2 cursor-pointer hover:bg-slate-700 text-white"
            >
              <div className="font-medium">
                {airport.icao} - {airport.name}
              </div>
              <div className="text-sm text-slate-400">
                {airport.city}, {airport.country}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}