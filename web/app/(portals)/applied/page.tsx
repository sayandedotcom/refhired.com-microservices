"use client";

import * as React from "react";

import Link from "next/link";

import { fromNow } from "@refhiredcom/utils";
import { useQuery } from "@tanstack/react-query";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import parse from "html-react-parser";
import { CheckCheck, CheckCircle2, ChevronDown, Clock, File, Loader, XCircle } from "lucide-react";
import { useSession } from "next-auth/react";

import {
  Button,
  Checkbox,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@referrer/ui";

import { PortalsNotFound } from "@/components/custom-components";
import { DynamicIcons } from "@/components/icons/dynamic-icons";
import { Badge, TooltipDemo } from "@/components/ui";
import { DataTableColumnHeader } from "@/components/ui/data-table/components/data-table-column-header";
import { DataTablePagination } from "@/components/ui/data-table/components/data-table-pagination";

import { request } from "@/lib/axios";

import { cn } from "@/utils";

import { TAllApplied2, TApplied } from "@/types/posts";

const columns: ColumnDef<TApplied>[] = [
  // select
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  // sent
  {
    accessorKey: "sent",
    header: "Sent",
    cell: ({ row }) => <div>{fromNow(row.getValue("sent"))}</div>,
  },
  // status
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => (
      <Badge>
        {row.getValue("status") === "Pending" && <Clock className="mr-1 h-4" />}
        {row.getValue("status") === "Accepted" && <CheckCircle2 className="mr-1 h-4" />}
        {row.getValue("status") === "Rejected" && <XCircle className="mr-1 h-4" />}
        {row.getValue("status")}
      </Badge>
    ),
  },
  // post
  {
    accessorKey: "post",
    header: "Post",
    cell: ({ row }) => {
      return (
        <div
          className={cn(
            "bg-muted/40 transition-allbg-muted flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm"
          )}>
          <div className="flex w-full flex-col gap-1">
            <div className="flex items-center justify-between"></div>
            {/* <div className="text-xs font-medium">{item.subject}</div> */}
          </div>
          <div className={cn("text-muted-foreground font-heading line-clamp-3 text-sm")}>
            {parse(row.getValue("post") ?? "")}
          </div>
          {/* <div className="ml-auto flex items-center gap-4">
              <Link
                href={`/${session.user.userName}/posts/${item.id}`}
                className={cn("text-muted-foreground line-clamp-2 flex h-5 items-center gap-1")}>
                <ArrowUpRight id="options" className="h-full" />
              </Link>
              <div className={cn("text-muted-foreground line-clamp-2 flex h-5 items-center gap-1")}>
                <Star id="options" className="h-full" /> <p className="text-xs">{item.stars}</p>
              </div>
              <div className={cn("text-muted-foreground line-clamp-2 flex h-5 items-center gap-1")}>
                <User id="options" className="h-full" /> <p className="text-xs">{item.totalApplied}</p>
              </div>
              <div className={cn("text-muted-foreground line-clamp-2 flex h-5 items-center gap-1")}>
                <StopwatchIcon id="options" className="h-full" />{" "}
                <p className="text-xs">
                  {item.expiresAt
                    ? expired(item.expiresAt) && `Expired ${fromNow(item.expiresAt)}`
                    : "No Expiry"}
                </p>
              </div>
              <TooltipDemo text={`${item.totalApplied} / ${item.acceptLimit} Applied`}>
                <div
                  className={`flex items-center text-base ${
                    item.totalApplied === item.acceptLimit ? "text-red-600" : ""
                  } ${item.acceptLimit ? "" : "hidden"} `}>
                  <svg height="18" width="18" viewBox="0 0 20 20">
                    <circle r="10" cx="10" cy="10" fill="#a1a1aa" />
                    <circle
                      r="5"
                      cx="10"
                      cy="10"
                      fill="transparent"
                      stroke={item.totalApplied === item.acceptLimit ? "#cb2424" : "#ffff"}
                      strokeWidth="10"
                      strokeDasharray={`calc(${
                        item.acceptLimit ? Math.round((100 / item.acceptLimit) * item.totalApplied) : 0
                      } * 31.4 / 100) 31.4`}
                      transform="rotate(-90) translate(-20)"
                    />
                    <circle r="6" cx="10" cy="10" fill="black" />
                  </svg>
                </div>
              </TooltipDemo>
            </div> */}
        </div>
      );
    },
  },
  // message
  {
    accessorKey: "message",
    header: () => <div className="">Message</div>,
    cell: ({ row }) => {
      return <div className="font-heading line-clamp-3">{parse(row.getValue("message") ?? "")}</div>;
    },
  },
  // pdfs
  {
    accessorKey: "pdfs",
    header: () => <div className="">Pdfs</div>,
    cell: ({ row }) => {
      return (
        <div className=" font-medium">
          {/* @ts-ignore */}
          {row.getValue("pdfs")?.map((link, index) => {
            const platform = Object.keys(link)[0];
            const url = link[platform];
            return (
              <TooltipDemo key={index} text={platform}>
                <Link href={url} target="_blank">
                  <File />
                </Link>
              </TooltipDemo>
            );
          })}
        </div>
      );
    },
  },
  // links
  {
    accessorKey: "links",
    header: () => <div className="">Links</div>,
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-3 font-medium">
          {/* @ts-ignore */}
          {row.getValue("links")?.map((link, index) => {
            const platform = Object.keys(link)[0];
            const url = link[platform];
            return (
              <Link key={index} href={url} target="_blank">
                <TooltipDemo text={platform}>
                  <DynamicIcons iconName={platform} className="h-7 w-7" />
                </TooltipDemo>
              </Link>
            );
          })}
        </div>
      );
    },
  },
  // amount
  {
    accessorKey: "amount",
    header: () => <div className="">Amount</div>,
    cell: ({ row }) => {
      // Format the amount as a dollar amount
      // const formatted = new Intl.NumberFormat("en-US", {
      //   style: "currency",
      //   currency: "USD",
      // }).format(amount);

      return <div className="text-right font-medium">₹{row.getValue("amount")}</div>;
    },
  },
  // actions
  {
    accessorKey: "visibility",
    header: () => <div className="">Visibility</div>,
    cell: ({ row }) => {
      return (
        <div>
          {
            <CheckCheck
              className={cn("mx-auto", row.getValue("visibility") === "Read" && "text-[#77a1fc]")}
            />
          }{" "}
        </div>
      );
    },
  },
  // actions
  // {
  //   id: "actions",
  //   enableHiding: false,
  //   cell: ({ row }) => {
  //     const payment = row.original;
  //     return (
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button variant="ghost" className="h-8 w-8 p-0">
  //             <span className="sr-only">Open menu</span>
  //             <MoreHorizontal className="h-4 w-4" />
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align="end">
  //           <DropdownMenuLabel>Actions</DropdownMenuLabel>
  //           <DropdownMenuItem onClick={() => navigator.clipboard.writeText(payment.id)}>
  //             Copy payment ID
  //           </DropdownMenuItem>
  //           <DropdownMenuSeparator />
  //           <DropdownMenuItem>View customer</DropdownMenuItem>
  //           <DropdownMenuItem>View payment details</DropdownMenuItem>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     );
  //   },
  // },
];

const transformArray = (originalData: TAllApplied2[]) => {
  const transformedArray = [];

  originalData?.forEach((appliedInfo) => {
    const transformedObj = {
      id: appliedInfo.id,
      sent: appliedInfo.appliedAt,
      status: appliedInfo.status,
      post: appliedInfo.posts.description, // Truncate post description
      amount: appliedInfo.posts.stars * 10, // Calculate amount
      message: appliedInfo.applyInfo.message,
      pdfs: appliedInfo.applyInfo.pdfs,
      links: appliedInfo.applyInfo.links,
      postId: appliedInfo.posts.id,
      authorUsername: appliedInfo.posts.user.userName,
      visibility: appliedInfo.visibility,
    };
    transformedArray.push(transformedObj);
  });

  return transformedArray;
};

export default function Applied() {
  const { data: session } = useSession();

  {
    /* <TAllApplied> */
  }
  const { data, isLoading } = useQuery({
    queryKey: ["apply"],
    queryFn: () => {
      return request.get("/apply", {
        params: {
          userId: session.user.id,
        },
      });
    },
    select(data) {
      return transformArray(data.data.data);
    },
  });

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: data || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  if (!session) {
    return <PortalsNotFound text="Applies" />;
  }

  return (
    <div className="w-full px-4">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter post..."
          value={(table.getColumn("post")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("post")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}>
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {isLoading ? (
                    <Loader className="mx-auto my-auto h-8 w-8 animate-spin" />
                  ) : (
                    "You haven't applied anything !"
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* <div className="flex items-center justify-end space-x-2 py-4"> */}
      {/* <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length}{" "}
          row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}>
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div> */}
      {/* </div> */}
      <DataTablePagination table={table} />
    </div>
  );
}
