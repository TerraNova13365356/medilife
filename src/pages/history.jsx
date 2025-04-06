import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { h1 } from 'framer-motion/client';

const History = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, `users/${localStorage.getItem("username")}/orders`)); // adjust path if needed
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecords(data);
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-purple-100">
         <h1 className="text-3xl font-bold mb-6 text-center text-purple-800">Donation History</h1>
        {
            records ? <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {records.map((record) => (
              <div key={record.medicineId} className="bg-white p-4 rounded-xl shadow-lg">
                <h2 className="text-xl font-semibold text-purple-700">{record.medicineName}</h2>
                <p className="text-gray-600"><span className="font-semibold">Donor:</span> {record.name}</p>
                <p className="text-gray-600"><span className="font-semibold">Phone:</span> {record.phone}</p>
                <p className="text-gray-600"><span className="font-semibold">Address:</span> {record.address}</p>
                <p className="text-gray-600"><span className="font-semibold">Quantity:</span> {record.quantity}</p>
                <p className="text-gray-500 text-sm mt-2">
                  <span className="font-medium">Time:</span>{" "}
                  {record.timestamp?.toDate?.().toLocaleString() || "N/A"}
                </p>
              </div>
            ))}
          </div>
          :
          <h1>No History found</h1>
        }
     
      
    </div>
  );
};

export default History;
