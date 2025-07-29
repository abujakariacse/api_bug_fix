const ForumPagination = ({ page, totalPages, setPage }) => {
  return (
    <div className="flex justify-center mt-8">
      <button
        onClick={() => setPage((old) => old - 1)}
        disabled={page === 1}
        className="px-4 py-2 mx-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition-colors"
      >
        Previous
      </button>

      <span className="px-4 py-2 mx-1 bg-gray-200 rounded">
        Page {page} of {totalPages}
      </span>

      <button
        onClick={() => setPage((old) => old + 1)}
        disabled={page >= totalPages}
        className="px-4 py-2 mx-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition-colors"
      >
        Next
      </button>
    </div>
  );
};

export default ForumPagination;
