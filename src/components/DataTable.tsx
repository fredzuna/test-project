"use client";

import { Button, Link, TextField } from "@radix-ui/themes";
import { useDebounce } from "@uidotdev/usehooks";
import { useEffect, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "~/components/ui/table";
import useEscHandler from "~/hooks/useEscCallback";

const DataTable = () => {
    // states
    const [personTable, setPersonTable] = useState<Person[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [addedFields, setAddedFields] = useState<string[]>([])
    const [pageNumber, setPageNumber] = useState<number>(1)
    const debouncedSearchTerm = useDebounce(searchQuery, 300);


    // use-form states
    interface PersonTable {
        personList: Person[];
    }

    const {
        control,
        getValues,
        watch,
        register,
        formState: { isDirty },
    } = useForm<PersonTable>()

    // focus on search-bar when esc is pressed
    const searchInput = useRef<null | HTMLInputElement>(null);

    useEscHandler(() => {
        if (searchInput.current) {
            searchInput.current.focus()
            setSearchQuery("");
        }
    })

    const onSubmit = async () => {
        const data = getValues("personList");

        console.log(data);
        await fetch('/api/person/edit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
    }

    const { fields, append, replace } = useFieldArray({
        control, // control props comes from useForm (optional: if you are using FormProvider)
        name: "personList", // unique name for your Field Array
    });
    // handles fetching data on page load / search
    useEffect(() => {
        const getData = async () => {
            try {
                const response = await fetch(`/api/person/search?query=${searchQuery}&page=${pageNumber}`);
                const data = await response.json();

                replace(data.personTable);

                setPersonTable(data.personTable);

            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        getData();

    }, [pageNumber, debouncedSearchTerm]);

    const handleSearch = async (e?: React.FormEvent<HTMLFormElement>) => {
        // prevent reload
        if (e) e.preventDefault();

        // get data
        const response = await fetch(`/api/person/search?query=${searchQuery}&page=${pageNumber}`);
        const data = await response.json();

        replace(data.personTable);
        setPageNumber(1);
        setPersonTable(data.personTable);
    }

    const handleAdd = async () => {

        append({
            id: fields.length + 1,
            first_name: "",
            last_name: "",
            company: "",
            address: "",
            city: "",
            state: "",
            zip_phone: ""
        })

        console.log(fields);

        setAddedFields([...addedFields, fields[fields.length - 1]?.id as unknown as string])
    }

    console.log(watch("personList"));

    if (isLoading) {
        return <div className="min-h-[30vh] flex justify-center items-center">
            <p className="text-lg">Loading...</p>
        </div>;
    }

    return (
        <div className="grid justify-center py-8">
            <form onSubmit={handleSearch}>
                <div className="flex gap-3 py-6">
                    <TextField.Root ref={searchInput} className="w-full" placeholder="Search for people" value={searchQuery} onChange={(e) => {
                        setSearchQuery(e.target.value)
                    }} />
                    <Button type="submit" className="w-[10rem]">
                        Search
                    </Button>
                </div>
            </form>

            <Table className="w-[80vw]">
                <TableHeader>
                    <TableRow>
                        <TableHead>First Name</TableHead>
                        <TableHead>Last Name</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>City</TableHead>
                        <TableHead>State</TableHead>
                        <TableHead>ZIP Phone</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="">
                    {
                        personTable && personTable.length > 0 ? (
                            <>
                                {
                                    fields.map((field, index) => (
                                        <TableRow key={field.id}>
                                            <TableCell>
                                                <input
                                                    className="w-full h-full bg-transparent focus:outline-none"
                                                    key={field.id}
                                                    defaultValue={field.first_name}
                                                    {...register(`personList.${index}.first_name`)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <input
                                                    className="w-full h-full bg-transparent focus:outline-none"
                                                    key={field.id}
                                                    defaultValue={field.last_name}
                                                    {...register(`personList.${index}.last_name`)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <input
                                                    className="w-full h-full bg-transparent focus:outline-none"
                                                    key={field.id}
                                                    defaultValue={field.address}
                                                    {...register(`personList.${index}.address`)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <input
                                                    className="w-full h-full bg-transparent focus:outline-none"
                                                    key={field.id}
                                                    defaultValue={field.company}
                                                    {...register(`personList.${index}.company`)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <input
                                                    className="w-full h-full bg-transparent focus:outline-none"
                                                    key={field.id}
                                                    defaultValue={field.state}
                                                    {...register(`personList.${index}.state`)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <input
                                                    className="w-full h-full bg-transparent focus:outline-none"
                                                    key={field.id}
                                                    defaultValue={field.city}
                                                    {...register(`personList.${index}.city`)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <input
                                                    className="w-full h-full bg-transparent focus:outline-none"
                                                    key={field.id}
                                                    defaultValue={field.zip_phone}
                                                    {...register(`personList.${index}.zip_phone`)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Button onClick={() => {
                                                    fetch("/api/person/generate", {
                                                        method: "POST",
                                                        headers: {
                                                            "Content-Type": "application/json",
                                                        },
                                                        body: JSON.stringify(field),
                                                    })
                                                        .then((response) => response.blob())
                                                        .then((blob) => {
                                                            const url = window.URL.createObjectURL(blob);

                                                            const printWindow = window.open(url, "_blank");

                                                            if (printWindow) {
                                                                printWindow.onload = () => {
                                                                    printWindow.print();
                                                                    window.URL.revokeObjectURL(url);
                                                                };
                                                            } else {
                                                                console.error('Failed to open the print window');
                                                            }
                                                        })
                                                        .catch((error) => console.error("Error:", error));
                                                }} className="cursor-pointer">
                                                    Print
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                            </>
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7}>No data</TableCell>
                            </TableRow>
                        )
                    }
                </TableBody>
            </Table>
            <div className="flex gap-x-3 flex-end">
                <Button onClick={handleAdd}>
                    Add
                </Button>
                <Button onClick={onSubmit}>
                    Save Changes
                </Button>
            </div>
            {/* Previous / Next */}
            <div className="flex justify-center gap-3 py-4">
                <Button onClick={() => {
                    if (pageNumber >= 2) {
                        setPageNumber(pageNumber - 1)
                    }
                }} className="cursor-pointer w-[6rem]">
                    {'<'} Previous
                </Button>
                <Button onClick={() => {
                    setPageNumber(pageNumber + 1)
                    console.log(pageNumber);
                }} className="cursor-pointer w-[6rem]">
                    Next {'>'}
                </Button>
            </div>

        </div>

    );
};

export default DataTable;
