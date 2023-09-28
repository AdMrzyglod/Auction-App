import React from 'react';
import './auction-filters.css'
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};


export default function AuctionFilters({pattern,setPattern,selectedCategories,handleCategoryChange,categories}){


    return(
            <div className="filters">
              <div>
              <FormControl sx={{ m: 1, width: 300 }}>
                 <InputLabel id="label">Kategoria</InputLabel>
                 <Select
                    labelId="label"
                    multiple
                    input={<OutlinedInput label="Kategorie" />}
                    value={selectedCategories}
                    onChange={handleCategoryChange}
                    renderValue={(selected) => selected.join(', ')}
                    MenuProps={MenuProps}
                  >
                  {categories.map((category)=>(

                    <MenuItem key={category} value={category}>
                       <Checkbox checked={selectedCategories.indexOf(category) > -1} />
                       <ListItemText primary={category} />
                    </MenuItem>
                  ))}
                  </Select>
              </FormControl>
              </div>
              <div className="input-filter"> 
                 <label>Nazwa:</label>
                 <input type="text" value={pattern} onChange={(e) => setPattern(e.target.value)}/>
              </div>
            </div>
    )
}