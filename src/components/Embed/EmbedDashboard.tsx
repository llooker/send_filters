import React, { useCallback, useContext, useEffect } from "react"
import { EmbedProps } from "./types"
import { LookerEmbedSDK, LookerEmbedDashboard } from '@looker/embed-sdk'
import {
  ExtensionContext,
  ExtensionContextData,
} from "@looker/extension-sdk-react"
import { Button, Heading, Label, ToggleSwitch, FieldText, Fieldset, Slider, } from "@looker/components"
import { SandboxStatus } from '../SandboxStatus'
import { EmbedContainer } from './components/EmbedContainer'
import { InputText } from '@looker/components'
import { background } from "styled-system"

export const EmbedDashboard: React.FC<EmbedProps> = () => {
  const [filterState, setFilterState] = React.useState()
  const [dashboard, setDashboard] = React.useState<LookerEmbedDashboard>()
  const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
  const [formState, setFormState] = React.useState({})

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

  const inputCapture = (t:any) => {console.log(t.target.value)}

  const send_ga360_filters = async (event: any) => {
    console.log(filterState)
    const pythonScriptResponse = await fetch('http://127.0.0.1:8080?'+'foo')
    if(pythonScriptResponse.ok) {
      var x = await pythonScriptResponse.json()
        console.log(x)  
    }
    
    // const xhr = new XMLHttpRequest();
    // xhr.open("POST", yourUrl, true);
    // xhr.setRequestHeader('Content-Type', 'application/json');
    // xhr.send(JSON.stringify({
    //     // value: value
    // }));


    // - A name for the audience
    // - A list of platforms to which we want to link the audience (can be one of 4 possible values)
    // - The platform IDs for linking
    // - The lookback period for audience definition (can be one of 3 possible values)
    // - The “membership duration” for audience definition
    // - The GA account ID 
    // - The GA web property ID
    // - The GA view ID (hardcoded select LOV)
    // - Some collection of filter logic
    // * at least one of 13 dimensions must be chosen
    // * each dimension can have multiple logical statements, consisting of a val


  }

const kewl = (e:any) => {console.log(e)}

const manageFormState = (id:string,value:any) => {
  // console.log({id,value})
  setFormState({...formState, [id]:value})
} 

const submit = (e:any) => {
  console.log(formState)
}


  return (
    <>
{/* 
/// fields we actually need in the UI:
// Name for the audience
// Brand (hardcoded list of brands) one and only one but "multibrand" will need to be a list member too
// DV360 Account (hardcoded list of brands)
// Google Ads Account (hardcoded list of brands)
// Optimize Account (hardcoded list of brands)
// plarform ids (multi-select minimum of one value)
// Lookback period (1 of 3 options) (7, 14, 30)
// Membership Duration (number between 1 and 540 inclusive) range slider? default to 45?
*/}
  <Fieldset legend="Create a New Audience">
  <FieldText label="New Audience Name" name="audience_name" onChange={(val)=>{manageFormState('audience_name',val.target.value)}} />
  <Slider label="foo" min={1} max={540} value={45} onChange={(val)=>{manageFormState('membership_duration',val.target.value)}} />
  <Button onClick={submit} > Submit </Button>
  </Fieldset>

      <EmbedContainer id='foo' ref={embedCtrRef} />
    </> 
  )
}
