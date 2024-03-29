// Style imports
/* eslint-disable import/no-unassigned-import */
import '../scss/reset.scss'
import '../scss/lib.scss'
import '../scss/app.scss'
/* eslint-enable */





// Module imports
import { library as faLibrary, config as faConfig } from '@fortawesome/fontawesome-svg-core'
import { Provider } from 'react-redux'
import NextApp from 'next/app'
import LocalForage from 'localforage'
import React from 'react'
import withRedux from 'next-redux-wrapper'





// Component imports
import { initStore } from '../store'
import * as fasIcons from '../helpers/fasIconLibrary'
import * as fabIcons from '../helpers/fabIconLibrary'
import * as farIcons from '../helpers/farIconLibrary'
import AppLayout from '../components/AppLayout'





// Configure and populate FontAwesome library
faConfig.autoAddCss = false
faLibrary.add(fasIcons)
faLibrary.add(fabIcons)
faLibrary.add(farIcons)





@withRedux(initStore)
class App extends NextApp {
  constructor (props) {
    super(props)

    LocalForage.config({
      name: 'Daitaya',
      storeName: 'webStore',
    })
  }

  static getInitialProps (appProps) {
    return AppLayout.getInitialProps(appProps)
  }

  render () {
    const {
      store,
      ...layoutProps
    } = this.props

    return (
      <Provider store={store}>
        <AppLayout {...layoutProps} />
      </Provider>
    )
  }
}





export default App
