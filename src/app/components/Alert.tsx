import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react"

export const AlertText = ({
    title,
    description,
}: {
    title: string
    description: string
}) => {
    return (
        <Alert>
            <Terminal className="h-4 w-4" />
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>{description}</AlertDescription>
        </Alert>
    )
}