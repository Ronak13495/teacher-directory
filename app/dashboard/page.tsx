"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import InstrumentPicker from "@/app/_components/InstrumentPicker";

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
     subjects: [] as string[],
    canTravel: false,
  });
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const { data } = await supabase
        .from("teacher")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (data) {
        setForm({
          name: data.name ?? "",
          email: data.email ?? "",
          phone: data.phone ?? "",
          subjects: data.subjects ?? [],
          canTravel: data.can_travel ?? false,
        });
      }
      setLoading(false);
    };
    load();
  }, []);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("teacher")
      .update({
        name: form.name,
        phone: form.phone,
        subjects: form.subjects,
        can_travel: form.canTravel,
      })
      .eq("user_id", user.id);

    if (error) {
      setMessage("Error saving: " + error.message);
    } else {
      // Update password if provided
      if (newPassword) {
        if (newPassword.length < 6) {
          setMessage("Password must be at least 6 characters");
          setSaving(false);
          return;
        }
        const { error: pwError } = await supabase.auth.updateUser({ password: newPassword });
        if (pwError) { setMessage("Profile saved but password error: " + pwError.message); setSaving(false); return; }
        setNewPassword("");
      }
      setMessage("Saved successfully!");
    }
    setSaving(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) return <div className="max-w-xl mx-auto py-10">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-gray-700 underline">
          Log out
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <input
          className="w-full p-3 border rounded"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="w-full p-3 border rounded bg-gray-50 text-gray-400 cursor-not-allowed"
          value={form.email}
          disabled
          title="Email cannot be changed"
        />
        <input
          className="w-full p-3 border rounded"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <InstrumentPicker
          selected={form.subjects}
          onChange={(updated) => setForm({ ...form, subjects: updated })}
        />

        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            className="sr-only"
            checked={form.canTravel}
            onChange={(e) => setForm({ ...form, canTravel: e.target.checked })}
          />
          <div className={`relative w-11 h-6 rounded-full transition-colors duration-200 ease-in-out ${form.canTravel ? "bg-blue-500" : "bg-gray-200"}`}>
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ease-in-out ${form.canTravel ? "translate-x-5" : "translate-x-0"}`} />
          </div>
          <span className="text-sm font-medium text-gray-700">Can travel to student</span>
        </label>

        <hr />
        <p className="text-sm font-medium text-gray-600">Change Password (leave blank to keep current)</p>
        <input
          className="w-full p-3 border rounded"
          placeholder="New password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        {message && (
          <p className={`text-sm ${message.startsWith("Error") ? "text-red-500" : "text-green-600"}`}>
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </form>
    </div>
  );
}