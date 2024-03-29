import { Autocomplete, Button, IconButton } from '@mui/material'
import { useCallback, useContext, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { DEFAULT_PROFILE_PICTURE, DSAREA_LOGO } from '../../assets/png'
import { SearchSVG, ShoppingCartSVG } from '../../assets/svg'
import Styles from './styles.module.scss'
import { useSelector } from 'react-redux'
import { AuthContext } from '../../App'
import { iHeaderProps } from './index.interface'
import { DensityMedium } from '@mui/icons-material'

export default function HeaderComponent(props: iHeaderProps) {
  const { sideBar, setSideBar, onChangeHome, homePosition } = props
  const navigate = useNavigate()
  const location = useLocation()
  const { isSuper } = useContext(AuthContext)
  const { profile } = useSelector(({ user }: any) => user)
  const { classes } = useSelector(({ training }: any) => training)
  const { read: cartRead } = useSelector(({ cart }: any) => cart)

  const user = useMemo(() => {
    if (profile) {
      return profile
    }
    return undefined
  }, [profile])

  const token = useMemo(() => {
    const access_token = localStorage.getItem('token')
    return access_token
  }, [])

  const handleLoginWithGoogle = () => {
    const api: string = 'https://api.dsarea.com'
    // const api: string = 'http://localhost:5200'
    const googleLoginURL = `${api}/api/auth/login/google`
    localStorage.clear()
    window.open(googleLoginURL, "_self")
  }

  const onClickCart = () => {
    if (!token) {
      return handleLoginWithGoogle()
    }
    if (location.pathname === '/keranjang') {
      return
    }
    return navigate('/keranjang')
  }

  const onClickLink = (state: 'home' | 'online-training' | 'jasa' | 'tanya-kami') => {
    if (location.pathname === '/') {
      if (onChangeHome)
        onChangeHome(state)
    } else {
      navigate('/', { state })
    }
  }

  const MemoizedSearch = useCallback(() => {
    if (location.pathname.includes('profile') || location.pathname.includes('super')) {
      return (
        <div></div>
      )
    }
    return (
      <div className={ Styles.SearchInput }>
        <Autocomplete
          freeSolo
          id="free-solo-2-demo"
          disableClearable
          options={ classes }
          filterOptions={ (x: any) => x }
          getOptionLabel={ (option: any) => option.title }
          onChange={ (event, newValue: any) => {
            if (typeof newValue === 'string')
              navigate('/pelatihan?filter=' + newValue)
            else {
              navigate('/pelatihan/' + newValue._id)
            }
          } }
          renderInput={(params) => (
            <div ref={params.InputProps.ref}>
              <input type="text" placeholder='Mulai cari pelatihanmu' {...params.inputProps} />
            </div>
          )}
        />
        {/* <input placeholder='Mulai cari pelatihanmu' type="text" /> */}
        <IconButton disabled>
          <SearchSVG/>
        </IconButton>
      </div>
    )
  }, [location])

  const MemoizedOnProfileClick = useCallback(() => {
    if (isSuper) {
      if (!location.pathname.includes('super'))
        navigate('/super')
    } else {
      if (!location.pathname.includes('profile'))
        navigate('/profile/pelatihanku')
    }
  }, [isSuper])

  const MemoizedCart = useCallback(() => {
    if (isSuper) {
      return (
        <div/>
      )
    }
    return (
      <IconButton onClick={ onClickCart }>
        { !cartRead && (
          <div/>
        ) }
        <ShoppingCartSVG/>
      </IconButton>
    )
  }, [isSuper, cartRead])

  const MemoizedProfile = useCallback(() => {
    if (Boolean(user)) {
      return (
        <img onClick={ MemoizedOnProfileClick } src={ Boolean(user?.picture) ? user.picture : DEFAULT_PROFILE_PICTURE } alt="PROFILE" className={ Styles.ProfilePicture }/>
      )
    }
    return (
      <Button onClick={ handleLoginWithGoogle } variant="outlined" className={ Styles.HeaderLoginButton }>Masuk</Button>
    )
  }, [isSuper, user, MemoizedOnProfileClick])

  return (
    <nav className={ Styles.Header }>
      <div className={ Styles.Control }>
        <IconButton onClick={ () => setSideBar ? setSideBar((prev: number) => Boolean(prev) ? 0 : 1) : null } className={ `${ Styles.More } ${ !location.pathname.includes('profile') && Styles.None }` }>
          <DensityMedium/>
        </IconButton>
        <img onClick={ () => navigate('/') } className={ `${ Styles.HeaderLogoImage } ${ typeof sideBar === 'number' && location.pathname.includes('profile') && Styles.Pushed }` } src={ DSAREA_LOGO } alt="DSAREA_LOGO" />
        <div className={ Styles.HeaderGrid }>
          <a className={ `${ Styles.HeaderLink } ${ Styles.Home } ${ homePosition === 'home' && Styles.Bold }` } onClick={ () => onClickLink('home') }>Home</a>
          <a className={ `${ Styles.HeaderLink } ${ Styles.Training } ${ homePosition === 'online-training' && Styles.Bold }` } onClick={ () => onClickLink('online-training') }>Online Training</a>
          <a className={ `${ Styles.HeaderLink } ${ Styles.Service } ${ homePosition === 'jasa' && Styles.Bold }` } onClick={ () => onClickLink('jasa') }>Jasa</a>
          <a className={ `${ Styles.HeaderLink } ${ Styles.Ask } ${ homePosition === 'tanya-kami' && Styles.Bold }` } onClick={ () => onClickLink('tanya-kami') }>Tanya Kami</a>
        </div>
      </div>
      <div className={ Styles.Control }>
        <MemoizedSearch/>
        <MemoizedCart/>
        <MemoizedProfile/>
      </div>
    </nav>
  )
}
