const Pagination = ({ itemsPerPage, totalItems, currentPage, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-center mt-8">
      <nav className="flex items-center gap-1">
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`px-3 py-1 rounded-md ${
              currentPage === number
                ? "bg-lime-500 text-gray-900 font-medium"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {number}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Pagination;
