import React, { useEffect, useState } from "react";

import { getArtists, Artist } from "../../services/adminService";

const Artists: React.FC = () => {
  // ====================================================
  // STATE
  // ====================================================

  const [artists, setArtists] = useState<Artist[]>([]);

  const [loading, setLoading] = useState<boolean>(true);

  const [error, setError] = useState<string>("");

  // ====================================================
  // LOAD ARTISTS
  // ====================================================

  useEffect(() => {
    loadArtists();
  }, []);

  const loadArtists = async () => {
    try {
      setLoading(true);

      setError("");

      const response = await getArtists();

      console.log("ARTISTS RECEIVED IN COMPONENT:", response);

      if (response && response.success) {
        setArtists(response.artists || []);
      } else {
        setArtists([]);

        setError("Failed to load approved artists");
      }
    } catch (error: any) {
      console.error(
        "ARTISTS PAGE ERROR:",
        error.response?.data || error.message || error,
      );

      setError(
        error.response?.data?.message || "Failed to load approved artists",
      );
    } finally {
      setLoading(false);
    }
  };

  // ====================================================
  // LOADING SCREEN
  // ====================================================

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
              fontSize: "32px",
              margin: 0,
              color: "#111827",
            }}
          >
            Approved Artists
          </h1>

          <p
            style={{
              color: "#64748b",
              marginTop: "10px",
            }}
          >
            Loading approved artists...
          </p>
        </div>
      </div>
    );
  }

  // ====================================================
  // ERROR SCREEN
  // ====================================================

  if (error) {
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
          <h1>Approved Artists</h1>

          <div
            style={{
              background: "#fee2e2",
              color: "#b91c1c",
              padding: "16px",
              borderRadius: "10px",
              marginTop: "20px",
              marginBottom: "15px",
            }}
          >
            {error}
          </div>

          <button
            onClick={loadArtists}
            style={{
              border: "none",
              background: "#006b4f",
              color: "#ffffff",
              padding: "11px 20px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ====================================================
  // MAIN PAGE
  // ====================================================

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
        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "35px",
            gap: "20px",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "32px",
                fontWeight: 700,
                color: "#111827",
              }}
            >
              Approved Artists
            </h1>

            <p
              style={{
                marginTop: "8px",
                marginBottom: 0,
                color: "#64748b",
                fontSize: "16px",
              }}
            >
              View all approved mehndi artists.
            </p>
          </div>

          {/* ARTIST COUNT */}

          <div
            style={{
              background: "#006b4f",
              color: "#ffffff",
              borderRadius: "12px",
              padding: "12px 22px",
              minWidth: "120px",
              textAlign: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.10)",
            }}
          >
            <div
              style={{
                fontSize: "25px",
                fontWeight: 700,
              }}
            >
              {artists.length}
            </div>

            <div
              style={{
                fontSize: "12px",
                marginTop: "3px",
              }}
            >
              Approved Artists
            </div>
          </div>
        </div>

        {/* =================================================
            EMPTY STATE
        ================================================= */}

        {artists.length === 0 ? (
          <div
            style={{
              background: "#ffffff",
              padding: "70px 20px",
              textAlign: "center",
              borderRadius: "16px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.07)",
            }}
          >
            <div
              style={{
                fontSize: "50px",
              }}
            >
              🎨
            </div>

            <h2
              style={{
                color: "#111827",
                marginTop: "15px",
              }}
            >
              No Approved Artists
            </h2>

            <p
              style={{
                color: "#64748b",
              }}
            >
              Approved artists will appear here.
            </p>
          </div>
        ) : (
          /* =================================================
             ARTIST GRID
          ================================================= */

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(430px, 1fr))",
              gap: "25px",
            }}
          >
            {artists.map((artist) => (
              <div
                key={artist._id}
                style={{
                  background: "#ffffff",
                  borderRadius: "18px",
                  padding: "25px",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                  transition: "transform 0.2s ease",
                }}
              >
                {/* =================================================
                      ARTIST HEADER
                  ================================================= */}

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    paddingBottom: "20px",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  {/* AVATAR */}

                  <div
                    style={{
                      width: "58px",
                      height: "58px",
                      minWidth: "58px",
                      borderRadius: "50%",
                      background: "#006b4f",
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "23px",
                      fontWeight: 700,
                    }}
                  >
                    {artist.name ? artist.name.charAt(0).toUpperCase() : "A"}
                  </div>

                  {/* NAME */}

                  <div
                    style={{
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    <h2
                      style={{
                        margin: 0,
                        fontSize: "21px",
                        color: "#111827",
                        fontWeight: 700,
                      }}
                    >
                      {artist.name || "Artist"}
                    </h2>

                    <p
                      style={{
                        margin: "4px 0 0",
                        color: "#64748b",
                        fontSize: "14px",
                      }}
                    >
                      {artist.specialization || "Mehndi Artist"}
                    </p>
                  </div>

                  {/* APPROVED */}

                  <span
                    style={{
                      background: "#dcfce7",
                      color: "#16a34a",
                      padding: "7px 12px",
                      borderRadius: "20px",
                      fontSize: "11px",
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                    }}
                  >
                    APPROVED
                  </span>
                </div>

                {/* =================================================
                      USER INFORMATION
                  ================================================= */}

                <div
                  style={{
                    marginTop: "22px",
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "18px",
                  }}
                >
                  {/* EMAIL */}

                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "flex-start",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "18px",
                      }}
                    >
                      📧
                    </span>

                    <div>
                      <small
                        style={{
                          display: "block",
                          color: "#94a3b8",
                          fontSize: "11px",
                          marginBottom: "3px",
                        }}
                      >
                        Email
                      </small>

                      <p
                        style={{
                          margin: 0,
                          color: "#1e293b",
                          fontSize: "14px",
                          wordBreak: "break-word",
                        }}
                      >
                        {artist.email || "Not provided"}
                      </p>
                    </div>
                  </div>

                  {/* PHONE */}

                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "flex-start",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "18px",
                      }}
                    >
                      📞
                    </span>

                    <div>
                      <small
                        style={{
                          display: "block",
                          color: "#94a3b8",
                          fontSize: "11px",
                          marginBottom: "3px",
                        }}
                      >
                        Phone
                      </small>

                      <p
                        style={{
                          margin: 0,
                          color: "#1e293b",
                          fontSize: "14px",
                        }}
                      >
                        {artist.phone || "Not provided"}
                      </p>
                    </div>
                  </div>

                  {/* ARTIST LOCATION */}

                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "flex-start",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "18px",
                      }}
                    >
                      📍
                    </span>

                    <div>
                      <small
                        style={{
                          display: "block",
                          color: "#94a3b8",
                          fontSize: "11px",
                          marginBottom: "3px",
                        }}
                      >
                        Artist Location
                      </small>

                      <p
                        style={{
                          margin: 0,
                          color: "#1e293b",
                          fontSize: "14px",
                        }}
                      >
                        {artist.location || "Not provided"}
                      </p>
                    </div>
                  </div>

                  {/* CITY */}

                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "flex-start",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "18px",
                      }}
                    >
                      🏙️
                    </span>

                    <div>
                      <small
                        style={{
                          display: "block",
                          color: "#94a3b8",
                          fontSize: "11px",
                          marginBottom: "3px",
                        }}
                      >
                        City
                      </small>

                      <p
                        style={{
                          margin: 0,
                          color: "#1e293b",
                          fontSize: "14px",
                        }}
                      >
                        {artist.city || "Not provided"}
                      </p>
                    </div>
                  </div>

                  {/* ADDRESS */}

                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "flex-start",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "18px",
                      }}
                    >
                      🏠
                    </span>

                    <div>
                      <small
                        style={{
                          display: "block",
                          color: "#94a3b8",
                          fontSize: "11px",
                          marginBottom: "3px",
                        }}
                      >
                        Address
                      </small>

                      <p
                        style={{
                          margin: 0,
                          color: "#1e293b",
                          fontSize: "14px",
                          wordBreak: "break-word",
                        }}
                      >
                        {artist.address || "Not provided"}
                      </p>
                    </div>
                  </div>

                  {/* EXPERIENCE */}

                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "flex-start",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "18px",
                      }}
                    >
                      ⭐
                    </span>

                    <div>
                      <small
                        style={{
                          display: "block",
                          color: "#94a3b8",
                          fontSize: "11px",
                          marginBottom: "3px",
                        }}
                      >
                        Experience
                      </small>

                      <p
                        style={{
                          margin: 0,
                          color: "#1e293b",
                          fontSize: "14px",
                        }}
                      >
                        {artist.experience ?? 0} years
                      </p>
                    </div>
                  </div>
                </div>

                {/* =================================================
                      SERVICES
                  ================================================= */}

                <div
                  style={{
                    marginTop: "26px",
                  }}
                >
                  <h3
                    style={{
                      margin: "0 0 12px",
                      fontSize: "16px",
                      color: "#111827",
                    }}
                  >
                    Services
                  </h3>

                  {artist.services && artist.services.length > 0 ? (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "8px",
                      }}
                    >
                      {artist.services.map((service, index) => (
                        <span
                          key={index}
                          style={{
                            background: "#fff1f2",
                            color: "#be123c",
                            borderRadius: "20px",
                            padding: "7px 12px",
                            fontSize: "12px",
                            fontWeight: 500,
                          }}
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p
                      style={{
                        color: "#94a3b8",
                        fontSize: "13px",
                        margin: 0,
                      }}
                    >
                      No services provided
                    </p>
                  )}
                </div>

                {/* =================================================
                      BIO
                  ================================================= */}

                <div
                  style={{
                    marginTop: "25px",
                    padding: "18px",
                    background: "#f8fafc",
                    borderRadius: "12px",
                  }}
                >
                  <h3
                    style={{
                      margin: "0 0 10px",
                      fontSize: "16px",
                      color: "#111827",
                    }}
                  >
                    Bio
                  </h3>

                  <p
                    style={{
                      margin: 0,
                      color: "#475569",
                      lineHeight: 1.6,
                      fontSize: "14px",
                    }}
                  >
                    {artist.bio || "No bio provided."}
                  </p>
                </div>

                {/* =================================================
                      FOOTER
                  ================================================= */}

                <div
                  style={{
                    marginTop: "20px",
                    paddingTop: "15px",
                    borderTop: "1px solid #e5e7eb",
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "10px",
                    color: "#64748b",
                    fontSize: "12px",
                  }}
                >
                  <span>
                    Role:{" "}
                    <strong
                      style={{
                        color: "#111827",
                      }}
                    >
                      {artist.role || "artist"}
                    </strong>
                  </span>

                  <span>
                    Status:{" "}
                    <strong
                      style={{
                        color: "#16a34a",
                      }}
                    >
                      {artist.status || "approved"}
                    </strong>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Artists;
