import React from 'react';
import {
    DeleteOutline,
} from "@mui/icons-material";

const Hashtag = ({ place, hashtag, onDelete }) => {
    return (
      <li style={{
        backgroundColor: '#eeeeee',
        padding: '3px 6px',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        #{hashtag}
        <DeleteOutline 
          onClick={() => onDelete(place)} 
          style={{ cursor: 'pointer', marginLeft: '5px' }} 
        />
      </li>
    );
  };
export default Hashtag;
