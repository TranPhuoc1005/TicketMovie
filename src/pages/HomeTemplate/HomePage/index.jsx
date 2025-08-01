import { useState } from "react";
import BookingModal from "../_components/BookingModal/BookingModal";
import ListMoviePage from "../ListMoviePage";
import Banner from "./Banner";
import Mainvisual from "./Mainvisual";

export default function HomePage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);
    return (
        <main>
            {/* Mainvisual */}
            <Mainvisual />
            {/* Banner */}
            <Banner />
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
                />
            )}
        </main>
  )
}
