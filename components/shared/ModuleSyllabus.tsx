"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CourseModule, Lesson } from "@prisma/client";
import { ChevronDown, ChevronRight, PlayCircle, Lock } from "lucide-react";

interface ModuleSyllabusProps {
    modules: (CourseModule & {
        lessons: Lesson[];
    })[];
}

/**
 * ModuleSyllabus component
 * Displays course modules and lessons in an expandable accordion format
 */
export function ModuleSyllabus({ modules }: ModuleSyllabusProps) {
    const [expandedModules, setExpandedModules] = useState<Set<string>>(
        new Set([modules[0]?.id]) // Expand first module by default
    );

    const toggleModule = (moduleId: string) => {
        setExpandedModules((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(moduleId)) {
                newSet.delete(moduleId);
            } else {
                newSet.add(moduleId);
            }
            return newSet;
        });
    };

    if (modules.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                No syllabus available yet.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {modules.map((module) => {
                const isExpanded = expandedModules.has(module.id);
                const freeLessonsCount = module.lessons.filter((l) => l.isFree).length;

                return (
                    <Card key={module.id} className="overflow-hidden">
                        {/* Module Header */}
                        <CardHeader
                            className="cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => toggleModule(module.id)}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 flex-1">
                                    {/* Expand/Collapse Icon */}
                                    {isExpanded ? (
                                        <ChevronDown className="h-5 w-5 text-primary shrink-0" />
                                    ) : (
                                        <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                                    )}

                                    {/* Module Title */}
                                    <CardTitle className="text-lg">
                                        Module {module.order}: {module.title}
                                    </CardTitle>
                                </div>

                                {/* Lesson Count Badge */}
                                <Badge variant="outline" className="ml-4">
                                    {module.lessons.length} Lesson{module.lessons.length !== 1 ? "s" : ""}
                                </Badge>
                            </div>
                        </CardHeader>

                        {/* Module Content (Lessons) */}
                        {isExpanded && (
                            <CardContent className="pt-0">
                                <div className="space-y-2">
                                    {module.lessons.map((lesson) => (
                                        <LessonItem key={lesson.id} lesson={lesson} />
                                    ))}
                                </div>

                                {/* Free Lessons Info */}
                                {freeLessonsCount > 0 && (
                                    <div className="mt-4 pt-4 border-t text-sm text-muted-foreground">
                                        {freeLessonsCount} free preview lesson{freeLessonsCount !== 1 ? "s" : ""} available
                                    </div>
                                )}
                            </CardContent>
                        )}
                    </Card>
                );
            })}
        </div>
    );
}

/**
 * LessonItem component
 * Displays individual lesson information
 */
function LessonItem({ lesson }: { lesson: Lesson }) {
    return (
        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
            {/* Lesson Icon */}
            <div className="shrink-0">
                {lesson.isFree ? (
                    <PlayCircle className="h-5 w-5 text-green-600" />
                ) : (
                    <Lock className="h-5 w-5 text-muted-foreground" />
                )}
            </div>

            {/* Lesson Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">
                        {lesson.order}. {lesson.title}
                    </span>
                    {lesson.isFree && (
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                            Free
                        </Badge>
                    )}
                </div>
                {lesson.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                        {lesson.description}
                    </p>
                )}
            </div>
        </div>
    );
}
