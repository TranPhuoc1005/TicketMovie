import { MapPin, X } from 'lucide-react';
import React from 'react'

export default function TheaterDetailModal(props) {
    const { theater, theaterDetail, setShowModal } = props;
    return (
        <div className="fixed flex inset-0 bg-black/60 backdrop-blur-sm z-50 items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[600px] overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="text-lg font-semibold">{theater.tenHeThongRap} - Tất cả cụm rạp</h3>
                    <button
                        onClick={() => setShowModal(false)}
                        className="p-1 hover:bg-gray-100 rounded"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="p-4 overflow-y-auto max-h-[520px]">
                    <div className="space-y-3">
                        {theaterDetail?.map((item) => (
                            <p key={item.maCumRap} className="text-sm text-gray-600 flex items-center p-3 bg-gray-50 rounded-lg">
                                <MapPin size={16} className="mr-2 shrink-0" />
                                <span>
                                    <strong>{item.tenCumRap}</strong><br />
                                    {item.diaChi}<br />
                                    Phòng chiếu: {item.danhSachRap.length}
                                </span>
                            </p>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
