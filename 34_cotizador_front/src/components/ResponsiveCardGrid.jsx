import React, { useState } from "react";

export const ResponsiveCardGrid = ({
  cards,
  cardsPerPage,
  CardComponent,
  PaginationComponent,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCards, setFilteredCards] = useState(cards);

  React.useEffect(() => {
    const results = cards.filter(
      (card) =>
        card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCards(results);
    setCurrentPage(1);
  }, [searchTerm, cards]);

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredCards.slice(indexOfFirstCard, indexOfLastCard);

  const totalPages = Math.ceil(filteredCards.length / cardsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  return (
    <div className="container mx-auto px-4">
      <SearchBar searchTerm={searchTerm} onSearchChange={handleSearchChange} />
      {filteredCards.length === 0 ? (
        <p className="text-center text-gray-500 my-8">
          No se encontraron resultados para tu búsqueda.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {currentCards.map((card, index) => (
              <CardComponent key={index} {...card} />
            ))}
          </div>

          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

const SearchBar = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="mb-6">
      <label htmlFor="search" className="sr-only">
        Buscar
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <input
          type="text"
          name="search"
          id="search"
          className="block w-full md:w-[320px] pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-center items-center space-x-2">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
        <button
          key={pageNumber}
          onClick={() => onPageChange(pageNumber)}
          className={`px-3 py-1 rounded-lg ${
            currentPage === pageNumber
              ? "bg-[#1e40af] text-white font-semibold"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {pageNumber}
        </button>
      ))}
    </div>
  );
};
