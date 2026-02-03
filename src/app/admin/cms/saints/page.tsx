"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";

interface Saint {
  id: number;
  name: string;
  dates_raw: string | null;
  birth_year: number | null;
  death_year: number | null;
  period: string | null;
  century: string | null;
  summary: string;
  tags: string[];
}

export default function SaintsListPage() {
  const router = useRouter();
  const [saints, setSaints] = useState<Saint[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [periodFilter, setPeriodFilter] = useState("");
  const [centuryFilter, setCenturyFilter] = useState("");
  const [periods, setPeriods] = useState<string[]>([]);
  const [centuries, setCenturies] = useState<string[]>([]);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("cms_token") || ""
      : "";

  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8001";

  useEffect(() => {
    loadSaints();
    loadFilters();
  }, [periodFilter, centuryFilter, searchTerm]);

  const loadSaints = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (periodFilter) params.period = periodFilter;
      if (centuryFilter) params.century = centuryFilter;
      if (searchTerm) params.search = searchTerm;

      const res = await axios.get(`${API_URL}/v1/sufi-saints`, {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache"
        }
      });

      setSaints(res.data?.data?.data || []);
    } catch (error) {
      console.error("Error loading saints:", error);
      alert("Failed to load saints");
    } finally {
      setLoading(false);
    }
  };

  const loadFilters = async () => {
    try {
      const [periodsRes, centuriesRes] = await Promise.all([
        axios.get(`${API_URL}/v1/sufi-saints/periods`),
        axios.get(`${API_URL}/v1/sufi-saints/centuries`)
      ]);

      setPeriods(periodsRes.data?.data?.periods || []);
      setCenturies(centuriesRes.data?.data?.centuries || []);
    } catch (error) {
      console.error("Error loading filters:", error);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      await axios.delete(`${API_URL}/v1/sufi-saints/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Saint deleted successfully");
      loadSaints();
    } catch (error) {
      console.error("Error deleting saint:", error);
      alert("Failed to delete saint");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Sufi Saints</h1>
          <div className="flex gap-4">
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Back to Dashboard
            </Link>
            <Link
              href="/saints/new"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              + Add New Saint
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or summary..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Period
              </label>
              <select
                value={periodFilter}
                onChange={(e) => setPeriodFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Periods</option>
                {periods.map((period) => (
                  <option key={period} value={period}>
                    {period}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Century
              </label>
              <select
                value={centuryFilter}
                onChange={(e) => setCenturyFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Centuries</option>
                {centuries.map((century) => (
                  <option key={century} value={century}>
                    {century}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Saints List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading saints...</p>
          </div>
        ) : saints.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600">No saints found</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Period
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Century
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tags
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {saints.map((saint) => (
                  <tr key={saint.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {saint.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {saint.dates_raw || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {saint.period || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {saint.century || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {saint.tags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                        {saint.tags.length > 3 && (
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                            +{saint.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/saints/${saint.id}`}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(saint.id, saint.name)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4 text-sm text-gray-600">
          Total: {saints.length} saint{saints.length !== 1 ? "s" : ""}
        </div>
      </div>
    </div>
  );
}

