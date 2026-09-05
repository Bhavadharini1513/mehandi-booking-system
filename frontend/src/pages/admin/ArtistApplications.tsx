import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  ArtistApplication,
  getArtistApplications,
  approveArtist,
  rejectArtist,
} from "../../services/adminService";

function ArtistApplications() {
  const [applications, setApplications] = useState<ArtistApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // ======================================================
  // LOAD APPLICATIONS
  // ======================================================

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);

      const response = await getArtistApplications();

      console.log("ARTIST APPLICATIONS:", response);

      if (response.success) {
        setApplications(response.applications || []);
      } else {
        setApplications([]);
        toast.error("Unable to load applications");
      }
    } catch (error: any) {
      console.error(
        "GET ARTIST APPLICATIONS ERROR:",
        error.response?.data || error.message || error,
      );

      toast.error(
        error.response?.data?.message || "Unable to load applications",
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // APPROVE ARTIST
  // ======================================================

  const handleApprove = async (id: string) => {
    const application = applications.find((item) => item._id === id);

    const artistName = application?.user?.name || "this artist";

    const confirmApprove = window.confirm(
      `Are you sure you want to approve ${artistName} as an artist?`,
    );

    if (!confirmApprove) {
      return;
    }

    try {
      setProcessingId(id);

      console.log("APPROVING ARTIST:", id);

      const response = await approveArtist(id);

      console.log("APPROVE ARTIST RESPONSE:", response);

      toast.success(
        response?.message || "Artist application approved successfully",
      );

      // Remove from pending list
      setApplications((previous) =>
        previous.filter((application) => application._id !== id),
      );
    } catch (error: any) {
      console.error(
        "APPROVE ARTIST ERROR:",
        error.response?.data || error.message || error,
      );

      toast.error(
        error.response?.data?.message || "Unable to approve artist application",
      );
    } finally {
      setProcessingId(null);
    }
  };

  // ======================================================
  // REJECT ARTIST
  // ======================================================

  const handleReject = async (id: string) => {
    const application = applications.find((item) => item._id === id);

    const artistName = application?.user?.name || "this artist";

    const confirmReject = window.confirm(
      `Are you sure you want to reject ${artistName}'s application?`,
    );

    if (!confirmReject) {
      return;
    }

    try {
      setProcessingId(id);

      console.log("REJECTING ARTIST:", id);

      const response = await rejectArtist(id);

      console.log("REJECT ARTIST RESPONSE:", response);

      toast.success(
        response?.message || "Artist application rejected successfully",
      );

      setApplications((previous) =>
        previous.filter((application) => application._id !== id),
      );
    } catch (error: any) {
      console.error(
        "REJECT ARTIST ERROR:",
        error.response?.data || error.message || error,
      );

      toast.error(
        error.response?.data?.message || "Unable to reject application",
      );
    } finally {
      setProcessingId(null);
    }
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div
        style={{
          minHeight: "calc(100vh - 70px)",
          background: "#f4f6f8",
          padding: "40px",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
          }}
        >
          <h1
            style={{
              margin: 0,
              color: "#111827",
              fontSize: "32px",
              fontWeight: 700,
            }}
          >
            Artist Applications
          </h1>

          <div
            style={{
              marginTop: "30px",
              background: "#ffffff",
              borderRadius: "16px",
              padding: "60px",
              textAlign: "center",
              boxShadow: "0 4px 15px rgba(0,0,0,0.07)",
            }}
          >
            <div
              style={{
                fontSize: "40px",
                marginBottom: "15px",
              }}
            >
              ⏳
            </div>

            <p
              style={{
                margin: 0,
                color: "#64748b",
                fontSize: "16px",
              }}
            >
              Loading artist applications...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ======================================================
  // PAGE
  // ======================================================

  return (
    <div
      style={{
        minHeight: "calc(100vh - 70px)",
        background: "#f4f6f8",
        padding: "40px",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        {/* ==================================================
            HEADER
        ================================================== */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
            marginBottom: "35px",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                color: "#111827",
                fontSize: "32px",
                fontWeight: 700,
              }}
            >
              Artist Applications
            </h1>

            <p
              style={{
                marginTop: "8px",
                marginBottom: 0,
                color: "#64748b",
                fontSize: "15px",
              }}
            >
              Review artist applications and approve or reject them.
            </p>
          </div>

          {/* APPLICATION COUNT */}

          <div
            style={{
              background: "#006b4f",
              color: "#ffffff",
              borderRadius: "12px",
              padding: "12px 22px",
              minWidth: "125px",
              textAlign: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.10)",
            }}
          >
            <div
              style={{
                fontSize: "26px",
                fontWeight: 700,
              }}
            >
              {applications.length}
            </div>

            <div
              style={{
                fontSize: "12px",
                marginTop: "3px",
              }}
            >
              Pending
            </div>
          </div>
        </div>

        {/* ==================================================
            EMPTY
        ================================================== */}

        {applications.length === 0 ? (
          <div
            style={{
              background: "#ffffff",
              borderRadius: "18px",
              padding: "75px 25px",
              textAlign: "center",
              boxShadow: "0 4px 15px rgba(0,0,0,0.07)",
            }}
          >
            <div
              style={{
                fontSize: "55px",
                marginBottom: "15px",
              }}
            >
              📋
            </div>

            <h2
              style={{
                margin: 0,
                color: "#374151",
                fontSize: "22px",
              }}
            >
              No Pending Applications
            </h2>

            <p
              style={{
                color: "#64748b",
                marginTop: "10px",
              }}
            >
              There are currently no artist applications waiting for approval.
            </p>
          </div>
        ) : (
          /* ==================================================
             APPLICATION LIST
          ================================================== */

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "25px",
            }}
          >
            {applications.map((application) => {
              const isProcessing = processingId === application._id;

              return (
                <div
                  key={application._id}
                  style={{
                    background: "#ffffff",
                    borderRadius: "18px",
                    overflow: "hidden",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                  }}
                >
                  {/* ==================================================
                      APPLICATION HEADER
                  ================================================== */}

                  <div
                    style={{
                      background: "linear-gradient(135deg, #ecfdf5, #f0fdf4)",
                      padding: "25px",
                      borderBottom: "1px solid #d1fae5",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "20px",
                        flexWrap: "wrap",
                      }}
                    >
                      {/* ARTIST INFO */}

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "15px",
                        }}
                      >
                        {/* AVATAR */}

                        <div
                          style={{
                            width: "60px",
                            height: "60px",
                            minWidth: "60px",
                            borderRadius: "50%",
                            background: "#006b4f",
                            color: "#ffffff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "25px",
                            fontWeight: 700,
                          }}
                        >
                          {application.user?.name
                            ? application.user.name.charAt(0).toUpperCase()
                            : "A"}
                        </div>

                        <div>
                          <h2
                            style={{
                              margin: 0,
                              color: "#111827",
                              fontSize: "22px",
                              fontWeight: 700,
                            }}
                          >
                            {application.user?.name || "Artist"}
                          </h2>

                          <p
                            style={{
                              margin: "5px 0 0",
                              color: "#047857",
                              fontSize: "14px",
                              fontWeight: 600,
                            }}
                          >
                            {application.specialization || "Mehndi Artist"}
                          </p>
                        </div>
                      </div>

                      {/* STATUS */}

                      <span
                        style={{
                          background: "#fef3c7",
                          color: "#b45309",
                          padding: "8px 16px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: 700,
                        }}
                      >
                        PENDING
                      </span>
                    </div>
                  </div>

                  {/* ==================================================
                      DETAILS
                  ================================================== */}

                  <div
                    style={{
                      padding: "28px",
                    }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(220px, 1fr))",
                        gap: "22px",
                      }}
                    >
                      {/* EMAIL */}

                      <Detail
                        icon="📧"
                        title="Email"
                        value={application.user?.email || "Not provided"}
                      />

                      {/* PHONE */}

                      <Detail
                        icon="📞"
                        title="Phone"
                        value={application.user?.phone || "Not provided"}
                      />

                      {/* ADDRESS */}

                      <Detail
                        icon="🏠"
                        title="Address"
                        value={application.user?.address || "Not provided"}
                      />

                      {/* CITY */}

                      <Detail
                        icon="🏙️"
                        title="City"
                        value={application.user?.city || "Not provided"}
                      />

                      {/* LOCATION */}

                      <Detail
                        icon="📍"
                        title="Artist Location"
                        value={application.location || "Not provided"}
                      />

                      {/* EXPERIENCE */}

                      <Detail
                        icon="⭐"
                        title="Experience"
                        value={`${application.experience ?? 0} years`}
                      />

                      {/* AVAILABLE TIME */}

                      <Detail
                        icon="🕐"
                        title="Available Time"
                        value={application.availableTime || "Not provided"}
                      />

                      {/* SPECIALIZATION */}

                      <Detail
                        icon="🎨"
                        title="Specialization"
                        value={application.specialization || "Not provided"}
                      />
                    </div>

                    {/* ==================================================
                        SERVICES
                    ================================================== */}

                    <div
                      style={{
                        marginTop: "30px",
                      }}
                    >
                      <h3
                        style={{
                          margin: 0,
                          color: "#111827",
                          fontSize: "17px",
                          fontWeight: 700,
                        }}
                      >
                        Services
                      </h3>

                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "9px",
                          marginTop: "12px",
                        }}
                      >
                        {application.services &&
                        application.services.length > 0 ? (
                          application.services.map((service, index) => (
                            <span
                              key={index}
                              style={{
                                background: "#fff1f2",
                                color: "#be123c",
                                padding: "7px 13px",
                                borderRadius: "20px",
                                fontSize: "12px",
                                fontWeight: 600,
                              }}
                            >
                              {service}
                            </span>
                          ))
                        ) : (
                          <span
                            style={{
                              color: "#94a3b8",
                              fontSize: "13px",
                            }}
                          >
                            No services specified
                          </span>
                        )}
                      </div>
                    </div>

                    {/* ==================================================
                        AVAILABLE LOCATIONS
                    ================================================== */}

                    <div
                      style={{
                        marginTop: "25px",
                      }}
                    >
                      <h3
                        style={{
                          margin: 0,
                          color: "#111827",
                          fontSize: "17px",
                          fontWeight: 700,
                        }}
                      >
                        Available Locations
                      </h3>

                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "9px",
                          marginTop: "12px",
                        }}
                      >
                        {application.availableLocations &&
                        application.availableLocations.length > 0 ? (
                          application.availableLocations.map(
                            (location, index) => (
                              <span
                                key={index}
                                style={{
                                  background: "#eff6ff",
                                  color: "#2563eb",
                                  padding: "7px 13px",
                                  borderRadius: "20px",
                                  fontSize: "12px",
                                  fontWeight: 600,
                                }}
                              >
                                {location}
                              </span>
                            ),
                          )
                        ) : (
                          <span
                            style={{
                              color: "#94a3b8",
                              fontSize: "13px",
                            }}
                          >
                            No locations specified
                          </span>
                        )}
                      </div>
                    </div>

                    {/* ==================================================
                        BIO
                    ================================================== */}

                    <div
                      style={{
                        marginTop: "25px",
                        padding: "20px",
                        background: "#f8fafc",
                        borderRadius: "12px",
                        border: "1px solid #e5e7eb",
                      }}
                    >
                      <h3
                        style={{
                          margin: 0,
                          color: "#111827",
                          fontSize: "17px",
                          fontWeight: 700,
                        }}
                      >
                        About Artist
                      </h3>

                      <p
                        style={{
                          margin: "10px 0 0",
                          color: "#475569",
                          fontSize: "14px",
                          lineHeight: 1.7,
                        }}
                      >
                        {application.bio || "No bio provided."}
                      </p>
                    </div>

                    {/* ==================================================
                        USER ROLE
                    ================================================== */}

                    <div
                      style={{
                        marginTop: "20px",
                        padding: "12px 15px",
                        background: "#f8fafc",
                        borderRadius: "10px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <span
                        style={{
                          color: "#64748b",
                          fontSize: "13px",
                        }}
                      >
                        Current User Role
                      </span>

                      <span
                        style={{
                          background: "#e0f2fe",
                          color: "#0369a1",
                          padding: "5px 11px",
                          borderRadius: "15px",
                          fontSize: "11px",
                          fontWeight: 700,
                        }}
                      >
                        {application.user?.role || "customer"}
                      </span>
                    </div>

                    {/* ==================================================
                        ACTION BUTTONS
                    ================================================== */}

                    <div
                      style={{
                        display: "flex",
                        gap: "15px",
                        marginTop: "28px",
                        flexWrap: "wrap",
                      }}
                    >
                      {/* APPROVE */}

                      <button
                        disabled={isProcessing}
                        onClick={() => handleApprove(application._id)}
                        style={{
                          flex: 1,
                          minWidth: "220px",
                          border: "none",
                          borderRadius: "11px",
                          padding: "14px 20px",
                          background: isProcessing ? "#9ca3af" : "#059669",
                          color: "#ffffff",
                          fontSize: "14px",
                          fontWeight: 700,
                          cursor: isProcessing ? "not-allowed" : "pointer",
                          transition: "all 0.2s ease",
                        }}
                      >
                        {isProcessing ? "Processing..." : "✓ Approve Artist"}
                      </button>

                      {/* REJECT */}

                      <button
                        disabled={isProcessing}
                        onClick={() => handleReject(application._id)}
                        style={{
                          flex: 1,
                          minWidth: "220px",
                          border: "none",
                          borderRadius: "11px",
                          padding: "14px 20px",
                          background: isProcessing ? "#9ca3af" : "#dc2626",
                          color: "#ffffff",
                          fontSize: "14px",
                          fontWeight: 700,
                          cursor: isProcessing ? "not-allowed" : "pointer",
                          transition: "all 0.2s ease",
                        }}
                      >
                        {isProcessing
                          ? "Processing..."
                          : "✕ Reject Application"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ======================================================
// DETAIL COMPONENT
// ======================================================

interface DetailProps {
  icon: string;
  title: string;
  value: string;
}

function Detail({ icon, title, value }: DetailProps) {
  return (
    <div
      style={{
        display: "flex",
        gap: "11px",
        alignItems: "flex-start",
        minWidth: 0,
      }}
    >
      <div
        style={{
          width: "38px",
          height: "38px",
          minWidth: "38px",
          borderRadius: "10px",
          background: "#f0fdf4",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "17px",
        }}
      >
        {icon}
      </div>

      <div
        style={{
          minWidth: 0,
        }}
      >
        <div
          style={{
            color: "#94a3b8",
            fontSize: "11px",
            fontWeight: 600,
            marginBottom: "4px",
          }}
        >
          {title}
        </div>

        <div
          style={{
            color: "#1e293b",
            fontSize: "14px",
            fontWeight: 500,
            wordBreak: "break-word",
          }}
        >
          {value}
        </div>
      </div>
    </div>
  );
}

export default ArtistApplications;
