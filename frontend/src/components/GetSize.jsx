import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showSize } from "../redux/features/sizeSlice";
import { showColor } from "../redux/features/colorSlice";


const SizesComponent = () => {
  const dispatch = useDispatch();

  // Use the correct state path
  const { sizeDetail, loading, error } = useSelector((state) => state.size);
  const { colorDetail} = useSelector((state) => state.color);


  useEffect(() => {
    dispatch(showSize());
    dispatch(showColor());
  }, [dispatch]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  // Ensure sizeDetail is an array before calling map
  return (
    <div>
      <ul>
        {Array.isArray(sizeDetail.data) && sizeDetail.data.length > 0 ? (
          sizeDetail.data.map((size) => (
            <li key={size._id}>{size.name}</li>
          ))
        ) : (
          <p>No sizes available</p> // Fallback if sizeDetail is not an array or empty
        )}
      </ul>
       <ul>
        {Array.isArray(colorDetail.data) && colorDetail.data.length > 0 ? (
          colorDetail.data.map((color) => (
            <li key={color._id}>{color.name}</li>
          ))
        ) : (
          <p>No sizes available</p> // Fallback if sizeDetail is not an array or empty
        )}
      </ul>
    </div>
  );
};

export default SizesComponent;
