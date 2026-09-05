import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { becomeArtist } from "../../services/artistService";

interface FormData {
  experience: string;
  specialization: string;
  bio: string;
  location: string;
  availableLocations: string;
  availableTime: string;
  services: string;
}

function BecomeArtist() {
  const navigate = useNavigate();

  // Boolean
  const [loading, setLoading] = useState<boolean>(false);

  const [form, setForm] = useState<FormData>({
    experience: "",
    specialization: "",
    bio: "",
    location: "",
    availableLocations: "",
    availableTime: "",
    services: "",
  });

  // Function
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    // Required field validation
    if (
      !form.experience ||
      !form.specialization ||
      !form.bio ||
      !form.location ||
      !form.availableTime
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    // Experience validation
    if (Number(form.experience) < 0) {
      toast.error("Experience cannot be negative");
      return;
    }

    try {
      setLoading(true);

      // Convert services string into array
      const services: string[] = form.services
        .split(",")
        .map((service: string) => service.trim())
        .filter((service: string) => service.length > 0);

      // Convert available locations string into array
      const availableLocations: string[] = form.availableLocations
        .split(",")
        .map((location: string) => location.trim())
        .filter((location: string) => location.length > 0);

      const response = await becomeArtist({
        experience: Number(form.experience),
        specialization: form.specialization.trim(),
        bio: form.bio.trim(),
        location: form.location.trim(),
        availableLocations,
        availableTime: form.availableTime,
        services,
      });

      console.log("ARTIST APPLICATION:", response);

      // Application submitted successfully
      if (response.success) {
        toast.success(
          "Application submitted successfully. Waiting for admin approval.",
        );

        // DO NOT change user role here.
        // User becomes artist only after admin approval.

        navigate("/artist/application-status");
      }
    } catch (error: any) {
      console.error(
        "BECOME ARTIST ERROR:",
        error.response?.data || error.message,
      );

      toast.error(
        error.response?.data?.message || "Failed to submit artist application",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">🌿</div>

            <h1 className="text-3xl font-bold text-emerald-700">
              Become a Mehandi Artist
            </h1>

            <p className="mt-2 text-gray-600">
              Share your experience and showcase your mehandi skills.
            </p>

            <p className="text-sm text-gray-500 mt-2">
              Your application will be reviewed by our admin team.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Experience */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Experience (Years) *
              </label>

              <input
                type="number"
                name="experience"
                min="0"
                value={form.experience}
                onChange={handleChange}
                placeholder="Example: 3"
                className="w-full border border-gray-300 rounded-lg px-4 py-3
                focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Specialization */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Specialization *
              </label>

              <input
                type="text"
                name="specialization"
                value={form.specialization}
                onChange={handleChange}
                placeholder="Example: Bridal Mehendi"
                className="w-full border border-gray-300 rounded-lg px-4 py-3
                focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                About You *
              </label>

              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                placeholder="Tell customers about your experience and skills..."
                rows={5}
                className="w-full border border-gray-300 rounded-lg px-4 py-3
                focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Main Location */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Main Location *
              </label>

              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Example: Coimbatore"
                className="w-full border border-gray-300 rounded-lg px-4 py-3
                focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Available Locations */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Available Locations
              </label>

              <input
                type="text"
                name="availableLocations"
                value={form.availableLocations}
                onChange={handleChange}
                placeholder="Coimbatore, Tiruppur, Erode"
                className="w-full border border-gray-300 rounded-lg px-4 py-3
                focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />

              <p className="text-sm text-gray-500 mt-1">
                Separate locations using commas.
              </p>
            </div>

            {/* Available Time */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Available Time *
              </label>

              <input
                type="text"
                name="availableTime"
                value={form.availableTime}
                onChange={handleChange}
                placeholder="Example: 9:00 AM - 7:00 PM"
                className="w-full border border-gray-300 rounded-lg px-4 py-3
                focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Services */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Services
              </label>

              <input
                type="text"
                name="services"
                value={form.services}
                onChange={handleChange}
                placeholder="Bridal, Arabic, Engagement"
                className="w-full border border-gray-300 rounded-lg px-4 py-3
                focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />

              <p className="text-sm text-gray-500 mt-1">
                Separate services using commas.
              </p>
            </div>

            {/* Information Box */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <p className="text-sm text-emerald-800">
                <strong>Note:</strong> After submitting this application, an
                admin will review your details. You will become an approved
                artist only after admin approval.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700
              text-white font-semibold py-3 rounded-lg transition
              disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting Application..." : "Submit Application"}
            </button>

            {/* Cancel */}
            <button
              type="button"
              onClick={() => navigate("/home")}
              disabled={loading}
              className="w-full border border-gray-300 text-gray-700
              font-semibold py-3 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BecomeArtist;
