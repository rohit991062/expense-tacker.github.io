import PropTypes from 'prop-types';

export default function Filter({ filterCategory, setFilterCategory, categories }) {
  return (
    <div className="mb-6 text-right">
      <label htmlFor="filter-category" className="mr-2 font-medium" id="filter-label">
        Filter by Category:
      </label>
      <select
        id="filter-category"
        aria-labelledby="filter-label"
        value={filterCategory}
        onChange={(e) => setFilterCategory(e.target.value)}
        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        {categories.map((category, index) => (
          <option key={index} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
}

Filter.propTypes = {
  filterCategory: PropTypes.string.isRequired,
  setFilterCategory: PropTypes.func.isRequired,
  categories: PropTypes.arrayOf(PropTypes.string)
};

Filter.defaultProps = {
  categories: ['All', 'Food', 'Transport', 'Entertainment', 'Other']
};
