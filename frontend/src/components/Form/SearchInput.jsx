import React from "react";
import { useSearch } from "../../context/Search";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SearchInput = () => {
  const [values, setValues] = useSearch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get(
        `/api/v1/product/search/${values.keyword}`
      );
      setValues({ ...values, results: data });
      navigate("/search");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <form class="flex items-center max-w-sm mx-auto" onSubmit={handleSubmit}>
      <div class=" ">
          <input
            type="text"
            id="simple-search"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  ps-3 p-2.5 "
            placeholder="Search Products..."
            value={values.keyword}
            onChange={(e) => setValues({...values, keyword: e.target.value})}
            required
          />
        </div>
        <button
          type="submit"
          class="p-2.5 ms-2 text-sm font-medium text-white rounded-lg border bg-[#229622] hover:bg-[#267626] "
        >
          <svg
            class="w-4 h-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
          <span class="sr-only">Search</span>
        </button>
      </form>

    
    </div>
  );
};

export default SearchInput;
