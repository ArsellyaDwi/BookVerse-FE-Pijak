import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { Navigation, X, ArrowLeft } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import useMutation from "@/hooks/use-mutation";
import { toast } from "sonner";
import markerIcon from "../../node_modules/leaflet/dist/images/marker-icon.png";

const loadLeaflet = () => {
  return Promise.all([import("leaflet/dist/leaflet.css"), import("leaflet")]);
};

const MapComponent = ({ lat, lng, onLocationSelect, height = "300px" }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const mapContainerRef = useRef(null);
  const [L, setL] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const isInitializedRef = useRef(false);

  // Load Leaflet
  useEffect(() => {
    loadLeaflet().then(([, leaflet]) => {
      setL(leaflet);
      setIsLoading(false);
    });
  }, []);

  // Initialize map once
  useEffect(() => {
    if (!L || !mapContainerRef.current || isLoading || isInitializedRef.current) return;

    isInitializedRef.current = true;

    mapRef.current = L.map(mapContainerRef.current).setView(
      [lat || -6.2088, lng || 106.8456],
      13
    );

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }
    ).addTo(mapRef.current);

    const defaultIcon = new L.icon({
      iconUrl: markerIcon,
      iconSize: [25, 41],
      shadowSize: [30, 65],
      iconAnchor: [12, 41],
      shadowAnchor: [7, 65]
    });

    markerRef.current = L.marker([lat || -6.2088, lng || 106.8456], {
      icon: defaultIcon,
      draggable: true,
    }).addTo(mapRef.current);

    markerRef.current.on("dragend", (e) => {
      const position = e.target.getLatLng();
      if (onLocationSelect) {
        onLocationSelect(position.lat, position.lng);
      }
    });

    mapRef.current.on("click", (e) => {
      const { lat: clickLat, lng: clickLng } = e.latlng;
      markerRef.current.setLatLng([clickLat, clickLng]);
      if (onLocationSelect) {
        onLocationSelect(clickLat, clickLng);
      }
    });
  }, [L, isLoading, lat, lng, onLocationSelect]);

  // Update view and marker when lat/lng change (without recreating map)
  useEffect(() => {
    if (!mapRef.current || !markerRef.current) return;

    const currentLatLng = markerRef.current.getLatLng();
    const newLat = lat || -6.2088;
    const newLng = lng || 106.8456;

    // Only update if position actually changed
    if (currentLatLng.lat !== newLat || currentLatLng.lng !== newLng) {
      mapRef.current.setView([newLat, newLng], mapRef.current.getZoom());
      markerRef.current.setLatLng([newLat, newLng]);
    }
  }, [lat, lng]);

  // Cleanup only on unmount
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      isInitializedRef.current = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div
        className="bg-gray-100 rounded-xl flex items-center justify-center"
        style={{ height }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-500">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mapContainerRef}
      style={{ height, width: "100%", borderRadius: "12px" }}
    />
  );
};

export default function AddAddressPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    province: "",
    city: "",
    district: "",
    village: "",
    address: "",
    lat: -6.2088,
    long: 106.8456,
    is_default: false,
  });

  const { mutate: createAddress, loading } = useMutation({
    url: "/delivery-addresses",
    method: "POST",
    guard: true,
    onSuccess: (data) => {
      toast.success(data.message);
      navigate("/my-address");
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createAddress(formData);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            lat: position.coords.latitude,
            long: position.coords.longitude,
          });
        },
        (error) => {
          alert("Unable to get your location: " + error.message);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200 py-6">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-20">
            <button
              onClick={() => navigate("/my-address")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Addresses
            </button>
            <h1 className="text-[28px] font-bold text-gray-900 mb-1">
              Add New Address
            </h1>
            <p className="text-gray-600">Enter your delivery address details</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-20 py-12">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl p-6 shadow-sm space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Province *
                </label>
                <input
                  type="text"
                  required
                  value={formData.province}
                  onChange={(e) =>
                    setFormData({ ...formData, province: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., DKI Jakarta"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Jakarta Selatan"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  District *
                </label>
                <input
                  type="text"
                  required
                  value={formData.district}
                  onChange={(e) =>
                    setFormData({ ...formData, district: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Kebayoran Baru"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Village *
                </label>
                <input
                  type="text"
                  required
                  value={formData.village}
                  onChange={(e) =>
                    setFormData({ ...formData, village: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Gunung"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Complete Address *
              </label>
              <textarea
                required
                rows="3"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Street name, building number, etc."
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Pin Location on Map
                </label>
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <Navigation className="w-4 h-4" />
                  Use my current location
                </button>
              </div>
              <MapComponent
                lat={formData.lat}
                lng={formData.long}
                onLocationSelect={(lat, lng) => {
                  setFormData({ ...formData, lat, long: lng });
                }}
                height="300px"
              />
              <p className="text-xs text-gray-500 mt-2">
                Drag the marker or click on the map to set your exact location
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_default"
                checked={formData.is_default}
                onChange={(e) =>
                  setFormData({ ...formData, is_default: e.target.checked })
                }
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="is_default" className="text-sm text-gray-700">
                Set as default address
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Address"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/my-address")}
                className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
