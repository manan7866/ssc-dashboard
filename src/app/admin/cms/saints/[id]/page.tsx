"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";

interface SaintForm {
  name: string;
  datesRaw: string;
  birthYear: number | null;
  deathYear: number | null;
  period: string;
  century: string;
  summary: string;
  tags: string[];
  isPublished: boolean;
}

export default function SaintEditorPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const isNew = id === "new";

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const [form, setForm] = useState<SaintForm>({
    name: "",
    datesRaw: "",
    birthYear: null,
    deathYear: null,
    period: "",
    century: "",
    summary: "",
    tags: [],
    isPublished: true
  });

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("cms_token") || ""
      : "";

  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8001";

  useEffect(() => {
    if (!isNew) {
      loadSaint();
    }
  }, [id]);

  const loadSaint = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/v1/sufi-saints/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const saint = res.data.data;
      setForm({
        name: saint.name || "",
        datesRaw: saint.dates_raw || "",
        birthYear: saint.birth_year,
        deathYear: saint.death_year,
        period: saint.period || "",
        century: saint.century || "",
        summary: saint.summary || "",
        tags: saint.tags || [],
        isPublished: true
      });
    } catch (error) {
      console.error("Error loading saint:", error);
      alert("Failed to load saint");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      alert("Name is required");
      return;
    }
    if (!form.summary.trim()) {
      alert("Summary is required");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name,
        datesRaw: form.datesRaw || null,
        birthYear: form.birthYear,
        deathYear: form.deathYear,
        period: form.period || null,
        century: form.century || null,
        summary: form.summary,
        tags: form.tags,
        isPublished: form.isPublished
      };

      if (isNew) {
        await axios.post(`${API_URL}/v1/sufi-saints`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("Saint created successfully");
      } else {
        await axios.put(`${API_URL}/v1/sufi-saints/${id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("Saint updated successfully");
      }

      router.push("/saints");
    } catch (error: any) {
      console.error("Error saving saint:", error);
      alert(error.response?.data?.message || "Failed to save saint");
    } finally {
      setSaving(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm({ ...form, tags: [...form.tags, tagInput.trim()] });
      setTagInput("");
    }
  };

  const removeTag = (index: number) => {
    setForm({ ...form, tags: form.tags.filter((_, i) => i !== index) });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {isNew ? "Add New Saint" : "Edit Saint"}
          </h1>
          <Link
            href="/saints"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </Link>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Lal Ded"
            />
          </div>

          {/* Dates Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dates (Raw)
              </label>
              <input
                type="text"
                value={form.datesRaw}
                onChange={(e) => setForm({ ...form, datesRaw: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., c. 1320-1392"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Birth Year
              </label>
              <input
                type="number"
                value={form.birthYear || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    birthYear: e.target.value ? parseInt(e.target.value) : null
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 1320"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Death Year
              </label>
              <input
                type="number"
                value={form.deathYear || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    deathYear: e.target.value ? parseInt(e.target.value) : null
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 1392"
              />
            </div>
          </div>

          {/* Period and Century */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Period
              </label>
              <input
                type="text"
                value={form.period}
                onChange={(e) => setForm({ ...form, period: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., The Formative Period"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Century
              </label>
              <input
                type="text"
                value={form.century}
                onChange={(e) => setForm({ ...form, century: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 14th Century"
              />
            </div>
          </div>

          {/* Summary */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Summary <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter saint's biography and significance..."
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter tag and press Enter"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Tag
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full flex items-center gap-2"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="text-blue-600 hover:text-blue-800 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Published Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPublished"
              checked={form.isPublished}
              onChange={(e) =>
                setForm({ ...form, isPublished: e.target.checked })
              }
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="isPublished" className="ml-2 text-sm text-gray-700">
              Published (visible on frontend)
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : isNew ? "Create Saint" : "Update Saint"}
            </button>
            <Link
              href="/saints"
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-center"
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

