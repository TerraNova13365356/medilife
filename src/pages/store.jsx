import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

import {
  Search,
  User,
  Phone,
  MapPin,
  X,
  Package,
  Calendar,
  Thermometer,
} from "lucide-react";

const MedicineSearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [buyerInfo, setBuyerInfo] = useState({
    name: "",
    phone: "",
    address: "",
    quantity: 0,
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchDonatedMedicines = async () => {
      try {
        const snapshot = await getDocs(collection(db, "medicineDonations"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMedicines(data);
      } catch (error) {
        console.error("Error fetching medicines:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonatedMedicines();
  }, []);

  const filteredMedicines = medicines.filter(
    (med) =>
      med.medicineName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.manufacturer?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBuyClick = (medicine) => {
    setSelectedMedicine(medicine);
    setFormErrors({});
  };

  const handleCloseModal = () => {
    setSelectedMedicine(null);
    setBuyerInfo({ name: "", phone: "", address: "" });
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};
    if (!buyerInfo.name.trim()) errors.name = "Name is required";
    if (!buyerInfo.phone.trim()) errors.phone = "Phone number is required";
    if (!buyerInfo.address.trim()) errors.address = "Address is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleBuySubmit = async () => {
    if (!validateForm()) return;

    try {

      // Add user-specific order
      let orderRef = await addDoc(
        collection(db, `users/${localStorage.getItem("username")}/orders`),
        {
          ...buyerInfo,
          medicineId: selectedMedicine.id,
          medicineName: selectedMedicine.medicineName,
          timestamp: new Date(),
        }
      );

      // Get the document ID directly
      let orderid = orderRef.id;
      console.log(orderid);
      
      // Add global order record with reference to the user-specific one
      await addDoc(collection(db, "medicine_orders"), {
        ...buyerInfo,
        medicineId: selectedMedicine.id,
        medicineName: selectedMedicine.medicineName,
        timestamp: new Date(),
        orderid: orderid,
      });

      // Decrease quantity in medicineDonations
      const newQuantity = selectedMedicine.quantity - buyerInfo.quantity;
      if (newQuantity < 0) {
        alert("Not enough quantity available.");
        return;
      }

      const medRef = doc(db, "medicineDonations", selectedMedicine.id);
      await updateDoc(medRef, {
        quantity: newQuantity,
      });

      // Update local state to reflect the new quantity
      setMedicines((prev) =>
        prev.map((med) =>
          med.id === selectedMedicine.id
            ? { ...med, quantity: newQuantity }
            : med
        )
      );

      // Show success message
      const successMessage = document.getElementById("successMessage");
      successMessage.classList.remove("hidden");
      setTimeout(() => {
        successMessage.classList.add("hidden");
        handleCloseModal();
      }, 2000);
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Error placing order.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-purple-800 mb-2">
            Donated Medicines
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse available donated medicines and request the ones you need.
            All medicines have been verified for quality.
          </p>
        </div>

        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by medicine name or manufacturer..."
            className="w-full p-4 pl-10 rounded-lg border border-purple-300 shadow-sm focus:ring-2 focus:ring-purple-300 focus:border-purple-500 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-12">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-purple-700">
              Loading available medicines...
            </p>
          </div>
        ) : filteredMedicines.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMedicines.map((med) => (
              <div
                key={med.id}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border border-purple-100"
              >
                <div className="relative">
                  {med.imageURL ? (
                    <img
                      src={med.imageURL}
                      alt={med.medicineName}
                      className="h-52 w-full object-cover"
                    />
                  ) : (
                    <div className="h-52 w-full bg-gradient-to-r from-purple-100 to-blue-50 flex items-center justify-center">
                      <Package className="h-16 w-16 text-purple-300" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                    {med.quantity} available
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-xl font-semibold text-purple-800 mb-2">
                    {med.medicineName}
                  </h3>
                  <div className="space-y-2 mb-4">
                    <p className="text-gray-700 flex items-center">
                      <span className="font-medium mr-2">Manufacturer:</span>{" "}
                      {med.manufacturer}
                    </p>
                    <p className="text-gray-700 flex items-center">
                      <span className="font-medium mr-2">Dosage:</span>{" "}
                      {med.dosage}
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center text-gray-700">
                        <Calendar className="h-4 w-4 mr-1 text-purple-600" />
                        <span className="text-sm">
                          Expires: {med.expiryDate}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Thermometer className="h-4 w-4 mr-1 text-purple-600" />
                        <span className="text-sm">{med.storage}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-3">
                      Donated by: {med.name}
                    </p>
                    {med.quantity == 0 ? (
                      <button className="w-full px-4 py-2 bg-purple-300 text-white rounded-lg transition-colors duration-300 flex items-center justify-center">
                        Sold Out
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBuyClick(med)}
                        className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-300 flex items-center justify-center"
                      >
                        Request Medicine
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">
              No matching medicines found.
            </p>
            <p className="text-gray-500">
              Try adjusting your search terms or check back later.
            </p>
          </div>
        )}
      </div>

      {/* Success Message */}
      <div
        id="successMessage"
        className="hidden fixed top-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md animate-fadeIn"
      >
        Order placed successfully! We'll contact you soon.
      </div>

      {/* Modal */}
      {selectedMedicine && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white p-6 rounded-xl w-[90%] max-w-md shadow-xl relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-black transition-colors"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>

            <h2 className="text-xl font-bold text-purple-800 mb-6 flex items-center">
              Request {selectedMedicine.medicineName}
            </h2>

            <p className="text-gray-600 mb-6">
              Please provide your contact details to request this medicine.
              We'll coordinate the pickup or delivery.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Your Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Full Name"
                    className={`w-full pl-10 p-3 border rounded-lg focus:ring focus:ring-purple-200 transition-all ${
                      formErrors.name ? "border-red-400" : "border-gray-300"
                    }`}
                    value={buyerInfo.name}
                    onChange={(e) =>
                      setBuyerInfo({ ...buyerInfo, name: e.target.value })
                    }
                  />
                </div>
                {formErrors.name && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Contact Number"
                    className={`w-full pl-10 p-3 border rounded-lg focus:ring focus:ring-purple-200 transition-all ${
                      formErrors.phone ? "border-red-400" : "border-gray-300"
                    }`}
                    value={buyerInfo.phone}
                    onChange={(e) =>
                      setBuyerInfo({ ...buyerInfo, phone: e.target.value })
                    }
                  />
                </div>
                {formErrors.phone && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.phone}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Delivery Address
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    placeholder="Your Address"
                    className={`w-full pl-10 p-3 border rounded-lg focus:ring focus:ring-purple-200 transition-all ${
                      formErrors.address ? "border-red-400" : "border-gray-300"
                    }`}
                    rows="3"
                    value={buyerInfo.address}
                    onChange={(e) =>
                      setBuyerInfo({ ...buyerInfo, address: e.target.value })
                    }
                  />
                </div>

                {formErrors.address && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.address}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Quantity of Medicine
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <Package className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    placeholder="Quantity"
                    className={`w-full pl-10 p-3 border rounded-lg focus:ring focus:ring-purple-200 transition-all ${
                      formErrors.quantity ? "border-red-400" : "border-gray-300"
                    }`}
                    value={buyerInfo.quantity}
                    onChange={(e) =>
                      setBuyerInfo({
                        ...buyerInfo,
                        quantity: parseInt(e.target.value),
                      })
                    }
                  />
                </div>

                {formErrors.quantity && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.quantity}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={handleBuySubmit}
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors duration-300 mt-6 font-medium"
            >
              Confirm Request
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicineSearchPage;
