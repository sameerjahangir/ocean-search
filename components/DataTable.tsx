"use client";

import { useState, useEffect } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";

import { useCheckoutContext } from "./CheckoutContext";

import { useMemo } from "react";

import { DatePicker } from "@/components/ui/datepicker";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// import { OpenAI } from 'openai';

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, dangerouslyAllowBrowser: true });

type TikTokUser = {
  id: number;
  created_at: string;
  tiktoktid: string;
  username: string;
  embedding: string;
  gpt_bio: string;
  country: string;
  language: string;
  bio: string;
  instagram_link: string | null;
  youtube_link: string | null;
  bio_link: string | null;
  following_count: number;
  follower_count: number;
  likes_count: number;
  video_count: number;
  short_form_engagement_ratio: number;
  short_form_avg_video_viewcount: number;
  engagement_ratio: number;
  email: string;
  nickname: string;
  similarity: number;
  last_exported_to_airtable: Date;
  platform: string;
  long_form_engagement_ratio: number;
  long_form_avg_video_viewcount: number;
};

export type { TikTokUser };

export default function DataTable() {
  const [globalFilter, setGlobalFilter] = useState("");
  const [containsSearch, setContainsSearch] = useState("");
  const [lastUpdateStatsData, setLastUpdateStatsData] = useState<any>({
    id: null,
    status: null,
    last_update: null,
    isLoading: false,
  });

  const {
    data,
    setData,
    isLoading,
    setIsLoading,
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    searchQuery,
    setSearchQuery,
    itemsPerPage,
    setItemsPerPage,
    currentPage,
    setCurrentPage,
    rowSelection,
    setRowSelection,
    similarityThreshold,
    setSimilarityThreshold,
    includeEmail,
    setIncludeEmail,
    minFollowers,
    setMinFollowers,
    maxFollowers,
    setMaxFollowers,
    checkOut,
    setCheckOut,
    minEngagementRate,
    setMinEngagementRate,
    minAvgViews,
    setMinAvgViews,
    totalCount,
    setTotalCount,
    lastExportDate,
    setLastExportDate,
    selectedPlatform,
    setSelectedPlatform,
    accessToken
  } = useCheckoutContext();


  // @ts-ignore
  // @ts-ignore
  const columns: ColumnDef<TikTokUser>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value);
            if (!value) {
              setCheckOut((prevCheckOut) =>
                prevCheckOut.filter(
                  (user) =>
                    !table
                      .getSelectedRowModel()
                      .flatRows.some(
                        (row) => user.username === row.original.username
                      )
                )
              );
            }
          }}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={
            row.getIsSelected() ||
            checkOut.some((user) => user.username === row.original.username)
          }
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);
            setCheckOut((prevCheckOut) =>
              prevCheckOut.filter(
                (user) => user.username !== row.original.username
              )
            );
          }}
        />
      ),
    },
    {
      accessorKey: "username",
      // header: "TikTok ID",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            TikTok ID
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const username = row.getValue("username");
        const platform = row.original.platform; // Assuming 'platform' is included in your data

        let profileUrl = "";
        if (platform === "Instagram") {
          profileUrl = `https://www.instagram.com/${username}/`;
        } else if (platform === "TikTok") {
          profileUrl = `https://www.tiktok.com/@${username}/`;
        } else if (platform === "YouTube") {
          profileUrl = `https://www.youtube.com/@${username}/`;
        }

        return profileUrl ? (
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {username}
          </a>
        ) : (
          username
        );
      },
    },
    {
      accessorKey: "bio",
      header: "GPT Bio",
      cell: ({ cell }) => (
        <div style={{ maxHeight: "100px", overflowY: "auto" }}>
          {cell.getValue() || "N/A"}
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ cell }) => cell.getValue() || "N/A",
    },
    {
      accessorKey: "follower_count",
      // header: "Follower Count",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Follower Count
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      accessorFn: (row) => {
        return row.follower_count ? row.follower_count.toLocaleString() : "N/A";
      },
    },
    {
      accessorKey: "short_form_avg_video_viewcount",
      // header: "Short Avg Video Viewcount",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Short Avg Video Viewcount
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      accessorFn: (row) => {
        return row.short_form_avg_video_viewcount
          ? row.short_form_avg_video_viewcount.toLocaleString()
          : "N/A";
      },
    },
    {
      accessorKey: "short_form_engagement_ratio",
      // header: "Short Engagement Ratio",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Short Engagement Ratio
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      accessorFn: (row) => {
        return row.short_form_engagement_ratio
          ? `${(row.short_form_engagement_ratio * 100).toFixed(2)}%`
          : "N/A";
      },
    },
    {
      accessorKey: "similarity",
      // header: "Similarity Score",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Similarity Score
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      accessorFn: (row) => {
        return row.similarity !== null && row.similarity !== undefined
          ? row.similarity.toFixed(2)
          : "N/A";
      },
    },
    {
      accessorKey: "last_exported_to_airtable",
      // header: "Last AirTable Export",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Last AirTable Export
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      accessorFn: (row) => {
        return row.last_exported_to_airtable !== null &&
          row.last_exported_to_airtable !== undefined
          ? new Date(row.last_exported_to_airtable).toLocaleDateString()
          : "N/A";
      },
    },
    {
      accessorKey: "long_form_avg_video_viewcount",
      // header: "Avg Long Form Views",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Avg Long Form Views
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const value = row.getValue("long_form_avg_video_viewcount");
        return value ? value.toLocaleString() : "N/A";
      },
    },
    {
      accessorKey: "long_form_engagement_ratio",
      // header: "Long Form Engagement Ratio",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Long Form Engagement Ratio
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => row.getValue("long_form_engagement_ratio") || "N/A",
    },
  ];

  const getNewSMA = async () => {
    setIsLoading(true);
    setRowSelection({});

    try {
      const response = await fetch("/api/get-new-sma", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          platform: selectedPlatform,
          hasEmail: includeEmail,
        }),
      });

      let data = await response.json();
      const newData = data.filter(
        (row: TikTokUser) =>
          !checkOut.some((user) => user.username === row.username)
      );
      setData(newData as TikTokUser[]);
    } catch (error) {
      console.error("Failed to fetch new sma:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchData = async (text: string) => {
    setIsLoading(true);
    setRowSelection({});

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: text,
          similarityThreshold: similarityThreshold,
          maxFollowers: maxFollowers ? parseInt(maxFollowers) : null,
          minFollowers: minFollowers ? parseInt(minFollowers) : null,
          hasEmail: includeEmail,
          minEngagementRate: minEngagementRate
            ? parseFloat(minEngagementRate) / 100
            : null,
          minAvgViews: minAvgViews ? parseInt(minAvgViews) : null,
          lastExportDate: lastExportDate ? lastExportDate.toISOString() : null,
          platform: selectedPlatform, // Add a state for platform selection
        }),
      });

      let data = await response.json();
      const newData = data.filter(
        (row: TikTokUser) =>
          !checkOut.some((user) => user.username === row.username)
      );
      setData(newData as TikTokUser[]);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLastUpdateStatsData = async () => {
    try {
      const response = await fetch("/api/last-update-stats", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      let data = await response.json();

      // Convert the string to a Date object
      const date = new Date(data?.last_update);

      // Format the date and time according to the user's locale and timezone
      const formattedDate = date.toLocaleString();

      setLastUpdateStatsData({
        id: data?.id,
        status: data?.status,
        last_update: formattedDate,
      });
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  useEffect(() => {
    table.setPageSize(itemsPerPage);
    if (searchQuery) {
      return;
    } else {
      // fetchAllData();
    }
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    fetchLastUpdateStatsData();
  }, []);

  const memoizedColumns = useMemo(() => columns, []);

  const table = useReactTable({
    data,
    columns: memoizedColumns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    rowCount: data.length,
  });

  const handleSelectAll = () => {
    const allRows = table.getFilteredRowModel().rows;
    const allRowIds = allRows.map((row) => row.id);

    // Update the row selection state
    setRowSelection((prev) => {
      const newSelection = { ...prev };
      allRowIds.forEach((id) => {
        newSelection[id] = true;
      });
      return newSelection;
    });

    // Add all rows to checkOut without duplicates
    setCheckOut((prevCheckOut) => {
      const newCheckOut = new Set([...prevCheckOut]);
      allRows.forEach((row) => {
        newCheckOut.add(row.original);
      });
      return Array.from(newCheckOut);
    });
  };

  useEffect(() => {
    if (Object.keys(rowSelection).length > 0) {
      const selectedRows = table
        .getFilteredSelectedRowModel()
        .rows.map((row) => row.original);
      setCheckOut((prevCheckOut) => {
        const uniqueCheckOut = new Set([...prevCheckOut, ...selectedRows]);
        return Array.from(uniqueCheckOut);
      });
    }
  }, [rowSelection, table]);

  const handleUpdateStats = async () => {
    try {
      const response = await fetch(
        "https://update-influencer-stats-150256092251.us-central1.run.app",
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleUpdateLastUpdateStatus = async () => {
    try {
      setLastUpdateStatsData({
        ...lastUpdateStatsData,
        isLoading: true,
      });
      const response = await fetch("/api/update-last-update-status", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: lastUpdateStatsData.id, // Pass the id of the last_stats_update record
          status: "In progress", // Set the status to "in progress"
        }),
      });

      const result = await response.json();
      if (result) {
        setLastUpdateStatsData({
          ...lastUpdateStatsData,
          status: result?.status,
          isLoading: false,
        });
        handleUpdateStats();
      }
    } catch (error) {
      setLastUpdateStatsData({
        ...lastUpdateStatsData,
        isLoading: true,
      });
      console.error("Error updating status:", error);
    }
  };

  return (
    <div>
      <div className="flex-col">
        <div className="flex items-center py-4">
          <Input
            placeholder="Search..."
            value={searchQuery}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                // setSearchQuery(event.target.value);
                fetchData(searchQuery);
              }
            }}
            onChange={(event) => {
              setSearchQuery(event.target.value);
            }}
            className="mr-4"
          />
          <Button
            onClick={(e) => {
              console.log(searchQuery);
              fetchData(searchQuery);
            }}
          >
            Search
          </Button>
          <Button className="m-8" onClick={(e) => getNewSMA()}>
            Most Recent Added
          </Button>
        </div>
      </div>

      <div className="flex w-full justify-end">
        <div className="flex items-center mx-8 relative group">
          <Button onClick={handleUpdateLastUpdateStatus}>
            Update Stats
            {lastUpdateStatsData?.isLoading && (
              <div className="ml-2 animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
            )}
          </Button>

          {/* Loading Spinner */}

          {/* Tooltip */}
          <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col p-2 bg-gray-700 text-white rounded-md text-sm">
            <span>Last Update: {lastUpdateStatsData?.last_update || ""}</span>
            <span>Status: {lastUpdateStatsData?.status || ""}</span>
          </div>
        </div>
      </div>

      <Accordion type="single" collapsible className="p-1 w-full">
        <AccordionItem value="filters">
          <AccordionTrigger className="text-lg font-semibold">
            Filters
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Followers Group */}
              <div className="space-y-4">
                <h3 className="text-md font-medium">Followers</h3>
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <Label htmlFor="minFollowers" className="text-sm">
                      Min
                    </Label>
                    <Input
                      id="minFollowers"
                      type="number"
                      value={minFollowers}
                      onChange={(e) => setMinFollowers(e.target.value)}
                      className="w-full"
                      placeholder="0"
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="maxFollowers" className="text-sm">
                      Max
                    </Label>
                    <Input
                      id="maxFollowers"
                      type="number"
                      value={maxFollowers}
                      onChange={(e) => setMaxFollowers(e.target.value)}
                      className="w-full"
                      placeholder="∞"
                    />
                  </div>
                </div>

                {/* Platform Selection */}
                <div className="space-y-4">
                  <h3 className="text-md font-medium">Platform</h3>
                  <Select
                    onValueChange={(value) => setSelectedPlatform(value)}
                    value={selectedPlatform || undefined}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Instagram">Instagram</SelectItem>
                      <SelectItem value="TikTok">TikTok</SelectItem>
                      <SelectItem value="YouTube">YouTube</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Engagement Group */}
              <div className="space-y-4">
                <h3 className="text-md font-medium">Engagement</h3>
                <div className="space-y-2">
                  <Label htmlFor="minEngagementRate" className="text-sm">
                    Min Engagement Rate (%)
                  </Label>
                  <Input
                    id="minEngagementRate"
                    type="number"
                    value={minEngagementRate}
                    onChange={(e) => setMinEngagementRate(e.target.value)}
                    className="w-full"
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minAvgViews" className="text-sm">
                    Min Average Views
                  </Label>
                  <Input
                    id="minAvgViews"
                    type="number"
                    value={minAvgViews}
                    onChange={(e) => setMinAvgViews(e.target.value)}
                    className="w-full"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Other Filters Group */}
              <div className="space-y-4">
                <h3 className="text-md font-medium">Other Filters</h3>
                <div className="space-y-2">
                  <Label htmlFor="similarityScore" className="text-sm">
                    Similarity Score
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Slider
                      id="similarityScore"
                      value={[similarityThreshold]}
                      max={1}
                      step={0.01}
                      min={0}
                      onValueChange={(value) =>
                        setSimilarityThreshold(value[0])
                      }
                      className="flex-grow"
                    />
                    <span className="text-sm font-medium w-12 text-right">
                      {similarityThreshold.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="hasEmail" className="text-sm">
                    Has Email
                  </Label>
                  <Checkbox
                    id="hasEmail"
                    checked={includeEmail}
                    onCheckedChange={(checked) => {
                      if (checked === true || checked === false) {
                        setIncludeEmail(checked);
                      }
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastExportDate" className="text-sm">
                    Last Exported Before
                  </Label>
                  <DatePicker
                    date={lastExportDate}
                    setDate={setLastExportDate}
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  // Reset all filters to their default values
                  setMinFollowers("");
                  setMaxFollowers("");
                  setMinEngagementRate("");
                  setMinAvgViews("");
                  setSimilarityThreshold(0.3);
                  setIncludeEmail(true);
                  setLastExportDate(null);
                }}
              >
                Clear All Filters
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex items-center justify-between py-4 ">
        <div>
          <span>Page</span>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </strong>
        </div>

        <div className="text-lg text-gray-700 font-bold space-x-4">
          {checkOut.length > 0 && <span>{checkOut.length} Selected</span>}
          {data.length > 0 && <span>{data.length} results</span>}
        </div>

        <div className="flex items-center space-x-4">
          <Button
            onClick={() => handleSelectAll()}
            className="ml-2 bg-blue-500 hover:bg-blue-600 text-white"
          >
            Select All
          </Button>

          <Button
            variant="outline"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>

      <div className="rounded-md border mt-10">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24">
                  <Skeleton className="h-full w-full" />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
    </div>
  );
}
