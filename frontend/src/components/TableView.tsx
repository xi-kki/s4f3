import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  SortingState,
} from '@tanstack/react-table'
import { ChevronUp, ChevronDown, Heart, Trash2 } from 'lucide-react'
import { useStore } from '../hooks/useBookmarks'
import type { Bookmark } from '../types'

const columnHelper = createColumnHelper<Bookmark>()

export function TableView() {
  const { bookmarks, removeBookmark, favBookmark } = useStore()
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  const columns = [
    columnHelper.accessor('title', {
      header: 'Title',
      cell: (info) => {
        const bookmark = info.row.original
        return (
          <div className="flex items-center gap-2 min-w-0">
            {bookmark.favicon_url && (
              <img src={bookmark.favicon_url} alt="" className="h-4 w-4 rounded" />
            )}
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline truncate block"
            >
              {bookmark.title || 'Untitled'}
            </a>
          </div>
        )
      },
    }),
    columnHelper.accessor('source', {
      header: 'Source',
      cell: (info) => (
        <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-300">
          {info.getValue() || 'Web'}
        </span>
      ),
    }),
    columnHelper.accessor('ai_tags', {
      header: 'AI Tags',
      cell: (info) => (
        <div className="flex flex-wrap gap-1">
          {(info.getValue() || []).slice(0, 3).map((tag: string) => (
            <span key={tag} className="rounded bg-blue-500/10 px-1.5 py-0.5 text-xs text-blue-400">
              {tag}
            </span>
          ))}
        </div>
      ),
    }),
    columnHelper.accessor('created_at', {
      header: 'Saved',
      cell: (info) => {
        const date = new Date(info.getValue())
        return <span className="text-zinc-400 text-sm">{formatDistanceToNow(date, { addSuffix: true })}</span>
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: '',
      cell: (info) => {
        const bookmark = info.row.original
        return (
          <div className="flex items-center gap-1">
            <button
              onClick={() => favBookmark(bookmark.id)}
              className="p-1 text-zinc-400 hover:text-red-400 transition-colors"
              title={bookmark.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`${bookmark.is_favorite ? 'fill-red-400 text-red-400' : ''}`} size={16} />
            </button>
            <button
              onClick={() => removeBookmark(bookmark.id)}
              className="p-1 text-zinc-400 hover:text-red-400 transition-colors"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )
      },
    }),
  ]

  const table = useReactTable({
    data: bookmarks,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className="overflow-x-auto rounded-xl border border-[#27272a] bg-[#18181b]">
      {/* Global Filter */}
      <div className="border-b border-[#27272a] p-4">
        <input
          type="text"
          placeholder="Filter table..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="w-full rounded-lg border border-[#27272a] bg-[#0a0a0b] px-4 py-2 text-sm text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none"
        />
      </div>

      <table className="w-full text-sm">
        <thead className="border-b border-[#27272a] bg-[#0a0a0b]">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="h-10 px-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider cursor-pointer select-none hover:text-white"
                  onClick={header.column.getToggleSortingHandler()}
                  style={{ userSelect: 'none' }}
                >
                  <div className="flex items-center gap-1">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {{
                      asc: <ChevronUp size={12} className="text-blue-400" />,
                      desc: <ChevronDown size={12} className="text-blue-400" />,
                    }[header.column.getIsSorted() as string]}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-[#27272a]">
          {table.getRowModel().rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-12 text-center text-zinc-500">
                No bookmarks found
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-[#27272a]/50 transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="border-t border-[#27272a] p-4 flex items-center justify-between">
        <div className="text-sm text-zinc-400">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="rounded-lg border border-[#27272a] bg-[#0a0a0b] px-3 py-1 text-sm text-zinc-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="rounded-lg border border-[#27272a] bg-[#0a0a0b] px-3 py-1 text-sm text-zinc-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}