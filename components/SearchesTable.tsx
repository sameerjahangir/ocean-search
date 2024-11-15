'use client';

import { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function SearchesTable({ searches }) {
    const [searchData, setSearchData] = useState(searches.map(search => ({
        ...search,
        is_search_active: search.is_search_active === '1' || search.is_search_active === true
    })));
    const [newSearchName, setNewSearchName] = useState('');

    const handleToggle = async (id, currentStatus) => {
        const newStatus = !currentStatus;
        try {
            const res = await fetch('/api/update-search-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, isactive: newStatus }),
            });
            if (res.ok) {
                setSearchData((prevData) =>
                    prevData.map((item) =>
                        item.id === id ? { ...item, is_search_active: newStatus } : item
                    )
                );
            } else {
                console.error('Failed to update status');
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleAddSearch = async (e) => {
        e.preventDefault();
        if (!newSearchName.trim()) return;

        try {
            const res = await fetch('/api/add-search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newSearchName }),
            });

            if (res.ok) {
                const response = await res.json();
                const newSearch = response.search;
                console.log("Name: ", newSearch.name);
                console.log(newSearch)
                setSearchData((prevData) => [{
                    id: newSearch.id,
                    name: newSearch.search_query, // Use search_query as the name
                    is_search_active: newSearch.isactive === '1', // Convert '1' to true
                    active: 0,
                    total: 0,
                    last_time_searched: newSearch.last_time_searched
                }, ...prevData]);
                setNewSearchName('');
            } else {
                console.error('Failed to add new search');
            }
        } catch (error) {
            console.error('Error adding new search:', error);
        }
    };

    return (
        <Card>
            <CardHeader>
                <h2 className="text-xl font-semibold">Searches</h2>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleAddSearch} className="mb-6 flex gap-4">
                    <Input
                        type="text"
                        value={newSearchName}
                        onChange={(e) => setNewSearchName(e.target.value)}
                        placeholder="Enter new search name"
                        className="flex-grow"
                    />
                    <Button type="submit">Add Search</Button>
                </form>
                <Table className="min-w-full divide-y divide-gray-200">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="px-6 py-3">Search Name</TableHead>
                            <TableHead className="px-6 py-3">Active Influencers</TableHead>
                            <TableHead className="px-6 py-3">Total Influencers</TableHead>
                            <TableHead className="px-6 py-3">Last Time Searched</TableHead>
                            <TableHead className="px-6 py-3">Is Active</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {searchData.map((search, idx) => (
                            <TableRow key={search.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <TableCell className="px-6 py-4">{search.name}</TableCell>
                                <TableCell className="px-6 py-4">{search.active}</TableCell>
                                <TableCell className="px-6 py-4">{search.total}</TableCell>
                                <TableCell className="px-6 py-4">
                                    {new Date(new Date(search.last_time_searched).toUTCString()).toLocaleString('en-US', {
                                        timeZone: 'America/Los_Angeles',
                                        year: 'numeric',
                                        month: 'numeric',
                                        day: 'numeric',
                                        hour: 'numeric',
                                        minute: 'numeric',
                                        second: 'numeric',
                                        hour12: true
                                    })}
                                </TableCell>
                                <TableCell className="px-6 py-4">
                                    <Switch
                                        checked={search.is_search_active}
                                        onCheckedChange={() => handleToggle(search.id, search.is_search_active)}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

export default SearchesTable;