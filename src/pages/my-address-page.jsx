import { useState } from "react";
import { useNavigate } from "react-router";
import { MapPin, Plus, Edit2, Trash2, Home, Building } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import useQuery from "@/hooks/use-query";
import useMutation from "@/hooks/use-mutation";
import { toast } from "sonner";

const AddressCard = ({ address, onEdit, onDelete, onSetDefault }) => {
  return (
    <div
      className={`border-2 rounded-xl p-5 transition-all duration-300 ${
        address.is_default
          ? "border-blue-600 bg-blue-50"
          : "border-gray-200 hover:border-gray-300"
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <div
            className={`p-2 rounded-lg ${
              address.is_default ? "bg-blue-100" : "bg-gray-100"
            }`}
          >
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">
              {address.province}, {address.city}
            </p>
            {address.is_default && (
              <span className="inline-block text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full mt-1">
                Default
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(address)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit2 className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => onDelete(address.id)}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-2">{address.address}</p>
      <p className="text-sm text-gray-500 mb-3">
        {address.district}, {address.village}
      </p>

      {!address.is_default && (
        <button
          onClick={() => onSetDefault(address.id)}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Set as Default
        </button>
      )}
    </div>
  );
};

export default function MyAddressPage() {
  const navigate = useNavigate();
  const [deletingId, setDeletingId] = useState(null);
  const [settingDefaultId, setSettingDefaultId] = useState(null);

  const {
    data: addressesData,
    loading,
    refetch,
  } = useQuery({
    url: "/delivery-addresses",
    method: "GET",
    guard: true,
    immediate: true,
  });

  const { mutate: deleteAddress } = useMutation({
    url: "/delivery-addresses",
    method: "DELETE",
    guard: true,
    onSuccess: (data) => {
      toast.success(data.message);
      refetch();
      setDeletingId(null);
    },
    onError: () => {
      setDeletingId(null);
    },
  });

  const { mutate: setDefaultAddress } = useMutation({
    url: "/delivery-addresses",
    method: "PATCH",
    guard: true,
    onSuccess: (data) => {
      toast.success(data.message);
      refetch();
      setSettingDefaultId(null);
    },
    onError: () => {
      setSettingDefaultId(null);
    },
  });

  const addresses = addressesData || [];

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      setDeletingId(id);
      await deleteAddress({}, `/${id}`);
    }
  };

  const handleSetDefault = async (id) => {
    setSettingDefaultId(id);
    await setDefaultAddress({}, { path: `/delivery-addresses/${id}/default` });
  };

  const handleEdit = (address) => {
    navigate(`/my-address/edit/${address.id}`, { state: { address } });
  };

  const handleAddNew = () => {
    navigate("/my-address/add");
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50">
          <div className="bg-white border-b border-gray-200 py-6">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-20">
              <div className="flex justify-between items-center">
                <div>
                  <div className="h-8 bg-gray-200 rounded w-48 animate-pulse mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
                </div>
                <div className="h-10 bg-gray-200 rounded-lg w-40 animate-pulse"></div>
              </div>
            </div>
          </div>
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-20 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="border-2 border-gray-200 rounded-xl p-5"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 bg-gray-200 rounded-lg animate-pulse"></div>
                      <div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
                    </div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200 py-6">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-20">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-[28px] font-bold text-gray-900 mb-1">
                  My Addresses
                </h1>
                <p className="text-gray-600">Manage your delivery addresses</p>
              </div>
              <button
                onClick={handleAddNew}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add New Address
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-20 py-12">
          {addresses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {addresses.map((address) => (
                <AddressCard
                  key={address.id}
                  address={address}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onSetDefault={handleSetDefault}
                  isDeleting={deletingId === address.id}
                  isSettingDefault={settingDefaultId === address.id}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                <MapPin className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No addresses yet
              </h3>
              <p className="text-gray-500 mb-6">
                Add your first address to start shopping
              </p>
              <button
                onClick={handleAddNew}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Address
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
