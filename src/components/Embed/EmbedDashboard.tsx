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
  const [dashboardNext, setDashboardNext] = React.useState(true)
  const [activeFilter, setActiveFilter] = React.useState('')
  const [activeFilterIndex, setActiveFilterIndex] = React.useState(0)
  const [running, setRunning] = React.useState(true)
  const [dashboard, setDashboard] = React.useState<LookerEmbedDashboard>()
  const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
  const filters = {0:'Login_Login',1:'FT_UPI',2:'FT_Mobile',3:'FT_MMID',4:'FT_Account',5:'FA_UPI'}


  React.useEffect(() => {
    var counter = 0
    const interval = setInterval(() => {
      counter += 1
      setActiveFilterIndex((counter)%4)
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    if (dashboard) {
      console.log(filters[activeFilterIndex])
      dashboard.updateFilters({'_carousel':filters[activeFilterIndex]})
      dashboard.run()
    }
  }, [activeFilterIndex]

  );


  const updateRunButton = (running: boolean) => {
    setRunning(running)
  }

  const setupDashboard = (dashboard: LookerEmbedDashboard) => {
    setDashboard(dashboard)
  }

  const embedCtrRef = useCallback(el => {
    const hostUrl = extensionContext?.extensionSDK?.lookerHostData?.hostUrl
    if (el && hostUrl) {
      el.innerHTML = ''
      LookerEmbedSDK.init(hostUrl)
      const db = LookerEmbedSDK.createDashboardWithId(4)
      // db.withNext()
      db.appendTo(el)
        .build()
        .connect()
        .then(setupDashboard)
        .catch((error: Error) => {
          console.error('Connection error', error)
        })
    }
  }, [])

  const runDashboard = () => {
    if (dashboard) {
      dashboard.run()
    }
  }

  // const getWeather = async () => {
  //   const weatherResponse = await fetch("https://api.openweathermap.org/data/2.5/onecall?lat=37&lon=-95.7&appid=c0e53eede95c45ac6f3682883ad37b65")
  //   if (weatherResponse.ok) {
  //     var x = await weatherResponse.json()
  //     var y = JSON.stringify(x["daily"])
  //     setWeather(y)
  //   }
  // }

  const send_ga360_filters = async (event: any) => {
    console.log({event,dashboard})
    if (dashboard){
      console.log(dashboard)
      // dashboard.run()
    }
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
      <EmbedContainer ref={embedCtrRef}/>
    </>
  )
}
