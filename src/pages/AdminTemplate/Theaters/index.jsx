import { useQuery } from '@tanstack/react-query';
import { MapPin, PlusCircle, Edit, Trash2,} from 'lucide-react';
import { getDetailTheatersApi, getListTheatersApi } from '../../../services/cinema.api';
import Theater from './Theater';
import { useEffect, useState } from 'react';

export default function TheatersPage() {
    const { data: mockTheaters, isLoading } = useQuery({
        queryKey: ['list-theaters'],
        queryFn: () => getListTheatersApi()
    })

    // useEffect(() => {
    //     const fetchTotalTheaters = async () => {
    //         if(!mockTheaters || mockTheaters.length === 0) return ;
    //         let total = 0;
    //         for(const theater of mockTheaters) {
    //             const lstCinema = await getDetailTheatersApi(theater.maHeThongRap);
    //             lstCinema.forEach(cinema => {
    //                 total += cinema.danhSachRap?.length || 0;
    //             });
    //         }
    //         setTotalTheater(total);
    //     };
    //     fetchTotalTheaters();
    // }, [mockTheaters])

    const renderTheaters = () => {
        if (isLoading) return null;
        if(mockTheaters.length > 0) {
            return mockTheaters.map((theater) => {
                return <Theater 
                    key={theater.maHeThongRap}
                    theater={theater}
                    // totalTheater={totalTheater}
                />
            })
        }
    }
    
    return (
        <div className="px-4 py-4 sm:px-6 sm:py-6">
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Hệ thống rạp
                    </h1>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center cursor-pointer">
                        <PlusCircle size={20} className="mr-2" />
                        Thêm rạp chiếu
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {renderTheaters()}
            </div>
        </div>
    );
}
