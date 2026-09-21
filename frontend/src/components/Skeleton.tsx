export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 bg-[length:200%_100%] ${className}`} />
  )
}

export function BookmarkCardSkeleton({ layout = 'grid' }: { layout?: 'grid' | 'list' }) {
  if (layout === 'list') {
    return (
      <div className="flex items-center gap-4 rounded-xl border border-[#27272a] bg-[#18181b] p-4">
        <Skeleton className="h-16 w-16 rounded-lg" />
        <div className="flex-1 min-w-0 space-y-2">
          <Skeleton className="h-4 w-3/4 rounded" />
          <Skeleton className="h-3 w-1/2 rounded" />
          <div className="flex gap-1">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        </div>
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>
    )
  }

  return (
    <div className="group relative overflow-hidden rounded-xl border border-[#27272a] bg-[#18181b]">
      <Skeleton className="h-40 w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4 rounded" />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-2/3 rounded" />
        <div className="flex flex-wrap gap-1">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </div>
    </div>
  )
}

export function TableSkeleton() {
  return (
    <div className="overflow-x-auto rounded-xl border border-[#27272a] bg-[#18181b]">
      <div className="border-b border-[#27272a] p-4">
        <Skeleton className="h-8 w-1/3 rounded-lg" />
      </div>
      <table className="w-full text-sm">
        <thead className="border-b border-[#27272a] bg-[#0a0a0b]">
          <tr>
            <th className="h-10 px-4"><Skeleton className="h-4 w-20 rounded" /></th>
            <th className="h-10 px-4"><Skeleton className="h-4 w-16 rounded" /></th>
            <th className="h-10 px-4"><Skeleton className="h-4 w-24 rounded" /></th>
            <th className="h-10 px-4"><Skeleton className="h-4 w-16 rounded" /></th>
            <th className="h-10 px-4"><Skeleton className="h-4 w-12 rounded" /></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#27272a]">
          {[...Array(5)].map((_, i) => (
            <tr key={i} className="hover:bg-[#27272a]/50">
              <td className="px-4 py-3"><Skeleton className="h-4 w-40 rounded" /></td>
              <td className="px-4 py-3"><Skeleton className="h-4 w-16 rounded-full" /></td>
              <td className="px-4 py-3"><Skeleton className="h-4 w-32 rounded" /></td>
              <td className="px-4 py-3"><Skeleton className="h-4 w-20 rounded" /></td>
              <td className="px-4 py-3"><Skeleton className="h-4 w-12 rounded" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function KanbanSkeleton() {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 h-full">
      {[...Array(3)].map((_, col) => (
        <div key={col} className="min-h-[500px] w-80 flex-shrink-0">
          <div className="px-3 py-2">
            <Skeleton className="h-5 w-24 rounded" />
          </div>
          <div className="flex-1 flex flex-col gap-2 p-3 overflow-y-auto rounded-xl bg-[#0a0a0b] min-h-[400px]">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-xl border border-[#27272a] bg-[#18181b] p-3 space-y-2">
                <Skeleton className="h-5 w-3/4 rounded" />
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-1/2 rounded" />
                <div className="flex gap-1">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export function ListSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {[...Array(5)].map((_, i) => (
        <BookmarkCardSkeleton key={i} layout="list" />
      ))}
    </div>
  )
}

export function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[...Array(8)].map((_, i) => (
        <BookmarkCardSkeleton key={i} />
      ))}
    </div>
  )
}