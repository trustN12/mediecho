// "use client";

// import { PricingTable } from "@clerk/nextjs";
// import React, { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Loader2 } from "lucide-react";

// const Subscription = () => {
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const timer = setTimeout(() => setLoading(false), 600);
//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <motion.div
//       className="px-10 md:px-24 lg:px-48"
//       initial={{ opacity: 0, y: 50 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.8, ease: "easeOut" }}
//     >
//       <motion.h2
//         className="font-bold text-3xl mb-10 text-center"
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.2, duration: 0.6 }}
//       >
//         Buy Subscription
//       </motion.h2>

//       <AnimatePresence mode="wait">
//         {loading ? (
//           <motion.div
//             key="loading"
//             initial={{ opacity: 0, scale: 0.8 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.5 }}
//             className="flex items-center justify-center h-40"
//           >
//             <motion.div
//               className="h-10 w-10 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"
//               aria-label="Loading..."
//             />
//           </motion.div>
//         ) : (
//           <motion.div
//             key="pricing"
//             initial={{ opacity: 0, scale: 0.95, y: 20 }}
//             animate={{ opacity: 1, scale: 1, y: 0 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.6, ease: "easeOut" }}
//           >
//             <PricingTable />
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </motion.div>
//   );
// };

// export default Subscription;

// "use client";

// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { PricingTable, useUser } from "@clerk/nextjs";
// import axios from "axios";

// declare global {
//   interface Window {
//     Razorpay: any;
//   }
// }

// const Subscription = () => {
//   const { user } = useUser();
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const script = document.createElement("script");
//     script.src = "https://checkout.razorpay.com/v1/checkout.js";
//     script.async = true;
//     document.body.appendChild(script);
//     return () => {
//       document.body.removeChild(script);
//     };
//   }, []);

//   const handleSubscription = async () => {
//     setLoading(true);

//     try {
//       const res = await fetch("/api/create-order", { method: "POST" });
//       const data = await res.json();

//       const options = {
//         key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
//         amount: data.amount,
//         currency: "INR",
//         name: "Mediecho AI",
//         description: "Pro Subscription",
//         image: "/logo.png",
//         order_id: data.id,
//         handler: async function (response: any) {
//           await fetch("/api/verify-payment", {
//             method: "POST",
//             body: JSON.stringify(response),
//           });

//           await axios.patch("/api/users", { upgradeToPro: true });

//           alert("🎉 Subscribed to Pro!");
//         },
//         prefill: {
//           name: user?.fullName || "",
//           email: user?.primaryEmailAddress?.emailAddress || "",
//         },
//         theme: { color: "#10b981" },
//       };

//       const razor = new window.Razorpay(options);
//       razor.open();
//     } catch (err) {
//       alert("Something went wrong. Please try again.");
//     }

//     setLoading(false);
//   };

//   return (
//     <motion.div
//     className="px-4 md:px-24 lg:px-48 py-16 min-h-screen bg-gray-50"
//     initial={{ opacity: 0, y: 50 }}
//     animate={{ opacity: 1, y: 0 }}
//     transition={{ duration: 0.8 }}
//   >
//     <h2 className="text-center font-bold text-3xl mb-12">Choose Your Plan</h2>

//     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//       {/* Free Plan */}
//       <div className="bg-white rounded-xl shadow-md p-8">
//         <h3 className="text-xl font-semibold mb-2">Free Plan</h3>
//         <p className="text-gray-600 mb-4">Basic access to Mediecho AI</p>

//         <div className="mb-6">
//           <span className="text-2xl font-bold">₹0</span>

//         </div>

//         <ul className="text-sm text-gray-700 list-disc list-inside space-y-1 mb-6">
//           <li>Total 5 free medical consultations & reports/user</li>
//           <li>2 AI medical agent</li>
//           <li>Limited access to features</li>
//           <li>No priority support</li>
//           <li>No email support</li>
//         </ul>
//       </div>

//       {/* Pro Plan */}
//       <div className="bg-white rounded-xl shadow-md p-8 border-2 border-emerald-500">
//         <h3 className="text-xl font-semibold mb-2 text-emerald-600">Pro Plan</h3>
//         <p className="text-gray-600 mb-4">
//           Unlock full power of Mediecho AI with unlimited access.
//         </p>

//         <div className="mb-6">
//           <span className="text-2xl font-bold">₹499</span>
//           <span className="text-sm text-gray-500">/month</span>
//         </div>

//         <ul className="text-sm text-gray-700 list-disc list-inside space-y-1 mb-6">
//           <li>30 AI medical consultations & reports/month</li>
//           <li>All AI medical agents will be unlocked</li>
//           <li>Priority support</li>
//           <li>Email support</li>
//           <li>Early access to new features</li>
//           <li>Cancel anytime <span className="text-gray-500 text-[12px]">(*terms & conditions)</span></li>
//         </ul>

//         <button
//           onClick={handleSubscription}
//           disabled={loading}
//           className="w-full bg-emerald-500 text-white font-medium px-6 py-2 rounded-lg hover:bg-emerald-600 transition disabled:opacity-50"
//         >
//           {loading ? "Processing..." : "Subscribe to Pro"}
//         </button>
//       </div>
//       <PricingTable />
//     </div>
//   </motion.div>
//   );
// };

// export default Subscription;

"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { toast } from "sonner";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Subscription = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">(
    "monthly"
  );
  const [userPlan, setUserPlan] = useState<"pro" | "free" | null>(null);
  const [isPro, setIsPro] = useState<boolean | null>(null); // Optional: you can fetch from API

  const price = billingCycle === "monthly" ? 59900 : 49900 * 12;

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    // ✅ Proper cleanup function
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await axios.get("/api/users");
        const isPro = res.data?.isPro;
        setIsPro(isPro);
        setUserPlan(isPro ? "pro" : "free");
      } catch {
        setUserPlan("free");
        setIsPro(false);
      }
    };
    fetchPlan();
  }, []);

  const handleSubscription = async () => {
    if (isPro) {
      toast.info("You already have an active Pro subscription.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/create-order", {
        method: "POST",
        body: JSON.stringify({ amount: price }),
      });
      const data = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: data.amount,
        currency: "INR",
        name: "Mediecho AI",
        description: `Pro Subscription - ${billingCycle}`,
        image: "/logo.png",
        order_id: data.id,
        // handler: async function (response: any) {
        //   await fetch("/api/verify-payment", {
        //     method: "POST",
        //     body: JSON.stringify(response),
        //   });
        //   await axios.patch("/api/users", { upgradeToPro: true });
        //   setUserPlan("pro");
        //   alert("🎉 Subscribed to Pro!");
        // },
        handler: async function (response: any) {
          await fetch("/api/verify-payment", {
            method: "POST",
            body: JSON.stringify(response),
          });

          await axios.patch("/api/users", {
            upgradeToPro: true,
            subscriptionType: billingCycle, // pass it here
          });

          setUserPlan("pro");
          toast.success("🎉 Subscribed to Pro!");
        },
        prefill: {
          name: user?.fullName || "",
          email: user?.primaryEmailAddress?.emailAddress || "",
        },
        theme: { color: "#10b981" },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (err) {
      alert("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <motion.div
      className="px-4 sm:px-8 md:px-16 lg:px-32 py-14 min-h-screen bg-gray-50 rounded-xl"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-center font-bold text-3xl sm:text-4xl mb-12 text-gray-800">
        Choose Your Plan
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Free Plan */}
        <div className="bg-white rounded-2xl shadow-lg p-8 relative hover:shadow-xl transition">
          <h3 className="text-xl font-semibold mb-2 text-gray-800">
            Free Plan
          </h3>
          <p className="text-gray-600 mb-4">Basic access to Mediecho AI</p>

          {userPlan === "free" && (
            <span className="absolute top-4 right-4 text-xs bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full">
              Active
            </span>
          )}

          <div className="mb-6">
            <span className="text-2xl font-bold">₹0</span>
          </div>

          <ul className="text-sm text-gray-700 list-disc list-inside space-y-2 mb-6">
            <li>Total 5 medical consultations & reports</li>
            <li>2 AI medical agents</li>
            <li>Limited features</li>
            <li>No priority support</li>
          </ul>
        </div>

        {/* Pro Plan */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-emerald-500 p-8 relative hover:shadow-xl transition">
          {isPro && (
            <span className="absolute top-4 right-4 text-xs bg-green-100 text-green-600 font-semibold px-3 py-1 rounded-full">
              Active
            </span>
          )}

          <h3 className="text-xl font-semibold mb-2 text-emerald-600">
            Pro Plan
          </h3>
          <p className="text-gray-600 mb-4">
            Unlock full power of Mediecho AI with unlimited access.
          </p>

          {/* Price & Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <div>
              {billingCycle === "monthly" ? (
                <>
                  <span className="text-2xl font-bold">₹599</span>
                  <span className="text-sm text-gray-500"> /month</span>
                </>
              ) : (
                <>
                  <span className="text-2xl font-bold">₹499</span>
                  <span className="text-sm text-gray-500">
                    {" "}
                    /month (billed yearly)
                  </span>
                </>
              )}
            </div>

            {/* Toggle */}
            <div className="flex items-center gap-2">
              <span
                className={`text-sm font-medium ${
                  billingCycle === "monthly"
                    ? "text-emerald-600"
                    : "text-gray-400"
                }`}
              >
                Monthly
              </span>

              <button
                className={`cursor-pointer w-12 h-6 flex items-center rounded-full transition-colors duration-300 ${
                  billingCycle === "annually" ? "bg-emerald-500" : "bg-gray-300"
                }`}
                onClick={() =>
                  setBillingCycle(
                    billingCycle === "monthly" ? "annually" : "monthly"
                  )
                }
              >
                <span
                  className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                    billingCycle === "annually"
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>

              <span
                className={`text-sm font-medium ${
                  billingCycle === "annually"
                    ? "text-emerald-600"
                    : "text-gray-400"
                }`}
              >
                Annually
              </span>
            </div>
          </div>

          <ul className="text-sm text-gray-700 list-disc list-inside space-y-2 mb-6">
            <li>30 AI medical consultations & reports/month</li>
            <li>All AI medical agents unlocked</li>
            <li>Priority & email support</li>
            <li>Early access to features</li>
            <li>
              Cancel anytime{" "}
              <span className="text-xs text-gray-500">(*terms)</span>
            </li>
          </ul>

          <button
            onClick={handleSubscription}
            disabled={loading}
            className="w-full cursor-pointer bg-emerald-500 text-white font-medium px-6 py-3 rounded-lg hover:bg-emerald-600 transition disabled:opacity-50"
          >
            {loading
              ? "Processing..."
              : billingCycle === "monthly"
              ? "Subscribe ₹599/mo"
              : "Subscribe ₹499/mo (yearly)"}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Subscription;
