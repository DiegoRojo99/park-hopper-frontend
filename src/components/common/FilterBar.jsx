import TextField from '@mui/material/TextField';

export default function FilterBar({name, searchName, placeholder}){
  return (
    <div className='filter-bar'>
      <TextField 
        id="outlined-basic" 
        label="Name" 
        placeholder={placeholder ?? 'Search...'}
        value={name}
        onChange={(event) => { searchName(event.target.value)}}
        focused
        sx={{ color: 'white', width: '100%' }}
      />
    </div>
  )
}