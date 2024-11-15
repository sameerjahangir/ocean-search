// components/SelectedPeopleView.tsx
import { useCheckoutContext } from "./CheckoutContext";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function SelectedPeopleView() {
    const { checkOut, setCheckOut } = useCheckoutContext();
    const nFormat = new Intl.NumberFormat(undefined, {minimumFractionDigits: 0});

    const handleRemove = (username: string) => {
        setCheckOut((prevCheckOut) =>
            prevCheckOut.filter((user) => user.username !== username)
        );
    };

    return (
        <div>
            <div className="flex items-center justify-center bg-white p-4">
                <h1 className="text-2xl font-semibold">
                    {checkOut.length} {checkOut.length === 1 ? "prospect" : "prospects"} selected
                </h1>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {checkOut.map((user) => (
                    <div key={user.username}
                         className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col justify-between">
                        <div>
                            <div className="flex items-center p-4">
                                {/*<div className="flex-shrink-0">*/}
                                {/*    <Image*/}
                                {/*        width={64}*/}
                                {/*        height={64}*/}
                                {/*        className="h-16 w-16 rounded-full"*/}
                                {/*        src={`https://avatars.dicebear.com/api/identicon/${user.tiktokuniqueid}.svg`}*/}
                                {/*        alt={`${user.tiktokuniqueid} avatar`}*/}
                                {/*    />*/}
                                {/*</div>*/}
                                <div className="">
                                    <h2 className="text-xl font-semibold">{user.username}</h2>
                                </div>
                            </div>
                            <div className="px-4 py-2">
                                <p className="text-gray-700"><b>Email:</b> {user.email}</p>
                                <p className="text-gray-700"><b>Followers:</b> { nFormat.format(user.follower_count) }</p>
                                {/*<p className="text-gray-700 mt-2"><b>Bio:</b> {user.gpt_bio}</p>*/}
                            </div>
                        </div>
                        <div className="px-4 pb-4">
                            <button
                                className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                                onClick={() => handleRemove(user.username)}
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}