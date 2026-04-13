"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { generateUniqueId } from "@/lib/generateId";

type Bot = {
  id: string;
  name: string;
  active: boolean;
  contacts: number;
  created_at: string;
};

export default function BotsPage() {
  const [bots, setBots] = useState<Bot[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  useEffect(() => { fetchBots(); }, []);

  async function fetchBots() {
    setLoading(true);
    const { data, error } = await supabase
      .from("bots")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setBots(data ?? []);
    setLoading(false);
  }

  async function createBot() {
    setCreating(true);
    const bot: Bot = {
      id: generateUniqueId(),
      name: "New Bot",
      active: true,
      contacts: 0,
      created_at: new Date().toISOString(),
    };
    const { error } = await supabase.from("bots").insert([bot]);
    if (!error) {
      setBots((prev) => [bot, ...prev]);
      setEditingId(bot.id);
      setEditingName(bot.name);
    }
    setCreating(false);
  }

  async function toggleActive(id: string, value: boolean) {
    setBots((prev) => prev.map((b) => (b.id === id ? { ...b, active: value } : b)));
    await supabase.from("bots").update({ active: value }).eq("id", id);
  }

  async function saveEdit(id: string) {
    const name = editingName.trim();
    if (!name) return cancelEdit();
    setBots((prev) => prev.map((b) => (b.id === id ? { ...b, name } : b)));
    setEditingId(null);
    await supabase.from("bots").update({ name }).eq("id", id);
  }

  async function deleteBot(id: string) {
    setBots((prev) => prev.filter((b) => b.id !== id));
    await supabase.from("bots").delete().eq("id", id);
  }

  function startEdit(bot: Bot) {
    setEditingId(bot.id);
    setEditingName(bot.name);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditingName("");
  }

  const filtered = useMemo(
    () => bots.filter((b) => b.name.toLowerCase().includes(search.toLowerCase())),
    [bots, search]
  );

  const activeCount = bots.filter((b) => b.active).length;
  const totalContacts = bots.reduce((s, b) => s + (b.contacts ?? 0), 0);

  const stats = [
    { label: "Total Bots", value: bots.length },
    { label: "Active", value: activeCount },
    { label: "Inactive", value: bots.length - activeCount },
    { label: "Total Contacts", value: totalContacts },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Bot Accounts</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {bots.length} total &middot; {activeCount} active
            </p>
          </div>
          <button
            onClick={createBot}
            disabled={creating}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors w-fit"
          >
            {creating ? (
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <PlusIcon />
            )}
            Add Bot
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stats.map((s) => (
            <div key={s.label} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{s.label}</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Table card */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">

          {/* Search */}
          <div className="px-4 sm:px-6 py-4 border-b border-gray-100">
            <div className="relative w-full sm:w-64">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search bots..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
              />
            </div>
          </div>

          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="text-left px-6 py-3 font-medium">Name</th>
                  <th className="text-left px-6 py-3 font-medium">Toggle</th>
                  <th className="text-left px-6 py-3 font-medium">Status</th>
                  <th className="text-left px-6 py-3 font-medium">Contacts</th>
                  <th className="text-left px-6 py-3 font-medium">Created</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center">
                      <div className="flex justify-center items-center gap-2 text-gray-400 text-sm">
                        <span className="w-4 h-4 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
                        Loading bots...
                      </div>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-gray-400 text-sm">
                      {search ? `No bots matching "${search}"` : "No bots yet — click Add Bot to get started."}
                    </td>
                  </tr>
                ) : (
                  filtered.map((bot) => (
                    <tr key={bot.id} className="hover:bg-gray-50 transition-colors group">
                      {/* Name */}
                      <td className="px-6 py-4">
                        {editingId === bot.id ? (
                          <div className="flex items-center gap-2">
                            <input
                            title="edit"
                              autoFocus
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") saveEdit(bot.id);
                                if (e.key === "Escape") cancelEdit();
                              }}
                              className="border border-blue-400 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-36"
                            />
                            <button
                              onClick={() => saveEdit(bot.id)}
                              className="text-blue-600 hover:text-blue-700 text-xs font-medium"
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="text-gray-400 hover:text-gray-500 text-xs"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2.5">
                            <Avatar name={bot.name} />
                            <span className="font-medium text-gray-800">{bot.name}</span>
                          </div>
                        )}
                      </td>

                      {/* Toggle */}
                      <td className="px-6 py-4">
                        <Toggle active={bot.active} onChange={(v) => toggleActive(bot.id, v)} />
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <StatusBadge active={bot.active} />
                      </td>

                      {/* Contacts */}
                      <td className="px-6 py-4 text-gray-700">{bot.contacts}</td>

                      {/* Date */}
                      <td className="px-6 py-4 text-gray-400 text-xs">
                        {bot.created_at
                          ? new Date(bot.created_at).toLocaleDateString(undefined, {
                              month: "short", day: "numeric", year: "numeric",
                            })
                          : "—"}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => startEdit(bot)}
                            className="text-gray-400 hover:text-blue-600 transition-colors"
                            aria-label="Edit"
                          >
                            <EditIcon />
                          </button>
                          <button
                            onClick={() => deleteBot(bot.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                            aria-label="Delete"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile list */}
          <div className="sm:hidden divide-y divide-gray-100">
            {loading ? (
              <div className="py-16 flex justify-center items-center gap-2 text-gray-400 text-sm">
                <span className="w-4 h-4 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
                Loading...
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-16 text-center text-gray-400 text-sm px-6">
                {search ? `No bots matching "${search}"` : "No bots yet."}
              </div>
            ) : (
              filtered.map((bot) => (
                <div key={bot.id} className="flex items-start gap-3 px-4 py-4">
                  <Avatar name={bot.name} />
                  <div className="flex-1 min-w-0">
                    {editingId === bot.id ? (
                      <div className="flex items-center gap-2 mb-1">
                        <input
                          title="edit_name"
                          autoFocus
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveEdit(bot.id);
                            if (e.key === "Escape") cancelEdit();
                          }}
                          className="border border-blue-400 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
                        />
                        <button onClick={() => saveEdit(bot.id)} className="text-blue-600 text-xs font-medium">Save</button>
                      </div>
                    ) : (
                      <p className="font-medium text-gray-800 text-sm truncate">{bot.name}</p>
                    )}
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <StatusBadge active={bot.active} />
                      <span className="text-xs text-gray-400">{bot.contacts} contacts</span>
                      <span className="text-xs text-gray-400">
                        {bot.created_at
                          ? new Date(bot.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })
                          : ""}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3 flex-shrink-0">
                    <Toggle active={bot.active} onChange={(v) => toggleActive(bot.id, v)} />
                    <div className="flex gap-3">
                      <button onClick={() => startEdit(bot)} title="Edit" className="text-gray-400 hover:text-blue-600"><EditIcon /></button>
                      <button onClick={() => deleteBot(bot.id)} title="Delete" className="text-gray-400 hover:text-red-500"><TrashIcon /></button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────

function Avatar({ name }: { name: string }) {
  return (
    <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold flex items-center justify-center flex-shrink-0">
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

function Toggle({ active, onChange }: { active: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!active)}
      aria-label={active ? "Deactivate" : "Activate"}
      className={`relative w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 ${
        active ? "bg-blue-500" : "bg-gray-200"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
          active ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
        active ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-green-500" : "bg-gray-400"}`} />
      {active ? "Active" : "Inactive"}
    </span>
  );
}

function PlusIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={`w-4 h-4 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="11" cy="11" r="7" />
      <path strokeLinecap="round" d="M21 21l-4-4" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <polyline points="3 6 5 6 21 6" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" />
    </svg>
  );
}