import { MapPin, X } from 'lucide-react';
import React from 'react'

const TheaterDetailModal = ({ isOpen, onClose, theater, theaterDetail, seatsByRoom }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div
                onClick={onClose}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
            />

            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative bg-white rounded-lg max-w-2xl w-full max-h-[600px] overflow-hidden">
                    <div className="flex items-center justify-between p-4 border-b">
                        <h3 className="text-lg font-semibold">{theater.tenHeThongRap} - Tất cả cụm rạp</h3>
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-gray-100 rounded"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    <div className="p-4 overflow-y-auto max-h-[520px]">
                        <div className="space-y-3">
                            {theaterDetail?.map((item) => (
                                <div
                                    key={item.maCumRap}
                                    className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg"
                                >
                                    <div className="flex items-center mb-2">
                                        <MapPin size={16} className="mr-2 shrink-0" />
                                        <span>
                                            <strong>{item.tenCumRap}</strong><br />
                                            {item.diaChi}<br />
                                            Phòng chiếu: {item.danhSachRap.length} phòng
                                        </span>
                                    </div>
                                    {/* danh sách từng phòng + số ghế */}
                                    <ul className="pl-6 list-disc">
                                        {item.danhSachRap.map((room) => (
                                            <li key={room.maRap}>
                                                {room.tenRap} - {seatsByRoom[room.tenRap] || '...'} ghế
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default TheaterDetailModal;