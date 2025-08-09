import { useQuery } from '@tanstack/react-query';
import { Edit, MapPin, Trash2 } from 'lucide-react';
import { getDetailTheatersApi } from '../../../services/cinema.api';
import { useEffect, useState } from 'react';

export default function Theater(props) {
    const { theater } = props;
    const [ totalTheater, setTotalTheater ] = useState(0);
    const [ addressTheater, setAddressTheater ] = useState();

    const { data: theaterDetail, isLoading } = useQuery({
        queryKey: ['theater-detail'],
        queryFn: () => getDetailTheatersApi(theater.maHeThongRap)
    })

    useEffect(() => {
        if (!theaterDetail || theaterDetail.length === 0) return;
        let total = 0;
        let address = theaterDetail.map((item) => item.diaChi).join(', ');
        theaterDetail.forEach(cinema => {
            total = cinema.danhSachRap?.length || 0;
        });
        setTotalTheater(total);
        setAddressTheater(address);
    }, [theaterDetail])

    console.log(theaterDetail)
    return (
        <div
            key={theater.maHeThongRap}
            className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
            <p className="text-center mb-2"><img className="mx-auto" src={theater.logo} width={60} height={60} alt={theater.tenHeThongRap} /></p>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                    {theater.tenHeThongRap}
                </h3>
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                        theater.status === "Hoạt động"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                    }`}
                >
                    {theater.status}
                </span>
            </div>

            <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-600 flex items-center">
                    <MapPin size={16} className="mr-2" />
                    {theater.location} {addressTheater}
                </p>
                <p className="text-sm text-gray-600">
                    <strong>{totalTheater}</strong> phòng chiếu
                </p>
                <p className="text-sm text-gray-600">
                    <strong>{theater.seats}</strong> ghế ngồi
                </p>
            </div>

            <div className="flex sm:flex-row sm:items-center gap-2">
                <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 text-sm cursor-pointer">
                    Chi tiết
                </button>
                <button className="p-2 text-yellow-600 hover:bg-yellow-100 rounded cursor-pointer">
                    <Edit size={16} />
                </button>
                <button className="p-2 text-red-600 hover:bg-red-100 rounded cursor-pointer">
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    )
}
