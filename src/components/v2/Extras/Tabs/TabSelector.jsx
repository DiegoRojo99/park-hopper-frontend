import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

export default function TabSelector({tabs, changeTab}) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    changeTab(tabs[newValue])
  };

  return (
    <div style={{marginLeft: '2.5%'}}>
      <Box sx={{ bgcolor: 'background.paper' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
        >
          {tabs?.map(t => <Tab label={t} />)}
        </Tabs>
      </Box>
    </div>
  );
}
