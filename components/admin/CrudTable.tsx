"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Search, Edit2, Trash2, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface CrudTableProps<T extends { [key: string]: any }> {
  title: string;
  subtitle?: string;
  data: T[];
  columns: Column<T>[];
  total: number;
  page: number;
  limit: number;
  loading: boolean;
  onSearch: (q: string) => void;
  onPageChange: (p: number) => void;
  onAdd: () => void;
  onEdit: (row: T) => void;
  onDelete: (id: string) => Promise<void>;
  idKey?: string;
  addLabel?: string;
  searchPlaceholder?: string;
  extraActions?: (row: T) => React.ReactNode;
}

export function CrudTable<T extends { [key: string]: any }>({
  title, subtitle, data, columns, total, page, limit, loading,
  onSearch, onPageChange, onAdd, onEdit, onDelete, idKey = "id",
  addLabel = "Add New", searchPlaceholder = "Search...", extraActions,
}: CrudTableProps<T>) {
  const [searchVal, setSearchVal] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const totalPages = Math.ceil(total / limit);

  const handleSearch = useCallback((v: string) => {
    setSearchVal(v);
    onSearch(v);
  }, [onSearch]);

  const confirmDelete = async () => {
    if (!deletingId) return;
    setDeleteLoading(true);
    try {
      await onDelete(deletingId);
      toast.success("Deleted successfully");
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeleteLoading(false);
      setDeletingId(null);
    }
  };

  return (
    <>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
            {subtitle && <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
          <Button onClick={onAdd} className="gap-2 bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/30">
            <Plus className="w-4 h-4" /> {addLabel}
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder={searchPlaceholder}
            value={searchVal}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>

        {/* Table */}
        <Card className="border-gray-200 dark:border-slate-800">
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
              </div>
            ) : data.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-sm text-gray-500 dark:text-slate-400">No records found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-slate-800">
                      {columns.map((col) => (
                        <th key={String(col.key)} className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider ${col.className ?? ""}`}>
                          {col.label}
                        </th>
                      ))}
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                    {data.map((row, i) => (
                      <tr key={row[idKey] ?? i} className="hover:bg-gray-50 dark:hover:bg-slate-800/40 transition-colors">
                        {columns.map((col) => (
                          <td key={String(col.key)} className={`px-4 py-3 ${col.className ?? ""}`}>
                            {col.render ? col.render(row) : String(row[col.key as string] ?? "—")}
                          </td>
                        ))}
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1.5">
                            {extraActions?.(row)}
                            <Button size="sm" variant="ghost" onClick={() => onEdit(row)} className="h-7 w-7 p-0 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                              <Edit2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setDeletingId(row[idKey])} className="h-7 w-7 p-0 hover:bg-red-50 dark:hover:bg-red-900/20">
                              <Trash2 className="w-3.5 h-3.5 text-red-500" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-slate-400">
            <span>{total} total records</span>
            <div className="flex items-center gap-1.5">
              <Button variant="outline" size="sm" className="h-7 w-7 p-0" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
                <ChevronLeft className="w-3.5 h-3.5" />
              </Button>
              <span className="text-xs font-medium px-2">Page {page} of {totalPages}</span>
              <Button variant="outline" size="sm" className="h-7 w-7 p-0" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Delete confirm */}
      <AlertDialog open={!!deletingId} onOpenChange={(o) => !o && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this record?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={deleteLoading} className="bg-red-600 hover:bg-red-700">
              {deleteLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// ── Status badge helper ────────────────────────────────────────────────────────
export function StatusBadge({ active, trueLabel = "Active", falseLabel = "Inactive" }: { active: boolean; trueLabel?: string; falseLabel?: string }) {
  return (
    <Badge className={active
      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-[10px]"
      : "bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-400 text-[10px]"
    }>
      {active ? trueLabel : falseLabel}
    </Badge>
  );
}
