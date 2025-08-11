import { Clock, Edit, Eye, Trash2 } from 'lucide-react';
import React from 'react'

export default function Showtime(props) {
    const { showtime } = props;
    return (
        <tr
            key={showtime.maHeThongRap}
            className="border-b border-gray-100 hover:bg-gray-50"
        >
            <td className="py-3 px-4 sm:py-4 sm:px-6">
                <div className="font-medium text-gray-800">
                    {showtime.movie}
                </div>
            </td>
            <td className="py-3 px-4 sm:py-4 sm:px-6 text-gray-600">
                {showtime.theater}
            </td>
            <td className="py-3 px-4 sm:py-4 sm:px-6 text-gray-600">
                {showtime.room}
            </td>
            <td className="py-3 px-4 sm:py-4 sm:px-6">
                <div className="text-gray-800">
                    <div className="font-medium">
                        {showtime.date}
                    </div>
                    <div className="text-sm text-gray-600 flex items-center">
                        <Clock
                            size={14}
                            className="mr-1"
                        />
                        {showtime.time}
                    </div>
                </div>
            </td>
            <td className="py-3 px-4 sm:py-4 sm:px-6 text-gray-600 font-medium">
            </td>
            <td className="py-3 px-4 sm:py-4 sm:px-6">
                <div className="text-sm">
                    <span
                        className={`font-medium ${showtime.availableSeats < 20
                                ? "text-red-600"
                                : "text-green-600"
                            }`}
                    >
                        {showtime.availableSeats}
                    </span>
                    <span className="text-gray-500">
                        /{showtime.totalSeats}
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div
                        className={`h-2 rounded-full ${showtime.availableSeats < 20
                                ? "bg-red-500"
                                : "bg-green-500"
                            }`}
                        style={{
                            width: `${(showtime.availableSeats /
                                    showtime.totalSeats) *
                                100
                                }%`,
                        }}
                    ></div>
                </div>
            </td>
            <td className="py-3 px-4 sm:py-4 sm:px-6">
                <div className="flex items-center space-x-2">
                    <button className="p-1 text-blue-600 hover:bg-blue-100 rounded cursor-pointer">
                        <Eye size={16} />
                    </button>
                    <button className="p-1 text-yellow-600 hover:bg-yellow-100 rounded cursor-pointer">
                        <Edit size={16} />
                    </button>
                    <button className="p-1 text-red-600 hover:bg-red-100 rounded cursor-pointer">
                        <Trash2 size={16} />
                    </button>
                </div>
            </td>
        </tr>
    )
}
