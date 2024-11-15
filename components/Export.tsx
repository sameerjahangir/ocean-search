import React, {useEffect, useState} from 'react';
import { Button } from "@/components/ui/button";
import { useCheckoutContext } from "@/components/CheckoutContext";
import Airtable from 'airtable';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { TikTokUser } from "@/components/DataTable";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

import {Label} from "@/components/ui/label";

import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";



const Export = () => {
    const {checkOut, searchQuery} = useCheckoutContext();
    const [open, setOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [typeOfExport, setTypeOfExport] = useState('Traditional');
    const [campaigns, setCampaigns] = useState([]);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const { toast } = useToast();

    useEffect(() => {
        if (!open) {
            return;
        }

        const getCampaigns = async () => {
            try {
                const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base('apprcshpBTs30wQS5');
                const records = await base('Campaign').select({
                    filterByFormula: `OR(
                    {(ALL) Status} = '🔴 Not Yet Started',
                    {(ALL) Status} = '🛠️ In Production',
                    {(ALL) Status} = '🚀 Active'
                )`
                }).all();

                // console.log(records)

                const campaignData = records.map(record => ({
                    id: record.id,
                    name: record.get('Campaign ID')
                }));

                // console.log(campaignData);

                setCampaigns(campaignData);
            } catch (error) {
                console.error('Error fetching campaigns:', error);
                toast({
                    title: "Error",
                    description: "Failed to fetch campaigns.",
                    variant: "destructive",
                });
            }
        };

        getCampaigns();
    }, [open]);
    
    const updateLastExportedDate = async (userIds: number []) => {

        try {
            const response = await fetch('/api/update-last-export-date', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userIds }),
            });

            if (!response.ok) {
                throw new Error('Failed to update last exported date');
            }

            console.log('Successfully updated last exported date for users');
        } catch (error) {
            console.error('Error updating last exported date:', error);
            toast({
                title: "Error",
                description: "Failed to update last exported date in the database.",
                variant: "destructive",
            });
        }
    };

    const exportToCSV = () => {

        // Get date of search
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const dateStr = `${year}-${month}-${day}`;

        // Get current search
        const search = searchQuery ? searchQuery : '';

        const file_name = search + '-' + dateStr + '.csv';

        const csv_data = checkOut.map(user => {

            if (user.platform === 'TikTok') {
                return {
                    URL: 'https://www.tiktok.com/@' + user.username,
                    Handle: user.username,
                    Email: user.email
                }
            } else if (user.platform === 'Instagram') {
                return {
                    URL: 'https://www.instagram.com/' + user.username,
                    Handle: user.username,
                    Email: user.email
                }
            } else if (user.platform === 'YouTube') {
                return {
                    URL: 'https://www.youtube.com/@' + user.username,
                    Handle: user.username,
                    Email: user.email
                }
            }
        })

        const csvContent = "data:text/csv;charset=utf-8," +
            "URL,Handle,Email\n" + csv_data.map(user => `"${user.URL}","${user.Handle}","${user.Email}"`).join("\n");
            // checkOut.map(user => `"${'https://www.tiktok.com/@' + user.username}","${user.username}","${user.email}"`).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", file_name);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    const uploadProspects = async (users: TikTokUser[], typeOfExport: string, campaignId) => {
        const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base('apprcshpBTs30wQS5');
        const chunkSize = 10; // Maximum number of records per request
        const totalChunks = Math.ceil(users.length / chunkSize);


        setIsUploading(true);
        setProgress(0);

        for (let i = 0; i < users.length; i += chunkSize) {
            const chunk = users.slice(i, i + chunkSize);

            const records = chunk.map((user) => {
                let platformUrl;
                let creatorProfileUrl;
                let link_to_platform;

                if (user.platform === "TikTok") {
                    // platformUrl = "https://v5.airtableusercontent.com/v3/u/31/31/1722240000000/ZhG-DqkiJacJE3uBgkl5BA/IgBeBATdHRnb8EmkLhgVf2KmuBlfiYYEK4iSJb2vyi6Re-Iw8XJK3cvtgSRNPfenfC-a2er7eJboWmK6JSQ3RScTzXPzzsuEp2GDSvkW7fovJU04T7uEUihEzKmOxxoVk96ZY-3FNBe6nggWoP0iZw/sxKXfxTL5sefi8OgnTugtNQcC_1m39hTljkjhAHaMp4";
                    link_to_platform = 'recpSD5xZx8UjeJ92';
                    creatorProfileUrl = `https://www.tiktok.com/@${user.username}/`;
                } else if (user.platform === "Instagram") {
                    // platformUrl = "https://v5.airtableusercontent.com/v3/u/31/31/1722240000000/j6W5Lu7m6SA3Cbqr30k9cA/jZX9Dg5qFfLADRkwr78rkiwru9pFgh5u8PkoJXedd4ADVwhWGuVD4P-e0O9e42i92sjYG2Qdg1TJzMdX8-O1hltbIyRktHOjfV8NH8HxBfONBzACUpsMUJXOaWt2IFCmEKFqCHa1I1-YcnpTBC2dBA/uZv9w6JSw20rWbqs-I6wuuToZ0QyaS_TE3AgEpP1lQI";
                    link_to_platform = 'recQms9ThhZsWiCTo'
                    creatorProfileUrl = `https://www.instagram.com/${user.username}/`;
                } else if (user.platform === "YouTube") {
                    // platformUrl = "https://v5.airtableusercontent.com/v3/u/31/31/1722240000000/j6W5Lu7m6SA3Cbqr30k9cA/jZX9Dg5qFfLADRkwr78rkiwru9pFgh5u8PkoJXedd4ADVwhWGuVD4P-e0O9e42i92sjYG2Qdg1TJzMdX8-O1hltbIyRktHOjfV8NH8HxBfONBzACUpsMUJXOaWt2IFCmEKFqCHa1I1-YcnpTBC2dBA/uZv9w6JSw20rWbqs-I6wuuToZ0QyaS_TE3AgEpP1lQI";
                    link_to_platform = 'reci2MgYa2AtkLyFq'
                    creatorProfileUrl = `https://www.youtube.com/@${user.username}/`;
                } else {
                    // Default case if platform is neither TikTok nor Instagram
                    creatorProfileUrl = "";
                }

                return {
                    fields: {
                        'Creator Profile URL': creatorProfileUrl,
                        'Link to Platform': [link_to_platform],
                        Name: user.nickname,
                        Email: user.email,
                        Followers: Number(user.follower_count) || 0,
                        'Avg Views': Number(user.short_form_avg_video_viewcount) || 0,
                        'Total Likes': Number(user.likes_count) || 0,
                        'Eng Rate': Number(user.short_form_engagement_ratio) || 0,
                        'Service Type': typeOfExport || 'Traditional',
                        'Campaign': campaignId ? [campaignId] : undefined,
                    },
                };
            });


            try {
                await base('Prospect').create(records);
                const currentChunk = Math.floor(i / chunkSize) + 1;
                setProgress(Math.round((currentChunk / totalChunks) * 100));
                console.log(`Successfully uploaded ${chunk.length} prospects.`);
            } catch (error) {
                console.error('Error uploading prospects:', error);
                toast({
                    title: "Error",
                    description: "An error occurred while uploading prospects.",
                    variant: "destructive",
                });
                return; // Stop uploading if an error occurs
            }
        }

        const userIds : number[] = users.map(user => user.id);

        console.log(userIds);

        await updateLastExportedDate(userIds);

        toast({
            title: "Success",
            description: "All prospects have been uploaded successfully.",
            variant: "success",
        });
    };

    const handleSubmit = () => {
        console.log(checkOut);
        if (selectedCampaign === null) {
            uploadProspects(checkOut, typeOfExport, null);
            setOpen(false);
        } else {
            console.log(selectedCampaign)
            uploadProspects(checkOut, typeOfExport, selectedCampaign);
            setOpen(false);
        }
    };


    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                        <Button>Export</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {/*<DropdownMenuItem onClick={openDialog}>Export to AirTable</DropdownMenuItem>*/}
                        <DialogTrigger asChild>
                            <DropdownMenuItem>
                                Export to AirTable
                            </DropdownMenuItem>
                        </DialogTrigger>
                        <DropdownMenuItem onClick={exportToCSV}>Export to CSV</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <DialogContent className="sm:max-w-[550px]">
                    <DialogHeader>
                        <DialogTitle>Export to Airtable</DialogTitle>
                        <DialogDescription>
                            Choose the export type and confirm to send {checkOut.length} prospects to Airtable.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="campaign" className="text-right">
                                Campaign
                            </Label>
                            <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select a campaign"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {campaigns.map((campaign) => (
                                        <SelectItem key={campaign.id} value={campaign.id}>
                                            {campaign.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid gap-6 py-4">

                        <div className="space-y-2">
                            <h4 className="font-medium leading-none">Export Type</h4>
                        </div>

                        <RadioGroup
                            defaultValue={typeOfExport}
                            onValueChange={(value) => setTypeOfExport(value)}
                        >
                            <div className="grid gap-4">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 mr-3 mt-1">
                                        <RadioGroupItem value="Traditional" id="traditional" className="h-5 w-5"/>
                                    </div>
                                    <div className="flex-grow">
                                        <Label htmlFor="traditional" className="font-medium">Traditional</Label>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Select influencers from a curated list. Clients choose, and we manage the
                                            campaign with a 20% fee.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 mr-3 mt-1">
                                        <RadioGroupItem value="View-Based" id="view-based" className="h-5 w-5"/>
                                    </div>
                                    <div className="flex-grow">
                                        <Label htmlFor="view-based" className="font-medium">View-Based</Label>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Commit to a total view count (e.g., 2M views for $50k). We find and manage
                                            influencers to achieve this goal, optimizing for profit.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </RadioGroup>

                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        {/*<Button onClick={getCampaigns}></Button>*/}
                        <Button onClick={handleSubmit}>Send to Airtable</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {isUploading && (
                <div className="mt-4">
                    <Progress value={progress} className="w-[60%]"/>
                    <p className="text-sm text-gray-500 mt-2">
                        {progress === 100 ? 'Upload complete!' : `Uploading: ${progress}%`}
                    </p>
                </div>
            )}

        </>
    );
};

export default Export;
