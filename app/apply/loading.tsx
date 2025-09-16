import { AdvancedSkeleton } from "@/components/advanced-skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function ApplicationFormLoading() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header Skeleton */}
                <div className="text-center mb-12">
                    <AdvancedSkeleton className="h-10 w-64 mx-auto mb-4" />
                    <AdvancedSkeleton className="h-6 w-96 mx-auto" />
                </div>

                <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                        <div className="space-y-2">
                            <AdvancedSkeleton className="h-8 w-48" />
                            <AdvancedSkeleton className="h-4 w-64" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {/* Personal Information Section */}
                            <div className="space-y-6">
                                <AdvancedSkeleton className="h-6 w-32" />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <AdvancedSkeleton className="h-4 w-24" />
                                        <AdvancedSkeleton className="h-12" />
                                    </div>
                                    <div className="space-y-2">
                                        <AdvancedSkeleton className="h-4 w-24" />
                                        <AdvancedSkeleton className="h-12" />
                                    </div>
                                    <div className="space-y-2">
                                        <AdvancedSkeleton className="h-4 w-24" />
                                        <AdvancedSkeleton className="h-12" />
                                    </div>
                                    <div className="space-y-2">
                                        <AdvancedSkeleton className="h-4 w-24" />
                                        <AdvancedSkeleton className="h-12" />
                                    </div>
                                </div>
                            </div>

                            {/* Academic Information Section */}
                            <div className="space-y-6">
                                <AdvancedSkeleton className="h-6 w-40" />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <AdvancedSkeleton className="h-4 w-24" />
                                        <AdvancedSkeleton className="h-12" />
                                    </div>
                                    <div className="space-y-2">
                                        <AdvancedSkeleton className="h-4 w-24" />
                                        <AdvancedSkeleton className="h-12" />
                                    </div>
                                    <div className="space-y-2">
                                        <AdvancedSkeleton className="h-4 w-24" />
                                        <AdvancedSkeleton className="h-12" />
                                    </div>
                                    <div className="space-y-2">
                                        <AdvancedSkeleton className="h-4 w-24" />
                                        <AdvancedSkeleton className="h-12" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <AdvancedSkeleton className="h-4 w-24" />
                                    <AdvancedSkeleton className="h-24" />
                                </div>
                            </div>

                            {/* Documents Section */}
                            <div className="space-y-6">
                                <AdvancedSkeleton className="h-6 w-32" />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <AdvancedSkeleton className="h-4 w-24" />
                                        <AdvancedSkeleton className="h-12" />
                                    </div>
                                    <div className="space-y-2">
                                        <AdvancedSkeleton className="h-4 w-24" />
                                        <AdvancedSkeleton className="h-12" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <AdvancedSkeleton className="h-4 w-24" />
                                    <AdvancedSkeleton className="h-32" />
                                </div>
                            </div>

                            {/* Preferences Section */}
                            <div className="space-y-6">
                                <AdvancedSkeleton className="h-6 w-32" />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <AdvancedSkeleton className="h-4 w-24" />
                                        <AdvancedSkeleton className="h-12" />
                                    </div>
                                    <div className="space-y-2">
                                        <AdvancedSkeleton className="h-4 w-24" />
                                        <AdvancedSkeleton className="h-12" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <AdvancedSkeleton className="h-4 w-24" />
                                    <AdvancedSkeleton className="h-24" />
                                </div>
                            </div>

                            {/* Terms and Conditions */}
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <AdvancedSkeleton className="h-5 w-5 rounded mt-1" />
                                    <div className="space-y-2">
                                        <AdvancedSkeleton className="h-4 w-full" />
                                        <AdvancedSkeleton className="h-4 w-5/6" />
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-6">
                                <AdvancedSkeleton className="h-12 w-full rounded-xl" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}