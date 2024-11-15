"use client";
// CheckoutContext.tsx
import { createContext, useContext, useState, useEffect } from "react";
import { TikTokUser } from "./DataTable";
import { ColumnFiltersState, SortingState } from "@tanstack/react-table";

interface CheckoutContextType {
    checkOut: TikTokUser[];
    setCheckOut: React.Dispatch<React.SetStateAction<TikTokUser[]>>;
    data: TikTokUser[];
    setData: React.Dispatch<React.SetStateAction<TikTokUser[]>>;
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    sorting: SortingState;
    setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
    columnFilters: ColumnFiltersState;
    setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
    itemsPerPage: number;
    setItemsPerPage: React.Dispatch<React.SetStateAction<number>>;
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    rowSelection: {};
    setRowSelection: React.Dispatch<React.SetStateAction<{}>>;
    similarityThreshold: number;
    setSimilarityThreshold: React.Dispatch<React.SetStateAction<number>>;
    includeEmail: boolean;
    setIncludeEmail: React.Dispatch<React.SetStateAction<boolean>>;
    minFollowers: string;
    setMinFollowers: React.Dispatch<React.SetStateAction<string>>;
    maxFollowers: string;
    setMaxFollowers: React.Dispatch<React.SetStateAction<string>>;
    minEngagementRate: string;
    setMinEngagementRate: React.Dispatch<React.SetStateAction<string>>;
    minAvgViews: string;
    setMinAvgViews: React.Dispatch<React.SetStateAction<string>>;
    totalCount: number;
    setTotalCount: React.Dispatch<React.SetStateAction<number>>;
    lastExportDate: Date;
    setLastExportDate: React.Dispatch<React.SetStateAction<Date>>;
    selectedPlatform: any;
    setSelectedPlatform: React.Dispatch<React.SetStateAction<any>>;
    campaigns: any;
    setCampaigns: React.Dispatch<React.SetStateAction<any>>;
    selectedCampaign: any;
    setSelectedCampaign: React.Dispatch<React.SetStateAction<any>>;
    accessToken: any;
    setAccessToken: React.Dispatch<React.SetStateAction<any>>;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export const useCheckoutContext = () => {
    const context = useContext(CheckoutContext);
    if (!context) {
        throw new Error("useCheckoutContext must be used within a CheckoutProvider");
    }
    return context;
};

interface CheckoutProviderProps {
    children: React.ReactNode;
}

export const CheckoutProvider: React.FC<CheckoutProviderProps> = ({ children }) => {
    const [checkOut, setCheckOut] = useState<TikTokUser[]>([]);
    const [data, setData] = useState<TikTokUser[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [itemsPerPage, setItemsPerPage] = useState(100);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowSelection, setRowSelection] = useState({});
    const [similarityThreshold, setSimilarityThreshold] = useState(0.3);
    const [includeEmail, setIncludeEmail] = useState(true);
    const [minFollowers, setMinFollowers] = useState("");
    const [maxFollowers, setMaxFollowers] = useState("");
    const [minEngagementRate, setMinEngagementRate] = useState("");
    const [minAvgViews, setMinAvgViews] = useState("");
    const [totalCount, setTotalCount] = useState(0);
    const [lastExportDate, setLastExportDate] = useState<Date>();
    const [selectedPlatform, setSelectedPlatform] = useState('TikTok');
    const [campaigns, setCampaigns] = useState([]);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [accessToken, setAccessToken] = useState();

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (user) {
          const parsedUser = JSON.parse(user);
          setAccessToken(parsedUser.accessToken);
        }
      }, []);

    return (
        <CheckoutContext.Provider
            value={{
                checkOut,
                setCheckOut,
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
                campaigns,
                setCampaigns,
                selectedCampaign,
                setSelectedCampaign,
                accessToken,
                setAccessToken
            }}
        >
            {children}
        </CheckoutContext.Provider>
    );
};
