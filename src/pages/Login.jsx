import { useNavigate } from 'react-router-dom'
import { Box, TextField, Button } from '@mui/material'
import { Formik } from 'formik'
import * as yup from 'yup'
import { login } from '../api'

const Login = () => {
  const navigate = useNavigate()

  const validationSchema = yup.object().shape({
    tel: yup.string().required( 'required' ),
    password: yup.string().required( 'required' )
  })

  const initialValues = { tel: '', password: '' }

  const handleFormSubmit = e => {
    const {tel, password} = e
    login({tel, password})
      .then(res => {
        const {user, token} = res.data
        localStorage.setItem('userInfo', JSON.stringify(user))
        localStorage.setItem('token', token)
      })
      .then(() => {
        console.log('before')
        navigate('/')
        console.log('after')
      })
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}
    >
      <Formik
        initialValues={ initialValues }
        validationSchema={ validationSchema }
        onSubmit={ handleFormSubmit }
      > 
        { ( { values, errors, touched, handleBlur, handleChange, handleSubmit } ) => (
          <form onSubmit={ handleSubmit }>
            <Box
              display='flex'
              flexDirection='column'
              gap='30px'
            >
              <TextField
                type='text'
                variant='filled'
                label='手机号'
                name='tel'
                value={ values.tel }
                fullWidth
                helperText={ touched.tel && errors.tel }
                error={ !!touched.tel && !!errors.tel }
                onChange={ handleChange }
                onBlur={ handleBlur }
              />

              <TextField
                type='text'
                variant='filled'
                label='密码'
                name='password'
                value={ values.password }
                fullWidth
                helperText={ touched.password && errors.password }
                error={ !!touched.password && !!errors.password }
                onChange={ handleChange }
                onBlur={ handleBlur }
              />
            </Box>

            <Box display='flex' justifyContent='center' mt='20px'>
              <Button
                type='submit'
                variant='contained'
                color='secondary'
              >
                登录
              </Button>
            </Box>
          </form>
        ) }
      </Formik>
    </Box>
  )
}

export default Login