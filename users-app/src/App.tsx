import React, { useEffect, useMemo, useState } from "react";
import { Button } from "./components/ui/Button";
import { Input } from "./components/ui/Input";
import { Modal } from "./components/Modal";

type Participant = {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  birthDate: string;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?\d{10,15}$/;

export default function App() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    birthDate: "",
  });

  const [errors, setErrors] = useState<any>({});
  const [participants, setParticipants] = useState<Participant[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("participants") || "[]");
    } catch {
      return [];
    }
  });

  const [winners, setWinners] = useState<Participant[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<{ field: string; dir: "asc" | "desc" }>({
    field: "fullName",
    dir: "asc",
  });

  const [editTarget, setEditTarget] = useState<Participant | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Participant | null>(null);

  useEffect(() => {
    localStorage.setItem("participants", JSON.stringify(participants));
  }, [participants]);

  const isNewWinnerDisabled = useMemo(() => {
    if (winners.length >= 3) return true;
    if (participants.length === 0) return true;
    return participants.every((p) => winners.some((w) => w.id === p.id));
  }, [participants, winners]);

  const validate = () => {
    const e: any = {};

    if (!form.fullName.trim()) e.fullName = "Введіть ім'я";
    if (!emailRegex.test(form.email)) e.email = "Невірний email";
    if (!phoneRegex.test(form.phone)) e.phone = "Невірний телефон";
    if (!form.birthDate) e.birthDate = "Виберіть дату";

    const duplicate = participants.some(
        (p) =>
            p.email.toLowerCase() === form.email.toLowerCase() &&
            (!editTarget || p.id !== editTarget.id)
    );
    if (duplicate) e.email = "Такий email вже існує";

    return e;
  };

  const addOrUpdateParticipant = () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    if (editTarget) {
      setParticipants((list) =>
          list.map((p) => (p.id === editTarget.id ? { ...p, ...form } : p))
      );
      setEditTarget(null);
    } else {
      setParticipants((prev) => [
        ...prev,
        { id: Date.now(), ...form },
      ]);
    }

    setForm({ fullName: "", email: "", phone: "", birthDate: "" });
    setErrors({});
  };

  const filtered = useMemo(() => {
    let list = [...participants];

    if (search.trim()) {
      const t = search.trim().toLowerCase();
      list = list.filter((p) => p.fullName.toLowerCase().includes(t));
    }

    list.sort((a, b) => {
      const fa = (a as any)[sort.field];
      const fb = (b as any)[sort.field];
      if (fa < fb) return sort.dir === "asc" ? -1 : 1;
      if (fa > fb) return sort.dir === "asc" ? 1 : -1;
      return 0;
    });

    return list;
  }, [participants, search, sort]);

  const newWinner = () => {
    if (isNewWinnerDisabled) return;
    const pool = participants.filter((p) => !winners.includes(p));
    const random = pool[Math.floor(Math.random() * pool.length)];
    setWinners((prev) => [...prev, random]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") addOrUpdateParticipant();
  };

  return (
      <div className="min-h-screen bg-slate-100 text-slate-900">
        <div className="max-w-7xl mx-auto py-12 px-6 space-y-10">
          <h1 className="text-4xl font-extrabold text-center tracking-tight text-slate-800">
            Лабораторна №7
          </h1>

          {/* ================= WINNERS ================= */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <section className="bg-white rounded-xl shadow-md p-6 flex flex-col border border-slate-200">
              <h2 className="text-xl font-semibold mb-4">Переможці</h2>

              {winners.length === 0 ? (
                  <p className="text-sm text-slate-500">Ще немає переможців.</p>
              ) : (
                  <ul className="space-y-2 mb-4">
                    {winners.map((w) => (
                        <li
                            key={w.id}
                            className="flex justify-between bg-emerald-50 border border-emerald-300 rounded px-3 py-1"
                        >
                          <span>{w.fullName}</span>
                          <button
                              onClick={() =>
                                  setWinners((prev) =>
                                      prev.filter((p) => p.id !== w.id)
                                  )
                              }
                              className="text-red-500 text-sm"
                          >
                            Видалити
                          </button>
                        </li>
                    ))}
                  </ul>
              )}

              <Button
                  onClick={newWinner}
                  disabled={isNewWinnerDisabled}
                  variant="primary"
                  className="font-semibold tracking-wide"
              >
                New winner
              </Button>
            </section>

            {/* ================= FORM ================= */}

            <section className="bg-white rounded-xl shadow p-4">
              <h2 className="text-xl font-semibold mb-4">
                {editTarget ? "Редагування" : "Реєстрація"}
              </h2>

              <div className="space-y-3">
                <Input
                    label="ПІБ"
                    value={form.fullName}
                    onChange={(v) => setForm({ ...form, fullName: v })}
                    error={errors.fullName}
                    onKeyDown={handleKeyDown}
                />
                <Input
                    label="Email"
                    value={form.email}
                    onChange={(v) => setForm({ ...form, email: v })}
                    error={errors.email}
                    onKeyDown={handleKeyDown}
                />
                <Input
                    label="Телефон"
                    value={form.phone}
                    onChange={(v) => setForm({ ...form, phone: v })}
                    error={errors.phone}
                    onKeyDown={handleKeyDown}
                />
                <Input
                    label="Дата народження"
                    type="date"
                    value={form.birthDate}
                    onChange={(v) => setForm({ ...form, birthDate: v })}
                    error={errors.birthDate}
                    onKeyDown={handleKeyDown}
                />

                <Button variant="primary" onClick={addOrUpdateParticipant}>
                  {editTarget ? "Оновити" : "Додати"}
                </Button>
              </div>
            </section>

            {/* ================= TABLE ================= */}

            <section className="bg-white rounded-xl shadow p-4 md:col-span-1">
              <h2 className="text-xl font-semibold mb-4">Список учасників</h2>

              <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Пошук за ім'ям..."
                  className="w-full rounded border px-3 py-2 text-sm mb-3"
              />

              <div className="max-h-64 overflow-auto border rounded">
                <table className="min-w-full text-sm border-collapse">
                  <thead className="bg-slate-100 text-slate-700 text-xs uppercase">
                  <tr>
                    <th>#</th>
                    <th>
                      <button
                          className="flex items-center gap-1 hover:text-blue-600 transition"
                          onClick={() => setSort({ field: "fullName", dir: sort.dir === "asc" ? "desc" : "asc" })}
                      >
                        ПІБ
                        <span>{sort.field === "fullName" ? (sort.dir === "asc" ? "▲" : "▼") : "↕"}</span>
                      </button>
                    </th>
                    <th>Email</th>
                    <th>
                      <button onClick={() => setSort({ field: "birthDate", dir: sort.dir === "asc" ? "desc" : "asc" })}>
                        Дата
                      </button>
                    </th>
                    <th>Ред.</th>
                    <th>Видал.</th>
                  </tr>
                  </thead>

                  <tbody>
                  {filtered.map((p, i) => (
                      <tr key={p.id} className={i % 2 ? "bg-slate-50" : ""}>
                        <td>{i + 1}</td>
                        <td>{p.fullName}</td>
                        <td>{p.email}</td>
                        <td>{p.birthDate}</td>
                        <td>
                          <button
                              className="text-blue-600"
                              onClick={() => {
                                setEditTarget(p);
                                setForm(p);
                              }}

                          >
                            ✏
                          </button>
                        </td>
                        <td>
                          <button
                              className="text-red-600"
                              onClick={() => setDeleteTarget(p)}
                          >
                            🗑
                          </button>
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>

        {/* DELETE MODAL */}
        <Modal
            isOpen={!!deleteTarget}
            title="Підтвердження"
            onClose={() => setDeleteTarget(null)}
        >
          {deleteTarget && (
              <div className="space-y-4">
                <p>
                  Видалити <b>{deleteTarget.fullName}</b>?
                </p>
                <Button
                    variant="danger"
                    onClick={() => {
                      setParticipants((p) => p.filter((x) => x.id !== deleteTarget.id));
                      setDeleteTarget(null);
                    }}
                >
                  Так, видалити
                </Button>
              </div>
          )}
        </Modal>
      </div>
  );
}
