import { useEffect, useState } from "react";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  LogOut,
  Save,
  Edit,
  KeyRound,
} from "lucide-react";

interface Stats {
  total: number;
  pending: number;
  in_progress: number;
  resolved: number;
  rejected: number;
}

interface Complaint {
  id: number;
  title: string;
  subject: string;
  description: string;
  status: string;
  response: string;
}

interface Profile {
  fullName: string;
  email: string;
  regNo: string;
}

interface NewComplaint {
  title: string;
  subject: string;
  description: string;
}

function LoaderOverlay({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/20 backdrop-blur-0 transition-opacity duration-300 animate-fadeIn">
      <div className="flex flex-col items-center">
        {/* Spinner */}
        <div className="loader mb-4" />
        <span className="text-xl font-semibold text-blue-700 animate-pulse">Loading...</span>
      </div>
      <style>{`
        .loader {
          border: 5px solid #e0e7ef;
          border-top: 5px solid #2563eb;
          border-radius: 50%;
          width: 56px;
          height: 56px;
          animation: spin 0.85s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function OverlayMessage({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <>
      <div className="fixed inset-0 bg-white/60 backdrop-blur-[4px] z-40"></div>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <span className="text-3xl font-bold text-blue-700 bg-white/90 rounded-2xl px-10 py-8 shadow-2xl animate-fadeIn">
          {message}
        </span>
      </div>
    </>
  );
}

function Modal({
  open,
  onClose,
  children,
  title,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}) {
  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 bg-white/70 backdrop-blur-[2px] z-40" onClick={onClose}></div>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="bg-white p-10 rounded-3xl shadow-2xl min-w-[360px] max-w-lg relative">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">{title}</h2>
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-red-400"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
          {children}
        </div>
      </div>
    </>
  );
}

const StudentDashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    total: 0,
    pending: 0,
    in_progress: 0,
    resolved: 0,
    rejected: 0,
  });
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [profile, setProfile] = useState<Profile>({
    fullName: "",
    email: "",
    regNo: "",
  });
  const [view, setView] =
    useState<
      "dashboard" | "complaints" | "add" | "profile" | "changePassword"
    >("dashboard");
  const [newComplaint, setNewComplaint] = useState<NewComplaint>({
    title: "",
    subject: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [overlayMessage, setOverlayMessage] = useState<string | null>(null);

  // Loading overlay separate state
  const [isLoadingOverlay, setIsLoadingOverlay] = useState(false);

  // Modal states
  const [editProfileModal, setEditProfileModal] = useState(false);
  const [tempProfile, setTempProfile] = useState<Profile>(profile);

  const [changePasswordModal, setChangePasswordModal] = useState(false);
  const [passwordFields, setPasswordFields] = useState({
    currentPassword: "",
    newPassword: "",
    confirm: "",
  });

  // NEW: State for complaint status filter
  const [
    complaintStatusFilter,
    setComplaintStatusFilter,
  ] = useState<
    "All" | "Pending" | "In Progress" | "Resolved" | "Rejected"
  >("All");

  useEffect(() => {
    fetchStats();
    fetchComplaints();
    fetchProfile();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("http://localhost:8080/user/stats", {
        credentials: "include",
      });
      if (res.ok) {
        const data: Stats = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchComplaints = async () => {
    try {
      const res = await fetch("http://localhost:8080/user/complaints", {
        credentials: "include",
      });
      if (res.ok) {
        const data: Complaint[] = await res.json();
        setComplaints(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await fetch("http://localhost:8080/user/profile", {
        credentials: "include",
      });
      if (res.ok) {
        const data: Profile = await res.json();
        setProfile(data);
        setTempProfile(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setOverlayMessage("Submitting complaint...");
    try {
      const res = await fetch("http://localhost:8080/user/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newComplaint),
      });
      if (res.ok) {
        setOverlayMessage("Complaint submitted successfully!");
        setTimeout(() => {
          setOverlayMessage(null);
          setNewComplaint({ title: "", subject: "", description: "" });
          fetchComplaints();
          fetchStats();
          setView("complaints");
        }, 1800);
      } else {
        alert("Failed to submit complaint.");
        setOverlayMessage(null);
      }
    } catch (err) {
      console.error(err);
      setOverlayMessage(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;
    await fetch("http://localhost:8080/user/logout", { credentials: "include" });
    window.location.href = "/";
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setOverlayMessage("Updating profile...");
    try {
      const res = await fetch("http://localhost:8080/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(tempProfile),
      });
      if (res.ok) {
        setOverlayMessage("Profile updated successfully!");
        setTimeout(() => {
          setOverlayMessage(null);
          setProfile(tempProfile);
          setEditProfileModal(false);
        }, 1700);
      } else {
        alert("Failed to update profile.");
        setOverlayMessage(null);
      }
    } catch (err) {
      console.error(err);
      setOverlayMessage(null);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setOverlayMessage("Changing password...");
    if (!passwordFields.newPassword || passwordFields.newPassword !== passwordFields.confirm) {
      alert("Passwords do not match or empty.");
      setOverlayMessage(null);
      return;
    }
    try {
      const res = await fetch("http://localhost:8080/user/changePassword", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          currentPassword: passwordFields.currentPassword,
          newPassword: passwordFields.newPassword,
        }),
      });
      if (res.ok) {
        setOverlayMessage("Password changed successfully!");
        setTimeout(() => {
          setOverlayMessage(null);
          setChangePasswordModal(false);
          setPasswordFields({
            currentPassword: "",
            newPassword: "",
            confirm: "",
          });
        }, 1700);
      } else {
        alert("Failed to change password.");
        setOverlayMessage(null);
      }
    } catch (err) {
      console.error(err);
      setOverlayMessage(null);
    }
  };

  const statCards = [
    { title: "Total Complaints", value: stats.total, icon: FileText, color: "text-blue-600" },
    { title: "Pending", value: stats.pending, icon: Clock, color: "text-yellow-500" },
    { title: "In Progress", value: stats.in_progress, icon: Clock, color: "text-orange-500" },
    { title: "Resolved", value: stats.resolved, icon: CheckCircle, color: "text-green-600" },
    { title: "Rejected", value: stats.rejected, icon: XCircle, color: "text-red-500" },
  ];

  // View switch with loader overlay (no blur)
  const handleViewChange = (v: typeof view) => {
    setIsLoadingOverlay(true);
    setTimeout(() => {
      setView(v);
      setIsLoadingOverlay(false);
    }, 750);
  };

  return (
    <div className="relative min-h-screen flex bg-gray-100">
      {/* Show spinner loader on loading only - no blur */}
      <LoaderOverlay show={isLoadingOverlay} />
      {/* Show big overlay message with blur on success/info, but only if not loading */}
      <OverlayMessage message={(!isLoadingOverlay && overlayMessage) ? overlayMessage : null} />

      {/* Profile Edit Modal */}
      <Modal
        open={editProfileModal}
        onClose={() => setEditProfileModal(false)}
        title="Edit Profile"
      >
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Full Name</label>
            <input
              type="text"
              value={tempProfile.fullName}
              onChange={(e) =>
                setTempProfile({ ...tempProfile, fullName: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Email</label>
            <input
              type="email"
              value={tempProfile.email}
              onChange={(e) =>
                setTempProfile({ ...tempProfile, email: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>
          <div className="flex justify-end gap-4 pt-2">
            <button
              type="button"
              className="bg-gray-200 px-6 py-2 rounded-md font-medium hover:bg-gray-300"
              onClick={() => setEditProfileModal(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-md font-semibold hover:opacity-90"
            >
              <Save className="inline-block w-5 h-5 mr-1" /> Save
            </button>
          </div>
        </form>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        open={changePasswordModal}
        onClose={() => setChangePasswordModal(false)}
        title="Change Password"
      >
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Current Password</label>
            <input
              type="password"
              value={passwordFields.currentPassword}
              onChange={(e) =>
                setPasswordFields({ ...passwordFields, currentPassword: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">New Password</label>
            <input
              type="password"
              value={passwordFields.newPassword}
              onChange={(e) =>
                setPasswordFields({ ...passwordFields, newPassword: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Confirm New Password</label>
            <input
              type="password"
              value={passwordFields.confirm}
              onChange={(e) =>
                setPasswordFields({ ...passwordFields, confirm: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>
          <div className="flex justify-end gap-4 pt-2">
            <button
              type="button"
              className="bg-gray-200 px-6 py-2 rounded-md font-medium hover:bg-gray-300"
              onClick={() => setChangePasswordModal(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-md font-semibold hover:opacity-90"
            >
              <KeyRound className="inline-block w-5 h-5 mr-1" /> Change
            </button>
          </div>
        </form>
      </Modal>

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-5 flex flex-col z-10">
        <h1 className="text-xl font-bold text-blue-700 mb-8">
          Student  Dashboard
        </h1>
        <nav className="flex flex-col gap-3">
          {["dashboard", "complaints", "add", "profile"].map((v) => (
            <button
              key={v}
              onClick={() => handleViewChange(v as typeof view)}
              className={`text-left px-4 py-2 rounded-lg font-medium ${
                view === v ? "bg-blue-600 text-white" : "hover:bg-gray-100"
              }`}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="bg-white shadow flex items-center justify-between px-8 py-4 z-10">
          <h2 className="text-lg font-semibold text-blue-700">
            Complaint Management System
          </h2>
          <div className="flex items-center gap-4">
            <span className="font-medium text-gray-700">
              {profile.fullName || "Student"}
            </span>
            <button
              onClick={handleLogout}
              className="p-2 rounded-full hover:bg-gray-100 text-red-600"
              title="Logout"
            >
              <LogOut size={22} />
            </button>
          </div>
        </header>

        <div
          className={`flex-1 p-8 overflow-y-auto transition-filter duration-300 ${
            overlayMessage && !isLoadingOverlay ? "blur-sm pointer-events-none" : ""
          }`}
        >
          {/* Dashboard, Complaints, Add, Profile views */}
          {view === "dashboard" && (
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {profile.fullName || "Student"}!
              </h1>
              <p className="text-gray-500 mb-6">
                Here’s an overview of your complaints.
              </p>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-8">
                {statCards.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={stat.title}
                      className="bg-white shadow p-5 rounded-xl hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <h2 className="text-sm font-medium">{stat.title}</h2>
                        <Icon className={`w-5 h-5 ${stat.color}`} />
                      </div>
                      <p className="text-2xl font-bold mt-3">{stat.value}</p>
                    </div>
                  );
                })}
              </div>
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-2xl font-semibold mb-4 text-blue-700">
                  Recent Complaints
                </h2>
                {complaints.length === 0 ? (
                  <p className="text-gray-500">No complaints found.</p>
                ) : (
                  <div className="space-y-3">
                    {complaints.slice(0, 3).map((c) => (
                      <div
                        key={c.id}
                        className="border border-gray-200 p-4 rounded-lg hover:bg-gray-50 transition"
                      >
                        <div className="flex justify-between">
                          <h3 className="font-semibold text-gray-800">
                            {c.title}
                          </h3>
                          <span
                            className={`text-sm px-2 py-1 rounded-full ${
                              c.status === "Pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : c.status === "Resolved"
                                ? "bg-green-100 text-green-700"
                                : c.status === "Rejected"
                                ? "bg-red-100 text-red-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {c.status}
                          </span>
                        </div>
                        <p className="text-gray-600">{c.subject}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {view === "complaints" && (
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-2xl font-semibold mb-4 text-blue-700">
                All Complaints
              </h2>

              {/* Status filter dropdown */}
              <div className="mb-4 flex items-center justify-between">
                <label className="font-medium text-gray-700">
                  Filter by Status:{" "}
                  <select
                    value={complaintStatusFilter}
                    onChange={(e) =>
                      setComplaintStatusFilter(e.target.value as
                        | "All"
                        | "Pending"
                        | "In Progress"
                        | "Resolved"
                        | "Rejected")
                    }
                    className="ml-2 border border-gray-300 rounded-lg p-2"
                  >
                    <option value="All">All</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </label>
              </div>

              {complaints.filter(
                (c) =>
                  complaintStatusFilter === "All" || c.status === complaintStatusFilter
              ).length === 0 ? (
                <p className="text-gray-500">
                  No complaints found
                  {complaintStatusFilter !== "All" ? ` for ${complaintStatusFilter}` : ""}.
                </p>
              ) : (
                <div className="space-y-4">
                  {complaints
                    .filter(
                      (c) =>
                        complaintStatusFilter === "All" || c.status === complaintStatusFilter
                    )
                    .map((c) => (
                      <div
                        key={c.id}
                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
                      >
                        <div className="flex justify-between">
                          <h3 className="text-lg font-semibold">{c.title}</h3>
                          <span
                            className={`text-sm px-3 py-1 rounded-full ${
                              c.status === "Pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : c.status === "Resolved"
                                ? "bg-green-100 text-green-700"
                                : c.status === "Rejected"
                                ? "bg-red-100 text-red-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {c.status}
                          </span>
                        </div>
                        <p className="text-gray-600">
                          Response:{" "}
                          {c.response && c.response.trim() ? c.response : "N/A"}
                        </p>
                        <p className="text-gray-600">{c.subject}</p>
                        <p className="text-gray-500 text-sm mt-2">
                          {c.description}
                        </p>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {view === "add" && (
            <div className="flex justify-center items-center">
              <div className="bg-white/80 backdrop-blur-md shadow-xl border border-gray-200 p-8 rounded-3xl max-w-xl w-full transition-transform hover:scale-[1.01]">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl px-6 py-4 mb-6 shadow-md text-center">
                  <h2 className="text-3xl font-bold tracking-wide">
                    📃 New Complaint
                  </h2>
                  <p className="text-sm text-blue-100 mt-1">
                    Tell us what’s bothering you — we’ll take care of it
                  </p>
                </div>

                <form onSubmit={handleAddComplaint} className="space-y-5">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      placeholder="Enter a short title"
                      value={newComplaint.title}
                      onChange={(e) =>
                        setNewComplaint({
                          ...newComplaint,
                          title: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Hostel Electricity Issue"
                      value={newComplaint.subject}
                      onChange={(e) =>
                        setNewComplaint({
                          ...newComplaint,
                          subject: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">
                      Description
                    </label>
                    <textarea
                      placeholder="Describe your issue in detail..."
                      value={newComplaint.description}
                      onChange={(e) =>
                        setNewComplaint({
                          ...newComplaint,
                          description: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 p-3 rounded-lg resize-none focus:ring-2 focus:ring-blue-400 outline-none transition"
                      rows={5}
                      required
                    />
                  </div>

                  <div className="flex justify-between gap-4 mt-6">
                    <button
                      type="button"
                      onClick={() =>
                        setNewComplaint({
                          title: "",
                          subject: "",
                          description: "",
                        })
                      }
                      className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition"
                    >
                      Clear
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
                    >
                      {loading ? "Submitting..." : "Submit Complaint"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {view === "profile" && (
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-lg mx-auto transition-all duration-300">
              <h2 className="text-2xl font-bold text-blue-700 mb-4">My Profile</h2>
              <div className="space-y-3 mb-5">
                <div>
                  <span className="text-sm text-gray-500 font-semibold pr-2">Full Name:</span>
                  <span>{profile.fullName}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-500 font-semibold pr-2">Email:</span>
                  <span>{profile.email}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-500 font-semibold pr-2">Reg No:</span>
                  <span>{profile.regNo}</span>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setEditProfileModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-md font-semibold hover:opacity-90 transition"
                >
                  <Edit className="inline w-5 h-5 mr-1" /> Edit Profile
                </button>
                <button
                  onClick={() => setChangePasswordModal(true)}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-md font-semibold hover:opacity-90 transition"
                >
                  <KeyRound className="inline w-5 h-5 mr-1" /> Change Password
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
