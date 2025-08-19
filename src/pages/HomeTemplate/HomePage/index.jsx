import { useState } from "react";
import BookingModal from "../_components/BookingModal/BookingModal";
import ListMoviePage from "../ListMoviePage";
import Mainvisual from "./Mainvisual";
import { useOutletContext } from "react-router-dom";

export default function HomePage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const { refetchBookingHistory } = useOutletContext();
    return (
        <main>
            {/* Mainvisual */}
            <Mainvisual 
                setIsModalOpen={setIsModalOpen}
                setSelectedMovie={setSelectedMovie}
                cinemaDetail={selectedMovie?.cinemaDetail}
            />
            {/* Banner */}
            {/* List film */}
            <ListMoviePage 
                setIsModalOpen={setIsModalOpen}
                setSelectedMovie={setSelectedMovie} 
                cinemaDetail={selectedMovie?.cinemaDetail}
            />
            {/* Modal booking */}
            {isModalOpen && (
                <BookingModal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                    movie={selectedMovie}
                    cinemaDetail={selectedMovie?.cinemaDetail}
                    refetchBookingHistory={refetchBookingHistory}
                />
            )}
        </main>
  )
}
