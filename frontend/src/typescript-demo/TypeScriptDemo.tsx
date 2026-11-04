import { useState } from "react";

import {
  calculatePrice,
  checkAvailability,
  services,
  BookingStatus,
} from "./basics/programming";

import { MehandiArtist } from "./oop/classes";

import { PremiumArtist } from "./oop/inheritance";

import { sampleCustomer, getCustomerDetails } from "./interfaces/userInterface";

import { runModuleDemo } from "./modules/moduleDemo";

// ======================================================
// SAMPLE ARTIST OBJECT
// ======================================================

const artist = new MehandiArtist("Priya", 5, "Bridal Mehandi");

// ======================================================
// PREMIUM ARTIST
// ======================================================

const premiumArtist = new PremiumArtist("Anitha", 8, "Bridal Mehandi");

// ======================================================
// COMPONENT
// ======================================================

function TypeScriptDemo() {
  const [selectedService, setSelectedService] = useState<string>(services[0]);

  const [quantity, setQuantity] = useState<number>(1);

  const price = calculatePrice(1500, quantity);

  const availability = checkAvailability(true);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}

        <div className="bg-emerald-800 text-white rounded-2xl p-8 mb-8">
          <p className="text-emerald-200">Mehandi Management System</p>

          <h1 className="text-4xl font-bold mt-2">TypeScript Demonstration</h1>

          <p className="mt-3">
            TypeScript concepts implemented inside the Mehandi application.
          </p>
        </div>

        {/* BASIC TYPES */}

        <section className="bg-white rounded-2xl shadow p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">1. Basic TypeScript</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="font-semibold">Boolean</p>

              <p>Artist Available: true</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="font-semibold">Enum</p>

              <p>Booking Status: {BookingStatus.PENDING}</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="font-semibold">Function</p>

              <p>Price: ₹{price}</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="font-semibold">Array</p>

              <p>{services.length} services</p>
            </div>
          </div>
        </section>

        {/* FUNCTIONS */}

        <section className="bg-white rounded-2xl shadow p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">
            2. Functions and Programming Structures
          </h2>

          <label className="block font-medium mb-2">Select Service</label>

          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="border rounded-lg p-3 w-full mb-4"
          >
            {services.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>

          <label className="block font-medium mb-2">Number of People</label>

          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="border rounded-lg p-3 w-full"
          />

          <div className="mt-4 p-4 bg-emerald-50 rounded-lg">
            <p>Service: {selectedService}</p>

            <p>Availability: {availability}</p>

            <p className="font-bold mt-2">Total Price: ₹{price}</p>
          </div>
        </section>

        {/* CLASS */}

        <section className="bg-white rounded-2xl shadow p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">3. Classes</h2>

          <p>{artist.getDetails()}</p>

          <p className="mt-2">
            Calculated Price: ₹{artist.calculateServicePrice(1500)}
          </p>
        </section>

        {/* INHERITANCE */}

        <section className="bg-white rounded-2xl shadow p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">4. Inheritance</h2>

          <p>{premiumArtist.getDetails()}</p>

          <p className="mt-2">{premiumArtist.getPremiumDetails()}</p>
        </section>

        {/* INTERFACE */}

        <section className="bg-white rounded-2xl shadow p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">5. Interface</h2>

          <pre className="bg-gray-900 text-white p-4 rounded-xl overflow-auto">
            {getCustomerDetails(sampleCustomer)}
          </pre>
        </section>

        {/* MODULE */}

        <section className="bg-white rounded-2xl shadow p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">6. Modules</h2>

          <div className="space-y-2">
            {runModuleDemo().map((result) => (
              <p key={result} className="bg-gray-50 p-3 rounded-lg">
                {result}
              </p>
            ))}
          </div>
        </section>

        {/* TUPLE */}

        <section className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold mb-4">
            7. TypeScript Topics Covered
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-xl">Boolean</div>

            <div className="bg-blue-50 p-4 rounded-xl">Arrays</div>

            <div className="bg-blue-50 p-4 rounded-xl">Tuples</div>

            <div className="bg-blue-50 p-4 rounded-xl">Enum</div>

            <div className="bg-blue-50 p-4 rounded-xl">Functions</div>

            <div className="bg-blue-50 p-4 rounded-xl">Classes</div>

            <div className="bg-blue-50 p-4 rounded-xl">Inheritance</div>

            <div className="bg-blue-50 p-4 rounded-xl">Interfaces</div>

            <div className="bg-blue-50 p-4 rounded-xl">Modules</div>

            <div className="bg-blue-50 p-4 rounded-xl">Namespaces</div>

            <div className="bg-blue-50 p-4 rounded-xl">Decorators</div>

            <div className="bg-blue-50 p-4 rounded-xl">Debugging</div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default TypeScriptDemo;
