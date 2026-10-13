import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {Delete04FreeIcons, Plus, Save} from "@hugeicons/core-free-icons";
import {Button} from "@/components/ui/button.tsx";
import {HugeiconsIcon} from "@hugeicons/react";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
    InputGroupText,
    InputGroupTextarea,
} from "@/components/ui/input-group"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const items = [
        { label: "Low", value: "low" },
        { label: "Medium", value: "medium" },
        { label: "High", value: "high" },
    ]

function CreateTicketInputGroup() {
    return (
        <FieldGroup className="max-w-sm">
            <Field>
                <FieldLabel htmlFor="block-start-input">Input</FieldLabel>
                <InputGroup className="h-auto">
                    <InputGroupInput
                        id="block-start-input"
                        placeholder="Microsoft Windows Pro"
                    />
                    <InputGroupAddon align="block-start">
                        <InputGroupText>Ticket Title</InputGroupText>
                    </InputGroupAddon>
                </InputGroup>
                <FieldDescription>Leading info about the ticket.</FieldDescription>
            </Field>
            <Field>
                <FieldLabel htmlFor="block-start-textarea">Description</FieldLabel>
                <InputGroup>
                    <InputGroupTextarea
                        id="block-start-textarea"
                        placeholder="Explain you ticket here"
                        className="text-sm"
                    />
                </InputGroup>
                <FieldDescription>
                    Detailed breakdown of a submitted ticket.
                </FieldDescription>
            </Field>
            <Field>
                <FieldLabel htmlFor="block-start-select">Priority</FieldLabel>
                <Select items={items} id="block-start-select">
                    <SelectTrigger className="w-45">
                        <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {items.map((item) => (
                                <SelectItem key={item.value} value={item.value}>
                                    {item.label}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <FieldDescription>
                   How urgent is this ticket?
                </FieldDescription>
            </Field>
        </FieldGroup>
    )
}


export default function CreateTicketForm(){
    return (
        <Sheet>
            <SheetTrigger>
                <Button>
                    <HugeiconsIcon icon={Plus} />
                    Create
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Create Ticket</SheetTitle>
                    <SheetDescription>Ticketing for Dummies</SheetDescription>
                    <CreateTicketInputGroup />
                </SheetHeader>
                <SheetFooter >
                    <SheetClose className="flex items-center gap-2 justify-between">
                        <Button className="">
                            <HugeiconsIcon icon={Save} />
                            Save
                        </Button>
                        <Button variant="destructive">
                            <HugeiconsIcon icon={Delete04FreeIcons} />
                            Abandon Process
                        </Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>

        </Sheet>
    )
}