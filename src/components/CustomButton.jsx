import { Button } from '@mui/material'

const CustomButton = ( { colors, text, handleClick } ) => (
  <Button
    sx={{
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