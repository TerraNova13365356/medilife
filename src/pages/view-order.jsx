import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import {
  Calendar,
  Clock,
  User,
  Phone,
  MapPin,
  Package,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  ChevronDown,
} from "lucide-react";

const MedicineOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const q = query(
          collection(db, "medicine_orders"),
          orderBy("timestamp", "desc")
        );
        const snapshot = await getDocs(q);
        const fetchedOrders = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate?.() || new Date(),
          status: doc.data().status || "pending", // Default status if not set
        }));
        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setLoading(true);
      await updateDoc(doc(db, "medicine_orders", orderId), {
        status: newStatus,
        updatedAt: new Date(),
      });

      await updateDoc(
        doc(db, `users/${orders.name}/${orders.orderid}`, orderId),
        {
          status: newStatus,
          updatedAt: new Date(),
        }
      );

      // Update local state
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      // Show success message
      const successMessage = document.getElementById("statusUpdateMessage");
      successMessage.classList.remove("hidden");
      setTimeout(() => {
        successMessage.classList.add("hidden");
      }, 3000);
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const filteredOrders = orders.filter((order) => {
    // Filter by status
    const statusMatch = filterStatus === "all" || order.status === filterStatus;

    // Filter by search query (medicine name or customer name)
    const searchMatch =
      !searchQuery ||
      order.medicineName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.name?.toLowerCase().includes(searchQuery.toLowerCase());

    return statusMatch && searchMatch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <AlertCircle className="w-3 h-3 mr-1" />
            Pending
          </span>
        );
      case "approved":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </span>
        );
      case "delivered":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Package className="w-3 h-3 mr-1" />
            Delivered
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-purple-800 mb-2">
            Medicine Orders
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Manage and track all medicine requests and their current status.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-grow relative">
            <input
              type="text"
              placeholder="Search by medicine or customer name..."
              className="w-full p-3 pl-4 rounded-lg border border-purple-300 shadow-sm focus:ring-2 focus:ring-purple-300 focus:border-purple-500 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="relative">
            <button
              className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-purple-300 rounded-lg text-purple-700 hover:bg-purple-50 transition-all"
              onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
            >
              <Filter className="h-5 w-5" />
              <span>
                Filter:{" "}
                {filterStatus === "all"
                  ? "All Orders"
                  : filterStatus.charAt(0).toUpperCase() +
                    filterStatus.slice(1)}
              </span>
              <ChevronDown className="h-4 w-4" />
            </button>

            {filterDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                <div className="py-1">
                  {["all", "pending", "approved", "rejected", "delivered"].map(
                    (status) => (
                      <button
                        key={status}
                        className={`block px-4 py-2 text-sm text-left w-full hover:bg-purple-50 ${
                          filterStatus === status
                            ? "bg-purple-100 text-purple-800 font-medium"
                            : "text-gray-700"
                        }`}
                        onClick={() => {
                          setFilterStatus(status);
                          setFilterDropdownOpen(false);
                        }}
                      >
                        {status === "all"
                          ? "All Orders"
                          : status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-purple-700">Loading orders...</p>
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow transition-shadow duration-300 border border-purple-100"
              >
                {/* Order Header */}
                <div
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between cursor-pointer"
                  onClick={() => toggleOrderDetails(order.id)}
                >
                  <div className="flex-grow">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h3 className="text-lg font-medium text-purple-800">
                        {order.medicineName}
                      </h3>
                      {getStatusBadge(order.status)}
                    </div>
                    <div className="mt-1 text-sm text-gray-600">
                      <div className="inline-flex items-center mr-4">
                        <User className="h-4 w-4 mr-1" />
                        {order.name}
                      </div>
                      <div className="inline-flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(order.timestamp)}
                      </div>
                    </div>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 text-gray-400 mt-2 sm:mt-0 transition-transform ${
                      expandedOrderId === order.id ? "transform rotate-180" : ""
                    }`}
                  />
                </div>

                {/* Order Details */}
                {expandedOrderId === order.id && (
                  <div className="px-4 pb-4 pt-2 border-t border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div>
                          <div className="text-xs text-gray-500 uppercase">
                            Contact Details
                          </div>
                          <div className="mt-1 flex items-start">
                            <Phone className="h-4 w-4 text-purple-600 mr-2 mt-0.5" />
                            <span>{order.phone}</span>
                          </div>
                        </div>

                        <div>
                          <div className="text-xs text-gray-500 uppercase">
                            Delivery Address
                          </div>
                          <div className="mt-1 flex items-start">
                            <MapPin className="h-4 w-4 text-purple-600 mr-2 mt-0.5" />
                            <span>{order.address}</span>
                          </div>
                        </div>

                        <div>
                          <div className="text-xs text-gray-500 uppercase">
                            Order Time
                          </div>
                          <div className="mt-1 flex items-start">
                            <Clock className="h-4 w-4 text-purple-600 mr-2 mt-0.5" />
                            <span>{formatTime(order.timestamp)}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-gray-500 uppercase mb-2">
                          Update Status
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateOrderStatus(order.id, "pending");
                            }}
                            className={`px-3 py-2 rounded text-xs font-medium ${
                              order.status === "pending"
                                ? "bg-yellow-100 text-yellow-800 border-2 border-yellow-300"
                                : "bg-gray-100 text-gray-800 hover:bg-yellow-50"
                            }`}
                          >
                            Pending
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateOrderStatus(order.id, "approved");
                            }}
                            className={`px-3 py-2 rounded text-xs font-medium ${
                              order.status === "approved"
                                ? "bg-green-100 text-green-800 border-2 border-green-300"
                                : "bg-gray-100 text-gray-800 hover:bg-green-50"
                            }`}
                          >
                            Approve
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateOrderStatus(order.id, "rejected");
                            }}
                            className={`px-3 py-2 rounded text-xs font-medium ${
                              order.status === "rejected"
                                ? "bg-red-100 text-red-800 border-2 border-red-300"
                                : "bg-gray-100 text-gray-800 hover:bg-red-50"
                            }`}
                          >
                            Reject
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateOrderStatus(order.id, "delivered");
                            }}
                            className={`px-3 py-2 rounded text-xs font-medium ${
                              order.status === "delivered"
                                ? "bg-blue-100 text-blue-800 border-2 border-blue-300"
                                : "bg-gray-100 text-gray-800 hover:bg-blue-50"
                            }`}
                          >
                            Delivered
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No orders found
            </h3>
            <p className="text-gray-500">
              {searchQuery || filterStatus !== "all"
                ? "Try adjusting your search filters"
                : "There are no medicine orders yet"}
            </p>
          </div>
        )}
      </div>

      {/* Status Update Success Message */}
      <div
        id="statusUpdateMessage"
        className="hidden fixed top-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md animate-fadeIn"
      >
        Order status updated successfully!
      </div>
    </div>
  );
};

export default MedicineOrdersPage;
