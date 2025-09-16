import { AdvancedSkeleton } from "@/components/advanced-skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="p-6 space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <AdvancedSkeleton className="h-8 w-48" />
          <AdvancedSkeleton className="h-4 w-64" />
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <AdvancedSkeleton className="h-10 w-48" />
          <AdvancedSkeleton className="h-10 w-32" />
        </div>
      </div>

      {/* Filters Skeleton */}
      <Card className="border-0 shadow-lg bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <AdvancedSkeleton className="h-6 w-24" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <AdvancedSkeleton className="h-10" />
            <AdvancedSkeleton className="h-10" />
            <AdvancedSkeleton className="h-10" />
          </div>
        </CardContent>
      </Card>

      {/* Students Table Skeleton */}
      <Card className="border-0 shadow-lg bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <AdvancedSkeleton className="h-6 w-32" />
            <div className="flex gap-2">
              <AdvancedSkeleton className="h-10 w-24" />
              <AdvancedSkeleton className="h-10 w-24" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="pb-4 text-left">
                    <AdvancedSkeleton className="h-4 w-24" />
                  </th>
                  <th className="pb-4 text-left">
                    <AdvancedSkeleton className="h-4 w-24" />
                  </th>
                  <th className="pb-4 text-left">
                    <AdvancedSkeleton className="h-4 w-24" />
                  </th>
                  <th className="pb-4 text-left">
                    <AdvancedSkeleton className="h-4 w-24" />
                  </th>
                  <th className="pb-4 text-left">
                    <AdvancedSkeleton className="h-4 w-24" />
                  </th>
                  <th className="pb-4 text-left">
                    <AdvancedSkeleton className="h-4 w-24" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {[...Array(10)].map((_, i) => (
                  <tr key={i} className="border-t border-gray-200">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <AdvancedSkeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2">
                          <AdvancedSkeleton className="h-4 w-32" />
                          <AdvancedSkeleton className="h-3 w-24" />
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <AdvancedSkeleton className="h-4 w-24" />
                    </td>
                    <td className="py-4">
                      <AdvancedSkeleton className="h-4 w-24" />
                    </td>
                    <td className="py-4">
                      <AdvancedSkeleton className="h-4 w-24" />
                    </td>
                    <td className="py-4">
                      <AdvancedSkeleton className="h-6 w-20 rounded-full" />
                    </td>
                    <td className="py-4">
                      <div className="flex gap-2">
                        <AdvancedSkeleton className="h-8 w-8 rounded" />
                        <AdvancedSkeleton className="h-8 w-8 rounded" />
                        <AdvancedSkeleton className="h-8 w-8 rounded" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Skeleton */}
          <div className="flex items-center justify-between mt-6">
            <AdvancedSkeleton className="h-4 w-32" />
            <div className="flex gap-2">
              <AdvancedSkeleton className="h-10 w-10 rounded" />
              <AdvancedSkeleton className="h-10 w-10 rounded" />
              <AdvancedSkeleton className="h-10 w-10 rounded" />
              <AdvancedSkeleton className="h-10 w-10 rounded" />
            </div>
            <AdvancedSkeleton className="h-4 w-32" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}