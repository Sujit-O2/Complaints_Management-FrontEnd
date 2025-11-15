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
  User,
  Trash2,
} from "lucide-react";

// Interfaces
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

interface UserProfile {
  fullName: string;
  email: string;
  regNo: string;
}

interface AdminProfile {
  fullName: string;
  email: string;
  regNo: string;
}

// Loader Overlay
function LoaderOverlay({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/20 backdrop-blur-0 transition-opacity duration-300 animate-fadeIn">
      <div className="flex flex-col items-center">
        <div className="loader mb-4" />
        <span className="text-xl font-semibold text-green-700 animate-pulse">
          Loading...
        </span>
      </div>
      <style>{`
        .loader {
          border: 5px solid #e0e7ef;
          border-top: 5px solid #22c55e;
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

// Overlay Message
function OverlayMessage({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <>
      <div className="fixed inset-0 bg-white/60 backdrop-blur-[4px] z-40"></div>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <span className="text-3xl font-bold text-green-700 bg-white/90 rounded-2xl px-10 py-8 shadow-2xl animate-fadeIn">
          {message}
        </span>
      </div>
    </>
  );
}

// Modal
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
          <h2 className="text-2xl font-semibold text-green-700 mb-4">{title}</h2>
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

const AdminDashboard: React.FC = () => {
  // Data states
  const [stats, setStats] = useState<Stats>({
    total: 0,
    pending: 0,
    in_progress: 0,
    resolved: 0,
    rejected: 0,
  });
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [profile, setProfile] = useState<AdminProfile>({
    fullName: "",
    email: "",
    regNo: "",
  });

  const [view, setView] =
    useState<"dashboard" | "complaints" | "users" | "profile" | "changePassword">(
      "dashboard"
    );

  // Modal states
  const [editProfileModal, setEditProfileModal] = useState(false);
  const [tempProfile, setTempProfile] = useState<AdminProfile>(profile);

  const [changePasswordModal, setChangePasswordModal] = useState(false);
  const [passwordFields, setPasswordFields] = useState({
    currentPassword: "",
    newPassword: "",
    confirm: "",
  });

  // Complaint editing
  const [editComplaintModal, setEditComplaintModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(
    null
  );
  const [complaintUpdate, setComplaintUpdate] = useState<{
    status: string;
    response: string;
  }>({
    status: "",
    response: "",
  });

  // Loader and overlay
  const [isLoadingOverlay, setIsLoadingOverlay] = useState(false);
  const [overlayMessage, setOverlayMessage] = useState<string | null>(null);

  // Filter for complaints by status
  const [
    complaintStatusFilter,
    setComplaintStatusFilter,
  ] = useState<
    "All" | "Pending" | "In Progress" | "Resolved" | "Rejected"
  >("All");

  useEffect(() => {
    fetchStats();
    fetchComplaints();
    fetchUsers();
    fetchProfile();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("http://localhost:8080/admin/stats", {
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
      const res = await fetch("http://localhost:8080/admin/complaints", {
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

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:8080/admin/users", {
        credentials: "include",
      });
      if (res.ok) {
        const data: UserProfile[] = await res.json();
        setUsers(data);
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
        const data: AdminProfile = await res.json();
        setProfile(data);
        setTempProfile(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleComplaintEdit = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setComplaintUpdate({
      status: complaint.status,
      response: complaint.response || "",
    });
    setEditComplaintModal(true);
  };

  const handleUpdateComplaint = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedComplaint) return;

    setOverlayMessage("Updating complaint...");

    try {
      const res = await fetch("http://localhost:8080/admin/complaints/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          id: selectedComplaint.id, // REQUIRED BY BACKEND
          status: complaintUpdate.status,
          response: complaintUpdate.response,
        }),
      });

      if (res.ok) {
        setOverlayMessage("Complaint updated successfully!");

        setTimeout(() => {
          setOverlayMessage(null);
          setEditComplaintModal(false);
          fetchComplaints();
          fetchStats();
        }, 1700);
      } else {
        alert("Failed to update complaint.");
        setOverlayMessage(null);
      }
    } catch (err) {
      console.error(err);
      setOverlayMessage(null);
    }
  };

  // Delete user
  const handleDeleteUser = async (regNo: string) => {
    if (!window.confirm("Delete this user?")) return;
    setOverlayMessage("Deleting user...");
    try {
      const res = await fetch(`http://localhost:8080/admin/users/${regNo}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setOverlayMessage("User deleted.");
        setTimeout(() => {
          setOverlayMessage(null);
          fetchUsers();
        }, 1200);
      } else {
        alert("Failed to delete user.");
        setOverlayMessage(null);
      }
    } catch (err) {
      console.error(err);
      setOverlayMessage(null);
    }
  };

  // Update profile
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
        setOverlayMessage("Profile updated!");
        setTimeout(() => {
          setOverlayMessage(null);
          setProfile(tempProfile);
          setEditProfileModal(false);
        }, 1600);
      } else {
        alert("Failed to update profile.");
        setOverlayMessage(null);
      }
    } catch (err) {
      console.error(err);
      setOverlayMessage(null);
    }
  };

  // Change password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setOverlayMessage("Changing password...");
    if (
      !passwordFields.newPassword ||
      passwordFields.newPassword !== passwordFields.confirm
    ) {
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

  // Sidebar cards green
  const statCards = [
    { title: "Total Complaints", value: stats.total, icon: FileText, color: "text-green-600" },
    { title: "Pending", value: stats.pending, icon: Clock, color: "text-amber-500" },
    { title: "In Progress", value: stats.in_progress, icon: Clock, color: "text-yellow-500" },
    { title: "Resolved", value: stats.resolved, icon: CheckCircle, color: "text-green-500" },
    { title: "Rejected", value: stats.rejected, icon: XCircle, color: "text-red-500" },
  ];

  // View switch with loader overlay (no blur)
  const handleViewChange = (v: typeof view) => {
    setIsLoadingOverlay(true);
    setTimeout(() => {
      setView(v);
      setIsLoadingOverlay(false);
    }, 700);
  };

  return (
    <div className="relative min-h-screen flex bg-gray-50">
      <LoaderOverlay show={isLoadingOverlay} />
      <OverlayMessage message={!isLoadingOverlay && overlayMessage ? overlayMessage : null} />

      {/* Complaint Edit Modal */}
      <Modal open={editComplaintModal} onClose={() => setEditComplaintModal(false)} title="Update Complaint">
        {selectedComplaint && (
          <form onSubmit={handleUpdateComplaint} className="space-y-4">
            <div>
              <label className="block font-medium mb-1">Status</label>
              <select
                value={complaintUpdate.status}
                onChange={(e) => setComplaintUpdate({ ...complaintUpdate, status: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-3 outline-none"
                required
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block font-medium mb-1">Response</label>
              <textarea
                value={complaintUpdate.response}
                onChange={(e) => setComplaintUpdate({ ...complaintUpdate, response: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-3 resize-none outline-none"
                rows={3}
                required
              />
            </div>
            <div className="flex justify-end gap-4 pt-2">
              <button
                type="button"
                className="bg-gray-200 px-6 py-2 rounded-md font-medium hover:bg-gray-300"
                onClick={() => setEditComplaintModal(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-md font-semibold hover:opacity-90"
              >
                <Save className="inline-block w-5 h-5 mr-1" /> Save
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Edit Profile Modal */}
      <Modal open={editProfileModal} onClose={() => setEditProfileModal(false)} title="Edit Profile">
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Full Name</label>
            <input
              type="text"
              value={tempProfile.fullName}
              onChange={(e) => setTempProfile({ ...tempProfile, fullName: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-3 outline-none"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Email</label>
            <input
              type="email"
              value={tempProfile.email}
              onChange={(e) => setTempProfile({ ...tempProfile, email: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-3 outline-none"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Username</label>
            <input
              type="text"
              value={tempProfile.regNo}
              onChange={(e) => setTempProfile({ ...tempProfile, regNo: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-3 outline-none"
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
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-md font-semibold hover:opacity-90"
            >
              <Save className="inline-block w-5 h-5 mr-1" /> Save
            </button>
          </div>
        </form>
      </Modal>

      {/* Change Password Modal */}
      <Modal open={changePasswordModal} onClose={() => setChangePasswordModal(false)} title="Change Password">
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Current Password</label>
            <input
              type="password"
              value={passwordFields.currentPassword}
              onChange={(e) =>
                setPasswordFields({ ...passwordFields, currentPassword: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg p-3 outline-none"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">New Password</label>
            <input
              type="password"
              value={passwordFields.newPassword}
              onChange={(e) => setPasswordFields({ ...passwordFields, newPassword: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-3 outline-none"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Confirm New Password</label>
            <input
              type="password"
              value={passwordFields.confirm}
              onChange={(e) => setPasswordFields({ ...passwordFields, confirm: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-3 outline-none"
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
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-md font-semibold hover:opacity-90"
            >
              <KeyRound className="inline-block w-5 h-5 mr-1" /> Change
            </button>
          </div>
        </form>
      </Modal>

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-5 flex flex-col z-10">
        <h1 className="text-xl font-bold text-green-700 mb-8">Admin Dashboard</h1>
        <nav className="flex flex-col gap-3">
          {[
            { label: "Dashboard", key: "dashboard", icon: FileText },
            { label: "Complaints", key: "complaints", icon: CheckCircle },
            { label: "Users", key: "users", icon: User },
            { label: "Profile", key: "profile", icon: Edit },
          ].map((v) => (
            <button
              key={v.key}
              onClick={() => handleViewChange(v.key as typeof view)}
              className={`flex items-center gap-2 text-left px-4 py-2 rounded-lg font-medium transition ${
                view === v.key ? "bg-green-600 text-white shadow" : "hover:bg-green-50 hover:text-green-700"
              }`}
            >
              <v.icon className="w-5 h-5" />
              {v.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="bg-white shadow flex items-center justify-between px-8 py-4 z-10">
          <h2 className="text-lg font-semibold text-green-700">Campus Admin Panel</h2>
          <div className="flex items-center gap-4">
            <span className="font-medium text-gray-700">{profile.fullName || "Admin"}</span>
            <button
              onClick={() => {
                if (!window.confirm("Are you sure you want to logout?")) return;
                fetch("http://localhost:8080/user/logout", { credentials: "include" });
                window.location.href = "/";
              }}
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
          {/* Dashboard */}
          {view === "dashboard" && (
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome, {profile.fullName || "Admin"}!</h1>
              <p className="text-gray-500 mb-6">Overview of your system stats.</p>
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
            </div>
          )}

          {/* Complaints Table */}
          {view === "complaints" && (
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-2xl font-semibold mb-4 text-green-700">All Complaints</h2>
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
                        className="border border-gray-200 rounded-lg p-4 hover:bg-green-50 transition"
                      >
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-semibold">{c.title}</h3>
                          <span
                            className={`text-sm px-3 py-1 rounded-full ${
                              c.status === "Pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : c.status === "Resolved"
                                ? "bg-green-100 text-green-700"
                                : c.status === "Rejected"
                                ? "bg-red-100 text-red-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {c.status}
                          </span>
                          <button
                            className="p-2 text-green-700 hover:text-green-900"
                            onClick={() => handleComplaintEdit(c)}
                            title="Edit"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                        </div>
                        <p className="text-gray-600">
                          <strong>Response:</strong>{" "}
                          {c.response && c.response.trim() ? c.response : "N/A"}
                        </p>
                        <p className="text-gray-600">
                          <strong>Subject:</strong> {c.subject}
                        </p>
                        <p className="text-gray-500 text-sm mt-2">{c.description}</p>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* Users Table */}
          {view === "users" && (
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-2xl font-semibold mb-4 text-green-700">All Users</h2>
              {users.length === 0 ? (
                <p className="text-gray-500">No users found.</p>
              ) : (
                <table className="w-full border border-gray-300 rounded-lg overflow-hidden shadow">
                  <thead>
                    <tr className="bg-green-100 text-green-700">
                      <th className="py-2 px-4 text-left">Full Name</th>
                      <th className="py-2 px-4 text-left">Email</th>
                      <th className="py-2 px-4 text-left">Reg No</th>
                      <th className="py-2 px-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.regNo} className="border-t">
                        <td className="py-2 px-4">{u.fullName}</td>
                        <td className="py-2 px-4">{u.email}</td>
                        <td className="py-2 px-4">{u.regNo}</td>
                        <td className="py-2 px-4">
                          <button
                            className="text-red-600 hover:text-red-800 p-2"
                            onClick={() => handleDeleteUser(u.regNo)}
                            title="Delete User"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Profile */}
          {view === "profile" && (
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-lg mx-auto transition-all duration-300">
              <h2 className="text-2xl font-bold text-green-700 mb-4">My Profile</h2>
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
                  <span className="text-sm text-gray-500 font-semibold pr-2">Username:</span>
                  <span>{profile.regNo}</span>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setEditProfileModal(true)}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-md font-semibold hover:opacity-90 transition"
                >
                  <Edit className="inline w-5 h-5 mr-1" /> Edit Profile
                </button>
                <button
                  onClick={() => setChangePasswordModal(true)}
                  className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-6 py-2 rounded-md font-semibold hover:opacity-90 transition"
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

export default AdminDashboard;
