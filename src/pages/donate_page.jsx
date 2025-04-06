import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db, storage } from "../firebase/firebase";
import {
  collection,
  addDoc,
  serverTimestamp
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Loader2 } from "lucide-react";

const genAI = new GoogleGenerativeAI("AIzaSyCybd-Tl_kBgzuOyje_jua-ut7pXfzIMLA");

const DonateMedicine = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    reason: "",
    medicineName: "",
    manufacturer: "",
    expiryDate: "",
    dosage: "",
    quantity: "",
    storage: "",
    packaging: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const verifyWithGemini = async () => {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
    // Convert image file to base64
    const toBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(",")[1]); // Get base64 string only
        reader.onerror = (error) => reject(error);
      });
  
    let imagePart = null;
    if (formData.image) {
      const base64Image = await toBase64(formData.image);
      imagePart = {
        inlineData: {
          mimeType: formData.image.type,
          data: base64Image,
        },
      };
    }
  
    const parts = [
      {
        text: `A user wants to donate the following medicine:\n
  Name: ${formData.medicineName}
  Manufacturer: ${formData.manufacturer}
  Expiry Date: ${formData.expiryDate}
  Dosage: ${formData.dosage}
  Quantity: ${formData.quantity}
  Storage Condition: ${formData.storage}
  Packaging: ${formData.packaging}
  Reason for donation: ${formData.reason}\n
  Please verify if this medicine is SAFE TO DONATE and the image is medicine not any other objects. Respond only with 'Safe' or 'Not Safe' and a short reason.`,
      },
    ];
  
    if (imagePart) {
      parts.push(imagePart);
    }
  
    const result = await model.generateContent({ contents: [{ role: "user", parts }] });
    return result.response.text();
  };
  
 
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    

    const geminiResponse = await verifyWithGemini();
    console.log(geminiResponse);
    
    if (geminiResponse.includes("Not Safe")) {
      setLoading(false);
      setResult("⚠️ AI flagged this medicine as unsafe: " + geminiResponse);
      return;
    }

    try {
      let imageURL = "";
      if (formData.image) {
        const storageRef = ref(storage, `medicines/${formData.image.name}`);
        await uploadBytes(storageRef, formData.image);
        imageURL = await getDownloadURL(storageRef);
      }

      const {
        image, // exclude image
        ...formDataWithoutImage
      } = formData;
      
      await addDoc(collection(db, "medicineDonations"), {
        ...formDataWithoutImage,
        imageURL,
        timestamp: serverTimestamp(),
      });

      setResult("✅ Medicine donation submitted successfully!");
    } catch (error) {
      setResult("❌ Error: " + error.message);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-purple-50 rounded-2xl shadow-lg mt-10">
      <h2 className="text-3xl font-extrabold text-purple-700 mb-6 text-center">Donate Unused Medicine</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {[
          { label: "Your Name", name: "name" },
          { label: "Email", name: "email", type: "email" },
          { label: "Phone", name: "phone" },
          { label: "Address", name: "address" },
          { label: "Reason for Donation", name: "reason" },
          { label: "Medicine Name", name: "medicineName" },
          { label: "Manufacturer", name: "manufacturer" },
          { label: "Expiry Date", name: "expiryDate", type: "date" },
          { label: "Dosage (e.g., 500mg)", name: "dosage" },
          { label: "Quantity", name: "quantity", type: "number" },
          { label: "Storage Condition", name: "storage" },
          { label: "Packaging Status (e.g., Sealed, Opened)", name: "packaging" },
        ].map(({ label, name, type = "text" }) => (
          <div key={name}>
            <label className="block font-semibold text-purple-600 mb-1">{label}</label>
            <input
              required
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              className="w-full p-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        ))}

        <div>
          <label className="block font-semibold text-purple-600 mb-1">Upload Medicine Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="w-full text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2 w-full"
        >
          {loading && <Loader2 className="animate-spin" size={20} />}
          {loading ? "Verifying..." : "Submit Donation"}
        </button>
      </form>

      {result && (
        <div className="mt-6 p-4 rounded-lg bg-purple-100 text-purple-800 text-sm border border-purple-200">
          {result}
        </div>
      )}
    </div>
  );
};

export default DonateMedicine;