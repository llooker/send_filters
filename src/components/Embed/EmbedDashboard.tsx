import React, { useCallback, useContext, useEffect } from "react"
import { EmbedProps } from "./types"
import { LookerEmbedSDK, LookerEmbedDashboard } from '@looker/embed-sdk'
import {
  ExtensionContext,
  ExtensionContextData,
} from "@looker/extension-sdk-react"
import { Button, Heading, Label, ToggleSwitch } from "@looker/components"
import { SandboxStatus } from '../SandboxStatus'
import { EmbedContainer } from './components/EmbedContainer'

export const EmbedDashboard: React.FC<EmbedProps> = () => {
  const [filterState, setFilterState] = React.useState()
  const [dashboard, setDashboard] = React.useState<LookerEmbedDashboard>()
  const extensionContext = useContext<ExtensionContextData>(ExtensionContext)

  const hostUrl = extensionContext?.extensionSDK?.lookerHostData?.hostUrl
  LookerEmbedSDK.init(hostUrl)
  const db = LookerEmbedSDK.createDashboardWithId(4)

  React.useEffect(()=>{console.log('loaded')}, []);





  const setupDashboard = (dashboard: LookerEmbedDashboard) => {
    setDashboard(dashboard)
  }

  const mangageFilterState = (event: any) => {
    setFilterState(event.dashboard.dashboard_filters)
  }

  const embedCtrRef = useCallback(el => {
    if (el && hostUrl) {
      el.innerHTML = ''
      db.appendTo(el)
      .on('dashboard:filters:changed',mangageFilterState)
        .build()
        .connect()
        .then(setupDashboard)
        .catch((error: Error) => {
          console.error('Connection error', error)
        })
    }
  }, [])



  // const getWeather = async () => {
  //   const weatherResponse = await fetch("https://api.openweathermap.org/data/2.5/onecall?lat=37&lon=-95.7&appid=c0e53eede95c45ac6f3682883ad37b65")
  //   if (weatherResponse.ok) {
  //     var x = await weatherResponse.json()
  //     var y = JSON.stringify(x["daily"])
  //     setWeather(y)
  //   }
  // }

  const send_ga360_filters = async (event: any) => {
    console.log(filterState)
    const pythonScriptResponse = await fetch('https://api.openweathermap.org/data/2.5/onecall?lat=37&lon=-95.7&appid=c0e53eede95c45ac6f3682883ad37b65')
    if(pythonScriptResponse.ok) {
      var x = await pythonScriptResponse.json()
        console.log(x)        
    }
    
    // console.log({event,dashboard})
    // document.getElementById('foo')

    // if (dashboard){
    //   console.log(dashboard)
    //   // dashboard.run()
    // }
  }
      // const weatherResponse = await fetch("https://api.openweathermap.org/data/2.5/onecall?lat=37&lon=-95.7&appid=c0e53eede95c45ac6f3682883ad37b65")
    // if (weatherResponse.ok) {
    //   var x = await weatherResponse.json()
    //   var y = JSON.stringify(x["daily"])
    //   setWeather(y)


  // const filtersChanged = (event: any) => {
  //   console.log({event,dashboard})
  //   if (dashboard){
  //     console.log(dashboard)
  //     dashboard.run()
  //   }
  // }

  return (
    <>
      {/* <Button></Button> */}
      <Button m='medium' onClick={send_ga360_filters} >Create Audience</Button>
      {/* disabled={running} */}
      <EmbedContainer id='foo' ref={embedCtrRef}/>
    </> 
  )
}
