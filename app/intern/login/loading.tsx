import { AdvancedSkeleton } from "@/components/advanced-skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function InternLoginLoading() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
                    <CardHeader className="text-center space-y-2">
                        <div className="flex justify-center mb-4">
                            <AdvancedSkeleton className="h-16 w-16 rounded-2xl" />
                        </div>
                        <AdvancedSkeleton className="h-8 w-48 mx-auto" />
                        <AdvancedSkeleton className="h-4 w-64 mx-auto" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <AdvancedSkeleton className="h-4 w-24" />
                                <AdvancedSkeleton className="h-12" />
                            </div>
                            <div className="space-y-2">
                                <AdvancedSkeleton className="h-4 w-24" />
                                <AdvancedSkeleton className="h-12" />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <AdvancedSkeleton className="h-5 w-5 rounded" />
                                <AdvancedSkeleton className="h-4 w-24" />
                            </div>
                            <AdvancedSkeleton className="h-4 w-24" />
                        </div>

                        <AdvancedSkeleton className="h-12 w-full rounded-xl" />

                        <div className="text-center">
                            <AdvancedSkeleton className="h-4 w-48 mx-auto" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}