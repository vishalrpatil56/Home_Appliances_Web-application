import { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";

const ServiceProviderList = () => {

  const [serviceProviders, setServiceProviders] =
    useState([]);

  useEffect(() => {

    axios
      .get(
        "http://54.84.125.102:5000/serviceproviderslist"
      )
      .then((response) =>
        setServiceProviders(response.data)
      )
      .catch((error) =>
        console.error(
          "Error fetching service providers:",
          error
        )
      );

  }, []);

  const deleteServiceProvider = async (
    serviceProviderId
  ) => {

    if (
      window.confirm(
        "Are you sure you want to delete this Service Provider?"
      )
    ) {
      try {

        await axios.delete(
          `http://54.84.125.102:5000/serviceprovider/${serviceProviderId}`
        );

        setServiceProviders((prev) =>
          prev.filter(
            (provider) =>
              provider.serviceprovider_id !==
              serviceProviderId
          )
        );

      } catch (error) {

        console.error(
          "Error deleting service provider:",
          error
        );

      }
    }
  };

  return (
    <>
      <Header />

      <div
        style={{
          minHeight: "100vh",
          background: "#f4f7fc",
          paddingTop: "120px",
          paddingRight: "40px",
          paddingBottom: "40px",
          paddingLeft: "340px",
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.97)",
            borderRadius: "22px",
            padding: "35px",
            boxShadow:
              "0 8px 25px rgba(0,0,0,0.12)",
          }}
        >
          <h1
            style={{
              fontSize: "52px",
              fontWeight: "700",
              color: "#111827",
              marginBottom: "35px",
            }}
          >
            Service Provider List
          </h1>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              borderRadius: "18px",
              overflow: "hidden",
              tableLayout: "auto",
            }}
          >
            <thead>
              <tr
                style={{
                  background:
                    "linear-gradient(135deg,#007bff,#0056d2)",
                  color: "white",
                }}
              >
                <th
                  style={{
                    ...thStyle,
                    width: "8%",
                  }}
                >
                  ID
                </th>

                <th
                  style={{
                    ...thStyle,
                    width: "20%",
                  }}
                >
                  NAME
                </th>

                <th
                  style={{
                    ...thStyle,
                    width: "18%",
                  }}
                >
                  PHONE
                </th>

                <th
                  style={{
                    ...thStyle,
                    width: "28%",
                  }}
                >
                  EMAIL
                </th>

                <th
                  style={{
                    ...thStyle,
                    width: "16%",
                  }}
                >
                  PASSWORD
                </th>

                <th
                  style={{
                    ...thStyle,
                    width: "10%",
                  }}
                >
                  ACTIONS
                </th>
              </tr>
            </thead>

            <tbody>
              {serviceProviders.map((provider) => (
                <tr
                  key={
                    provider.serviceprovider_id
                  }
                  style={{
                    borderBottom:
                      "1px solid #e5e5e5",
                  }}
                >
                  <td style={tdStyle}>
                    {
                      provider.serviceprovider_id
                    }
                  </td>

                  <td style={tdStyle}>
                    {provider.name}
                  </td>

                  <td style={tdStyle}>
                    {provider.mobile}
                  </td>

                  <td style={tdStyle}>
                    {provider.email}
                  </td>

                  <td style={tdStyle}>
                    {provider.password}
                  </td>

                  <td style={tdStyle}>
                    <button
                      onClick={() =>
                        deleteServiceProvider(
                          provider.serviceprovider_id
                        )
                      }
                      style={deleteButtonStyle}
                      onMouseOver={(e) => {
                        e.target.style.transform =
                          "translateY(-2px)";

                        e.target.style.boxShadow =
                          "0 6px 18px rgba(220,53,69,0.5)";
                      }}
                      onMouseOut={(e) => {
                        e.target.style.transform =
                          "translateY(0px)";

                        e.target.style.boxShadow =
                          "0 4px 12px rgba(220,53,69,0.3)";
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

const thStyle = {
  padding: "20px",
  textAlign: "left",
  fontSize: "18px",
  fontWeight: "700",
};

const tdStyle = {
  padding: "22px 20px",
  fontSize: "16px",
  fontWeight: "500",
  color: "#111827",
  whiteSpace: "normal",
  wordBreak: "break-word",
};

const deleteButtonStyle = {
  background:
    "linear-gradient(135deg,#dc3545,#b02a37)",
  color: "white",
  border: "none",
  padding: "12px 22px",
  borderRadius: "12px",
  fontWeight: "600",
  fontSize: "15px",
  cursor: "pointer",
  boxShadow:
    "0 4px 12px rgba(220,53,69,0.3)",
  transition: "0.3s ease",
};

export default ServiceProviderList;