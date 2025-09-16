import { AdvancedSkeleton } from "@/components/advanced-skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function AdminDashboardLoading() {
    return (
        <div className="p-6 space-y-6">
            {/* Header Skeleton */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-2">
                    <AdvancedSkeleton className="h-8 w-48" />
                    <AdvancedSkeleton className="h-4 w-64" />
                </div>
                <div className="flex gap-2">
                    <AdvancedSkeleton className="h-10 w-32" />
                    <AdvancedSkeleton className="h-10 w-10 rounded-full" />
                </div>
            </div>

            {/* Stats Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <Card key={i} className="border-0 shadow-lg bg-white/50 backdrop-blur-sm">
                        <CardHeader className="pb-2">
                            <AdvancedSkeleton className="h-4 w-24" />
                        </CardHeader>
                        <CardContent>
                            <AdvancedSkeleton className="h-8 w-16 mb-2" />
                            <AdvancedSkeleton className="h-3 w-32" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts and Tables Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Chart Skeleton */}
                <Card className="border-0 shadow-lg bg-white/50 backdrop-blur-sm">
                    <CardHeader>
                        <AdvancedSkeleton className="h-6 w-32" />
                    </CardHeader>
                    <CardContent>
                        <div className="h-80 flex items-center justify-center">
                            <AdvancedSkeleton className="h-64 w-64 rounded-full" />
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity Skeleton */}
                <Card className="border-0 shadow-lg bg-white/50 backdrop-blur-sm">
                    <CardHeader>
                        <AdvancedSkeleton className="h-6 w-40" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <AdvancedSkeleton className="h-10 w-10 rounded-full" />
                                    <div className="flex-1 space-y-2">
                                        <AdvancedSkeleton className="h-4 w-3/4" />
                                        <AdvancedSkeleton className="h-3 w-1/2" />
                                    </div>
                                    <AdvancedSkeleton className="h-4 w-16" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Students Table Skeleton */}
            <Card className="border-0 shadow-lg bg-white/50 backdrop-blur-sm">
                <CardHeader>
                    <AdvancedSkeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="flex items-center gap-4 py-2">
                                <AdvancedSkeleton className="h-10 w-10 rounded-full" />
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <AdvancedSkeleton className="h-4" />
                                    <AdvancedSkeleton className="h-4" />
                                    <AdvancedSkeleton className="h-4" />
                                    <AdvancedSkeleton className="h-4 w-24" />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}