// import { useState, useEffect } from "react";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";

// // 🔧 Fix marker icon issue (IMPORTANT)
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
//   iconUrl:
//     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
//   shadowUrl:
//     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
// });

// function App() {
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     image: null,
//   });

//   const [complaints, setComplaints] = useState([]);

//   // 🔥 Fetch complaints
//   useEffect(() => {
//     fetchComplaints();
//   }, []);

//   const fetchComplaints = async () => {
//     try {
//       const res = await fetch("http://localhost:5000/api/complaints");
//       const data = await res.json();
//       setComplaints(data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // 🧾 Handle form input
//   const handleChange = (e) => {
//     if (e.target.name === "image") {
//       setFormData({ ...formData, image: e.target.files[0] });
//     } else {
//       setFormData({ ...formData, [e.target.name]: e.target.value });
//     }
//   };

//   // 🚀 Submit complaint
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     navigator.geolocation.getCurrentPosition(async (position) => {
//       const lat = position.coords.latitude;
//       const lng = position.coords.longitude;

//       const data = new FormData();
//       data.append("title", formData.title);
//       data.append("description", formData.description);
//       data.append("image", formData.image);
//       data.append("lat", lat);
//       data.append("lng", lng);

//       try {
//         await fetch("http://localhost:5000/api/complaints", {
//           method: "POST",
//           body: data,
//         });

//         alert("Complaint submitted!");
//         fetchComplaints();
//       } catch (err) {
//         console.error(err);
//       }
//     });
//   };

//   // 🔄 Update status
//   const updateStatus = async (id) => {
//     try {
//       await fetch(`http://localhost:5000/api/complaints/${id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ status: "Resolved" }),
//       });

//       fetchComplaints();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div style={{ padding: "20px", fontFamily: "Arial" }}>
//       <h2>Jan Seva Connect</h2>

//       {/* FORM */}
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           name="title"
//           placeholder="Title"
//           onChange={handleChange}
//           required
//         />
//         <br /><br />

//         <textarea
//           name="description"
//           placeholder="Description"
//           onChange={handleChange}
//           required
//         />
//         <br /><br />

//         <input
//           type="file"
//           name="image"
//           onChange={handleChange}
//           required
//         />
//         <br /><br />

//         <button type="submit">Submit Complaint</button>
//       </form>

//       <hr />

//       {/* 🗺 MAP */}
//       <h3>Complaints Map</h3>

//       <div style={{ height: "400px", marginBottom: "20px" }}>
//         <MapContainer
//           center={[13.0827, 80.2707]}
//           zoom={12}
//           style={{ height: "100%", width: "100%" }}
//         >
//           <TileLayer
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           />

//           {complaints.map((c) => (
//             <Marker
//               key={c._id}
//               position={[c.location.lat, c.location.lng]}
//             >
//               <Popup>
//                 <b>{c.title}</b> <br />
//                 {c.description} <br />
//                 Status: {c.status}
//               </Popup>
//             </Marker>
//           ))}
//         </MapContainer>
//       </div>

//       {/* 📋 LIST */}
//       <h3>All Complaints</h3>

//       {complaints.length === 0 ? (
//         <p>No complaints yet</p>
//       ) : (
//         complaints.map((c) => (
//           <div
//             key={c._id}
//             style={{
//               border: "1px solid #ccc",
//               padding: "10px",
//               margin: "10px 0",
//               borderRadius: "8px",
//             }}
//           >
//             <h4>{c.title}</h4>
//             <p>{c.description}</p>
//             <p>Status: <b>{c.status}</b></p>

//             {c.image && (
//               <img
//                 src={c.image}
//                 alt=""
//                 width="200"
//                 style={{ marginTop: "10px" }}
//               />
//             )}

//             <br /><br />

//             {c.status !== "Resolved" && (
//               <button onClick={() => updateStatus(c._id)}>
//                 Mark as Resolved
//               </button>
//             )}
//           </div>
//         ))
//       )}
//     </div>
//   );
// }

// export default App;


import { useState, useEffect, useRef } from "react";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_COMPLAINTS = [
  {
    _id: "1",
    title: "Broken Streetlight on MG Road",
    description: "The streetlight near bus stop 14 has been broken for 3 weeks causing safety issues at night.",
    status: "Pending",
    category: "Infrastructure",
    location: { lat: 13.0827, lng: 80.2707 },
    image: null,
    submittedAt: "2025-04-18T10:30:00Z",
    upvotes: 12,
  },
  {
    _id: "2",
    title: "Overflowing Garbage Bin at Park",
    description: "The garbage bin near Nehru Park hasn't been cleared for 5 days and is causing a health hazard.",
    status: "In Progress",
    category: "Sanitation",
    location: { lat: 13.09, lng: 80.28 },
    image: null,
    submittedAt: "2025-04-20T08:15:00Z",
    upvotes: 8,
  },
  {
    _id: "3",
    title: "Pothole on Anna Salai",
    description: "Large pothole causing accidents near the signal. Three bikes have fallen this week.",
    status: "Resolved",
    category: "Roads",
    location: { lat: 13.07, lng: 80.26 },
    image: null,
    submittedAt: "2025-04-15T14:00:00Z",
    upvotes: 31,
  },
  {
    _id: "4",
    title: "Water Leakage on 2nd Cross Street",
    description: "Pipeline burst causing water wastage and making the road slippery.",
    status: "Pending",
    category: "Water Supply",
    location: { lat: 13.085, lng: 80.265 },
    image: null,
    submittedAt: "2025-04-22T07:00:00Z",
    upvotes: 5,
  },
];

const CATEGORIES = ["Infrastructure", "Sanitation", "Roads", "Water Supply", "Electricity", "Other"];
const STATUS_COLORS = {
  Pending: { bg: "#FFF3CD", text: "#856404", dot: "#FFC107" },
  "In Progress": { bg: "#CCE5FF", text: "#004085", dot: "#0D6EFD" },
  Resolved: { bg: "#D4EDDA", text: "#155724", dot: "#28A745" },
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --navy: #0B1F3A;
    --navy-mid: #132D55;
    --navy-light: #1E4080;
    --saffron: #F5A623;
    --saffron-light: #FFCB6B;
    --white: #FFFFFF;
    --off-white: #F7F9FC;
    --gray-100: #EEF1F6;
    --gray-200: #D8DEEA;
    --gray-400: #8A96AE;
    --gray-700: #3A4563;
    --green: #28A745;
    --blue: #0D6EFD;
    --red: #DC3545;
    --radius: 14px;
    --radius-sm: 8px;
    --shadow: 0 4px 24px rgba(11,31,58,0.10);
    --shadow-lg: 0 8px 40px rgba(11,31,58,0.16);
    --font-head: 'Syne', sans-serif;
    --font-body: 'DM Sans', sans-serif;
    --transition: 0.22s cubic-bezier(0.4,0,0.2,1);
  }

  body { font-family: var(--font-body); background: var(--off-white); color: var(--navy); }

  /* ── Layout ── */
  .app { min-height: 100vh; display: flex; flex-direction: column; }

  /* ── Top Nav ── */
  .topnav {
    background: var(--navy);
    padding: 0 32px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 2px 16px rgba(0,0,0,0.2);
  }
  .topnav-brand {
    display: flex;
    align-items: center;
    gap: 12px;
    font-family: var(--font-head);
    font-size: 20px;
    font-weight: 800;
    color: var(--white);
    letter-spacing: -0.3px;
  }
  .topnav-brand span { color: var(--saffron); }
  .brand-icon {
    width: 36px; height: 36px;
    background: var(--saffron);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
  }
  .tab-switcher {
    display: flex;
    background: rgba(255,255,255,0.08);
    border-radius: 10px;
    padding: 4px;
    gap: 2px;
  }
  .tab-btn {
    padding: 7px 20px;
    border: none;
    border-radius: 7px;
    font-family: var(--font-body);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);
    background: transparent;
    color: rgba(255,255,255,0.6);
  }
  .tab-btn.active {
    background: var(--saffron);
    color: var(--navy);
    font-weight: 700;
  }
  .tab-btn:hover:not(.active) { color: white; background: rgba(255,255,255,0.12); }

  /* ── User View ── */
  .user-layout { max-width: 900px; margin: 0 auto; padding: 36px 24px 80px; }

  .hero-banner {
    background: linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 100%);
    border-radius: var(--radius);
    padding: 36px 40px;
    margin-bottom: 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    overflow: hidden;
    position: relative;
  }
  .hero-banner::before {
    content: '';
    position: absolute; top: -40px; right: -40px;
    width: 200px; height: 200px;
    background: radial-gradient(circle, rgba(245,166,35,0.18) 0%, transparent 70%);
    border-radius: 50%;
  }
  .hero-text h1 {
    font-family: var(--font-head);
    font-size: 28px;
    font-weight: 800;
    color: var(--white);
    line-height: 1.2;
    margin-bottom: 8px;
  }
  .hero-text h1 em { color: var(--saffron); font-style: normal; }
  .hero-text p { color: rgba(255,255,255,0.6); font-size: 15px; max-width: 380px; }
  .hero-stat {
    text-align: right;
    color: white;
    font-family: var(--font-head);
  }
  .hero-stat .num { font-size: 48px; font-weight: 800; color: var(--saffron); line-height: 1; }
  .hero-stat .label { font-size: 13px; color: rgba(255,255,255,0.5); margin-top: 4px; }

  /* ── Form Card ── */
  .card {
    background: var(--white);
    border-radius: var(--radius);
    padding: 28px 32px;
    box-shadow: var(--shadow);
    margin-bottom: 28px;
  }
  .card-title {
    font-family: var(--font-head);
    font-size: 18px;
    font-weight: 700;
    color: var(--navy);
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .card-title-icon {
    width: 34px; height: 34px;
    background: var(--gray-100);
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px;
  }

  .form-grid { display: grid; gap: 16px; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .field label {
    display: block;
    font-size: 13px;
    font-weight: 500;
    color: var(--gray-700);
    margin-bottom: 6px;
    letter-spacing: 0.3px;
  }
  .field input,
  .field textarea,
  .field select {
    width: 100%;
    padding: 11px 14px;
    border: 1.5px solid var(--gray-200);
    border-radius: var(--radius-sm);
    font-family: var(--font-body);
    font-size: 14px;
    color: var(--navy);
    background: var(--off-white);
    transition: var(--transition);
    outline: none;
    appearance: none;
  }
  .field input:focus,
  .field textarea:focus,
  .field select:focus {
    border-color: var(--navy-light);
    background: white;
    box-shadow: 0 0 0 3px rgba(30,64,128,0.08);
  }
  .field textarea { resize: vertical; min-height: 90px; }

  .file-drop {
    border: 2px dashed var(--gray-200);
    border-radius: var(--radius-sm);
    padding: 24px;
    text-align: center;
    cursor: pointer;
    transition: var(--transition);
    background: var(--off-white);
  }
  .file-drop:hover { border-color: var(--navy-light); background: #F0F4FF; }
  .file-drop p { font-size: 13px; color: var(--gray-400); margin-top: 6px; }

  .btn-primary {
    background: var(--navy);
    color: white;
    border: none;
    padding: 13px 28px;
    border-radius: var(--radius-sm);
    font-family: var(--font-body);
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition);
    display: flex;
    align-items: center;
    gap: 8px;
    justify-content: center;
  }
  .btn-primary:hover { background: var(--navy-light); transform: translateY(-1px); box-shadow: var(--shadow); }
  .btn-primary:active { transform: translateY(0); }
  .btn-primary.loading { opacity: 0.7; cursor: not-allowed; }

  .btn-outline {
    background: transparent;
    color: var(--navy);
    border: 1.5px solid var(--gray-200);
    padding: 8px 16px;
    border-radius: var(--radius-sm);
    font-family: var(--font-body);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);
  }
  .btn-outline:hover { border-color: var(--navy); background: var(--off-white); }

  /* ── Complaint Cards ── */
  .complaints-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }
  .section-title {
    font-family: var(--font-head);
    font-size: 20px;
    font-weight: 700;
    color: var(--navy);
  }
  .filter-tabs {
    display: flex;
    gap: 6px;
  }
  .filter-chip {
    padding: 5px 14px;
    border-radius: 20px;
    border: 1.5px solid var(--gray-200);
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    background: white;
    color: var(--gray-700);
    transition: var(--transition);
  }
  .filter-chip.active {
    background: var(--navy);
    border-color: var(--navy);
    color: white;
  }
  .filter-chip:hover:not(.active) { border-color: var(--navy); color: var(--navy); }

  .complaint-card {
    background: white;
    border-radius: var(--radius);
    padding: 20px 24px;
    margin-bottom: 14px;
    box-shadow: var(--shadow);
    display: flex;
    gap: 18px;
    align-items: flex-start;
    transition: var(--transition);
    border: 1.5px solid transparent;
  }
  .complaint-card:hover { border-color: var(--gray-200); transform: translateY(-2px); box-shadow: var(--shadow-lg); }
  .complaint-card-left { flex: 1; }
  .complaint-meta {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
  }
  .cat-badge {
    font-size: 11px;
    font-weight: 600;
    padding: 3px 10px;
    border-radius: 20px;
    background: var(--gray-100);
    color: var(--gray-700);
    letter-spacing: 0.3px;
    text-transform: uppercase;
  }
  .status-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    font-weight: 600;
    padding: 3px 10px;
    border-radius: 20px;
    letter-spacing: 0.2px;
  }
  .status-dot { width: 6px; height: 6px; border-radius: 50%; }
  .complaint-title {
    font-family: var(--font-head);
    font-size: 16px;
    font-weight: 700;
    color: var(--navy);
    margin-bottom: 6px;
  }
  .complaint-desc { font-size: 14px; color: var(--gray-400); line-height: 1.6; }
  .complaint-footer {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-top: 12px;
    font-size: 12px;
    color: var(--gray-400);
  }
  .upvote-btn {
    display: flex; align-items: center; gap: 5px;
    background: var(--off-white);
    border: 1.5px solid var(--gray-200);
    border-radius: 6px;
    padding: 4px 10px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    color: var(--gray-700);
    transition: var(--transition);
    font-family: var(--font-body);
  }
  .upvote-btn:hover { background: #FFF3CD; border-color: var(--saffron); color: var(--navy); }
  .upvote-btn.upvoted { background: #FFF3CD; border-color: var(--saffron); color: #856404; }

  .complaint-card-right { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; }
  .complaint-date { font-size: 11px; color: var(--gray-400); white-space: nowrap; }

  /* ── Admin View ── */
  .admin-layout { display: flex; height: calc(100vh - 64px); overflow: hidden; }

  .admin-sidebar {
    width: 220px;
    min-width: 220px;
    background: var(--navy);
    padding: 28px 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
    overflow-y: auto;
  }
  .sidebar-section-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1.5px;
    color: rgba(255,255,255,0.3);
    text-transform: uppercase;
    padding: 16px 20px 6px;
  }
  .sidebar-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 11px 20px;
    font-size: 14px;
    font-weight: 500;
    color: rgba(255,255,255,0.55);
    cursor: pointer;
    transition: var(--transition);
    border-right: 3px solid transparent;
  }
  .sidebar-item:hover { color: white; background: rgba(255,255,255,0.06); }
  .sidebar-item.active {
    color: var(--saffron);
    background: rgba(245,166,35,0.08);
    border-right-color: var(--saffron);
  }
  .sidebar-icon { font-size: 17px; width: 20px; text-align: center; }
  .sidebar-badge {
    margin-left: auto;
    background: var(--saffron);
    color: var(--navy);
    font-size: 10px;
    font-weight: 700;
    padding: 2px 7px;
    border-radius: 10px;
  }

  .admin-main { flex: 1; overflow-y: auto; background: var(--off-white); }

  .admin-topbar {
    background: white;
    padding: 20px 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--gray-100);
    position: sticky; top: 0; z-index: 10;
  }
  .admin-topbar-title { font-family: var(--font-head); font-size: 22px; font-weight: 800; color: var(--navy); }
  .admin-topbar-sub { font-size: 13px; color: var(--gray-400); margin-top: 2px; }

  .admin-content { padding: 28px 32px; }

  /* ── Stats Grid ── */
  .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px; }
  .stat-card {
    background: white;
    border-radius: var(--radius);
    padding: 20px 22px;
    box-shadow: var(--shadow);
    display: flex;
    align-items: center;
    gap: 16px;
    transition: var(--transition);
  }
  .stat-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-lg); }
  .stat-icon {
    width: 48px; height: 48px;
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px;
    flex-shrink: 0;
  }
  .stat-icon.yellow { background: #FFF3CD; }
  .stat-icon.blue { background: #CCE5FF; }
  .stat-icon.green { background: #D4EDDA; }
  .stat-icon.red { background: #F8D7DA; }
  .stat-num { font-family: var(--font-head); font-size: 30px; font-weight: 800; color: var(--navy); line-height: 1; }
  .stat-label { font-size: 12px; color: var(--gray-400); margin-top: 4px; font-weight: 500; }

  /* ── Admin Table ── */
  .table-card {
    background: white;
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    overflow: hidden;
  }
  .table-header {
    padding: 18px 24px;
    border-bottom: 1px solid var(--gray-100);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .table-title { font-family: var(--font-head); font-size: 16px; font-weight: 700; color: var(--navy); }
  .search-input {
    padding: 8px 14px;
    border: 1.5px solid var(--gray-200);
    border-radius: var(--radius-sm);
    font-family: var(--font-body);
    font-size: 13px;
    outline: none;
    width: 220px;
    transition: var(--transition);
  }
  .search-input:focus { border-color: var(--navy-light); }

  .admin-table { width: 100%; border-collapse: collapse; }
  .admin-table th {
    padding: 12px 18px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: var(--gray-400);
    text-align: left;
    background: var(--off-white);
    border-bottom: 1px solid var(--gray-100);
  }
  .admin-table td {
    padding: 14px 18px;
    font-size: 14px;
    color: var(--navy);
    border-bottom: 1px solid var(--gray-100);
    vertical-align: middle;
  }
  .admin-table tr:last-child td { border-bottom: none; }
  .admin-table tr:hover td { background: #FAFBFF; }
  .td-title { font-weight: 600; margin-bottom: 2px; }
  .td-cat { font-size: 12px; color: var(--gray-400); }
  .td-date { font-size: 12px; color: var(--gray-400); }
  .td-upvotes { font-weight: 600; color: var(--gray-700); font-size: 13px; }

  .action-btn {
    padding: 6px 14px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    font-family: var(--font-body);
    transition: var(--transition);
  }
  .action-btn.resolve { background: #D4EDDA; color: #155724; }
  .action-btn.resolve:hover { background: #28A745; color: white; }
  .action-btn.progress { background: #CCE5FF; color: #004085; }
  .action-btn.progress:hover { background: #0D6EFD; color: white; }
  .action-btn.delete { background: #F8D7DA; color: #721C24; }
  .action-btn.delete:hover { background: #DC3545; color: white; }
  .action-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  /* ── Modal ── */
  .modal-overlay {
    position: fixed; inset: 0;
    background: rgba(11,31,58,0.55);
    backdrop-filter: blur(4px);
    z-index: 200;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    animation: fadeIn 0.15s ease;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .modal {
    background: white;
    border-radius: var(--radius);
    padding: 32px;
    max-width: 540px;
    width: 100%;
    box-shadow: var(--shadow-lg);
    animation: slideUp 0.2s ease;
  }
  @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .modal-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
  .modal-title { font-family: var(--font-head); font-size: 20px; font-weight: 800; color: var(--navy); }
  .modal-close {
    width: 32px; height: 32px;
    border-radius: 8px;
    border: 1.5px solid var(--gray-200);
    background: white;
    cursor: pointer;
    font-size: 16px;
    display: flex; align-items: center; justify-content: center;
    transition: var(--transition);
  }
  .modal-close:hover { background: var(--gray-100); }

  /* ── Toast ── */
  .toast {
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: var(--navy);
    color: white;
    padding: 14px 22px;
    border-radius: var(--radius-sm);
    font-size: 14px;
    font-weight: 500;
    box-shadow: var(--shadow-lg);
    z-index: 999;
    display: flex;
    align-items: center;
    gap: 10px;
    animation: slideToast 0.25s ease;
    max-width: 360px;
  }
  @keyframes slideToast {
    from { transform: translateX(30px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  /* ── Empty ── */
  .empty { text-align: center; padding: 60px 20px; color: var(--gray-400); }
  .empty-icon { font-size: 48px; margin-bottom: 12px; }
  .empty-text { font-size: 15px; font-weight: 500; margin-bottom: 6px; color: var(--gray-700); }
  .empty-sub { font-size: 13px; }

  /* ── Responsive ── */
  @media (max-width: 700px) {
    .admin-layout { flex-direction: column; }
    .admin-sidebar { width: 100%; flex-direction: row; flex-wrap: nowrap; overflow-x: auto; padding: 8px; height: auto; min-height: unset; }
    .stats-grid { grid-template-columns: 1fr 1fr; }
    .form-row { grid-template-columns: 1fr; }
    .hero-stat { display: none; }
    .admin-table { font-size: 12px; }
  }
`;

// ─── Utilities ────────────────────────────────────────────────────────────────
function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function StatusBadge({ status }) {
  const c = STATUS_COLORS[status] || STATUS_COLORS["Pending"];
  return (
    <span className="status-badge" style={{ background: c.bg, color: c.text }}>
      <span className="status-dot" style={{ background: c.dot }} />
      {status}
    </span>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ msg, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3200);
    return () => clearTimeout(t);
  }, []);
  return <div className="toast">✅ {msg}</div>;
}

// ─── User View ────────────────────────────────────────────────────────────────
function UserView({ complaints, onSubmit, onUpvote }) {
  const [form, setForm] = useState({ title: "", description: "", category: "Infrastructure" });
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState("All");
  const [fileName, setFileName] = useState(null);

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.description.trim()) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 900));
    onSubmit({ ...form, submittedAt: new Date().toISOString(), upvotes: 0, status: "Pending", location: { lat: 13.0827, lng: 80.2707 }, image: null, _id: Date.now().toString() });
    setForm({ title: "", description: "", category: "Infrastructure" });
    setFileName(null);
    setSubmitting(false);
  };

  const filtered = filter === "All" ? complaints : complaints.filter(c => c.status === filter);
  const pending = complaints.filter(c => c.status === "Pending").length;

  return (
    <div className="user-layout">
      <div className="hero-banner">
        <div className="hero-text">
          <h1>Report. Track. <em>Resolve.</em></h1>
          <p>Submit civic complaints and track their resolution in real-time across your city.</p>
        </div>
        <div className="hero-stat">
          <div className="num">{complaints.length}</div>
          <div className="label">Total Reports</div>
        </div>
      </div>

      <div className="card">
        <div className="card-title"><span className="card-title-icon">📋</span> File a New Complaint</div>
        <div className="form-grid">
          <div className="form-row">
            <div className="field">
              <label>Complaint Title *</label>
              <input type="text" placeholder="e.g. Broken streetlight on MG Road" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="field">
              <label>Category *</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="field">
            <label>Description *</label>
            <textarea placeholder="Describe the issue in detail..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="field">
            <label>Attach Photo (Optional)</label>
            <label className="file-drop" htmlFor="file-input">
              <div style={{ fontSize: 28 }}>📎</div>
              <p>{fileName ? `✅ ${fileName}` : "Click to upload or drag & drop"}</p>
              <p>PNG, JPG up to 5MB</p>
              <input id="file-input" type="file" accept="image/*" style={{ display: "none" }} onChange={e => setFileName(e.target.files[0]?.name)} />
            </label>
          </div>
          <button className={`btn-primary${submitting ? " loading" : ""}`} onClick={handleSubmit} disabled={submitting}>
            {submitting ? "⏳ Submitting..." : "🚀 Submit Complaint"}
          </button>
        </div>
      </div>

      <div>
        <div className="complaints-header">
          <div className="section-title">Complaints ({filtered.length})</div>
          <div className="filter-tabs">
            {["All", "Pending", "In Progress", "Resolved"].map(f => (
              <button key={f} className={`filter-chip${filter === f ? " active" : ""}`} onClick={() => setFilter(f)}>{f}</button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">🔍</div>
            <div className="empty-text">No complaints found</div>
            <div className="empty-sub">Try changing the filter</div>
          </div>
        ) : filtered.map(c => (
          <div key={c._id} className="complaint-card">
            <div className="complaint-card-left">
              <div className="complaint-meta">
                <span className="cat-badge">{c.category}</span>
                <StatusBadge status={c.status} />
              </div>
              <div className="complaint-title">{c.title}</div>
              <div className="complaint-desc">{c.description}</div>
              <div className="complaint-footer">
                <button className={`upvote-btn`} onClick={() => onUpvote(c._id)}>👍 {c.upvotes} Upvotes</button>
                <span>📍 {c.location.lat.toFixed(3)}, {c.location.lng.toFixed(3)}</span>
                <span>🗓 {formatDate(c.submittedAt)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Admin View ───────────────────────────────────────────────────────────────
function AdminView({ complaints, onUpdateStatus, onDelete }) {
  const [tab, setTab] = useState("dashboard");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const pending = complaints.filter(c => c.status === "Pending");
  const inProgress = complaints.filter(c => c.status === "In Progress");
  const resolved = complaints.filter(c => c.status === "Resolved");

  const display = complaints.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.category.toLowerCase().includes(search.toLowerCase())
  );

  const tabComplaints = tab === "pending" ? display.filter(c => c.status === "Pending")
    : tab === "progress" ? display.filter(c => c.status === "In Progress")
    : tab === "resolved" ? display.filter(c => c.status === "Resolved")
    : display;

  const sideNav = [
    { id: "dashboard", icon: "📊", label: "Dashboard" },
    { id: "all", icon: "📋", label: "All Complaints", badge: complaints.length },
    { id: "pending", icon: "⏳", label: "Pending", badge: pending.length },
    { id: "progress", icon: "🔄", label: "In Progress", badge: inProgress.length },
    { id: "resolved", icon: "✅", label: "Resolved" },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="sidebar-section-label">Navigation</div>
        {sideNav.map(item => (
          <div key={item.id} className={`sidebar-item${tab === item.id ? " active" : ""}`} onClick={() => setTab(item.id)}>
            <span className="sidebar-icon">{item.icon}</span>
            <span>{item.label}</span>
            {item.badge != null && item.badge > 0 && <span className="sidebar-badge">{item.badge}</span>}
          </div>
        ))}
        <div className="sidebar-section-label">Settings</div>
        <div className="sidebar-item"><span className="sidebar-icon">⚙️</span> Settings</div>
        <div className="sidebar-item"><span className="sidebar-icon">📤</span> Export Data</div>
      </div>

      {/* Main */}
      <div className="admin-main">
        <div className="admin-topbar">
          <div>
            <div className="admin-topbar-title">
              {tab === "dashboard" ? "Dashboard Overview" : tab === "all" ? "All Complaints" : tab === "pending" ? "Pending Complaints" : tab === "progress" ? "In Progress" : "Resolved"}
            </div>
            <div className="admin-topbar-sub">Jan Seva Connect — Admin Panel</div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <span style={{ fontSize: 13, color: "var(--gray-400)", padding: "8px 14px", background: "var(--off-white)", borderRadius: 8, fontWeight: 500 }}>
              👤 Admin
            </span>
          </div>
        </div>

        <div className="admin-content">
          {/* Dashboard tab */}
          {tab === "dashboard" && (
            <>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon yellow">📋</div>
                  <div>
                    <div className="stat-num">{complaints.length}</div>
                    <div className="stat-label">Total Complaints</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon red">⏳</div>
                  <div>
                    <div className="stat-num">{pending.length}</div>
                    <div className="stat-label">Pending</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon blue">🔄</div>
                  <div>
                    <div className="stat-num">{inProgress.length}</div>
                    <div className="stat-label">In Progress</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon green">✅</div>
                  <div>
                    <div className="stat-num">{resolved.length}</div>
                    <div className="stat-label">Resolved</div>
                  </div>
                </div>
              </div>

              {/* Recent */}
              <div className="table-card">
                <div className="table-header">
                  <div className="table-title">Recent Complaints</div>
                  <button className="btn-outline" onClick={() => setTab("all")}>View All →</button>
                </div>
                <ComplaintsTable complaints={complaints.slice(0, 5)} onUpdateStatus={onUpdateStatus} onDelete={onDelete} onSelect={setSelected} />
              </div>
            </>
          )}

          {/* Complaints tab */}
          {tab !== "dashboard" && (
            <div className="table-card">
              <div className="table-header">
                <div className="table-title">{tabComplaints.length} complaint{tabComplaints.length !== 1 ? "s" : ""}</div>
                <input className="search-input" placeholder="🔍  Search complaints..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              {tabComplaints.length === 0 ? (
                <div className="empty">
                  <div className="empty-icon">🎉</div>
                  <div className="empty-text">No complaints here</div>
                  <div className="empty-sub">All clear in this category</div>
                </div>
              ) : (
                <ComplaintsTable complaints={tabComplaints} onUpdateStatus={onUpdateStatus} onDelete={onDelete} onSelect={setSelected} />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <div className="modal-title">{selected.title}</div>
              <button className="modal-close" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
              <span className="cat-badge">{selected.category}</span>
              <StatusBadge status={selected.status} />
              <span style={{ fontSize: 12, color: "var(--gray-400)" }}>📅 {formatDate(selected.submittedAt)}</span>
            </div>
            <p style={{ fontSize: 14, color: "var(--gray-700)", lineHeight: 1.7, marginBottom: 16 }}>{selected.description}</p>
            <div style={{ fontSize: 13, color: "var(--gray-400)", marginBottom: 20 }}>
              📍 Lat: {selected.location.lat}, Lng: {selected.location.lng} &nbsp;|&nbsp; 👍 {selected.upvotes} upvotes
            </div>
            {selected.status !== "Resolved" && (
              <div style={{ display: "flex", gap: 10 }}>
                {selected.status !== "In Progress" && (
                  <button className="action-btn progress" onClick={() => { onUpdateStatus(selected._id, "In Progress"); setSelected(null); }}>
                    🔄 Mark In Progress
                  </button>
                )}
                <button className="action-btn resolve" onClick={() => { onUpdateStatus(selected._id, "Resolved"); setSelected(null); }}>
                  ✅ Mark Resolved
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Admin Table ──────────────────────────────────────────────────────────────
function ComplaintsTable({ complaints, onUpdateStatus, onDelete, onSelect }) {
  return (
    <table className="admin-table">
      <thead>
        <tr>
          <th>Complaint</th>
          <th>Status</th>
          <th>Upvotes</th>
          <th>Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {complaints.map(c => (
          <tr key={c._id}>
            <td>
              <div className="td-title" style={{ cursor: "pointer", color: "var(--navy-light)" }} onClick={() => onSelect(c)}>{c.title}</div>
              <div className="td-cat">{c.category}</div>
            </td>
            <td><StatusBadge status={c.status} /></td>
            <td><span className="td-upvotes">👍 {c.upvotes}</span></td>
            <td><span className="td-date">{formatDate(c.submittedAt)}</span></td>
            <td>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {c.status === "Pending" && (
                  <button className="action-btn progress" onClick={() => onUpdateStatus(c._id, "In Progress")}>In Progress</button>
                )}
                {c.status !== "Resolved" && (
                  <button className="action-btn resolve" onClick={() => onUpdateStatus(c._id, "Resolved")}>Resolve</button>
                )}
                <button className="action-btn delete" onClick={() => onDelete(c._id)}>Delete</button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("user");
  const [complaints, setComplaints] = useState(MOCK_COMPLAINTS);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleSubmit = (c) => {
    setComplaints(prev => [c, ...prev]);
    showToast("Complaint submitted successfully!");
  };

  const handleUpvote = (id) => {
    setComplaints(prev => prev.map(c => c._id === id ? { ...c, upvotes: c.upvotes + 1 } : c));
  };

  const handleUpdateStatus = (id, status) => {
    setComplaints(prev => prev.map(c => c._id === id ? { ...c, status } : c));
    showToast(`Complaint marked as "${status}"`);
  };

  const handleDelete = (id) => {
    setComplaints(prev => prev.filter(c => c._id !== id));
    showToast("Complaint removed");
  };

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <nav className="topnav">
          <div className="topnav-brand">
            <div className="brand-icon">🏛️</div>
            Jan Seva <span>Connect</span>
          </div>
          <div className="tab-switcher">
            <button className={`tab-btn${view === "user" ? " active" : ""}`} onClick={() => setView("user")}>
              👤 Citizen Portal
            </button>
            <button className={`tab-btn${view === "admin" ? " active" : ""}`} onClick={() => setView("admin")}>
              🛡️ Admin Panel
            </button>
          </div>
        </nav>

        {view === "user"
          ? <UserView complaints={complaints} onSubmit={handleSubmit} onUpvote={handleUpvote} />
          : <AdminView complaints={complaints} onUpdateStatus={handleUpdateStatus} onDelete={handleDelete} />
        }

        {toast && <Toast msg={toast} onClose={() => setToast(null)} />}
      </div>
    </>
  );
}