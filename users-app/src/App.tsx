import React, { useMemo, useState } from "react";

type Participant = {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  birthDate: string; // yyyy-mm-dd
};

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  birthDate: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const initialFormState: FormState = {
  fullName: "",
  email: "",
  phone: "",
  birthDate: "",
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?\d{10,15}$/;

const App: React.FC = () => {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [winners, setWinners] = useState<Participant[]>([]);

  // ========= Допоміжні обчислення (computed) =========
  const isNewWinnerDisabled = useMemo(() => {
    if (winners.length >= 3) return true;
    if (participants.length === 0) return true;

    // немає доступних нових переможців (усі вже в winners)
    const available = participants.filter(
        (p) => !winners.some((w) => w.id === p.id)
    );
    return available.length === 0;
  }, [participants, winners]);

  // ========= Обробники форми =========
  const handleChange =
      (field: keyof FormState) =>
          (e: React.ChangeEvent<HTMLInputElement>) => {
            setForm((prev) => ({ ...prev, [field]: e.target.value }));
            // очищаємо помилку при зміні поля
            setErrors((prev) => ({ ...prev, [field]: undefined }));
          };

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!form.fullName.trim()) {
      newErrors.fullName = "Ім'я є обов'язковим";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email є обов'язковим";
    } else if (!emailRegex.test(form.email.trim())) {
      newErrors.email = "Невірний формат email";
    }

    if (!form.phone.trim()) {
      newErrors.phone = "Телефон є обов'язковим";
    } else if (!phoneRegex.test(form.phone.trim())) {
      newErrors.phone = "Невірний формат телефону";
    }

    if (!form.birthDate.trim()) {
      newErrors.birthDate = "Дата народження є обов'язковою";
    } else {
      const today = new Date();
      const inputDate = new Date(form.birthDate);
      // дата не повинна бути у майбутньому
      if (inputDate > today) {
        newErrors.birthDate = "Дата народження не може бути в майбутньому";
      }
    }

    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // додаємо нового учасника
    const newParticipant: Participant = {
      id: Date.now(),
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      birthDate: form.birthDate,
    };

    setParticipants((prev) => [...prev, newParticipant]);

    // очищаємо форму без повторної валідації
    setForm(initialFormState);
    setErrors({});
  };

  // ========= Лотерея: новий переможець =========
  const handleNewWinner = () => {
    // за умовчанням кнопка буде disabled, якщо не можна обрати переможця,
    // але тут теж перестрахуємося
    if (isNewWinnerDisabled) return;

    const available = participants.filter(
        (p) => !winners.some((w) => w.id === p.id)
    );
    if (available.length === 0) return;

    const randomIndex = Math.floor(Math.random() * available.length);
    const winner = available[randomIndex];

    setWinners((prev) => [...prev, winner]);
  };

  const handleRemoveWinner = (id: number) => {
    setWinners((prev) => prev.filter((w) => w.id !== id));
  };

  return (
      <div className="min-h-screen bg-slate-100 text-slate-900">
        <div className="max-w-5xl mx-auto py-10 px-4">
          <h1 className="text-3xl font-bold mb-8 text-center">
            Лотерея
          </h1>

          <div className="grid gap-6 md:grid-cols-3">
            {/* ====== Блок переможців ====== */}
            <section className="md:col-span-1 bg-white rounded-xl shadow p-4 flex flex-col">
              <h2 className="text-xl font-semibold mb-4">Переможці</h2>

              {winners.length === 0 ? (
                  <p className="text-sm text-slate-500 mb-4">
                    Ще немає переможців. Натисніть &laquo;New winner&raquo;.
                  </p>
              ) : (
                  <ul className="space-y-2 mb-4">
                    {winners.map((winner) => (
                        <li
                            key={winner.id}
                            className="flex items-center justify-between rounded border border-emerald-200 bg-emerald-50 px-3 py-2"
                        >
                          <div>
                            <p className="font-medium">{winner.fullName}</p>
                            <p className="text-xs text-slate-600">
                              {winner.email} • {winner.phone}
                            </p>
                          </div>
                          <button
                              type="button"
                              onClick={() => handleRemoveWinner(winner.id)}
                              className="text-xs px-2 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200 transition"
                          >
                            Видалити
                          </button>
                        </li>
                    ))}
                  </ul>
              )}

              <button
                  type="button"
                  onClick={handleNewWinner}
                  disabled={isNewWinnerDisabled}
                  className={`mt-auto w-full py-2 rounded font-semibold text-sm transition
                ${
                      isNewWinnerDisabled
                          ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                          : "bg-emerald-500 text-white hover:bg-emerald-600"
                  }`}
              >
                New winner
              </button>

              <p className="mt-2 text-xs text-slate-500">
                Максимум 3 переможці. Кнопка неактивна, якщо список учасників
                порожній або немає доступних нових переможців.
              </p>
            </section>

            {/* ====== Блок форми реєстрації ====== */}
            <section className="md:col-span-1 bg-white rounded-xl shadow p-4">
              <h2 className="text-xl font-semibold mb-4">
                Реєстрація нового учасника
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Ім'я */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    ПІБ<span className="text-red-500">*</span>
                  </label>
                  <input
                      type="text"
                      value={form.fullName}
                      onChange={handleChange("fullName")}
                      className={`w-full rounded border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-400 ${
                          errors.fullName ? "border-red-400" : "border-slate-300"
                      }`}
                      placeholder="Олексй Олексійович Олександрович"
                  />
                  {errors.fullName && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.fullName}
                      </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email<span className="text-red-500">*</span>
                  </label>
                  <input
                      type="email"
                      value={form.email}
                      onChange={handleChange("email")}
                      className={`w-full rounded border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-400 ${
                          errors.email ? "border-red-400" : "border-slate-300"
                      }`}
                      placeholder="example@gmail.com"
                  />
                  {errors.email && (
                      <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Телефон */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Телефон<span className="text-red-500">*</span>
                  </label>
                  <input
                      type="tel"
                      value={form.phone}
                      onChange={handleChange("phone")}
                      className={`w-full rounded border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-400 ${
                          errors.phone ? "border-red-400" : "border-slate-300"
                      }`}
                      placeholder="+380991112233"
                  />
                  {errors.phone && (
                      <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
                  )}
                  <p className="mt-1 text-[10px] text-slate-500">
                    Приклад: +380991112233 (валидация через RegExp)
                  </p>
                </div>

                {/* Дата народження */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Дата народження<span className="text-red-500">*</span>
                  </label>
                  <input
                      type="date"
                      value={form.birthDate}
                      onChange={handleChange("birthDate")}
                      className={`w-full rounded border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-400 ${
                          errors.birthDate ? "border-red-400" : "border-slate-300"
                      }`}
                  />
                  {errors.birthDate && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.birthDate}
                      </p>
                  )}
                  <p className="mt-1 text-[10px] text-slate-500">
                    Формат дати: yyyy-mm-dd. Дата не може бути в майбутньому.
                  </p>
                </div>

                <button
                    type="submit"
                    className="w-full py-2 rounded bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 transition"
                >
                  Save
                </button>
              </form>
            </section>

            {/* ====== Блок таблиці учасників ====== */}
            <section className="md:col-span-1 bg-white rounded-xl shadow p-4 overflow-hidden">
              <h2 className="text-xl font-semibold mb-4">Список учасників</h2>

              {participants.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    Список порожній. Додайте нового учасника через форму.
                  </p>
              ) : (
                  <div className="max-h-80 overflow-auto border rounded">
                    <table className="min-w-full text-sm">
                      <thead className="bg-slate-50 sticky top-0">
                      <tr>
                        <th className="px-3 py-2 text-left border-b text-xs font-semibold">
                          #
                        </th>
                        <th className="px-3 py-2 text-left border-b text-xs font-semibold">
                          ПІБ
                        </th>
                        <th className="px-3 py-2 text-left border-b text-xs font-semibold">
                          Email
                        </th>
                        <th className="px-3 py-2 text-left border-b text-xs font-semibold">
                          Телефон
                        </th>
                        <th className="px-3 py-2 text-left border-b text-xs font-semibold">
                          Дата&nbsp;нар.
                        </th>
                      </tr>
                      </thead>
                      <tbody>
                      {participants.map((p, index) => (
                          <tr
                              key={p.id}
                              className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}
                          >
                            <td className="px-3 py-2 border-b align-top">
                              {index + 1}
                            </td>
                            <td className="px-3 py-2 border-b align-top">
                              {p.fullName}
                            </td>
                            <td className="px-3 py-2 border-b align-top">
                              {p.email}
                            </td>
                            <td className="px-3 py-2 border-b align-top">
                              {p.phone}
                            </td>
                            <td className="px-3 py-2 border-b align-top">
                              {p.birthDate}
                            </td>
                          </tr>
                      ))}
                      </tbody>
                    </table>
                  </div>
              )}
            </section>
          </div>
        </div>
      </div>
  );
};

export default App;
