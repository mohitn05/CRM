import { AdvancedSkeleton } from "@/components/advanced-skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function InternDashboardLoading() {
    return (
        <div className="p-6 space-y-6">
            {/* Header Skeleton */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <AdvancedSkeleton className="h-16 w-16 rounded-full" />
                    <div className="space-y-2">
                        <AdvancedSkeleton className="h-6 w-48" />
                        <AdvancedSkeleton className="h-4 w-32" />
                    </div>
                </div>
                <div className="flex gap-2">
                    <AdvancedSkeleton className="h-10 w-32" />
                </div>
            </div>

            {/* Stats Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card Skeleton */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="border-0 shadow-lg bg-white/50 backdrop-blur-sm">
                        <CardHeader>
                            <AdvancedSkeleton className="h-6 w-32" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <AdvancedSkeleton className="h-16 w-16 rounded-full" />
                                <div className="space-y-2">
                                    <AdvancedSkeleton className="h-4 w-32" />
                                    <AdvancedSkeleton className="h-3 w-24" />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <AdvancedSkeleton className="h-4 w-full" />
                                <AdvancedSkeleton className="h-4 w-full" />
                                <AdvancedSkeleton className="h-4 w-3/4" />
                            </div>
                            <div className="pt-4">
                                <AdvancedSkeleton className="h-10 w-full" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Status Card Skeleton */}
                    <Card className="border-0 shadow-lg bg-white/50 backdrop-blur-sm">
                        <CardHeader>
                            <AdvancedSkeleton className="h-6 w-24" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <AdvancedSkeleton className="h-4 w-24" />
                                    <AdvancedSkeleton className="h-4 w-16" />
                                </div>
                                <div className="flex justify-between">
                                    <AdvancedSkeleton className="h-4 w-24" />
                                    <AdvancedSkeleton className="h-4 w-16" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Skeleton */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Application Progress Skeleton */}
                    <Card className="border-0 shadow-lg bg-white/50 backdrop-blur-sm">
                        <CardHeader>
                            <AdvancedSkeleton className="h-6 w-40" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <AdvancedSkeleton className="h-4 w-32" />
                            <AdvancedSkeleton className="h-4 w-full" />
                            <AdvancedSkeleton className="h-4 w-5/6" />
                            <AdvancedSkeleton className="h-4 w-2/3" />
                        </CardContent>
                    </Card>

                    {/* Recent Activity Skeleton */}
                    <Card className="border-0 shadow-lg bg-white/50 backdrop-blur-sm">
                        <CardHeader>
                            <AdvancedSkeleton className="h-6 w-32" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg">
                                        <AdvancedSkeleton className="h-10 w-10 rounded-full" />
                                        <div className="flex-1 space-y-1">
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
            </div>
        </div>
    )
}