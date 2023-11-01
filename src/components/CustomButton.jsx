import { Button } from '@mui/material'

const CustomButton = ( { colors, text, height, handleClick } ) => (
  <Button
    sx={{
      height,
      color: colors.grey[100],
      backgroundColor: colors.greenAccent[700],
      '&.MuiButtonBase-root:hover': { background: colors.greenAccent[600] }
    }}
    onClick={ handleClick }
  >
    { text }
  </Button>
)

export default CustomButton